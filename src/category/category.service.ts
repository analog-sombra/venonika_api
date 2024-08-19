import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { FindCategoryDto } from './dto/find-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findAll(param: FindCategoryDto) {
    let isActive: boolean;

    try {
      const query = this.knex('category');

      if (param.active?.toString().toLowerCase() == 'true') isActive = true;
      if (param.active?.toString().toLowerCase() == 'false') isActive = false;
      if (isActive !== undefined) {
        query.where('status', '=', isActive ? 'ACTIVE' : 'INACTIVE');
      }

      if (param.id) {
        query.where('id', '=', param.id);
      }

      if (param.type) {
        query.where('type', '=', param.type);
      }

      const categories = await query.select('*');

      if (!categories.length) {
        throw new NotFoundException('No categories found');
      }

      return categories;
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
}
