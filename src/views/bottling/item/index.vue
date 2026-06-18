<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['bottling:item:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:item:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:item:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="BOM主键" align="center" prop="bomId" />
      <el-table-column label="序号" align="center" prop="seqNo" />
      <el-table-column label="物料二维码" align="center" prop="qrCode" />
      <el-table-column label="物料代码" align="center" prop="materialCode" />
      <el-table-column label="名称/部件" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="spec">
        <template #default="scope">
          <dict-tag :options="pro_product_spec" :value="scope.row.spec"/>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="unit">
        <template #default="scope">
          <dict-tag :options="pro_unit" :value="scope.row.unit"/>
        </template>
      </el-table-column>
      <el-table-column label="定额数量" align="center" prop="quotaQty" />
      <el-table-column label="总计划数量" align="center" prop="totalQty" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:item:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:item:remove']">删除</el-button>
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

    <!-- 添加或修改罐包装生产物料计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="itemRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联 bottling_order_detail.detail_id" prop="detailId">
              <el-input v-model="form.detailId" placeholder="请输入关联 bottling_order_detail.detail_id" />
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
              <el-select v-model="form.spec" placeholder="请选择规格">
                <el-option
                  v-for="dict in pro_product_spec"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
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

<script setup name="Item">
import { listItem, getItem, delItem, addItem, updateItem } from "@/api/bottling/item"

const { proxy } = getCurrentInstance()
const { pro_unit, pro_product_spec } = proxy.useDict('pro_unit', 'pro_product_spec')

const itemList = ref([])
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
    materialCode: undefined,
    materialName: undefined,
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询罐包装生产物料计划列表 */
function getList() {
  loading.value = true
  listItem(queryParams.value).then(response => {
    itemList.value = response.rows
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
    detailId: null,
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
    updateTime: null
  }
  proxy.resetForm("itemRef")
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
  title.value = "添加罐包装生产物料计划"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _bomId = row.bomId || ids.value
  getItem(_bomId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改罐包装生产物料计划"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["itemRef"].validate(valid => {
    if (valid) {
      if (form.value.bomId != null) {
        updateItem(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addItem(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除罐包装生产物料计划编号为"' + _bomIds + '"的数据项？').then(function() {
    return delItem(_bomIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/item/export', {
    ...queryParams.value
  }, `item_${new Date().getTime()}.xlsx`)
}

getList()
</script>
