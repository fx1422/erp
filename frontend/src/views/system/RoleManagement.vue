<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table :data="tableData" border stripe>
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getRoleList } from '@/api/auth';

const tableData = ref([]);

const fetchData = async () => {
  try {
    tableData.value = await getRoleList();
  } catch (error) {
    ElMessage.error('获取数据失败');
  }
};

const handleAdd = () => {
  ElMessage.info('功能开发中...');
};

const handleEdit = (row: any) => {
  ElMessage.info('功能开发中...');
};

const handleDelete = (row: any) => {
  ElMessage.info('功能开发中...');
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page-container {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
