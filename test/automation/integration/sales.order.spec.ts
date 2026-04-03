/**
 * 销售订单模块测试
 * 测试文件：sales.order.spec.ts
 * 测试框架：Vitest + Supertest
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('SalesOrderController (e2e) - 销售订单流程', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authToken: string;
  let testCustomerId: string;
  let testProductId: string;
  let testProductIdLowStock: string;
  let testOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();

    // 创建销售员用户并登录
    const hashedPassword = await bcrypt.hash('Sales@123', 10);
    await prisma.user.upsert({
      where: { username: 'sales01' },
      update: {},
      create: {
        id: 'test-sales-user',
        username: 'sales01',
        password: hashedPassword,
        email: 'sales@erp.com',
        enabled: true,
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'sales01',
        password: 'Sales@123',
      });

    authToken = loginResponse.body.token;

    // 创建测试客户
    const customer = await prisma.customer.upsert({
      where: { code: 'CUS-TEST-001' },
      update: {},
      create: {
        id: 'test-customer-001',
        code: 'CUS-TEST-001',
        name: '测试客户',
        contactPerson: '李四',
        phone: '13900139000',
        email: 'customer@test.com',
        enabled: true,
      },
    });
    testCustomerId = customer.id;

    // 创建测试产品（库存充足）
    const product = await prisma.product.upsert({
      where: { code: 'PROD-TEST-SALES' },
      update: {},
      create: {
        id: 'test-product-sales',
        code: 'PROD-TEST-SALES',
        name: '测试销售产品',
        category: '电子产品',
        specification: '规格',
        unit: '个',
        price: 99.99,
        stockQuantity: 500,
        enabled: true,
      },
    });
    testProductId = product.id;

    // 创建测试产品（库存不足）
    const productLowStock = await prisma.product.upsert({
      where: { code: 'PROD-TEST-LOW-STOCK' },
      update: {},
      create: {
        id: 'test-product-low-stock',
        code: 'PROD-TEST-LOW-STOCK',
        name: '低库存产品',
        category: '电子产品',
        specification: '规格',
        unit: '个',
        price: 50.00,
        stockQuantity: 10,
        enabled: true,
      },
    });
    testProductIdLowStock = productLowStock.id;

    // 创建库存记录
    await prisma.inventory.upsert({
      where: { productId: testProductId },
      update: {},
      create: {
        id: 'test-inventory-sales',
        productId: testProductId,
        warehouseId: 'WH001',
        warehouseName: '主仓库',
        quantity: 500,
        availableQuantity: 500,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: testProductIdLowStock },
      update: {},
      create: {
        id: 'test-inventory-low-stock',
        productId: testProductIdLowStock,
        warehouseId: 'WH001',
        warehouseName: '主仓库',
        quantity: 10,
        availableQuantity: 10,
      },
    });
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.salesOrderItem.deleteMany({
      where: { orderId: { in: [testOrderId].filter(Boolean) } },
    });

    await prisma.salesOrder.deleteMany({
      where: { orderNo: { startsWith: 'SO-TEST-' } },
    });

    await prisma.inventory.deleteMany({
      where: { productId: { in: [testProductId, testProductIdLowStock] } },
    });

    await prisma.product.deleteMany({
      where: { code: { in: ['PROD-TEST-SALES', 'PROD-TEST-LOW-STOCK'] } },
    });

    await prisma.customer.deleteMany({
      where: { code: 'CUS-TEST-001' },
    });

    await prisma.user.deleteMany({
      where: { username: 'sales01' },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/sales/orders', () => {
    it('SAL-011: 创建销售订单成功', async () => {
      const orderData = {
        customerId: testCustomerId,
        items: [
          {
            productId: testProductId,
            quantity: 50,
            unitPrice: 99.99,
          },
        ],
        remark: '测试销售订单',
        deliveryDate: '2026-04-10',
      };

      const response = await request(app.getHttpServer())
        .post('/api/sales/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.orderNo).toMatch(/^SO-/);
      expect(response.body.status).toBe('pending');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.totalAmount).toBe(4999.5); // 50 * 99.99

      testOrderId = response.body.id;
    });

    it('SAL-012: 库存不足校验', async () => {
      const orderData = {
        customerId: testCustomerId,
        items: [
          {
            productId: testProductIdLowStock,
            quantity: 100, // 远超库存 10
            unitPrice: 50.00,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/api/sales/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('库存不足');
    });

    it('创建订单失败 - 缺少必填字段', async () => {
      const orderData = {
        // 缺少 customerId 和 items
      };

      const response = await request(app.getHttpServer())
        .post('/api/sales/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/sales/orders', () => {
    it('SAL-014: 销售订单查询', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/sales/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('销售订单查询 - 按客户筛选', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/sales/orders?customerId=${testCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 所有返回的订单都应该是该客户的
      response.body.forEach((order: any) => {
        expect(order.customerId).toBe(testCustomerId);
      });
    });
  });

  describe('GET /api/sales/orders/:id', () => {
    it('查询订单详情', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/sales/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(testOrderId);
      expect(response.body).toHaveProperty('customer');
      expect(response.body).toHaveProperty('items');
    });

    it('查询订单详情 - 订单不存在', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/sales/orders/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('订单不存在');
    });
  });

  describe('PATCH /api/sales/orders/:id', () => {
    it('SAL-013: 编辑销售订单（待出库状态）', async () => {
      const updateData = {
        remark: '修改备注',
        deliveryDate: '2026-04-15',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/sales/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.remark).toBe('修改备注');
      expect(response.body.deliveryDate).toContain('2026-04-15');
    });
  });
});
