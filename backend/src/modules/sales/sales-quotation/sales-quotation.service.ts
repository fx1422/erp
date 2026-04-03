import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesQuotation } from './sales-quotation.entity';
import { CreateSalesQuotationDto, UpdateSalesQuotationStatusDto } from './sales-quotation.dto';

/**
 * 销售报价服务
 */
@Injectable()
export class SalesQuotationService {
  constructor(
    @InjectRepository(SalesQuotation)
    private readonly salesQuotationRepository: Repository<SalesQuotation>,
  ) {}

  /**
   * 生成报价单号
   */
  private generateQuotationNo(): string {
    const date = new Date();
    const prefix = 'SQ' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + random;
  }

  /**
   * 创建销售报价
   */
  async create(createDto: CreateSalesQuotationDto): Promise<SalesQuotation> {
    // 计算总金额
    const totalAmount = createDto.items.reduce((sum, item) => {
      const amount = item.price * item.quantity;
      return sum + amount;
    }, 0);

    const quotation = this.salesQuotationRepository.create({
      quotationNo: this.generateQuotationNo(),
      customerId: createDto.customerId,
      customerName: createDto.customerName,
      remark: createDto.remark,
      quotationDate: createDto.quotationDate || new Date(),
      validUntil: createDto.validUntil,
      status: 'draft',
      totalAmount,
      items: createDto.items.map((item) => ({
        ...item,
        amount: item.price * item.quantity,
      })),
    });

    return this.salesQuotationRepository.save(quotation);
  }

  /**
   * 查询所有销售报价
   */
  async findAll(): Promise<SalesQuotation[]> {
    return this.salesQuotationRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询单个销售报价
   */
  async findOne(id: string): Promise<SalesQuotation> {
    const quotation = await this.salesQuotationRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!quotation) {
      throw new NotFoundException('销售报价不存在');
    }

    return quotation;
  }

  /**
   * 更新销售报价状态
   */
  async updateStatus(id: string, updateDto: UpdateSalesQuotationStatusDto): Promise<SalesQuotation> {
    const quotation = await this.findOne(id);
    quotation.status = updateDto.status;
    return this.salesQuotationRepository.save(quotation);
  }

  /**
   * 删除销售报价
   */
  async remove(id: string): Promise<void> {
    const quotation = await this.findOne(id);
    await this.salesQuotationRepository.remove(quotation);
  }
}
