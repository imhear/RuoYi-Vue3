<!--
  删除罐包装生产指令单对话框
  内部引用纯内容组件，顶部提供删除原因输入和删除按钮
-->
<template>
  <el-dialog v-model="visible" title="删除生产指令单" width="210mm" append-to-body @closed="handleClosed">
    <!-- 内容区顶部：删除原因输入 + 删除按钮 -->
    <div style="margin-bottom: 12px;">
      <el-input
        v-model="deleteReason"
        type="textarea"
        :rows="2"
        placeholder="请输入删除原因"
        maxlength="200"
        show-word-limit
      />
      <div style="text-align: right; margin-top: 8px;">
        <el-button type="danger" @click="handleDelete">删 除</el-button>
      </div>
    </div>

    <el-divider />

    <!-- 引用纯内容组件展示详情 -->
    <BottlingOrderContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import BottlingOrderContent from './BottlingOrderContent.vue'

const { proxy } = getCurrentInstance()

const visible = ref(false)       // 对话框开关
const contentRef = ref(null)     // 内容组件引用
const currentOrder = ref(null)   // 当前工单数据
const deleteReason = ref('')     // 删除原因

const emit = defineEmits(['delete'])

/** 打开删除对话框，加载详情数据 */
async function open(data) {
  currentOrder.value = data.order
  deleteReason.value = ''
  visible.value = true
  await nextTick()
  contentRef.value?.open(data)
}

/** 点击删除，向父组件发送事件 */
function handleDelete() {
  deleteReason.value = deleteReason.value.trim()
  if (deleteReason.value.trim().length < 4) {
    proxy.$modal.msgError('删除原因最少4个字')
    return
  }
  emit('delete', {
    order: currentOrder.value,
    reason: deleteReason.value.trim()
  })
}

/** 关闭对话框（供父组件调用） */
function close() {
  visible.value = false
}

/** 对话框关闭后清理数据 */
function handleClosed() {
  currentOrder.value = null
  deleteReason.value = ''
}

defineExpose({ open, close })
</script>