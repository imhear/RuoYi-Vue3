<!--
  设置灌装起止时间对话框
  仅含两个日期时间选择器，提交后 emit 给父组件
-->
<template>
  <el-dialog v-model="visible" title="设置起止时间" width="400px" append-to-body @closed="handleClosed">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="开始时间" prop="fillingStartTime">
        <el-date-picker
          v-model="form.fillingStartTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="fillingEndTime">
        <el-date-picker
          v-model="form.fillingEndTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择结束时间"
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
// 当前操作的记录
const currentRow = ref(null)

const form = reactive({
  fillingStartTime: null,
  fillingEndTime: null
})

const rules = {
  fillingStartTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
  fillingEndTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' }]
}

const emit = defineEmits(['submit'])

/**
 * 打开对话框，回显已有日期
 */
async function open(rowData) {
  currentRow.value = rowData
  form.fillingStartTime = rowData.fillingStartTime || null
  form.fillingEndTime = rowData.fillingEndTime || null
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
}

/** 校验通过后 emit 给父组件 */
function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    emit('submit', {
      recordId: currentRow.value.recordId,
      fillingStartTime: form.fillingStartTime,
      fillingEndTime: form.fillingEndTime
    })
  })
}

function close() {
  visible.value = false
}

function handleClosed() {
  currentRow.value = null
}

defineExpose({ open, close })
</script>