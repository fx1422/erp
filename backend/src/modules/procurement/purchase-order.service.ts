import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrder = this.purchaseOrderRepository.create(createDto);
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find({
      relations: ['supplier', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['supplier', 'items'],
    });
    if (!purchaseOrder) throw new NotFoundException('采购订单不存在');
    return purchaseOrder;
  }

  async updateStatus(id: string, status: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    purchaseOrder.status = status as any;
    return this.purchaseOrderRepository.save(purchaseOrder);
  }
}

export interface CreatePurchaseOrderDto {
  orderNo: string;
  supplierId: string;
  status?: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  totalAmount?: number;
  remark?: string;
  orderDate?: Date;
  expectedDate?: Date;
}
