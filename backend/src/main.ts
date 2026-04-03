import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 全局前缀
  app.setGlobalPrefix('api');

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('ERP 系统 API')
    .setDescription('ERP 系统后端 API 文档 - 包含系统管理、基础数据、采购管理、销售管理、库存管理等模块')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: '请输入 JWT Token（登录后获取）',
    })
    .addTag('系统管理 - 认证', '用户登录、注册')
    .addTag('系统管理 - 用户管理', '用户 CRUD、密码修改')
    .addTag('系统管理 - 角色管理', '角色 CRUD、权限分配')
    .addTag('基础数据 - 部门管理', '多级组织架构管理')
    .addTag('基础数据 - 供应商管理', '供应商 CRUD')
    .addTag('基础数据 - 客户管理', '客户 CRUD')
    .addTag('基础数据 - 产品管理', '产品/物料管理')
    .addTag('采购管理 - 采购申请', '采购申请创建、审批')
    .addTag('采购管理 - 采购订单', '采购订单管理')
    .addTag('销售管理 - 销售报价', '销售报价单管理')
    .addTag('销售管理 - 销售订单', '销售订单管理')
    .addTag('库存管理 - 库存查询', '库存台账查询')
    .addTag('库存管理 - 入库管理', '各类入库操作')
    .addTag('库存管理 - 出库管理', '各类出库操作')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api-docs`);
}

bootstrap();
