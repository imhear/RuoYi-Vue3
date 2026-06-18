<!--
  查看罐包装生产指令单对话框
  外层 el-dialog，内部引用纯内容组件
-->
<template>
  <el-dialog v-model="visible" title="灌包生产指令单" width="210mm" append-to-body @closed="contentRef?.reset()">
    <BottlingOrderContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import BottlingOrderContent from './BottlingOrderContent.vue'

const visible = ref(false)
const contentRef = ref(null)

/**
 * 打开查看对话框
 * @param {Object} data - 工单详情
 */
async function open(data) {
  visible.value = true
  await nextTick()
  contentRef.value?.open(data)
}

defineExpose({ open })
</script>