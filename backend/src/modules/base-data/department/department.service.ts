import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDeptDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDeptDto);
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ['parent', 'children'],
      where: { enabled: true },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    return department;
  }

  async update(
    id: string,
    updateDeptDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, updateDeptDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  parentId?: string;
  enabled?: boolean;
}
