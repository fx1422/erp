import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { SalesOrderService, CreateSalesOrderDto } from './sales-order.service';
import { SalesOrder } from './sales-order.entity';

@Controller('sales/orders')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @Post()
  create(@Body() createDto: CreateSalesOrderDto): Promise<SalesOrder> {
    return this.salesOrderService.create(createDto);
  }

  @Get()
  findAll(): Promise<SalesOrder[]> {
    return this.salesOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SalesOrder> {
    return this.salesOrderService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<SalesOrder> {
    return this.salesOrderService.updateStatus(id, body.status);
  }
}
