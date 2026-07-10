<!--
  灌装生产记录1 查看对话框
  完全对齐包材处理记录查看组件风格
-->
<template>
  <el-dialog v-model="visible" title="灌装生产记录" width="280mm" append-to-body @closed="handleClosed">
    <BottlingFillingContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import BottlingFillingContent from './BottlingFillingContent.vue'

const visible = ref(false)
const contentRef = ref(null)

/**
 * 打开查看对话框
 * @param {Object} data - 详情数据（包含 fillingMainList、子表及孙表）
 */
async function open(data) {
  visible.value = true
  await nextTick()
  contentRef.value?.open(data)
}

function handleClosed() {
  contentRef.value?.reset()
}

defineExpose({ open })
</script>