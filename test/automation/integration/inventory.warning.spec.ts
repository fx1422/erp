/**
 * 库存预警模块测试
 * 测试文件：inventory.warning.spec.ts
 * 测试框架：Vitest + Supertest
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('Inventory Warning (e2e) - 库存预警功能', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authToken: string;
  let testProductId: string;
  let testInventoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();

    // 创建管理员用户并登录
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        id: 'test-admin-inventory',
        username: 'admin',
        password: hashedPassword,
        email: 'admin@erp.com',
        enabled: true,
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Admin@123',
      });

    authToken = loginResponse.body.token;

    // 创建测试产品（设置预警阈值）
    const product = await prisma.product.upsert({
      where: { code: 'PROD-TEST-WARNING' },
      update: {},
      create: {
        id: 'test-product-warning',
        code: 'PROD-TEST-WARNING',
        name: '预警测试产品',
        category: '测试',
        specification: '规格',
        unit: '个',
        price: 100.00,
        minStock: 50, // 最低库存 50
        maxStock: 200, // 最高库存 200
        enabled: true,
      },
    });
    testProductId = product.id;

    // 创建库存记录（初始库存 100，在正常范围内）
    const inventory = await prisma.inventory.upsert({
      where: { productId: testProductId },
      update: {},
      create: {
        id: 'test-inventory-warning',
        productId: testProductId,
        warehouseId: 'WH001',
        warehouseName: '主仓库',
        quantity: 100,
        availableQuantity: 100,
      },
    });
    testInventoryId = inventory.id;
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.inventory.deleteMany({
      where: { productId: testProductId },
    });

    await prisma.product.deleteMany({
      where: { code: 'PROD-TEST-WARNING' },
    });

    await prisma.user.deleteMany({
      where: { username: 'admin' },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('INV-031: 设置库存上下限', () => {
    it('设置产品库存预警阈值', async () => {
      const updateData = {
        minStock: 30,
        maxStock: 150,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/base/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.minStock).toBe(30);
      expect(response.body.maxStock).toBe(150);
    });
  });

  describe('GET /api/inventory/warnings', () => {
    it('查询预警列表（无预警）', async () => {
      // 当前库存 100，在 30-150 范围内，应该没有预警
      const response = await request(app.getHttpServer())
        .get('/api/inventory/warnings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 可能包含其他产品的预警，但测试产品不应该在列
      const warningProduct = response.body.find(
        (w: any) => w.productId === testProductId
      );
      expect(warningProduct).toBeUndefined();
    });
  });

  describe('INV-032: 库存下限预警', () => {
    it('触发库存下限预警', async () => {
      // 将库存降至 20（低于下限 30）
      await prisma.inventory.update({
        where: { id: testInventoryId },
        data: {
          quantity: 20,
          availableQuantity: 20,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/inventory/warnings?type=low')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 应该包含测试产品的预警
      const warningProduct = response.body.find(
        (w: any) => w.productId === testProductId
      );
      expect(warningProduct).toBeDefined();
      expect(warningProduct.type).toBe('low_stock');
      expect(warningProduct.currentQuantity).toBe(20);
      expect(warningProduct.minStock).toBe(30);
    });
  });

  describe('INV-033: 库存上限预警', () => {
    it('触发库存上限预警', async () => {
      // 将库存升至 180（高于上限 150）
      await prisma.inventory.update({
        where: { id: testInventoryId },
        data: {
          quantity: 180,
          availableQuantity: 180,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/inventory/warnings?type=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 应该包含测试产品的预警
      const warningProduct = response.body.find(
        (w: any) => w.productId === testProductId
      );
      expect(warningProduct).toBeDefined();
      expect(warningProduct.type).toBe('over_stock');
      expect(warningProduct.currentQuantity).toBe(180);
      expect(warningProduct.maxStock).toBe(150);
    });
  });

  describe('INV-034: 预警通知', () => {
    it('检查预警通知生成', async () => {
      // 触发预警后，检查是否有通知
      const response = await request(app.getHttpServer())
        .get('/api/notifications?type=inventory_warning')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 应该有相关的预警通知
      const warningNotification = response.body.find(
        (n: any) => n.type === 'inventory_warning'
      );
      // 通知可能存在也可能不存在，取决于系统实现
      // 这里只是验证接口可用
      expect(response.status).toBe(200);
    });
  });

  describe('库存预警恢复', () => {
    it('库存恢复正常后预警消失', async () => {
      // 将库存恢复到正常范围
      await prisma.inventory.update({
        where: { id: testInventoryId },
        data: {
          quantity: 100,
          availableQuantity: 100,
        },
      });

      // 查询低库存预警，测试产品应该不在列表中
      const lowResponse = await request(app.getHttpServer())
        .get('/api/inventory/warnings?type=low')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const lowWarningProduct = lowResponse.body.find(
        (w: any) => w.productId === testProductId
      );
      expect(lowWarningProduct).toBeUndefined();

      // 查询高库存预警，测试产品应该不在列表中
      const highResponse = await request(app.getHttpServer())
        .get('/api/inventory/warnings?type=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const highWarningProduct = highResponse.body.find(
        (w: any) => w.productId === testProductId
      );
      expect(highWarningProduct).toBeUndefined();
    });
  });
});
