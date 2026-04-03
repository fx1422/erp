import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 系统管理模块
import { SystemModule } from './modules/system/system.module';

// 基础数据模块
import { BaseDataModule } from './modules/base-data/base-data.module';

// 采购管理模块
import { ProcurementModule } from './modules/procurement/procurement.module';

// 销售管理模块
import { SalesModule } from './modules/sales/sales.module';

// 库存管理模块
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 数据库配置
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'erp_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),

    // 业务模块
    SystemModule,
    BaseDataModule,
    ProcurementModule,
    SalesModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
