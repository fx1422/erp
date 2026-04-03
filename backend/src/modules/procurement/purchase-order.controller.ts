import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { PurchaseOrderService, CreatePurchaseOrderDto } from './purchase-order.service';
import { PurchaseOrder } from './purchase-order.entity';

@Controller('procurement/orders')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrderService.create(createDto);
  }

  @Get()
  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrderService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<PurchaseOrder> {
    return this.purchaseOrderService.updateStatus(id, body.status);
  }
}
