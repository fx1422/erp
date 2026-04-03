-- =====================================================
-- ERP 系统 MVP 测试数据种子脚本
-- 创建日期：2026-04-03
-- 用途：为迭代 1 测试提供基础数据
-- =====================================================

-- 清空测试数据（按依赖顺序）
DELETE FROM sys_role_permission;
DELETE FROM sys_user_role;
DELETE FROM inv_inventory_record;
DELETE FROM inv_inventory;
DELETE FROM sales_order_item;
DELETE FROM sales_order;
DELETE FROM proc_purchase_order_item;
DELETE FROM proc_purchase_order;
DELETE FROM base_product;
DELETE FROM base_customer;
DELETE FROM base_supplier;
DELETE FROM base_department;
DELETE FROM sys_permission;
DELETE FROM sys_role;
DELETE FROM sys_user;

-- =====================================================
-- 1. 系统管理种子数据
-- =====================================================

-- 插入角色
INSERT INTO sys_role (id, code, name, description, created_at, updated_at) VALUES
  ('role-admin-001', 'admin', '系统管理员', '拥有系统所有权限', NOW(), NOW()),
  ('role-purchase-001', 'purchase_manager', '采购经理', '负责采购管理', NOW(), NOW()),
  ('role-sales-001', 'sales_manager', '销售经理', '负责销售管理', NOW(), NOW()),
  ('role-warehouse-001', 'warehouse_keeper', '仓管员', '负责库存管理', NOW(), NOW()),
  ('role-employee-001', 'employee', '普通员工', '基础权限', NOW(), NOW());

-- 插入权限
INSERT INTO sys_permission (id, code, name, type, path, enabled, created_at, updated_at) VALUES
  -- 系统管理权限
  ('perm-user-view', 'system:user:view', '查看用户', 'button', '/system/users', true, NOW(), NOW()),
  ('perm-user-create', 'system:user:create', '创建用户', 'button', '/system/users', true, NOW(), NOW()),
  ('perm-user-edit', 'system:user:edit', '编辑用户', 'button', '/system/users', true, NOW(), NOW()),
  ('perm-user-delete', 'system:user:delete', '删除用户', 'button', '/system/users', true, NOW(), NOW()),
  ('perm-role-view', 'system:role:view', '查看角色', 'button', '/system/roles', true, NOW(), NOW()),
  ('perm-role-create', 'system:role:create', '创建角色', 'button', '/system/roles', true, NOW(), NOW()),
  ('perm-role-edit', 'system:role:edit', '编辑角色', 'button', '/system/roles', true, NOW(), NOW()),
  ('perm-role-delete', 'system:role:delete', '删除角色', 'button', '/system/roles', true, NOW(), NOW()),
  -- 基础数据权限
  ('perm-dept-view', 'base:dept:view', '查看部门', 'button', '/base/departments', true, NOW(), NOW()),
  ('perm-dept-create', 'base:dept:create', '创建部门', 'button', '/base/departments', true, NOW(), NOW()),
  ('perm-supplier-view', 'base:supplier:view', '查看供应商', 'button', '/base/suppliers', true, NOW(), NOW()),
  ('perm-supplier-create', 'base:supplier:create', '创建供应商', 'button', '/base/suppliers', true, NOW(), NOW()),
  ('perm-customer-view', 'base:customer:view', '查看客户', 'button', '/base/customers', true, NOW(), NOW()),
  ('perm-customer-create', 'base:customer:create', '创建客户', 'button', '/base/customers', true, NOW(), NOW()),
  ('perm-product-view', 'base:product:view', '查看产品', 'button', '/base/products', true, NOW(), NOW()),
  ('perm-product-create', 'base:product:create', '创建产品', 'button', '/base/products', true, NOW(), NOW()),
  -- 采购管理权限
  ('perm-purchase-view', 'purchase:view', '查看采购', 'menu', '/procurement', true, NOW(), NOW()),
  ('perm-purchase-create', 'purchase:create', '创建采购', 'button', '/procurement/orders', true, NOW(), NOW()),
  -- 销售管理权限
  ('perm-sales-view', 'sales:view', '查看销售', 'menu', '/sales', true, NOW(), NOW()),
  ('perm-sales-create', 'sales:create', '创建销售', 'button', '/sales/orders', true, NOW(), NOW()),
  -- 库存管理权限
  ('perm-inventory-view', 'inventory:view', '查看库存', 'menu', '/inventory', true, NOW(), NOW()),
  ('perm-inbound-create', 'inventory:inbound:create', '创建入库', 'button', '/inventory/inbound', true, NOW(), NOW()),
  ('perm-outbound-create', 'inventory:outbound:create', '创建出库', 'button', '/inventory/outbound', true, NOW(), NOW());

-- 插入用户（密码统一为：Test@123456，bcrypt 加密后的哈希）
-- 注意：实际测试中应使用服务层的密码加密功能
INSERT INTO sys_user (id, username, password, email, phone, real_name, enabled, created_at, updated_at) VALUES
  ('user-admin-001', 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@erp.com', '13800000000', '系统管理员', true, NOW(), NOW()),
  ('user-purchase-001', 'purchase01', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'purchase@erp.com', '13800000001', '采购经理', true, NOW(), NOW()),
  ('user-sales-001', 'sales01', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'sales@erp.com', '13800000002', '销售经理', true, NOW(), NOW()),
  ('user-warehouse-001', 'warehouse01', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'warehouse@erp.com', '13800000003', '仓管员', true, NOW(), NOW()),
  ('user-employee-001', 'employee01', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employee@erp.com', '13800000004', '普通员工', true, NOW(), NOW()),
  ('user-disabled-001', 'disabled_user', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'disabled@erp.com', '13800000005', '禁用用户', false, NOW(), NOW());

-- 用户角色关联
INSERT INTO sys_user_role (user_id, role_id) VALUES
  ('user-admin-001', 'role-admin-001'),
  ('user-purchase-001', 'role-purchase-001'),
  ('user-sales-001', 'role-sales-001'),
  ('user-warehouse-001', 'role-warehouse-001'),
  ('user-employee-001', 'role-employee-001');

-- 角色权限关联（管理员拥有所有权限）
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
  ('role-admin-001', 'perm-user-view'),
  ('role-admin-001', 'perm-user-create'),
  ('role-admin-001', 'perm-user-edit'),
  ('role-admin-001', 'perm-user-delete'),
  ('role-admin-001', 'perm-role-view'),
  ('role-admin-001', 'perm-role-create'),
  ('role-admin-001', 'perm-role-edit'),
  ('role-admin-001', 'perm-role-delete'),
  ('role-admin-001', 'perm-dept-view'),
  ('role-admin-001', 'perm-dept-create'),
  ('role-admin-001', 'perm-supplier-view'),
  ('role-admin-001', 'perm-supplier-create'),
  ('role-admin-001', 'perm-customer-view'),
  ('role-admin-001', 'perm-customer-create'),
  ('role-admin-001', 'perm-product-view'),
  ('role-admin-001', 'perm-product-create'),
  ('role-admin-001', 'perm-purchase-view'),
  ('role-admin-001', 'perm-purchase-create'),
  ('role-admin-001', 'perm-sales-view'),
  ('role-admin-001', 'perm-sales-create'),
  ('role-admin-001', 'perm-inventory-view'),
  ('role-admin-001', 'perm-inbound-create'),
  ('role-admin-001', 'perm-outbound-create');

-- 采购经理权限
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
  ('role-purchase-001', 'perm-purchase-view'),
  ('role-purchase-001', 'perm-purchase-create'),
  ('role-purchase-001', 'perm-supplier-view'),
  ('role-purchase-001', 'perm-product-view');

-- 销售经理权限
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
  ('role-sales-001', 'perm-sales-view'),
  ('role-sales-001', 'perm-sales-create'),
  ('role-sales-001', 'perm-customer-view'),
  ('role-sales-001', 'perm-product-view');

-- 仓管员权限
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
  ('role-warehouse-001', 'perm-inventory-view'),
  ('role-warehouse-001', 'perm-inbound-create'),
  ('role-warehouse-001', 'perm-outbound-create'),
  ('role-warehouse-001', 'perm-product-view');

-- =====================================================
-- 2. 基础数据种子数据
-- =====================================================

-- 部门数据
INSERT INTO base_department (id, code, name, description, parent_id, enabled, created_at, updated_at) VALUES
  ('dept-001', 'DEPT001', '总公司', '集团总部', NULL, true, NOW(), NOW()),
  ('dept-002', 'DEPT002', '采购部', '负责采购业务', 'dept-001', true, NOW(), NOW()),
  ('dept-003', 'DEPT003', '销售部', '负责销售业务', 'dept-001', true, NOW(), NOW()),
  ('dept-004', 'DEPT004', '仓储部', '负责库存管理', 'dept-001', true, NOW(), NOW()),
  ('dept-005', 'DEPT005', '财务部', '负责财务管理', 'dept-001', true, NOW(), NOW()),
  ('dept-006', 'DEPT006', '研发部', '负责产品研发', 'dept-001', true, NOW(), NOW()),
  ('dept-007', 'DEPT007', '前端组', '前端开发团队', 'dept-006', true, NOW(), NOW()),
  ('dept-008', 'DEPT008', '后端组', '后端开发团队', 'dept-006', true, NOW(), NOW());

-- 供应商数据
INSERT INTO base_supplier (id, code, name, type, contact_person, phone, email, address, bank_info, tax_id, enabled, rating, created_at, updated_at) VALUES
  ('sup-001', 'SUP001', '北京电子供应商', '原材料供应商', '张三', '13800138000', 'zhangsan@bj-electronics.com', '北京市海淀区中关村大街 1 号', '工商银行 6222000000000001', '91110000000000001X', true, 'A', NOW(), NOW()),
  ('sup-002', 'SUP002', '上海机械供应商', '设备供应商', '李四', '13800138001', 'lisi@sh-machinery.com', '上海市浦东新区张江高科路 100 号', '建设银行 6227000000000002', '91310000000000002Y', true, 'AA', NOW(), NOW()),
  ('sup-003', 'SUP003', '深圳包装材料商', '包装材料供应商', '王五', '13800138002', 'wangwu@sz-packaging.com', '深圳市南山区科技园南路 50 号', '农业银行 6228000000000003', '91440000000000003Z', true, 'A', NOW(), NOW()),
  ('sup-004', 'SUP004', '广州化工供应商', '化工原料供应商', '赵六', '13800138003', 'zhaoliu@gz-chemical.com', '广州市天河区黄埔大道西 200 号', '中国银行 6229000000000004', '91440000000000004A', true, 'B', NOW(), NOW()),
  ('sup-005', 'SUP005', '杭州纺织品供应商', '纺织品供应商', '钱七', '13800138004', 'qianqi@hz-textiles.com', '杭州市西湖区文三路 300 号', '交通银行 6230000000000005', '91330000000000005B', true, 'A', NOW(), NOW());

-- 客户数据
INSERT INTO base_customer (id, code, name, type, contact_person, phone, email, address, tax_id, enabled, level, created_at, updated_at) VALUES
  ('cus-001', 'CUS001', '华为技术有限公司', '企业客户', '周经理', '13900139000', 'zhou@huawei.com', '深圳市龙岗区坂田华为基地', '91440300000000001X', true, 'VIP', NOW(), NOW()),
  ('cus-002', 'CUS002', '阿里巴巴集团', '企业客户', '吴经理', '13900139001', 'wu@alibaba.com', '杭州市余杭区文一西路 969 号', '91330000000000002Y', true, 'VIP', NOW(), NOW()),
  ('cus-003', 'CUS003', '腾讯科技有限公司', '企业客户', '郑经理', '13900139002', 'zheng@tencent.com', '深圳市南山区科技园腾讯大厦', '91440300000000003Z', true, 'A', NOW(), NOW()),
  ('cus-004', 'CUS004', '小米科技有限责任公司', '企业客户', '王经理', '13900139003', 'wang@xiaomi.com', '北京市海淀区清河中街 68 号', '91110000000000004A', true, 'A', NOW(), NOW()),
  ('cus-005', 'CUS005', '京东世纪贸易有限公司', '企业客户', '李经理', '13900139004', 'li@jd.com', '北京市亦庄经济开发区科创十一街', '91110000000000005B', true, 'B', NOW(), NOW());

-- 产品数据
INSERT INTO base_product (id, code, name, category, specification, unit, price, cost, stock_quantity, min_stock, max_stock, description, enabled, created_at, updated_at) VALUES
  ('prod-001', 'PROD001', '笔记本电脑', '电子产品', 'ThinkPad X1 Carbon', '台', 9999.00, 7500.00, 50, 10, 100, '商务笔记本电脑', true, NOW(), NOW()),
  ('prod-002', 'PROD002', '无线鼠标', '电子产品', '罗技 MX Master 3', '个', 399.00, 250.00, 200, 50, 500, '无线办公鼠标', true, NOW(), NOW()),
  ('prod-003', 'PROD003', '机械键盘', '电子产品', 'Cherry MX Board', '个', 699.00, 450.00, 150, 30, 300, '机械游戏键盘', true, NOW(), NOW()),
  ('prod-004', 'PROD004', '显示器', '电子产品', 'Dell U2720Q 27 寸', '台', 3299.00, 2500.00, 30, 5, 50, '4K 专业显示器', true, NOW(), NOW()),
  ('prod-005', 'PROD005', 'USB 集线器', '电子产品', 'Anker 7 合 1', '个', 299.00, 180.00, 300, 50, 600, '多功能 USB 集线器', true, NOW(), NOW()),
  ('prod-006', 'PROD006', '网线', '网络配件', 'Cat6 5 米', '条', 49.00, 25.00, 500, 100, 1000, '六类网线', true, NOW(), NOW()),
  ('prod-007', 'PROD007', '交换机', '网络设备', 'TP-Link 8 口千兆', '台', 199.00, 120.00, 80, 20, 200, '8 口千兆交换机', true, NOW(), NOW()),
  ('prod-008', 'PROD008', '路由器', '网络设备', '华为 AX3 Pro', '台', 329.00, 220.00, 100, 20, 300, 'WiFi6 路由器', true, NOW(), NOW()),
  ('prod-009', 'PROD009', '服务器', '服务器设备', 'Dell PowerEdge R740', '台', 29999.00, 22000.00, 5, 1, 10, '机架式服务器', true, NOW(), NOW()),
  ('prod-010', 'PROD010', '固态硬盘', '存储设备', 'Samsung 970 EVO 1TB', '个', 899.00, 650.00, 100, 20, 300, 'NVMe 固态硬盘', true, NOW(), NOW());

-- 库存数据
INSERT INTO inv_inventory (id, product_id, warehouse_id, warehouse_name, quantity, reserved_quantity, available_quantity, created_at, updated_at) VALUES
  ('inv-001', 'prod-001', 'WH001', '主仓库', 50, 5, 45, NOW(), NOW()),
  ('inv-002', 'prod-002', 'WH001', '主仓库', 200, 20, 180, NOW(), NOW()),
  ('inv-003', 'prod-003', 'WH001', '主仓库', 150, 15, 135, NOW(), NOW()),
  ('inv-004', 'prod-004', 'WH001', '主仓库', 30, 3, 27, NOW(), NOW()),
  ('inv-005', 'prod-005', 'WH001', '主仓库', 300, 30, 270, NOW(), NOW()),
  ('inv-006', 'prod-006', 'WH001', '主仓库', 500, 50, 450, NOW(), NOW()),
  ('inv-007', 'prod-007', 'WH001', '主仓库', 80, 8, 72, NOW(), NOW()),
  ('inv-008', 'prod-008', 'WH001', '主仓库', 100, 10, 90, NOW(), NOW()),
  ('inv-009', 'prod-009', 'WH001', '主仓库', 5, 0, 5, NOW(), NOW()),
  ('inv-010', 'prod-010', 'WH001', '主仓库', 100, 10, 90, NOW(), NOW());

-- =====================================================
-- 3. 采购订单种子数据
-- =====================================================

INSERT INTO proc_purchase_order (id, order_no, supplier_id, status, total_amount, remark, order_date, expected_date, created_at, updated_at) VALUES
  ('po-001', 'PO-20260401-001', 'sup-001', 'received', 50000.00, '第一批采购', '2026-04-01', '2026-04-05', NOW(), NOW()),
  ('po-002', 'PO-20260402-001', 'sup-002', 'pending', 30000.00, '第二批采购', '2026-04-02', '2026-04-08', NOW(), NOW()),
  ('po-003', 'PO-20260403-001', 'sup-003', 'approved', 20000.00, '第三批采购', '2026-04-03', '2026-04-10', NOW(), NOW());

INSERT INTO proc_purchase_order_item (id, order_id, product_id, product_name, price, quantity, amount, received_quantity) VALUES
  ('poi-001', 'po-001', 'prod-001', '笔记本电脑', 9999.00, 5, 49995.00, 5),
  ('poi-002', 'po-002', 'prod-002', '无线鼠标', 399.00, 50, 19950.00, 0),
  ('poi-003', 'po-002', 'prod-003', '机械键盘', 699.00, 15, 10485.00, 0),
  ('poi-004', 'po-003', 'prod-004', '显示器', 3299.00, 6, 19794.00, 0);

-- =====================================================
-- 4. 销售订单种子数据
-- =====================================================

INSERT INTO sales_order (id, order_no, customer_id, status, total_amount, remark, order_date, delivery_date, created_at, updated_at) VALUES
  ('so-001', 'SO-20260401-001', 'cus-001', 'shipped', 100000.00, '华为订单', '2026-04-01', '2026-04-05', NOW(), NOW()),
  ('so-002', 'SO-20260402-001', 'cus-002', 'pending', 50000.00, '阿里订单', '2026-04-02', '2026-04-08', NOW(), NOW()),
  ('so-003', 'SO-20260403-001', 'cus-003', 'approved', 80000.00, '腾讯订单', '2026-04-03', '2026-04-10', NOW(), NOW());

INSERT INTO sales_order_item (id, order_id, product_id, product_name, price, quantity, amount, shipped_quantity) VALUES
  ('soi-001', 'so-001', 'prod-009', '服务器', 29999.00, 3, 89997.00, 3),
  ('soi-002', 'so-002', 'prod-001', '笔记本电脑', 9999.00, 5, 49995.00, 0),
  ('soi-003', 'so-003', 'prod-010', '固态硬盘', 899.00, 50, 44950.00, 0),
  ('soi-004', 'so-003', 'prod-007', '交换机', 199.00, 100, 19900.00, 0);

-- =====================================================
-- 5. 库存记录种子数据
-- =====================================================

INSERT INTO inv_inventory_record (id, product_id, warehouse_id, type, business_type, quantity, before_quantity, after_quantity, remark, related_order_id, created_by, created_at) VALUES
  ('ir-001', 'prod-001', 'WH001', 'in', 'purchase', 50, 0, 50, '初始入库', 'po-001', 'warehouse01', NOW()),
  ('ir-002', 'prod-002', 'WH001', 'in', 'purchase', 200, 0, 200, '初始入库', 'po-001', 'warehouse01', NOW()),
  ('ir-003', 'prod-009', 'WH001', 'out', 'sales', 3, 8, 5, '销售出库', 'so-001', 'warehouse01', NOW()),
  ('ir-004', 'prod-001', 'WH001', 'in', 'purchase', 10, 50, 60, '补充入库', 'po-001', 'warehouse01', NOW()),
  ('ir-005', 'prod-001', 'WH001', 'out', 'sales', 10, 60, 50, '销售出库', 'so-001', 'warehouse01', NOW());

-- =====================================================
-- 数据验证查询
-- =====================================================

-- 验证数据插入结果
SELECT '角色数量' as item, COUNT(*) as count FROM sys_role
UNION ALL
SELECT '用户数量', COUNT(*) FROM sys_user
UNION ALL
SELECT '权限数量', COUNT(*) FROM sys_permission
UNION ALL
SELECT '部门数量', COUNT(*) FROM base_department
UNION ALL
SELECT '供应商数量', COUNT(*) FROM base_supplier
UNION ALL
SELECT '客户数量', COUNT(*) FROM base_customer
UNION ALL
SELECT '产品数量', COUNT(*) FROM base_product
UNION ALL
SELECT '库存记录数量', COUNT(*) FROM inv_inventory
UNION ALL
SELECT '采购订单数量', COUNT(*) FROM proc_purchase_order
UNION ALL
SELECT '销售订单数量', COUNT(*) FROM sales_order;
