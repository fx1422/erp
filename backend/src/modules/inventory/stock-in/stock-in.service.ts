import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockIn } from './stock-in.entity';
import { CreateStockInDto, UpdateStockInStatusDto } from './stock-in.dto';
import { InventoryService } from '../inventory.service';

/**
 * 入库服务
 */
@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockIn)
    private readonly stockInRepository: Repository<StockIn>,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * 生成入库单号
   */
  private generateInNo(): string {
    const date = new Date();
    const prefix = 'IN' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + random;
  }

  /**
   * 创建入库单
   */
  async create(createDto: CreateStockInDto): Promise<StockIn> {
    const stockIn = this.stockInRepository.create({
      inNo: this.generateInNo(),
      type: createDto.type,
      supplierId: createDto.supplierId,
      supplierName: createDto.supplierName,
      purchaseOrderId: createDto.purchaseOrderId,
      warehouseId: createDto.warehouseId || 'WH001',
      warehouseName: createDto.warehouseName || '主仓库',
      remark: createDto.remark,
      inDate: createDto.inDate || new Date(),
      createdById: createDto.createdById,
      createdBy: createDto.createdBy,
      status: 'draft',
      items: createDto.items.map((item) => ({
        ...item,
        amount: item.price ? item.price * item.quantity : 0,
      })),
    });

    return this.stockInRepository.save(stockIn);
  }

  /**
   * 查询所有入库单
   */
  async findAll(): Promise<StockIn[]> {
    return this.stockInRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询单个入库单
   */
  async findOne(id: string): Promise<StockIn> {
    const stockIn = await this.stockInRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!stockIn) {
      throw new NotFoundException('入库单不存在');
    }

    return stockIn;
  }

  /**
   * 确认入库（更新库存）
   */
  async confirmStockIn(id: string): Promise<StockIn> {
    const stockIn = await this.findOne(id);

    if (stockIn.status !== 'pending') {
      throw new Error('只有待确认的入库单才能确认');
    }

    // 更新库存
    for (const item of stockIn.items) {
      await this.inventoryService.updateQuantity(
        item.productId,
        stockIn.warehouseId,
        item.quantity,
        {
          type: 'in',
          businessType: stockIn.type === 'purchase' ? 'purchase' : 'return',
          quantity: item.quantity,
          remark: `入库单：${stockIn.inNo}`,
          relatedOrderId: stockIn.purchaseOrderId || stockIn.id,
          createdBy: stockIn.createdById || 'system',
        },
      );
    }

    stockIn.status = 'completed';
    return this.stockInRepository.save(stockIn);
  }

  /**
   * 更新入库单状态
   */
  async updateStatus(id: string, updateDto: UpdateStockInStatusDto): Promise<StockIn> {
    const stockIn = await this.findOne(id);
    stockIn.status = updateDto.status;
    return this.stockInRepository.save(stockIn);
  }

  /**
   * 删除入库单
   */
  async remove(id: string): Promise<void> {
    const stockIn = await this.findOne(id);
    await this.stockInRepository.remove(stockIn);
  }
}
