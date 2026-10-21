<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单号" prop="orderNum">
        <el-input v-model="queryParams.orderNum" placeholder="请输入工单号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-input v-model="queryParams.workshop" placeholder="请输入车间" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="清场日期" prop="cleaningDate">
        <el-date-picker clearable v-model="queryParams.cleaningDate" type="date"
          value-format="YYYY-MM-DD" placeholder="请选择清场日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['bizdata:biz_cleaning:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['bizdata:biz_cleaning:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['bizdata:biz_cleaning:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['bizdata:biz_cleaning:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bizCleaningList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="清场记录主键" align="center" prop="cleaningId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="车间" align="center" prop="workshop" />
      <el-table-column label="清场日期" align="center" prop="cleaningDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.cleaningDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单版本号" align="center" prop="versionCode" />
      <el-table-column label="填报实例ID" align="center" prop="instanceId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['bizdata:biz_cleaning:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['bizdata:biz_cleaning:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total"
      v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改清场记录对话框（仅开发排查用） -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="bizCleaningRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
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
            <el-form-item label="清场日期" prop="cleaningDate">
              <el-date-picker clearable v-model="form.cleaningDate" type="date"
                value-format="YYYY-MM-DD" placeholder="请选择清场日期" />
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

<script setup name="BizCleaning">
import {
  listBizCleaning, getBizCleaning, delBizCleaning,
  addBizCleaning, updateBizCleaning
} from "@/api/bizdata/biz_cleaning"

const { proxy } = getCurrentInstance()

const bizCleaningList = ref([])
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
    workshop: undefined,
    cleaningDate: undefined
  },
  rules: {}
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listBizCleaning(queryParams.value).then(response => {
    bizCleaningList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    cleaningId: null,
    orderNum: null, workshop: null, cleaningDate: null
  }
  proxy.resetForm("bizCleaningRef")
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.cleaningId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = "添加清场记录"
}

function handleUpdate(row) {
  reset()
  const _cleaningId = row.cleaningId || ids.value
  getBizCleaning(_cleaningId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改清场记录"
  })
}

function submitForm() {
  proxy.$refs["bizCleaningRef"].validate(valid => {
    if (valid) {
      if (form.value.cleaningId != null) {
        updateBizCleaning(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBizCleaning(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

function handleDelete(row) {
  const _cleaningIds = row.cleaningId || ids.value
  proxy.$modal.confirm('是否确认删除清场记录编号为"' + _cleaningIds + '"的数据项？').then(function() {
    return delBizCleaning(_cleaningIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

function handleExport() {
  proxy.download('bizdata/biz_cleaning/export', {
    ...queryParams.value
  }, `bizCleaning_${new Date().getTime()}.xlsx`)
}

getList()
</script>