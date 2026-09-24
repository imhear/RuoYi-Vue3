<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="数据库schema" prop="tableSchema">
        <el-input
          v-model="queryParams.tableSchema"
          placeholder="请输入数据库schema"
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
      <el-form-item label="物理表注释" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入物理表注释"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物理表DDL创建时间" prop="ddlCreateTime">
        <el-date-picker clearable
          v-model="queryParams.ddlCreateTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择物理表DDL创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="物理表DDL修改时间" prop="ddlUpdateTime">
        <el-date-picker clearable
          v-model="queryParams.ddlUpdateTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择物理表DDL修改时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属模块" prop="module">
        <el-input
          v-model="queryParams.module"
          placeholder="请输入所属模块"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属分组" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入所属分组"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入显示顺序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Refresh"
          @click="handleSync"
          v-hasPermi="['basic:table:sync']"
        >同步</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['basic:table:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:table:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:table:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['basic:table:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="业务表主键" align="center" prop="tableId" /> -->
      <el-table-column label="数据库schema" align="center" prop="tableSchema" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="物理表注释" align="center" prop="tableComment" />
      <el-table-column label="物理表DDL创建时间" align="center" prop="ddlCreateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.ddlCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物理表DDL修改时间" align="center" prop="ddlUpdateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.ddlUpdateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单类型" align="center" prop="formType" />
      <el-table-column label="所属模块" align="center" prop="module" />
      <el-table-column label="所属分组" align="center" prop="groupName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['basic:table:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['basic:table:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['basic:table:remove']">删除</el-button>
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

    <!-- 业务表注册详情抽屉 -->
    <table-view-drawer ref="tableViewRef" />
    <!-- 添加或修改业务表注册对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据库schema" prop="tableSchema">
              <el-input v-model="form.tableSchema" placeholder="请输入数据库schema" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入物理表名" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表注释" prop="tableComment">
              <el-input v-model="form.tableComment" placeholder="请输入物理表注释" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表DDL创建时间" prop="ddlCreateTime">
              <el-date-picker clearable
                v-model="form.ddlCreateTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择物理表DDL创建时间" disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表DDL修改时间" prop="ddlUpdateTime">
              <el-date-picker clearable
                v-model="form.ddlUpdateTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择物理表DDL修改时间" disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属模块" prop="module">
              <el-input v-model="form.module" placeholder="请输入所属模块" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属分组" prop="groupName">
              <el-input v-model="form.groupName" placeholder="请输入所属分组" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
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

<script setup name="BasicTable">
import { listTable, getTable, delTable, addTable, updateTable, syncTable } from "@/api/basic/table"
import TableViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const tableList = ref([])
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
    tableSchema: undefined,
    tableName: undefined,
    tableComment: undefined,
    ddlCreateTime: undefined,
    ddlUpdateTime: undefined,
    formType: undefined,
    module: undefined,
    groupName: undefined,
    orderNum: undefined,
    status: undefined,
    orderByColumn: 'order_num',
    isAsc: 'asc'
  },
  rules: {
    tableName: [
      { required: true, message: "物理表名不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询业务表注册列表 */
function getList() {
  loading.value = true
  listTable(queryParams.value).then(response => {
    tableList.value = response.rows
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
    tableId: null,
    tableSchema: null,
    tableName: null,
    tableComment: null,
    ddlCreateTime: null,
    ddlUpdateTime: null,
    formType: null,
    module: null,
    groupName: null,
    orderNum: 0,
    status: "0",
    delFlag: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("formRef")
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
  ids.value = selection.map(item => item.tableId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加业务表注册"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _tableId = row.tableId || ids.value
  getTable(_tableId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改业务表注册"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      if (form.value.tableId != null) {
        updateTable(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTable(form.value).then(() => {
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
  const _tableIds = row.tableId || ids.value
  proxy.$modal.confirm('是否确认删除业务表注册编号为"' + _tableIds + '"的数据项？').then(function() {
    return delTable(_tableIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["tableViewRef"].open(row.tableId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('basic/table/export', {
    ...queryParams.value
  }, `table_${new Date().getTime()}.xlsx`)
}

/** 同步业务表注册表：从 information_schema 读取未注册的业务表并自动填充 */
function handleSync() {
  proxy.$modal.confirm('是否确认同步业务表到业务表注册表？').then(function() {
    return syncTable()
  }).then((response) => {
    proxy.$modal.msgSuccess(response.msg || '同步完成')
    getList()
  }).catch(() => {})
}

getList()
</script>