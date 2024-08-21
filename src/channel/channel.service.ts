import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DiscordInviteSchema } from 'src/guild/entities/guild.entity';
import { axiosInstance } from 'src/interceptor/axiosInstance';
import { DISCORD_BASE_URL, DISCORD_BOT_TOKEN } from 'src/lib/constant';

@Injectable()
export class ChannelService {
  async createInvite(channelId: string) {
    try {
      const response = await axiosInstance.post<DiscordInviteSchema>(
        `${DISCORD_BASE_URL}/channels/${channelId}/invites`,
        {},
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      // Handle specific HTTP error responses from the Discord API
      if (error.response) {
        const statusCode = error.response.status;

        switch (statusCode) {
          case 400:
            throw new BadRequestException(
              `Bad Request: Invalid channel ID or malformed request`,
            );
          case 401:
          case 403:
            throw new UnauthorizedException(
              `Unauthorized: Invalid bot token or insufficient permissions`,
            );
          case 404:
            throw new BadRequestException(
              `Channel not found: Invalid channel ID`,
            );
          default:
            throw new InternalServerErrorException(
              `Unexpected error occurred: ${error.message}`,
            );
        }
      } else {
        // Handle errors like network issues or timeouts
        throw new InternalServerErrorException(
          `Could not create invite: ${error.message}`,
        );
      }
    }
  }
}
