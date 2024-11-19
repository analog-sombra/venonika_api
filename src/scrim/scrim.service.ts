import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { ScrimSchema } from './entities/scrim.entity';
import { uuidv7 } from 'uuidv7';
import { CreateScrimDto } from './dto/create-scrim.dto';
import { errorToString } from 'src/lib/methods';
import { FindScrimDto } from './dto/find-scrim.dto';

@Injectable()
export class ScrimService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createScrimDto: CreateScrimDto) {
    try {
      await this.knex<ScrimSchema>('scrim').insert({
        id: uuidv7(),
        allowedRole: createScrimDto.allowedRole,
        registeredRole: createScrimDto.registeredRole,
        guildId: createScrimDto.guildId,
        name: createScrimDto.name,
        registrationChannel: createScrimDto.registrationChannel,

        registrationStartDateTime: new Date(
          createScrimDto.registrationStartDateTime,
        )
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        registrationEndDateTime: new Date(
          createScrimDto.registrationEndDateTime,
        )
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        slot: Number(createScrimDto.slot),
        teamMember: isNaN(Number(createScrimDto.teamMember))
          ? undefined
          : Number(createScrimDto.teamMember),
      });

      return 'successfulll';
    } catch (error) {
      console.log(error);
      // Handle specific database errors if needed
      if (error.code === '23505') {
        // Example for unique constraint violation
        throw new BadRequestException('Scrim with this ID already exists.');
      }
      // Log the error for debugging purposes
      throw new InternalServerErrorException(
        errorToString(error) ?? 'An error occurred while creating the scrim.',
      );
    }
  }

  async find(param: FindScrimDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
      const query = this.knex<ScrimSchema>('scrim');

      if (param.scrimId) query.where('id', '=', param.scrimId);
      if (param.guildId) query.where('guildId', '=', param.guildId);
      if (param.after) query.where('registrationStartDateTime', '>', today);
      if (param.limit) query.limit(param.limit);
      if (param.offset) query.offset(param.offset);
      if (param.count) {
        const count = await query.count();
        return Object.values(count.at(0));
      }
      const event = await query.select('*');

      if (!event.length) {
        throw new NotFoundException('No scrims found');
      }

      return event;
    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a known exception
      }

      // Handle potential query errors
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        throw new BadRequestException('Invalid query parameter');
      }

      // Handle any other errors
      throw new InternalServerErrorException(
        'An error occurred while fetching categories',
      );
    }
  }

  async deleteScrim(scrimId: string) {
    try {
      const updatedRows = await this.knex<ScrimSchema>('scrim')
        .where('id', scrimId)
        .delete();

      if (updatedRows === 0) {
        throw new HttpException(
          'scrim, not found or already deleted',
          HttpStatus.NOT_FOUND,
        );
      }

      return 'scrim successfully marked as deleted';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting scrim');
    }
  }
  async findTodayScrim() {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    try {
      const result = await this.knex<ScrimSchema>('scrim').where(function () {
        this.whereBetween('registrationStartDateTime', [
          startOfToday,
          endOfToday,
        ])
          .orWhereBetween('registrationEndDateTime', [startOfToday, endOfToday])
          .orWhere(function () {
            this.where(
              'registrationStartDateTime',
              '<=',
              startOfToday,
            ).andWhere('registrationEndDateTime', '>=', endOfToday);
          });
      });

      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
