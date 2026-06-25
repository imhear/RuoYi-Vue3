<!--
  领料单复核对话框（纯被动模式）
  展示纯内容组件，提交时 emit receivingId
-->
<template>
  <el-dialog v-model="visible" width="300mm" append-to-body @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">领料单复核</span>
        <el-button type="primary" @click="handleConfirm">确认复核</el-button>
      </div>
    </template>
    <BottlingReceivingContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import BottlingReceivingContent from './BottlingReceivingContent.vue'

const visible = ref(false)
const contentRef = ref(null)
const currentReceivingId = ref(null)

/** 打开对话框，接收完整详情数据 */
async function open(data) {
  currentReceivingId.value = data.receivingId
  visible.value = true
  // 等待对话框内部组件挂载完成
  await nextTick()
  // 直接展示传入的完整数据
  contentRef.value?.open(data)
}

/** 点击确认：发射事件，让父组件处理后续 */
function handleConfirm() {
  emit('submit', { receivingId: currentReceivingId.value });
}

function handleClosed() {
  contentRef.value?.reset()
  currentReceivingId.value = null
}

function close() {
  visible.value = false
}

const emit = defineEmits(['submit'])

defineExpose({ open, close })
</script>