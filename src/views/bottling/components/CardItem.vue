<!--
  普通卡片组件
  状态值说明：'0'=已完成/已归档，'1'=未完成/未归档
-->
<template>
  <el-card class="placeholder-card" shadow="hover">
    <template #header>
      <span style="text-align: center;">{{ card.formName }}</span> <span>{{ card.date }}</span>
    </template>

    <!-- 已编辑 -->
    <div class="card-actions" style="padding: 0px; margin-top: 2px; margin-left: 0px;">
      <label class="native-checkbox-before" style="font-size: 13px; margin-left: 0px;">
        <input
          type="checkbox"
          :checked="card.edited === '0'"
          true-value="0"
          false-value="1"
          @change="onCheckboxChange('edited', 'editedTime', '编辑')"
        />
        <span>已编辑</span>
      </label>
      <span style="font-size: 12px; margin-top: 0px; color:gray">{{ card.editedTime || '' }}</span>
    </div>

    <!-- 已复核 -->
    <div class="card-actions" style="padding: 0px; margin-top: 15px; margin-left: 0px;">
      <label class="native-checkbox-before" style="font-size: 13px; margin-left: 0px;">
        <input
          type="checkbox"
          :checked="card.reviewed === '0'"
          true-value="0"
          false-value="1"
          @change="onCheckboxChange('reviewed', 'reviewedTime', '复核')"
        />
        <span>已复核</span>
      </label>
      <span style="font-size: 12px; margin-top: 0px; color:gray">{{ card.reviewedTime || '' }}</span>
    </div>

    <!-- 已检查 -->
    <div class="card-actions" style="padding: 0px; margin-top: 15px; margin-left: 0px;">
      <label class="native-checkbox-before" style="font-size: 13px; margin-left: 0px;">
        <input
          type="checkbox"
          :checked="card.checked === '0'"
          true-value="0"
          false-value="1"
          @change="onCheckboxChange('checked', 'checkedTime', '检查')"
        />
        <span>已检查</span>
      </label>
      <span style="font-size: 12px; margin-top: 0px; color:gray">{{ card.checkedTime || '' }}</span>
    </div>

    <!-- 已归档 -->
    <div class="card-actions" style="padding: 0px; margin-top: 15px; margin-left: 0px;">
      <label class="native-checkbox-before" style="font-size: 13px; margin-left: 0px;">
        <input
          type="checkbox"
          :checked="card.archived === '0'"
          true-value="0"
          false-value="1"
          @change="onCheckboxChange('archived', 'archivedTime', '归档')"
        />
        <span>已归档</span>
      </label>
      <span style="font-size: 12px; margin-top: 0px; color:gray">{{ card.archivedTime || '' }}</span>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <el-button type="primary" link @click="emit('action', 'edit', card)">编辑</el-button>
      &nbsp;
      <el-button type="primary" link @click="emit('action', 'review', card)">复核</el-button>
      &nbsp;
      <el-button type="primary" link @click="emit('action', 'check', card)">检查</el-button>
    </template>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

/** 卡片数据对象 */
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
});

/** 事件：action(mode, card) */
const emit = defineEmits(['action']);

/**
 * 格式化当前时间为 "YYYY-MM-DD HH:mm" 格式
 */
function getCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 处理复选框状态切换
 * @param {string} field - 状态字段名（edited / reviewed / checked / archived）
 * @param {string} timeField - 时间字段名（editedTime / reviewedTime / checkedTime / archivedTime）
 * @param {string} label - 操作名称（用于提示信息）
 * 
 * 状态值说明：'0'=已完成，'1'=未完成
 */
function onCheckboxChange(field, timeField, label) {
  // 当前状态（'0' 或 '1'）
  const currentValue = props.card[field];
  // 新状态：取反（'0' → '1'，'1' → '0'）
  const newValue = currentValue === '1' ? '0' : '1';
  // 操作描述
  const actionDesc = newValue === '0' ? `确认${label}？` : `取消${label}？`;

  // 弹出二次确认框
  ElMessageBox.confirm(
    actionDesc,
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 模拟调用后端接口
      return new Promise((resolve) => {
        setTimeout(() => {
          // 更新状态字段
          props.card[field] = newValue;
          // 更新时间字段：如果新状态为 '0'（已完成）则记录当前时间，否则清空
          if (newValue === '0') {
            props.card[timeField] = getCurrentTime();
          } else {
            props.card[timeField] = null;
          }
          resolve();
        }, 500);
      });
    })
    .then(() => {
      ElMessage.success(`${label}状态更新成功`);
    })
    .catch(() => {
      // 用户取消，不做任何操作
    });
}
</script>

<style scoped>
/* 卡片本身样式 */
.placeholder-card {
  flex: 0 0 188px;
  height: 175px;
  min-width: 0;
  transition: transform 0.2s;
  background-color: #f5f7fa;
}
.placeholder-card:hover {
  transform: translateY(-4px);
}

/* 覆盖 Element Plus 内部样式 */
.placeholder-card :deep(.el-card__body) {
  overflow: hidden !important;
  padding: 5px !important;
}
.placeholder-card :deep(.el-card__footer) {
  overflow: hidden !important;
  padding: 3px 0 0 0 !important;
  text-align: center;
  min-height: 25px;
}
.placeholder-card :deep(.el-card__header) {
  overflow: hidden !important;
  padding: 5px !important;
  text-align: center;
  min-height: 25px;
}

/* 卡片内的操作按钮区域 */
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}
.card-actions .el-button--text {
  padding: 0;
  margin: 0;
}

/* 自定义复选框样式 */
.native-checkbox-before {
  display: inline-flex;
  align-items: center;
  cursor: default;
  font-size: 13px;
  color: #000;
  font-weight: normal;
  user-select: none;
}
.native-checkbox-before input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.native-checkbox-before span::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
  box-sizing: border-box;
  background: #fff;
}
.native-checkbox-before input:checked + span::before {
  background-color: #409eff;
  border-color: #409eff;
}
.native-checkbox-before input:checked + span::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.native-checkbox-before span {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
</style>