#!/bin/bash

# Git Commit Message Hook
# 验证提交信息是否符合规范

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# 提交信息规范正则表达式
# feat: 新功能
# fix: 修复 bug
# docs: 文档更新
# style: 代码格式调整
# refactor: 重构
# test: 测试相关
# chore: 构建/工具链
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"

if ! [[ $commit_msg =~ $pattern ]]; then
    echo ""
    echo "❌ 提交信息格式不正确!"
    echo ""
    echo "请遵循以下格式:"
    echo "  <type>(<scope>): <subject>"
    echo ""
    echo "type 可选值:"
    echo "  feat:     新功能"
    echo "  fix:      修复 bug"
    echo "  docs:     文档更新"
    echo "  style:    代码格式调整"
    echo "  refactor: 重构"
    echo "  test:     测试相关"
    echo "  chore:    构建/工具链"
    echo ""
    echo "示例:"
    echo "  feat(user): 添加用户登录功能"
    echo "  fix(order): 修复订单金额计算错误"
    echo "  docs: 更新 API 文档"
    echo ""
    exit 1
fi

exit 0
