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
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

/**
 * 客户管理控制器
 */
@ApiTags('基础数据 - 客户管理')
@Controller('base/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * 创建客户
   */
  @Post()
  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 201, description: '创建成功', type: Customer })
  @ApiResponse({ status: 409, description: '客户编码已存在' })
  create(@Body() createDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createDto);
  }

  /**
   * 查询所有客户
   */
  @Get()
  @ApiOperation({ summary: '查询所有客户' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Customer] })
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  /**
   * 查询单个客户
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个客户' })
  @ApiResponse({ status: 200, description: '查询成功', type: Customer })
  @ApiResponse({ status: 404, description: '客户不存在' })
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  /**
   * 更新客户
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新客户信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Customer })
  @ApiResponse({ status: 404, description: '客户不存在' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, updateDto);
  }

  /**
   * 删除客户
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除客户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(id);
  }
}
