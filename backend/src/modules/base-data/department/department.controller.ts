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
import { DepartmentService } from './department.service';
import { Department } from './department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';

/**
 * 部门管理控制器
 */
@ApiTags('基础数据 - 部门管理')
@Controller('base/departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * 创建部门
   */
  @Post()
  @ApiOperation({ summary: '创建部门' })
  @ApiResponse({ status: 201, description: '创建成功', type: Department })
  @ApiResponse({ status: 409, description: '部门编码已存在' })
  create(@Body() createDeptDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(createDeptDto);
  }

  /**
   * 查询所有部门
   */
  @Get()
  @ApiOperation({ summary: '查询所有部门' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Department] })
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  /**
   * 查询部门树
   */
  @Get('tree')
  @ApiOperation({ summary: '查询部门树形结构' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Department] })
  findTree(): Promise<Department[]> {
    return this.departmentService.findTree();
  }

  /**
   * 查询单个部门
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个部门' })
  @ApiResponse({ status: 200, description: '查询成功', type: Department })
  @ApiResponse({ status: 404, description: '部门不存在' })
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  /**
   * 更新部门
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新部门信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Department })
  @ApiResponse({ status: 404, description: '部门不存在' })
  update(
    @Param('id') id: string,
    @Body() updateDeptDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.update(id, updateDeptDto);
  }

  /**
   * 删除部门
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentService.remove(id);
  }
}
