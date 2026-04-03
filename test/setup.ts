/**
 * 测试全局设置文件
 * 在每个测试文件执行前运行
 */

import { beforeAll, afterAll, vi } from 'vitest';

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/erp_test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

// 全局 Mock
beforeAll(() => {
  // 可以在这里设置全局的 mock
  console.log('测试环境初始化完成');
});

afterAll(() => {
  // 清理全局资源
  console.log('测试环境清理完成');
});

// 导出测试辅助函数
export function createMockUser(overrides = {}) {
  return {
    id: `test-user-${Date.now()}`,
    username: `testuser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'Test@123456',
    enabled: true,
    ...overrides,
  };
}

export function createMockProduct(overrides = {}) {
  return {
    id: `test-product-${Date.now()}`,
    code: `PROD-TEST-${Date.now()}`,
    name: '测试产品',
    category: '电子产品',
    specification: '规格',
    unit: '个',
    price: 99.99,
    enabled: true,
    ...overrides,
  };
}

export function createMockSupplier(overrides = {}) {
  return {
    id: `test-supplier-${Date.now()}`,
    code: `SUP-TEST-${Date.now()}`,
    name: '测试供应商',
    contactPerson: '张三',
    phone: '13800138000',
    email: 'supplier@test.com',
    enabled: true,
    ...overrides,
  };
}

export function createMockCustomer(overrides = {}) {
  return {
    id: `test-customer-${Date.now()}`,
    code: `CUS-TEST-${Date.now()}`,
    name: '测试客户',
    contactPerson: '李四',
    phone: '13900139000',
    email: 'customer@test.com',
    enabled: true,
    ...overrides,
  };
}
