<!--
  清场记录 查看对话框
  外层 el-dialog，内部引用纯内容组件
  完全被动模式，父组件通过 open(data) 调用
-->
<template>
  <el-dialog v-model="visible" title="清场记录" width="280mm" append-to-body @closed="handleClosed">
    <BottlingCleaningContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import BottlingCleaningContent from './BottlingCleaningContent.vue'

const visible = ref(false)
const contentRef = ref(null)

/**
 * 打开查看对话框
 * @param {Object} data - 清场记录详情数据
 */
async function open(data) {
  visible.value = true
  await nextTick()
  contentRef.value?.open(data)
}

/** 关闭对话框时重置内容 */
function handleClosed() {
  contentRef.value?.reset()
}

defineExpose({ open })
</script>