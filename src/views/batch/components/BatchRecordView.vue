<template>
  <el-dialog v-model="visible" title="批记录结构" width="1200px" top="3vh" append-to-body :fullscreen="isFullscreen" @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">批记录结构</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon style="cursor: pointer; font-size: 18px;" @click="isFullscreen = !isFullscreen">
            <FullScreen v-if="!isFullscreen" /><Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <el-row :gutter="16">
      <el-col :span="7">
        <div class="tree-panel">
          <div class="panel-header">批记录目录</div>
          <div class="tree-body">
            <el-tree :data="menuTree" node-key="menuId" default-expand-all :expand-on-click-node="false" highlight-current @node-click="handleNodeClick">
              <template #default="{ data }">
                <div class="tree-node">
                  <el-icon class="node-icon">
                    <Folder v-if="data.menuType === 'M'" /><Document v-else-if="data.menuType === 'C'" /><Operation v-else />
                  </el-icon>
                  <span class="node-label">
                    {{ data.menuName }}
                    <template v-if="data.menuType === 'M'"> - <span>{{ data.workUnitName || '未分配' }}</span></template>
                    <template v-if="data.menuType === 'F'"> - <span>{{ data.operator || '未设置' }}</span></template>
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="detail-panel">
          <div class="panel-header">节点详情</div>
          <div class="detail-body">
            <div v-if="selectedNode && selectedNode.menuType === 'M'">
              <el-table :data="getChildMenus(selectedNode)" border>
                <el-table-column label="菜单名称" prop="menuName" />
                <el-table-column label="物理表名" prop="tableName" />
                <el-table-column label="前端组件" prop="component" show-overflow-tooltip />
              </el-table>
            </div>
            <div v-else-if="selectedNode && selectedNode.menuType === 'C'">
              <div v-if="currentComponent" class="component-container"><component :is="currentComponent" /></div>
              <el-empty v-else description="该节点不支持预览" />
            </div>
            <div v-else-if="selectedNode && selectedNode.menuType === 'F'">
              <el-form label-width="80px">
                <el-form-item label="操作人"><el-input v-model="selectedNode.operator" readonly /></el-form-item>
                <el-form-item label="操作码"><el-tag>{{ selectedNode.operationCode }}</el-tag></el-form-item>
                <el-form-item label="组件路径"><span>{{ selectedNode.component || '-' }}</span></el-form-item>
                <el-form-item label="后端接口"><span>{{ selectedNode.backendRoute || '-' }}</span></el-form-item>
              </el-form>
            </div>
            <el-empty v-else description="请选择左侧节点查看详情" />
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer><el-button @click="visible = false">关闭</el-button></template>
  </el-dialog>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue'
import { Folder, Document, Operation, FullScreen, Aim } from '@element-plus/icons-vue'
import { listBatch_record_menu } from "@/api/batch/batch_record_menu"

defineOptions({ name: 'BatchRecordView' })

const visible = ref(false)
const isFullscreen = ref(false)
const menuTree = ref([])
const selectedNode = ref(null)
const currentComponent = shallowRef(null)
const modules = import.meta.glob('/src/views/**/*.vue')

function open(recordId) {
  visible.value = true
  loadMenus(recordId)
}
function loadMenus(recordId) {
  listBatch_record_menu({ recordId, pageNum: 1, pageSize: 1000 }).then(res => {
    const menus = res.rows || res.data || []
    buildMenuTree(menus)
    selectedNode.value = null
    currentComponent.value = null
  })
}
function buildMenuTree(menus) {
  const map = {}
  menus.forEach(item => { item.children = []; map[item.menuId] = item })
  const roots = []
  menus.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) roots.push(item)
    else map[item.parentId].children.push(item)
  })
  menuTree.value = roots
}
function getChildMenus(node) { return node.children || [] }
function handleNodeClick(data) {
  selectedNode.value = data
  if (data.menuType === 'C') loadMenuComponent(data.component)
  else currentComponent.value = null
}
function loadMenuComponent(componentPath) {
  if (!componentPath) { currentComponent.value = null; return }
  const fullPath = '/src/views/' + componentPath
  const loader = modules[fullPath]
  if (loader) currentComponent.value = defineAsyncComponent(loader)
  else currentComponent.value = null
}
function handleClosed() {
  menuTree.value = []
  selectedNode.value = null
  currentComponent.value = null
}
defineExpose({ open })
</script>

<style scoped>
/* ===== 让对话框高度占视口 95%，内部自适应 ===== */
:deep(.el-dialog) {
  height: 95vh;
  display: flex;
  flex-direction: column;
}

:deep(.el-dialog__body) {
  flex: 1;
  overflow: hidden;
}

/* ===== 确保内部行和列填满高度 ===== */
.el-row {
  height: 100%;
}

.el-col {
  height: 100%;
}

/* ===== 左右面板通用边框 ===== */
.tree-panel,
.detail-panel {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
}

/* ===== 面板标题栏 ===== */
.panel-header {
  background: #f5f7fa;
  padding: 10px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ===== 左侧树面板内容区 ===== */
.tree-body {
  height: calc(100% - 41px);
  overflow-y: auto;
  padding: 8px;
}

/* ===== 右侧详情面板内容区 ===== */
.detail-body {
  padding: 12px;
  height: calc(100% - 41px);
  overflow-y: auto;
}

/* ===== 树节点 ===== */
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

/* ===== 动态组件容器 ===== */
.component-container {
  min-height: 200px;
  overflow: auto;
}

/* ===== 专注预览容器 ===== */
.focus-component-wrapper {
  height: 100%;
  overflow: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px;
}
</style>