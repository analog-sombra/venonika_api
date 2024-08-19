import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { EventLikeService } from './like.service';

@Module({
  controllers: [LikeController],
  providers: [EventLikeService],
})
export class LikeModule {}
