import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UserSchema } from 'src/user/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionSchema } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createSessionDto: CreateSessionDto) {
    try {
      const { expiresAt, ...rest } = createSessionDto;
      await this.knex('session').insert({
        ...rest,
        expires_at: new Date(expiresAt)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      });

      return {
        message: 'Session created successfully',
      };
    } catch (error) {
      // Check for specific error types if necessary
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Session with this ID already exists');
      } else if (error.code) {
        throw new BadRequestException(error.sqlMessage);
      }
      // Throw a general internal server error
      throw new InternalServerErrorException(
        'An error occurred while creating the session',
      );
    }
  }

  async findOne(sessionId: string) {
    try {
      const session = await this.knex<SessionSchema>('session')
        .where('id', sessionId)
        .first();

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      const user = await this.knex<UserSchema>('user')
        .where('user_id', session.userId)
        .first();

      if (!user) {
        throw new NotFoundException('user not found');
      }

      return {
        user,
        session,
      };
    } catch (error) {
      // Re-throw specific exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Throw a generic internal server error for unexpected issues
      throw new InternalServerErrorException(
        'An error occurred while finding the session',
      );
    }
  }

  async findUserSessions(userId: string) {
    try {
      const userSessions = await this.knex<SessionSchema>('session').where(
        'user_id',
        userId,
      );

      if (!userSessions.length) {
        throw new NotFoundException('Session not found');
      }

      return userSessions;
    } catch (error) {
      // Re-throw specific exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Throw a generic internal server error for unexpected issues
      throw new InternalServerErrorException(
        'An error occurred while finding the session',
      );
    }
  }

  async update(sessionId: string, updateSessionDto: UpdateSessionDto) {
    try {
      const result = await this.knex('session').where('id', sessionId).update({
        expires_at: updateSessionDto.expiresAt,
      });

      if (result === 0) {
        throw new NotFoundException(`Session with ID ${sessionId} not found`);
      }

      return {
        message: 'Session updated successfully',
      };
    } catch (error) {
      // Handle specific error types if necessary
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Duplicate entry error');
      } else if (error.code) {
        throw new BadRequestException(error.sqlMessage);
      }

      // Throw a general internal server error
      throw new InternalServerErrorException(
        'An error occurred while updating the session',
      );
    }
  }

  async remove(sessionId: string) {
    try {
      const session = await this.knex<SessionSchema>('session')
        .where('id', sessionId)
        .first();

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      await this.knex('session').delete().where('id', session.id);

      return { message: 'Session deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Session not found');
      }

      throw new InternalServerErrorException(
        'An error occurred while deleting the session',
      );
    }
  }

  async removeUserSessions(userId: string) {
    try {
      const session = await this.knex<SessionSchema>('session')
        .where('user_id', userId)
        .first();

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      await this.knex('session').delete().where('user_id', session.userId);

      return { message: 'Session deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Session not found');
      }

      throw new InternalServerErrorException(
        'An error occurred while deleting the session',
      );
    }
  }

  async removeExpiredSessions() {
    try {
      await this.knex('session')
        .where('expiresAt', '<=', this.knex.fn.now())
        .del();

      return { message: 'Session deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Session not found');
      }

      throw new InternalServerErrorException(
        'An error occurred while deleting the session',
      );
    }
  }
}
