import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FindCategoryDto } from './dto/find-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query() param?: FindCategoryDto) {
    return this.categoryService.findAll(param);
  }
}
