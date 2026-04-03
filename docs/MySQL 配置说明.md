# MySQL 数据库配置说明

## 数据库已改为 MySQL

项目已从 PostgreSQL 迁移到 MySQL 8.0+。

## 快速启动 MySQL

### 方式 1：使用 Docker（推荐）

```bash
cd /home/admin/.openclaw/workspace/erp

# 启动 MySQL 和 Redis
docker-compose up -d mysql redis

# 查看日志
docker-compose logs -f mysql
```

### 方式 2：本地安装 MySQL

```bash
# Ubuntu/Debian
sudo apt-get install mysql-server-8.0

# 启动 MySQL
sudo systemctl start mysql

# 创建数据库
sudo mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS erp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON erp_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EOF

# 导入初始化脚本
mysql -u root -p erp_db < deploy/init-mysql.sql
```

## 数据库连接配置

编辑 `backend/.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=erp_db
```

## Docker Compose 配置

已更新的服务：
- `mysql` - MySQL 8.0 数据库（替代 postgres）
- `redis` - Redis 7 缓存
- `backend` - NestJS 后端
- `frontend` - Vue 3 前端
- `nginx` - Nginx 反向代理

## 启动命令

```bash
# 完整启动
docker-compose up -d

# 仅数据库和缓存
docker-compose up -d mysql redis

# 查看状态
docker-compose ps

# 停止
docker-compose down
```

## 访问地址

- 前端：http://localhost:80
- 后端 API：http://localhost:3000
- MySQL：localhost:3306
- Redis：localhost:6379

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 注意事项

1. MySQL 使用 VARCHAR(36) 存储 UUID
2. 字符集：utf8mb4
3. 排序规则：utf8mb4_unicode_ci
4. 引擎：InnoDB
5. 时间戳自动更新：`ON UPDATE CURRENT_TIMESTAMP`

---

**更新日期**: 2026-04-03
