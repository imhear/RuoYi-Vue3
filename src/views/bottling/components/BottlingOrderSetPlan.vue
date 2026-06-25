<!--
  设置工单计划日期对话框
-->
<template>
  <el-dialog v-model="visible" title="设置计划日期" width="400px" append-to-body @closed="handleClosed">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="计划开始" prop="planStart">
        <el-date-picker
          v-model="form.planStart"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划开始"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="计划结束" prop="planEnd">
        <el-date-picker
          v-model="form.planEnd"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划结束"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'

const visible = ref(false)
const formRef = ref(null)
const currentOrder = ref(null)

const form = reactive({
  planStart: null,
  planEnd: null
})
const rules = {
  planStart: [{ required: true, message: '计划开始不能为空', trigger: 'change' }],
  planEnd:   [{ required: true, message: '计划结束不能为空', trigger: 'change' }]
}

const emit = defineEmits(['submit'])

/** 打开对话框，回显已有日期 */
async function open(row) {
  currentOrder.value = row
  form.planStart = row.planStart || null
  form.planEnd = row.planEnd || null
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
}

/** 校验通过后向父组件提交 */
function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    emit('submit', {
      order: currentOrder.value,
      planStart: form.planStart,
      planEnd: form.planEnd
    })
  })
}

/** 关闭对话框（供父组件调用） */
function close() {
  visible.value = false
}

function handleClosed() {
  currentOrder.value = null
}

defineExpose({ open, close })
</script>