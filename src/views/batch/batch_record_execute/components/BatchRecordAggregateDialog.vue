<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="260mm"
    top="3vh"
    append-to-body
    :fullscreen="isFullscreen"
    @closed="handleClosed"
  >
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">{{ title }}</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon style="cursor: pointer; font-size: 18px;" @click="isFullscreen = !isFullscreen">
            <FullScreen v-if="!isFullscreen" /><Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <div v-loading="loading" class="aggregate-container">
      <el-empty v-if="!recordId" description="记录ID无效" />
      <template v-else-if="workshopGroups.length > 0">
        <!-- 第一层：车间 Tabs -->
        <el-tabs v-model="activeWorkshop" type="border-card" class="aggregate-tabs">
          <!-- 全览 Tab：左侧日志 + 右侧卡片 -->
          <el-tab-pane label="全 览" name="all">
            <div class="overview-container">
              <!-- 左侧：操作日志 -->
              <div class="overview-left">
                <div class="log-panel-header">
                  <span v-if="selectedCard">操作日志 - {{ selectedCard.menuName }}</span>
                  <span v-else>操作日志</span>
                </div>
                <div class="log-panel-body">
                  <!-- 未选择卡片时显示提示，不显示日志列表 -->
                  <div v-if="!selectedCard" class="log-placeholder">
                    点击右侧卡片查看详情
                  </div>
                  <!-- 选中卡片后显示对应日志 -->
                  <el-table
                    v-else
                    :data="filteredLogs"
                    border
                    size="small"
                    height="100%"
                    empty-text="暂无操作日志"
                    :header-cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
                    :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
                  >
                    <el-table-column label="操作时间" align="center">
                      <template #default="scope">
                        {{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="operator" align="center" show-overflow-tooltip />
                    <el-table-column label="操作类型" align="center">
                      <template #default="scope">
                        <el-tag size="small" :type="getActionTypeTag(scope.row.actionType)">
                          {{ getActionTypeText(scope.row.actionType) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 右侧：车间卡片列表（全览卡片不显示操作按钮） -->
              <div class="overview-right">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <div
                      v-for="card in allCards"
                      :key="card.menuId"
                      class="preview-card"
                      :class="{ 'is-selected': selectedCard && selectedCard.menuId === card.menuId }"
                      @click="handleCardClick(card)"
                    >
                      <div class="card-title">{{ card.menuName }}</div>
                      <div class="card-meta">{{ card.workUnitName || '未分配工作单元' }}</div>
                      <div class="card-status">
                        <el-tag size="small" :type="card.instanceControlStatus === '0' ? 'info' : 'success'">
                          {{ getControlStatusText(card.instanceControlStatus) }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 各车间 Tab（保留操作按钮） -->
          <el-tab-pane
            v-for="ws in workshopGroups"
            :key="ws.menuId"
            :label="ws.menuName"
            :name="String(ws.menuId)"
          >
            <!-- 第二层：表单 Tabs（左侧） -->
            <el-tabs v-model="activeForm" tab-position="left" class="form-tabs">
              <el-tab-pane label="全部" name="all">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <div
                      v-for="card in getWorkshopCards(ws.menuId, 'all')"
                      :key="card.menuId"
                      class="preview-card"
                    >
                      <div class="card-title">{{ card.menuName }}</div>
                      <div class="card-meta">{{ card.workUnitName || '未分配工作单元' }}</div>
                      <div class="card-status">
                        <el-tag size="small" :type="card.instanceControlStatus === '0' ? 'info' : 'success'">
                          {{ getControlStatusText(card.instanceControlStatus) }}
                        </el-tag>
                      </div>
                      <div class="card-actions">
                        <el-button
                          v-for="btn in getCardButtons(card)"
                          :key="btn.menuId"
                          size="small"
                          type="primary"
                          @click="handleActionClick(btn)"
                        >
                          {{ btn.buttonLabel }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane
                v-for="form in getWorkshopForms(ws.menuId)"
                :key="form.menuId"
                :label="form.menuName"
                :name="String(form.menuId)"
              >
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <div
                      v-for="card in getFormCards(ws.menuId, form.menuId)"
                      :key="card.menuId"
                      class="preview-card"
                    >
                      <div class="card-title">{{ card.menuName }}</div>
                      <div class="card-meta">{{ card.workUnitName || '未分配工作单元' }}</div>
                      <div class="card-status">
                        <el-tag size="small" :type="card.instanceControlStatus === '0' ? 'info' : 'success'">
                          {{ getControlStatusText(card.instanceControlStatus) }}
                        </el-tag>
                      </div>
                      <div class="card-actions">
                        <el-button
                          v-for="btn in getCardButtons(card)"
                          :key="btn.menuId"
                          size="small"
                          type="primary"
                          @click="handleActionClick(btn)"
                        >
                          {{ btn.buttonLabel }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </template>
      <el-empty v-else description="暂无批记录结构" />
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>

    <!-- 动态组件加载弹窗 -->
    <DynamicComponentDialog ref="dynamicDialogRef" @refresh="handleRefresh" />
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { FullScreen, Aim } from '@element-plus/icons-vue'
import { listBatchRecordMenuTree } from '@/api/batch/batch_record_menu'
import { listBatchRecordLogByRecordId } from '@/api/batch/batch_record_log'
import DynamicComponentDialog from './DynamicComponentDialog.vue'

defineOptions({ name: 'BatchRecordAggregateDialog' })

// ==================== 基础状态 ====================
const visible = ref(false)                 // 弹窗是否可见
const isFullscreen = ref(false)            // 是否全屏
const loading = ref(false)                 // 加载状态
const recordId = ref(null)                 // 批记录ID
const title = ref('批记录')                // 弹窗标题

// ==================== 菜单与卡片状态 ====================
const menuList = ref([])                   // 批记录菜单列表（平铺）
const activeWorkshop = ref('all')          // 当前车间Tab
const activeForm = ref('all')              // 当前表单Tab
const dynamicDialogRef = ref(null)         // 动态组件弹窗引用

// ==================== 日志相关状态 ====================
const logList = ref([])                    // 当前批记录的全部操作日志
const selectedCard = ref(null)             // 当前选中的卡片对象（C节点），null表示未选择

/**
 * 过滤后的日志列表：
 * - 未选中卡片时，返回空数组（由模板显示提示）
 * - 选中卡片时，仅显示 c_menu_id 等于该卡片 menuId 的日志
 */
const filteredLogs = computed(() => {
  if (!selectedCard.value) return []
  return logList.value.filter(log => log.cMenuId === selectedCard.value.menuId)
})

/**
 * 一级目录（车间）列表，即 menu_type = 'M' 且 parent_id = 0 的节点
 */
const workshopGroups = computed(() => {
  return menuList.value.filter(m => m.menuType === 'M' && m.parentId === 0)
})

/**
 * 全部卡片（跨车间），用于全览 Tab 展示
 */
const allCards = computed(() => {
  const cards = []
  workshopGroups.value.forEach(ws => {
    getWorkshopCards(ws.menuId, 'all').forEach(c => cards.push(c))
  })
  return cards
})

/**
 * 打开聚合入口
 * @param {Number} id 批记录ID
 * @param {String} orderNum 工单号
 */
async function open(id, orderNum) {
  recordId.value = id
  title.value = orderNum ? `批记录 - ${orderNum}` : '批记录'
  visible.value = true
  activeWorkshop.value = 'all'
  activeForm.value = 'all'
  selectedCard.value = null   // 初始不选中任何卡片
  await loadMenus()
  await loadLogs()
}

/**
 * 加载批记录菜单树（平铺列表）
 */
async function loadMenus() {
  loading.value = true
  try {
    const res = await listBatchRecordMenuTree(recordId.value)
    const list = res.data || []
    menuList.value = buildMenuTree(list)
  } finally {
    loading.value = false
  }
}

/**
 * 加载当前批记录的全部操作日志（不分页）
 */
async function loadLogs() {
  try {
    const res = await listBatchRecordLogByRecordId(recordId.value)
    logList.value = res.data || []
  } catch (error) {
    logList.value = []
    ElMessage.warning('加载操作日志失败')
  }
}

/**
 * 构建菜单树（当前实现保留平铺数组，通过计算属性按需筛选）
 * @param {Array} list 菜单列表
 * @returns {Array} 原样返回，便于后续扩展
 */
function buildMenuTree(list) {
  // 这里暂不构建树形结构，直接使用平铺列表
  return list
}

/**
 * 获取指定车间下的所有表单（C节点）
 * @param {Number} workshopId 车间节点ID
 * @returns {Array} 表单列表
 */
function getWorkshopForms(workshopId) {
  return menuList.value.filter(m => m.menuType === 'C' && m.parentId === workshopId)
}

/**
 * 获取指定车间某表单下的卡片列表
 * @param {Number} workshopId 车间节点ID
 * @param {String|Number} formId 表单节点ID，'all' 表示全部
 * @returns {Array} 卡片列表（C节点）
 */
function getFormCards(workshopId, formId) {
  if (formId === 'all') return getWorkshopForms(workshopId)
  return menuList.value.filter(m => m.menuType === 'C' && m.parentId === workshopId && m.menuId === formId)
}

/**
 * 获取指定车间下的所有卡片（C节点）
 * @param {Number} workshopId 车间节点ID
 * @param {String|Number} tabName 当前页签名称
 * @returns {Array} 卡片列表
 */
function getWorkshopCards(workshopId, tabName) {
  if (tabName === 'all') return getWorkshopForms(workshopId)
  return getFormCards(workshopId, tabName)
}

/**
 * 获取卡片上应显示的按钮（F节点）
 * 全览页签不使用此方法，但其他页签需要
 * @param {Object} card C节点对象
 * @returns {Array} 按钮节点列表
 */
function getCardButtons(card) {
  return menuList.value.filter(m => m.menuType === 'F' && m.parentId === card.menuId && m.operationVisible === '1')
}

/**
 * 获取流程控制状态文本
 * @param {String} status 状态值
 * @returns {String} 状态中文描述
 */
function getControlStatusText(status) {
  const map = {
    '0': '待填报',
    '1': '已填报',
    '2': '已复核',
    '3': '已检查',
    '4': '已归档',
    '9': '已取消'
  }
  return map[status] || '未知'
}

/**
 * 获取操作类型文本
 * @param {String} actionType 操作类型
 * @returns {String} 操作类型中文描述
 */
function getActionTypeText(actionType) {
  const map = {
    EDIT: '编辑',
    SUBMIT: '提交',
    REVIEW: '复核',
    INSPECT: '检查',
    ARCHIVE: '归档',
    CANCEL_REVIEW: '取消复核',
    CANCEL_INSPECT: '取消检查',
    CANCEL_ARCHIVE: '取消归档'
  }
  return map[actionType] || actionType
}

/**
 * 获取操作类型标签颜色
 * @param {String} actionType 操作类型
 * @returns {String} Element Plus 标签类型
 */
function getActionTypeTag(actionType) {
  // 标签颜色映射
  if (actionType === 'EDIT') return 'warning'
  if (actionType === 'SUBMIT') return 'primary'
  if (actionType === 'REVIEW') return 'success'
  if (actionType === 'INSPECT') return 'info'
  if (actionType === 'ARCHIVE') return 'success'
  return 'info'
}

/**
 * 点击卡片：切换选中状态，用于过滤日志
 * @param {Object} card C节点对象
 */
function handleCardClick(card) {
  if (selectedCard.value && selectedCard.value.menuId === card.menuId) {
    // 再次点击同一卡片，取消筛选
    selectedCard.value = null
  } else {
    // 选中卡片，过滤日志
    selectedCard.value = card
  }
}

/**
 * 点击卡片按钮：打开动态组件弹窗
 * @param {Object} btn 按钮节点对象
 */
function handleActionClick(btn) {
  // 找到父级 C 节点，获取业务记录ID等信息
  const parentCard = menuList.value.find(m => m.menuId === btn.parentId)
  if (!parentCard) {
    ElMessage.warning('未找到卡片信息')
    return
  }
  dynamicDialogRef.value?.open({
    component: btn.component,
    recordId: recordId.value,
    menuId: btn.menuId,
    businessRecordId: parentCard.businessRecordId,
    operationCode: btn.operationCode,
    backendRoute: btn.backendRoute,
    tableName: parentCard.tableName,
    menuName: btn.menuName,       // 传递按钮节点名称，用于审批确认框
    buttonLabel: btn.buttonLabel  // 传递按钮标签，用于审批按钮文字
  })
}

/**
 * 动态组件内操作成功后触发刷新
 */
function handleRefresh() {
  // console.log('[Aggregate] 收到 Dynamic 的 refresh，准备刷新菜单和日志')
  loadMenus()
  loadLogs()
}

/**
 * 对话框关闭回调：清理所有状态
 */
function handleClosed() {
  recordId.value = null
  menuList.value = []
  logList.value = []
  selectedCard.value = null
  activeWorkshop.value = 'all'
  activeForm.value = 'all'
}

defineExpose({ open })
</script>

<style scoped>
.aggregate-container {
  height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.aggregate-tabs {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.aggregate-tabs :deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow: hidden;
}

.aggregate-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.form-tabs {
  height: 100%;
}

/* ===== 全览 Tab 布局 ===== */
.overview-container {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.overview-left {
  flex: 0 0 300px;
  width: 300px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.log-panel-header {
  flex-shrink: 0;
  background: #f5f7fa;
  padding: 10px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
}

.log-panel-body {
  flex: 1;
  min-height: 0;
  height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 日志占位提示 */
.log-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

/* 隐藏 el-table 可能产生的横向滚动条 */
.log-panel-body :deep(.el-table__inner-wrapper) {
  overflow-x: hidden !important;
}

/* 压缩表格行高 */
.log-panel-body :deep(.el-table--small .el-table__cell) {
  padding: 4px 0;
}

.overview-right {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* ===== 卡片区域 ===== */
.card-scroll-wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 8px;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
}
.preview-card {
  width: 220px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.preview-card:hover {
  border-color: #409eff;
}
.preview-card.is-selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
.card-title {
  font-weight: 600;
  margin-bottom: 4px;
}
.card-meta {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}
.card-status {
  margin-bottom: 8px;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>