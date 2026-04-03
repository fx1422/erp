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
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

/**
 * 供应商管理控制器
 */
@ApiTags('基础数据 - 供应商管理')
@Controller('base/suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  /**
   * 创建供应商
   */
  @Post()
  @ApiOperation({ summary: '创建供应商' })
  @ApiResponse({ status: 201, description: '创建成功', type: Supplier })
  @ApiResponse({ status: 409, description: '供应商编码已存在' })
  create(@Body() createDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.create(createDto);
  }

  /**
   * 查询所有供应商
   */
  @Get()
  @ApiOperation({ summary: '查询所有供应商' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Supplier] })
  findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  /**
   * 查询单个供应商
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个供应商' })
  @ApiResponse({ status: 200, description: '查询成功', type: Supplier })
  @ApiResponse({ status: 404, description: '供应商不存在' })
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  /**
   * 更新供应商
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新供应商信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Supplier })
  @ApiResponse({ status: 404, description: '供应商不存在' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.update(id, updateDto);
  }

  /**
   * 删除供应商
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除供应商' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '供应商不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.supplierService.remove(id);
  }
}
