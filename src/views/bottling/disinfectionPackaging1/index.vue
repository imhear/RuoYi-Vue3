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
          v-hasPermi="['bottling:disinfectionPackaging1:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:disinfectionPackaging1:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:disinfectionPackaging1:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:disinfectionPackaging1:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="disinfectionPackaging1List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- <el-button link type="primary" icon="" @click="handleView(scope.row)">查看</el-button> -->
          <el-button link type="primary" icon="" @click="handleHandle(scope.row)">处理</el-button>
          <el-button link type="primary" icon="" @click="handleReview(scope.row)">复核</el-button>
          <el-button link type="primary" icon="" @click="handleInspect(scope.row)">检查</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="记录主键" align="center" prop="recordId" /> -->
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
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" /> -->
      <!-- <el-table-column label="排产单号" align="center" prop="planCode" /> -->
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

    <!-- 查看对话框组件 -->
    <BottlingDisPack1View ref="disPack1ViewRef" />
    <!-- 处理对话框 -->
    <BottlingDisPack1Handle ref="disPack1HandleRef"
      @step1Submit="handleStep1Submit"
      @step2Submit="handleStep2Submit"
      @step3Submit="handleStep3Submit"
      @step4Submit="handleStep4Submit"
      @submit="getList" />
    <!-- 复核对话框 -->
     <BottlingDisPack1Review ref="disPack1ReviewRef"
      @step1Review="handleStep1Review"
      @step2Review="handleStep2Review"
      @step3Review="handleStep3Review"
      @step4Review="handleStep4Review"
      @submit="getList" />
    <!-- <BottlingDisPack1Review ref="disPack1ReviewRef" @step1Review="handleStep1Review" @submit="getList" /> -->
    <!-- 检查对话框 -->
    <BottlingDisPack1Inspect ref="disPack1InspectRef"
      @step1Inspect="handleStep1Inspect"
      @step2Inspect="handleStep2Inspect"
      @step3Inspect="handleStep3Inspect"
      @submit="getList" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

  </div>
</template>

<script setup name="DisinfectionPackaging1">
import { listDisinfectionPackaging1, getDisinfectionPackaging1, delDisinfectionPackaging1, addDisinfectionPackaging1, updateDisinfectionPackaging1 } from "@/api/bottling/disinfectionPackaging1"
// 新增导入
import { handleStep1, handleStep2, handleStep3, handleStep4, reviewStep1, reviewStep2, reviewStep3, reviewStep4, inspectStep1, inspectStep2, inspectStep3 } from "@/api/bottling/disinfectionPackaging1"
import { getOrderDetail } from "@/api/bottling/order"

// 引入查看对话框组件
import BottlingDisPack1View from '@/views/bottling/components/BottlingDisPack1View.vue'

// 引入处理对话框组件
import BottlingDisPack1Handle from '@/views/bottling/components/BottlingDisPack1Handle.vue'

// 引入复核对话框组件
import BottlingDisPack1Review from '@/views/bottling/components/BottlingDisPack1Review.vue'

// 引入检查对话框组件
import BottlingDisPack1Inspect from '@/views/bottling/components/BottlingDisPack1Inspect.vue'

// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'

const { proxy } = getCurrentInstance()
const { sys_yes_no, disinfection_packaging_status } = proxy.useDict('sys_yes_no', 'disinfection_packaging_status')

// 查看对话框组件引用
const disPack1ViewRef = ref(null)
// 处理对话框组件引用
const disPack1HandleRef = ref(null)
// 复核对话框组件引用
const disPack1ReviewRef = ref(null)
// 检查对话框组件引用
const disPack1InspectRef = ref(null)
// 查看工单组件引用
const orderViewRef = ref(null)

const disinfectionPackaging1List = ref([])
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
    status: '0,1,2', // 默认查询（0=待开始,1=处理中,2=已完成）的记录
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    s1StepNumber: [
      { required: true, message: "步骤序号不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录1列表 */
function getList() {
  loading.value = true
  listDisinfectionPackaging1(queryParams.value).then(response => {
    disinfectionPackaging1List.value = response.rows
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
    s1StepNumber: null,
    s1StepName: null,
    s1StepNormalDisable: [],
    s1OperateShowHide: [],
    s1ReviewShowHide: [],
    s1InspectShowHide: [],
    s1StartTime: null,
    s1EndTime: null,
    s1NormalAreaTemperature: null,
    s1NormalAreaHumidity: null,
    s1CleanAreaTemperature: null,
    s1CleanAreaHumidity: null,
    s1QualifiedFlag: [],
    s1Remark: null,
    s2StepNumber: null,
    s2StepName: null,
    s2StepNormalDisable: [],
    s2OperateShowHide: [],
    s2ReviewShowHide: [],
    s2InspectShowHide: [],
    s2StartTime: null,
    s2EndTime: null,
    s2OzoneDesinfectionFlag: [],
    s2HighDesinfectionTemperatureFlag: [],
    s2OzoneGeneratorFlag: [],
    s2OzoneGeneratorNumber: null,
    s2BottleWashingMachineFlag: [],
    s2BottleWashingMachineNumber: null,
    s2BottleBlowingMachineFlag: [],
    s2BottleBlowingMachineNumber: null,
    s2AirGunFlag: [],
    s2ManualWashingFlag: null,
    s2WasherDryerComboFlag: [],
    s2WasherDryerComboNumber: null,
    s2OzoneConcentration: null,
    s2OzoneDesinfectionStartTime: null,
    s2OzoneDesinfectionEndTime: null,
    s2OzoneDesinfectionCost: null,
    s2DryingDesinfectionTemperature: null,
    s2DryingDesinfectionStartTime: null,
    s2DryingDesinfectionEndTime: null,
    s2DryingDesinfectionCost: null,
    s2HighDryingDesinfectionTemperature: null,
    s2HighDryingDesinfectionStartTime: null,
    s2HighDryingDesinfectionEndTime: null,
    s2HighDryingDesinfectionCost: null,
    s2WaiguanFlag: [],
    s2PurifiedWaterFlag: [],
    s2NoPurifiedWaterFlag: [],
    s2CleanBagFlag: [],
    s3StepNumber: null,
    s3StepName: null,
    s3StepNormalDisable: [],
    s3OperateShowHide: [],
    s3ReviewShowHide: [],
    s3InspectShowHide: [],
    s3StartTime: null,
    s3EndTime: null,
    s3OzoneDesinfectionFlag: [],
    s3AirShowerFlag: [],
    s3OzoneGeneratorFlag: [],
    s3OzoneGeneratorNumber: null,
    s3BottleWashingMachineFlag: [],
    s3BottleWashingMachineNumber: null,
    s3BottleBlowingMachineFlag: [],
    s3BottleBlowingMachineNumber: null,
    s3AirShowerMachineFlag: [],
    s3AirShowerMachineNumber: null,
    s3OzoneConcentration: null,
    s3OzoneDesinfectionStartTime: null,
    s3OzoneDesinfectionEndTime: null,
    s3OzoneDesinfectionCost: null,
    s3AlcoholDesinfectionFlag: [],
    s3UvDesinfectionFlag: [],
    s3AirShowerInnerPackagingFlag: [],
    s3WaiguanFlag: [],
    s3CleanBagFlag: [],
    s4StepNumber: null,
    s4StepName: null,
    s4StepNormalDisable: [],
    s4OperateShowHide: [],
    s4ReviewShowHide: [],
    s4InspectShowHide: [],
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("disinfectionPackaging1Ref")
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
  title.value = "添加灌装包材处理记录1"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getDisinfectionPackaging1(_recordId).then(response => {
    form.value = response.data
    form.value.s1StepNormalDisable = form.value.s1StepNormalDisable.split(",")
    form.value.s1OperateShowHide = form.value.s1OperateShowHide.split(",")
    form.value.s1ReviewShowHide = form.value.s1ReviewShowHide.split(",")
    form.value.s1InspectShowHide = form.value.s1InspectShowHide.split(",")
    form.value.s1QualifiedFlag = form.value.s1QualifiedFlag.split(",")
    form.value.s2StepNormalDisable = form.value.s2StepNormalDisable.split(",")
    form.value.s2OperateShowHide = form.value.s2OperateShowHide.split(",")
    form.value.s2ReviewShowHide = form.value.s2ReviewShowHide.split(",")
    form.value.s2InspectShowHide = form.value.s2InspectShowHide.split(",")
    form.value.s2OzoneDesinfectionFlag = form.value.s2OzoneDesinfectionFlag.split(",")
    form.value.s2HighDesinfectionTemperatureFlag = form.value.s2HighDesinfectionTemperatureFlag.split(",")
    form.value.s2OzoneGeneratorFlag = form.value.s2OzoneGeneratorFlag.split(",")
    form.value.s2BottleWashingMachineFlag = form.value.s2BottleWashingMachineFlag.split(",")
    form.value.s2BottleBlowingMachineFlag = form.value.s2BottleBlowingMachineFlag.split(",")
    form.value.s2AirGunFlag = form.value.s2AirGunFlag.split(",")
    form.value.s2WasherDryerComboFlag = form.value.s2WasherDryerComboFlag.split(",")
    form.value.s2WaiguanFlag = form.value.s2WaiguanFlag.split(",")
    form.value.s2PurifiedWaterFlag = form.value.s2PurifiedWaterFlag.split(",")
    form.value.s2NoPurifiedWaterFlag = form.value.s2NoPurifiedWaterFlag.split(",")
    form.value.s2CleanBagFlag = form.value.s2CleanBagFlag.split(",")
    form.value.s3StepNormalDisable = form.value.s3StepNormalDisable.split(",")
    form.value.s3OperateShowHide = form.value.s3OperateShowHide.split(",")
    form.value.s3ReviewShowHide = form.value.s3ReviewShowHide.split(",")
    form.value.s3InspectShowHide = form.value.s3InspectShowHide.split(",")
    form.value.s3OzoneDesinfectionFlag = form.value.s3OzoneDesinfectionFlag.split(",")
    form.value.s3AirShowerFlag = form.value.s3AirShowerFlag.split(",")
    form.value.s3OzoneGeneratorFlag = form.value.s3OzoneGeneratorFlag.split(",")
    form.value.s3BottleWashingMachineFlag = form.value.s3BottleWashingMachineFlag.split(",")
    form.value.s3BottleBlowingMachineFlag = form.value.s3BottleBlowingMachineFlag.split(",")
    form.value.s3AirShowerMachineFlag = form.value.s3AirShowerMachineFlag.split(",")
    form.value.s3AlcoholDesinfectionFlag = form.value.s3AlcoholDesinfectionFlag.split(",")
    form.value.s3UvDesinfectionFlag = form.value.s3UvDesinfectionFlag.split(",")
    form.value.s3AirShowerInnerPackagingFlag = form.value.s3AirShowerInnerPackagingFlag.split(",")
    form.value.s3WaiguanFlag = form.value.s3WaiguanFlag.split(",")
    form.value.s3CleanBagFlag = form.value.s3CleanBagFlag.split(",")
    form.value.s4StepNormalDisable = form.value.s4StepNormalDisable.split(",")
    form.value.s4OperateShowHide = form.value.s4OperateShowHide.split(",")
    form.value.s4ReviewShowHide = form.value.s4ReviewShowHide.split(",")
    form.value.s4InspectShowHide = form.value.s4InspectShowHide.split(",")
    open.value = true
    title.value = "修改灌装包材处理记录1"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["disinfectionPackaging1Ref"].validate(valid => {
    if (valid) {
      form.value.s1StepNormalDisable = form.value.s1StepNormalDisable.join(",")
      form.value.s1OperateShowHide = form.value.s1OperateShowHide.join(",")
      form.value.s1ReviewShowHide = form.value.s1ReviewShowHide.join(",")
      form.value.s1InspectShowHide = form.value.s1InspectShowHide.join(",")
      form.value.s1QualifiedFlag = form.value.s1QualifiedFlag.join(",")
      form.value.s2StepNormalDisable = form.value.s2StepNormalDisable.join(",")
      form.value.s2OperateShowHide = form.value.s2OperateShowHide.join(",")
      form.value.s2ReviewShowHide = form.value.s2ReviewShowHide.join(",")
      form.value.s2InspectShowHide = form.value.s2InspectShowHide.join(",")
      form.value.s2OzoneDesinfectionFlag = form.value.s2OzoneDesinfectionFlag.join(",")
      form.value.s2HighDesinfectionTemperatureFlag = form.value.s2HighDesinfectionTemperatureFlag.join(",")
      form.value.s2OzoneGeneratorFlag = form.value.s2OzoneGeneratorFlag.join(",")
      form.value.s2BottleWashingMachineFlag = form.value.s2BottleWashingMachineFlag.join(",")
      form.value.s2BottleBlowingMachineFlag = form.value.s2BottleBlowingMachineFlag.join(",")
      form.value.s2AirGunFlag = form.value.s2AirGunFlag.join(",")
      form.value.s2WasherDryerComboFlag = form.value.s2WasherDryerComboFlag.join(",")
      form.value.s2WaiguanFlag = form.value.s2WaiguanFlag.join(",")
      form.value.s2PurifiedWaterFlag = form.value.s2PurifiedWaterFlag.join(",")
      form.value.s2NoPurifiedWaterFlag = form.value.s2NoPurifiedWaterFlag.join(",")
      form.value.s2CleanBagFlag = form.value.s2CleanBagFlag.join(",")
      form.value.s3StepNormalDisable = form.value.s3StepNormalDisable.join(",")
      form.value.s3OperateShowHide = form.value.s3OperateShowHide.join(",")
      form.value.s3ReviewShowHide = form.value.s3ReviewShowHide.join(",")
      form.value.s3InspectShowHide = form.value.s3InspectShowHide.join(",")
      form.value.s3OzoneDesinfectionFlag = form.value.s3OzoneDesinfectionFlag.join(",")
      form.value.s3AirShowerFlag = form.value.s3AirShowerFlag.join(",")
      form.value.s3OzoneGeneratorFlag = form.value.s3OzoneGeneratorFlag.join(",")
      form.value.s3BottleWashingMachineFlag = form.value.s3BottleWashingMachineFlag.join(",")
      form.value.s3BottleBlowingMachineFlag = form.value.s3BottleBlowingMachineFlag.join(",")
      form.value.s3AirShowerMachineFlag = form.value.s3AirShowerMachineFlag.join(",")
      form.value.s3AlcoholDesinfectionFlag = form.value.s3AlcoholDesinfectionFlag.join(",")
      form.value.s3UvDesinfectionFlag = form.value.s3UvDesinfectionFlag.join(",")
      form.value.s3AirShowerInnerPackagingFlag = form.value.s3AirShowerInnerPackagingFlag.join(",")
      form.value.s3WaiguanFlag = form.value.s3WaiguanFlag.join(",")
      form.value.s3CleanBagFlag = form.value.s3CleanBagFlag.join(",")
      form.value.s4StepNormalDisable = form.value.s4StepNormalDisable.join(",")
      form.value.s4OperateShowHide = form.value.s4OperateShowHide.join(",")
      form.value.s4ReviewShowHide = form.value.s4ReviewShowHide.join(",")
      form.value.s4InspectShowHide = form.value.s4InspectShowHide.join(",")
      if (form.value.recordId != null) {
        updateDisinfectionPackaging1(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDisinfectionPackaging1(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除灌装包材处理记录1编号为"' + _recordIds + '"的数据项？').then(function() {
    return delDisinfectionPackaging1(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/disinfectionPackaging1/export', {
    ...queryParams.value
  }, `disinfectionPackaging1_${new Date().getTime()}.xlsx`)
}

/** 查看详情 */
function handleView(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1ViewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开处理对话框 */
function handleHandle(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1HandleRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开复核对话框 */
function handleReview(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1ReviewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开检查对话框 */
function handleInspect(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1InspectRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** Step1 提交处理 */
async function handleStep1Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step1 操作记录？')
    await handleStep1(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step1 提交成功')
    disPack1HandleRef.value?.close()  // 关闭处理对话框
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 提交失败')
  }
}

/** Step2 提交处理 */
async function handleStep2Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step2 操作记录？')
    await handleStep2(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step2 提交成功')
    disPack1HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step2 提交失败')
  }
}

/** Step3 提交处理 */
async function handleStep3Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step3 操作记录？')
    await handleStep3(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step3 提交成功')
    disPack1HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 提交失败')
  }
}

/** Step4 提交处理 */
async function handleStep4Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step4 操作记录？')
    await handleStep4(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step4 提交成功')
    disPack1HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step4 提交失败')
  }
}

/** Step1 复核处理 */
async function handleStep1Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step1？')
    await reviewStep1(recordId)
    proxy.$modal.msgSuccess('Step1 复核成功')
    disPack1ReviewRef.value?.close()  // 关闭复核对话框
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
    disPack1ReviewRef.value?.close()  // 关闭复核对话框
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 复核失败')
  }
}

/** Step3 复核处理 */
async function handleStep3Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step3？')
    await reviewStep3(recordId)
    proxy.$modal.msgSuccess('Step3 复核成功')
    disPack1ReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 复核失败')
  }
}

/** Step4 复核处理 */
async function handleStep4Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step4？')
    await reviewStep4(recordId)
    proxy.$modal.msgSuccess('Step4 复核成功')
    disPack1ReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step4 复核失败')
  }
}

/** Step1 检查处理 */
async function handleStep1Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step1？')
    await inspectStep1(recordId)
    proxy.$modal.msgSuccess('Step1 检查成功')
    disPack1InspectRef.value?.close()  // 关闭检查对话框
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
    disPack1InspectRef.value?.close()
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
    disPack1InspectRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 检查失败')
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
