<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入工单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排产单号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入排产单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入产品批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

     <!-- 不使用，待统一删除 -->
    <!-- <el-row :gutter="10" class="mb8">
      ...
    </el-row> -->

    <el-table v-loading="loading" :data="fillingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 加页按钮：仅生产中状态显示 -->
          <el-button link type="primary" icon="" @click="handleAddPage(scope.row)"   v-hasPermi="['bottling:filling:add']" >加页</el-button>
          <!-- 新增处理、复核、检查按钮（对齐参考列表页） -->
          <el-button link type="primary" icon="" @click="handleHandle(scope.row)">处理</el-button>
          <el-button link type="primary" icon="" @click="handleReview(scope.row)">复核</el-button>
          <el-button link type="primary" icon="" @click="handleInspect(scope.row)">检查</el-button>
          <!-- 新增：首件确认按钮 -->
          <el-button link type="primary" @click="handleFirstConfirm(scope.row)">首件确认</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="disinfection_packaging_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!-- 新增：开始时间列 -->
      <el-table-column label="开始时间" align="center" prop="fillingStartTime" min-width="100">
        <template #default="scope">
          <span>{{ scope.row.fillingStartTime ? parseTime(scope.row.fillingStartTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
          <!-- 设置按钮，仅状态为0或1时显示 -->
          <el-button
            v-if="scope.row.status === '0' || scope.row.status === '1'"
            v-hasPermi="['bottling:filling:update']"
            link type="primary" icon=""
            @click="handleSetDateTime(scope.row)"
          >设置</el-button>
        </template>
      </el-table-column>
      <!-- 新增：结束时间列 -->
      <el-table-column label="结束时间" align="center" prop="fillingEndTime" min-width="100">
        <template #default="scope">
          <span>{{ scope.row.fillingEndTime ? parseTime(scope.row.fillingEndTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
        </template>
      </el-table-column>
      <!-- 任务单号改为超链接，点击触发查看 -->
      <el-table-column label="任务单号" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.planCode }}</el-button>
        </template>
      </el-table-column>
      <!-- 工单号改为超链接，点击触发查看 -->
      <el-table-column label="工单号" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleOrderView(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="产品编码" align="center" prop="productCode" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="产品批号" align="center" prop="batchNumber" />
      <el-table-column label="生产日期" align="center" prop="recordDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.recordDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看灌装生产记录对话框 -->
    <BottlingFillingView ref="fillingViewRef" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 加页对话框 -->
    <BottlingFillingAddPage ref="addPageRef" @submit="handleConfirmAddPage" />

    <!-- 新增：处理对话框（只实现了step1） -->
    <BottlingFillingHandle ref="fillingHandleRef"
      @step1Submit="handleStep1Submit"
      @step2Submit="handleStep2Submit"
      @step3Submit="handleStep3Submit"
      @submit="getList" />

    <!-- 复核对话框 -->
    <BottlingFillingReview ref="fillingReviewRef"
      @step1Review="handleStep1Review"
      @step2Review="handleStep2Review"
      @step3Review="handleStep3Review"
      @submit="getList" />

    <!-- 检查对话框 -->
    <BottlingFillingInspect ref="fillingInspectRef"
      @step1Inspect="handleStep1Inspect"
      @step2Inspect="handleStep2Inspect"
      @step3Inspect="handleStep3Inspect"
      @submit="getList" />

    <!-- 设置起止时间对话框 -->
    <BottlingFillingSetDateTime ref="fillingSetDateTimeRef" @submit="handleConfirmSetDateTime" />

    <!-- 灌装首件确认对话框 -->
    <BottlingFillingFirstConfirm ref="fillingFirstConfirmRef" @submit="handleConfirmFirstQualified" />

  </div>
</template>

<script setup name="Filling">
import { listFilling, getFilling, delFilling, addFilling, updateFilling, addPage } from "@/api/bottling/filling"
// 新增导入：step1 处理接口
import { handleStep1, handleStep2, handleStep3, reviewStep1, reviewStep2, reviewStep3, inspectStep1, inspectStep2, inspectStep3 } from "@/api/bottling/filling"
import { getPlan } from "@/api/bottling/plan"
import { getOrderDetail } from "@/api/bottling/order"
// 导入更新起止时间 API
import { updateFillingDateTime } from "@/api/bottling/filling"
// 导入首件确认 API
import { updateFirstQualified } from "@/api/bottling/filling"

// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'
// 引入加页对话框组件
import BottlingFillingAddPage from '@/views/bottling/components/BottlingFillingAddPage.vue'
// 引入查看对话框组件
import BottlingFillingView from '@/views/bottling/components/BottlingFillingView.vue'
// 引入处理对话框组件
import BottlingFillingHandle from '@/views/bottling/components/BottlingFillingHandle.vue'
// 引入复核对话框组件
import BottlingFillingReview from '@/views/bottling/components/BottlingFillingReview.vue'
// 引入检查对话框组件
import BottlingFillingInspect from '@/views/bottling/components/BottlingFillingInspect.vue'

// 引入设置起止时间对话框组件
import BottlingFillingSetDateTime from '@/views/bottling/components/BottlingFillingSetDateTime.vue'
// 引入灌装首件确认对话框组件
import BottlingFillingFirstConfirm from '@/views/bottling/components/BottlingFillingFirstConfirm.vue'

// 加页对话框组件引用
const addPageRef = ref(null)
// 查看工单组件引用
const orderViewRef = ref(null)
// 查看灌装生产记录组件引用
const fillingViewRef = ref(null)
// 新增：处理对话框组件引用
const fillingHandleRef = ref(null)
// 复核对话框组件引用
const fillingReviewRef = ref(null)
// 检查对话框组件引用
const fillingInspectRef = ref(null)
// 设置起止时间对话框组件引用
const fillingSetDateTimeRef = ref(null)
// 灌装首件确认对话框组件引用
const fillingFirstConfirmRef = ref(null)

const { proxy } = getCurrentInstance()
const { sys_yes_no, disinfection_packaging_status } = useDict('sys_yes_no', 'disinfection_packaging_status')

const fillingList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    planCode: undefined,
    batchNumber: undefined,
    status: '0,1,2', // 默认排除已取消
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装生产记录1列表 */
function getList() {
  loading.value = true
  listFilling(queryParams.value).then(response => {
    fillingList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    recordId: null,
    orderId: null,
    planId: null,
    status: null,
    orderNum: null,
    planCode: null,
    productCode: null,
    productName: null,
    spec: null,
    batchNumber: null,
    recordDate: null,
    fillingStartTime: null,
    fillingEndTime: null,
    firstQualifiedFlag: null,
    firstQualifiedInspector: null,
    firstQualifiedInspectorTime: null,
    s1StepNumber: null,
    s1StepName: null,
    s1StepNormalDisable: null,
    s1OperateShowHide: null,
    s1ReviewShowHide: null,
    s1InspectShowHide: null,
    s1Operator: null,
    s1Reviewer: null,
    s1Inspector: null,
    s1OperatorTime: null,
    s1ReviewerTime: null,
    s1InspectorTime: null,
    s1CleanAreaTemperature: null,
    s1CleanAreaHumidity: null,
    s1QualifiedFlag: null,
    s1Remark: null,
    s2StepNumber: null,
    s2StepName: null,
    s2StepNormalDisable: null,
    s2OperateShowHide: null,
    s2ReviewShowHide: null,
    s2InspectShowHide: null,
    s2Operator: null,
    s2Reviewer: null,
    s2Inspector: null,
    s2OperatorTime: null,
    s2ReviewerTime: null,
    s2InspectorTime: null,
    s2MainEquipName: null,
    s2MainEquipNo: null,
    s2PurifiedWaterFlag: null,
    s2ReCleanDisinfectFlag: null,
    s2CleaningMethod: null,
    s2DesinfectionMethod: null,
    s3StepNumber: null,
    s3StepName: null,
    s3StepNormalDisable: null,
    s3OperateShowHide: null,
    s3ReviewShowHide: null,
    s3InspectShowHide: null,
    s3Operator: null,
    s3Reviewer: null,
    s3Inspector: null,
    s3OperatorTime: null,
    s3ReviewerTime: null,
    s3InspectorTime: null,
    s3UseMaterialLiquidRinseFlag: null,
    s3NetContentRangeLower: null,
    s3NetContentRangeUpper: null,
    s3NetContentUnit: null,
    s3InkPrintCodeFlag: null,
    s3LaserPrintCodeFlag: null,
    s3StampPrintCodeFlag: null,
    s3CodingInfo: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillingRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加灌装生产记录1"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getFilling(_recordId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装生产记录1"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillingRef"].validate(valid => {
    if (valid) {
      if (form.value.recordId != null) {
        updateFilling(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFilling(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _recordIds = row.recordId || ids.value
  proxy.$modal.confirm('是否确认删除灌装生产记录1编号为"' + _recordIds + '"的数据项？').then(function() {
    return delFilling(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/filling/export', {
    ...queryParams.value
  }, `filling_${new Date().getTime()}.xlsx`)
}

/** 打开加页对话框（改造后） */
async function handleAddPage(row) {
  try {
    const planRes = await getPlan(row.planId)
    const plan = planRes.data
    const orderRes = await getOrderDetail(plan.orderId)
    const orderDetail = orderRes.data
    orderDetail.planId = row.planId
    orderDetail.plan = plan
    addPageRef.value?.open(orderDetail)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 确认加页：二次确认后调用后端接口 */
function handleConfirmAddPage({ planId, recordDate }) {
  proxy.$modal.confirm('是否确认新增生产日期为 ' + recordDate + ' 的灌装记录？').then(() => {
    return addPage(planId, { recordDate })
  }).then(() => {
    proxy.$modal.msgSuccess('加页成功')
    addPageRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 查看灌装生产记录详情（任务单号点击事件） */
async function handleView(row) {
  try {
    const res = await getFilling(row.recordId)
    fillingViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取灌装生产记录详情失败')
  }
}

/** 打开处理对话框（step1 可编辑） */
function handleHandle(row) {
  getFilling(row.recordId).then(res => {
    fillingHandleRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开复核对话框（全部只读，可复核） */
function handleReview(row) {
  getFilling(row.recordId).then(res => {
    fillingReviewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开检查对话框（全部只读，可检查） */
function handleInspect(row) {
  getFilling(row.recordId).then(res => {
    fillingInspectRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** Step1 提交处理（二次确认后调用接口） */
async function handleStep1Submit({ recordId, form }) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step1 操作记录？')
    await handleStep1(recordId, form)
    proxy.$modal.msgSuccess('Step1 提交成功')
    fillingHandleRef.value?.close?.()  // 关闭处理对话框（需子组件暴露 close 或 visible）
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 提交失败')
  }
}

/** Step2 提交处理（二次确认后调用接口） */
async function handleStep2Submit({ recordId, form }) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step2 操作记录？')
    await handleStep2(recordId, form)
    proxy.$modal.msgSuccess('Step2 提交成功')
    fillingHandleRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step2 提交失败')
  }
}

/** Step3 提交处理（二次确认后调用接口） */
async function handleStep3Submit({ recordId, form, needConfirm = true  }) {
  try {
    if (needConfirm) {
      await proxy.$modal.confirm('是否确认提交 Step3 灌装操作记录？')
    }
    await handleStep3(recordId, form)
    proxy.$modal.msgSuccess('Step3 提交成功')
    fillingHandleRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 提交失败')
  }
}

/** Step1 复核处理（二次确认后调用接口） */
async function handleStep1Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step1？')
    await reviewStep1(recordId)
    proxy.$modal.msgSuccess('Step1 复核成功')
    fillingReviewRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 复核失败')
  }
}

/** Step2 复核处理 */
async function handleStep2Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step2？')
    await reviewStep2(recordId)
    proxy.$modal.msgSuccess('Step2 复核成功')
    fillingReviewRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step2 复核失败')
  }
}

/** Step3 复核处理 */
async function handleStep3Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step3？')
    await reviewStep3(recordId)
    proxy.$modal.msgSuccess('Step3 复核成功')
    fillingReviewRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 复核失败')
  }
}
/** Step1 检查处理（二次确认后调用接口） */
async function handleStep1Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step1？')
    await inspectStep1(recordId)
    proxy.$modal.msgSuccess('Step1 检查成功')
    fillingInspectRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 检查失败')
  }
}

/** Step2 检查处理 */
async function handleStep2Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step2？')
    await inspectStep2(recordId)
    proxy.$modal.msgSuccess('Step2 检查成功')
    fillingInspectRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step2 检查失败')
  }
}

/** Step3 检查处理 */
async function handleStep3Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step3？')
    await inspectStep3(recordId)
    proxy.$modal.msgSuccess('Step3 检查成功')
    fillingInspectRef.value?.close?.()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 检查失败')
  }
}

/** 打开设置起止时间对话框 */
function handleSetDateTime(row) {
  fillingSetDateTimeRef.value?.open(row)
}

/** 确认设置起止时间：二次确认后调用后端接口 */
async function handleConfirmSetDateTime({ recordId, fillingStartTime, fillingEndTime }) {
  try {
    await proxy.$modal.confirm('是否确认设置起止时间？')
    await updateFillingDateTime(recordId, { fillingStartTime, fillingEndTime })
    proxy.$modal.msgSuccess('设置成功')
    fillingSetDateTimeRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('设置失败')
  }
}

/** 打开灌装首件确认对话框 */
function handleFirstConfirm(row) {
  fillingFirstConfirmRef.value?.open(row.recordId)
}

/** 确认首件确认：二次确认后调用后端接口 */
async function handleConfirmFirstQualified({ recordId, firstQualifiedFlag }) {
  try {
    await proxy.$modal.confirm('是否确认提交灌装首件确认？')
    await updateFirstQualified(recordId, { firstQualifiedFlag })
    proxy.$modal.msgSuccess('首件确认成功')
    fillingFirstConfirmRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('首件确认失败')
  }
}

/** 查看工单详情 */
async function handleOrderView(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    await nextTick()
    orderViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}


getList()
</script>