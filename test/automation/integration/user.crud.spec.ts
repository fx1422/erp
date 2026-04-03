/**
 * 用户管理模块测试 - CRUD 操作
 * 测试文件：user.crud.spec.ts
 * 测试框架：Vitest + Supertest
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('UserController (e2e) - 用户 CRUD 操作', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // 创建测试模块
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();

    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        id: 'test-admin-001',
        username: 'admin',
        password: hashedPassword,
        email: 'admin@erp.com',
        realName: '系统管理员',
        enabled: true,
      },
    });

    // 登录获取 Token
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
    await prisma.user.deleteMany({
      where: {
        username: { in: ['admin', 'testuser01', 'testuser02'] },
      },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/system/users', () => {
    it('USR-001: 创建用户成功', async () => {
      const userData = {
        username: 'testuser01',
        password: 'Test@123',
        email: 'testuser01@example.com',
        realName: '测试用户 01',
      };

      const response = await request(app.getHttpServer())
        .post('/api/system/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('testuser01');
      expect(response.body.email).toBe('testuser01@example.com');
      expect(response.body.password).toBeUndefined();

      testUserId = response.body.id;
    });

    it('USR-002: 创建用户失败 - 用户名重复', async () => {
      const userData = {
        username: 'admin', // 已存在的用户名
        password: 'Test@123',
        email: 'testuser02@example.com',
      };

      const response = await request(app.getHttpServer())
        .post('/api/system/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('用户名已存在');
    });

    it('USR-003: 创建用户失败 - 缺少必填字段', async () => {
      const userData = {
        username: 'testuser03',
        // 缺少 password 和 email
      };

      const response = await request(app.getHttpServer())
        .post('/api/system/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/system/users', () => {
    it('USR-004: 查询用户列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/system/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('username');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  describe('GET /api/system/users/:id', () => {
    it('USR-005: 查询用户详情', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/system/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(testUserId);
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('roles');
    });

    it('USR-006: 查询用户详情 - 用户不存在', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/system/users/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('用户不存在');
    });
  });

  describe('PATCH /api/system/users/:id', () => {
    it('USR-007: 更新用户信息', async () => {
      const updateData = {
        email: 'newemail@example.com',
        phone: '13800138000',
        realName: '新名字',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/system/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.email).toBe('newemail@example.com');
      expect(response.body.phone).toBe('13800138000');
      expect(response.body.realName).toBe('新名字');
    });

    it('USR-009: 启用/禁用用户', async () => {
      // 禁用用户
      const disableResponse = await request(app.getHttpServer())
        .patch(`/api/system/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ enabled: false })
        .expect(200);

      expect(disableResponse.body.enabled).toBe(false);

      // 重新启用用户
      const enableResponse = await request(app.getHttpServer())
        .patch(`/api/system/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ enabled: true })
        .expect(200);

      expect(enableResponse.body.enabled).toBe(true);
    });
  });

  describe('DELETE /api/system/users/:id', () => {
    it('USR-008: 删除用户', async () => {
      // 先创建一个用于删除的用户
      const createResponse = await request(app.getHttpServer())
        .post('/api/system/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'testuser_delete',
          password: 'Test@123',
          email: 'delete@example.com',
        })
        .expect(201);

      const userIdToDelete = createResponse.body.id;

      // 删除用户
      await request(app.getHttpServer())
        .delete(`/api/system/users/${userIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // 验证用户已被删除
      await request(app.getHttpServer())
        .get(`/api/system/users/${userIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
