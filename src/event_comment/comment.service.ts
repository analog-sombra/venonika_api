import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { uuidv7 } from 'uuidv7';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindCommentDto } from './dto/find-comment.dto';
import { CommentSchema } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      // Insert the comment into the database
      await this.knex<CommentSchema>('event_comment').insert({
        id: uuidv7(),
        userId: createCommentDto.userId,
        targetId: createCommentDto.targetId,
        comment: createCommentDto.comment,
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

  async findAll(param: FindCommentDto) {
    try {
      // Start building the query
      const query = this.knex<CommentSchema>('event_comment').leftJoin(
        'user',
        'event_comment.userId',
        'user.user_id',
      );

      // Add conditional filters based on the parameters
      if (param.id) query.where('event_comment.id', param.id);
      if (param.targetId) query.where('event_comment.targetId', param.targetId);
      if (param.userId) query.where('event_comment.userId', param.userId);

      // Execute the query and select the necessary fields
      const comment = await query.select(
        'event_comment.*',
        'user.username',
        'user.avatar',
      );

      // If no comments are found, throw a NotFoundException
      if (!comment.length) {
        throw new NotFoundException('No comments found');
      }

      return comment;
    } catch (error) {
      // Throw an appropriate exception based on the error type
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's already a NotFoundException
      } else {
        throw new InternalServerErrorException('Could not retrieve comments');
      }
    }
  }
}
