<!--
  审核罐包装生产指令单组件
  外层 el-dialog，内容区顶部提供审核按钮，内部引用纯内容组件
-->
<template>
  <el-dialog v-model="visible" title="审核生产指令单" width="210mm" append-to-body @closed="handleClosed">
    <!-- 内容区顶部：审核按钮 -->
    <div style="text-align: right; margin-bottom: 12px;">
      <el-button type="primary" @click="handleAudit">审 核</el-button>
    </div>

    <el-divider />

    <!-- 引用纯内容组件展示详情 -->
    <BottlingOrderContent ref="contentRef" />

    <!-- <template #footer>
      <el-button @click="handleClose">关 闭</el-button>
    </template> -->
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import BottlingOrderContent from './BottlingOrderContent.vue'

const visible = ref(false)       // 对话框开关
const contentRef = ref(null)        // 内容组件引用
const currentOrder = ref(null)   // 当前工单数据

const emit = defineEmits(['audit'])

/** 打开审核对话框，加载详情数据 */
async function open(data) {
  currentOrder.value = data.order
  visible.value = true
  await nextTick()
  contentRef.value?.open(data)
}

/** 点击审核，向父组件发送事件 */
function handleAudit() {
  emit('audit', currentOrder.value)
}

/** 关闭对话框 */
function handleClose() {
  visible.value = false
}

/** 对话框关闭后清理数据 */
function handleClosed() {
  currentOrder.value = null
}

defineExpose({ open, handleClose })
</script>