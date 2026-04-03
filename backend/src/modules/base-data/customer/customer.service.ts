import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

/**
 * 客户服务
 */
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * 创建客户
   */
  async create(createDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { code: createDto.code },
    });

    if (existingCustomer) {
      throw new ConflictException('客户编码已存在');
    }

    const customer = this.customerRepository.create(createDto);
    return this.customerRepository.save(customer);
  }

  /**
   * 查询所有客户
   */
  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { enabled: true },
      order: { code: 'ASC' },
    });
  }

  /**
   * 查询单个客户
   */
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('客户不存在');
    return customer;
  }

  /**
   * 更新客户
   */
  async update(id: string, updateDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateDto);
    return this.customerRepository.save(customer);
  }

  /**
   * 删除客户
   */
  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}
