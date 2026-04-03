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
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrder } from './purchase-order.entity';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderStatusDto } from './purchase-order/purchase-order.dto';

/**
 * 采购订单控制器
 */
@ApiTags('采购管理 - 采购订单')
@Controller('procurement/orders')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  /**
   * 创建采购订单
   */
  @Post()
  @ApiOperation({ summary: '创建采购订单' })
  @ApiResponse({ status: 201, description: '创建成功', type: PurchaseOrder })
  create(@Body() createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrderService.create(createDto);
  }

  /**
   * 查询所有采购订单
   */
  @Get()
  @ApiOperation({ summary: '查询所有采购订单' })
  @ApiResponse({ status: 200, description: '查询成功', type: [PurchaseOrder] })
  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderService.findAll();
  }

  /**
   * 查询单个采购订单
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个采购订单' })
  @ApiResponse({ status: 200, description: '查询成功', type: PurchaseOrder })
  @ApiResponse({ status: 404, description: '采购订单不存在' })
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrderService.findOne(id);
  }

  /**
   * 更新采购订单状态
   */
  @Patch(':id/status')
  @ApiOperation({ summary: '更新采购订单状态' })
  @ApiResponse({ status: 200, description: '更新成功', type: PurchaseOrder })
  @ApiResponse({ status: 404, description: '采购订单不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseOrderStatusDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrderService.updateStatus(id, updateDto);
  }

  /**
   * 删除采购订单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除采购订单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '采购订单不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.purchaseOrderService.remove(id);
  }
}
