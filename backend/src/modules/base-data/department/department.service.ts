import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';

/**
 * 部门服务
 */
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * 创建部门
   */
  async create(createDeptDto: CreateDepartmentDto): Promise<Department> {
    // 检查编码是否已存在
    const existingDept = await this.departmentRepository.findOne({
      where: { code: createDeptDto.code },
    });

    if (existingDept) {
      throw new ConflictException('部门编码已存在');
    }

    const department = this.departmentRepository.create(createDeptDto);
    return this.departmentRepository.save(department);
  }

  /**
   * 查询所有部门（树形结构）
   */
  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { enabled: true },
      relations: ['parent', 'children'],
      order: { code: 'ASC' },
    });
  }

  /**
   * 查询部门树
   */
  async findTree(): Promise<Department[]> {
    const departments = await this.departmentRepository.find({
      where: { enabled: true },
      order: { code: 'ASC' },
    });

    return this.buildTree(departments, null);
  }

  /**
   * 构建树形结构
   */
  private buildTree(departments: Department[], parentId: string | null): Department[] {
    return departments
      .filter((dept) => dept.parentId === parentId)
      .map((dept) => ({
        ...dept,
        children: this.buildTree(departments, dept.id),
      }));
  }

  /**
   * 查询单个部门
   */
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

  /**
   * 更新部门
   */
  async update(id: string, updateDeptDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, updateDeptDto);
    return this.departmentRepository.save(department);
  }

  /**
   * 删除部门
   */
  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }
}
