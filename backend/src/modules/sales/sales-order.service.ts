import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrder } from './sales-order.entity';
import { CreateSalesOrderDto, UpdateSalesOrderStatusDto } from './sales-order/sales-order.dto';

/**
 * 销售订单服务
 */
@Injectable()
export class SalesOrderService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepository: Repository<SalesOrder>,
  ) {}

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const date = new Date();
    const prefix = 'SO' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + random;
  }

  /**
   * 创建销售订单
   */
  async create(createDto: CreateSalesOrderDto): Promise<SalesOrder> {
    // 计算总金额
    const totalAmount = createDto.items.reduce((sum, item) => {
      const amount = item.price * item.quantity;
      return sum + amount;
    }, 0);

    const salesOrder = this.salesOrderRepository.create({
      orderNo: this.generateOrderNo(),
      customerId: createDto.customerId,
      status: 'draft',
      totalAmount,
      remark: createDto.remark,
      orderDate: createDto.orderDate || new Date(),
      deliveryDate: createDto.deliveryDate,
      items: createDto.items.map((item) => ({
        ...item,
        amount: item.price * item.quantity,
        shippedQuantity: 0,
      })),
    });

    return this.salesOrderRepository.save(salesOrder);
  }

  /**
   * 查询所有销售订单
   */
  async findAll(): Promise<SalesOrder[]> {
    return this.salesOrderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询单个销售订单
   */
  async findOne(id: string): Promise<SalesOrder> {
    const salesOrder = await this.salesOrderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!salesOrder) throw new NotFoundException('销售订单不存在');
    return salesOrder;
  }

  /**
   * 更新销售订单状态
   */
  async updateStatus(id: string, updateDto: UpdateSalesOrderStatusDto): Promise<SalesOrder> {
    const salesOrder = await this.findOne(id);
    salesOrder.status = updateDto.status;
    return this.salesOrderRepository.save(salesOrder);
  }

  /**
   * 删除销售订单
   */
  async remove(id: string): Promise<void> {
    const salesOrder = await this.findOne(id);
    await this.salesOrderRepository.remove(salesOrder);
  }
}
