import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockOut } from './stock-out.entity';
import { CreateStockOutDto, UpdateStockOutStatusDto } from './stock-out.dto';
import { InventoryService } from '../inventory.service';

/**
 * 出库服务
 */
@Injectable()
export class StockOutService {
  constructor(
    @InjectRepository(StockOut)
    private readonly stockOutRepository: Repository<StockOut>,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * 生成出库单号
   */
  private generateOutNo(): string {
    const date = new Date();
    const prefix = 'OUT' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + random;
  }

  /**
   * 创建出库单
   */
  async create(createDto: CreateStockOutDto): Promise<StockOut> {
    const stockOut = this.stockOutRepository.create({
      outNo: this.generateOutNo(),
      type: createDto.type,
      customerId: createDto.customerId,
      customerName: createDto.customerName,
      salesOrderId: createDto.salesOrderId,
      warehouseId: createDto.warehouseId || 'WH001',
      warehouseName: createDto.warehouseName || '主仓库',
      remark: createDto.remark,
      outDate: createDto.outDate || new Date(),
      createdById: createDto.createdById,
      createdBy: createDto.createdBy,
      status: 'draft',
      items: createDto.items.map((item) => ({
        ...item,
        amount: item.price ? item.price * item.quantity : 0,
      })),
    });

    return this.stockOutRepository.save(stockOut);
  }

  /**
   * 查询所有出库单
   */
  async findAll(): Promise<StockOut[]> {
    return this.stockOutRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询单个出库单
   */
  async findOne(id: string): Promise<StockOut> {
    const stockOut = await this.stockOutRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!stockOut) {
      throw new NotFoundException('出库单不存在');
    }

    return stockOut;
  }

  /**
   * 确认出库（更新库存）
   */
  async confirmStockOut(id: string): Promise<StockOut> {
    const stockOut = await this.findOne(id);

    if (stockOut.status !== 'pending') {
      throw new Error('只有待确认的出库单才能确认');
    }

    // 更新库存（出库为负数）
    for (const item of stockOut.items) {
      await this.inventoryService.updateQuantity(
        item.productId,
        stockOut.warehouseId,
        -item.quantity,
        {
          type: 'out',
          businessType: stockOut.type === 'sales' ? 'sales' : 'return',
          quantity: -item.quantity,
          remark: `出库单：${stockOut.outNo}`,
          relatedOrderId: stockOut.salesOrderId || stockOut.id,
          createdBy: stockOut.createdById || 'system',
        },
      );
    }

    stockOut.status = 'completed';
    return this.stockOutRepository.save(stockOut);
  }

  /**
   * 更新出库单状态
   */
  async updateStatus(id: string, updateDto: UpdateStockOutStatusDto): Promise<StockOut> {
    const stockOut = await this.findOne(id);
    stockOut.status = updateDto.status;
    return this.stockOutRepository.save(stockOut);
  }

  /**
   * 删除出库单
   */
  async remove(id: string): Promise<void> {
    const stockOut = await this.findOne(id);
    await this.stockOutRepository.remove(stockOut);
  }
}
