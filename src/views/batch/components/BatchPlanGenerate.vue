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
                :label="item.schemeName+'-'+item.schemeCode+'-'+item.releaseCode"
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
                    <span class="node-label">
                    {{ data.menuName }}
                    <template v-if="data.menuType === 'M'">
                      - <span :style="{ color: data.workUnitName ? 'inherit' : 'red' }">{{ data.workUnitName || '未设置' }}</span>
                    </template>
                    <template v-if="data.menuType === 'F'">
                      - <span :style="{ color: data.operator ? 'inherit' : 'red' }">{{ data.operator || '未设置' }}</span>
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
                    <el-input v-model="selectedNode.operator" placeholder="请选择用户" readonly>
                      <template #append>
                        <el-button icon="Search" @click="openSelectUser" />
                      </template>
                    </el-input>
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

  <!-- 独立用户选择组件 -->
  <SelectUser ref="selectUserRef" @ok="onUserSelected" />
</template>

<script setup>
import { ref, reactive, shallowRef, defineAsyncComponent, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Operation, FullScreen, Aim, Close } from '@element-plus/icons-vue'

import { listScheme_release } from "@/api/fill/scheme_release"
import { listScheme_release_menu } from "@/api/fill/scheme_release_menu"
import { listWork_unit } from "@/api/fill/work_unit"
import { listWork_unit_operator } from "@/api/fill/work_unit_operator"
import { generateInstance } from "@/api/batch/batch_plan"

import SelectUser from '@/views/fill/components/SelectUser.vue'

defineOptions({ name: 'BatchPlanGenerate' })

const { proxy } = getCurrentInstance()

/** ==================== 对话框状态 ==================== */
const visible = ref(false)                 // 主对话框是否可见
const previewDialogVisible = ref(false)    // 独立专注预览对话框是否可见
const isFullscreen = ref(false)            // 主对话框是否全屏
const showPreview = ref(false)             // 是否已展开“操作人配置”区域
const loadingMenus = ref(false)            // 发布方案菜单加载中

/** ==================== 基础数据状态 ==================== */
const currentPlan = ref(null)              // 当前排产计划行数据
const releaseList = ref([])                // 发布方案列表
const workUnitList = ref([])               // 工作单元列表

/** ==================== 方案结构状态 ==================== */
const menuTree = ref([])                   // 发布方案菜单树（M/C/F）
const dirSelections = ref([])              // 一级目录及对应工作单元选择
const selectedNode = ref(null)             // 左侧目录树当前选中节点
const currentComponent = shallowRef(null)  // 右侧动态加载的只读组件

/** ==================== 组件引用 ==================== */
const formRef = ref(null)                  // 主表单引用
const selectUserRef = ref(null)            // 独立用户选择弹窗引用

/** ==================== 表单与校验 ==================== */
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

/** ==================== 动态组件加载 ==================== */
/**
 * 扫描 views 目录下所有 .vue 文件，用于根据 component 字段动态加载只读组件
 * key 示例：/src/views/bottling/components/BottlingReceivingContent.vue
 */
const modules = import.meta.glob('/src/views/**/*.vue')

/** ==================== 打开/关闭对话框 ==================== */

/**
 * 打开生成批记录对话框
 * @param {Object} plan 排产计划行数据
 */
function open(plan) {
  currentPlan.value = plan
  visible.value = true
  resetDialogState()
  loadReleaseList()
  loadWorkUnitList()
  nextTick(() => formRef.value?.clearValidate())
}

/**
 * 重置对话框内所有临时状态
 */
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
}

/**
 * 对话框关闭前的二次确认（右上角关闭按钮）
 * @param {Function} done 关闭回调
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
 * 对话框完全关闭回调
 */
function handleClosed() {
  currentPlan.value = null
  resetDialogState()
}

/** ==================== 数据加载 ==================== */

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
 * @param {Number|null} releaseId 发布方案ID
 */
function handleReleaseChange(releaseId) {
  if (!releaseId) {
    menuTree.value = []
    dirSelections.value = []
    showPreview.value = false
    return
  }

  loadingMenus.value = true
  listScheme_release_menu({ releaseId, pageNum: 1, pageSize: 1000 })
    .then(res => {
      const menus = res.rows || res.data || []
      buildMenuTree(menus)
      buildDirSelections(menus)
    })
    .finally(() => {
      loadingMenus.value = false
    })
}

/** ==================== 菜单树构建 ==================== */

/**
 * 将发布方案平铺菜单构建为树形结构
 * 同时为所有按钮节点初始化 operator 为空字符串
 * @param {Array} menus 平铺菜单列表
 */
function buildMenuTree(menus) {
  const map = {}
  menus.forEach(item => {
    item.children = []
    if (item.menuType === 'F') {
      item.operator = ''
    }
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
 * @param {Array} menus 平铺菜单列表
 */
function buildDirSelections(menus) {
  const dirs = menus.filter(m => m.menuType === 'M' && m.parentId === 0)
  // 直接引用目录节点，附加字段，保证左侧树与工作单元选择联动
  dirSelections.value = dirs.map(d => {
    d.workUnitId = null
    d.workUnitName = ''
    return d
  })
}
// function buildDirSelections(menus) {
//   const dirs = menus.filter(m => m.menuType === 'M' && m.parentId === 0)
//   dirSelections.value = dirs.map(d => ({
//     menuId: d.menuId,
//     menuName: d.menuName,
//     workUnitId: null
//   }))
// }

/** ==================== 工作单元与操作人 ==================== */

/**
 * 工作单元选择变化：回填该目录下所有按钮操作人
 * @param {Object} dir 一级目录选择对象
 */
function handleWorkUnitChange(dir) {
  // 更新目录节点显示的工作单元名称
  const workUnit = workUnitList.value.find(w => w.workUnitId === dir.workUnitId)
  dir.workUnitName = workUnit ? workUnit.workUnitName : ''

  if (!dir.workUnitId) {
    clearOperatorsUnderDir(dir.menuId)
    return
  }

  listWork_unit_operator({ workUnitId: dir.workUnitId, pageNum: 1, pageSize: 1000 })
    .then(res => {
      const operators = res.rows || res.data || []
      const opMap = {}
      operators.forEach(op => {
        opMap[op.operationCode] = op.operator
      })
      fillOperatorsUnderDir(dir.menuId, opMap)
    })
}
// function handleWorkUnitChange(dir) {
//   if (!dir.workUnitId) {
//     clearOperatorsUnderDir(dir.menuId)
//     return
//   }

//   listWork_unit_operator({ workUnitId: dir.workUnitId, pageNum: 1, pageSize: 1000 })
//     .then(res => {
//       const operators = res.rows || res.data || []
//       const opMap = {}
//       operators.forEach(op => {
//         opMap[op.operationCode] = op.operator
//       })
//       fillOperatorsUnderDir(dir.menuId, opMap)
//     })
// }

/**
 * 清空指定一级目录下所有按钮节点操作人
 * @param {Number} dirMenuId 一级目录发布态菜单ID
 */
function clearOperatorsUnderDir(dirMenuId) {
  const dirNode = findNode(menuTree.value, dirMenuId)
  if (!dirNode) return

  dirNode.children.forEach(menu => {
    if (menu.menuType === 'C') {
      (menu.children || []).forEach(btn => {
        if (btn.menuType === 'F') {
          btn.operator = ''
        }
      })
    }
  })
}

/**
 * 填充指定一级目录下所有按钮节点操作人
 * @param {Number} dirMenuId 一级目录发布态菜单ID
 * @param {Object} opMap 操作码 -> 操作人 映射
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
 * 在菜单树中查找指定节点
 * @param {Array} nodes 节点数组
 * @param {Number} menuId 菜单ID
 * @returns {Object|null} 节点对象
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

/** ==================== 预览与动态组件 ==================== */

/**
 * 显示/刷新“操作人配置”区域
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
 * 获取目录节点下的菜单节点列表
 * @param {Object} node 目录节点
 * @returns {Array} 菜单节点数组
 */
function getChildMenus(node) {
  return node.children || []
}

/**
 * 左侧目录树节点点击
 * @param {Object} data 当前点击的节点
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
 * 根据 component 路径动态加载只读组件
 * @param {String} componentPath 前端组件相对路径，如 bottling/components/BottlingReceivingContent.vue
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
 * 打开独立专注预览对话框（全屏）
 */
function openFocusPreviewDialog() {
  if (!currentComponent) {
    ElMessage.warning('当前菜单节点不支持预览')
    return
  }
  previewDialogVisible.value = true
}

/** ==================== 用户选择 ==================== */

/**
 * 打开独立用户选择弹窗
 */
function openSelectUser() {
  selectUserRef.value?.show()
}

/**
 * 用户选择回调：回填 user_name 到当前选中按钮节点
 * @param {Object} user 选择的用户信息
 */
function onUserSelected(user) {
  if (selectedNode.value && selectedNode.value.menuType === 'F') {
    selectedNode.value.operator = user.userName || user.nickName || ''
  }
}

/** ==================== 提交生成 ==================== */

/**
 * 提交生成批记录
 */
function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return

    // 1. 收集已选择工作单元的一级目录
    const selectedDirs = dirSelections.value.filter(d => d.workUnitId)
    if (selectedDirs.length === 0) {
      ElMessage.warning('请至少选择一个工作单元')
      return
    }

    // 2. 组装 workshopItems
    const workshopItems = selectedDirs.map(dir => {
      const dirNode = findNode(menuTree.value, dir.menuId)
      const operators = []

      if (dirNode) {
        dirNode.children.forEach(menu => {
          if (menu.menuType === 'C') {
            (menu.children || []).forEach(btn => {
              if (btn.menuType === 'F') {
                operators.push({
                  operationCode: btn.operationCode,
                  operator: btn.operator || ''
                })
              }
            })
          }
        })
      }

      return {
        dirMenuId: dir.menuId,
        workUnitId: dir.workUnitId,
        operators
      }
    })

    // 3. 组装 DTO
    const dto = {
      planId: currentPlan.value.planId,
      releaseId: form.releaseId,
      planStart: form.planStart,
      planEnd: form.planEnd,
      instanceSeq: 1,
      workshopItems
    }

    // 4. 二次确认后调用生成接口
    ElMessageBox.confirm('确认生成批记录？生成后需在排产计划中点击“审核”进入生产。')
      .then(() => generateInstance(dto))
      .then(() => {
        ElMessage.success('生成成功')
        visible.value = false
        emit('success')
      })
      .catch(() => {})
  })
}

/** ==================== 对外暴露 ==================== */
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