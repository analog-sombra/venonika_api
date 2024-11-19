import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { axiosInstance } from 'src/interceptor/axiosInstance';
import { DISCORD_BASE_URL, DISCORD_BOT_TOKEN } from 'src/lib/constant';
import { errorToString } from 'src/lib/methods';
import { DiscordInviteSchema, GuildSchema } from './entities/guild.entity';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { CreateDbGuildDto } from './dto/create-guild.dto';
import { UpdateDbGuildDto } from './dto/update-guild.dto';

@Injectable()
export class GuildService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findOneDb(guildId: string) {
    try {
      const response = await this.knex<GuildSchema>('guild').where({
        id: guildId,
      });

      if (response.length == 0) throw new Error('Guild not found');
      return response;
    } catch (error) {
      // Handle Axios-specific errors
      if (axios.isAxiosError(error)) {
        const errorMessage = errorToString(error);

        throw new HttpException(
          errorMessage,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Handle unexpected errors
        throw new HttpException(
          'An unexpected error occurred while retrieving the guild or member data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createDbGuild(createDbGuild: CreateDbGuildDto) {
    try {
      await this.knex<GuildSchema>('guild').insert({
        id: createDbGuild.guildId,
      });
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(
        errorToString(error) ?? 'Could not create the guild',
      );
    }
  }

  async updateDbGuild({
    guildId,
    updateDbGuildDto,
  }: {
    guildId: string;
    updateDbGuildDto: UpdateDbGuildDto;
  }) {
    try {
      const result = await this.knex<GuildSchema>('guild')
        .update({
          scrimLogChannel: updateDbGuildDto.scrimLogChannel,
        })
        .where({ id: guildId });

      // Optionally check if any rows were updated
      if (result === 0) {
        throw new NotFoundException(`Guild with ID ${guildId} not found`);
      }

      return 'success';
    } catch (error) {
      // Handle the error, e.g., log it or throw a custom exception
      throw new InternalServerErrorException(
        errorToString(error) ?? 'Could not update the guild',
      );
    }
  }

  async findOne(guildId: string, userId?: string) {
    let apiString = `${DISCORD_BASE_URL}/guilds/${guildId}`;

    if (userId && userId.length > 0) {
      apiString += `/members/${userId}`;
    }

    try {
      const response = await axiosInstance.get(apiString, {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      // Handle Axios-specific errors
      if (axios.isAxiosError(error)) {
        const errorMessage = errorToString(error);

        throw new HttpException(
          errorMessage,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Handle unexpected errors
        throw new HttpException(
          'An unexpected error occurred while retrieving the guild or member data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getGuildChannels(guildId: string) {
    try {
      const guildChannel = await axiosInstance.get(
        `${DISCORD_BASE_URL}/guilds/${guildId}/channels`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
      return guildChannel.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // You can throw a custom HttpException with a specific status code and message
        throw new HttpException(
          error.response?.data?.message || 'Failed to fetch guild channels',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Handle other unexpected errors
        throw new HttpException(
          'An unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async getGuildRole(guildId: string) {
    try {
      const guildChannel = await axiosInstance.get(
        `${DISCORD_BASE_URL}/guilds/${guildId}/roles`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
      return guildChannel.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // You can throw a custom HttpException with a specific status code and message
        throw new HttpException(
          error.response?.data?.message || 'Failed to fetch guild roles',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Handle other unexpected errors
        throw new HttpException(
          'An unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getGuildsInvite(guildId: string) {
    try {
      const res = await axiosInstance.get<DiscordInviteSchema>(
        `${DISCORD_BASE_URL}/guilds/${guildId}/invites`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
          id: `getGuildInvite-${guildId}`,
          cache: false,
        },
      );
      return res.data;
    } catch (error) {
      // Handle different error statuses from the API
      if (error.response) {
        const statusCode = error.response.status;

        // Handle specific HTTP status codes
        switch (statusCode) {
          case 400:
            throw new BadRequestException(
              errorToString(error) ??
                `Bad Request: Invalid guild ID or malformed request`,
            );
          case 401:
          case 403:
            throw new UnauthorizedException(
              errorToString(error) ??
                `Unauthorized: Invalid bot token or insufficient permissions`,
            );
          case 404:
            throw new BadRequestException(`Guild not found: Invalid guild ID`);
          default:
            throw new InternalServerErrorException(
              errorToString(error) ??
                `Unexpected error occurred: ${error.message}`,
            );
        }
      } else {
        // Handle errors that occur outside of the HTTP response (e.g., network issues)
        throw new InternalServerErrorException(
          errorToString(error) ??
            `Could not fetch guild invites: ${error.message}`,
        );
      }
    }
  }
}
