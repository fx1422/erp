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
import { SalesQuotationService } from './sales-quotation.service';
import { SalesQuotation } from './sales-quotation.entity';
import { CreateSalesQuotationDto, UpdateSalesQuotationStatusDto } from './sales-quotation.dto';

/**
 * 销售报价控制器
 */
@ApiTags('销售管理 - 销售报价')
@Controller('sales/quotations')
export class SalesQuotationController {
  constructor(private readonly salesQuotationService: SalesQuotationService) {}

  /**
   * 创建销售报价
   */
  @Post()
  @ApiOperation({ summary: '创建销售报价' })
  @ApiResponse({ status: 201, description: '创建成功', type: SalesQuotation })
  create(@Body() createDto: CreateSalesQuotationDto): Promise<SalesQuotation> {
    return this.salesQuotationService.create(createDto);
  }

  /**
   * 查询所有销售报价
   */
  @Get()
  @ApiOperation({ summary: '查询所有销售报价' })
  @ApiResponse({ status: 200, description: '查询成功', type: [SalesQuotation] })
  findAll(): Promise<SalesQuotation[]> {
    return this.salesQuotationService.findAll();
  }

  /**
   * 查询单个销售报价
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个销售报价' })
  @ApiResponse({ status: 200, description: '查询成功', type: SalesQuotation })
  @ApiResponse({ status: 404, description: '销售报价不存在' })
  findOne(@Param('id') id: string): Promise<SalesQuotation> {
    return this.salesQuotationService.findOne(id);
  }

  /**
   * 更新销售报价状态
   */
  @Patch(':id/status')
  @ApiOperation({ summary: '更新销售报价状态' })
  @ApiResponse({ status: 200, description: '更新成功', type: SalesQuotation })
  @ApiResponse({ status: 404, description: '销售报价不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateSalesQuotationStatusDto,
  ): Promise<SalesQuotation> {
    return this.salesQuotationService.updateStatus(id, updateDto);
  }

  /**
   * 删除销售报价
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除销售报价' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '销售报价不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.salesQuotationService.remove(id);
  }
}
