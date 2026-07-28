<!--
  全览面板组件（WorkshopOverview）
  倒品字型布局：上方左侧操作日志 + 右侧竹简卡片（卷起/展开动画）+ 下方信息
  已归档卡片显示印泥标识，点击展开竹简查看详情
  角标：使用 PulseBadge 组件
-->
<template>
  <div class="overview-container">
    <!-- ===== 上方区域 ===== -->
    <div class="overview-top">
      <!-- 左侧：操作日志时间线 -->
      <div class="overview-left-panel">
        <div v-if="!hasClickedCard" class="hint-card-wrapper">
          <div class="hint-card">
            <span class="hint-text">点击卡片以查看详情</span>
          </div>
        </div>
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

      <!-- 右侧：竹简卡片区域 -->
      <div class="overview-right-wrapper">
        <!-- 消毒车间 -->
        <div class="workshop-section">
          <div class="card-scroll-wrapper-horizontal">
            <div class="card-list-horizontal">
              <div
                v-for="card in getCardsForWorkshop('消毒车间')"
                :key="card.id"
                class="card-wrapper"
                :class="{ expanded: expandedCardId === card.id, archived: card.archived === '0' }"
                @click="toggleCard(card)"
              >
                <!-- 竹简卷起状态 -->
                <div class="scroll-roll">
                  <div class="bamboo-texture"></div>
                  <!-- 三条横向编绳，带绳结 -->
                  <div class="tie-line tie-1"></div>
                  <div class="tie-line tie-2"></div>
                  <div class="tie-line tie-3"></div>
                  <!-- 日期数字 -->
                  <span class="roll-date">{{ getDay(card.date) }}</span>
                  <!-- 印泥标识（已归档） -->
                  <div v-if="card.archived === '0'" class="wax-seal">
                    <span class="seal-text">封</span>
                  </div>
                </div>
                <!-- 竹简展开内容 -->
                <div class="scroll-content">
                  <div class="content-inner">
                    <div class="watermark-text">{{ card.formName }}</div>
                    <div class="detail-info">
                      <span class="detail-date">{{ card.date }}</span>
                      <el-tag v-if="card.archived === '0'" type="success" effect="plain" size="small">已归档</el-tag>
                    </div>
                  </div>
                </div>
                <!-- 卡片名称悬挂下方 -->
                <div class="card-label">{{ card.formName }}</div>
                <!-- 脉冲角标 -->
                <div v-if="selectedCardId === card.id" class="badge-wrapper">
                  <PulseBadge :size="18" :outer-width="3" />
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
                :class="{ expanded: expandedCardId === card.id, archived: card.archived === '0' }"
                @click="toggleCard(card)"
              >
                <div class="scroll-roll">
                  <div class="bamboo-texture"></div>
                  <div class="tie-line tie-1"></div>
                  <div class="tie-line tie-2"></div>
                  <div class="tie-line tie-3"></div>
                  <span class="roll-date">{{ getDay(card.date) }}</span>
                  <div v-if="card.archived === '0'" class="wax-seal">
                    <span class="seal-text">封</span>
                  </div>
                </div>
                <div class="scroll-content">
                  <div class="content-inner">
                    <div class="watermark-text">{{ card.formName }}</div>
                    <div class="detail-info">
                      <span class="detail-date">{{ card.date }}</span>
                      <el-tag v-if="card.archived === '0'" type="success" effect="plain" size="small">已归档</el-tag>
                    </div>
                  </div>
                </div>
                <div class="card-label">{{ card.formName }}</div>
                <div v-if="selectedCardId === card.id" class="badge-wrapper">
                  <PulseBadge :size="18" :outer-width="3" />
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
                :class="{ expanded: expandedCardId === card.id, archived: card.archived === '0' }"
                @click="toggleCard(card)"
              >
                <div class="scroll-roll">
                  <div class="bamboo-texture"></div>
                  <div class="tie-line tie-1"></div>
                  <div class="tie-line tie-2"></div>
                  <div class="tie-line tie-3"></div>
                  <span class="roll-date">{{ getDay(card.date) }}</span>
                  <div v-if="card.archived === '0'" class="wax-seal">
                    <span class="seal-text">封</span>
                  </div>
                </div>
                <div class="scroll-content">
                  <div class="content-inner">
                    <div class="watermark-text">{{ card.formName }}</div>
                    <div class="detail-info">
                      <span class="detail-date">{{ card.date }}</span>
                      <el-tag v-if="card.archived === '0'" type="success" effect="plain" size="small">已归档</el-tag>
                    </div>
                  </div>
                </div>
                <div class="card-label">{{ card.formName }}</div>
                <div v-if="selectedCardId === card.id" class="badge-wrapper">
                  <PulseBadge :size="18" :outer-width="3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 下方固定区域 ===== -->
    <div class="overview-bottom">
      <div class="bottom-text-line">当前批次：2026-07-27 生产计划</div>
      <div class="bottom-text-line">总任务数：12 项，已完成：8 项</div>
      <div class="bottom-text-line">最新动态：张伟 完成了 消毒车间 领料单 填报</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PulseBadge from './PulseBadge.vue';

const props = defineProps({
  cardsData: { type: Object, required: true }
});

function getCardsForWorkshop(workshopName) {
  const workshop = props.cardsData[workshopName];
  if (!workshop) return [];
  const cards = [];
  Object.keys(workshop).forEach(formName => {
    cards.push(...workshop[formName]);
  });
  return cards;
}

function getDay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return parts.length === 3 ? parts[2] : dateStr;
}

const currentCardName = ref('领料单');
const hasClickedCard = ref(false);
const currentLogs = ref([]);
const expandedCardId = ref(null);
const selectedCardId = ref(null);

const logActivities = [
  { detail: '填报', operatorName: '张伟', workshop: '消毒车间', role: '操作员', timestamp: '07-15 09:30', isCancel: false, type: 'primary', hollow: false },
  { detail: '复核', operatorName: '李芳', workshop: '消毒车间', role: '质检员', timestamp: '07-15 10:15', isCancel: false, type: 'success', hollow: false },
  { detail: '检查', operatorName: '王强', workshop: '消毒车间', role: '质检员', timestamp: '07-15 11:00', isCancel: false, type: 'warning', hollow: false },
  { detail: '归档', operatorName: '刘敏', workshop: '消毒车间', role: '代理主管', timestamp: '07-15 11:45', isCancel: false, type: 'info', hollow: false },
  { detail: '取消归档', operatorName: '赵磊', workshop: '灌装车间', role: '操作员', timestamp: '07-15 13:20', isCancel: true, type: 'danger', hollow: true },
  { detail: '取消检查', operatorName: '孙悦', workshop: '灌装车间', role: '质检员', timestamp: '07-15 14:05', isCancel: true, type: 'danger', hollow: true },
  { detail: '取消复核', operatorName: '周婷', workshop: '灌装车间', role: '质检员', timestamp: '07-15 14:50', isCancel: true, type: 'danger', hollow: true },
  { detail: '填报', operatorName: '张伟', workshop: '包装车间', role: '操作员', timestamp: '07-15 15:30', isCancel: false, type: 'primary', hollow: false },
  { detail: '复核', operatorName: '李芳', workshop: '包装车间', role: '质检员', timestamp: '07-15 16:10', isCancel: false, type: 'success', hollow: false },
  { detail: '检查', operatorName: '王强', workshop: '包装车间', role: '质检员', timestamp: '07-15 16:50', isCancel: false, type: 'warning', hollow: false },
  { detail: '归档', operatorName: '刘敏', workshop: '包装车间', role: '代理主管', timestamp: '07-15 17:30', isCancel: false, type: 'info', hollow: false }
];

const logActivities2 = [
  { detail: '提交申请', operatorName: '陈晨', workshop: '消毒车间', role: '工艺员', timestamp: '07-16 08:20', isCancel: false, type: 'primary', hollow: false },
  { detail: '审核通过', operatorName: '林琳', workshop: '消毒车间', role: '主管', timestamp: '07-16 09:10', isCancel: false, type: 'success', hollow: false },
  { detail: '执行操作', operatorName: '黄海', workshop: '灌装车间', role: '操作员', timestamp: '07-16 10:00', isCancel: false, type: 'warning', hollow: false },
  { detail: '质量确认', operatorName: '杨阳', workshop: '灌装车间', role: '质检员', timestamp: '07-16 10:45', isCancel: false, type: 'info', hollow: false },
  { detail: '取消执行', operatorName: '黄海', workshop: '灌装车间', role: '操作员', timestamp: '07-16 11:30', isCancel: true, type: 'danger', hollow: true },
  { detail: '重新执行', operatorName: '黄海', workshop: '灌装车间', role: '操作员', timestamp: '07-16 13:00', isCancel: false, type: 'primary', hollow: false },
  { detail: '终检合格', operatorName: '杨阳', workshop: '灌装车间', role: '质检员', timestamp: '07-16 14:20', isCancel: false, type: 'success', hollow: false },
  { detail: '包装完成', operatorName: '吴迪', workshop: '包装车间', role: '操作员', timestamp: '07-16 15:10', isCancel: false, type: 'warning', hollow: false },
  { detail: '入库登记', operatorName: '郑兰', workshop: '包装车间', role: '仓管员', timestamp: '07-16 16:00', isCancel: false, type: 'info', hollow: false }
];

function toggleCard(card) {
  if (expandedCardId.value === card.id) {
    expandedCardId.value = null;
    selectedCardId.value = null;
  } else {
    expandedCardId.value = card.id;
    selectedCardId.value = card.id;
  }
  hasClickedCard.value = true;
  currentCardName.value = card.formName || '未知表单';
  const randomIndex = Math.floor(Math.random() * 2);
  currentLogs.value = randomIndex === 0 ? logActivities : logActivities2;
}
</script>


<style scoped>
/* ===== 整体容器 ===== */
.overview-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 538px;
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
}
.overview-top {
  display: flex;
  flex: 1;
  min-height: 0;
  padding: 10px;
  background: #f0f2f5;
}

/* ===== 左侧日志面板（保持不变） ===== */
.overview-left-panel {
  flex: 0 0 200px;
  height: 100%;
  background-color: #f7f8fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-right: 10px;
}
.hint-card-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; }
.hint-card { width: 150px; height: 150px; background: linear-gradient(135deg, #e6f0ff, #fff); border: 2px dashed #409eff; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #409eff; font-size: 15px; font-weight: 500; text-align: center; padding: 15px; transition: 0.3s; cursor: pointer; }
.hint-card:hover { background: linear-gradient(135deg, #d0e4ff, #f0f7ff); transform: scale(1.02); }
.hint-text { line-height: 1.6; }
.panel-header { text-align: center; background-color: #ecf5ff; padding: 6px 0; border-radius: 6px; margin-bottom: 10px; border: 1px solid #d9ecff; }
.panel-title { color: #409eff !important; font-size: 14px; font-weight: 600; }
.log-scrollbar { flex: 1; height: 100%; }
.log-card { background-color: #fff !important; border: 1px solid #ebeef5 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.02) !important; border-radius: 6px; transition: 0.2s; }
.log-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
.log-card :deep(.el-card__body) { padding: 8px 12px !important; }
.log-card-cancel { background-color: #fef0f0 !important; border-color: #fde2e2 !important; }
.log-action { font-size: 13px; font-weight: 500; color: #303133; }
.log-person-time { font-size: 11px; color: #909399; margin-top: 4px; }
:deep(.el-timeline.is-start) { padding-left: 0 !important; padding-right: 0 !important; }
:deep(.el-timeline-item__timestamp) { color: #606266 !important; font-size: 11px; }
:deep(.el-timeline-item.is-start .el-timeline-item__wrapper) { padding-left: 18px !important; }
:deep(.el-timeline-item__node) { width: 10px; height: 10px; }
:deep(.el-timeline-item) { padding-bottom: 16px !important; }
:deep(.el-timeline-item__content) { padding-top: 0; }

/* ===== 右侧区域 ===== */
.overview-right-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.workshop-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 4px 8px;
  box-sizing: border-box;
  overflow: hidden;
}
.workshop-section:nth-child(1) { border-left: 4px solid #409eff; }
.workshop-section:nth-child(2) { border-left: 4px solid #67c23a; }
.workshop-section:nth-child(3) { border-left: 4px solid #e6a23c; }

.card-scroll-wrapper-horizontal {
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible; /* 允许倾斜后不裁剪 */
  padding: 6px 0;
}
.card-scroll-wrapper-horizontal::-webkit-scrollbar { height: 5px; }
.card-scroll-wrapper-horizontal::-webkit-scrollbar-thumb { background: #c0c4cc; border-radius: 10px; }
.card-scroll-wrapper-horizontal::-webkit-scrollbar-track { background: #f0f2f5; }

.card-list-horizontal {
  display: flex;
  gap: 12px; /* 增加间距以免倾斜重叠 */
  height: 100%;
  align-items: flex-end;
  flex-wrap: nowrap;
  width: max-content;
  padding: 0 4px;
}

/* ===== 纸卷卡片包裹器（添加轻微旋转） ===== */
.card-wrapper {
  position: relative;
  width: 50px;
  height: 119px;
  flex-shrink: 0;
  cursor: pointer;
  transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(-4deg);       /* 整体倾斜 */
  transform-origin: center bottom;
}
.card-wrapper.expanded {
  width: 130px;                  /* 展开稍宽以容纳内容 */
}

/* ===== 纸卷卷起状态（宣纸质感，去掉竹片） ===== */
.scroll-roll {
  width: 100%;
  height: 95px;
  background: linear-gradient(
    to bottom,
    #e8dcc8 0%,
    #f7f0e4 20%,
    #fcf8f2 50%,
    #f7f0e4 80%,
    #e8dcc8 100%
  );
  border-radius: 3px;            /* 微圆角模拟纸卷边缘 */
  box-shadow: 
    0 4px 10px rgba(0,0,0,0.2),
    inset 0 1px 2px rgba(255,255,255,0.9),
    inset 0 -1px 2px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  transition: all 0.8s;
  z-index: 2;
  /* 纸张纹理：细微横纹 */
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.02) 3px,
    rgba(0,0,0,0.02) 5px
  );
}
.card-wrapper.expanded .scroll-roll {
  opacity: 0;
  transform: scale(0.8);
}

/* 去掉竹片纹理 */
.bamboo-texture {
  display: none;
}

/* 日期数字（纸卷顶部中央） */
.roll-date {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 700;
  color: #5a4a2f;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  z-index: 2;
}

/* ===== 印泥标识（保持原样） ===== */
.wax-seal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  background: radial-gradient(circle at 35% 35%, #c94a4a, #6b1e1e);
  border-radius: 50%;
  box-shadow: 
    0 2px 6px rgba(0,0,0,0.35),
    inset 0 1px 3px rgba(255,255,255,0.4),
    inset 0 -1px 3px rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
}
.seal-text {
  font-family: "STKaiti", "楷体", "KaiTi", serif;
  font-size: 13px;
  font-weight: bold;
  color: #fbeaa0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.7);
  transform: rotate(-8deg);
  user-select: none;
}

/* ===== 纸卷展开内容（倾斜同步，宣纸质感） ===== */
.scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 95px;
  background: #fcf8f2; /* 米白宣纸 */
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  padding: 8px 8px;
  box-sizing: border-box;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s;
  z-index: 1;
  border: 1px solid #ddd0b8;
  /* 纸张纹理 */
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 4px,
    rgba(0,0,0,0.015) 4px,
    rgba(0,0,0,0.015) 6px
  );
}
.card-wrapper.expanded .scroll-content {
  opacity: 1;
  transform: scale(1);
}

.content-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.watermark-text {
  font-size: 13px;
  font-weight: 600;
  color: #3e2f1c;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "STKaiti", "楷体", serif;
  letter-spacing: 0.5px;
}
.detail-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail-date {
  font-size: 11px;
  color: #6b4c2a;
  font-family: "STKaiti", "楷体", serif;
}

/* 卡片名称悬挂标签（跟随倾斜） */
.card-label {
  margin-top: 4px;
  font-size: 9px;
  color: #5a4a2f;
  text-align: center;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  transform: rotate(4deg); /* 反向微调以保持文字可读 */
}

/* 脉冲角标 */
.badge-wrapper {
  position: absolute;
  top: -18px;
  left: -4px;
  z-index: 10;
  pointer-events: none;
  /* 角标可以不跟随倾斜，保持水平 */
  transform: rotate(4deg);
}

/* ===== 底部信息栏 ===== */
.overview-bottom {
  flex: 0 0 80px;
  background-color: #f7f8fa;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.03);
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #303133;
  font-size: 13px;
  line-height: 1.8;
  border-top: 2px solid #409eff;
}
.bottom-text-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}
.bottom-text-line:first-child {
  font-weight: 600;
  color: #409eff;
}
</style>



