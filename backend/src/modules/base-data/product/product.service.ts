import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { enabled: true } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('产品不存在');
    return product;
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQuantity += quantity;
    return this.productRepository.save(product);
  }
}

export interface CreateProductDto {
  code: string;
  name: string;
  category?: string;
  specification?: string;
  unit?: string;
  price?: number;
  cost?: number;
  minStock?: number;
  maxStock?: number;
  description?: string;
}

export interface UpdateProductDto {
  name?: string;
  category?: string;
  specification?: string;
  unit?: string;
  price?: number;
  cost?: number;
  minStock?: number;
  maxStock?: number;
  description?: string;
  enabled?: boolean;
}
