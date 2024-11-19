import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GuildService } from './guild.service';
import { UpdateDbGuildDto } from './dto/update-guild.dto';

@Controller('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get('/venonika/:guildId')
  findOneDb(@Param('guildId') guildId: string) {
    return this.guildService.findOneDb(guildId);
  }

  @Post('/venonika/:guildId')
  createDb(@Param('guildId') guildId: string) {
    return this.guildService.createDbGuild({ guildId: guildId });
  }

  @Patch('/venonika/:guildId')
  updateDb(
    @Param('guildId') guildId: string,
    @Body() updateDbGuildDto: UpdateDbGuildDto,
  ) {
    console.log(updateDbGuildDto);
    return this.guildService.updateDbGuild({ guildId, updateDbGuildDto });
  }

  @Get('/discord/:guildId')
  findOne(
    @Param('guildId') guildId: string,
    @Query('userId') userId?: string | undefined,
  ) {
    return this.guildService.findOne(guildId, userId);
  }

  @Get('/discord/:guildId/channel')
  getGuildChannels(@Param('guildId') guildId: string) {
    return this.guildService.getGuildChannels(guildId);
  }

  @Get('/discord/:guildId/role')
  getGuildRole(@Param('guildId') guildId: string) {
    return this.guildService.getGuildRole(guildId);
  }

  @Get('/discord/:guildId/invite')
  getGuildInvite(@Param('guildId') guildId: string) {
    return this.guildService.getGuildsInvite(guildId);
  }
}
