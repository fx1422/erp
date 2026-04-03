import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService, CreateCustomerDto, UpdateCustomerDto } from './customer.service';
import { Customer } from './customer.entity';

@Controller('base/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createDto);
  }

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(id);
  }
}
