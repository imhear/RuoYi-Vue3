<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联发布明细ID" prop="releaseDetailId">
        <el-input
          v-model="queryParams.releaseDetailId"
          placeholder="请输入关联发布明细ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联排产计划ID" prop="planId">
        <el-input
          v-model="queryParams.planId"
          placeholder="请输入关联排产计划ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实例日期" prop="instanceDate">
        <el-date-picker clearable
          v-model="queryParams.instanceDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择实例日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="表单实例序号" prop="instanceSeq">
        <el-input
          v-model="queryParams.instanceSeq"
          placeholder="请输入表单实例序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务记录ID" prop="businessRecordId">
        <el-input
          v-model="queryParams.businessRecordId"
          placeholder="请输入业务记录ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入方案名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物理表名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入物理表名"
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
          v-hasPermi="['fill:instance:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:instance:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:instance:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:instance:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="instanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="实例主键" align="center" prop="instanceId" />
      <el-table-column label="关联发布明细ID" align="center" prop="releaseDetailId" />
      <el-table-column label="关联排产计划ID" align="center" prop="planId" />
      <el-table-column label="实例日期" align="center" prop="instanceDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.instanceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单实例序号" align="center" prop="instanceSeq" />
      <el-table-column label="实例生成状态" align="center" prop="instanceStatus" />
      <el-table-column label="填报流程控制状态" align="center" prop="instanceControlStatus" />
      <el-table-column label="业务记录ID" align="center" prop="businessRecordId" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="分组类型" align="center" prop="groupType" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="自定义参数" align="center" prop="customParams" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:instance:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:instance:remove']">删除</el-button>
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

    <!-- 添加或修改填报实例运行态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="instanceRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联发布明细ID" prop="releaseDetailId">
              <el-input v-model="form.releaseDetailId" placeholder="请输入关联发布明细ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联排产计划ID" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实例日期" prop="instanceDate">
              <el-date-picker clearable
                v-model="form.instanceDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择实例日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表单实例序号" prop="instanceSeq">
              <el-input v-model="form.instanceSeq" placeholder="请输入表单实例序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务记录ID" prop="businessRecordId">
              <el-input v-model="form.businessRecordId" placeholder="请输入业务记录ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案名称" prop="schemeName">
              <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入物理表名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义参数" prop="customParams">
              <el-input v-model="form.customParams" type="textarea" placeholder="请输入内容" />
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

<script setup name="Instance">
import { listInstance, getInstance, delInstance, addInstance, updateInstance } from "@/api/fill/instance"

const { proxy } = getCurrentInstance()

const instanceList = ref([])
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
    releaseDetailId: undefined,
    planId: undefined,
    instanceDate: undefined,
    instanceSeq: undefined,
    instanceStatus: undefined,
    instanceControlStatus: undefined,
    businessRecordId: undefined,
    schemeName: undefined,
    groupType: undefined,
    tableName: undefined,
    customParams: undefined,
    status: undefined,
  },
  rules: {
    releaseDetailId: [
      { required: true, message: "关联发布明细ID不能为空", trigger: "blur" }
    ],
    planId: [
      { required: true, message: "关联排产计划ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报实例运行态列表 */
function getList() {
  loading.value = true
  listInstance(queryParams.value).then(response => {
    instanceList.value = response.rows
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
    instanceId: null,
    releaseDetailId: null,
    planId: null,
    instanceDate: null,
    instanceSeq: null,
    instanceStatus: null,
    instanceControlStatus: null,
    businessRecordId: null,
    schemeName: null,
    groupType: null,
    tableName: null,
    customParams: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("instanceRef")
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
  ids.value = selection.map(item => item.instanceId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报实例运行态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _instanceId = row.instanceId || ids.value
  getInstance(_instanceId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报实例运行态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["instanceRef"].validate(valid => {
    if (valid) {
      if (form.value.instanceId != null) {
        updateInstance(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addInstance(form.value).then(() => {
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
  const _instanceIds = row.instanceId || ids.value
  proxy.$modal.confirm('是否确认删除填报实例运行态编号为"' + _instanceIds + '"的数据项？').then(function() {
    return delInstance(_instanceIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/instance/export', {
    ...queryParams.value
  }, `instance_${new Date().getTime()}.xlsx`)
}

getList()
</script>
