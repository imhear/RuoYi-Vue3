<template>
  <el-dialog title="选择操作码" v-model="visible" width="700px" append-to-body>
    <el-tree
      :data="operationTree"
      node-key="id"
      :props="treeProps"
      highlight-current
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <span>
          <el-tag v-if="data.menuType === 'M'" size="small" type="primary">目录</el-tag>
          <el-tag v-else-if="data.menuType === 'C'" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="data.menuType === 'F'" size="small" type="warning">按钮</el-tag>
          <span style="margin-left: 8px;">{{ data.name }}</span>
          <span v-if="data.menuType === 'F'" style="margin-left: 8px; color: #909399;">{{ data.code }}</span>
        </span>
      </template>
    </el-tree>
    <template #footer>
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedNode">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 操作码选择器
 * 
 * 从原 ruoyi-fill 模块的 SelectOperation 迁移到 ruoyi-basic 模块。
 * 主要改动：
 * - import 路径：@/api/fill/operation → @/api/basic/operation
 * - 字段名契约：operationId → id、operationCode → code、operationName → name
 * - 不再返回 perms 字段（权限权威来源改为 sys_menu，权限设计态由用户独立选择）
 *
 * 使用示例：
 * <SelectOperation ref="selectOperationRef" @ok="onOperationSelected" />
 * 
 * 回调参数：完整的操作码节点对象，含 id、code、name、actionType、buttonLabel、
 *          backendRoute、component、isUnaudit 等字段
 *
 * @author wutao
 * @date 2026-09-21
 */
import { ref, computed } from 'vue'
import { listOperation } from '@/api/basic/operation'

defineOptions({ name: 'SelectOperation' })

const { proxy } = getCurrentInstance()

const visible = ref(false)
const operationTree = ref([])
const selectedNode = ref(null)

/**
 * el-tree 的 props 配置
 * 仅允许选择按钮类型（F）节点，目录和菜单节点禁用
 */
const treeProps = computed(() => {
  return {
    label: 'name',
    children: 'children',
    disabled: (data) => data.menuType !== 'F'
  }
})

/**
 * 打开选择操作码对话框
 * 
 * 调用 listOperation 获取平铺列表，使用 proxy.handleTree 构建树形结构，
 * 与操作码列表页保持一致，字段契约使用 id / name。
 */
function show() {
  listOperation({}).then(res => {
    const list = res.data || []
    operationTree.value = proxy.handleTree(list, 'id')
    selectedNode.value = null
    visible.value = true
  })
}

/**
 * 树节点点击回调
 * 由于 treeProps 已禁用非 F 节点，此处仅需记录选中的 F 节点
 * @param {Object} data 当前点击的节点数据
 */
function handleNodeClick(data) {
  // 仅 F 节点可点击，直接赋值
  selectedNode.value = data
}

/**
 * 确认选择
 * 将选中的操作码节点通过 emit('ok') 传递给父组件
 */
function handleConfirm() {
  if (selectedNode.value) {
    visible.value = false
    emit('ok', selectedNode.value)
  }
}

const emit = defineEmits(['ok'])
defineExpose({ show })
</script>