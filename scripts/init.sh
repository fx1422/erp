#!/bin/bash

# ERP 项目初始化脚本

set -e

echo "🚀 ERP 项目初始化脚本"
echo "===================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 20+"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  未检测到 Docker，请手动安装或使用其他方式启动数据库"
else
    echo "✅ Docker 版本：$(docker -v)"
fi

# 初始化后端
echo ""
echo "📦 初始化后端..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cp .env.example .env 2>/dev/null || true
echo "✅ 后端初始化完成"

# 初始化前端
echo ""
echo "📦 初始化前端..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "✅ 前端初始化完成"

# 设置 Git hooks
echo ""
echo "🔧 设置 Git hooks..."
cd ..
if [ -d ".git" ]; then
    mkdir -p .git/hooks
    cp scripts/commit-msg.sh .git/hooks/commit-msg
    cp scripts/pre-commit.sh .git/hooks/pre-commit
    chmod +x .git/hooks/commit-msg
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks 设置完成"
else
    echo "⚠️  未检测到 Git 仓库，跳过 hooks 设置"
fi

# 启动 Docker 服务
echo ""
echo "🐳 启动 Docker 服务..."
if command -v docker &> /dev/null; then
    docker-compose up -d postgres redis
    echo "✅ Docker 服务已启动"
    echo ""
    echo "等待数据库初始化..."
    sleep 5
else
    echo "⚠️  Docker 不可用，请手动启动 PostgreSQL 和 Redis"
fi

echo ""
echo "===================="
echo "✨ 初始化完成!"
echo ""
echo "启动开发环境:"
echo "  后端：cd backend && npm run start:dev"
echo "  前端：cd frontend && npm run dev"
echo ""
echo "或使用 Docker Compose 启动所有服务:"
echo "  docker-compose up -d"
echo ""
