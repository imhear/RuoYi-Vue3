<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="排产单号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入排产单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联工单ID" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入关联工单ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
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
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="要求数量" prop="requireNum">
        <el-input
          v-model="queryParams.requireNum"
          placeholder="请输入要求数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排产数量" prop="planQty">
        <el-input
          v-model="queryParams.planQty"
          placeholder="请输入排产数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成数量" prop="finishQty">
        <el-input
          v-model="queryParams.finishQty"
          placeholder="请输入完成数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
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
      <el-form-item label="实际开始" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择实际开始">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际结束" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择实际结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关联发布方案ID" prop="releaseId">
        <el-input
          v-model="queryParams.releaseId"
          placeholder="请输入关联发布方案ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联批记录实例集ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入关联批记录实例集ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="取消排产原因" prop="cancelReason">
        <el-input
          v-model="queryParams.cancelReason"
          placeholder="请输入取消排产原因"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="fileTemplateCode">
        <el-input
          v-model="queryParams.fileTemplateCode"
          placeholder="请输入编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格/型号" prop="spec">
        <el-input
          v-model="queryParams.spec"
          placeholder="请输入规格/型号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乐观锁版本号" prop="revision">
        <el-input
          v-model="queryParams.revision"
          placeholder="请输入乐观锁版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统版本号" prop="sysVersion">
        <el-input
          v-model="queryParams.sysVersion"
          placeholder="请输入系统版本号"
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
          v-hasPermi="['batch:batch_plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['batch:batch_plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['batch:batch_plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['batch:batch_plan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batch_planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排产计划主键" align="center" prop="planId" />
      <el-table-column label="排产单号" align="center" prop="planCode" />
      <el-table-column label="关联工单ID" align="center" prop="orderId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="产品编码" align="center" prop="productCode" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="要求数量" align="center" prop="requireNum" />
      <el-table-column label="排产数量" align="center" prop="planQty" />
      <el-table-column label="完成数量" align="center" prop="finishQty" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="生产批号" align="center" prop="batchNumber" />
      <el-table-column label="计划开始" align="center" prop="planStart" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" prop="planEnd" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开始" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际结束" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联发布方案ID" align="center" prop="releaseId" />
      <el-table-column label="关联批记录实例集ID" align="center" prop="instanceId" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="取消排产原因" align="center" prop="cancelReason" />
      <el-table-column label="编号" align="center" prop="fileTemplateCode" />
      <el-table-column label="规格/型号" align="center" prop="spec" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['batch:batch_plan:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['batch:batch_plan:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_plan:remove']">删除</el-button>
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

    <!-- 生产计划详情抽屉 -->
    <batch_plan-view-drawer ref="batch_planViewRef" />
    <!-- 添加或修改生产计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batch_planRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="排产单号" prop="planCode">
              <el-input v-model="form.planCode" placeholder="请输入排产单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联工单ID" prop="orderId">
              <el-input v-model="form.orderId" placeholder="请输入关联工单ID" />
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
              <el-input v-model="form.unit" placeholder="请输入单位" />
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
            <el-form-item label="关联发布方案ID" prop="releaseId">
              <el-input v-model="form.releaseId" placeholder="请输入关联发布方案ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联批记录实例集ID" prop="instanceId">
              <el-input v-model="form.instanceId" placeholder="请输入关联批记录实例集ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="取消排产原因" prop="cancelReason">
              <el-input v-model="form.cancelReason" placeholder="请输入取消排产原因" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="编号" prop="fileTemplateCode">
              <el-input v-model="form.fileTemplateCode" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格/型号" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格/型号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="乐观锁版本号" prop="revision">
              <el-input v-model="form.revision" placeholder="请输入乐观锁版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统版本号" prop="sysVersion">
              <el-input v-model="form.sysVersion" placeholder="请输入系统版本号" />
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

<script setup name="Batch_plan">
import { listBatch_plan, getBatch_plan, delBatch_plan, addBatch_plan, updateBatch_plan } from "@/api/batch/batch_plan"
import Batch_planViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const batch_planList = ref([])
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
    planCode: undefined,
    orderId: undefined,
    orderNum: undefined,
    productCode: undefined,
    productName: undefined,
    requireNum: undefined,
    planQty: undefined,
    finishQty: undefined,
    unit: undefined,
    batchNumber: undefined,
    planStart: undefined,
    planEnd: undefined,
    startTime: undefined,
    endTime: undefined,
    releaseId: undefined,
    instanceId: undefined,
    status: undefined,
    cancelReason: undefined,
    fileTemplateCode: undefined,
    spec: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询生产计划列表 */
function getList() {
  loading.value = true
  listBatch_plan(queryParams.value).then(response => {
    batch_planList.value = response.rows
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
    orderId: null,
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
    releaseId: null,
    instanceId: null,
    status: null,
    remark: null,
    cancelReason: null,
    fileTemplateCode: null,
    spec: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("batch_planRef")
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
  title.value = "添加生产计划"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _planId = row.planId || ids.value
  getBatch_plan(_planId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改生产计划"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batch_planRef"].validate(valid => {
    if (valid) {
      if (form.value.planId != null) {
        updateBatch_plan(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBatch_plan(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除生产计划编号为"' + _planIds + '"的数据项？').then(function() {
    return delBatch_plan(_planIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["batch_planViewRef"].open(row.planId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('batch/batch_plan/export', {
    ...queryParams.value
  }, `batch_plan_${new Date().getTime()}.xlsx`)
}

getList()
</script>
