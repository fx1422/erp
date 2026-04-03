import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  DepartmentService,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './department.service';
import { Department } from './department.entity';

@Controller('base/departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() createDeptDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(createDeptDto);
  }

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeptDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.update(id, updateDeptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentService.remove(id);
  }
}
