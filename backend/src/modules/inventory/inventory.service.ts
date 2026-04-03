import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { InventoryRecord } from './inventory-record.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryRecord)
    private readonly inventoryRecordRepository: Repository<InventoryRecord>,
  ) {}

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!inventory) throw new NotFoundException('库存记录不存在');
    return inventory;
  }

  async findByProduct(productId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { productId },
      relations: ['product'],
    });
  }

  async updateQuantity(
    productId: string,
    warehouseId: string,
    quantity: number,
    record: CreateInventoryRecordDto,
  ): Promise<Inventory> {
    let inventory = await this.inventoryRepository.findOne({
      where: { productId, warehouseId },
    });

    if (!inventory) {
      inventory = this.inventoryRepository.create({
        productId,
        warehouseId,
        quantity: 0,
        reservedQuantity: 0,
        availableQuantity: 0,
      });
    }

    const beforeQuantity = inventory.quantity;
    inventory.quantity += quantity;
    inventory.availableQuantity = inventory.quantity - inventory.reservedQuantity;

    await this.inventoryRepository.save(inventory);

    // 创建库存记录
    const inventoryRecord = this.inventoryRecordRepository.create({
      ...record,
      productId,
      warehouseId,
      beforeQuantity,
      afterQuantity: inventory.quantity,
    });
    await this.inventoryRecordRepository.save(inventoryRecord);

    return inventory;
  }
}

export interface CreateInventoryRecordDto {
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  businessType: 'purchase' | 'sales' | 'return' | 'transfer' | 'adjustment';
  quantity: number;
  remark?: string;
  relatedOrderId?: string;
  createdBy: string;
}
