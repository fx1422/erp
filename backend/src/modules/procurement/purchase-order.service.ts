import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderStatusDto } from './purchase-order/purchase-order.dto';

/**
 * 采购订单服务
 */
@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const date = new Date();
    const prefix = 'PO' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + random;
  }

  /**
   * 创建采购订单
   */
  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // 计算总金额
    const totalAmount = createDto.items.reduce((sum, item) => {
      const amount = item.price * item.quantity;
      return sum + amount;
    }, 0);

    const purchaseOrder = this.purchaseOrderRepository.create({
      orderNo: this.generateOrderNo(),
      supplierId: createDto.supplierId,
      status: 'draft',
      totalAmount,
      remark: createDto.remark,
      orderDate: createDto.orderDate || new Date(),
      expectedDate: createDto.expectedDate,
      items: createDto.items.map((item) => ({
        ...item,
        amount: item.price * item.quantity,
        receivedQuantity: 0,
      })),
    });

    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  /**
   * 查询所有采购订单
   */
  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询单个采购订单
   */
  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!purchaseOrder) throw new NotFoundException('采购订单不存在');
    return purchaseOrder;
  }

  /**
   * 更新采购订单状态
   */
  async updateStatus(id: string, updateDto: UpdatePurchaseOrderStatusDto): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    purchaseOrder.status = updateDto.status;
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  /**
   * 删除采购订单
   */
  async remove(id: string): Promise<void> {
    const purchaseOrder = await this.findOne(id);
    await this.purchaseOrderRepository.remove(purchaseOrder);
  }
}
