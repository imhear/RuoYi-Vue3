<template>
  <el-dialog
    v-model="visible"
    title="设计态配置"
    width="1400px"
    top="3vh"
    append-to-body
    class="design-config-dialog"
    @closed="handleClosed"
  >
    <el-row :gutter="16">
      <!-- 左侧：方案菜单树 -->
      <el-col :span="7">
        <div class="tree-panel">
          <div class="panel-header">
            <span>方案目录树</span>
            <el-button link type="primary" icon="Plus" @click="handleAddRoot">新增根目录</el-button>
          </div>
          <div class="tree-body" v-loading="treeLoading">
            <el-tree
              ref="treeRef"
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
                  <span class="node-actions">
                    <el-tooltip v-if="data.menuType !== 'F'" content="新增子节点" placement="top">
                      <el-button link type="primary" icon="Plus" size="small" @click.stop="handleAddChild(data)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑" placement="top">
                      <el-button link type="primary" icon="Edit" size="small" @click.stop="handleEdit(data)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <el-button link type="danger" icon="Delete" size="small" @click.stop="handleDelete(data)"></el-button>
                    </el-tooltip>
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
          <div class="panel-header">节点详情</div>
          <div v-if="currentNode" class="detail-body">
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
              <el-descriptions-item label="自定义参数">{{ currentNode.customParams || '-' }}</el-descriptions-item>
              <el-descriptions-item label="前置菜单ID">{{ currentNode.predecessorDetailId || '-' }}</el-descriptions-item>
              <el-descriptions-item label="卡片显示">{{ currentNode.operationVisible === '1' ? '是' : '否' }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ currentNode.status === '0' ? '正常' : '停用' }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{ currentNode.remark || '-' }}</el-descriptions-item>
            </el-descriptions>
            <div class="detail-actions">
              <el-button type="primary" @click="handleEdit(currentNode)">编辑</el-button>
              <el-button v-if="currentNode.menuType !== 'F'" @click="handleAddChild(currentNode)">新增子节点</el-button>
            </div>
          </div>
          <el-empty v-else description="请选择左侧节点查看详情" />
        </div>
      </el-col>
    </el-row>

    <!-- 新增/编辑节点对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.menuId ? '编辑节点' : '新增节点'"
      width="600px"
      append-to-body
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="110px">
        <el-form-item v-if="!editForm.menuId" label="节点类型" prop="menuType">
          <el-radio-group v-model="editForm.menuType" @change="handleMenuTypeChange">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else label="节点类型">
          <el-tag :type="menuTypeTag(editForm.menuType)">{{ menuTypeText(editForm.menuType) }}</el-tag>
        </el-form-item>

        <!-- 通用字段 -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="editForm.orderNum" :min="0" style="width: 100%" />
        </el-form-item>

        <!-- 目录专用 -->
        <template v-if="editForm.menuType === 'M'">
          <el-form-item label="前端路由地址" prop="path">
            <el-input v-model="editForm.path" placeholder="请输入前端路由地址" />
          </el-form-item>
        </template>

        <!-- 菜单专用 -->
        <template v-else-if="editForm.menuType === 'C'">
          <el-form-item label="物理表名" prop="tableName">
            <el-input v-model="editForm.tableName" placeholder="请选择物理表" readonly>
              <template #append>
                <el-button icon="Search" @click="openSelectForm" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="前端组件路径" prop="component">
            <el-input v-model="editForm.component" placeholder="请输入前端组件路径" />
          </el-form-item>
          <el-form-item label="前端路由地址" prop="path">
            <el-input v-model="editForm.path" placeholder="请输入前端路由地址" />
          </el-form-item>
          <el-form-item label="自定义参数" prop="customParams">
            <el-input v-model="editForm.customParams" placeholder='如 {"MaterialType":"PACKAGING_MATERIAL"}' />
          </el-form-item>
          <el-form-item label="前置菜单ID" prop="predecessorDetailId">
            <el-input-number v-model="editForm.predecessorDetailId" :min="0" style="width: 100%" placeholder="前置菜单ID" />
          </el-form-item>
        </template>

        <!-- 按钮专用 -->
        <template v-else>
          <el-form-item label="操作码" prop="operationCode">
            <el-input v-model="editForm.operationCode" placeholder="请选择操作码" readonly>
              <template #append>
                <el-button icon="Search" @click="openSelectOperation" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="前端组件路径" prop="component">
            <el-input v-model="editForm.component" placeholder="自动带出，可修改" />
          </el-form-item>
          <el-form-item label="后端接口路径" prop="backendRoute">
            <el-input v-model="editForm.backendRoute" placeholder="自动带出，可修改" />
          </el-form-item>
          <el-form-item label="卡片显示" prop="operationVisible">
            <el-radio-group v-model="editForm.operationVisible">
              <el-radio label="1">显示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择物理表对话框 -->
    <SelectForm ref="selectFormRef" @ok="onFormSelected" />
    <!-- 选择操作码对话框 -->
    <SelectOperation ref="selectOperationRef" @ok="onOperationSelected" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Operation, Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
import SelectForm from '@/views/fill/components/SelectForm.vue'
import SelectOperation from '@/views/fill/components/SelectOperation.vue'
import { listScheme_design_menu, addScheme_design_menu, updateScheme_design_menu, delScheme_design_menu } from "@/api/fill/scheme_design_menu"

defineOptions({ name: 'DesignConfigDialog' })

const props = defineProps({
  schemeId: { type: Number, required: true }
})

// ==================== 状态定义 ====================
const visible = ref(false)
const treeRef = ref(null)
const treeLoading = ref(false)
const treeData = ref([])
const currentNode = ref(null)

const editDialogVisible = ref(false)
const editFormRef = ref(null)
const selectFormRef = ref(null)
const selectOperationRef = ref(null)

const editForm = reactive({
  menuId: null,
  schemeId: props.schemeId,
  menuType: 'M',
  parentId: 0,
  menuName: '',
  orderNum: 0,
  path: '',
  component: '',
  query: '',
  routeName: '',
  isFrame: 1,
  isCache: 0,
  visible: '0',
  status: '0',
  perms: '',
  icon: '#',
  remark: '',
  backendRoute: '',
  tableName: '',
  customParams: '',
  predecessorDetailId: null,
  operationCode: '',
  operationVisible: '1'
})

const editRules = computed(() => {
  const rules = {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
  }
  if (editForm.menuType === 'C') {
    rules.tableName = [{ required: true, message: '请选择物理表', trigger: 'change' }]
  } else if (editForm.menuType === 'F') {
    rules.operationCode = [{ required: true, message: '请选择操作码', trigger: 'change' }]
  }
  return rules
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
 * 加载当前方案的菜单树
 */
async function loadTree() {
  treeLoading.value = true
  try {
    const res = await listScheme_design_menu({ schemeId: props.schemeId, pageNum: 1, pageSize: 1000 })
    const list = res.data || res.rows || []
    // 仅保留属于当前方案的数据（若接口未过滤，前端过滤）
    const filtered = list.filter(item => item.schemeId === props.schemeId)
    treeData.value = buildMenuTree(filtered)
  } catch (e) {
    ElMessage.error('加载菜单树失败')
  } finally {
    treeLoading.value = false
  }
}

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
  // 按 orderNum 排序
  function sortChildren(nodes) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
        sortChildren(node.children)
      }
    })
  }
  sortChildren(tree)
  return tree
}

// ==================== 打开/关闭 ====================
async function open() {
  visible.value = true
  currentNode.value = null
  await loadTree()
}

function close() {
  visible.value = false
}

function handleClosed() {
  currentNode.value = null
}

// ==================== 树节点操作 ====================
function handleNodeClick(data) {
  currentNode.value = data
}

function handleAddRoot() {
  openEditDialog('M', 0, null)
}

function handleAddChild(node) {
  if (node.menuType === 'M') {
    openEditDialog('C', node.menuId, null) // 目录下默认新增菜单
  } else if (node.menuType === 'C') {
    openEditDialog('F', node.menuId, null) // 菜单下新增按钮
  }
}

function handleEdit(node) {
  openEditDialog(node.menuType, node.parentId, node)
}

function openEditDialog(menuType, parentId, nodeData) {
  Object.assign(editForm, {
    menuId: nodeData ? nodeData.menuId : null,
    schemeId: props.schemeId,
    menuType: menuType,
    parentId: parentId || 0,
    menuName: nodeData?.menuName || '',
    orderNum: nodeData?.orderNum || 0,
    path: nodeData?.path || '',
    component: nodeData?.component || '',
    query: nodeData?.query || '',
    routeName: nodeData?.routeName || '',
    isFrame: nodeData?.isFrame ?? 1,
    isCache: nodeData?.isCache ?? 0,
    visible: nodeData?.visible || '0',
    status: nodeData?.status || '0',
    perms: nodeData?.perms || '',
    icon: nodeData?.icon || '#',
    remark: nodeData?.remark || '',
    backendRoute: nodeData?.backendRoute || '',
    tableName: nodeData?.tableName || '',
    customParams: nodeData?.customParams || '',
    predecessorDetailId: nodeData?.predecessorDetailId ?? null,
    operationCode: nodeData?.operationCode || '',
    operationVisible: nodeData?.operationVisible || '1'
  })
  editDialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

function handleMenuTypeChange(val) {
  // 切换类型时清空不相关字段
  if (val === 'M') {
    editForm.tableName = ''
    editForm.operationCode = ''
    editForm.component = ''
    editForm.backendRoute = ''
  } else if (val === 'C') {
    editForm.operationCode = ''
  } else if (val === 'F') {
    editForm.tableName = ''
    editForm.customParams = ''
    editForm.predecessorDetailId = null
  }
}

// ==================== 选择器回调 ====================
function openSelectForm() {
  selectFormRef.value.show()
}

function onFormSelected(row) {
  editForm.tableName = row.tableName
  if (!editForm.menuName) {
    editForm.menuName = row.tableComment || row.tableName
  }
}

function openSelectOperation() {
  selectOperationRef.value.show()
}

function onOperationSelected(row) {
  editForm.operationCode = row.operationCode
  editForm.menuName = row.operationName || row.buttonLabel || row.operationCode
  editForm.component = row.component || ''
  editForm.backendRoute = row.backendRoute || ''
}

// ==================== 删除 ====================
function handleDelete(node) {
  if (node.children && node.children.length > 0) {
    ElMessage.warning('存在子节点，无法删除')
    return
  }
  ElMessageBox.confirm(`确认删除节点「${node.menuName}」？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await delScheme_design_menu(node.menuId)
    ElMessage.success('删除成功')
    if (currentNode.value && currentNode.value.menuId === node.menuId) {
      currentNode.value = null
    }
    await loadTree()
  }).catch(() => {})
}

// ==================== 提交 ====================
async function submitEdit() {
  await editFormRef.value.validate()
  const data = { ...editForm }
  if (data.menuId) {
    await updateScheme_design_menu(data)
    ElMessage.success('修改成功')
  } else {
    await addScheme_design_menu(data)
    ElMessage.success('新增成功')
  }
  editDialogVisible.value = false
  await loadTree()
  if (currentNode.value) {
    const refreshed = findNodeById(treeData.value, currentNode.value.menuId)
    if (refreshed) currentNode.value = refreshed
  }
}

function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.menuId === id) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

defineExpose({ open, close })
</script>

<style scoped>
.design-config-dialog :deep(.el-dialog__body) {
  padding: 12px;
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
  height: 650px;
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

.detail-panel {
  height: 650px;
}

.detail-body {
  padding: 16px;
  height: calc(100% - 41px);
  overflow-y: auto;
}

.detail-actions {
  margin-top: 16px;
  text-align: right;
}
</style>