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
    <!-- 自定义头部：全屏切换按钮 -->
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">生成批记录</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon style="cursor: pointer; font-size: 18px;" @click="isFullscreen = !isFullscreen">
            <FullScreen v-if="!isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <!-- ==================== 表单区：方案与计划日期 ==================== -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="发布方案" prop="releaseId">
            <el-select v-model="form.releaseId" placeholder="请选择发布方案" style="width: 100%" @change="handleReleaseChange">
              <el-option
                v-for="item in releaseList"
                :key="item.releaseId"
                :label="item.schemeName || item.releaseName"
                :value="item.releaseId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划开始" prop="planStart">
            <el-date-picker
              v-model="form.planStart"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择计划开始"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划结束" prop="planEnd">
            <el-date-picker
              v-model="form.planEnd"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择计划结束"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider content-position="left">工作单元分配</el-divider>

    <!-- 工作单元下拉框 -->
    <div v-loading="loadingMenus" class="workunit-section">
      <el-empty v-if="dirSelections.length === 0" description="请先选择发布方案" />
      <el-row :gutter="20">
        <el-col :span="8" v-for="dir in dirSelections" :key="dir.menuId">
          <el-form label-width="90px">
            <el-form-item :label="dir.menuName">
              <el-select
                v-model="dir.workUnitId"
                clearable
                placeholder="请选择工作单元"
                style="width: 100%"
                @change="handleWorkUnitChange(dir)"
              >
                <el-option
                  v-for="wu in workUnitList"
                  :key="wu.workUnitId"
                  :label="wu.workUnitName"
                  :value="wu.workUnitId"
                />
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

    <!-- 操作人配置（左右分栏） -->
    <template v-if="showPreview && form.releaseId">
      <el-divider content-position="left">操作人配置</el-divider>
      <el-row :gutter="16">
        <!-- 左侧：方案目录树 -->
        <el-col :span="7">
          <div class="tree-panel">
            <div class="panel-header">方案目录树</div>
            <div class="tree-body">
              <el-tree
                ref="treeRef"
                :data="menuTree"
                node-key="menuId"
                default-expand-all
                :expand-on-click-node="false"
                highlight-current
                @node-click="handleNodeClick"
              >
                <template #default="{ data }">
                  <div class="tree-node">
                    <el-icon class="node-icon">
                      <Folder v-if="data.menuType === 'M'" />
                      <Document v-else-if="data.menuType === 'C'" />
                      <Operation v-else />
                    </el-icon>
                    <span class="node-label">{{ data.menuName }}</span>
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
              <el-button v-if="selectedNode && selectedNode.menuType === 'C'" link type="primary" @click="openFocusPreviewDialog">
                专注预览
              </el-button>
            </div>
            <div class="detail-body">
              <!-- 目录节点：显示其下菜单节点列表 -->
              <div v-if="selectedNode && selectedNode.menuType === 'M'">
                <el-table :data="getChildMenus(selectedNode)" border>
                  <el-table-column label="菜单名称" prop="menuName" />
                  <el-table-column label="物理表名" prop="tableName" />
                  <el-table-column label="前端组件" prop="component" show-overflow-tooltip />
                </el-table>
              </div>

              <!-- 菜单节点：动态加载只读组件 -->
              <div v-else-if="selectedNode && selectedNode.menuType === 'C'">
                <div v-if="currentComponent" class="component-container">
                  <component :is="currentComponent" />
                </div>
                <el-empty v-else description="该节点不支持预览（缺少前端组件）" />
              </div>

              <!-- 按钮节点：显示操作人编辑 -->
              <div v-else-if="selectedNode && selectedNode.menuType === 'F'">
                <el-form label-width="80px">
                  <el-form-item label="操作人">
                    <el-select
                      v-model="selectedNode.operator"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入用户名称搜索"
                      :remote-method="searchUsers"
                      :loading="userLoading"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="user in userOptions"
                        :key="user.userId"
                        :label="user.nickName ? user.userName + ' (' + user.nickName + ')' : user.userName"
                        :value="user.userName"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="操作码">
                    <el-tag>{{ selectedNode.operationCode }}</el-tag>
                  </el-form-item>
                  <el-form-item label="组件路径">
                    <span>{{ selectedNode.component || '-' }}</span>
                  </el-form-item>
                  <el-form-item label="后端接口">
                    <span>{{ selectedNode.backendRoute || '-' }}</span>
                  </el-form-item>
                </el-form>
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

  <!-- ==================== 独立专注预览对话框（全屏） ==================== -->
  <el-dialog
    v-model="previewDialogVisible"
    title="专注预览"
    width="100%"
    fullscreen
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">{{ selectedNode?.menuName || '预览' }}</span>
        <el-button link type="primary" icon="Close" @click="previewDialogVisible = false">关闭</el-button>
      </div>
    </template>
    <div v-if="currentComponent" class="focus-component-wrapper">
      <component :is="currentComponent" />
    </div>
    <el-empty v-else description="该节点不支持预览" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, shallowRef, defineAsyncComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Operation, FullScreen, Aim, ArrowLeft, Close } from '@element-plus/icons-vue'
import { listScheme_release } from "@/api/fill/scheme_release"
import { listScheme_release_menu } from "@/api/fill/scheme_release_menu"
import { listWork_unit } from "@/api/fill/work_unit"
import { listWork_unit_operator } from "@/api/fill/work_unit_operator"
import { listUser } from "@/api/system/user"
import { generateInstance } from "@/api/batch/batch_plan"

defineOptions({ name: 'BatchPlanGenerate' })

const { proxy } = getCurrentInstance()

const visible = ref(false)
const previewDialogVisible = ref(false)
const formRef = ref(null)
const loadingMenus = ref(false)
const userLoading = ref(false)

const currentPlan = ref(null)
const releaseList = ref([])
const workUnitList = ref([])
const userOptions = ref([])

const showPreview = ref(false)
const isFullscreen = ref(false)

const menuTree = ref([])
const dirSelections = ref([])
const selectedNode = ref(null)
const currentComponent = shallowRef(null)

const form = reactive({
  releaseId: null,
  planStart: null,
  planEnd: null
})

const rules = {
  releaseId: [{ required: true, message: '请选择发布方案', trigger: 'change' }],
  planStart: [{ required: true, message: '请选择计划开始日期', trigger: 'change' }],
  planEnd: [{ required: true, message: '请选择计划结束日期', trigger: 'change' }]
}

const modules = import.meta.glob('/src/views/**/*.vue')

/**
 * 打开对话框
 */
function open(plan) {
  currentPlan.value = plan
  visible.value = true
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
  loadReleaseList()
  loadWorkUnitList()
  nextTick(() => formRef.value?.clearValidate())
}

/**
 * 加载发布方案列表
 */
function loadReleaseList() {
  listScheme_release({ pageNum: 1, pageSize: 1000 }).then(res => {
    releaseList.value = res.rows || res.data || []
  })
}

/**
 * 加载工作单元列表
 */
function loadWorkUnitList() {
  listWork_unit({ pageNum: 1, pageSize: 1000 }).then(res => {
    workUnitList.value = res.rows || res.data || []
  })
}

/**
 * 发布方案选择变化
 */
function handleReleaseChange(releaseId) {
  if (!releaseId) {
    menuTree.value = []
    dirSelections.value = []
    showPreview.value = false
    return
  }
  loadingMenus.value = true
  listScheme_release_menu({ releaseId, pageNum: 1, pageSize: 1000 }).then(res => {
    const menus = res.rows || res.data || []
    buildMenuTree(menus)
    buildDirSelections(menus)
  }).finally(() => {
    loadingMenus.value = false
  })
}

/**
 * 构建菜单树（平铺转树）
 */
function buildMenuTree(menus) {
  const map = {}
  menus.forEach(item => {
    item.children = []
    if (item.menuType === 'F') item.operator = ''
    map[item.menuId] = item
  })
  const roots = []
  menus.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) {
      roots.push(item)
    } else {
      map[item.parentId].children.push(item)
    }
  })
  menuTree.value = roots
}

/**
 * 构建一级目录选择数组
 */
function buildDirSelections(menus) {
  const dirs = menus.filter(m => m.menuType === 'M' && m.parentId === 0)
  dirSelections.value = dirs.map(d => ({ menuId: d.menuId, menuName: d.menuName, workUnitId: null }))
}

/**
 * 工作单元选择变化：回填操作人
 */
function handleWorkUnitChange(dir) {
  if (!dir.workUnitId) {
    clearOperatorsUnderDir(dir.menuId)
    return
  }
  listWork_unit_operator({ workUnitId: dir.workUnitId, pageNum: 1, pageSize: 1000 }).then(res => {
    const operators = res.rows || res.data || []
    const opMap = {}
    operators.forEach(op => { opMap[op.operationCode] = op.operator })
    fillOperatorsUnderDir(dir.menuId, opMap)
  })
}

/**
 * 清空某目录下所有按钮操作人
 */
function clearOperatorsUnderDir(dirMenuId) {
  const dirNode = findNode(menuTree.value, dirMenuId)
  if (!dirNode) return
  dirNode.children.forEach(menu => {
    if (menu.menuType === 'C') {
      (menu.children || []).forEach(btn => {
        if (btn.menuType === 'F') btn.operator = ''
      })
    }
  })
}

/**
 * 填充某目录下按钮操作人
 */
function fillOperatorsUnderDir(dirMenuId, opMap) {
  const dirNode = findNode(menuTree.value, dirMenuId)
  if (!dirNode) return
  dirNode.children.forEach(menu => {
    if (menu.menuType === 'C') {
      (menu.children || []).forEach(btn => {
        if (btn.menuType === 'F' && opMap[btn.operationCode] !== undefined) {
          btn.operator = opMap[btn.operationCode]
        }
      })
    }
  })
}

/**
 * 在树中查找节点
 */
function findNode(nodes, menuId) {
  for (const node of nodes) {
    if (node.menuId === menuId) return node
    if (node.children && node.children.length > 0) {
      const found = findNode(node.children, menuId)
      if (found) return found
    }
  }
  return null
}

/**
 * 显示/刷新预览
 */
function togglePreview() {
  if (!form.releaseId) {
    ElMessage.warning('请先选择发布方案')
    return
  }
  showPreview.value = true
  selectedNode.value = null
  currentComponent.value = null
}

/**
 * 获取目录下的菜单节点
 */
function getChildMenus(node) {
  return node.children || []
}

/**
 * 树节点点击
 */
function handleNodeClick(data) {
  selectedNode.value = data
  if (data.menuType === 'C') {
    loadMenuComponent(data.component)
  } else {
    currentComponent.value = null
  }
}

/**
 * 动态加载菜单只读组件
 */
function loadMenuComponent(componentPath) {
  if (!componentPath) {
    currentComponent.value = null
    ElMessage.warning('该节点未配置前端组件，不支持预览')
    return
  }
  const fullPath = '/src/views/' + componentPath
  const loader = modules[fullPath]
  if (loader) {
    currentComponent.value = defineAsyncComponent(loader)
  } else {
    currentComponent.value = null
    ElMessage.warning('前端组件未找到：' + componentPath)
  }
}

/**
 * 打开专注预览对话框（独立全屏）
 */
function openFocusPreviewDialog() {
  if (!currentComponent) {
    ElMessage.warning('当前菜单节点不支持预览')
    return
  }
  previewDialogVisible.value = true
}

/**
 * 远程搜索用户
 */
function searchUsers(query) {
  if (!query) {
    userOptions.value = []
    return
  }
  userLoading.value = true
  listUser({ pageNum: 1, pageSize: 100, userName: query }).then(res => {
    userOptions.value = res.rows || []
  }).finally(() => {
    userLoading.value = false
  })
}

/**
 * 关闭前确认（右上角关闭按钮）
 */
function handleBeforeClose(done) {
  ElMessageBox.confirm('确定要关闭生成批记录对话框吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    done()
  }).catch(() => {})
}

/**
 * 取消按钮点击：统一关闭确认
 */
function handleCancelClick() {
  ElMessageBox.confirm('确定要关闭生成批记录对话框吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    visible.value = false
  }).catch(() => {})
}

/**
 * 提交生成
 */
function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return

    const selectedDirs = dirSelections.value.filter(d => d.workUnitId)
    if (selectedDirs.length === 0) {
      ElMessage.warning('请至少选择一个工作单元')
      return
    }

    const workshopItems = selectedDirs.map(dir => {
      const dirNode = findNode(menuTree.value, dir.menuId)
      const operators = []
      if (dirNode) {
        dirNode.children.forEach(menu => {
          if (menu.menuType === 'C') {
            (menu.children || []).forEach(btn => {
              if (btn.menuType === 'F') {
                operators.push({ operationCode: btn.operationCode, operator: btn.operator || '' })
              }
            })
          }
        })
      }
      return { dirMenuId: dir.menuId, workUnitId: dir.workUnitId, operators }
    })

    const dto = {
      planId: currentPlan.value.planId,
      releaseId: form.releaseId,
      planStart: form.planStart,
      planEnd: form.planEnd,
      instanceDate: form.planStart,   // 实例日期使用计划开始日期
      instanceSeq: 1,
      workshopItems
    }

    ElMessageBox.confirm('确认生成批记录？生成后需在排产计划中点击“审核”进入生产。').then(() => {
      return generateInstance(dto)
    }).then(() => {
      ElMessage.success('生成成功')
      visible.value = false
      emit('success')
    }).catch(() => {})
  })
}

/**
 * 对话框关闭回调
 */
function handleClosed() {
  currentPlan.value = null
  showPreview.value = false
  isFullscreen.value = false
  previewDialogVisible.value = false
  menuTree.value = []
  dirSelections.value = []
  selectedNode.value = null
  currentComponent.value = null
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style scoped>
.workunit-section {
  margin-bottom: 16px;
}
.tree-panel,
.detail-panel {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}
.panel-header {
  background: #f5f7fa;
  padding: 10px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tree-panel {
  height: 500px;
}
.tree-body {
  height: calc(100% - 41px);
  overflow-y: auto;
  padding: 8px;
}
.detail-panel {
  height: 500px;
}
.detail-body {
  padding: 12px;
  height: calc(100% - 41px);
  overflow-y: auto;
}
.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  width: 100%;
}
.node-icon {
  font-size: 16px;
  color: #909399;
  flex-shrink: 0;
}
.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.component-container {
  min-height: 200px;
  overflow: auto;
}
.focus-component-wrapper {
  height: 100%;
  overflow: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px;
}
</style>