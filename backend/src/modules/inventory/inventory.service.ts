import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { InventoryRecord } from './inventory-record.entity';
import { Product } from '../base-data/product/product.entity';

/**
 * 库存服务
 */
@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryRecord)
    private readonly inventoryRecordRepository: Repository<InventoryRecord>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * 查询所有库存
   */
  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      order: { productId: 'ASC' },
    });
  }

  /**
   * 查询单个库存
   */
  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
    });
    if (!inventory) throw new NotFoundException('库存记录不存在');
    return inventory;
  }

  /**
   * 根据产品查询库存
   */
  async findByProduct(productId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { productId },
    });
  }

  /**
   * 根据仓库查询库存
   */
  async findByWarehouse(warehouseId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { warehouseId },
    });
  }

  /**
   * 更新库存数量
   */
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

  /**
   * 查询库存预警（低于最低库存）
   */
  async findLowStockAlerts(): Promise<InventoryAlertDto[]> {
    const inventories = await this.inventoryRepository.find();
    const alerts: InventoryAlertDto[] = [];

    for (const inventory of inventories) {
      const product = await this.productRepository.findOne({
        where: { id: inventory.productId },
      });

      if (product && inventory.quantity <= product.minStock) {
        alerts.push({
          inventoryId: inventory.id,
          productId: inventory.productId,
          productName: product.name,
          productCode: product.code,
          currentQuantity: inventory.quantity,
          minStock: product.minStock,
          maxStock: product.maxStock,
          warehouseId: inventory.warehouseId,
          warehouseName: inventory.warehouseName,
          alertType: inventory.quantity === 0 ? 'out_of_stock' : 'low_stock',
        });
      }
    }

    return alerts;
  }

  /**
   * 查询库存台账（出入库记录）
   */
  async findInventoryRecords(
    productId?: string,
    warehouseId?: string,
    type?: string,
  ): Promise<InventoryRecord[]> {
    const query = this.inventoryRecordRepository.createQueryBuilder('record');

    if (productId) {
      query.andWhere('record.productId = :productId', { productId });
    }

    if (warehouseId) {
      query.andWhere('record.warehouseId = :warehouseId', { warehouseId });
    }

    if (type) {
      query.andWhere('record.type = :type', { type });
    }

    return query.orderBy('record.createdAt', 'DESC').getMany();
  }
}

/**
 * 创建库存记录 DTO
 */
export interface CreateInventoryRecordDto {
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  businessType: 'purchase' | 'sales' | 'return' | 'transfer' | 'adjustment';
  quantity: number;
  remark?: string;
  relatedOrderId?: string;
  createdBy: string;
}

/**
 * 库存预警 DTO
 */
export interface InventoryAlertDto {
  inventoryId: string;
  productId: string;
  productName: string;
  productCode: string;
  currentQuantity: number;
  minStock: number;
  maxStock: number;
  warehouseId: string;
  warehouseName: string;
  alertType: 'out_of_stock' | 'low_stock';
}
