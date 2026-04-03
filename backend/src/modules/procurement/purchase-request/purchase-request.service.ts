import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseRequest } from './purchase-request.entity';
import { CreatePurchaseRequestDto, UpdatePurchaseRequestStatusDto } from './purchase-request.dto';

/**
 * 采购申请服务
 */
@Injectable()
export class PurchaseRequestService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRequestRepository: Repository<PurchaseRequest>,
  ) {}

  /**
   * 生成申请单号
   */
  private generateRequestNo(): string {
    const date = new Date();
    const prefix = 'PR' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefix + random;
  }

  /**
   * 创建采购申请
   */
  async create(createDto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    const request = this.purchaseRequestRepository.create({
      requestNo: this.generateRequestNo(),
      departmentId: createDto.departmentId,
      departmentName: createDto.departmentName,
      applicantId: createDto.applicantId,
      applicantName: createDto.applicantName,
      remark: createDto.remark,
      requiredDate: createDto.requiredDate,
      status: 'draft',
      items: createDto.items,
    });

    return this.purchaseRequestRepository.save(request);
  }

  /**
   * 查询所有采购申请
   */
  async findAll(): Promise<PurchaseRequest[]> {
    return this.purchaseRequestRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询单个采购申请
   */
  async findOne(id: string): Promise<PurchaseRequest> {
    const request = await this.purchaseRequestRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!request) {
      throw new NotFoundException('采购申请不存在');
    }

    return request;
  }

  /**
   * 更新采购申请状态
   */
  async updateStatus(id: string, updateDto: UpdatePurchaseRequestStatusDto): Promise<PurchaseRequest> {
    const request = await this.findOne(id);
    request.status = updateDto.status;

    if (updateDto.status === 'approved') {
      request.approvedAt = new Date();
      request.approvedBy = updateDto.approvedBy;
    }

    return this.purchaseRequestRepository.save(request);
  }

  /**
   * 删除采购申请
   */
  async remove(id: string): Promise<void> {
    const request = await this.findOne(id);
    await this.purchaseRequestRepository.remove(request);
  }
}
