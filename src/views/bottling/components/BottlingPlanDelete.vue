<!--
  删除排产计划对话框
  上部：输入删除原因；下部：引用纯内容组件展示详情
-->
<template>
  <el-dialog v-model="visible" title="删除任务" width="210mm" append-to-body @closed="handleClosed">
    <!-- ===== 上部：动态表单 ===== -->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="margin-bottom: 16px;">
      <el-form-item label="删除原因" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入删除原因" maxlength="200" show-word-limit />
      </el-form-item>
      <div style="text-align: right;">
        <el-button type="danger" @click="handleSubmit">确 认 删 除</el-button>
      </div>
    </el-form>

    <el-divider />

    <!-- ===== 下部：纯内容组件 ===== -->
    <BottlingOrderContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import BottlingOrderContent from './BottlingOrderContent.vue'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const formRef = ref(null)
const contentRef = ref(null)
const currentRow = ref(null)

const form = reactive({ remark: '' })
const rules = {
  remark: [
    { required: true, message: '删除原因不能为空', trigger: 'blur' },
    { min: 4, message: '删除原因最少4个字', trigger: 'blur' }
  ]
}

const emit = defineEmits(['submit'])

/** 打开对话框 */
async function open(data) {
  currentRow.value = data.plan
  form.remark = ''
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
  contentRef.value?.open(data)
}

/** 提交 */
function handleSubmit() {
  form.remark = form.remark.trim()
  formRef.value?.validate(valid => {
    if (!valid) return
    emit('submit', { plan: currentRow.value, remark: form.remark.trim() })
  })
}

function close() { visible.value = false }
function handleClosed() { currentRow.value = null }

defineExpose({ open, close })
</script>