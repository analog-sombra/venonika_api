import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { axiosInstance } from 'src/interceptor/axiosInstance';
import { DISCORD_BASE_URL, DISCORD_BOT_TOKEN } from 'src/lib/constant';
import { errorToString } from 'src/lib/methods';
import { DiscordInviteSchema } from './entities/guild.entity';

@Injectable()
export class GuildService {
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

  async getGuildsInvite(guildId: string) {
    try {
      const res = await axiosInstance.get<DiscordInviteSchema>(
        `${DISCORD_BASE_URL}/guilds/${guildId}/invites`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
          id: `getGuildInvite-${guildId}`,
          cache: {
            ttl: 1000 * 10,
          },
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
