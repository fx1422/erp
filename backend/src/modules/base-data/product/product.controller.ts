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
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

/**
 * 产品管理控制器
 */
@ApiTags('基础数据 - 产品管理')
@Controller('base/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 创建产品
   */
  @Post()
  @ApiOperation({ summary: '创建产品' })
  @ApiResponse({ status: 201, description: '创建成功', type: Product })
  @ApiResponse({ status: 409, description: '产品编码已存在' })
  create(@Body() createDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createDto);
  }

  /**
   * 查询所有产品
   */
  @Get()
  @ApiOperation({ summary: '查询所有产品' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Product] })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  /**
   * 查询库存预警产品
   */
  @Get('alerts/low-stock')
  @ApiOperation({ summary: '查询库存预警产品' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Product] })
  findLowStockProducts(): Promise<Product[]> {
    return this.productService.findLowStockProducts();
  }

  /**
   * 查询单个产品
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个产品' })
  @ApiResponse({ status: 200, description: '查询成功', type: Product })
  @ApiResponse({ status: 404, description: '产品不存在' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  /**
   * 更新产品
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新产品信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Product })
  @ApiResponse({ status: 404, description: '产品不存在' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateDto);
  }

  /**
   * 删除产品
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除产品' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '产品不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
