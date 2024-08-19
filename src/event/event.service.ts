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
import { DiscordScheduledEvent } from './entities/event.entity';

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
}
