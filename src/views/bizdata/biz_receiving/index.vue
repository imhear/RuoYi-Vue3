<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="车间" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入车间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领料日期" prop="receiveDate">
        <el-date-picker clearable
          v-model="queryParams.receiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择领料日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="领料人" prop="receiveBy">
        <el-input
          v-model="queryParams.receiveBy"
          placeholder="请输入领料人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发料日期" prop="deliveryDate">
        <el-date-picker clearable
          v-model="queryParams.deliveryDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发料日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发料人" prop="deliveryBy">
        <el-input
          v-model="queryParams.deliveryBy"
          placeholder="请输入发料人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单版本号" prop="versionCode">
        <el-input
          v-model="queryParams.versionCode"
          placeholder="请输入表单版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="填报实例ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入填报实例ID"
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
          v-hasPermi="['bizdata:biz_receiving:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bizdata:biz_receiving:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bizdata:biz_receiving:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bizdata:biz_receiving:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="biz_receivingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="领料单主键" align="center" prop="receivingId" />
      <el-table-column label="关联工单ID" align="center" prop="orderId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="车间" align="center" prop="workshop" />
      <el-table-column label="物料类别" align="center" prop="materialType" />
      <el-table-column label="领料日期" align="center" prop="receiveDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.receiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领料人" align="center" prop="receiveBy" />
      <el-table-column label="发料日期" align="center" prop="deliveryDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发料人" align="center" prop="deliveryBy" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="表单版本号" align="center" prop="versionCode" />
      <el-table-column label="填报实例ID" align="center" prop="instanceId" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['bizdata:biz_receiving:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bizdata:biz_receiving:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bizdata:biz_receiving:remove']">删除</el-button>
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

    <!-- 领料单详情抽屉 -->
    <biz_receiving-view-drawer ref="biz_receivingViewRef" />
    <!-- 添加或修改领料单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="biz_receivingRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
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
            <el-form-item label="车间" prop="workshop">
              <el-input v-model="form.workshop" placeholder="请输入车间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="领料日期" prop="receiveDate">
              <el-date-picker clearable
                v-model="form.receiveDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择领料日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="领料人" prop="receiveBy">
              <el-input v-model="form.receiveBy" placeholder="请输入领料人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发料日期" prop="deliveryDate">
              <el-date-picker clearable
                v-model="form.deliveryDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择发料日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发料人" prop="deliveryBy">
              <el-input v-model="form.deliveryBy" placeholder="请输入发料人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表单版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入表单版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="填报实例ID" prop="instanceId">
              <el-input v-model="form.instanceId" placeholder="请输入填报实例ID" />
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

<script setup name="Biz_receiving">
import { listBiz_receiving, getBiz_receiving, delBiz_receiving, addBiz_receiving, updateBiz_receiving } from "@/api/bizdata/biz_receiving"
import Biz_receivingViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const biz_receivingList = ref([])
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
    orderId: undefined,
    orderNum: undefined,
    workshop: undefined,
    materialType: undefined,
    receiveDate: undefined,
    receiveBy: undefined,
    deliveryDate: undefined,
    deliveryBy: undefined,
    versionCode: undefined,
    instanceId: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询领料单列表 */
function getList() {
  loading.value = true
  listBiz_receiving(queryParams.value).then(response => {
    biz_receivingList.value = response.rows
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
    receivingId: null,
    orderId: null,
    orderNum: null,
    workshop: null,
    materialType: null,
    receiveDate: null,
    receiveBy: null,
    deliveryDate: null,
    deliveryBy: null,
    remark: null,
    versionCode: null,
    instanceId: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("biz_receivingRef")
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
  ids.value = selection.map(item => item.receivingId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加领料单"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _receivingId = row.receivingId || ids.value
  getBiz_receiving(_receivingId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改领料单"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["biz_receivingRef"].validate(valid => {
    if (valid) {
      if (form.value.receivingId != null) {
        updateBiz_receiving(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBiz_receiving(form.value).then(() => {
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
  const _receivingIds = row.receivingId || ids.value
  proxy.$modal.confirm('是否确认删除领料单编号为"' + _receivingIds + '"的数据项？').then(function() {
    return delBiz_receiving(_receivingIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["biz_receivingViewRef"].open(row.receivingId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bizdata/biz_receiving/export', {
    ...queryParams.value
  }, `biz_receiving_${new Date().getTime()}.xlsx`)
}

getList()
</script>
