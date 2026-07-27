<!--
  全览面板组件（WorkshopOverview）
  倒品字型布局：上方左侧操作日志 + 右侧卡片列表（左右结构），下方固定底部信息区域
  交互优化：首次进入显示提示卡片，点击卡片后切换为日志视图（随机展示两组日志之一）
  角标：使用 SVG PulseBadge 组件（瘦高菱形脉冲角标）
-->
<template>
  <div class="overview-container">
    <!-- ===== 上方区域：左右结构（日志面板 + 卡片列表） ===== -->
    <div class="overview-top">
      <!-- 左侧：操作日志时间线 -->
      <div class="overview-left-panel">
        <!-- 初次进入显示的提示卡片 -->
        <div v-if="!hasClickedCard" class="hint-card-wrapper">
          <div class="hint-card">
            <span class="hint-text">点击卡片以查看详情</span>
          </div>
        </div>

        <!-- 点击卡片后显示的日志视图 -->
        <template v-else>
          <div class="panel-header">
            <span class="panel-title">{{ currentCardName }}</span>
          </div>
          <el-scrollbar class="log-scrollbar">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in currentLogs"
                :key="index"
                :type="log.type"
                :hollow="log.hollow"
                :timestamp="log.timestamp"
                placement="bottom"
                size="small"
              >
                <el-card class="log-card" :class="{ 'log-card-cancel': log.isCancel }" shadow="hover">
                  <div class="log-action">{{ log.detail }}</div>
                  <div class="log-person-time">{{ log.operatorName }}｜{{ log.workshop }}｜{{ log.role }}</div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </template>
      </div>

      <!-- 右侧：三个车间卡片列表（水平滚动） -->
      <div class="overview-right-wrapper">
        <!-- 消毒车间 -->
        <div class="workshop-section">
          <div class="card-scroll-wrapper-horizontal">
            <div class="card-list-horizontal">
              <div
                v-for="card in getCardsForWorkshop('消毒车间')"
                :key="card.id"
                class="card-wrapper"
                @click="handleCardClick(card)"
              >
                <el-card
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
                <!-- 角标组件（定位在卡片内部右上角） -->
                <div v-if="selectedCardId === card.id" class="badge-wrapper">
                  <PulseBadge :size="20" :outer-width="3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 灌装车间 -->
        <div class="workshop-section">
          <div class="card-scroll-wrapper-horizontal">
            <div class="card-list-horizontal">
              <div
                v-for="card in getCardsForWorkshop('灌装车间')"
                :key="card.id"
                class="card-wrapper"
                @click="handleCardClick(card)"
              >
                <el-card
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
                <div v-if="selectedCardId === card.id" class="badge-wrapper">
                  <PulseBadge :size="20" :outer-width="3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 包装车间 -->
        <div class="workshop-section">
          <div class="card-scroll-wrapper-horizontal">
            <div class="card-list-horizontal">
              <div
                v-for="card in getCardsForWorkshop('包装车间')"
                :key="card.id"
                class="card-wrapper"
                @click="handleCardClick(card)"
              >
                <el-card
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
                <div v-if="selectedCardId === card.id" class="badge-wrapper">
                  <PulseBadge :size="20" :outer-width="3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 下方固定区域（倒品字底部） ===== -->
    <div class="overview-bottom">
      <div class="bottom-text-line">当前批次：2026-07-27 生产计划</div>
      <div class="bottom-text-line">总任务数：12 项，已完成：8 项</div>
      <div class="bottom-text-line">最新动态：张伟 完成了 消毒车间 领料单 填报</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import PulseBadge from './PulseBadge.vue';

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
 * 当前选中的卡片名称（用于左侧顶部显示）
 */
const currentCardName = ref('领料单');

/**
 * 当前选中的卡片ID（用于脉冲角标高亮）
 */
const selectedCardId = ref(null);

/**
 * 是否已点击过卡片（控制左侧视图切换）
 */
const hasClickedCard = ref(false);

/**
 * 当前显示的日志数据（初始为空，点击卡片后随机选择一组）
 */
const currentLogs = ref([]);

/**
 * 日志数据组1（模拟数据）
 */
const logActivities = [
  {
    detail: '填报',
    operatorName: '张伟',
    workshop: '消毒车间',
    role: '操作员',
    timestamp: '07-15 09:30',
    isCancel: false,
    type: 'primary',
    hollow: false
  },
  {
    detail: '复核',
    operatorName: '李芳',
    workshop: '消毒车间',
    role: '质检员',
    timestamp: '07-15 10:15',
    isCancel: false,
    type: 'success',
    hollow: false
  },
  {
    detail: '检查',
    operatorName: '王强',
    workshop: '消毒车间',
    role: '质检员',
    timestamp: '07-15 11:00',
    isCancel: false,
    type: 'warning',
    hollow: false
  },
  {
    detail: '归档',
    operatorName: '刘敏',
    workshop: '消毒车间',
    role: '代理主管',
    timestamp: '07-15 11:45',
    isCancel: false,
    type: 'info',
    hollow: false
  },
  {
    detail: '取消归档',
    operatorName: '赵磊',
    workshop: '灌装车间',
    role: '操作员',
    timestamp: '07-15 13:20',
    isCancel: true,
    type: 'danger',
    hollow: true
  },
  {
    detail: '取消检查',
    operatorName: '孙悦',
    workshop: '灌装车间',
    role: '质检员',
    timestamp: '07-15 14:05',
    isCancel: true,
    type: 'danger',
    hollow: true
  },
  {
    detail: '取消复核',
    operatorName: '周婷',
    workshop: '灌装车间',
    role: '质检员',
    timestamp: '07-15 14:50',
    isCancel: true,
    type: 'danger',
    hollow: true
  },
  {
    detail: '填报',
    operatorName: '张伟',
    workshop: '包装车间',
    role: '操作员',
    timestamp: '07-15 15:30',
    isCancel: false,
    type: 'primary',
    hollow: false
  },
  {
    detail: '复核',
    operatorName: '李芳',
    workshop: '包装车间',
    role: '质检员',
    timestamp: '07-15 16:10',
    isCancel: false,
    type: 'success',
    hollow: false
  },
  {
    detail: '检查',
    operatorName: '王强',
    workshop: '包装车间',
    role: '质检员',
    timestamp: '07-15 16:50',
    isCancel: false,
    type: 'warning',
    hollow: false
  },
  {
    detail: '归档',
    operatorName: '刘敏',
    workshop: '包装车间',
    role: '代理主管',
    timestamp: '07-15 17:30',
    isCancel: false,
    type: 'info',
    hollow: false
  }
];

/**
 * 日志数据组2（模拟数据，内容不同）
 */
const logActivities2 = [
  {
    detail: '提交申请',
    operatorName: '陈晨',
    workshop: '消毒车间',
    role: '工艺员',
    timestamp: '07-16 08:20',
    isCancel: false,
    type: 'primary',
    hollow: false
  },
  {
    detail: '审核通过',
    operatorName: '林琳',
    workshop: '消毒车间',
    role: '主管',
    timestamp: '07-16 09:10',
    isCancel: false,
    type: 'success',
    hollow: false
  },
  {
    detail: '执行操作',
    operatorName: '黄海',
    workshop: '灌装车间',
    role: '操作员',
    timestamp: '07-16 10:00',
    isCancel: false,
    type: 'warning',
    hollow: false
  },
  {
    detail: '质量确认',
    operatorName: '杨阳',
    workshop: '灌装车间',
    role: '质检员',
    timestamp: '07-16 10:45',
    isCancel: false,
    type: 'info',
    hollow: false
  },
  {
    detail: '取消执行',
    operatorName: '黄海',
    workshop: '灌装车间',
    role: '操作员',
    timestamp: '07-16 11:30',
    isCancel: true,
    type: 'danger',
    hollow: true
  },
  {
    detail: '重新执行',
    operatorName: '黄海',
    workshop: '灌装车间',
    role: '操作员',
    timestamp: '07-16 13:00',
    isCancel: false,
    type: 'primary',
    hollow: false
  },
  {
    detail: '终检合格',
    operatorName: '杨阳',
    workshop: '灌装车间',
    role: '质检员',
    timestamp: '07-16 14:20',
    isCancel: false,
    type: 'success',
    hollow: false
  },
  {
    detail: '包装完成',
    operatorName: '吴迪',
    workshop: '包装车间',
    role: '操作员',
    timestamp: '07-16 15:10',
    isCancel: false,
    type: 'warning',
    hollow: false
  },
  {
    detail: '入库登记',
    operatorName: '郑兰',
    workshop: '包装车间',
    role: '仓管员',
    timestamp: '07-16 16:00',
    isCancel: false,
    type: 'info',
    hollow: false
  }
];

/**
 * 处理卡片点击事件
 */
function handleCardClick(card) {
  hasClickedCard.value = true;
  currentCardName.value = card.formName || '未知表单';
  selectedCardId.value = card.id;
  const randomIndex = Math.floor(Math.random() * 2);
  currentLogs.value = randomIndex === 0 ? logActivities : logActivities2;
}
</script>

<style scoped>
/* ===== 外层容器 ===== */
.overview-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 538px;
  gap: 0;
}

/* ===== 上方区域（左右结构） ===== */
.overview-top {
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 0;
}

/* ===== 左侧面板 ===== */
.overview-left-panel {
  flex: 0 0 180px;
  height: 100%;
  background-color: #d9d9d9;
  border-radius: 4px 0 0 0;
  padding: 8px 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* ===== 提示卡片 ===== */
.hint-card-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hint-card {
  width: 170px;
  height: 170px;
  background-color: transparent;
  border: 2px solid #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
.hint-text {
  line-height: 1.6;
}

/* ===== 顶部卡片名称显示区域 ===== */
.panel-header {
  text-align: center;
  color: #fff;
  background-color: #606266;
  padding: 0;
  border-radius: 4px;
  margin-bottom: 8px;
  flex-shrink: 0;
  line-height: 0px;
}
.panel-title {
  font-size: 14px;
  font-weight: 500;
}

.log-scrollbar {
  flex: 1;
  height: 100%;
}

/* ===== 时间线卡片样式 ===== */
.log-card {
  background-color: #606266 !important;
  border: none !important;
  box-shadow: none !important;
  padding: 2px 0 !important;
  color: #fff;
}
.log-card :deep(.el-card__body) {
  padding: 5px 0px 5px 5px !important;
}
.log-card-cancel {
  background-color: #7a3b3b !important;
}
.log-action {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
}
.log-person-time {
  font-size: 11px;
  color: #d0d0d0;
  margin-top: 1px;
}

/* ===== 覆盖时间线组件样式 ===== */
:deep(.el-timeline.is-start) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
:deep(.el-timeline-item__timestamp) {
  color: #fff !important;
  font-size: 11px;
}
:deep(.el-timeline-item.is-start .el-timeline-item__wrapper) {
  padding-left: 15px !important;
}
:deep(.el-timeline-item__node) {
  width: 10px;
  height: 10px;
}
:deep(.el-timeline-item) {
  padding-bottom: 12px !important;
}
:deep(.el-timeline-item__content) {
  padding-top: 0;
}

/* ===== “已归档”标签黑底白字 ===== */
:deep(.el-tag--dark.el-tag--success) {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-color: #000000 !important;
}

/* ===== 右侧容器 ===== */
.overview-right-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 2px;
  box-sizing: border-box;
  gap: 2px;
  min-width: 0;
}

.workshop-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #d9d9d9;
  border-radius: 0 4px 0 0;
  padding: 4px 0;
  box-sizing: border-box;
  overflow: hidden; /* 关键：限制宽度，使滚动生效 */
}

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

.card-list-horizontal {
  display: flex;
  gap: 6px;
  height: 100%;
  align-items: stretch;
  flex-wrap: nowrap;
  padding: 4px 10px;
  width: max-content; /* 宽度由内容撑开，触发滚动 */
}

/* ===== 卡片包裹器 ===== */
.card-wrapper {
  position: relative;
  flex: 0 0 75px;
  height: 120px;
  cursor: pointer;
  display: flex;
  align-items: stretch;
}

/* ===== 卡片本身 ===== */
.all-workshop-card-horizontal {
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
  background-color: #606266 !important;
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
.card-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 角标容器（定位在卡片内部右上角） */
.badge-wrapper {
  position: absolute;
  top: -7px;          /* 内移，避免溢出裁剪 */
  right: -7px;
  width: 28px;
  height: 35px;
  z-index: 10;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== 下方固定区域 ===== */
.overview-bottom {
  flex: 0 0 80px;
  width: 100%;
  background-color: #606266;
  border-radius: 0 0 4px 4px;
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
}
.bottom-text-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

