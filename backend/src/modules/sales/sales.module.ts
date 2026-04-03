import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from './sales-order.entity';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderController } from './sales-order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder])],
  controllers: [SalesOrderController],
  providers: [SalesOrderService],
  exports: [TypeOrmModule],
})
export class SalesModule {}
