<!--
  全览卡片组件
  状态值说明：'0'=已归档，'1'=未归档
-->
<template>
  <el-card class="placeholder-card all-workshop-card" shadow="hover">
    <template #header>
      <div style="text-align: center;">{{ card.workshopName }}</div>
    </template>
    <div class="card-actions" style="justify-content: center;">
      {{ card.formName }}
    </div>
    <template #footer>
      {{ card.date }}
      <!-- '0' 表示已归档 -->
      <el-tag v-if="card.archived === '0'" type="success" effect="dark" size="small">已归档</el-tag>
    </template>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue';

/** 卡片数据对象 */
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* 全览卡片专用样式 */
.all-workshop-card {
  flex: 0 0 176px !important;
  height: 90px !important;
  min-width: 0;
  padding: 0;
  transition: transform 0.2s;
}
.all-workshop-card:hover {
  transform: translateY(-4px);
}

.all-workshop-card :deep(.el-card__body) {
  overflow: hidden !important;
  padding: 5px !important;
}
.all-workshop-card :deep(.el-card__footer) {
  overflow: hidden !important;
  padding: 3px 0 0 0 !important;
  text-align: center;
  min-height: 25px;
}
.all-workshop-card :deep(.el-card__header) {
  overflow: hidden !important;
  padding: 5px !important;
  text-align: center;
  min-height: 25px;
}

/* 卡片内部操作区（居中） */
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>