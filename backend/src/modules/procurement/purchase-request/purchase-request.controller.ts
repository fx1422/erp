import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequest } from './purchase-request.entity';
import { CreatePurchaseRequestDto, UpdatePurchaseRequestStatusDto } from './purchase-request.dto';

/**
 * 采购申请控制器
 */
@ApiTags('采购管理 - 采购申请')
@Controller('procurement/requests')
export class PurchaseRequestController {
  constructor(private readonly purchaseRequestService: PurchaseRequestService) {}

  /**
   * 创建采购申请
   */
  @Post()
  @ApiOperation({ summary: '创建采购申请' })
  @ApiResponse({ status: 201, description: '创建成功', type: PurchaseRequest })
  create(@Body() createDto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    return this.purchaseRequestService.create(createDto);
  }

  /**
   * 查询所有采购申请
   */
  @Get()
  @ApiOperation({ summary: '查询所有采购申请' })
  @ApiResponse({ status: 200, description: '查询成功', type: [PurchaseRequest] })
  findAll(): Promise<PurchaseRequest[]> {
    return this.purchaseRequestService.findAll();
  }

  /**
   * 查询单个采购申请
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个采购申请' })
  @ApiResponse({ status: 200, description: '查询成功', type: PurchaseRequest })
  @ApiResponse({ status: 404, description: '采购申请不存在' })
  findOne(@Param('id') id: string): Promise<PurchaseRequest> {
    return this.purchaseRequestService.findOne(id);
  }

  /**
   * 更新采购申请状态
   */
  @Patch(':id/status')
  @ApiOperation({ summary: '更新采购申请状态' })
  @ApiResponse({ status: 200, description: '更新成功', type: PurchaseRequest })
  @ApiResponse({ status: 404, description: '采购申请不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseRequestStatusDto,
  ): Promise<PurchaseRequest> {
    return this.purchaseRequestService.updateStatus(id, updateDto);
  }

  /**
   * 删除采购申请
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除采购申请' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '采购申请不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.purchaseRequestService.remove(id);
  }
}
