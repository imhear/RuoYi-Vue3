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

    <el-row :gutter="10" class="mb8">
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
    </el-row>

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

    <!-- 添加或修改灌装包材处理记录2对话框，为代码生成功能生成代码，实际上不会用，等后面统一清理 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="disinfectionPackaging2Ref" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联排产计划" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in disinfection_packaging_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排产单号" prop="planCode">
              <el-input v-model="form.planCode" placeholder="请输入排产单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品批号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="请输入产品批号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable
                v-model="form.startTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable
                v-model="form.endTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理日期" prop="processDate">
              <el-date-picker clearable
                v-model="form.processDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择处理日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人" prop="reviewer">
              <el-input v-model="form.reviewer" placeholder="请输入复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人" prop="inspector">
              <el-input v-model="form.inspector" placeholder="请输入检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤序号" prop="s5StepNumber">
              <el-input v-model="form.s5StepNumber" placeholder="请输入步骤序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤名称" prop="s5StepName">
              <el-input v-model="form.s5StepName" placeholder="请输入步骤名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s5操作人" prop="s5Operator">
              <el-input v-model="form.s5Operator" placeholder="请输入s5操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s5复核人" prop="s5Reviewer">
              <el-input v-model="form.s5Reviewer" placeholder="请输入s5复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s5检查人" prop="s5Inspector">
              <el-input v-model="form.s5Inspector" placeholder="请输入s5检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s5操作人提交时间" prop="s5OperatorTime">
              <el-date-picker clearable
                v-model="form.s5OperatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s5操作人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s5复核人提交时间" prop="s5ReviewerTime">
              <el-date-picker clearable
                v-model="form.s5ReviewerTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s5复核人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s5检查人提交时间" prop="s5InspectorTime">
              <el-date-picker clearable
                v-model="form.s5InspectorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s5检查人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="s5StartTime">
              <el-date-picker clearable
                v-model="form.s5StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="s5EndTime">
              <el-date-picker clearable
                v-model="form.s5EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料1名称" prop="s5MaterialName1">
              <el-select v-model="form.s5MaterialName1" placeholder="请选择物料1名称">
                <el-option
                  v-for="dict in receiving_material"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料2名称" prop="s5MaterialName2">
              <el-select v-model="form.s5MaterialName2" placeholder="请选择物料2名称">
                <el-option
                  v-for="dict in receiving_material"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料3名称" prop="s5MaterialName3">
              <el-select v-model="form.s5MaterialName3" placeholder="请选择物料3名称">
                <el-option
                  v-for="dict in receiving_material"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料1储存/周转数量" prop="s5MaterialQty1">
              <el-input v-model="form.s5MaterialQty1" placeholder="请输入物料1储存/周转数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料2储存/周转数量" prop="s5MaterialQty2">
              <el-input v-model="form.s5MaterialQty2" placeholder="请输入物料2储存/周转数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料3储存/周转数量" prop="s5MaterialQty3">
              <el-input v-model="form.s5MaterialQty3" placeholder="请输入物料3储存/周转数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤序号" prop="s6StepNumber">
              <el-input v-model="form.s6StepNumber" placeholder="请输入步骤序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤名称" prop="s6StepName">
              <el-input v-model="form.s6StepName" placeholder="请输入步骤名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s6操作人" prop="s6Operator">
              <el-input v-model="form.s6Operator" placeholder="请输入s6操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s6复核人" prop="s6Reviewer">
              <el-input v-model="form.s6Reviewer" placeholder="请输入s6复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s6检查人" prop="s6Inspector">
              <el-input v-model="form.s6Inspector" placeholder="请输入s6检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s6操作人提交时间" prop="s6OperatorTime">
              <el-date-picker clearable
                v-model="form.s6OperatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s6操作人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s6复核人提交时间" prop="s6ReviewerTime">
              <el-date-picker clearable
                v-model="form.s6ReviewerTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s6复核人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s6检查人提交时间" prop="s6InspectorTime">
              <el-date-picker clearable
                v-model="form.s6InspectorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s6检查人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="s6StartTime">
              <el-date-picker clearable
                v-model="form.s6StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="s6EndTime">
              <el-date-picker clearable
                v-model="form.s6EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
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