import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string): Promise<Inventory[]> {
    return this.inventoryService.findByProduct(productId);
  }
}
