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
          <!-- 全览 Tab：左侧日志 + 右侧折叠分组卡片 -->
          <el-tab-pane label="全 览" name="all">
            <div class="overview-container">
              <!-- 左侧：操作日志（宽度 300px，如备注列超宽可横向滚动查看） -->
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
                    :cell-style="{ 'text-align': 'center', 'font-size': '12px', 'white-space': 'nowrap' }"
                  >
                    <el-table-column label="操作时间" align="center" min-width="130" show-overflow-tooltip>
                      <template #default="scope">
                        {{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="operator" align="center" min-width="70" show-overflow-tooltip />
                    <!--
                      操作类型列：仅显示操作类型标签，语义单一
                      备注信息由下一列"备注"独立承载，避免同一列塞入两类语义
                    -->
                    <el-table-column label="操作类型" align="center" min-width="80">
                      <template #default="scope">
                        <el-tag size="small" :type="getActionTypeTag(scope.row.actionType)">
                          {{ getActionTypeText(scope.row.actionType) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <!--
                      备注列：独立展示 remark 字段
                      - 使用 show-overflow-tooltip 单行显示，超长时省略 + hover 显示完整内容
                      - 左侧面板宽度收窄为 300px 后，若备注较长会被省略号截断，
                        可通过拖动表格下方横向滚动条查看完整内容（已保留 el-table 横向滚动能力）
                    -->
                    <el-table-column
                      label="备注"
                      prop="remark"
                      align="center"
                      min-width="120"
                      :show-overflow-tooltip="true"
                    />
                  </el-table>
                </div>
              </div>

              <!-- 右侧：按车间折叠分组的卡片列表（全览卡片不显示操作按钮） -->
              <div class="overview-right">
                <div class="card-scroll-wrapper">
                  <!-- 一键展开/折叠所有分组：方便车间较多时快速收起全部 -->
                  <div class="overview-toolbar">
                    <el-button link type="primary" size="small" @click="toggleAllCollapse">
                      {{ isAllCollapsed ? '全部展开' : '全部折叠' }}
                    </el-button>
                  </div>

                  <!--
                    使用 el-collapse 按车间分组渲染卡片：
                    - v-model="activeCollapseNames" 绑定所有展开的车间 menuId 数组
                    - 不加 accordion 属性，支持同时展开多个组，组间互不影响
                    - 每个 el-collapse-item 的 name 为车间 menuId 的字符串形式
                    - 默认打开时由 loadMenus 成功后自动展开所有车间分组
                  -->
                  <el-collapse v-model="activeCollapseNames" class="overview-collapse">
                    <el-collapse-item
                      v-for="group in workshopCardGroups"
                      :key="group.workshop.menuId"
                      :name="String(group.workshop.menuId)"
                    >
                      <!-- 组标题：车间名 + 卡片数量 + 工作单元名称 -->
                      <template #title>
                        <div class="overview-group-header">
                          <span class="overview-group-title">{{ group.workshop.menuName }}</span>
                          <span class="overview-group-count">（{{ group.cards.length }}）</span>
                          <span class="overview-group-unit">
                            · {{ group.workshop.workUnitName || '未分配工作单元' }}
                          </span>
                        </div>
                      </template>
                      <!-- 组内卡片网格：宽度 188px，一行放 3 个 -->
                      <div class="overview-card-list">
                        <div
                          v-for="card in group.cards"
                          :key="card.menuId"
                          class="overview-card"
                          :class="{ 'is-selected': selectedCard && selectedCard.menuId === card.menuId }"
                          @click="handleCardClick(card)"
                        >
                          <!-- 第一行：菜单名称 + 状态 tag -->
                          <div class="overview-card-row">
                            <span class="overview-card-title">{{ card.menuName }}</span>
                            <el-tag size="small" :type="card.instanceControlStatus === '0' ? 'info' : 'success'">
                              {{ getControlStatusText(card.instanceControlStatus) }}
                            </el-tag>
                          </div>
                          <!--
                            第二行：最后编辑信息（操作人 + 时间）
                            - 原"工作单元"信息已上移到组标题，卡片内不再重复
                            - 无编辑记录时显示"暂无编辑记录"，保持占位一致，避免卡片高度参差
                          -->
                          <div class="overview-card-meta">
                            <template v-if="getLastEditInfo(card)">
                              最后编辑：{{ getLastEditInfo(card).operator }} {{ parseTime(getLastEditInfo(card).createTime, '{m}-{d} {h}:{i}') }}
                            </template>
                            <template v-else>
                              <span class="overview-card-empty">暂无编辑记录</span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 各车间 Tab（保留操作按钮，样式完全不变） -->
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
                      <div v-if="getLastEditInfo(card)" class="card-last-edit">
                        最后编辑：{{ getLastEditInfo(card).operator }} {{ parseTime(getLastEditInfo(card).createTime, '{m}-{d} {h}:{i}') }}
                      </div>
                      <div class="card-actions">
                        <el-button
                          v-for="btn in getCardButtons(card)"
                          :key="btn.menuId"
                          v-hasPermi="[btn.perms]"
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
                          v-hasPermi="[btn.perms]"
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
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { FullScreen, Aim } from '@element-plus/icons-vue'
import { listBatchRecordMenuTree } from '@/api/batch/batch_record_menu'
import { listBatchRecordLogByRecordId } from '@/api/batch/batch_record_log'
import { getMyWorkUnits } from '@/api/basic/work_unit'
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

// ==================== 全览 Tab 折叠面板状态 ====================
/**
 * 全览 Tab 中已展开的车间分组 menuId 数组
 *
 * el-collapse 的 v-model 绑定值，元素类型为字符串（与 el-collapse-item 的 :name 一致）。
 * 初始为空数组，loadMenus 成功后会默认展开所有车间分组。
 * 支持同时展开多个组（未使用 accordion 属性）。
 */
const activeCollapseNames = ref([])

/**
 * 是否所有车间分组已折叠
 *
 * 用于"全部展开/折叠"按钮的文案切换。
 * 判断依据：activeCollapseNames 长度是否为 0。
 */
const isAllCollapsed = computed(() => {
  return activeCollapseNames.value.length === 0
})

// ==================== 日志相关状态 ====================
const logList = ref([])                    // 当前批记录的全部操作日志
const selectedCard = ref(null)             // 当前选中的卡片对象（C节点），null表示未选择

// ==================== 权限相关状态 ====================
/**
 * 当前登录用户可操作的工作单元编码列表
 * 
 * 由 getMyWorkUnits 接口加载，用于对聚合入口的卡片按钮进行"工作单元级"数据权限过滤。
 * 非当前用户工作单元下的操作按钮将被隐藏（查看按钮 PREVIEW 豁免）。
 * 
 * 数据来源：
 * - 后端接口 getMyWorkUnits 查询 basic_work_unit_operator 中 operator = 当前登录用户名 AND status = '0' 的记录
 * - 提取去重后的 workUnitId，关联 basic_work_unit 获取 code 列表
 * 
 * 初始为空数组，加载失败也降级为空数组（严格模式，非查看按钮全部隐藏）。
 */
const myWorkUnitCodes = ref([])

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
 * 按车间分组的卡片列表（仅全览 Tab 使用）
 *
 * 结构：[{ workshop, cards }, ...]
 * - workshop：车间节点（menuType='M' 且 parentId=0），含 workUnitName 字段
 * - cards：该车间下的所有卡片（menuType='C' 且 parentId=workshop.menuId）
 *
 * 过滤掉 cards 为空的车间（避免出现只有标题没有卡片的空组）。
 */
const workshopCardGroups = computed(() => {
  return workshopGroups.value
    .map(ws => ({
      workshop: ws,
      cards: getWorkshopCards(ws.menuId, 'all')
    }))
    .filter(g => g.cards.length > 0)
})

/**
 * 打开聚合入口
 * 
 * 并行加载三类数据：
 * 1. 批记录菜单树（含 M/C/F 节点结构）
 * 2. 操作日志（用于卡片下方"最后编辑"及左侧日志面板）
 * 3. 当前用户可操作的工作单元编码列表（用于双重认证的"数据权限"过滤）
 * 
 * 三个请求互不依赖，可并发执行以缩短加载时间。
 * 
 * @param {Number} id 批记录ID
 * @param {String} orderNum 工单号
 */
async function open(id, orderNum) {
  recordId.value = id
  title.value = orderNum ? `批记录 - ${orderNum}` : '批记录'
  visible.value = true
  activeWorkshop.value = 'all'
  activeForm.value = 'all'
  selectedCard.value = null
  await Promise.all([loadMenus(), loadLogs(), loadMyWorkUnitCodes()])
}

/**
 * 加载批记录菜单树（平铺列表）
 *
 * 加载成功后自动展开全览 Tab 的所有车间分组，
 * 通过 nextTick 等待 workshopCardGroups 计算属性重算完成后再赋值。
 */
async function loadMenus() {
  loading.value = true
  try {
    const res = await listBatchRecordMenuTree(recordId.value)
    const list = res.data || []
    menuList.value = buildMenuTree(list)
    // 数据加载完成后，默认展开所有车间分组
    nextTick(() => {
      activeCollapseNames.value = workshopCardGroups.value.map(g => String(g.workshop.menuId))
    })
  } finally {
    loading.value = false
  }
}

/**
 * 加载当前批记录的全部操作日志（不分页）
 * 
 * 返回的日志记录中 remark 字段用于在"备注"列独立展示（如审批意见、反审原因）。
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
 * 加载当前登录用户可操作的工作单元编码列表
 * 
 * 用于对聚合入口的卡片按钮进行"工作单元级"数据权限过滤。
 * 加载失败时降级为空数组，此时非查看按钮将全部隐藏（严格模式）。
 * 
 * 容错策略：
 * - 不弹出错误提示，避免干扰用户体验
 * - 仅在控制台记录错误，便于排查
 */
async function loadMyWorkUnitCodes() {
  try {
    const res = await getMyWorkUnits()
    myWorkUnitCodes.value = res.data || []
  } catch (error) {
    myWorkUnitCodes.value = []
    console.error('加载当前用户工作单元列表失败', error)
  }
}

/**
 * 构建菜单树（当前实现保留平铺数组，通过计算属性按需筛选）
 * @param {Array} list 菜单列表
 * @returns {Array} 原样返回，便于后续扩展
 */
function buildMenuTree(list) {
  return list
}

/**
 * 获取指定车间下的所有表单（C节点）
 */
function getWorkshopForms(workshopId) {
  return menuList.value.filter(m => m.menuType === 'C' && m.parentId === workshopId)
}

/**
 * 获取指定车间某表单下的卡片列表
 */
function getFormCards(workshopId, formId) {
  if (formId === 'all') return getWorkshopForms(workshopId)
  return menuList.value.filter(m => m.menuType === 'C' && m.parentId === workshopId && m.menuId === formId)
}

/**
 * 获取指定车间下的所有卡片
 */
function getWorkshopCards(workshopId, tabName) {
  if (tabName === 'all') return getWorkshopForms(workshopId)
  return getFormCards(workshopId, tabName)
}

/**
 * 一键展开/折叠全览 Tab 的所有车间分组
 *
 * 若当前所有分组均已折叠，则展开所有；
 * 否则折叠所有（清空 activeCollapseNames）。
 */
function toggleAllCollapse() {
  if (isAllCollapsed.value) {
    activeCollapseNames.value = workshopCardGroups.value.map(g => String(g.workshop.menuId))
  } else {
    activeCollapseNames.value = []
  }
}

/**
 * 获取卡片上应显示的按钮（F节点）
 * 
 * 三重过滤（关卡逐步严格）：
 * 
 * 关卡1：基础条件
 *   - menuType='F'、parentId 匹配当前卡片、operationVisible='1'
 * 
 * 关卡2：工作单元过滤（数据权限）
 *   - 若 actionType='PREVIEW'（查看按钮），豁免此规则，任何登录用户均可查看
 *   - 其他按钮：要求 card.workUnitCode 在 myWorkUnitCodes 中，否则隐藏
 * 
 * 关卡3：状态过滤（业务规则）
 *   - 由后端通过 card.allowedActions 提供当前状态下允许的操作类型列表
 *   - 只有 actionType 在 allowedActions 中的按钮才显示
 *   - 若 card.allowedActions 字段缺失或为空数组，降级为"隐藏所有按钮"
 *     （严格模式，因为未知状态时不应放行任何操作）
 * 
 * 三重认证架构：
 * - 关卡1：前端数据合法性检查
 * - 关卡2：数据权限（用户角色 ∩ 工作单元角色）
 * - 关卡3：业务状态机（当前状态允许的操作）
 * - 三层是"与"关系，任一不满足则按钮不显示
 * - 模板层的 v-hasPermi 指令处理功能权限（perms 校验），是额外的独立关卡
 * 
 * @param {Object} card C节点对象
 * @returns {Array} 通过所有过滤条件的按钮列表
 */
function getCardButtons(card) {
  // 关卡3：提前取出当前卡片允许的操作列表
  // 若 card.allowedActions 为 undefined/null，视为"未知状态"，降级为隐藏所有按钮
  const allowedActions = card.allowedActions || []
  if (allowedActions.length === 0) {
    // 后端未返回 allowedActions 或状态未定义，严格模式下隐藏所有按钮
    return []
  }

  return menuList.value.filter(m => {
    // 关卡1：必须是当前卡片的 F 子节点且配置为可见
    if (m.menuType !== 'F' || m.parentId !== card.menuId || m.operationVisible !== '1') {
      return false
    }

    // 关卡3：状态过滤——按钮的 actionType 必须在 allowedActions 中
    if (!allowedActions.includes(m.actionType)) {
      return false
    }

    // 关卡2：工作单元过滤——查看按钮（PREVIEW）豁免，其他按钮要求工作单元匹配
    if (m.actionType !== 'PREVIEW') {
      if (!card.workUnitCode || !myWorkUnitCodes.value.includes(card.workUnitCode)) {
        return false
      }
    }

    return true
  })
}

/**
 * 获取流程控制状态文本
 */
function getControlStatusText(status) {
  const map = {
    '0': '待提交',
    '1': '已提交',
    '2': '已复核',
    '3': '已检查',
    '4': '已归档',
    '9': '已取消'
  }
  return map[status] || '未知'
}

/**
 * 获取卡片最后编辑信息
 */
function getLastEditInfo(card) {
  const edits = logList.value.filter(log => log.cMenuId === card.menuId && log.actionType === 'EDIT')
  if (edits.length === 0) return null
  edits.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  return edits[0]
}

/**
 * 获取操作类型文本
 */
function getActionTypeText(actionType) {
  const map = {
    EDIT: '编辑',
    SUBMIT: '提交',
    REVIEW: '复核',
    INSPECT: '检查',
    ARCHIVE: '归档',
    CANCEL_SUBMIT: '取消提交',
    CANCEL_REVIEW: '取消复核',
    CANCEL_INSPECT: '取消检查',
    CANCEL_ARCHIVE: '取消归档'
  }
  return map[actionType] || actionType
}

/**
 * 获取操作类型标签颜色
 */
function getActionTypeTag(actionType) {
  if (actionType === 'EDIT') return 'warning'
  if (actionType === 'SUBMIT') return 'primary'
  if (actionType === 'REVIEW') return 'success'
  if (actionType === 'INSPECT') return 'info'
  if (actionType === 'ARCHIVE') return 'success'
  if (actionType === 'CANCEL_SUBMIT') return 'danger'
  if (actionType === 'CANCEL_REVIEW') return 'warning'
  if (actionType === 'CANCEL_INSPECT') return 'warning'
  if (actionType === 'CANCEL_ARCHIVE') return 'warning'
  return 'info'
}

/**
 * 点击卡片：切换选中状态
 */
function handleCardClick(card) {
  if (selectedCard.value && selectedCard.value.menuId === card.menuId) {
    selectedCard.value = null
  } else {
    selectedCard.value = card
  }
}

/**
 * 点击卡片按钮：打开动态组件弹窗
 * 直接传递按钮节点的 actionType（大写），并附带 cMenuId 用于签名行回显
 */
function handleActionClick(btn) {
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
    menuName: btn.menuName,
    buttonLabel: btn.buttonLabel,
    actionType: btn.actionType,
    cMenuId: parentCard.menuId   // 当前表单对应的 C 节点 ID
  })
}

/**
 * 动态组件内操作成功后触发刷新
 * 
 * 操作成功后可能涉及工作单元权限变化（如首次提交后成为操作人），
 * 因此同时刷新菜单树、日志和工作单元列表。
 */
function handleRefresh() {
  loadMenus()
  loadLogs()
  loadMyWorkUnitCodes()
}

/**
 * 对话框关闭回调
 * 
 * 清空所有状态，避免下次打开时残留数据。
 * 特别注意清空 myWorkUnitCodes 与 activeCollapseNames，
 * 防止上一个批记录的状态污染下一次会话。
 */
function handleClosed() {
  recordId.value = null
  menuList.value = []
  logList.value = []
  selectedCard.value = null
  activeWorkshop.value = 'all'
  activeForm.value = 'all'
  myWorkUnitCodes.value = []
  activeCollapseNames.value = []
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

/* 左侧日志面板：宽度回到 300px
 * 备注列较长时会被省略号截断，可通过表格下方横向滚动条查看完整内容。
 * 由于反审核操作极少，备注列被截断的业务影响可接受。
 */
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

/* 右侧卡片区：宽度自动撑满剩余空间 */
.overview-right {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* 折叠面板上方的工具条：右对齐"全部展开/折叠"按钮 */
.overview-toolbar {
  text-align: right;
  padding: 0 4px 4px 4px;
}

/* ===== 总览 Tab：el-collapse 折叠面板紧凑样式覆盖 ===== */
.overview-collapse {
  border-top: none;
  border-bottom: none;
}

/* 面板头部：压缩高度、浅灰背景、圆角，形成分组卡片感 */
.overview-collapse :deep(.el-collapse-item__header) {
  height: auto;
  min-height: 32px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  background: #fafafa;
  border-bottom: none;
  border-radius: 4px;
  line-height: 1.4;
}

/* 面板内容包裹层：去掉默认 border，留上下 padding */
.overview-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
  padding: 6px 0 2px 0;
}

/* 面板内容区：去默认底部 padding */
.overview-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

/* 面板之间的间距 */
.overview-collapse :deep(.el-collapse-item) {
  margin-bottom: 8px;
}

/* 展开箭头右对齐 */
.overview-collapse :deep(.el-collapse-item__arrow) {
  margin-left: auto;
}

/* ===== 组标题内容 ===== */
.overview-group-header {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.overview-group-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  flex-shrink: 0;
}

.overview-group-count {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
  flex-shrink: 0;
}

/* 工作单元名称：浅灰小字，右对齐，过长时省略 */
.overview-group-unit {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

/* ===== 组内卡片网格 ===== */
.overview-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 4px;
}

/* 紧凑卡片：宽度 188px，两行结构，一行可放 3 个 */
.overview-card {
  width: 188px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px 8px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.overview-card:hover {
  border-color: #409eff;
}

.overview-card.is-selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 第一行：菜单名（左）+ 状态 tag（右） */
.overview-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 2px;
}

.overview-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

/* 缩小 tag 内边距，避免在 188px 内抢占过多空间 */
.overview-card-row :deep(.el-tag--small) {
  padding: 0 4px;
  height: 18px;
  line-height: 16px;
}

/* 第二行：最后编辑信息（操作人 + 时间），过长时省略 */
.overview-card-meta {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 无编辑记录时的弱化文本 */
.overview-card-empty {
  color: #c0c4cc;
  font-size: 12px;
}

/* ===== 卡片区域（非总览 Tab 使用，本次未改动） ===== */
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
.card-last-edit {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>