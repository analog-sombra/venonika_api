import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { uuidv7 } from 'uuidv7';
import { CreateEventLikeDto } from './dto/create-like.dto';
import { DeleteEventLikeDto } from './dto/delete-like.dto';
import { FindEventLikeDto } from './dto/find-like.dto';
import { EventLikeSchema } from './entities/like.entity';

@Injectable()
export class EventLikeService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createLikeDto: CreateEventLikeDto) {
    try {
      // Insert the comment into the database
      await this.knex<EventLikeSchema>('event_like').insert({
        id: uuidv7(),
        userId: createLikeDto.userId,
        targetId: createLikeDto.targetId,
      });

      return 'successful';
    } catch (error) {
      // Handle specific error cases, or throw a generic internal server error
      if (error instanceof BadRequestException) {
        throw error; // Re-throw specific errors
      } else {
        // Handle database-related errors or other unexpected errors
        throw new InternalServerErrorException('Could not create comment');
      }
    }
  }

  async findAll(param: FindEventLikeDto) {
    try {
      // Start building the query
      const query = this.knex<EventLikeSchema>('event_like').leftJoin(
        'user',
        'event_like.userId',
        'user.user_id',
      );

      // Add conditional filters based on the parameters
      if (param.id) query.where('event_like.id', param.id);
      if (param.targetId) query.where('event_like.targetId', param.targetId);
      if (param.userId) query.where('event_like.userId', param.userId);

      // Execute the query and select the necessary fields
      const likes = await query.select(
        'event_like.*',
        'user.username',
        'user.avatar',
      );

      // If no comments are found, throw a NotFoundException
      if (!likes.length) {
        throw new NotFoundException('No like found');
      }

      return likes;
    } catch (error) {
      // Throw an appropriate exception based on the error type
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's already a NotFoundException
      } else {
        throw new InternalServerErrorException(
          'Could not retrieve events likes',
        );
      }
    }
  }

  async delete(param: DeleteEventLikeDto) {
    try {
      // Perform the delete operation and get the number of affected rows
      const result = await this.knex<EventLikeSchema>('event_like')
        .where('targetId', param.targetId)
        .where('userId', param.userId)
        .delete();

      // Check if the delete operation affected any rows (i.e., if the like existed)
      if (result === 0) {
        // If no rows were deleted, throw a NotFoundException
        throw new NotFoundException('Like not found or already deleted');
      }

      return 'Like successfully deleted';
    } catch (error) {
      // Throw a generic InternalServerErrorException for unexpected errors
      throw new InternalServerErrorException('Could not delete like');
    }
  }
}
