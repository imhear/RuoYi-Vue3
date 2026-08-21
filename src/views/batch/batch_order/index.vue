<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="导入主键" prop="importId">
        <el-input
          v-model="queryParams.importId"
          placeholder="请输入导入主键"
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
      <el-form-item label="编号" prop="fileTemplateCode">
        <el-input
          v-model="queryParams.fileTemplateCode"
          placeholder="请输入编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产订单号" prop="customerOrderNum">
        <el-input
          v-model="queryParams.customerOrderNum"
          placeholder="请输入生产订单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指令单说明" prop="orderDesc">
        <el-input
          v-model="queryParams.orderDesc"
          placeholder="请输入指令单说明"
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
      <el-form-item label="品牌" prop="brand">
        <el-input
          v-model="queryParams.brand"
          placeholder="请输入品牌"
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
      <el-form-item label="计划数量" prop="requireNum">
        <el-input
          v-model="queryParams.requireNum"
          placeholder="请输入计划数量"
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
      <el-form-item label="制单人" prop="preparedBy">
        <el-input
          v-model="queryParams.preparedBy"
          placeholder="请输入制单人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="制单日期" prop="preparedTime">
        <el-date-picker clearable
          v-model="queryParams.preparedTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择制单日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="批准人" prop="approvedBy">
        <el-input
          v-model="queryParams.approvedBy"
          placeholder="请输入批准人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批准日期" prop="approvedTime">
        <el-date-picker clearable
          v-model="queryParams.approvedTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择批准日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="取消工单原因" prop="cancelReason">
        <el-input
          v-model="queryParams.cancelReason"
          placeholder="请输入取消工单原因"
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
          v-hasPermi="['batch:batch_order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['batch:batch_order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['batch:batch_order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['batch:batch_order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batch_orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工单主键" align="center" prop="orderId" />
      <el-table-column label="导入主键" align="center" prop="importId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="编号" align="center" prop="fileTemplateCode" />
      <el-table-column label="指令单类别" align="center" prop="orderType" />
      <el-table-column label="生产订单号" align="center" prop="customerOrderNum" />
      <el-table-column label="指令单说明" align="center" prop="orderDesc" />
      <el-table-column label="产品编码" align="center" prop="productCode" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="规格/型号" align="center" prop="spec" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="生产批号" align="center" prop="batchNumber" />
      <el-table-column label="计划数量" align="center" prop="requireNum" />
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
      <el-table-column label="制单人" align="center" prop="preparedBy" />
      <el-table-column label="制单日期" align="center" prop="preparedTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.preparedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批准人" align="center" prop="approvedBy" />
      <el-table-column label="批准日期" align="center" prop="approvedTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.approvedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="取消工单原因" align="center" prop="cancelReason" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['batch:batch_order:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['batch:batch_order:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_order:remove']">删除</el-button>
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

    <!-- 生产指令单详情抽屉 -->
    <batch_order-view-drawer ref="batch_orderViewRef" />
    <!-- 添加或修改生产指令单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batch_orderRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="导入主键" prop="importId">
              <el-input v-model="form.importId" placeholder="请输入导入主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="编号" prop="fileTemplateCode">
              <el-input v-model="form.fileTemplateCode" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生产订单号" prop="customerOrderNum">
              <el-input v-model="form.customerOrderNum" placeholder="请输入生产订单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="指令单说明" prop="orderDesc">
              <el-input v-model="form.orderDesc" placeholder="请输入指令单说明" />
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
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格/型号" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格/型号" />
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
            <el-form-item label="计划数量" prop="requireNum">
              <el-input v-model="form.requireNum" placeholder="请输入计划数量" />
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
            <el-form-item label="制单人" prop="preparedBy">
              <el-input v-model="form.preparedBy" placeholder="请输入制单人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="制单日期" prop="preparedTime">
              <el-date-picker clearable
                v-model="form.preparedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择制单日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="批准人" prop="approvedBy">
              <el-input v-model="form.approvedBy" placeholder="请输入批准人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="批准日期" prop="approvedTime">
              <el-date-picker clearable
                v-model="form.approvedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择批准日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="取消工单原因" prop="cancelReason">
              <el-input v-model="form.cancelReason" placeholder="请输入取消工单原因" />
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

<script setup name="Batch_order">
import { listBatch_order, getBatch_order, delBatch_order, addBatch_order, updateBatch_order } from "@/api/batch/batch_order"
import Batch_orderViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const batch_orderList = ref([])
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
    importId: undefined,
    orderNum: undefined,
    fileTemplateCode: undefined,
    orderType: undefined,
    customerOrderNum: undefined,
    orderDesc: undefined,
    productCode: undefined,
    productName: undefined,
    brand: undefined,
    spec: undefined,
    unit: undefined,
    batchNumber: undefined,
    requireNum: undefined,
    planStart: undefined,
    planEnd: undefined,
    preparedBy: undefined,
    preparedTime: undefined,
    approvedBy: undefined,
    approvedTime: undefined,
    cancelReason: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询生产指令单列表 */
function getList() {
  loading.value = true
  listBatch_order(queryParams.value).then(response => {
    batch_orderList.value = response.rows
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
    orderId: null,
    importId: null,
    orderNum: null,
    fileTemplateCode: null,
    orderType: null,
    customerOrderNum: null,
    orderDesc: null,
    productCode: null,
    productName: null,
    brand: null,
    spec: null,
    unit: null,
    batchNumber: null,
    requireNum: null,
    planStart: null,
    planEnd: null,
    preparedBy: null,
    preparedTime: null,
    approvedBy: null,
    approvedTime: null,
    cancelReason: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("batch_orderRef")
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
  ids.value = selection.map(item => item.orderId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加生产指令单"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _orderId = row.orderId || ids.value
  getBatch_order(_orderId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改生产指令单"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batch_orderRef"].validate(valid => {
    if (valid) {
      if (form.value.orderId != null) {
        updateBatch_order(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBatch_order(form.value).then(() => {
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
  const _orderIds = row.orderId || ids.value
  proxy.$modal.confirm('是否确认删除生产指令单编号为"' + _orderIds + '"的数据项？').then(function() {
    return delBatch_order(_orderIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["batch_orderViewRef"].open(row.orderId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('batch/batch_order/export', {
    ...queryParams.value
  }, `batch_order_${new Date().getTime()}.xlsx`)
}

getList()
</script>
