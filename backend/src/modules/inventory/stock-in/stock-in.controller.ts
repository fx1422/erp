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
import { StockInService } from './stock-in.service';
import { StockIn } from './stock-in.entity';
import { CreateStockInDto, UpdateStockInStatusDto } from './stock-in.dto';

/**
 * 入库管理控制器
 */
@ApiTags('库存管理 - 入库管理')
@Controller('inventory/stock-in')
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  /**
   * 创建入库单
   */
  @Post()
  @ApiOperation({ summary: '创建入库单' })
  @ApiResponse({ status: 201, description: '创建成功', type: StockIn })
  create(@Body() createDto: CreateStockInDto): Promise<StockIn> {
    return this.stockInService.create(createDto);
  }

  /**
   * 查询所有入库单
   */
  @Get()
  @ApiOperation({ summary: '查询所有入库单' })
  @ApiResponse({ status: 200, description: '查询成功', type: [StockIn] })
  findAll(): Promise<StockIn[]> {
    return this.stockInService.findAll();
  }

  /**
   * 查询单个入库单
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个入库单' })
  @ApiResponse({ status: 200, description: '查询成功', type: StockIn })
  @ApiResponse({ status: 404, description: '入库单不存在' })
  findOne(@Param('id') id: string): Promise<StockIn> {
    return this.stockInService.findOne(id);
  }

  /**
   * 确认入库
   */
  @Post(':id/confirm')
  @ApiOperation({ summary: '确认入库（更新库存）' })
  @ApiResponse({ status: 200, description: '确认成功', type: StockIn })
  @ApiResponse({ status: 404, description: '入库单不存在' })
  confirmStockIn(@Param('id') id: string): Promise<StockIn> {
    return this.stockInService.confirmStockIn(id);
  }

  /**
   * 更新入库单状态
   */
  @Patch(':id/status')
  @ApiOperation({ summary: '更新入库单状态' })
  @ApiResponse({ status: 200, description: '更新成功', type: StockIn })
  @ApiResponse({ status: 404, description: '入库单不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockInStatusDto,
  ): Promise<StockIn> {
    return this.stockInService.updateStatus(id, updateDto);
  }

  /**
   * 删除入库单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除入库单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '入库单不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.stockInService.remove(id);
  }
}
