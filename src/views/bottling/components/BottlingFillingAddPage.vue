<!--
  灌装生产记录1加页对话框
  用户选择生产日期后确认提交
-->
<template>
  <el-dialog v-model="visible" title="加页 - 新增灌装记录" width="210mm" append-to-body @closed="handleClosed">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
      <el-form-item label="生产日期" prop="recordDate">
        <el-date-picker
          v-model="form.recordDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择生产日期"
          style="width: 100%"
        />
      </el-form-item>
      <div style="text-align: right;">
        <el-button type="primary" @click="handleSubmit">确认加页</el-button>
      </div>
    </el-form>
    <!-- <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </template> -->

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
const currentPlanId = ref(null)
const currentRow = ref(null)   // 保存父组件传入的完整数据

const form = reactive({ recordDate: null })
const rules = {
  recordDate: [{ required: true, message: '生产日期不能为空', trigger: 'change' }]
}

const emit = defineEmits(['submit'])


/** 打开对话框 */
async function open(data) {
  currentRow.value = data.plan
  currentPlanId.value = data.planId // 写法有问题，获取不到planId
  form.recordDate = null
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
  // 驱动纯内容组件显示
  contentRef.value?.open(data)
}

/** 打开对话框 */
// async function open(planId) {
//   currentPlanId.value = planId
//   form.recordDate = null
//   visible.value = true
//   await nextTick()
//   formRef.value?.resetFields()
// }

/** 提交 */
function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    emit('submit', { planId: currentPlanId.value, recordDate: form.recordDate })
  })
}

function close() { visible.value = false }
function handleClosed() { currentPlanId.value = null }

defineExpose({ open, close })
</script>