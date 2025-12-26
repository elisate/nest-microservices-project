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
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CREATE PRODUCT
  @Post('/createProduct')
  async create(@Body() productData: Partial<Product>) {
    try {
      const product = await this.productService.create(productData);
      return {
        success: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // GET ALL PRODUCTS
  @Get('/getAllProducts')
  async findAll() {
    try {
      const products = await this.productService.findAll();
      return {
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET PRODUCT BY ID
  @Get('/getProductById/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.findOne(id);
      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Product not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // UPDATE PRODUCT
  @Put('/updateProduct/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Product>,
  ) {
    try {
      const product = await this.productService.update(id, updateData);
      return {
        success: true,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE PRODUCT
  @Delete('/deleteProduct/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productService.remove(id);
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
