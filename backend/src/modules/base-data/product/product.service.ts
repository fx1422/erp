import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

/**
 * 产品服务
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * 创建产品
   */
  async create(createDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { code: createDto.code },
    });

    if (existingProduct) {
      throw new ConflictException('产品编码已存在');
    }

    const product = this.productRepository.create({
      ...createDto,
      stockQuantity: 0,
      price: createDto.price || 0,
      cost: createDto.cost || 0,
      minStock: createDto.minStock || 0,
      maxStock: createDto.maxStock || 0,
    });
    return this.productRepository.save(product);
  }

  /**
   * 查询所有产品
   */
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { enabled: true },
      order: { code: 'ASC' },
    });
  }

  /**
   * 查询单个产品
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('产品不存在');
    return product;
  }

  /**
   * 更新产品
   */
  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateDto);
    return this.productRepository.save(product);
  }

  /**
   * 删除产品
   */
  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  /**
   * 更新库存
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQuantity += quantity;
    return this.productRepository.save(product);
  }

  /**
   * 查询库存预警产品
   */
  async findLowStockProducts(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.enabled = :enabled', { enabled: true })
      .andWhere('product.stockQuantity <= product.minStock')
      .getMany();
  }
}
