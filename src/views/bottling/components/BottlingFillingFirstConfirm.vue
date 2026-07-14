<!--
  灌装首件确认对话框
  包含两个互斥复选框和一个提交按钮，用于确认首件是否合格
-->
<template>
  <el-dialog v-model="visible" title="灌装首件确认" width="400px" append-to-body @closed="handleClosed">
    <div style="text-align: center; padding: 20px 0;">
      <label class="native-checkbox-before" style="margin-right: 40px; font-size: 14px;">
        <input type="checkbox" v-model="form.firstQualifiedFlag" true-value="Y" false-value="" />
        <span>符合规定</span>
      </label>
      <label class="native-checkbox-before" style="font-size: 14px;">
        <input type="checkbox" v-model="form.firstQualifiedFlag" true-value="N" false-value="" />
        <span>不符合规定</span>
      </label>
    </div>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const currentRecordId = ref(null)

const form = reactive({
  firstQualifiedFlag: ''
})

const emit = defineEmits(['submit'])

/**
 * 打开对话框，重置表单
 */
function open(recordId) {
  currentRecordId.value = recordId
  form.firstQualifiedFlag = ''
  visible.value = true
}

/** 提交：校验后 emit 给父组件 */
function handleSubmit() {
  if (form.firstQualifiedFlag !== 'Y' && form.firstQualifiedFlag !== 'N') {
    // 简单校验，必须选择一项
    ElMessage.warning('请选择是否符合规定')
    return
  }
  emit('submit', {
    recordId: currentRecordId.value,
    firstQualifiedFlag: form.firstQualifiedFlag
  })
}

function close() {
  visible.value = false
}

function handleClosed() {
  currentRecordId.value = null
}

defineExpose({ open, close })
</script>

<style scoped>
/* 复用全局的复选框样式，确保显示正确 */
.native-checkbox-before {
  display: inline-flex;
  align-items: center;
  cursor: default;
  font-size: 14px;
  color: #000;
  font-weight: normal;
  user-select: none;
}
.native-checkbox-before input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.native-checkbox-before span::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
  box-sizing: border-box;
  background: #fff;
}
.native-checkbox-before input:checked + span::before {
  background-color: #409eff;
  border-color: #409eff;
}
.native-checkbox-before input:checked + span::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.native-checkbox-before span {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
</style>