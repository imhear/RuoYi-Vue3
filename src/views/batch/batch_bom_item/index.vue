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
      <el-form-item label="产品编码" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入产品编码"
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
      <el-form-item label="序号" prop="seqNo">
        <el-input
          v-model="queryParams.seqNo"
          placeholder="请输入序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料二维码" prop="qrCode">
        <el-input
          v-model="queryParams.qrCode"
          placeholder="请输入物料二维码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料代码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称/部件" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入名称/部件"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格" prop="spec">
        <el-input
          v-model="queryParams.spec"
          placeholder="请输入规格"
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
      <el-form-item label="定额数量" prop="quotaQty">
        <el-input
          v-model="queryParams.quotaQty"
          placeholder="请输入定额数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总计划数量" prop="totalQty">
        <el-input
          v-model="queryParams.totalQty"
          placeholder="请输入总计划数量"
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
          v-hasPermi="['batch:batch_bom_item:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['batch:batch_bom_item:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['batch:batch_bom_item:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['batch:batch_bom_item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batch_bom_itemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="BOM主键" align="center" prop="bomId" />
      <el-table-column label="关联工单ID" align="center" prop="orderId" />
      <el-table-column label="产品编码" align="center" prop="productCode" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="序号" align="center" prop="seqNo" />
      <el-table-column label="物料二维码" align="center" prop="qrCode" />
      <el-table-column label="物料代码" align="center" prop="materialCode" />
      <el-table-column label="名称/部件" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="定额数量" align="center" prop="quotaQty" />
      <el-table-column label="总计划数量" align="center" prop="totalQty" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['batch:batch_bom_item:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['batch:batch_bom_item:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_bom_item:remove']">删除</el-button>
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

    <!-- 物料计划详情抽屉 -->
    <batch_bom_item-view-drawer ref="batch_bom_itemViewRef" />
    <!-- 添加或修改物料计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batch_bom_itemRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联工单ID" prop="orderId">
              <el-input v-model="form.orderId" placeholder="请输入关联工单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="序号" prop="seqNo">
              <el-input v-model="form.seqNo" placeholder="请输入序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料二维码" prop="qrCode">
              <el-input v-model="form.qrCode" placeholder="请输入物料二维码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料代码" prop="materialCode">
              <el-input v-model="form.materialCode" placeholder="请输入物料代码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称/部件" prop="materialName">
              <el-input v-model="form.materialName" placeholder="请输入名称/部件" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="定额数量" prop="quotaQty">
              <el-input v-model="form.quotaQty" placeholder="请输入定额数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="总计划数量" prop="totalQty">
              <el-input v-model="form.totalQty" placeholder="请输入总计划数量" />
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

<script setup name="Batch_bom_item">
import { listBatch_bom_item, getBatch_bom_item, delBatch_bom_item, addBatch_bom_item, updateBatch_bom_item } from "@/api/batch/batch_bom_item"
import Batch_bom_itemViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const batch_bom_itemList = ref([])
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
    productCode: undefined,
    orderNum: undefined,
    seqNo: undefined,
    qrCode: undefined,
    materialCode: undefined,
    materialName: undefined,
    spec: undefined,
    unit: undefined,
    quotaQty: undefined,
    totalQty: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
    orderId: [
      { required: true, message: "关联工单ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询物料计划列表 */
function getList() {
  loading.value = true
  listBatch_bom_item(queryParams.value).then(response => {
    batch_bom_itemList.value = response.rows
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
    bomId: null,
    orderId: null,
    productCode: null,
    orderNum: null,
    seqNo: null,
    qrCode: null,
    materialCode: null,
    materialName: null,
    spec: null,
    unit: null,
    quotaQty: null,
    totalQty: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("batch_bom_itemRef")
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
  ids.value = selection.map(item => item.bomId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加物料计划"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _bomId = row.bomId || ids.value
  getBatch_bom_item(_bomId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改物料计划"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batch_bom_itemRef"].validate(valid => {
    if (valid) {
      if (form.value.bomId != null) {
        updateBatch_bom_item(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBatch_bom_item(form.value).then(() => {
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
  const _bomIds = row.bomId || ids.value
  proxy.$modal.confirm('是否确认删除物料计划编号为"' + _bomIds + '"的数据项？').then(function() {
    return delBatch_bom_item(_bomIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["batch_bom_itemViewRef"].open(row.bomId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('batch/batch_bom_item/export', {
    ...queryParams.value
  }, `batch_bom_item_${new Date().getTime()}.xlsx`)
}

getList()
</script>
