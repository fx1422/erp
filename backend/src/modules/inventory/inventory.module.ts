import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { InventoryRecord } from './inventory-record.entity';
import { StockIn } from './stock-in/stock-in.entity';
import { StockInItem } from './stock-in/stock-in-item.entity';
import { StockOut } from './stock-out/stock-out.entity';
import { StockOutItem } from './stock-out/stock-out-item.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { StockInService } from './stock-in/stock-in.service';
import { StockInController } from './stock-in/stock-in.controller';
import { StockOutService } from './stock-out/stock-out.service';
import { StockOutController } from './stock-out/stock-out.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryRecord, StockIn, StockInItem, StockOut, StockOutItem])],
  controllers: [InventoryController, StockInController, StockOutController],
  providers: [InventoryService, StockInService, StockOutService],
  exports: [TypeOrmModule, InventoryService, StockInService, StockOutService],
})
export class InventoryModule {}
