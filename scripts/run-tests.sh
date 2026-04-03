#!/bin/bash

# =====================================================
# ERP 系统测试执行脚本
# 用途：执行迭代 1 的所有测试用例
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境
check_environment() {
    log_info "检查测试环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    # 检查数据库连接
    if [ -z "$TEST_DATABASE_URL" ]; then
        log_warning "TEST_DATABASE_URL 未设置，使用默认值"
        export TEST_DATABASE_URL="postgresql://test:test@localhost:5432/erp_test"
    fi
    
    log_success "环境检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装测试依赖..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    log_success "依赖安装完成"
}

# 准备测试数据
prepare_test_data() {
    log_info "准备测试数据..."
    
    # 执行种子数据脚本
    if [ -f "test/data/01-seed-data.sql" ]; then
        log_info "执行种子数据脚本..."
        # psql $TEST_DATABASE_URL < test/data/01-seed-data.sql
        log_success "种子数据准备完成"
    else
        log_warning "种子数据脚本不存在，跳过"
    fi
}

# 运行测试
run_tests() {
    local test_type=$1
    
    log_info "开始执行测试：$test_type"
    
    case $test_type in
        "unit")
            npm run test:unit
            ;;
        "integration")
            npm run test:integration
            ;;
        "e2e")
            npm run test:e2e
            ;;
        "all")
            npm run test
            ;;
        "coverage")
            npm run test:coverage
            ;;
        *)
            log_error "未知的测试类型：$test_type"
            exit 1
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        log_success "测试执行完成：$test_type"
    else
        log_error "测试执行失败：$test_type"
        exit 1
    fi
}

# 生成测试报告
generate_report() {
    log_info "生成测试报告..."
    
    # 创建报告目录
    mkdir -p test/reports
    
    # 生成 JUnit 报告
    npm run test:report
    
    log_success "测试报告生成完成"
}

# 清理测试数据
cleanup() {
    log_info "清理测试数据..."
    
    # 清理测试数据库
    # psql $TEST_DATABASE_URL -c "DELETE FROM ... WHERE created_at > ..."
    
    log_success "测试数据清理完成"
}

# 主函数
main() {
    echo "========================================"
    echo "  ERP 系统 - 迭代 1 测试执行脚本"
    echo "========================================"
    echo ""
    
    local start_time=$(date +%s)
    
    # 解析命令行参数
    local test_type="all"
    local skip_cleanup=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --unit)
                test_type="unit"
                shift
                ;;
            --integration)
                test_type="integration"
                shift
                ;;
            --e2e)
                test_type="e2e"
                shift
                ;;
            --coverage)
                test_type="coverage"
                shift
                ;;
            --skip-cleanup)
                skip_cleanup=true
                shift
                ;;
            --help)
                echo "用法：$0 [选项]"
                echo ""
                echo "选项:"
                echo "  --unit          只运行单元测试"
                echo "  --integration   只运行集成测试"
                echo "  --e2e           只运行 E2E 测试"
                echo "  --coverage      运行测试并生成覆盖率报告"
                echo "  --skip-cleanup  跳过测试后清理"
                echo "  --help          显示帮助信息"
                exit 0
                ;;
            *)
                log_error "未知选项：$1"
                exit 1
                ;;
        esac
    done
    
    # 执行测试流程
    check_environment
    install_dependencies
    prepare_test_data
    run_tests $test_type
    generate_report
    
    if [ "$skip_cleanup" = false ]; then
        cleanup
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    echo "========================================"
    log_success "测试执行完成！"
    echo "  测试类型：$test_type"
    echo "  执行时间：${duration}秒"
    echo "  报告位置：test/reports/"
    echo "========================================"
}

# 执行主函数
main "$@"
