<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入预览"
    width="1200px"
    top="2vh"
    append-to-body
  >
    <el-row :gutter="16">
      <!-- 左侧：菜单树预览 -->
      <el-col :span="7">
        <div class="tree-panel">
          <div class="panel-header">菜单结构</div>
          <div class="tree-body">
            <el-tree
              :data="treeData"
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

      <!-- 右侧：方案基本信息 + 节点详情 -->
      <el-col :span="17">
        <div class="detail-panel">
          <div class="panel-header">方案信息</div>
          <div class="detail-body">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="方案编码">{{ scheme?.schemeCode || '-' }}</el-descriptions-item>
              <el-descriptions-item label="方案名称">{{ scheme?.schemeName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="方案类型">{{ scheme?.schemeType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="分组数量">{{ scheme?.groupTypeCount || 0 }}</el-descriptions-item>
              <el-descriptions-item label="数据源">{{ scheme?.source === '1' ? '导入' : '本地' }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{ scheme?.remark || '-' }}</el-descriptions-item>
            </el-descriptions>

            <el-divider content-position="left">选中节点详情</el-divider>
            <div v-if="currentNode">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="菜单ID">{{ currentNode.menuId }}</el-descriptions-item>
                <el-descriptions-item label="菜单名称">{{ currentNode.menuName }}</el-descriptions-item>
                <el-descriptions-item label="菜单类型">
                  {{ currentNode.menuType === 'M' ? '目录' : currentNode.menuType === 'C' ? '菜单' : '按钮' }}
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
                <el-descriptions-item label="备注">{{ currentNode.remark || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-empty v-else description="请选择左侧节点查看详情" />
          </div>
        </div>
      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认导入</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document, Operation } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  scheme: { type: Object, default: null },
  menus: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentNode = ref(null)

/** 将扁平菜单列表构建为树形结构 */
const treeData = computed(() => buildTree(props.menus))

function buildTree(list) {
  const map = {}
  list.forEach(item => {
    item.children = []
    map[item.menuId] = item
  })
  const roots = []
  list.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) {
      roots.push(item)
    } else {
      const parent = map[item.parentId]
      if (parent) parent.children.push(item)
    }
  })
  return roots
}

function handleNodeClick(data) {
  currentNode.value = data
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
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
}

.tree-panel {
  height: calc(100vh - 220px);   /* 原为 650px */
}

.tree-body {
  height: calc(100% - 41px);
  overflow-y: auto;
  padding: 8px;
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

.detail-panel {
  height: calc(100vh - 220px);   /* 原为 650px */
}

.detail-body {
  padding: 16px;
  height: calc(100% - 41px);
  overflow-y: auto;
}
</style>