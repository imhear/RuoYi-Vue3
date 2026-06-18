<!--
  完成生产对话框
  上部：输入完成数量；下部：引用纯内容组件展示详情
-->
<template>
  <el-dialog v-model="visible" title="完成生产" width="210mm" append-to-body @closed="handleClosed">
    <!-- ===== 上部：动态表单 ===== -->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="margin-bottom: 16px;">
      <!-- 双列排版：完成数量 + 生产批号 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="完成数量" prop="finishQty">
            <el-input-number v-model="form.finishQty" :min="1" :max="maxFinishQty" placeholder="请输入完成数量" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产批号" prop="batchNumber">
            <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align: right;">
        <el-button type="primary" @click="handleSubmit">确 认 完 成</el-button>
      </div>
    </el-form>

    <el-divider />

    <!-- ===== 下部：纯内容组件 ===== -->
    <BottlingOrderContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import BottlingOrderContent from './BottlingOrderContent.vue'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const formRef = ref(null)
const contentRef = ref(null)
const currentRow = ref(null)

const form = reactive({
  finishQty: null,
  batchNumber: ''       // 新增
})
const rules = {
  finishQty: [{ required: true, message: '完成数量不能为空', trigger: 'blur' }],
  batchNumber: [{ required: true, message: '生产批号不能为空', trigger: 'blur' }]  // 新增
}

// 最大可完成数量 = 排产数量
const maxFinishQty = computed(() => {
  if (!currentRow.value) return 0
  return currentRow.value.planQty || 0
})

const emit = defineEmits(['submit'])

/** 打开对话框 */
async function open(data) {
  currentRow.value = data.plan
  form.finishQty = null
  form.batchNumber = ''    // 新增
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
  contentRef.value?.open(data)
}

/** 提交 */
function handleSubmit() {
  form.batchNumber = form.batchNumber.trim()
  formRef.value?.validate(valid => {
    if (!valid) return
    if (form.finishQty > maxFinishQty.value) {
      proxy.$modal.msgError('完成数量不能超过排产数量（最大：' + maxFinishQty.value + '）')
      return
    }
    emit('submit', {
      plan: currentRow.value,
      finishQty: form.finishQty,
      batchNumber: form.batchNumber.trim()  // 新增
    })
  })
}

function close() { visible.value = false }
function handleClosed() { currentRow.value = null }

defineExpose({ open, close })
</script>