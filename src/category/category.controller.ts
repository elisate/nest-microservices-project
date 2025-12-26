import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../entity/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create category
  @Post('/createCategory')
  async create(@Body() categoryData: Partial<Category>): Promise<Category> {
    try {
      return await this.categoryService.create(categoryData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create category',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get all categories
  @Get('/getAllCategories')
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch categories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get category by ID
  @Get('/getCategoryById/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Category not found',
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update category
  @Put('/updateCategory/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Category>,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(id, updateData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update category',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete category
  @Delete('/deleteCategory/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    try {
      return await this.categoryService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete category',
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}
