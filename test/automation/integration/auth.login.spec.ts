/**
 * 认证模块测试 - 登录功能
 * 测试文件：auth.login.spec.ts
 * 测试框架：Vitest + Supertest
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e) - 登录功能', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // 创建测试模块
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();

    // 准备测试数据 - 创建测试用户
    const hashedPassword = await bcrypt.hash('Test@123456', 10);
    
    await prisma.user.upsert({
      where: { username: 'testuser' },
      update: {},
      create: {
        id: 'test-user-001',
        username: 'testuser',
        password: hashedPassword,
        email: 'testuser@example.com',
        enabled: true,
      },
    });

    // 创建禁用用户
    await prisma.user.upsert({
      where: { username: 'disableduser' },
      update: {},
      create: {
        id: 'test-user-002',
        username: 'disableduser',
        password: hashedPassword,
        email: 'disabled@example.com',
        enabled: false,
      },
    });
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.user.deleteMany({
      where: {
        username: { in: ['testuser', 'disableduser'] },
      },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('AUTH-001: 用户登录成功', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test@123456',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.password).toBeUndefined(); // 不应返回密码
    });

    it('AUTH-002: 用户登录失败 - 密码错误', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('密码');
    });

    it('AUTH-003: 用户登录失败 - 账号不存在', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'AnyPassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('用户');
    });

    it('AUTH-004: 用户登录失败 - 账号已禁用', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'disableduser',
          password: 'Test@123456',
        })
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('禁用');
    });

    it('登录失败 - 缺少必填字段', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          // 缺少 password
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('登录失败 - 用户名为空', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: '',
          password: 'Test@123456',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });
});
