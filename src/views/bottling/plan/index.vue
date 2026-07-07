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
      <el-form-item label="产品编码" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="生产批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入生产批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划开始" prop="planStart">
        <el-date-picker clearable
          v-model="queryParams.planStart"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划开始">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划结束" prop="planEnd">
        <el-date-picker clearable
          v-model="queryParams.planEnd"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划结束">
        </el-date-picker>
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
          v-hasPermi="['bottling:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:plan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="119">
        <template #default="scope">
          <!-- 开始：status=0 时显示 -->
          <el-button link type="primary" icon="" @click="handleStart(scope.row)" v-if="scope.row.status === '0'" v-hasPermi="['bottling:plan:start']">开始</el-button>
          <!-- 删除：status=0 时显示 -->
          <el-button link type="warning" icon="" @click="handlePlanDelete(scope.row)" v-if="scope.row.status === '0'" v-hasPermi="['bottling:plan:remove']">删除</el-button>
          <!-- 取消：status=1 时显示 -->
          <el-button link type="danger" icon="" @click="handleCancel(scope.row)" v-if="scope.row.status === '1'" v-hasPermi="['bottling:plan:cancel']">取消</el-button>
          <!-- 完成：status=1 时显示 -->
          <el-button link type="success" icon="" @click="handleFinish(scope.row)" v-if="scope.row.status === '1'" v-hasPermi="['bottling:plan:finish']">完成</el-button>
          <!-- <el-button link type="primary" icon="" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:plan:edit']">修改</el-button> -->
          <!-- <el-button link type="primary" icon="" @click="handleDelete(scope.row)" v-hasPermi="['bottling:plan:remove']">删除</el-button> -->
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="bottling_plan_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排产主键" align="center" prop="planId" /> -->
      <el-table-column label="任务单号" align="center" prop="planCode" min-width="119"/>
      <el-table-column label="产品编码" align="center" prop="productCode" min-width="119"/>
      <!-- <el-table-column label="产品名称" align="center" prop="productName"  min-width="119"/> -->
      <!-- 工单号改为超链接，点击触发查看 -->
      <el-table-column label="工单号" align="center" min-width="139">
        <template #default="scope">
          <el-button link type="primary" @click="handleOrderView(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" min-width="139"/> -->
      <el-table-column label="要求数量" align="center" prop="requireNum" />
      <el-table-column label="排产数量" align="center" prop="planQty" />
      <el-table-column label="完成数量" align="center" prop="finishQty" />
      <el-table-column label="单位" align="center" prop="unit">
        <template #default="scope">
          <dict-tag :options="pro_unit" :value="scope.row.unit"/>
        </template>
      </el-table-column>
      <el-table-column label="生产批号" align="center" prop="batchNumber" />
      <el-table-column label="计划开始" align="center" prop="planStart" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" prop="planEnd" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开始" align="center" prop="startTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际结束" align="center" prop="endTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
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

    <!-- 删除对话框 -->
    <BottlingPlanDelete ref="deleteRef" @submit="handleConfirmDelete" />
    <!-- 开始对话框 -->
    <BottlingPlanStart ref="startRef" @submit="handleConfirmStart" />
    <!-- 取消对话框 -->
    <BottlingPlanCancel ref="cancelRef" @submit="handleConfirmCancel" />
    <!-- 完成对话框 -->
    <BottlingPlanFinish ref="finishRef" @submit="handleConfirmFinish" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 添加或修改罐包装生产排产计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="排产单号" prop="planCode">
              <el-input v-model="form.planCode" placeholder="请输入排产单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联罐包装生产指令单明细主键" prop="detailId">
              <el-input v-model="form.detailId" placeholder="请输入关联罐包装生产指令单明细主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="要求数量" prop="requireNum">
              <el-input v-model="form.requireNum" placeholder="请输入要求数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排产数量" prop="planQty">
              <el-input v-model="form.planQty" placeholder="请输入排产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="完成数量" prop="finishQty">
              <el-input v-model="form.finishQty" placeholder="请输入完成数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择单位">
                <el-option
                  v-for="dict in pro_unit"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生产批号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划开始" prop="planStart">
              <el-date-picker clearable
                v-model="form.planStart"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择计划开始">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划结束" prop="planEnd">
              <el-date-picker clearable
                v-model="form.planEnd"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择计划结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实际开始" prop="startTime">
              <el-date-picker clearable
                v-model="form.startTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择实际开始">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实际结束" prop="endTime">
              <el-date-picker clearable
                v-model="form.endTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择实际结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in bottling_plan_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="Plan">
import { listPlan, getPlan, delPlan, addPlan, updatePlan, startPlan, cancelPlan, finishPlan, deletePlan  } from "@/api/bottling/plan"
// 新增导入
import { getOrderDetail } from "@/api/bottling/order"
import BottlingPlanStart from '@/views/bottling/components/BottlingPlanStart.vue'
import BottlingPlanCancel from '@/views/bottling/components/BottlingPlanCancel.vue'
import BottlingPlanFinish from '@/views/bottling/components/BottlingPlanFinish.vue'
import BottlingPlanDelete from '@/views/bottling/components/BottlingPlanDelete.vue'
// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'

const { proxy } = getCurrentInstance()
const { bottling_plan_status, pro_unit } = proxy.useDict('bottling_plan_status', 'pro_unit')

const planList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 新增组件引用
const startRef = ref(null)
const cancelRef = ref(null)
const finishRef = ref(null)
const deleteRef = ref(null)
const orderViewRef = ref(null) // 查看工单组件引用

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    productCode: undefined,
    productName: undefined,
    batchNumber: undefined,
    planStart: undefined,
    planEnd: undefined,
    // status: '0,1,2', // 默认排除已取消
    delFlag: '0',   // 默认查询未删除的任务
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

// 新增查询条件：默认查询未删除的排产计划
queryParams.delFlag = '0'

/** 查询罐包装生产排产计划列表 */
function getList() {
  loading.value = true
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows
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
    planId: null,
    planCode: null,
    detailId: null,
    orderNum: null,
    productCode: null,
    productName: null,
    requireNum: null,
    planQty: null,
    finishQty: null,
    unit: null,
    batchNumber: null,
    planStart: null,
    planEnd: null,
    startTime: null,
    endTime: null,
    status: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("planRef")
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
  ids.value = selection.map(item => item.planId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加罐包装生产排产计划"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _planId = row.planId || ids.value
  getPlan(_planId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改罐包装生产排产计划"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["planRef"].validate(valid => {
    if (valid) {
      if (form.value.planId != null) {
        updatePlan(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPlan(form.value).then(() => {
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
  const _planIds = row.planId || ids.value
  proxy.$modal.confirm('是否确认删除罐包装生产排产计划编号为"' + _planIds + '"的数据项？').then(function() {
    return delPlan(_planIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/plan/export', {
    ...queryParams.value
  }, `plan_${new Date().getTime()}.xlsx`)
}


// ========== 新增方法 ==========

/** 打开开始对话框 */
async function handleStart(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    res.data.plan = row  // 将排产计划行数据附加到详情中
    startRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 确认开始 */
function handleConfirmStart({ plan, templateCode }) {
  proxy.$modal.confirm('是否确认开始生产？').then(() => {
    return startPlan(plan.planId, { templateCode })
  }).then(() => {
    proxy.$modal.msgSuccess('开始生产成功')
    startRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 打开取消对话框 */
async function handleCancel(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    res.data.plan = row  // 将排产计划行数据附加到详情中
    cancelRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 确认取消 */
function handleConfirmCancel({ plan, reason }) {
  proxy.$modal.confirm('该操作将删除对应的批记录数据，确认取消吗？').then(() => {
    return cancelPlan(plan.planId, { cancelReason: reason })
    res.data.plan = row  // 将排产计划行数据附加到详情中
  }).then(() => {
    proxy.$modal.msgSuccess('取消成功')
    cancelRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 打开完成对话框 */
async function handleFinish(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    res.data.plan = row  // 将排产计划行数据附加到详情中
    finishRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 确认完成 */
function handleConfirmFinish({ plan, finishQty, batchNumber }) {
  proxy.$modal.confirm('该操作将无法修改对应的批记录数据，确认完成吗？').then(() => {
    return finishPlan(plan.planId, { finishQty, batchNumber })
  }).then(() => {
    proxy.$modal.msgSuccess('完成生产成功')
    finishRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 打开删除对话框 */
async function handlePlanDelete(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    res.data.plan = row  // 将排产计划行数据附加到详情中
    deleteRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 确认删除 */
function handleConfirmDelete({ plan, remark }) {
  proxy.$modal.confirm('是否确认删除任务？').then(() => {
    return deletePlan(plan.planId, { remark })
  }).then(() => {
    proxy.$modal.msgSuccess('删除成功')
    deleteRef.value?.close()
    getList()
  }).catch(() => {})
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
