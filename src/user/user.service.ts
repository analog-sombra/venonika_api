import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { axiosInstance } from 'src/interceptor/axiosInstance';
import { DISCORD_BASE_URL } from 'src/lib/constant';
import { uuidv7 } from 'uuidv7';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSchema } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const result = await this.knex('user').insert({
        id: uuidv7(),
        ...createUserDto,
      });
      return {
        message: 'User created successfully',
        ...result,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error
        throw new BadRequestException('User with this ID already exists');
      } else if (error.code) {
        throw new BadRequestException(error.sqlMessage);
      }
      // Handle other errors
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findOne(userId: string) {
    try {
      const user = await this.knex<UserSchema>('user')
        .where('user_id', userId)
        .first();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      // Re-throw specific exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Throw a generic internal server error for unexpected issues
      throw new InternalServerErrorException(
        'An error occurred while finding the user',
      );
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.knex<UserSchema>('user').where('id', id).first();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      // Re-throw specific exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Throw a generic internal server error for unexpected issues
      throw new InternalServerErrorException(
        'An error occurred while finding the user',
      );
    }
  }

  async getAllGuild(accessToken: string): Promise<any> {
    try {
      const response = await axiosInstance.get(
        `${DISCORD_BASE_URL}/users/@me/guilds`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          id: `getAllGuilds-${accessToken}`,
          cache: {
            ttl: 1000 * 10,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data || 'Error fetching guilds from Discord',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.knex('user')
        .where('user_id', userId)
        .update({ ...updateUserDto });

      if (result === 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          error: error.getResponse(),
        };
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the user',
      );
    }
  }
}
