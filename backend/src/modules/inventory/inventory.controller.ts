import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { InventoryRecord } from './inventory-record.entity';

/**
 * 库存管理控制器
 */
@ApiTags('库存管理 - 库存查询')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * 查询所有库存
   */
  @Get()
  @ApiOperation({ summary: '查询所有库存' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Inventory] })
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  /**
   * 查询单个库存
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个库存' })
  @ApiResponse({ status: 200, description: '查询成功', type: Inventory })
  @ApiResponse({ status: 404, description: '库存记录不存在' })
  findOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  /**
   * 根据产品查询库存
   */
  @Get('product/:productId')
  @ApiOperation({ summary: '根据产品查询库存' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Inventory] })
  findByProduct(@Param('productId') productId: string): Promise<Inventory[]> {
    return this.inventoryService.findByProduct(productId);
  }

  /**
   * 根据仓库查询库存
   */
  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: '根据仓库查询库存' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Inventory] })
  findByWarehouse(@Param('warehouseId') warehouseId: string): Promise<Inventory[]> {
    return this.inventoryService.findByWarehouse(warehouseId);
  }

  /**
   * 查询库存预警
   */
  @Get('alerts/low-stock')
  @ApiOperation({ summary: '查询库存预警（低于最低库存）' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findLowStockAlerts() {
    return this.inventoryService.findLowStockAlerts();
  }

  /**
   * 查询库存台账
   */
  @Get('records')
  @ApiOperation({ summary: '查询库存台账（出入库记录）' })
  @ApiResponse({ status: 200, description: '查询成功', type: [InventoryRecord] })
  findInventoryRecords(
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: string,
  ): Promise<InventoryRecord[]> {
    return this.inventoryService.findInventoryRecords(productId, warehouseId, type);
  }
}
