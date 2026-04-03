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
import { StockOutService } from './stock-out.service';
import { StockOut } from './stock-out.entity';
import { CreateStockOutDto, UpdateStockOutStatusDto } from './stock-out.dto';

/**
 * 出库管理控制器
 */
@ApiTags('库存管理 - 出库管理')
@Controller('inventory/stock-out')
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  /**
   * 创建出库单
   */
  @Post()
  @ApiOperation({ summary: '创建出库单' })
  @ApiResponse({ status: 201, description: '创建成功', type: StockOut })
  create(@Body() createDto: CreateStockOutDto): Promise<StockOut> {
    return this.stockOutService.create(createDto);
  }

  /**
   * 查询所有出库单
   */
  @Get()
  @ApiOperation({ summary: '查询所有出库单' })
  @ApiResponse({ status: 200, description: '查询成功', type: [StockOut] })
  findAll(): Promise<StockOut[]> {
    return this.stockOutService.findAll();
  }

  /**
   * 查询单个出库单
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个出库单' })
  @ApiResponse({ status: 200, description: '查询成功', type: StockOut })
  @ApiResponse({ status: 404, description: '出库单不存在' })
  findOne(@Param('id') id: string): Promise<StockOut> {
    return this.stockOutService.findOne(id);
  }

  /**
   * 确认出库
   */
  @Post(':id/confirm')
  @ApiOperation({ summary: '确认出库（更新库存）' })
  @ApiResponse({ status: 200, description: '确认成功', type: StockOut })
  @ApiResponse({ status: 404, description: '出库单不存在' })
  confirmStockOut(@Param('id') id: string): Promise<StockOut> {
    return this.stockOutService.confirmStockOut(id);
  }

  /**
   * 更新出库单状态
   */
  @Patch(':id/status')
  @ApiOperation({ summary: '更新出库单状态' })
  @ApiResponse({ status: 200, description: '更新成功', type: StockOut })
  @ApiResponse({ status: 404, description: '出库单不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockOutStatusDto,
  ): Promise<StockOut> {
    return this.stockOutService.updateStatus(id, updateDto);
  }

  /**
   * 删除出库单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除出库单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '出库单不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.stockOutService.remove(id);
  }
}
