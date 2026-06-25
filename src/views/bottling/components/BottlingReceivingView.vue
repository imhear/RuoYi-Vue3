<!--
  领料单查看对话框
  外层 el-dialog，获取排产计划后传给内容组件
-->
<template>
  <el-dialog v-model="visible" title="" width="300mm" append-to-body @closed="handleClosed">
    <BottlingReceivingContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { getPlan } from '@/api/bottling/plan'
import BottlingReceivingContent from './BottlingReceivingContent.vue'

const visible = ref(false)
const contentRef = ref(null)

/**
 * 打开查看对话框
 * @param {Object} data - 领料单详情（含 planId）
 */
async function open(data) {
  visible.value = true
  await nextTick()
  try {
    // 获取排产计划信息（产品名称、规格、批号）
    const planRes = await getPlan(data.planId)
    const plan = planRes.data
    // 将 plan 附加到 data 上，传给内容组件
    data.plan = plan
    contentRef.value?.open(data)
  } catch (e) {
    // 若获取失败，仍可打开，但不显示产品信息
    contentRef.value?.open(data)
  }
}

function handleClosed() {
  contentRef.value?.reset()
}

defineExpose({ open })
</script>