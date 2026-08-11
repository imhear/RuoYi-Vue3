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
      <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="actionTime">
        <el-date-picker clearable
          v-model="queryParams.actionTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择操作时间">
        </el-date-picker>
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
          v-hasPermi="['fill:fillinstancelog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:fillinstancelog:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:fillinstancelog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:fillinstancelog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillinstancelogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志主键" align="center" prop="logId" />
      <el-table-column label="关联实例ID" align="center" prop="instanceId" />
      <el-table-column label="操作类型" align="center" prop="actionType" />
      <el-table-column label="操作类型" align="center" prop="operatorType" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作时间" align="center" prop="actionTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.actionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:fillinstancelog:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:fillinstancelog:remove']">删除</el-button>
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

    <!-- 添加或修改填报实例操作日志对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillinstancelogRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联实例ID" prop="instanceId">
              <el-input v-model="form.instanceId" placeholder="请输入关联实例ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间" prop="actionTime">
              <el-date-picker clearable
                v-model="form.actionTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择操作时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Fillinstancelog">
import { listFillinstancelog, getFillinstancelog, delFillinstancelog, addFillinstancelog, updateFillinstancelog } from "@/api/fill/fillinstancelog"

const { proxy } = getCurrentInstance()

const fillinstancelogList = ref([])
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
    actionType: undefined,
    operatorType: undefined,
    operator: undefined,
    actionTime: undefined,
  },
  rules: {
    instanceId: [
      { required: true, message: "关联实例ID不能为空", trigger: "blur" }
    ],
    actionType: [
      { required: true, message: "操作类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报实例操作日志列表 */
function getList() {
  loading.value = true
  listFillinstancelog(queryParams.value).then(response => {
    fillinstancelogList.value = response.rows
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
    logId: null,
    instanceId: null,
    actionType: null,
    operatorType: null,
    operator: null,
    actionTime: null,
    remark: null,
    createBy: null,
    createTime: null
  }
  proxy.resetForm("fillinstancelogRef")
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
  ids.value = selection.map(item => item.logId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报实例操作日志"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _logId = row.logId || ids.value
  getFillinstancelog(_logId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报实例操作日志"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillinstancelogRef"].validate(valid => {
    if (valid) {
      if (form.value.logId != null) {
        updateFillinstancelog(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFillinstancelog(form.value).then(() => {
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
  const _logIds = row.logId || ids.value
  proxy.$modal.confirm('是否确认删除填报实例操作日志编号为"' + _logIds + '"的数据项？').then(function() {
    return delFillinstancelog(_logIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/fillinstancelog/export', {
    ...queryParams.value
  }, `fillinstancelog_${new Date().getTime()}.xlsx`)
}

getList()
</script>
