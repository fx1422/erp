/**
 * Vitest 测试配置文件
 * 用于配置单元测试和集成测试
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',
    
    // 测试文件匹配模式
    include: ['test/automation/**/*.spec.ts'],
    
    // 排除的文件
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.e2e.spec.ts'],
    
    // 测试超时时间（毫秒）
    testTimeout: 30000,
    
    // 钩子超时时间（毫秒）
    hookTimeout: 30000,
    
    // 是否开启覆盖率
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.e2e.spec.ts',
        'src/main.ts',
        'src/**/*.module.ts',
        'src/**/*.entity.ts',
        'src/**/*.dto.ts',
        'node_modules/**',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
    },
    
    // 测试报告配置
    reporters: ['default', 'junit'],
    
    // JUnit 报告输出文件
    outputFile: {
      junit: './reports/junit-report.xml',
    },
    
    // 是否监听文件变化
    watch: false,
    
    // 是否并行执行测试
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 2,
        maxThreads: 4,
      },
    },
    
    // 全局测试设置
    setupFiles: ['./test/setup.ts'],
    
    // 全局测试钩子
    globalSetup: ['./test/global-setup.ts'],
    
    // 模拟导入
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
});
