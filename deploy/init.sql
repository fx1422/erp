-- ERP 系统数据库初始化脚本

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 系统管理模块表

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    real_name VARCHAR(50),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色表
CREATE TABLE IF NOT EXISTS sys_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 权限表
CREATE TABLE IF NOT EXISTS sys_permission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    path VARCHAR(200),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES sys_user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES sys_role(id) ON DELETE CASCADE
);

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS sys_role_permission (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES sys_role(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES sys_permission(id) ON DELETE CASCADE
);

-- 基础数据模块表

-- 部门表
CREATE TABLE IF NOT EXISTS base_department (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    parent_id UUID,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES base_department(id)
);

-- 供应商表
CREATE TABLE IF NOT EXISTS base_supplier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    bank_info TEXT,
    tax_id VARCHAR(50),
    enabled BOOLEAN DEFAULT true,
    rating VARCHAR(10) DEFAULT 'A',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 客户表
CREATE TABLE IF NOT EXISTS base_customer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    tax_id VARCHAR(50),
    enabled BOOLEAN DEFAULT true,
    level VARCHAR(10) DEFAULT 'A',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 产品表
CREATE TABLE IF NOT EXISTS base_product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    specification VARCHAR(100),
    unit VARCHAR(20),
    price DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    description VARCHAR(500),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 采购管理模块表

-- 采购订单表
CREATE TABLE IF NOT EXISTS proc_purchase_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    remark VARCHAR(500),
    order_date TIMESTAMP,
    expected_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES base_supplier(id)
);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS proc_purchase_order_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES proc_purchase_order(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES base_product(id)
);

-- 销售管理模块表

-- 销售订单表
CREATE TABLE IF NOT EXISTS sales_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    remark VARCHAR(500),
    order_date TIMESTAMP,
    delivery_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES base_customer(id)
);

-- 销售订单明细表
CREATE TABLE IF NOT EXISTS sales_order_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    shipped_quantity INTEGER DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES sales_order(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES base_product(id)
);

-- 库存管理模块表

-- 库存表
CREATE TABLE IF NOT EXISTS inv_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    warehouse_id VARCHAR(50) DEFAULT 'WH001',
    warehouse_name VARCHAR(100) DEFAULT '主仓库',
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, warehouse_id),
    FOREIGN KEY (product_id) REFERENCES base_product(id)
);

-- 库存记录表
CREATE TABLE IF NOT EXISTS inv_inventory_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    warehouse_id VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    before_quantity INTEGER NOT NULL,
    after_quantity INTEGER NOT NULL,
    remark VARCHAR(500),
    related_order_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES base_product(id)
);

-- 创建索引
CREATE INDEX idx_sys_user_username ON sys_user(username);
CREATE INDEX idx_sys_role_code ON sys_role(code);
CREATE INDEX idx_base_product_code ON base_product(code);
CREATE INDEX idx_proc_purchase_order_supplier ON proc_purchase_order(supplier_id);
CREATE INDEX idx_sales_order_customer ON sales_order(customer_id);
CREATE INDEX idx_inv_inventory_product ON inv_inventory(product_id);

-- 插入默认数据

-- 默认管理员用户 (密码：admin123)
INSERT INTO sys_user (username, password, email, real_name) VALUES
('admin', '$2b$10$XoLvF5C2dz9.7VqKJ8hLpOYqGz1xRz4Kx5J6L8M9N0P1Q2R3S4T5U', 'admin@erp.com', '系统管理员')
ON CONFLICT (username) DO NOTHING;

-- 默认角色
INSERT INTO sys_role (code, name, description) VALUES
('admin', '系统管理员', '拥有所有权限'),
('user', '普通用户', '基础操作权限')
ON CONFLICT (code) DO NOTHING;

-- 默认权限
INSERT INTO sys_permission (code, name, type, path) VALUES
('system:user:view', '查看用户', 'button', '/system/users'),
('system:user:add', '新增用户', 'button', '/system/users'),
('system:user:edit', '编辑用户', 'button', '/system/users'),
('system:user:delete', '删除用户', 'button', '/system/users'),
('system:role:view', '查看角色', 'button', '/system/roles'),
('system:role:add', '新增角色', 'button', '/system/roles'),
('system:role:edit', '编辑角色', 'button', '/system/roles'),
('system:role:delete', '删除角色', 'button', '/system/roles')
ON CONFLICT (code) DO NOTHING;
