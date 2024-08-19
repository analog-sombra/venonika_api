import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateEventLikeDto } from './dto/create-like.dto';
import { DeleteEventLikeDto } from './dto/delete-like.dto';
import { FindEventLikeDto } from './dto/find-like.dto';
import { EventLikeService } from './like.service';

@Controller('event_like')
export class LikeController {
  constructor(private readonly likeService: EventLikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateEventLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get()
  findAll(@Query() param?: FindEventLikeDto) {
    return this.likeService.findAll(param);
  }

  @Delete()
  delete(@Body() deleteLikeDto: DeleteEventLikeDto) {
    return this.likeService.delete(deleteLikeDto);
  }
}
