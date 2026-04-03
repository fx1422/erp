import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupplierService, CreateSupplierDto, UpdateSupplierDto } from './supplier.service';
import { Supplier } from './supplier.entity';

@Controller('base/suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.create(createDto);
  }

  @Get()
  findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.supplierService.remove(id);
  }
}
