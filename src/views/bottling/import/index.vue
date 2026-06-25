<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['bottling:import:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:import:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:import:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:import:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="importList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="导入主键" align="center" prop="importId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:import:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:import:remove']">删除</el-button>
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

    <!-- 添加或修改外部导入生产指令单对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="importRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="fileTemplateCode">
              <el-input v-model="form.fileTemplateCode" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号" prop="customerOrderNum">
              <el-input v-model="form.customerOrderNum" placeholder="请输入生产订单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令单说明" prop="orderDesc">
              <el-input v-model="form.orderDesc" placeholder="请输入指令单说明" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品/半制品编码" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入成品/半制品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产批号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格/型号" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格/型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划生产数量" prop="requireNum">
              <el-input v-model="form.requireNum" placeholder="请输入计划生产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始" prop="planStart">
              <el-date-picker clearable
                v-model="form.planStart"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择计划开始">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束" prop="planEnd">
              <el-date-picker clearable
                v-model="form.planEnd"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择计划结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制单人" prop="preparedBy">
              <el-input v-model="form.preparedBy" placeholder="请输入制单人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制单日期" prop="preparedTime">
              <el-date-picker clearable
                v-model="form.preparedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择制单日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">外部导入罐包装生产物料计划信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddImportBottlingBomItem">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteImportBottlingBomItem">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="importBottlingBomItemList" @selection-change="handleImportBottlingBomItemSelectionChange" ref="importBottlingBomItem">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" width="60">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
        </el-table>
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

<script setup name="Import">
import { listImport, getImport, delImport, addImport, updateImport } from "@/api/bottling/import"

const { proxy } = getCurrentInstance()

const importList = ref([])
const importBottlingBomItemList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const checkedImportBottlingBomItem = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询外部导入生产指令单列表 */
function getList() {
  loading.value = true
  listImport(queryParams.value).then(response => {
    importList.value = response.rows
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
    importId: null,
    orderNum: null,
    fileTemplateCode: null,
    orderType: null,
    customerOrderNum: null,
    orderDesc: null,
    productCode: null,
    brand: null,
    productName: null,
    batchNumber: null,
    spec: null,
    requireNum: null,
    unit: null,
    planStart: null,
    planEnd: null,
    preparedBy: null,
    preparedTime: null,
    delFlag: null,
    createBy: null,
    createTime: null
  }
  importBottlingBomItemList.value = []
  proxy.resetForm("importRef")
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
  ids.value = selection.map(item => item.importId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加外部导入生产指令单"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _importId = row.importId || ids.value
  getImport(_importId).then(response => {
    form.value = response.data
    importBottlingBomItemList.value = response.data.importBottlingBomItemList
    open.value = true
    title.value = "修改外部导入生产指令单"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["importRef"].validate(valid => {
    if (valid) {
      form.value.importBottlingBomItemList = importBottlingBomItemList.value
      if (form.value.importId != null) {
        updateImport(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addImport(form.value).then(() => {
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
  const _importIds = row.importId || ids.value
  proxy.$modal.confirm('是否确认删除外部导入生产指令单编号为"' + _importIds + '"的数据项？').then(function() {
    return delImport(_importIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 外部导入罐包装生产物料计划添加按钮操作 */
function handleAddImportBottlingBomItem() {
  let obj = {}
  importBottlingBomItemList.value.push(obj)
}

/** 外部导入罐包装生产物料计划删除按钮操作 */
function handleDeleteImportBottlingBomItem() {
  if (checkedImportBottlingBomItem.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的外部导入罐包装生产物料计划数据")
  } else {
    const importBottlingBomItems = importBottlingBomItemList.value
    const checkedImportBottlingBomItems = checkedImportBottlingBomItem.value
    importBottlingBomItemList.value = importBottlingBomItems.filter(function(item) {
      return checkedImportBottlingBomItems.indexOf(item.index) == -1
    })
  }
}

/** 复选框选中数据 */
function handleImportBottlingBomItemSelectionChange(selection) {
  checkedImportBottlingBomItem.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/import/export', {
    ...queryParams.value
  }, `import_${new Date().getTime()}.xlsx`)
}

getList()
</script>
