#!/bin/bash

# Git Pre-commit Hook
# 在提交前执行代码检查

echo "🔍 执行提交前检查..."

# 检查是否有 TypeScript 文件
if git diff --cached --name-only | grep -q "\.ts$"; then
    echo "⚠️  检测到 TypeScript 文件，请确保已编译通过"
    
    # 如果在 backend 目录
    if [ -d "backend" ]; then
        cd backend
        if ! npm run build --silent > /dev/null 2>&1; then
            echo "❌ 后端 TypeScript 编译失败，请修复错误后提交"
            exit 1
        fi
        cd ..
        echo "✅ 后端编译通过"
    fi
    
    # 如果在 frontend 目录
    if [ -d "frontend" ]; then
        cd frontend
        if ! npm run build --silent > /dev/null 2>&1; then
            echo "❌ 前端 TypeScript 编译失败，请修复错误后提交"
            exit 1
        fi
        cd ..
        echo "✅ 前端编译通过"
    fi
fi

echo "✅ 提交前检查通过"
exit 0
