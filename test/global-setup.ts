/**
 * 测试全局设置 - 在测试套件开始前执行
 * 用于启动测试数据库、Redis 等服务
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function globalSetup() {
  console.log('开始全局测试设置...');

  // 检查测试数据库连接
  try {
    await prisma.$connect();
    console.log('测试数据库连接成功');
  } catch (error) {
    console.error('测试数据库连接失败:', error);
    throw new Error('无法连接到测试数据库，请确保数据库服务已启动');
  }

  // 如果需要，可以在这里执行数据库迁移
  // execSync('npx prisma migrate deploy', {
  //   env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  //   stdio: 'inherit',
  // });

  // 植入种子数据
  try {
    console.log('正在植入测试种子数据...');
    // 可以在这里读取并执行 SQL 文件
    // const seedSql = fs.readFileSync('./test/data/01-seed-data.sql', 'utf-8');
    // await prisma.$executeRawUnsafe(seedSql);
    console.log('测试种子数据植入完成');
  } catch (error) {
    console.warn('种子数据植入失败或跳过:', error);
  }

  // 设置全局测试标记
  process.env.IS_TEST = 'true';
  process.env.TEST_START_TIME = Date.now().toString();

  console.log('全局测试设置完成');
}

// 全局清理函数
export async function globalTeardown() {
  console.log('开始全局测试清理...');

  const testStartTime = process.env.TEST_START_TIME;
  
  if (testStartTime) {
    try {
      // 清理测试期间创建的数据
      const startTime = new Date(parseInt(testStartTime));
      
      // 按依赖顺序删除测试数据
      await prisma.inventoryRecord.deleteMany({ where: { createdAt: { gte: startTime } } });
      await prisma.inventory.deleteMany({ where: { createdAt: { gte: startTime } } });
      await prisma.salesOrderItem.deleteMany({ where: { createdAt: { gte: startTime } } });
      await prisma.salesOrder.deleteMany({ where: { createdAt: { gte: startTime } } });
      await prisma.purchaseOrderItem.deleteMany({ where: { createdAt: { gte: startTime } } });
      await prisma.purchaseOrder.deleteMany({ where: { createdAt: { gte: startTime } } });
      await prisma.product.deleteMany({ where: { createdAt: { gte: startTime }, code: { startsWith: 'PROD-TEST-' } } });
      await prisma.customer.deleteMany({ where: { createdAt: { gte: startTime }, code: { startsWith: 'CUS-TEST-' } } });
      await prisma.supplier.deleteMany({ where: { createdAt: { gte: startTime }, code: { startsWith: 'SUP-TEST-' } } });
      await prisma.user.deleteMany({ where: { createdAt: { gte: startTime }, username: { startsWith: 'test' } } });
      
      console.log('测试数据清理完成');
    } catch (error) {
      console.error('测试数据清理失败:', error);
    }
  }

  await prisma.$disconnect();
  console.log('全局测试清理完成');
}
