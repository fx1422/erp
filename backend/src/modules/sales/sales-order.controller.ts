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
import { SalesOrderService } from './sales-order.service';
import { SalesOrder } from './sales-order.entity';
import { CreateSalesOrderDto, UpdateSalesOrderStatusDto } from './sales-order/sales-order.dto';

/**
 * 销售订单控制器
 */
@ApiTags('销售管理 - 销售订单')
@Controller('sales/orders')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  /**
   * 创建销售订单
   */
  @Post()
  @ApiOperation({ summary: '创建销售订单' })
  @ApiResponse({ status: 201, description: '创建成功', type: SalesOrder })
  create(@Body() createDto: CreateSalesOrderDto): Promise<SalesOrder> {
    return this.salesOrderService.create(createDto);
  }

  /**
   * 查询所有销售订单
   */
  @Get()
  @ApiOperation({ summary: '查询所有销售订单' })
  @ApiResponse({ status: 200, description: '查询成功', type: [SalesOrder] })
  findAll(): Promise<SalesOrder[]> {
    return this.salesOrderService.findAll();
  }

  /**
   * 查询单个销售订单
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个销售订单' })
  @ApiResponse({ status: 200, description: '查询成功', type: SalesOrder })
  @ApiResponse({ status: 404, description: '销售订单不存在' })
  findOne(@Param('id') id: string): Promise<SalesOrder> {
    return this.salesOrderService.findOne(id);
  }

  /**
   * 更新销售订单状态
   */
  @Patch(':id/status')
  @ApiOperation({ summary: '更新销售订单状态' })
  @ApiResponse({ status: 200, description: '更新成功', type: SalesOrder })
  @ApiResponse({ status: 404, description: '销售订单不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateSalesOrderStatusDto,
  ): Promise<SalesOrder> {
    return this.salesOrderService.updateStatus(id, updateDto);
  }

  /**
   * 删除销售订单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除销售订单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '销售订单不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.salesOrderService.remove(id);
  }
}
