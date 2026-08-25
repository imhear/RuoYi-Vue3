<!--
 * 批记录实例查看组件（只读）
 * 功能：根据 instanceId 加载 fill_instance 和 fill_instance_menu 数据，
 * 以树形结构展示方案菜单，并支持查看节点详情（只读）。
 * 布局参考 BatchPlanGenerate.vue。
-->
<template>
  <el-dialog
    v-model="visible"
    title="批记录详情"
    width="1200px"
    top="3vh"
    append-to-body
    :fullscreen="isFullscreen"
    :show-close="true"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <!-- 自定义头部：全屏切换 -->
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">批记录详情</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon style="cursor: pointer; font-size: 18px;" @click="isFullscreen = !isFullscreen">
            <FullScreen v-if="!isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <!-- 实例基本信息 -->
    <el-descriptions :column="3" border>
      <el-descriptions-item label="产品名称">{{ instanceInfo?.orderNum }}</el-descriptions-item>
      <el-descriptions-item label="规格">{{ instanceInfo?.schemeName }}</el-descriptions-item>
      <el-descriptions-item label="版本号">{{ instanceInfo?.version }}</el-descriptions-item>
      <!-- <el-descriptions-item label="工单号">{{ instanceInfo?.orderNum }}</el-descriptions-item>
      <el-descriptions-item label="方案名称">{{ instanceInfo?.schemeName }}</el-descriptions-item>
      <el-descriptions-item label="版本号">{{ instanceInfo?.version }}</el-descriptions-item>
      <el-descriptions-item label="计划开始">{{ instanceInfo?.planStart }}</el-descriptions-item>
      <el-descriptions-item label="计划结束">{{ instanceInfo?.planEnd }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ instanceInfo?.status }}</el-descriptions-item> -->
    </el-descriptions>

    <el-divider content-position="left">批记录结构</el-divider>

    <!-- 左右布局：树 + 详情 -->
    <el-row :gutter="16">
      <!-- 左侧：菜单树 -->
      <el-col :span="7">
        <div class="tree-panel">
          <div class="panel-header">方案目录</div>
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
                      - <span>{{ data.workUnitName || '未分配' }}</span>
                    </template>
                    <template v-if="data.menuType === 'F'">
                      - <span>{{ data.operator || '未设置' }}</span>
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

            <!-- 按钮节点：显示操作人信息（只读） -->
            <div v-else-if="selectedNode && selectedNode.menuType === 'F'">
              <el-form label-width="80px">
                <el-form-item label="操作人">
                  <el-input v-model="selectedNode.operator" readonly />
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

    <template #footer>
      <el-button @click="visible = false">关 闭</el-button>
    </template>
  </el-dialog>

  <!-- 专注预览全屏对话框 -->
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
import { ref, reactive, shallowRef, defineAsyncComponent, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document, Operation, FullScreen, Aim, Close } from '@element-plus/icons-vue'

// 导入API（假设后端提供以下接口，请根据实际路径调整）
import { getInstance } from '@/api/fill/instance'        // 获取实例基本信息
import { listInstance_menu } from '@/api/fill/instance_menu'   // 获取实例菜单列表

defineOptions({ name: 'BatchPlanInstanceView' })

/** ==================== 对话框状态 ==================== */
const visible = ref(false)                 // 主对话框可见性
const previewDialogVisible = ref(false)    // 专注预览可见性
const isFullscreen = ref(false)            // 主对话框是否全屏
const loading = ref(false)                 // 数据加载中

/** ==================== 数据状态 ==================== */
const instanceId = ref(null)               // 当前查看的实例ID
const instanceInfo = ref(null)             // 实例基本信息
const menuTree = ref([])                   // 实例菜单树（结构同方案菜单）
const selectedNode = ref(null)             // 当前选中的树节点
const currentComponent = shallowRef(null)  // 动态加载的只读组件

/** ==================== 组件引用 ==================== */
const treeRef = ref(null)

/** ==================== 动态组件加载 ==================== */
const modules = import.meta.glob('/src/views/**/*.vue')

/** ==================== 核心方法 ==================== */

/**
 * 打开批记录查看对话框
 * @param {string} id - 批记录实例ID（batch_plan.instance_id）
 */
function open(id) {
  if (!id) {
    ElMessage.warning('实例ID不能为空')
    return
  }
  instanceId.value = id
  visible.value = true
  loadInstanceData(id)
}

/**
 * 加载实例数据（基本信息 + 菜单树）
 * @param {string} id - 实例ID
 */
async function loadInstanceData(id) {
  loading.value = true
  try {
    // 1. 获取实例基本信息
    const instanceRes = await getInstance(id)
    instanceInfo.value = instanceRes.data || instanceRes

    // 2. 获取实例菜单列表（已包含工作单元、操作人等数据）
    const menuRes = await listInstance_menu({ instanceId: id })
    const menus = menuRes.rows || menuRes.data || []
    buildMenuTree(menus)

    // 3. 清空选中状态
    selectedNode.value = null
    currentComponent.value = null
  } catch (error) {
    ElMessage.error('加载批记录数据失败：' + error.message)
  } finally {
    loading.value = false
  }
}

/**
 * 将平铺菜单数据构建为树形结构
 * @param {Array} menus - 实例菜单列表（包含 menuType, parentId 等）
 */
function buildMenuTree(menus) {
  const map = {}
  menus.forEach(item => {
    item.children = []
    // 确保按钮节点有 operator 字段（来自实例数据）
    if (item.menuType === 'F' && !item.operator) {
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
 * 获取目录节点下的菜单子节点列表
 * @param {Object} node - 目录节点
 * @returns {Array} 菜单节点数组
 */
function getChildMenus(node) {
  return node.children || []
}

/**
 * 树节点点击事件
 * @param {Object} data - 当前点击的节点数据
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
 * @param {string} componentPath - 前端组件相对路径
 */
function loadMenuComponent(componentPath) {
  if (!componentPath) {
    currentComponent.value = null
    return
  }
  const fullPath = '/src/views/' + componentPath
  const loader = modules[fullPath]
  if (loader) {
    currentComponent.value = defineAsyncComponent(loader)
  } else {
    currentComponent.value = null
    ElMessage.warning('组件未找到：' + componentPath)
  }
}

/**
 * 打开专注预览对话框（全屏）
 */
function openFocusPreviewDialog() {
  if (!currentComponent) {
    ElMessage.warning('当前菜单节点不支持预览')
    return
  }
  previewDialogVisible.value = true
}

/**
 * 对话框关闭后的清理
 */
function handleClosed() {
  instanceId.value = null
  instanceInfo.value = null
  menuTree.value = []
  selectedNode.value = null
  currentComponent.value = null
  previewDialogVisible.value = false
}

/** ==================== 对外暴露 ==================== */
defineExpose({ open })
</script>

<style scoped>
/* 复用 BatchPlanGenerate 的样式，保持风格一致 */
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