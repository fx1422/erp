import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

/**
 * 供应商服务
 */
@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  /**
   * 创建供应商
   */
  async create(createDto: CreateSupplierDto): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { code: createDto.code },
    });

    if (existingSupplier) {
      throw new ConflictException('供应商编码已存在');
    }

    const supplier = this.supplierRepository.create(createDto);
    return this.supplierRepository.save(supplier);
  }

  /**
   * 查询所有供应商
   */
  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      where: { enabled: true },
      order: { code: 'ASC' },
    });
  }

  /**
   * 查询单个供应商
   */
  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('供应商不存在');
    return supplier;
  }

  /**
   * 更新供应商
   */
  async update(id: string, updateDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateDto);
    return this.supplierRepository.save(supplier);
  }

  /**
   * 删除供应商
   */
  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }
}
