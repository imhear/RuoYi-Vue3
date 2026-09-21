<template>
  <el-dialog
    v-model="visible"
    title="生成批记录"
    width="1200px"
    top="3vh"
    append-to-body
    :fullscreen="isFullscreen"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
    @closed="handleClosed"
  >
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">生成批记录</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon style="cursor: pointer; font-size: 18px;" @click="isFullscreen = !isFullscreen">
            <FullScreen v-if="!isFullscreen" /><Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <!-- 方案与计划日期 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="发布方案" prop="releaseId">
            <el-select v-model="form.releaseId" placeholder="请选择发布方案" style="width: 100%" @change="handleReleaseChange">
              <el-option
                v-for="item in releaseList"
                :key="item.releaseId"
                :label="item.schemeName+'-'+item.schemeCode+'-'+item.releaseCode"
                :value="item.releaseId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划开始" prop="planStart">
            <el-date-picker v-model="form.planStart" type="date" value-format="YYYY-MM-DD" placeholder="请选择计划开始" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划结束" prop="planEnd">
            <el-date-picker v-model="form.planEnd" type="date" value-format="YYYY-MM-DD" placeholder="请选择计划结束" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider content-position="left">工作单元分配</el-divider>
    <div v-loading="loadingMenus" class="workunit-section">
      <el-empty v-if="dirSelections.length === 0" description="请先选择发布方案" />
      <el-row :gutter="20">
        <el-col :span="8" v-for="dir in dirSelections" :key="dir.menuId">
          <el-form label-width="90px">
            <el-form-item :label="dir.menuName">
              <el-select v-model="dir.workUnitId" clearable placeholder="请选择工作单元" style="width: 100%" @change="handleWorkUnitChange(dir)">
                <el-option v-for="wu in workUnitList" :key="wu.id" :label="wu.name" :value="wu.id" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div style="text-align: right; margin-top: 8px;">
        <el-button type="primary" @click="togglePreview" :disabled="!form.releaseId">
          {{ showPreview ? '刷新预览' : '预览表单' }}
        </el-button>
      </div>
    </div>

    <!-- 表单预览与节点详情 -->
    <template v-if="showPreview && form.releaseId">
      <el-divider content-position="left">表单预览</el-divider>
      <el-row :gutter="16">
        <!-- 左侧：方案目录树 -->
        <el-col :span="7">
          <div class="tree-panel">
            <div class="panel-header">方案目录树</div>
            <div class="tree-body">
              <el-tree ref="treeRef" :data="menuTree" node-key="menuId" default-expand-all :expand-on-click-node="false" highlight-current @node-click="handleNodeClick">
                <template #default="{ data }">
                  <div class="tree-node">
                    <el-icon class="node-icon">
                      <Folder v-if="data.menuType === 'M'" />
                      <Document v-else-if="data.menuType === 'C'" />
                      <Operation v-else />
                    </el-icon>
                    <span class="node-label">
                      {{ data.menuName }}
                      <template v-if="data.menuType === 'M'">
                        - <span :style="{ color: data.workUnitName ? 'inherit' : 'red' }">{{ data.workUnitName || '未设置' }}</span>
                      </template>
                    </span>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
        </el-col>
        <!-- 右侧：节点详情 -->
        <el-col :span="17">
          <div class="detail-panel">
            <div class="panel-header">
              <span>节点详情</span>
              <el-button v-if="selectedNode && selectedNode.menuType === 'C'" link type="primary" @click="openFocusPreviewDialog">专注预览</el-button>
            </div>
            <div class="detail-body">
              <!-- 目录节点：展示子节点列表 -->
              <div v-if="selectedNode && selectedNode.menuType === 'M'">
                <el-table :data="getChildMenus(selectedNode)" border>
                  <el-table-column label="菜单名称" prop="menuName" />
                  <el-table-column label="物理表名" prop="tableName" />
                  <el-table-column label="前端组件" prop="component" show-overflow-tooltip />
                </el-table>
              </div>
              <!-- 菜单节点：提示点击查看按钮 -->
              <div v-else-if="selectedNode && selectedNode.menuType === 'C'">
                <el-empty description="请点击该节点下的“查看”按钮预览空表单" />
              </div>
              <!-- 按钮节点 -->
              <div v-else-if="selectedNode && selectedNode.menuType === 'F'">
                <!-- 预览按钮：加载动态组件 -->
                <div v-if="selectedNode.actionType === 'PREVIEW' && currentComponent" class="component-container">
                  <component :is="currentComponent" v-bind="componentProps" />
                </div>
                <el-empty v-else-if="selectedNode.actionType === 'PREVIEW'" description="组件未加载" />
                <!-- 其他按钮：仅展示配置信息（不再配置操作人） -->
                <el-descriptions v-else :column="1" border>
                  <el-descriptions-item label="操作码">{{ selectedNode.operationCode || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="按钮标签">{{ selectedNode.buttonLabel || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="组件路径">{{ selectedNode.component || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="后端接口">{{ selectedNode.backendRoute || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="权限标识">{{ selectedNode.perms || '-' }}</el-descriptions-item>
                </el-descriptions>
              </div>
              <el-empty v-else description="请选择左侧节点查看详情" />
            </div>
          </div>
        </el-col>
      </el-row>
    </template>

    <template #footer>
      <el-button @click="handleCancelClick">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="!showPreview">确 认 生 成</el-button>
    </template>
  </el-dialog>

  <!-- 独立专注预览对话框（全屏） -->
  <el-dialog v-model="previewDialogVisible" title="专注预览" width="100%" fullscreen append-to-body :show-close="false" :close-on-click-modal="false">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">{{ selectedNode?.menuName || '预览' }}</span>
        <el-button link type="primary" icon="Close" @click="previewDialogVisible = false">关闭</el-button>
      </div>
    </template>
    <div v-if="currentComponent" class="focus-component-wrapper"><component :is="currentComponent" /></div>
    <el-empty v-else description="该节点不支持预览" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, shallowRef, defineAsyncComponent, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Operation, FullScreen, Aim, Close } from '@element-plus/icons-vue'
import { listScheme_release } from "@/api/fill/scheme_release"
import { listScheme_release_menu } from "@/api/fill/scheme_release_menu"
import { listWork_unit } from "@/api/basic/work_unit"
import { generateBatchRecord } from "@/api/batch/batch_record"

defineOptions({ name: 'BatchRecordGenerate' })

const { proxy } = getCurrentInstance()

const visible = ref(false)
const previewDialogVisible = ref(false)
const isFullscreen = ref(false)
const showPreview = ref(false)
const loadingMenus = ref(false)
const currentRecord = ref(null)
const releaseList = ref([])
const workUnitList = ref([])
const menuTree = ref([])
const dirSelections = ref([])
const selectedNode = ref(null)
const currentComponent = shallowRef(null)
const componentProps = ref({})
const formRef = ref(null)

const form = reactive({ releaseId: null, planStart: null, planEnd: null })
const rules = {
  releaseId: [{ required: true, message: '请选择发布方案', trigger: 'change' }],
  planStart: [{ required: true, message: '请选择计划开始日期', trigger: 'change' }],
  planEnd: [{ required: true, message: '请选择计划结束日期', trigger: 'change' }]
}
const modules = import.meta.glob('/src/views/**/*.vue')

// ==================== 打开/关闭 ====================
function open(record) {
  currentRecord.value = record
  visible.value = true
  resetDialogState()
  loadReleaseList()
  loadWorkUnitList()
  nextTick(() => formRef.value?.clearValidate())
}

function resetDialogState() {
  form.releaseId = null
  form.planStart = null
  form.planEnd = null
  showPreview.value = false
  isFullscreen.value = false
  previewDialogVisible.value = false
  dirSelections.value = []
  menuTree.value = []
  selectedNode.value = null
  currentComponent.value = null
  componentProps.value = {}
}

function handleBeforeClose(done) {
  ElMessageBox.confirm('确定要关闭生成批记录对话框吗？', '提示', { type: 'warning' })
    .then(() => done()).catch(() => {})
}
function handleCancelClick() {
  ElMessageBox.confirm('确定要关闭生成批记录对话框吗？', '提示', { type: 'warning' })
    .then(() => { visible.value = false }).catch(() => {})
}
function handleClosed() {
  currentRecord.value = null
  resetDialogState()
}

// ==================== 数据加载 ====================
function loadReleaseList() {
  listScheme_release({ pageNum: 1, pageSize: 1000 }).then(res => { releaseList.value = res.rows || res.data || [] })
}
function loadWorkUnitList() {
  listWork_unit({ pageNum: 1, pageSize: 1000 }).then(res => { workUnitList.value = res.rows || res.data || [] })
}
function handleReleaseChange(releaseId) {
  if (!releaseId) { menuTree.value = []; dirSelections.value = []; showPreview.value = false; return }
  loadingMenus.value = true
  listScheme_release_menu({ releaseId, pageNum: 1, pageSize: 1000 })
    .then(res => { const menus = res.rows || res.data || []; buildMenuTree(menus); buildDirSelections(menus) })
    .finally(() => { loadingMenus.value = false })
}

// ==================== 菜单树构建 ====================
function buildMenuTree(menus) {
  const map = {}
  menus.forEach(item => {
    item.children = []
    if (item.menuType === 'M') { item.workUnitId = null; item.workUnitName = '' }
    map[item.menuId] = item
  })
  const roots = []
  menus.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) roots.push(item)
    else map[item.parentId].children.push(item)
  })
  menuTree.value = roots
}
function buildDirSelections(menus) {
  dirSelections.value = menus.filter(m => m.menuType === 'M' && m.parentId === 0)
}

// ==================== 工作单元切换 ====================
/**
 * 工作单元切换回调
 * 
 * 简化后行为（与 basic_work_unit_operator 表删除后对齐）：
 * 1. 从已加载的 workUnitList 中查找工作单元名称，回填 dir.workUnitName
 * 2. 不再预设操作人（操作人由后续审批时填充当前登录用户）
 * 
 * @param {Object} dir 当前一级目录对象
 */
function handleWorkUnitChange(dir) {
  const workUnit = workUnitList.value.find(w => w.id === dir.workUnitId)
  dir.workUnitName = workUnit ? workUnit.name : ''
}

// ==================== 预览与动态组件 ====================
function togglePreview() {
  if (!form.releaseId) { ElMessage.warning('请先选择发布方案'); return }
  showPreview.value = true
  selectedNode.value = null
  currentComponent.value = null
  componentProps.value = {}
}
function getChildMenus(node) { return node.children || [] }
function handleNodeClick(data) {
  selectedNode.value = data
  if (data.menuType === 'C') {
    currentComponent.value = null
    componentProps.value = {}
  } else if (data.menuType === 'F') {
    if (data.actionType === 'PREVIEW') {
      loadMenuComponent(data.component)
      componentProps.value = { actionType: 'PREVIEW' }
    } else {
      currentComponent.value = null
      componentProps.value = {}
    }
  }
}
function loadMenuComponent(componentPath) {
  if (!componentPath) { currentComponent.value = null; ElMessage.warning('该节点未配置前端组件，不支持预览'); return }
  const fullPath = '/src/views/' + componentPath
  const loader = modules[fullPath]
  if (loader) currentComponent.value = defineAsyncComponent(loader)
  else { currentComponent.value = null; ElMessage.warning('前端组件未找到：' + componentPath) }
}
function openFocusPreviewDialog() {
  if (!currentComponent) { ElMessage.warning('当前菜单节点不支持预览'); return }
  previewDialogVisible.value = true
}

// ==================== 提交生成 ====================
function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return
    const selectedDirs = dirSelections.value.filter(d => d.workUnitId)
    if (selectedDirs.length === 0) { ElMessage.warning('请至少选择一个工作单元'); return }
    // 简化后：workshopItems 只传 dirMenuId 和 workUnitId，不再传 operators
    const workshopItems = selectedDirs.map(dir => ({
      dirMenuId: dir.menuId,
      workUnitId: dir.workUnitId,
      operators: []
    }))
    const dto = {
      recordId: currentRecord.value.recordId,
      releaseId: form.releaseId,
      planStart: form.planStart,
      planEnd: form.planEnd,
      workshopItems
    }
    ElMessageBox.confirm('确认生成批记录？生成后需在批记录列表中点击“审核”进入生产。')
      .then(() => generateBatchRecord(dto))
      .then(() => { ElMessage.success('生成成功'); visible.value = false; emit('success') })
      .catch(() => {})
  })
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style scoped>
/* 保留原有样式 */
.workunit-section { margin-bottom: 16px; }
.tree-panel, .detail-panel { border: 1px solid #e4e7ed; border-radius: 6px; overflow: hidden; }
.panel-header { background: #f5f7fa; padding: 10px 16px; font-weight: 600; border-bottom: 1px solid #e4e7ed; display: flex; justify-content: space-between; align-items: center; }
.tree-panel { height: 500px; }
.tree-body { height: calc(100% - 41px); overflow-y: auto; padding: 8px; }
.detail-panel { height: 500px; }
.detail-body { padding: 12px; height: calc(100% - 41px); overflow-y: auto; }
.tree-node { display: flex; align-items: center; gap: 6px; font-size: 14px; width: 100%; }
.node-icon { font-size: 16px; color: #909399; flex-shrink: 0; }
.node-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.component-container { min-height: 200px; overflow: auto; }
.focus-component-wrapper { height: 100%; overflow: auto; border: 1px solid #e4e7ed; border-radius: 4px; padding: 8px; }
</style>