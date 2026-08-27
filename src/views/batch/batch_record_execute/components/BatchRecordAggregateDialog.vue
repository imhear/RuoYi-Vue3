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
          <el-tab-pane label="全 览" name="all">
            <div class="card-scroll-wrapper">
              <div class="card-list">
                <div
                  v-for="card in allCards"
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
    <DynamicComponentDialog ref="dynamicDialogRef" />
  </el-dialog>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { FullScreen, Aim } from '@element-plus/icons-vue'
import { listBatchRecordMenuTree } from '@/api/batch/batch_record_menu'
import DynamicComponentDialog from './DynamicComponentDialog.vue'

defineOptions({ name: 'BatchRecordAggregateDialog' })

const visible = ref(false)
const isFullscreen = ref(false)
const loading = ref(false)
const recordId = ref(null)
const title = ref('批记录')

const menuList = ref([])
const activeWorkshop = ref('all')
const activeForm = ref('all')
const dynamicDialogRef = ref(null)

/** 一级目录（车间） */
const workshopGroups = computed(() => {
  return menuList.value.filter(m => m.menuType === 'M' && m.parentId === 0)
})

/** 全部卡片（跨车间） */
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
function open(id, orderNum) {
  recordId.value = id
  title.value = orderNum ? `批记录 - ${orderNum}` : '批记录'
  visible.value = true
  activeWorkshop.value = 'all'
  activeForm.value = 'all'
  loadMenus()
}

/**
 * 加载批记录菜单树
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
 * 将平铺菜单列表构建为树形结构（保留在 menuList 中，但我们也按需查询子节点）
 * 由于接口返回全量平铺，我们直接使用原数组，通过 parentId 关联
 */
function buildMenuTree(list) {
  // 这里不实际构建树，保留平铺，通过 computed 筛选子节点
  return list
}

/**
 * 获取指定车间下的所有表单（C节点）
 */
function getWorkshopForms(workshopId) {
  const forms = menuList.value.filter(m => m.menuType === 'C' && m.parentId === workshopId)
  return forms
}

/**
 * 获取指定车间某表单下的卡片列表
 * 卡片本质就是 C 节点，我们直接返回 C 节点数组
 */
function getFormCards(workshopId, formId) {
  if (formId === 'all') {
    return getWorkshopForms(workshopId)
  }
  return menuList.value.filter(m => m.menuType === 'C' && m.parentId === workshopId && m.menuId === formId)
}

/**
 * 获取指定车间下的所有卡片（C节点）
 */
function getWorkshopCards(workshopId, tabName) {
  if (tabName === 'all') {
    return getWorkshopForms(workshopId)
  }
  return getFormCards(workshopId, tabName)
}

/**
 * 获取卡片上应显示的按钮（F节点）
 */
function getCardButtons(card) {
  return menuList.value.filter(m => m.menuType === 'F' && m.parentId === card.menuId && m.operationVisible === '1')
}

/**
 * 获取流程控制状态文本
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
 * 点击卡片按钮
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
    tableName: parentCard.tableName
  })
}

function handleClosed() {
  recordId.value = null
  menuList.value = []
  activeWorkshop.value = 'all'
  activeForm.value = 'all'
}

defineExpose({ open })
</script>

<style scoped>
.aggregate-container {
  height: 70vh;
  overflow: auto;
}
.aggregate-tabs {
  height: 100%;
}
.form-tabs {
  height: 100%;
}
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