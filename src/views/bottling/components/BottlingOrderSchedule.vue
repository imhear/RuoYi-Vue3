<!--
  排产对话框组件
  上部：排产表单；下部：引用纯内容组件展示明细详情
-->
<template>
  <el-dialog v-model="visible" title="排产" width="210mm" append-to-body @closed="handleClosed">
    <!-- ===== 上部：排产表单 ===== -->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="margin-bottom: 16px;">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="生产批号" prop="batchNumber">
            <el-input v-model="form.batchNumber" placeholder="请输入生产批号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排产数量" prop="planQty">
            <el-input-number 
              v-model="form.planQty" 
              :min="1" 
              :max="maxPlanQty" 
              placeholder="请输入排产数量" 
              style="width: 100%" 
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划开始" prop="planStart">
            <el-date-picker
              v-model="form.planStart"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择计划开始"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划结束" prop="planEnd">
            <el-date-picker
              v-model="form.planEnd"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择计划结束"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <!-- 新增：三个车间选择 -->
        <el-col :span="8">
          <el-form-item label="消毒车间" prop="workshopDisinfection">
            <el-select v-model="form.workshopDisinfection" placeholder="请选择消毒车间" clearable style="width: 100%">
              <el-option v-for="dept in deptList" :key="dept.deptId" :label="dept.deptName" :value="dept.deptId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="灌装车间" prop="workshopFilling">
            <el-select v-model="form.workshopFilling" placeholder="请选择灌装车间" clearable style="width: 100%">
              <el-option v-for="dept in deptList" :key="dept.deptId" :label="dept.deptName" :value="dept.deptId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外包车间" prop="workshopPacking">
            <el-select v-model="form.workshopPacking" placeholder="请选择外包车间" clearable style="width: 100%">
              <el-option v-for="dept in deptList" :key="dept.deptId" :label="dept.deptName" :value="dept.deptId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 排产按钮 -->
      <div style="text-align: right;">
        <el-button type="primary" @click="handleSubmit">确 认 排 产</el-button>
      </div>
    </el-form>

    <el-divider />

    <!-- ===== 下部：引用纯内容组件展示明细详情 ===== -->
    <BottlingOrderContent ref="contentRef" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import BottlingOrderContent from './BottlingOrderContent.vue'
import { listDept } from '@/api/system/dept'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const formRef = ref(null)
const contentRef = ref(null)
const currentDetail = ref(null)
const deptList = ref([])  // 车间列表

const form = reactive({
  batchNumber: '',
  planQty: null,
  planStart: null,
  planEnd: null,
  remark: '',
  workshopDisinfection: null,
  workshopFilling: null,
  workshopPacking: null
})

// 最大可排数量 = 计划数量 - 已排产数量
const maxPlanQty = computed(() => {
  if (!currentDetail.value) return 0
  return (currentDetail.value.requireNum || 0) - (currentDetail.value.planQty || 0)
})

const rules = {
  batchNumber: [{ required: true, message: '生产批号不能为空', trigger: 'blur' }],
  planQty: [{ required: true, message: '排产数量不能为空', trigger: 'blur' }],
  planStart: [{ required: true, message: '计划开始不能为空', trigger: 'change' }],
  planEnd:   [{ required: true, message: '计划结束不能为空', trigger: 'change' }],
}

const emit = defineEmits(['submit'])

// 加载车间列表（仅状态正常的部门）
onMounted(async () => {
  try {
    const res = await listDept({ status: '0' })
    deptList.value = res.data || []
  } catch (e) {
    console.error('获取车间列表失败')
  }
})

/**
 * 打开排产对话框
 * @param {Object} data - 工单详情（order, detail, materials）
 */
async function open(data) {
  currentDetail.value = data.detail
  // 初始化表单
  form.batchNumber =  currentDetail.value.batchNumber // 改为只读并设置默认值
  form.planQty = currentDetail.value.requireNum // 改为只读并设置默认值
  form.planStart = null
  form.planEnd = null
  form.remark = ''
  form.workshopDisinfection = null
  form.workshopFilling = null
  form.workshopPacking = null
  visible.value = true
  await nextTick()
  formRef.value?.resetFields()
  // 加载详情到纯内容组件
  contentRef.value?.open(data)
}

/** 表单校验通过后向父组件提交 */
function handleSubmit() {
  form.batchNumber = form.batchNumber.trim()
  form.remark = form.remark.trim()
  formRef.value?.validate(valid => {
    if (!valid) return
    // 校验排产数量不超过剩余可排
    if (form.planQty > maxPlanQty.value) {
      proxy.$modal.msgError('排产数量不能超过剩余可排数量（剩余：' + maxPlanQty.value + '）')
      return
    }
    emit('submit', {
      detailId: currentDetail.value.detailId,
      batchNumber: form.batchNumber,
      planQty: form.planQty,
      planStart: form.planStart,
      planEnd: form.planEnd,
      remark: form.remark.trim(),
      workshopDisinfection: form.workshopDisinfection,
      workshopFilling: form.workshopFilling,
      workshopPacking: form.workshopPacking
    })
  })
}

/** 关闭对话框 */
function close() {
  visible.value = false
}

function handleClosed() {
  currentDetail.value = null
}

defineExpose({ open, close })
</script>