import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { axiosInstance } from 'src/interceptor/axiosInstance';
import { DISCORD_BASE_URL, DISCORD_BOT_TOKEN } from 'src/lib/constant';
import { errorToString } from 'src/lib/methods';

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
}
