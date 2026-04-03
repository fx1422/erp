import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createDto);
    return this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({ where: { enabled: true } });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('供应商不存在');
    return supplier;
  }

  async update(id: string, updateDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateDto);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }
}

export interface CreateSupplierDto {
  code: string;
  name: string;
  type?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  bankInfo?: string;
  taxId?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  type?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  bankInfo?: string;
  taxId?: string;
  enabled?: boolean;
  rating?: string;
}
