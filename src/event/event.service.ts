import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { axiosInstance } from 'src/interceptor/axiosInstance';
import { DISCORD_BASE_URL, DISCORD_BOT_TOKEN } from 'src/lib/constant';
import { errorToString } from 'src/lib/methods';
import { uuidv7 } from 'uuidv7';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventDto } from './dto/find-event.dto';
import { SettleEventDto } from './dto/settle-event.dto';
import {
  DiscordScheduledEvent,
  EventSchema,
  ScheduledEventEntityType,
} from './entities/event.entity';
import { DeleteEventDto } from './dto/delete-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const response = await axiosInstance.post(
        `${DISCORD_BASE_URL}/guilds/${createEventDto.guildId}/scheduled-events`,
        {
          channel_id: createEventDto.channelId,
          name: createEventDto.name,
          privacy_level: 2,
          scheduled_start_time: new Date(createEventDto.scheduledStartTime),
          description: createEventDto.description,
          image: createEventDto.imageUrl,
          entity_type: Number(createEventDto.entityType),
        },
        { headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` } },
      );

      const eventData: DiscordScheduledEvent = response.data;

      // Put event in database
      await this.knex('event').insert({
        id: uuidv7(),
        guildId: eventData.guild_id,
        name: eventData.name,
        creatorId: createEventDto.creatorId,
        scheduledStartTime: new Date(eventData.scheduled_start_time)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        eventId: eventData.id,
        channelId: eventData.channel_id,
        description: eventData.description,
        imageUrl: eventData.image,
        entityType: eventData.entity_type,
        tags: createEventDto.tags,
        category: createEventDto.eventCategory,
      });

      return eventData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Discord API error: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          errorToString(error),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async settle(eventData: SettleEventDto) {
    try {
      // Put event in database
      await this.knex('event').insert({
        id: uuidv7(),
        guildId: eventData.guildId,
        name: eventData.name,
        creatorId: eventData.creatorId,
        scheduledStartTime: new Date(eventData.scheduledStartTime)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        eventId: eventData.eventId,
        channelId: eventData.channelId,
        description: eventData.description,
        imageUrl: eventData.imageUrl,
        entityType: eventData.entityType,
        tags: eventData.tags,
        category: eventData.eventCategory,
      });
      return 'Event created Successfully';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Discord API error: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          errorToString(error),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getAllScheduledEvent(guildId: string) {
    try {
      const response = await axiosInstance.get<DiscordScheduledEvent[]>(
        `${DISCORD_BASE_URL}/guilds/${guildId}/scheduled-events`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Access-Control-Allow-Origin': '*',
          },
          id: `getUnsetteledEvent-${guildId}`,
          cache: {
            ttl: 1000 * 10,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle axios errors
        throw new HttpException(
          error.response?.data ||
            'Error fetching scheduled events from Discord',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Handle unexpected errors
        throw new HttpException(
          'Unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll(param: FindEventDto) {
    try {
      const query = this.knex('event');

      if (param.eventId) query.where('eventId', '=', param.eventId);
      if (param.status) query.where('status', '=', param.status);
      if (param.unsetteledIds) query.whereIn('status', ['SCHEDULED', 'ACTIVE']);
      if (param.guildId) query.where('guildId', '=', param.guildId ?? '');
      if (param.limit) query.limit(param.limit);
      if (param.offset) query.offset(param.offset);
      if (param.category) query.where('category', '=', param.category);
      if (param.featured)
        query.innerJoin('featured_event as fe', 'event.id', 'fe.eventId');
      if (param.count) {
        const count = await query.count();
        return Object.values(count.at(0));
      }
      const event = await query.select('*');

      if (!event.length) {
        throw new NotFoundException('No event found');
      }

      return event;
    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a known exception
      }

      // Handle potential query errors
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        throw new BadRequestException('Invalid query parameter');
      }

      // Handle any other errors
      throw new InternalServerErrorException(
        'An error occurred while fetching categories',
      );
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const updatedRows = await this.knex<EventSchema>('event')
        .where('eventId', eventId)
        .delete();

      if (updatedRows === 0) {
        throw new HttpException(
          'Event not found or already deleted',
          HttpStatus.NOT_FOUND,
        );
      }

      return 'Event successfully marked as deleted';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting event');
    }
  }

  async deleteDiscordEvent(params: DeleteEventDto) {
    try {
      await axios.delete(
        `${DISCORD_BASE_URL}/guilds/${params.guildId}/scheduled-events/${params.eventId}`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        },
      );

      return 'successfully deleted evet';
    } catch (error) {
      // You might want to throw a NestJS HttpException
      throw new HttpException(
        errorToString(error) ?? 'Failed to delete Discord event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDiscordEvent(eventId: string, event: UpdateEventDto) {
    try {
      if (!event.guildId) throw new Error('Provide Guild Id to update event');

      const updateEventData: Partial<DiscordScheduledEvent> = {};

      if (event.entityType) {
        updateEventData.entity_type =
          event.entityType == '1'
            ? ScheduledEventEntityType.VOICE
            : ScheduledEventEntityType.STAGE_INSTANCE;
      }

      if (event.channelId) {
        // updateEventData.channel_id = event.channelId;
        updateEventData.channel_id = event.channelId;
      }

      if (event.description) {
        updateEventData.description = event.description;
      }

      if (event.name) {
        updateEventData.name = event.name;
      }

      if (event.scheduledStartTime) {
        updateEventData.scheduled_start_time = new Date(
          event.scheduledStartTime,
        );
      }
      if (event.imageUrl) {
        updateEventData.image = event.imageUrl;
      }

      if (event.entityType) {
        updateEventData.entity_type =
          event.entityType == '2'
            ? ScheduledEventEntityType.VOICE
            : ScheduledEventEntityType.STAGE_INSTANCE;
      }
      const res = await axios.patch(
        `${DISCORD_BASE_URL}/guilds/${event.guildId}/scheduled-events/${eventId}`,
        {
          ...updateEventData,
        },
        {
          headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
        },
      );

      // If failed to update discord event
      if (!res.data)
        throw new Error('Error updating discord event. Check perms');

      const updatedEvent: DiscordScheduledEvent = res.data;
      const dbEventData: Partial<EventSchema> = {
        name: updatedEvent.name,
        description: updateEventData.description,
        channelId: updateEventData.channel_id,
        imageUrl: updatedEvent.image,
        scheduledStartTime: new Date(updatedEvent.scheduled_start_time)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        entityType:
          updateEventData.entity_type == 2 ? 'VOICE' : 'STAGE_INSTANCE',
      };

      if (event.eventCategory) {
        dbEventData.category = event.eventCategory;
      }

      if (event.tags) {
        dbEventData.tags = event.tags;
      }

      // update event in databse
      await this.knex<EventSchema>('event')
        .update({ ...dbEventData })
        .where('eventId', '=', eventId);

      return 'success';
    } catch (error) {
      // You might want to throw a NestJS HttpException
      throw new HttpException(
        errorToString(error) ?? 'Failed to delete Discord event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
