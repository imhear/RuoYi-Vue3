<!--
  全览面板组件（WorkshopOverview）
  左右结构：左侧操作日志时间线，右侧三个水平滚动的卡片列表（按车间分组）
-->
<template>
  <div class="overview-container">
    <!-- ===== 左侧面板：操作日志时间线 ===== -->
    <div class="overview-left-panel">
      <!-- 使用 el-scrollbar 支撑滚动，保持固定高度 -->
      <el-scrollbar class="log-scrollbar">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in logActivities"
            :key="index"
            :type="log.type"
            :hollow="log.hollow"
            :timestamp="log.timestamp"
            placement="top"
            size="small"
          >
            <div class="log-content" :class="{ 'log-cancel': log.isCancel }">
              <div class="log-operator">{{ log.operator }}</div>
              <div class="log-detail">
                <span>{{ log.detail }}</span>
                <span v-if="log.reason" class="log-reason">（{{ log.reason }}）</span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>

    <!-- ===== 右侧：三个车间卡片列表 ===== -->
    <div class="overview-right-wrapper">
      <!-- 消毒车间 -->
      <div class="workshop-section">
        <div class="card-scroll-wrapper-horizontal">
          <div class="card-list-horizontal">
            <el-card
              v-for="card in getCardsForWorkshop('消毒车间')"
              :key="card.id"
              class="placeholder-card all-workshop-card-horizontal"
              shadow="hover"
            >
              <template #header>
                <div style="font-size:11px; color: white;">{{ card.formName }}</div>
              </template>
              <div class="card-actions" style="padding-top: 10px;">
                <el-tag v-if="card.archived === '0'" type="success" effect="dark" size="small">已归档</el-tag>
              </div>
              <template #footer>
                <div style="justify-content: center; font-size: 11px; color:white;">
                  {{ card.date }}
                </div>
              </template>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 灌装车间 -->
      <div class="workshop-section">
        <div class="card-scroll-wrapper-horizontal">
          <div class="card-list-horizontal">
            <el-card
              v-for="card in getCardsForWorkshop('灌装车间')"
              :key="card.id"
              class="placeholder-card all-workshop-card-horizontal"
              shadow="hover"
            >
              <template #header>
                <div style="font-size:11px; color: white;">{{ card.formName }}</div>
              </template>
              <div class="card-actions" style="padding-top: 10px;">
                <el-tag v-if="card.archived === '0'" type="success" effect="dark" size="small">已归档</el-tag>
              </div>
              <template #footer>
                <div style="justify-content: center; font-size: 11px; color:white;">
                  {{ card.date }}
                </div>
              </template>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 包装车间 -->
      <div class="workshop-section">
        <div class="card-scroll-wrapper-horizontal">
          <div class="card-list-horizontal">
            <el-card
              v-for="card in getCardsForWorkshop('包装车间')"
              :key="card.id"
              class="placeholder-card all-workshop-card-horizontal"
              shadow="hover"
            >
              <template #header>
                <div style="font-size:11px; color: white;">{{ card.formName }}</div>
              </template>
              <div class="card-actions" style="padding-top: 10px;">
                <el-tag v-if="card.archived === '0'" type="success" effect="dark" size="small">已归档</el-tag>
              </div>
              <template #footer>
                <div style="justify-content: center; font-size: 11px; color:white;">
                  {{ card.date }}
                </div>
              </template>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

/** 卡片数据源：{ 车间名: { 表单名: [card, ...] } } */
const props = defineProps({
  cardsData: {
    type: Object,
    required: true
  }
});

/**
 * 获取指定车间的所有卡片（展开所有表单）
 */
function getCardsForWorkshop(workshopName) {
  const workshop = props.cardsData[workshopName];
  if (!workshop) return [];
  const cards = [];
  Object.keys(workshop).forEach(formName => {
    cards.push(...workshop[formName]);
  });
  return cards;
}

/**
 * 计算总表单数
 */
const totalForms = computed(() => {
  let count = 0;
  const workshopNames = Object.keys(props.cardsData);
  workshopNames.forEach(wn => {
    count += Object.keys(props.cardsData[wn]).length;
  });
  return count;
});

/**
 * 计算总卡片数
 */
const totalCards = computed(() => {
  let count = 0;
  const workshopNames = Object.keys(props.cardsData);
  workshopNames.forEach(wn => {
    const workshop = props.cardsData[wn];
    Object.keys(workshop).forEach(fn => {
      count += workshop[fn].length;
    });
  });
  return count;
});

/**
 * 操作日志数据（固定模拟数据）
 */
const logActivities = [
  {
    timestamp: '07-15 09:30',
    operator: '张伟/生产部/操作员',
    detail: '填报',
    isCancel: false,
    type: 'primary',
    hollow: false
  },
  {
    timestamp: '07-15 10:15',
    operator: '李芳/质量部/质检员',
    detail: '复核',
    isCancel: false,
    type: 'success',
    hollow: false
  },
  {
    timestamp: '07-15 11:00',
    operator: '王强/质量部/质检员',
    detail: '检查',
    isCancel: false,
    type: 'warning',
    hollow: false
  },
  {
    timestamp: '07-15 11:45',
    operator: '刘敏/生产部/代理主管',
    detail: '归档',
    isCancel: false,
    type: 'info',
    hollow: false
  },
  {
    timestamp: '07-15 13:20',
    operator: '赵磊/生产部/操作员',
    detail: '取消归档',
    isCancel: true,
    reason: '错填',
    type: 'danger',
    hollow: true
  },
  {
    timestamp: '07-15 14:05',
    operator: '孙悦/质量部/质检员',
    detail: '取消检查',
    isCancel: true,
    reason: '错填',
    type: 'danger',
    hollow: true
  },
  {
    timestamp: '07-15 14:50',
    operator: '周婷/质量部/质检员',
    detail: '取消复核',
    isCancel: true,
    reason: '错填',
    type: 'danger',
    hollow: true
  },
  {
    timestamp: '07-15 15:30',
    operator: '张伟/生产部/操作员',
    detail: '填报',
    isCancel: false,
    type: 'primary',
    hollow: false
  },
  {
    timestamp: '07-15 16:10',
    operator: '李芳/质量部/质检员',
    detail: '复核',
    isCancel: false,
    type: 'success',
    hollow: false
  },
  {
    timestamp: '07-15 16:50',
    operator: '王强/质量部/质检员',
    detail: '检查',
    isCancel: false,
    type: 'warning',
    hollow: false
  },
  {
    timestamp: '07-15 17:30',
    operator: '刘敏/生产部/代理主管',
    detail: '归档',
    isCancel: false,
    type: 'info',
    hollow: false
  }
];
</script>

<style scoped>
/* ===== 外层容器 ===== */
.overview-container {
  display: flex;
  width: 100%;
  height: 538px;
  gap: 0;
}

/* ===== 左侧面板 ===== */
.overview-left-panel {
  flex: 0 0 150px;          /* 保持原有宽度 150px */
  height: 450px;            /* 保持原有高度 */
  background-color: #a5a5a5; /* 保持原有背景色 */
  border-radius: 4px 0 0 4px;
  padding: 8px 6px;         /* 减小内边距以适配小宽度 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 日志滚动容器 */
.log-scrollbar {
  flex: 1;
  height: 100%;
}

/* 时间线项样式（紧凑适配 150px 宽度） */
.log-content {
  font-size: 10px;
  line-height: 1.4;
  color: #303133;
  padding: 1px 0;
  word-break: break-all;
}

.log-content .log-operator {
  font-weight: 500;
  color: #2c3e50;
  font-size: 9px;
}

.log-content .log-detail {
  color: #303133;
  font-size: 10px;
}

.log-content .log-reason {
  color: #f56c6c;
  font-style: italic;
  font-size: 9px;
}

/* 取消操作的日志特殊样式 */
.log-cancel {
  background-color: rgba(245, 108, 108, 0.15);
  border-radius: 3px;
  padding: 1px 4px;
}

/* ===== 覆盖 el-timeline 样式使其更紧凑 ===== */
:deep(.el-timeline-item__wrapper) {
  padding-left: 16px;
}
:deep(.el-timeline-item__timestamp) {
  font-size: 9px;
  color: #909399;
}
:deep(.el-timeline-item__node) {
  width: 8px;
  height: 8px;
}
:deep(.el-timeline-item) {
  padding-bottom: 4px;
}
:deep(.el-timeline-item__content) {
  padding-top: 0;
}

/* ===== 右侧容器（保持不变） ===== */
.overview-right-wrapper {
  flex: 1;
  height: 450px;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  box-sizing: border-box;
  gap: 6px;
  min-width: 0;
}

/* ===== 每个车间分区 ===== */
.workshop-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #d9d9d9;
  border-radius: 4px;
  padding: 4px 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* ===== 水平滚动容器 ===== */
.card-scroll-wrapper-horizontal {
  flex: 1;
  width: 100%;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  padding: 4px 0px;
  scrollbar-width: thin;
  -ms-overflow-style: auto;
}
.card-scroll-wrapper-horizontal::-webkit-scrollbar {
  height: 6px;
}
.card-scroll-wrapper-horizontal::-webkit-scrollbar-thumb {
  background: #c1c7cd;
  border-radius: 3px;
}
.card-scroll-wrapper-horizontal::-webkit-scrollbar-track {
  background: #f0f0f0;
}

/* ===== 水平卡片列表 ===== */
.card-list-horizontal {
  display: flex;
  gap: 12px;
  height: 100%;
  align-items: stretch;
  flex-wrap: nowrap;
  padding: 4px 10px;
}

/* ===== 水平卡片样式 ===== */
.all-workshop-card-horizontal {
  flex: 0 0 80px;
  height: 120px;
  min-width: 0;
  transition: transform 0.2s;
  background-color: #aaaaaa;
}
.all-workshop-card-horizontal:hover {
  transform: translateY(-4px);
}

.all-workshop-card-horizontal :deep(.el-card__body) {
  overflow: hidden !important;
  padding: 6px 4px !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}
.all-workshop-card-horizontal :deep(.el-card__header) {
  overflow: hidden !important;
  padding: 5px 0px !important;
  text-align: center;
  min-height: 20px;
}
.all-workshop-card-horizontal :deep(.el-card__footer) {
  overflow: hidden !important;
  padding: 10px 0 !important;
  text-align: center;
  min-height: 18px;
}

/* 卡片内部操作区 */
.card-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>