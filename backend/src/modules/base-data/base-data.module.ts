import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department/department.entity';
import { Supplier } from './supplier/supplier.entity';
import { Customer } from './customer/customer.entity';
import { Product } from './product/product.entity';
import { DepartmentService } from './department/department.service';
import { DepartmentController } from './department/department.controller';
import { SupplierService } from './supplier/supplier.service';
import { SupplierController } from './supplier/supplier.controller';
import { CustomerService } from './customer/customer.service';
import { CustomerController } from './customer/customer.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Supplier, Customer, Product])],
  controllers: [
    DepartmentController,
    SupplierController,
    CustomerController,
    ProductController,
  ],
  providers: [
    DepartmentService,
    SupplierService,
    CustomerService,
    ProductService,
  ],
  exports: [TypeOrmModule],
})
export class BaseDataModule {}
