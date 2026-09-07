<template>
  <el-dialog title="选择操作码" v-model="visible" width="700px" append-to-body>
    <el-tree
      :data="operationTree"
      node-key="operationId"
      :props="{ label: 'operationName', children: 'children' }"
      highlight-current
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <span>
          <el-tag v-if="data.menuType === 'M'" size="small" type="primary">目录</el-tag>
          <el-tag v-else-if="data.menuType === 'C'" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="data.menuType === 'F'" size="small" type="warning">按钮</el-tag>
          <span style="margin-left: 8px;">{{ data.operationName }}</span>
          <span v-if="data.menuType === 'F'" style="margin-left: 8px; color: #909399;">{{ data.operationCode }}</span>
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
import { ref } from 'vue'
import { treeselect } from '@/api/fill/operation'

const visible = ref(false)
const operationTree = ref([])
const selectedNode = ref(null)

function show() {
  treeselect().then(res => {
    operationTree.value = res.data || []
    selectedNode.value = null
    visible.value = true
  })
}

function handleNodeClick(data) {
  if (data.menuType !== 'F') {
    selectedNode.value = null
    return
  }
  selectedNode.value = data
}

function handleConfirm() {
  if (selectedNode.value) {
    visible.value = false
    emit('ok', selectedNode.value)
  }
}

const emit = defineEmits(['ok'])
defineExpose({ show })
</script>