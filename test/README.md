# ERP 系统测试文档

本目录包含 ERP 系统 MVP 版本（迭代 1）的完整测试资料。

---

## 📁 目录结构

```
test/
├── test-cases/              # 测试用例文档
│   ├── 01-系统管理测试用例.md
│   ├── 02-基础数据测试用例.md
│   ├── 03-采购管理测试用例.md
│   ├── 04-销售管理测试用例.md
│   └── 05-库存管理测试用例.md
├── data/                    # 测试数据
│   └── 01-seed-data.sql    # 种子数据 SQL 脚本
├── automation/              # 自动化测试代码
│   ├── unit/               # 单元测试
│   ├── integration/        # 集成测试
│   │   ├── auth.login.spec.ts
│   │   ├── user.crud.spec.ts
│   │   ├── product.crud.spec.ts
│   │   ├── purchase.order.spec.ts
│   │   ├── sales.order.spec.ts
│   │   └── inventory.warning.spec.ts
│   └── e2e/                # E2E 测试（待实现）
├── reports/                 # 测试报告
│   └── test-report-template.md
├── setup.ts                 # 测试设置
├── global-setup.ts          # 全局测试设置
└── vitest.config.ts         # Vitest 配置
```

---

## 🚀 快速开始

### 前置条件

1. Node.js >= 18.0.0
2. PostgreSQL >= 15.0
3. npm >= 9.0.0

### 安装依赖

```bash
cd /home/admin/.openclaw/workspace/erp
npm install
```

### 配置测试数据库

```bash
# 设置测试数据库连接字符串
export TEST_DATABASE_URL="postgresql://test:test@localhost:5432/erp_test"

# 创建测试数据库
createdb -U postgres erp_test

# 执行数据库迁移
npx prisma migrate deploy --schema=backend/prisma/schema.prisma
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行集成测试
npm run test:integration

# 运行特定测试文件
npx vitest run test/automation/integration/auth.login.spec.ts

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试并生成 JUnit 报告
npm run test:report
```

### 使用测试脚本

```bash
# 执行所有测试
./scripts/run-tests.sh

# 只运行集成测试
./scripts/run-tests.sh --integration

# 运行测试并生成覆盖率
./scripts/run-tests.sh --coverage

# 跳过测试后清理
./scripts/run-tests.sh --skip-cleanup
```

---

## 📋 测试用例统计

### 迭代 1 测试范围

| 模块 | 用例数 | 优先级分布 |
|------|--------|-----------|
| 系统管理 | 17 | P0: 14, P1: 3 |
| 基础数据 | 24 | P0: 19, P1: 5 |
| 采购管理 | 12 | P0: 12, P1: 0 |
| 销售管理 | 11 | P0: 9, P1: 2 |
| 库存管理 | 16 | P0: 8, P1: 8 |
| **总计** | **80** | **P0: 62, P1: 18** |

### 测试类型分布

| 测试类型 | 文件数 | 用例数 | 说明 |
|----------|--------|--------|------|
| 单元测试 | 0 | 0 | 服务层单元测试（待补充） |
| 集成测试 | 6 | 50+ | API 接口集成测试 |
| E2E 测试 | 0 | 0 | 端到端流程测试（待实现） |

---

## 🧪 测试用例说明

### 系统管理测试 (01-系统管理测试用例.md)

**测试范围**:
- 用户登录/登出 (AUTH-001 ~ AUTH-005)
- 用户 CRUD 操作 (USR-001 ~ USR-009)
- 角色管理 (ROLE-001 ~ ROLE-005)
- 权限验证 (PERM-001 ~ PERM-004)

**自动化脚本**:
- `test/automation/integration/auth.login.spec.ts` - 登录测试
- `test/automation/integration/user.crud.spec.ts` - 用户 CRUD 测试

### 基础数据测试 (02-基础数据测试用例.md)

**测试范围**:
- 部门管理 (DEPT-001 ~ DEPT-006)
- 供应商管理 (SUP-001 ~ SUP-006)
- 客户管理 (CUS-001 ~ CUS-006)
- 产品管理 (PROD-001 ~ PROD-006)

**自动化脚本**:
- `test/automation/integration/product.crud.spec.ts` - 产品 CRUD 测试

### 采购管理测试 (03-采购管理测试用例.md)

**测试范围**:
- 采购申请流程 (PUR-001 ~ PUR-004)
- 采购订单流程 (PUR-011 ~ PUR-015)
- 采购入库流程 (PUR-021 ~ PUR-024)

**自动化脚本**:
- `test/automation/integration/purchase.order.spec.ts` - 采购订单测试

### 销售管理测试 (04-销售管理测试用例.md)

**测试范围**:
- 销售报价流程 (SAL-001 ~ SAL-003)
- 销售订单流程 (SAL-011 ~ SAL-014)
- 销售出库流程 (SAL-021 ~ SAL-023)

**自动化脚本**:
- `test/automation/integration/sales.order.spec.ts` - 销售订单测试

### 库存管理测试 (05-库存管理测试用例.md)

**测试范围**:
- 入库操作 (INV-001 ~ INV-003)
- 出库操作 (INV-011 ~ INV-014)
- 库存台账查询 (INV-021 ~ INV-023)
- 库存预警 (INV-031 ~ INV-034)

**自动化脚本**:
- `test/automation/integration/inventory.warning.spec.ts` - 库存预警测试

---

## 📊 测试报告

### 生成测试报告

```bash
# 生成 JUnit 格式报告
npm run test:report

# 生成 HTML 覆盖率报告
npm run test:coverage

# 查看报告
open test/reports/junit-report.xml
open coverage/index.html
```

### 测试报告模板

使用 `test/reports/test-report-template.md` 作为测试报告模板，填充实际测试结果后生成正式报告。

---

## 🔧 测试工具

### 测试框架

- **Vitest** - 测试运行器
- **Supertest** - HTTP 接口测试
- **@prisma/client** - 数据库操作

### 辅助工具

- **@faker-js/faker** - 生成测试数据
- **bcrypt** - 密码加密

### 报告工具

- **JUnit Reporter** - JUnit 格式报告
- **Vitest Coverage** - 代码覆盖率报告

---

## 📝 测试数据管理

### 种子数据

`test/data/01-seed-data.sql` 包含测试所需的基础数据：

- 系统用户（管理员、采购员、销售员、仓管员）
- 角色和权限
- 部门组织架构
- 供应商和客户
- 产品和库存
- 采购和销售订单示例

### 数据清理

测试完成后自动清理测试数据，或手动执行：

```bash
# 清理测试期间创建的数据
psql $TEST_DATABASE_URL -c "DELETE FROM ... WHERE created_at > ..."
```

---

## 🐛 缺陷管理

### 缺陷等级定义

| 等级 | 名称 | 定义 | 修复时限 |
|------|------|------|----------|
| P0 | 致命 | 系统崩溃、数据丢失 | 24 小时 |
| P1 | 严重 | 主要功能失效 | 48 小时 |
| P2 | 一般 | 次要功能问题 | 1 周 |
| P3 | 轻微 | 体验优化问题 | 下一版本 |

### 缺陷报告模板

```markdown
## 缺陷标题
[模块] 简短描述问题

## 基本信息
- **缺陷 ID**: BUG-XXX
- **严重程度**: P1
- **发现版本**: v1.0.0
- **测试环境**: Chrome / Node.js 20

## 复现步骤
1. 步骤一
2. 步骤二

## 预期结果
应该发生什么

## 实际结果
实际发生了什么
```

---

## 📚 参考文档

- [测试计划文档](../docs/02-测试计划.md)
- [产品需求文档](../docs/01-产品需求文档.md)
- [数据库 ER 图设计](../docs/02-数据库 ER 图设计.md)

---

## 📞 联系方式

如有测试相关问题，请联系测试团队。

---

**文档版本**: v1.0  
**创建日期**: 2026-04-03  
**最后更新**: 2026-04-03
