# ERP 系统

企业资源规划 (ERP) 系统 - 基于 NestJS + Vue 3 的全栈解决方案

## 📋 项目概述

本 ERP 系统是为中小型企业设计的可本地部署的企业资源管理平台，整合企业各部门业务流程，实现数据共享和业务流程自动化。

### 核心功能模块

- ✅ **系统管理**: 用户管理、角色权限、系统配置
- ✅ **基础数据**: 组织架构、供应商、客户、产品管理
- ✅ **采购管理**: 采购申请、订单、入库管理
- ✅ **销售管理**: 销售报价、订单、出库管理
- ✅ **库存管理**: 出入库、库存台账、预警

## 🛠️ 技术栈

### 后端
- **框架**: NestJS 11 + TypeScript
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **ORM**: TypeORM
- **认证**: JWT

### 前端
- **框架**: Vue 3 + TypeScript
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **构建工具**: Vite
- **HTTP 客户端**: Axios

### 部署
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx

## 🚀 快速开始

### 环境要求

- Node.js 20+
- Docker & Docker Compose
- MySQL 8.0+ (或使用 Docker)
- Redis 7+ (或使用 Docker)

### 开发环境启动

#### 1. 克隆项目
```bash
git clone <repository-url>
cd erp
```

#### 2. 启动数据库和缓存
```bash
docker-compose up -d mysql redis
```

#### 3. 启动后端
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

#### 4. 启动前端
```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173 查看前端应用

### 生产环境部署

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📁 项目结构

```
erp/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   │   ├── system/     # 系统管理
│   │   │   ├── base-data/  # 基础数据
│   │   │   ├── procurement/# 采购管理
│   │   │   ├── sales/      # 销售管理
│   │   │   └── inventory/  # 库存管理
│   │   ├── common/         # 公共模块
│   │   └── config/         # 配置
│   ├── test/               # 测试文件
│   └── Dockerfile
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── components/    # 公共组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # 状态管理
│   │   ├── api/           # API 接口
│   │   └── utils/         # 工具函数
│   └── Dockerfile
├── docs/                   # 文档
│   ├── 01-产品需求文档.md
│   └── 02-数据库 ER 图设计.md
├── deploy/                 # 部署配置
│   ├── init.sql           # 数据库初始化
│   └── nginx.conf         # Nginx 配置
├── scripts/                # 脚本工具
├── docker-compose.yml      # Docker 编排
└── .github/workflows/      # CI/CD 配置
```

## 🔐 默认账号

- 用户名：`admin`
- 密码：`admin123`

⚠️ **重要**: 首次部署后请立即修改默认密码！

## 📝 API 文档

启动后端后访问：http://localhost:3000/api

### 主要接口

#### 认证
- `POST /api/auth/login` - 用户登录

#### 系统管理
- `GET /api/system/users` - 获取用户列表
- `POST /api/system/users` - 创建用户
- `PATCH /api/system/users/:id` - 更新用户
- `DELETE /api/system/users/:id` - 删除用户
- `GET /api/system/roles` - 获取角色列表

#### 基础数据
- `GET /api/base/departments` - 获取部门列表
- `GET /api/base/suppliers` - 获取供应商列表
- `GET /api/base/customers` - 获取客户列表
- `GET /api/base/products` - 获取产品列表

#### 采购管理
- `GET /api/procurement/orders` - 获取采购订单列表
- `POST /api/procurement/orders` - 创建采购订单

#### 销售管理
- `GET /api/sales/orders` - 获取销售订单列表
- `POST /api/sales/orders` - 创建销售订单

#### 库存管理
- `GET /api/inventory` - 获取库存列表

## 🔧 开发规范

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链
```

示例:
```bash
git commit -m "feat(user): 添加用户登录功能"
git commit -m "fix(order): 修复订单金额计算错误"
```

### 分支策略

- `main` - 生产分支
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复

## 📊 数据库设计

详见 [数据库 ER 图设计文档](docs/02-数据库 ER 图设计.md)

## 🧪 测试

```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📞 联系方式

如有问题，请通过 Issue 反馈。

---

**版本**: v1.0.0  
**更新日期**: 2026-04-03
