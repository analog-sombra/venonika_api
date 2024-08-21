import { Controller, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/:channelId/invite')
  createInvite(@Param('channelId') channelId: string) {
    return this.channelService.createInvite(channelId);
  }
}
