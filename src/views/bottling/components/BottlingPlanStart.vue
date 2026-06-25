<!--
  开始生产对话框
  上部：选择批记录模版；下部：引用纯内容组件展示详情
-->
<template>
  <el-dialog v-model="visible" title="开始生产" width="210mm" append-to-body @closed="handleClosed">
    <!-- ===== 上部：动态表单 ===== -->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" style="margin-bottom: 16px;">
      <el-form-item label="批记录模版" prop="templateCode">
        <el-select v-model="form.templateCode" placeholder="请选择批记录模版" style="width: 100%">
          <el-option
            v-for="dict in pro_record_template"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <div style="text-align: right;">
        <el-button type="primary" @click="handleSubmit">确 认 开 始</el-button>
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
const { pro_record_template } = proxy.useDict('pro_record_template')

const visible = ref(false)
const formRef = ref(null)
const contentRef = ref(null)
const currentRow = ref(null)

const form = reactive({
  templateCode: ''
})

const rules = {
  templateCode: [{ required: true, message: '批记录模版不能为空', trigger: 'change' }]
}

const emit = defineEmits(['submit'])

/** 打开对话框 */
async function open(data) {
  currentRow.value = data.plan
  form.templateCode = ''
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
  contentRef.value?.open(data)
}

/** 提交 */
function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    emit('submit', { plan: currentRow.value, templateCode: form.templateCode })
  })
}

function close() { visible.value = false }
function handleClosed() { currentRow.value = null }

defineExpose({ open, close })
</script>