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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['bottling:disinfectionPackaging2:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:disinfectionPackaging2:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:disinfectionPackaging2:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:disinfectionPackaging2:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="disinfectionPackaging2List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
            <!-- 操作列：处理、复核、检查按钮 -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleHandle(scope.row)">处理</el-button>
          <el-button link type="primary" @click="handleReview(scope.row)">复核</el-button>
          <el-button link type="primary" @click="handleInspect(scope.row)">检查</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="disinfection_packaging_status" :value="scope.row.status"/>
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
      <!-- <el-table-column label="排产单号" align="center" prop="planCode" /> -->
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" /> -->
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="产品批号" align="center" prop="batchNumber" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看对话框组件（完全被动） -->
    <BottlingDisPack2View ref="disPack2ViewRef" />

    <!-- 处理对话框 -->
    <BottlingDisPack2Handle ref="disPack2HandleRef"
      @step5Submit="handleStep5Submit"
      @step6Submit="handleStep6Submit"
      @submit="getList" />

    <!-- 复核对话框 -->
    <BottlingDisPack2Review ref="disPack2ReviewRef"
      @step5Review="handleStep5Review"
      @step6Review="handleStep6Review"
      @submit="getList" />

    <!-- 检查对话框 -->
    <BottlingDisPack2Inspect ref="disPack2InspectRef"
      @step5Inspect="handleStep5Inspect"
      @step6Inspect="handleStep6Inspect"
      @submit="getList" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

  </div>
</template>

<script setup name="DisinfectionPackaging2">
import { listDisinfectionPackaging2, getDisinfectionPackaging2, delDisinfectionPackaging2, addDisinfectionPackaging2, updateDisinfectionPackaging2 } from "@/api/bottling/disinfectionPackaging2"
import { getOrderDetail } from "@/api/bottling/order"
// 引入处理 API
import { handleStep5, handleStep6 } from "@/api/bottling/disinfectionPackaging2"
// 引入复核 API
import { reviewStep5, reviewStep6 } from "@/api/bottling/disinfectionPackaging2"
// 引入检查 API
import { inspectStep5, inspectStep6 } from "@/api/bottling/disinfectionPackaging2"

// 引入查看对话框组件
import BottlingDisPack2View from '@/views/bottling/components/BottlingDisPack2View.vue'
// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'
// 引入处理对话框组件
import BottlingDisPack2Handle from '@/views/bottling/components/BottlingDisPack2Handle.vue'
// 引入复核对话框组件
import BottlingDisPack2Review from '@/views/bottling/components/BottlingDisPack2Review.vue'
// 引入检查对话框组件
import BottlingDisPack2Inspect from '@/views/bottling/components/BottlingDisPack2Inspect.vue'

const { proxy } = getCurrentInstance()
const { receiving_material, disinfection_packaging_status } = useDict('receiving_material', 'disinfection_packaging_status')

const disinfectionPackaging2List = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 查看对话框组件引用
const disPack2ViewRef = ref(null)
// 查看工单组件引用
const orderViewRef = ref(null)
// 处理对话框组件引用
const disPack2HandleRef = ref(null)
// 复核对话框组件引用
const disPack2ReviewRef = ref(null)
// 检查对话框组件引用
const disPack2InspectRef = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    planCode: undefined,
    batchNumber: undefined,
    status: '0,1,2', // 默认排除已取消
    delFlag: '0'     // 默认排除已删除
  },
  rules: {
    planId: [
      { required: true, message: "关联排产计划不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    s5StepNumber: [
      { required: true, message: "步骤序号不能为空", trigger: "blur" }
    ],
    s6StepNumber: [
      { required: true, message: "步骤序号不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录2列表 */
function getList() {
  loading.value = true
  listDisinfectionPackaging2(queryParams.value).then(response => {
    disinfectionPackaging2List.value = response.rows
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
    planId: null,
    status: null,
    orderNum: null,
    planCode: null,
    productName: null,
    spec: null,
    batchNumber: null,
    startTime: null,
    endTime: null,
    processDate: null,
    operator: null,
    reviewer: null,
    inspector: null,
    remark: null,
    s5StepNumber: null,
    s5StepName: null,
    s5StepNormalDisable: [],
    s5OperateShowHide: [],
    s5ReviewShowHide: [],
    s5InspectShowHide: [],
    s5Operator: null,
    s5Reviewer: null,
    s5Inspector: null,
    s5OperatorTime: null,
    s5ReviewerTime: null,
    s5InspectorTime: null,
    s5StartTime: null,
    s5EndTime: null,
    s5MaterialName1: null,
    s5MaterialName2: null,
    s5MaterialName3: null,
    s5MaterialQty1: null,
    s5MaterialQty2: null,
    s5MaterialQty3: null,
    s6StepNumber: null,
    s6StepName: null,
    s6StepNormalDisable: [],
    s6OperateShowHide: [],
    s6ReviewShowHide: [],
    s6InspectShowHide: [],
    s6Operator: null,
    s6Reviewer: null,
    s6Inspector: null,
    s6OperatorTime: null,
    s6ReviewerTime: null,
    s6InspectorTime: null,
    s6StartTime: null,
    s6EndTime: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("disinfectionPackaging2Ref")
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
  title.value = "添加灌装包材处理记录2"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getDisinfectionPackaging2(_recordId).then(response => {
    form.value = response.data
    form.value.s5StepNormalDisable = form.value.s5StepNormalDisable.split(",")
    form.value.s5OperateShowHide = form.value.s5OperateShowHide.split(",")
    form.value.s5ReviewShowHide = form.value.s5ReviewShowHide.split(",")
    form.value.s5InspectShowHide = form.value.s5InspectShowHide.split(",")
    form.value.s6StepNormalDisable = form.value.s6StepNormalDisable.split(",")
    form.value.s6OperateShowHide = form.value.s6OperateShowHide.split(",")
    form.value.s6ReviewShowHide = form.value.s6ReviewShowHide.split(",")
    form.value.s6InspectShowHide = form.value.s6InspectShowHide.split(",")
    open.value = true
    title.value = "修改灌装包材处理记录2"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["disinfectionPackaging2Ref"].validate(valid => {
    if (valid) {
      form.value.s5StepNormalDisable = form.value.s5StepNormalDisable.join(",")
      form.value.s5OperateShowHide = form.value.s5OperateShowHide.join(",")
      form.value.s5ReviewShowHide = form.value.s5ReviewShowHide.join(",")
      form.value.s5InspectShowHide = form.value.s5InspectShowHide.join(",")
      form.value.s6StepNormalDisable = form.value.s6StepNormalDisable.join(",")
      form.value.s6OperateShowHide = form.value.s6OperateShowHide.join(",")
      form.value.s6ReviewShowHide = form.value.s6ReviewShowHide.join(",")
      form.value.s6InspectShowHide = form.value.s6InspectShowHide.join(",")
      if (form.value.recordId != null) {
        updateDisinfectionPackaging2(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDisinfectionPackaging2(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除灌装包材处理记录2编号为"' + _recordIds + '"的数据项？').then(function() {
    return delDisinfectionPackaging2(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/disinfectionPackaging2/export', {
    ...queryParams.value
  }, `disinfectionPackaging2_${new Date().getTime()}.xlsx`)
}

/**
 * 查看详情（完全被动模式）
 * 调用 API 获取详情，打开查看对话框
 */
function handleView(row) {
  getDisinfectionPackaging2(row.recordId).then(res => {
    disPack2ViewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开处理对话框 */
function handleHandle(row) {
  getDisinfectionPackaging2(row.recordId).then(res => {
    disPack2HandleRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** Step5 提交处理 */
async function handleStep5Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step5 操作记录？')
    await handleStep5(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step5 提交成功')
    disPack2HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step5 提交失败')
  }
}

/** Step6 提交处理 */
async function handleStep6Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step6 操作记录？')
    await handleStep6(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step6 提交成功')
    disPack2HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step6 提交失败')
  }
}

/** 打开复核对话框 */
function handleReview(row) {
  getDisinfectionPackaging2(row.recordId).then(res => {
    disPack2ReviewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** Step5 复核处理 */
async function handleStep5Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step5？')
    await reviewStep5(recordId)
    proxy.$modal.msgSuccess('Step5 复核成功')
    disPack2ReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step5 复核失败')
  }
}

/** Step6 复核处理 */
async function handleStep6Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step6？')
    await reviewStep6(recordId)
    proxy.$modal.msgSuccess('Step6 复核成功')
    disPack2ReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step6 复核失败')
  }
}

/** 打开检查对话框 */
function handleInspect(row) {
  getDisinfectionPackaging2(row.recordId).then(res => {
    disPack2InspectRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** Step5 检查处理 */
async function handleStep5Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step5？')
    await inspectStep5(recordId)
    proxy.$modal.msgSuccess('Step5 检查成功')
    disPack2InspectRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step5 检查失败')
  }
}

/** Step6 检查处理 */
async function handleStep6Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step6？')
    await inspectStep6(recordId)
    proxy.$modal.msgSuccess('Step6 检查成功')
    disPack2InspectRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step6 检查失败')
  }
}

/** 查看工单详情 */
async function handleOrderView(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    // viewOpen.value = true
    await nextTick()
    orderViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

getList()
</script>