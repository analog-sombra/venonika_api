import { Module } from '@nestjs/common';
import { ScrimService } from './scrim.service';
import { ScrimController } from './scrim.controller';

@Module({
  controllers: [ScrimController],
  providers: [ScrimService],
})
export class ScrimModule {}
