<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联批记录ID" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入关联批记录ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联批记录按钮节点ID" prop="menuId">
        <el-input
          v-model="queryParams.menuId"
          placeholder="请输入关联批记录按钮节点ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联批记录菜单节点ID" prop="cMenuId">
        <el-input
          v-model="queryParams.cMenuId"
          placeholder="请输入关联批记录菜单节点ID"
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
      <el-form-item label="业务表主键" prop="businessRecordId">
        <el-input
          v-model="queryParams.businessRecordId"
          placeholder="请输入业务表主键"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前端路由地址" prop="path">
        <el-input
          v-model="queryParams.path"
          placeholder="请输入前端路由地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="后端接口路径" prop="backendRoute">
        <el-input
          v-model="queryParams.backendRoute"
          placeholder="请输入后端接口路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作码" prop="operationCode">
        <el-input
          v-model="queryParams.operationCode"
          placeholder="请输入操作码"
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
          v-hasPermi="['batch:batch_record_log:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['batch:batch_record_log:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['batch:batch_record_log:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['batch:batch_record_log:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batch_record_logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志主键" align="center" prop="logId" />
      <el-table-column label="关联批记录ID" align="center" prop="recordId" />
      <el-table-column label="关联批记录按钮节点ID" align="center" prop="menuId" />
      <el-table-column label="关联批记录菜单节点ID" align="center" prop="cMenuId" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="业务表主键" align="center" prop="businessRecordId" />
      <el-table-column label="前端路由地址" align="center" prop="path" />
      <el-table-column label="后端接口路径" align="center" prop="backendRoute" />
      <el-table-column label="操作码" align="center" prop="operationCode" />
      <el-table-column label="操作类型" align="center" prop="actionType" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作时间" align="center" prop="actionTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.actionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['batch:batch_record_log:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['batch:batch_record_log:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_record_log:remove']">删除</el-button>
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

    <!-- 批记录操作日志详情抽屉 -->
    <batch_record_log-view-drawer ref="batch_record_logViewRef" />
    <!-- 添加或修改批记录操作日志对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batch_record_logRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联批记录ID" prop="recordId">
              <el-input v-model="form.recordId" placeholder="请输入关联批记录ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联批记录按钮节点ID" prop="menuId">
              <el-input v-model="form.menuId" placeholder="请输入关联批记录按钮节点ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联批记录菜单节点ID" prop="cMenuId">
              <el-input v-model="form.cMenuId" placeholder="请输入关联批记录菜单节点ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入物理表名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务表主键" prop="businessRecordId">
              <el-input v-model="form.businessRecordId" placeholder="请输入业务表主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入前端路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="后端接口路径" prop="backendRoute">
              <el-input v-model="form.backendRoute" placeholder="请输入后端接口路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作码" prop="operationCode">
              <el-input v-model="form.operationCode" placeholder="请输入操作码" />
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

<script setup name="Batch_record_log">
import { listBatch_record_log, getBatch_record_log, delBatch_record_log, addBatch_record_log, updateBatch_record_log } from "@/api/batch/batch_record_log"
import Batch_record_logViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const batch_record_logList = ref([])
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
    recordId: undefined,
    menuId: undefined,
    cMenuId: undefined,
    tableName: undefined,
    businessRecordId: undefined,
    path: undefined,
    backendRoute: undefined,
    operationCode: undefined,
    actionType: undefined,
    operator: undefined,
    actionTime: undefined,
    revision: undefined,
    sysVersion: undefined,
  },
  rules: {
    recordId: [
      { required: true, message: "关联批记录ID不能为空", trigger: "blur" }
    ],
    operationCode: [
      { required: true, message: "操作码不能为空", trigger: "blur" }
    ],
    actionType: [
      { required: true, message: "操作类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询批记录操作日志列表 */
function getList() {
  loading.value = true
  listBatch_record_log(queryParams.value).then(response => {
    batch_record_logList.value = response.rows
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
    recordId: null,
    menuId: null,
    cMenuId: null,
    tableName: null,
    businessRecordId: null,
    path: null,
    backendRoute: null,
    operationCode: null,
    actionType: null,
    operator: null,
    actionTime: null,
    remark: null,
    revision: null,
    sysVersion: null,
    createBy: null,
    createTime: null
  }
  proxy.resetForm("batch_record_logRef")
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
  title.value = "添加批记录操作日志"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _logId = row.logId || ids.value
  getBatch_record_log(_logId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改批记录操作日志"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batch_record_logRef"].validate(valid => {
    if (valid) {
      if (form.value.logId != null) {
        updateBatch_record_log(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBatch_record_log(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除批记录操作日志编号为"' + _logIds + '"的数据项？').then(function() {
    return delBatch_record_log(_logIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["batch_record_logViewRef"].open(row.logId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('batch/batch_record_log/export', {
    ...queryParams.value
  }, `batch_record_log_${new Date().getTime()}.xlsx`)
}

getList()
</script>
