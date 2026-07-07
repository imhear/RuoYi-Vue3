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

    <el-table v-loading="loading" :data="cleaningList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="产品批号" align="center" prop="batchNumber" />
      <el-table-column label="清场日期" align="center" prop="cleaningDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.cleaningDate, '{y}-{m}-{d}') }}</span>
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

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 查看对话框组件 -->
    <BottlingCleaningView ref="cleaningViewRef" />

    <!-- 处理对话框 -->
    <BottlingCleaningHandle ref="cleaningHandleRef"
      @cleaningSubmit="handleCleaningSubmit"
      @submit="getList" />

    <!-- 复核对话框 -->
    <BottlingCleaningReview ref="cleaningReviewRef"
      @cleaningReview="handleCleaningReview"
      @submit="getList" />

    <!-- 检查对话框 -->
    <BottlingCleaningInspect ref="cleaningInspectRef"
      @cleaningInspect="handleCleaningInspect"
      @submit="getList" />

  </div>
</template>

<script setup name="Cleaning">
import { listCleaning, getCleaning, delCleaning, addCleaning, updateCleaning } from "@/api/bottling/cleaning"
import { getOrderDetail } from "@/api/bottling/order"
// 引入处理 API
import { handleCleaning } from "@/api/bottling/cleaning"
// 引入复核 API
import { reviewCleaning } from "@/api/bottling/cleaning"
// 引入检查 API
import { inspectCleaning } from "@/api/bottling/cleaning"

// 引入查看对话框组件
import BottlingCleaningView from '@/views/bottling/components/BottlingCleaningView.vue'
// 引入处理对话框组件
import BottlingCleaningHandle from '@/views/bottling/components/BottlingCleaningHandle.vue'
// 引入复核对话框组件
import BottlingCleaningReview from '@/views/bottling/components/BottlingCleaningReview.vue'
// 引入检查对话框组件
import BottlingCleaningInspect from '@/views/bottling/components/BottlingCleaningInspect.vue'
// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'

// 查看工单组件引用
const orderViewRef = ref(null)
// 查看对话框组件引用
const cleaningViewRef = ref(null)
// 处理对话框组件引用
const cleaningHandleRef = ref(null)
// 复核对话框组件引用
const cleaningReviewRef = ref(null)
// 检查对话框组件引用
const cleaningInspectRef = ref(null)

const route = useRoute() // 获取当前路由信息

// 从 URL 查询参数 ?workshop=D 中获取车间值，若无则默认 'D'
const currentWorkshop = computed(() => route.query.workshop || 'D')

const { proxy } = getCurrentInstance()
const { sys_yes_no, disinfection_packaging_status } = useDict('sys_yes_no', 'disinfection_packaging_status')

const cleaningList = ref([])
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
    // workshop 不再需要，由 currentWorkshop 自动注入
    receiveDate: undefined,
    operator: undefined,
    reviewer: undefined,
    inspector: undefined,
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    planId: [
      { required: true, message: "关联排产计划不能为空", trigger: "blur" }
    ],
    workshop: [
      { required: true, message: "车间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询清场记录列表（自动过滤当前车间） */
function getList() {
  loading.value = true
  // 注入当前车间参数，确保只查询本车间数据
  listCleaning({
    ...queryParams.value,
    workshop: currentWorkshop.value
  }).then(response => {
    cleaningList.value = response.rows
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
    cleaningId: null,
    orderId: null,
    planId: null,
    status: null,
    orderNum: null,
    planCode: null,
    productName: null,
    spec: null,
    batchNumber: null,
    workshop: null,
    cleaningDate: null,
    operateShowHide: null,
    reviewShowHide: null,
    inspectShowHide: null,
    operator: null,
    reviewer: null,
    inspector: null,
    operatorTime: null,
    reviewerTime: null,
    inspectorTime: null,
    statusLabelReplaceFlag: [],
    materialRemoveProductFlag: [],
    materialRemoveResidualFlag: [],
    materialRemoveBatchResidueFlag: [],
    siteCleanFloorFlag: [],
    siteCleanStructureFlag: [],
    equipCleanDustOilFlag: [],
    equipCleanOriginalColorFlag: [],
    toolCleanDustDirtFlag: [],
    facilityCleanDustDirtFlag: [],
    facilityCleanArrangementFlag: [],
    otherCleanStatusFlag: [],
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("cleaningRef")
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
  ids.value = selection.map(item => item.cleaningId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加清场记录"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _cleaningId = row.cleaningId || ids.value
  getCleaning(_cleaningId).then(response => {
    form.value = response.data
    form.value.statusLabelReplaceFlag = form.value.statusLabelReplaceFlag.split(",")
    form.value.materialRemoveProductFlag = form.value.materialRemoveProductFlag.split(",")
    form.value.materialRemoveResidualFlag = form.value.materialRemoveResidualFlag.split(",")
    form.value.materialRemoveBatchResidueFlag = form.value.materialRemoveBatchResidueFlag.split(",")
    form.value.siteCleanFloorFlag = form.value.siteCleanFloorFlag.split(",")
    form.value.siteCleanStructureFlag = form.value.siteCleanStructureFlag.split(",")
    form.value.equipCleanDustOilFlag = form.value.equipCleanDustOilFlag.split(",")
    form.value.equipCleanOriginalColorFlag = form.value.equipCleanOriginalColorFlag.split(",")
    form.value.toolCleanDustDirtFlag = form.value.toolCleanDustDirtFlag.split(",")
    form.value.facilityCleanDustDirtFlag = form.value.facilityCleanDustDirtFlag.split(",")
    form.value.facilityCleanArrangementFlag = form.value.facilityCleanArrangementFlag.split(",")
    form.value.otherCleanStatusFlag = form.value.otherCleanStatusFlag.split(",")
    open.value = true
    title.value = "修改清场记录"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cleaningRef"].validate(valid => {
    if (valid) {
      form.value.statusLabelReplaceFlag = form.value.statusLabelReplaceFlag.join(",")
      form.value.materialRemoveProductFlag = form.value.materialRemoveProductFlag.join(",")
      form.value.materialRemoveResidualFlag = form.value.materialRemoveResidualFlag.join(",")
      form.value.materialRemoveBatchResidueFlag = form.value.materialRemoveBatchResidueFlag.join(",")
      form.value.siteCleanFloorFlag = form.value.siteCleanFloorFlag.join(",")
      form.value.siteCleanStructureFlag = form.value.siteCleanStructureFlag.join(",")
      form.value.equipCleanDustOilFlag = form.value.equipCleanDustOilFlag.join(",")
      form.value.equipCleanOriginalColorFlag = form.value.equipCleanOriginalColorFlag.join(",")
      form.value.toolCleanDustDirtFlag = form.value.toolCleanDustDirtFlag.join(",")
      form.value.facilityCleanDustDirtFlag = form.value.facilityCleanDustDirtFlag.join(",")
      form.value.facilityCleanArrangementFlag = form.value.facilityCleanArrangementFlag.join(",")
      form.value.otherCleanStatusFlag = form.value.otherCleanStatusFlag.join(",")
      if (form.value.cleaningId != null) {
        updateCleaning(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCleaning(form.value).then(() => {
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
  const _cleaningIds = row.cleaningId || ids.value
  proxy.$modal.confirm('是否确认删除清场记录编号为"' + _cleaningIds + '"的数据项？').then(function() {
    return delCleaning(_cleaningIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/cleaning/export', {
    ...queryParams.value
  }, `cleaning_${new Date().getTime()}.xlsx`)
}

/**
 * 查看详情（完全被动模式）
 * 调用 API 获取详情，打开查看对话框
 */
function handleView(row) {
  getCleaning(row.cleaningId).then(res => {
    cleaningViewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开处理对话框 */
function handleHandle(row) {
  getCleaning(row.cleaningId).then(res => {
    cleaningHandleRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/**
 * 处理提交（完全被动模式）
 * 父组件二次确认后调 API
 */
async function handleCleaningSubmit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交清场处理记录？')
    await handleCleaning(formData.cleaningId, formData)
    proxy.$modal.msgSuccess('清场处理提交成功')
    cleaningHandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('清场处理提交失败')
  }
}

/** 打开复核对话框 */
function handleReview(row) {
  getCleaning(row.cleaningId).then(res => {
    cleaningReviewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/**
 * 复核提交（完全被动模式）
 * 父组件二次确认后调 API
 */
async function handleCleaningReview({ cleaningId }) {
  try {
    await proxy.$modal.confirm('是否确认复核清场记录？')
    await reviewCleaning(cleaningId)
    proxy.$modal.msgSuccess('清场复核成功')
    cleaningReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('清场复核失败')
  }
}

/** 打开检查对话框 */
function handleInspect(row) {
  getCleaning(row.cleaningId).then(res => {
    cleaningInspectRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/**
 * 检查提交（完全被动模式）
 * 父组件二次确认后调 API
 */
async function handleCleaningInspect({ cleaningId }) {
  try {
    await proxy.$modal.confirm('是否确认检查清场记录？')
    await inspectCleaning(cleaningId)
    proxy.$modal.msgSuccess('清场检查成功')
    cleaningInspectRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('清场检查失败')
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
