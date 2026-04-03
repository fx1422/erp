import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/system/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'system/users',
        name: 'UserManagement',
        component: () => import('@/views/system/UserManagement.vue'),
      },
      {
        path: 'system/roles',
        name: 'RoleManagement',
        component: () => import('@/views/system/RoleManagement.vue'),
      },
      {
        path: 'base/departments',
        name: 'DepartmentManagement',
        component: () => import('@/views/base-data/DepartmentManagement.vue'),
      },
      {
        path: 'base/suppliers',
        name: 'SupplierManagement',
        component: () => import('@/views/base-data/SupplierManagement.vue'),
      },
      {
        path: 'base/customers',
        name: 'CustomerManagement',
        component: () => import('@/views/base-data/CustomerManagement.vue'),
      },
      {
        path: 'base/products',
        name: 'ProductManagement',
        component: () => import('@/views/base-data/ProductManagement.vue'),
      },
      {
        path: 'procurement/orders',
        name: 'PurchaseOrderManagement',
        component: () => import('@/views/procurement/PurchaseOrderManagement.vue'),
      },
      {
        path: 'sales/orders',
        name: 'SalesOrderManagement',
        component: () => import('@/views/sales/SalesOrderManagement.vue'),
      },
      {
        path: 'inventory',
        name: 'InventoryManagement',
        component: () => import('@/views/inventory/InventoryManagement.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
