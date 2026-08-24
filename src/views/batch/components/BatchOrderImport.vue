<template>
  <el-dialog v-model="visible" title="导入生产任务单" width="500px" append-to-body @closed="handleClosed">
    <el-upload
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
    >
      <el-button type="primary">选择 Excel 文件</el-button>
    </el-upload>
    <div v-if="file" style="margin-top: 12px;">已选择：{{ file.name }}</div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="!file" @click="handleSubmit">确定导入</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { importBatchOrder } from '@/api/batch/batch_plan'

defineOptions({ name: 'BatchOrderImport' })

const visible = ref(false)
const file = ref(null)
const planId = ref(null)

/**
 * 打开导入对话框
 * @param {Object} row 排产计划行数据
 */
function open(row) {
  planId.value = row.planId
  file.value = null
  visible.value = true
}

/**
 * 文件选择变化
 */
function handleFileChange(uploadFile) {
  file.value = uploadFile.raw
}

/**
 * 提交导入
 */
function handleSubmit() {
  if (!file.value) return
  importBatchOrder(planId.value, file.value).then(() => {
    ElMessage.success('导入成功')
    visible.value = false
    emit('success')
  })
}

/**
 * 对话框关闭回调
 */
function handleClosed() {
  file.value = null
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>