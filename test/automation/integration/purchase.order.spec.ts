/**
 * 采购订单模块测试
 * 测试文件：purchase.order.spec.ts
 * 测试框架：Vitest + Supertest
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('PurchaseOrderController (e2e) - 采购订单流程', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authToken: string;
  let testSupplierId: string;
  let testProductId: string;
  let testOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();

    // 创建采购员用户并登录
    const hashedPassword = await bcrypt.hash('Purchase@123', 10);
    await prisma.user.upsert({
      where: { username: 'purchase01' },
      update: {},
      create: {
        id: 'test-purchase-user',
        username: 'purchase01',
        password: hashedPassword,
        email: 'purchase@erp.com',
        enabled: true,
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'purchase01',
        password: 'Purchase@123',
      });

    authToken = loginResponse.body.token;

    // 创建测试供应商
    const supplier = await prisma.supplier.upsert({
      where: { code: 'SUP-TEST-001' },
      update: {},
      create: {
        id: 'test-supplier-001',
        code: 'SUP-TEST-001',
        name: '测试供应商',
        contactPerson: '张三',
        phone: '13800138000',
        email: 'supplier@test.com',
        enabled: true,
      },
    });
    testSupplierId = supplier.id;

    // 创建测试产品
    const product = await prisma.product.upsert({
      where: { code: 'PROD-TEST-PURCHASE' },
      update: {},
      create: {
        id: 'test-product-purchase',
        code: 'PROD-TEST-PURCHASE',
        name: '测试采购产品',
        category: '电子产品',
        specification: '规格',
        unit: '个',
        price: 99.99,
        enabled: true,
      },
    });
    testProductId = product.id;
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.purchaseOrderItem.deleteMany({
      where: { orderId: { in: [testOrderId].filter(Boolean) } },
    });

    await prisma.purchaseOrder.deleteMany({
      where: { orderNo: { startsWith: 'PO-TEST-' } },
    });

    await prisma.product.deleteMany({
      where: { code: 'PROD-TEST-PURCHASE' },
    });

    await prisma.supplier.deleteMany({
      where: { code: 'SUP-TEST-001' },
    });

    await prisma.user.deleteMany({
      where: { username: 'purchase01' },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/procurement/orders', () => {
    it('PUR-011: 创建采购订单成功', async () => {
      const orderData = {
        supplierId: testSupplierId,
        items: [
          {
            productId: testProductId,
            quantity: 100,
            unitPrice: 25.5,
          },
        ],
        remark: '测试订单',
        expectedDate: '2026-04-10',
      };

      const response = await request(app.getHttpServer())
        .post('/api/procurement/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.orderNo).toMatch(/^PO-/);
      expect(response.body.status).toBe('pending');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.totalAmount).toBe(2550.0); // 100 * 25.5

      testOrderId = response.body.id;
    });

    it('PUR-012: 采购订单关联申请单', async () => {
      // 先创建采购申请
      const requestOrder = await prisma.purchaseRequest.create({
        data: {
          id: 'test-purchase-request-001',
          requestNo: 'PR-TEST-001',
          status: 'approved',
          items: {
            create: {
              productId: testProductId,
              quantity: 50,
            },
          },
        },
      });

      const orderData = {
        supplierId: testSupplierId,
        items: [
          {
            productId: testProductId,
            quantity: 50,
            unitPrice: 30.0,
          },
        ],
        requestId: requestOrder.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/procurement/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.requestId).toBe(requestOrder.id);

      // 清理
      await prisma.purchaseOrder.delete({ where: { id: response.body.id } });
      await prisma.purchaseRequest.delete({ where: { id: requestOrder.id } });
    });

    it('创建订单失败 - 缺少必填字段', async () => {
      const orderData = {
        // 缺少 supplierId 和 items
      };

      const response = await request(app.getHttpServer())
        .post('/api/procurement/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/procurement/orders', () => {
    it('PUR-015: 采购订单查询', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/procurement/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('采购订单查询 - 按状态筛选', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/procurement/orders?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 所有返回的订单状态都应该是 pending
      response.body.forEach((order: any) => {
        expect(order.status).toBe('pending');
      });
    });
  });

  describe('GET /api/procurement/orders/:id', () => {
    it('查询订单详情', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/procurement/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(testOrderId);
      expect(response.body).toHaveProperty('supplier');
      expect(response.body).toHaveProperty('items');
    });

    it('查询订单详情 - 订单不存在', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/procurement/orders/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('订单不存在');
    });
  });

  describe('PATCH /api/procurement/orders/:id', () => {
    it('PUR-013: 编辑采购订单（待入库状态）', async () => {
      const updateData = {
        remark: '修改备注',
        expectedDate: '2026-04-15',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/procurement/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.remark).toBe('修改备注');
      expect(response.body.expectedDate).toContain('2026-04-15');
    });

    it('PUR-014: 编辑采购订单失败（已入库状态）', async () => {
      // 先创建一个已入库的订单
      const receivedOrder = await prisma.purchaseOrder.create({
        data: {
          id: 'test-received-order',
          orderNo: 'PO-TEST-RECEIVED',
          supplierId: testSupplierId,
          status: 'received',
          items: {
            create: {
              productId: testProductId,
              quantity: 50,
              unitPrice: 20.0,
              receivedQuantity: 50,
            },
          },
        },
      });

      const updateData = {
        remark: '尝试修改',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/procurement/orders/${receivedOrder.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('入库');

      // 清理
      await prisma.purchaseOrder.delete({ where: { id: receivedOrder.id } });
    });
  });

  describe('PATCH /api/procurement/orders/:id/status', () => {
    it('更新订单状态', async () => {
      const updateData = {
        status: 'approved',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/procurement/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('approved');

      // 恢复状态
      await request(app.getHttpServer())
        .patch(`/api/procurement/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'pending' });
    });
  });
});
