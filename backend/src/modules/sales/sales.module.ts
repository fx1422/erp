import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from './sales-order.entity';
import { SalesOrderItem } from './sales-order-item.entity';
import { SalesQuotation } from './sales-quotation/sales-quotation.entity';
import { SalesQuotationItem } from './sales-quotation/sales-quotation-item.entity';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderController } from './sales-order.controller';
import { SalesQuotationService } from './sales-quotation/sales-quotation.service';
import { SalesQuotationController } from './sales-quotation/sales-quotation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder, SalesOrderItem, SalesQuotation, SalesQuotationItem])],
  controllers: [SalesOrderController, SalesQuotationController],
  providers: [SalesOrderService, SalesQuotationService],
  exports: [TypeOrmModule, SalesOrderService, SalesQuotationService],
})
export class SalesModule {}
