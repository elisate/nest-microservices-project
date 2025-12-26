import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { Category } from '../entity/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>, // Inject Category repo
  ) {}

  // CREATE PRODUCT OR INCREASE STOCK (BY NAME AND CATEGORY ID)
  async create(productData: Partial<Product> & { categoryId?: number }): Promise<Product> {
    if (!productData.name) {
      throw new BadRequestException('Product name is required');
    }

    if (!productData.categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    // Fetch Category entity
    const category = await this.categoryRepository.findOne({
      where: { id: productData.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if product with same name and category exists
    const existingProduct = await this.productRepository.findOne({
      where: { name: productData.name, category: { id: category.id } },
      relations: ['category'],
    });

    if (existingProduct) {
      existingProduct.stock += productData.stock ?? 0;
      return this.productRepository.save(existingProduct);
    }

    // Create new product
    const product = this.productRepository.create({
      ...productData,
      category, // assign fetched Category entity
    });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateData: Partial<Product> & { categoryId?: number }): Promise<Product> {
    const product = await this.findOne(id);

    // If categoryId is provided, fetch and assign
    if (updateData.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateData.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }

    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
