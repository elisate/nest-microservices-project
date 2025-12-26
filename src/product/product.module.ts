import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { Category } from '../entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Category]),CategoryModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
