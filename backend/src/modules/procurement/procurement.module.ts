import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { PurchaseRequest } from './purchase-request/purchase-request.entity';
import { PurchaseRequestItem } from './purchase-request/purchase-request-item.entity';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseRequestService } from './purchase-request/purchase-request.service';
import { PurchaseRequestController } from './purchase-request/purchase-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderItem, PurchaseRequest, PurchaseRequestItem])],
  controllers: [PurchaseOrderController, PurchaseRequestController],
  providers: [PurchaseOrderService, PurchaseRequestService],
  exports: [TypeOrmModule, PurchaseOrderService, PurchaseRequestService],
})
export class ProcurementModule {}
