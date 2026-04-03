/**
 * 产品管理模块测试 - CRUD 操作
 * 测试文件：product.crud.spec.ts
 * 测试框架：Vitest + Supertest
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('ProductController (e2e) - 产品 CRUD 操作', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authToken: string;
  let testProductId: string;

  beforeAll(async () => {
    // 创建测试模块
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
        id: 'test-admin-product',
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
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.product.deleteMany({
      where: {
        code: { in: ['PROD-TEST-001', 'PROD-TEST-002'] },
      },
    });

    await prisma.user.deleteMany({
      where: { username: 'admin' },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/base/products', () => {
    it('PROD-002: 创建产品成功', async () => {
      const productData = {
        code: 'PROD-TEST-001',
        name: '测试产品 001',
        category: '电子产品',
        specification: '规格 A',
        unit: '个',
        price: 99.99,
        cost: 50.00,
        minStock: 10,
        maxStock: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/api/base/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.code).toBe('PROD-TEST-001');
      expect(response.body.name).toBe('测试产品 001');
      expect(response.body.price).toBe(99.99);

      testProductId = response.body.id;
    });

    it('PROD-003: 产品编码重复校验', async () => {
      const productData = {
        code: 'PROD-TEST-001', // 已存在的编码
        name: '重复产品',
        category: '电子产品',
        specification: '规格 B',
        unit: '件',
      };

      const response = await request(app.getHttpServer())
        .post('/api/base/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('编码');
    });

    it('创建产品失败 - 缺少必填字段', async () => {
      const productData = {
        code: 'PROD-TEST-003',
        // 缺少 name 等必填字段
      };

      const response = await request(app.getHttpServer())
        .post('/api/base/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/base/products', () => {
    it('PROD-006: 产品搜索', async () => {
      // 查询所有产品
      const response = await request(app.getHttpServer())
        .get('/api/base/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('产品搜索 - 按名称关键词', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/base/products?keyword=测试')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // 应该包含我们创建的测试产品
      const testProduct = response.body.find((p: any) => p.code === 'PROD-TEST-001');
      expect(testProduct).toBeDefined();
    });
  });

  describe('GET /api/base/products/:id', () => {
    it('查询产品详情', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/base/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(testProductId);
      expect(response.body.code).toBe('PROD-TEST-001');
    });

    it('查询产品详情 - 产品不存在', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/base/products/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('产品不存在');
    });
  });

  describe('PATCH /api/base/products/:id', () => {
    it('PROD-004: 编辑产品信息', async () => {
      const updateData = {
        specification: '新规格 A+',
        price: 129.99,
        minStock: 20,
        maxStock: 200,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/base/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.specification).toBe('新规格 A+');
      expect(response.body.price).toBe(129.99);
      expect(response.body.minStock).toBe(20);
      expect(response.body.maxStock).toBe(200);
    });
  });

  describe('GET /api/base/products/:id/inventory', () => {
    it('PROD-005: 查询产品库存', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/base/products/${testProductId}/inventory`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('productId');
      expect(response.body).toHaveProperty('quantity');
      expect(response.body).toHaveProperty('availableQuantity');
    });
  });

  describe('DELETE /api/base/products/:id', () => {
    it('删除产品', async () => {
      // 先创建一个用于删除的产品
      const createResponse = await request(app.getHttpServer())
        .post('/api/base/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'PROD-TEST-DELETE',
          name: '待删除产品',
          category: '测试',
          specification: '规格',
          unit: '个',
        })
        .expect(201);

      const productIdToDelete = createResponse.body.id;

      // 删除产品
      await request(app.getHttpServer())
        .delete(`/api/base/products/${productIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // 验证产品已被删除
      await request(app.getHttpServer())
        .get(`/api/base/products/${productIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
