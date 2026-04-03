import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrder } from './sales-order.entity';

@Injectable()
export class SalesOrderService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepository: Repository<SalesOrder>,
  ) {}

  async create(createDto: CreateSalesOrderDto): Promise<SalesOrder> {
    const salesOrder = this.salesOrderRepository.create(createDto);
    return this.salesOrderRepository.save(salesOrder);
  }

  async findAll(): Promise<SalesOrder[]> {
    return this.salesOrderRepository.find({
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SalesOrder> {
    const salesOrder = await this.salesOrderRepository.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });
    if (!salesOrder) throw new NotFoundException('销售订单不存在');
    return salesOrder;
  }

  async updateStatus(id: string, status: string): Promise<SalesOrder> {
    const salesOrder = await this.findOne(id);
    salesOrder.status = status as any;
    return this.salesOrderRepository.save(salesOrder);
  }
}

export interface CreateSalesOrderDto {
  orderNo: string;
  customerId: string;
  status?: 'draft' | 'pending' | 'approved' | 'shipped' | 'completed' | 'cancelled';
  totalAmount?: number;
  remark?: string;
  orderDate?: Date;
  deliveryDate?: Date;
}
