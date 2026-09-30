<template>
  <el-dialog
    v-model="visible"
    :fullscreen="isFullscreen"
    width="1600px"
    top="1vh"
    append-to-body
    class="release-view-dialog"
    @closed="handleClosed"
  >
    <!-- 自定义 header：左侧标题（发布方案 [方案名称|方案编码] 版本:xxx），右侧全屏按钮 -->
    <template #header>
      <div class="release-view-header">
        <span class="release-view-title">{{ dialogTitle }}</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
            class="release-view-fullscreen-icon"
            @click="toggleFullscreen"
          />
        </el-tooltip>
      </div>
    </template>

    <el-row :gutter="16" class="release-view-body-row">
      <!-- 左侧：发布态方案目录树（只读） -->
      <el-col :span="5">
        <div class="tree-panel">
          <div class="panel-header">
            <span>方案目录树</span>
            <span class="panel-actions">
              <!-- 折叠/展开按钮 -->
              <el-button
                link
                type="primary"
                :icon="isExpandAll ? 'Fold' : 'Expand'"
                @click="toggleExpandAll"
              >{{ isExpandAll ? '折叠' : '展开' }}</el-button>
            </span>
          </div>
          <div class="tree-body" v-loading="treeLoading">
            <el-tree
              v-if="refreshTree"
              ref="treeRef"
              :data="treeData"
              node-key="menuId"
              :default-expand-all="isExpandAll"
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
                  <span class="node-actions">
                    <!-- 预览按钮：仅 C 类型节点显示，点击后右侧动态加载该节点前端组件 -->
                    <el-tooltip v-if="data.menuType === 'C'" content="预览组件" placement="top">
                      <el-button link type="primary" size="small" @click.stop="handlePreview(data)">
                        <svg-icon icon-class="eye-open" class="action-icon" />
                      </el-button>
                    </el-tooltip>
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </el-col>

      <!-- 右侧：节点详情 / 组件预览（只读） -->
      <el-col :span="19">
        <div class="detail-panel">
          <div class="panel-header">
            <!-- 标题动态切换：预览模式下显示"组件预览：xxx"，否则显示"节点详情" -->
            <span>{{ previewNode ? '组件预览：' + previewNode.menuName : '节点详情' }}</span>
            <!-- 预览模式下提供"返回详情"按钮 -->
            <el-button
              v-if="previewNode"
              link
              type="primary"
              icon="Back"
              @click="handleBackToDetail"
            >返回详情</el-button>
          </div>
          <div class="detail-body">
            <!-- 预览模式：动态渲染 C 节点的前端组件 -->
            <div v-if="previewNode" class="component-preview">
              <component v-if="previewComponent" :is="previewComponent" />
              <el-empty v-else description="该节点不支持预览" />
            </div>

            <!-- 详情模式：显示当前选中节点详情（只读展示） -->
            <template v-else>
              <div v-if="currentNode">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="菜单ID">{{ currentNode.menuId }}</el-descriptions-item>
                  <el-descriptions-item label="菜单名称">{{ currentNode.menuName }}</el-descriptions-item>
                  <el-descriptions-item label="菜单类型">
                    <el-tag :type="menuTypeTag(currentNode.menuType)">{{ menuTypeText(currentNode.menuType) }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="父菜单ID">{{ currentNode.parentId }}</el-descriptions-item>
                  <el-descriptions-item label="显示顺序">{{ currentNode.orderNum }}</el-descriptions-item>
                  <el-descriptions-item label="前端路由地址">{{ currentNode.path || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="前端组件路径">{{ currentNode.component || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="后端接口路径">{{ currentNode.backendRoute || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="操作码">{{ currentNode.operationCode || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="物理表名">{{ currentNode.tableName || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="权限标识">{{ currentNode.perms || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="路由参数">{{ currentNode.query || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="自定义参数">{{ currentNode.customParams || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="前置菜单ID">{{ currentNode.predecessorDetailId || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="卡片显示">{{ currentNode.operationVisible === '1' ? '是' : '否' }}</el-descriptions-item>
                  <el-descriptions-item label="状态">{{ currentNode.status === '0' ? '正常' : '停用' }}</el-descriptions-item>
                  <el-descriptions-item label="是否可反审">{{ currentNode.isUnaudit === '0' ? '是' : '否' }}</el-descriptions-item>
                  <el-descriptions-item label="备注">{{ currentNode.remark || '-' }}</el-descriptions-item>
                </el-descriptions>
              </div>
              <el-empty v-else description="请选择左侧节点查看详情" />
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, computed, nextTick, shallowRef, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document, Operation } from '@element-plus/icons-vue'
import { getScheme_release } from "@/api/fill/scheme_release"
import { listScheme_release_menu } from "@/api/fill/scheme_release_menu"

defineOptions({ name: 'ReleaseViewDialog' })

const props = defineProps({
  /** 发布版本ID（父组件传入，指向 fill_scheme_release.release_id） */
  releaseId: { type: Number, required: true }
})

// ==================== 状态定义 ====================
const visible = ref(false)
const treeRef = ref(null)
const treeLoading = ref(false)
const treeData = ref([])
const currentNode = ref(null)
const releaseInfo = ref(null)   // 发布态方案基本信息（fill_scheme_release）

/** 方案目录树的展开状态：true 全部展开，false 全部折叠 */
const isExpandAll = ref(true)

/** 强制重渲染方案目录树的开关：切换展开/折叠时先置 false 再置 true，让 el-tree 重新应用 default-expand-all */
const refreshTree = ref(true)

/** 当前预览的节点（非空时右侧显示组件预览） */
const previewNode = ref(null)

/** 当前预览的动态组件（由 previewNode.component 异步加载得到） */
const previewComponent = shallowRef(null)

/** 对话框全屏状态：true 时 el-dialog 通过 fullscreen 属性铺满整个屏幕 */
const isFullscreen = ref(false)

/**
 * 前端组件模块映射表
 *
 * 使用 Vite 的 import.meta.glob 在构建时收集 /src/views 下所有 .vue 文件，
 * 与设计态对话框保持一致的处理方式。
 * 点击 C 类型节点的 eye-open 按钮时，根据 component 字段拼出完整路径并从中查找。
 */
const modules = import.meta.glob('/src/views/**/*.vue')

/**
 * 对话框标题
 *
 * 格式：发布方案 [方案名称|方案编码] 版本:releaseCode
 * - 发布信息未加载时，仅显示"发布方案"
 * - 名称/编码/版本号做容错：只有存在时才拼接
 */
const dialogTitle = computed(() => {
  const r = releaseInfo.value
  if (!r) return '发布方案'
  const name = r.schemeName || ''
  const code = r.schemeCode || ''
  const version = r.releaseCode || ''
  let base = '发布方案'
  if (name && code) base += ` [${name}|${code}]`
  else if (name) base += ` [${name}]`
  else if (code) base += ` [${code}]`
  if (version) base += ` 版本:${version}`
  return base
})

// ==================== 工具方法 ====================
function menuTypeText(type) {
  const map = { M: '目录', C: '菜单', F: '按钮' }
  return map[type] || type
}
function menuTypeTag(type) {
  const map = { M: 'warning', C: 'success', F: 'info' }
  return map[type] || ''
}

// ==================== 数据加载 ====================
/**
 * 加载发布态方案基本信息
 *
 * 从 fill_scheme_release 读取，用于对话框标题展示方案名称、编码、发布版本号。
 */
async function loadReleaseInfo() {
  try {
    const res = await getScheme_release(props.releaseId)
    releaseInfo.value = res.data || null
  } catch (e) {
    ElMessage.error('加载发布方案信息失败')
  }
}

/**
 * 加载发布态的菜单树
 *
 * 数据源：fill_scheme_release_menu（发布态快照）
 * 与设计态的差异：设计态按 schemeId 查询，发布态按 releaseId 查询，
 * 因为每个发布版本对应一份独立的菜单快照。
 */
async function loadTree() {
  treeLoading.value = true
  try {
    const res = await listScheme_release_menu({ releaseId: props.releaseId })
    const list = res.data || res.rows || []
    treeData.value = buildMenuTree(list)
  } catch (e) {
    ElMessage.error('加载菜单树失败')
  } finally {
    treeLoading.value = false
  }
}

/**
 * 构建发布态菜单树
 *
 * 与设计态 buildMenuTree 逻辑一致：先用 map 建立 menuId → node 索引，
 * 然后按 parentId 挂载父子关系，最后递归排序。
 */
function buildMenuTree(list) {
  const map = {}
  list.forEach(item => {
    item.children = []
    map[item.menuId] = item
  })
  const tree = []
  list.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) {
      tree.push(item)
    } else {
      const parent = map[item.parentId]
      if (parent) parent.children.push(item)
    }
  })
  sortChildren(tree)
  return tree
}

/**
 * 递归按 orderNum 排序
 */
function sortChildren(nodes) {
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
      sortChildren(node.children)
    }
  })
}

// ==================== 打开/关闭 ====================
/**
 * 打开对话框
 *
 * 由父组件通过 ref 调用，重置内部状态并加载发布态数据。
 * props.releaseId 由父组件在调用前设置，通过 nextTick 保证已更新。
 */
async function open() {
  visible.value = true
  currentNode.value = null
  previewNode.value = null
  previewComponent.value = null
  await Promise.all([loadTree(), loadReleaseInfo()])
}

function close() {
  visible.value = false
}

/**
 * 对话框关闭后的清理
 *
 * 清空选中节点、预览状态，并重置全屏状态，避免下次打开时残留。
 */
function handleClosed() {
  currentNode.value = null
  previewNode.value = null
  previewComponent.value = null
  isFullscreen.value = false
}

// ==================== 全屏切换 ====================
/**
 * 切换对话框全屏
 *
 * 通过 el-dialog 的 fullscreen 属性控制，让对话框铺满整个屏幕（不是浏览器级全屏）。
 * 与浏览器 API（Screenfull / useFullscreen）不同，这里只影响对话框自身。
 */
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// ==================== 树节点操作 ====================
/**
 * 折叠/展开方案目录树
 *
 * 先关闭 el-tree 的 v-if 让组件销毁，切换 isExpandAll 后再重新挂载，
 * 使 el-tree 重新应用 default-expand-all 属性。
 * 参考设计态对话框与 src/views/system/menu/index.vue 的官方实现方式。
 * 重新渲染后，通过 treeRef.setCurrentKey 恢复之前选中的节点高亮。
 */
function toggleExpandAll() {
  refreshTree.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTree.value = true
    // 树重新渲染后恢复选中高亮
    nextTick(() => {
      if (currentNode.value && treeRef.value) {
        treeRef.value.setCurrentKey(currentNode.value.menuId)
      }
    })
  })
}

/**
 * 单击树节点
 *
 * 更新 currentNode 用于右侧详情展示；同时退出预览模式，
 * 保证点击非预览按钮的节点时，右侧立即回到详情视图。
 */
function handleNodeClick(data) {
  currentNode.value = data
  if (previewNode.value) {
    previewNode.value = null
    previewComponent.value = null
  }
}

// ==================== 预览组件 ====================
/**
 * 预览 C 类型节点对应的前端组件
 *
 * 用户在树节点上点击 eye-open 按钮时触发：
 * - 校验 component 是否已配置
 * - 将 previewNode 设为当前节点，右侧 panel 切换到预览模式
 * - 通过 loadPreviewComponent 异步加载组件
 *
 * @param {Object} data 当前 C 类型节点数据（含 menuId、menuName、component 等字段）
 */
function handlePreview(data) {
  if (!data.component) {
    ElMessage.warning('该节点未配置前端组件路径')
    return
  }
  previewNode.value = data
  loadPreviewComponent(data.component)
}

/**
 * 异步加载前端组件
 *
 * 从 modules 映射表中查找组件文件：
 * - component 字段值可能是 "bizdata/biz_receiving/versions/v1.0.0/Form"（不带后缀）
 *   或 "bizdata/biz_receiving/versions/v1.0.0/Form.vue"（带后缀）
 * - 统一补全 .vue 后缀后拼成 /src/views/xxx.vue 作为查找 key
 * - 找到后通过 defineAsyncComponent 包装为异步组件赋值给 previewComponent
 *
 * @param {String} componentPath 组件路径（来自节点 component 字段）
 */
function loadPreviewComponent(componentPath) {
  if (!componentPath) {
    previewComponent.value = null
    return
  }
  // 兼容带/不带 .vue 后缀的配置
  const normalized = componentPath.endsWith('.vue') ? componentPath : componentPath + '.vue'
  const fullPath = '/src/views/' + normalized
  const loader = modules[fullPath]
  if (loader) {
    previewComponent.value = defineAsyncComponent(loader)
  } else {
    previewComponent.value = null
    ElMessage.warning('未找到组件文件：' + fullPath)
  }
}

/**
 * 返回详情视图
 *
 * 清空预览状态，右侧 panel 切回节点详情展示。
 */
function handleBackToDetail() {
  previewNode.value = null
  previewComponent.value = null
}

defineExpose({ open, close })
</script>

<style scoped>
/* ============================================================
 * 对话框本体：高度固定 + flex 列布局
 *
 * `.release-view-dialog` 是加在 el-dialog 根元素上的 class，
 * 直接选择它即可（不能写成 `.release-view-dialog :deep(.el-dialog)`，
 * 那会要求 .el-dialog 是后代，永远不匹配）。
 * 与设计态对话框保持一致的布局处理。
 * ============================================================ */
.release-view-dialog {
  display: flex;
  flex-direction: column;
  height: 96vh;
  margin: 2vh auto;
}

/* 全屏模式下 el-dialog 会自己处理高度（100vh），这里只需确保仍是 flex 列布局 */
.release-view-dialog.is-fullscreen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
}

/* dialog header：固定高度，不参与弹性伸缩 */
.release-view-dialog :deep(.el-dialog__header) {
  flex-shrink: 0;
  padding: 16px 20px;
  margin-right: 0;
  border-bottom: 1px solid #e4e7ed;
}

/* dialog body：撑满剩余高度，内部单独滚动 */
.release-view-dialog :deep(.el-dialog__body) {
  flex: 1;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
}

/* ============================================================
 * 自定义对话框标题栏
 * 左侧：标题（发布方案 [方案名称|方案编码] 版本:xxx）
 * 右侧：全屏按钮
 * ============================================================ */
.release-view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 为 el-dialog 默认的关闭按钮留出右侧空间 */
  padding-right: 28px;
}

.release-view-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 全屏图标：与若依 Navbar 的全屏图标样式保持一致 */
.release-view-fullscreen-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  fill: #5a5e66;
  flex-shrink: 0;
  transition: transform 0.2s;
}

/* ============================================================
 * 内部 el-row / el-col 撑满 body 高度
 * 使用自定义 class `release-view-body-row` 精确匹配，避免误伤其他 el-row。
 * ============================================================ */
.release-view-dialog :deep(.release-view-body-row) {
  height: 100%;
}

.release-view-dialog :deep(.release-view-body-row > .el-col) {
  height: 100%;
}

/* ============================================================
 * 左右面板：卡片风格 + flex 列布局
 * ============================================================ */
.tree-panel,
.detail-panel {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: #f5f7fa;
  padding: 10px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

/* 左侧 panel-header 中的操作按钮区 */
.panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 左侧树内容区：flex 撑满，独立纵向滚动 */
.tree-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  min-height: 0;
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

.node-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

/* eye-open 图标尺寸：让 svg-icon 与 Element Plus 图标视觉对齐 */
.action-icon {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

/* 右侧详情内容区：flex 撑满，独立纵向滚动 */
.detail-body {
  flex: 1;
  padding: 0px;
  overflow-y: auto;
  min-height: 0;
}

/* ============================================================
 * 组件预览容器
 * 不设置 min-height / overflow，让预览组件的内部内容自然撑高，
 * 统一由外层 .detail-body 承担滚动，避免嵌套滚动导致底部裁剪。
 * ============================================================ */
.component-preview {
  width: 100%;
}
</style>