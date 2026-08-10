<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联实例ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入关联实例ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作名称" prop="operatorName">
        <el-input
          v-model="queryParams.operatorName"
          placeholder="请输入操作名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="operatorTime">
        <el-date-picker clearable
          v-model="queryParams.operatorTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择操作时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入显示顺序"
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
          v-hasPermi="['fill:fillinstanceoperator:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:fillinstanceoperator:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:fillinstanceoperator:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:fillinstanceoperator:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillinstanceoperatorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="实例操作人主键" align="center" prop="instanceOperatorId" />
      <el-table-column label="关联实例ID" align="center" prop="instanceId" />
      <el-table-column label="操作类型" align="center" prop="operatorType" />
      <el-table-column label="操作名称" align="center" prop="operatorName" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作时间" align="center" prop="operatorTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operatorTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:fillinstanceoperator:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:fillinstanceoperator:remove']">删除</el-button>
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

    <!-- 添加或修改填报实例操作人（运行态，记录操作人和操作时间）对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillinstanceoperatorRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联实例ID" prop="instanceId">
              <el-input v-model="form.instanceId" placeholder="请输入关联实例ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作名称" prop="operatorName">
              <el-input v-model="form.operatorName" placeholder="请输入操作名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间" prop="operatorTime">
              <el-date-picker clearable
                v-model="form.operatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择操作时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
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

<script setup name="Fillinstanceoperator">
import { listFillinstanceoperator, getFillinstanceoperator, delFillinstanceoperator, addFillinstanceoperator, updateFillinstanceoperator } from "@/api/fill/fillinstanceoperator"

const { proxy } = getCurrentInstance()

const fillinstanceoperatorList = ref([])
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
    instanceId: undefined,
    operatorType: undefined,
    operatorName: undefined,
    operator: undefined,
    operatorTime: undefined,
    orderNum: undefined,
  },
  rules: {
    instanceId: [
      { required: true, message: "关联实例ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报实例操作人（运行态，记录操作人和操作时间）列表 */
function getList() {
  loading.value = true
  listFillinstanceoperator(queryParams.value).then(response => {
    fillinstanceoperatorList.value = response.rows
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
    instanceOperatorId: null,
    instanceId: null,
    operatorType: null,
    operatorName: null,
    operator: null,
    operatorTime: null,
    orderNum: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillinstanceoperatorRef")
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
  ids.value = selection.map(item => item.instanceOperatorId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报实例操作人（运行态，记录操作人和操作时间）"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _instanceOperatorId = row.instanceOperatorId || ids.value
  getFillinstanceoperator(_instanceOperatorId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报实例操作人（运行态，记录操作人和操作时间）"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillinstanceoperatorRef"].validate(valid => {
    if (valid) {
      if (form.value.instanceOperatorId != null) {
        updateFillinstanceoperator(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFillinstanceoperator(form.value).then(() => {
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
  const _instanceOperatorIds = row.instanceOperatorId || ids.value
  proxy.$modal.confirm('是否确认删除填报实例操作人（运行态，记录操作人和操作时间）编号为"' + _instanceOperatorIds + '"的数据项？').then(function() {
    return delFillinstanceoperator(_instanceOperatorIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/fillinstanceoperator/export', {
    ...queryParams.value
  }, `fillinstanceoperator_${new Date().getTime()}.xlsx`)
}

getList()
</script>
