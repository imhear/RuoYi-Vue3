<!--
  灌装包材处理记录1 查看对话框
  外层 el-dialog，内部引用纯内容组件
-->
<template>
  <el-dialog v-model="visible" title="灌装包材处理记录1" width="280mm" append-to-body @closed="handleClosed">
    <BottlingDisPack1Content ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import BottlingDisPack1Content from './BottlingDisPack1Content.vue'

const visible = ref(false)
const contentRef = ref(null)

/**
 * 打开查看对话框
 * @param {Object} data - 详情数据（含 step4List）
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