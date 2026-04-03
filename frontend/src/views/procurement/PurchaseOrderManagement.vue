<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>采购订单</span>
          <el-button type="primary" @click="handleAdd">创建订单</el-button>
        </div>
      </template>
      <el-empty description="功能开发中，请等待后续迭代" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';

const handleAdd = () => {
  ElMessage.info('功能开发中...');
};
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
