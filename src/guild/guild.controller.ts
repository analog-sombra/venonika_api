import { Controller, Get, Param, Query } from '@nestjs/common';
import { GuildService } from './guild.service';

@Controller('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get(':guildId')
  findOne(
    @Param('guildId') guildId: string,
    @Query('userId') userId?: string | undefined,
  ) {
    return this.guildService.findOne(guildId, userId);
  }

  @Get('/:guildId/channel')
  getGuildChannels(@Param('guildId') guildId: string) {
    return this.guildService.getGuildChannels(guildId);
  }
}
