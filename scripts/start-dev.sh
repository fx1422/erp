#!/bin/bash

# ERP 系统本地开发启动脚本
# 使用方式：./scripts/start-dev.sh

set -e

echo "🚀 ERP 系统 - 本地开发环境启动"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 MySQL 是否运行
check_mysql() {
    if command -v mysql &> /dev/null; then
        if mysqladmin ping -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" &> /dev/null; then
            echo -e "${GREEN}✓ MySQL 已运行${NC}"
            return 0
        fi
    fi
    echo -e "${YELLOW}⚠ MySQL 未运行，请手动启动${NC}"
    return 1
}

# 检查 Redis 是否运行
check_redis() {
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping &> /dev/null; then
            echo -e "${GREEN}✓ Redis 已运行${NC}"
            return 0
        fi
    fi
    echo -e "${YELLOW}⚠ Redis 未运行，请手动启动${NC}"
    return 1
}

# 启动后端
start_backend() {
    echo ""
    echo "📦 启动后端服务..."
    cd "$(dirname "$0")/../backend"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}安装后端依赖...${NC}"
        npm install
    fi
    
    # 后台启动后端
    npm run start:dev &
    BACKEND_PID=$!
    echo -e "${GREEN}✓ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
    echo "  访问：http://localhost:3000"
}

# 启动前端
start_frontend() {
    echo ""
    echo "🎨 启动前端服务..."
    cd "$(dirname "$0")/../frontend"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}安装前端依赖...${NC}"
        npm install
    fi
    
    # 后台启动前端
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
    echo "  访问：http://localhost:5173"
}

# 主流程
main() {
    echo ""
    echo "📋 环境检查..."
    check_mysql || true
    check_redis || true
    
    echo ""
    echo "⚠️  注意：如果使用 Docker 运行数据库，请先执行:"
    echo "   docker-compose up -d mysql redis"
    echo ""
    echo "或者使用系统已安装的 MySQL/Redis 服务"
    echo ""
    
    read -p "是否继续启动前后端服务？[y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
    
    start_backend
    start_frontend
    
    echo ""
    echo "================================"
    echo -e "${GREEN}✅ 所有服务已启动!${NC}"
    echo ""
    echo "📌 服务地址:"
    echo "   前端：http://localhost:5173"
    echo "   后端：http://localhost:3000"
    echo "   API:   http://localhost:3000/api"
    echo ""
    echo "🛑 停止服务：按 Ctrl+C 或运行 kill -9 $BACKEND_PID $FRONTEND_PID"
    echo ""
    
    # 等待进程
    wait
}

main "$@"
