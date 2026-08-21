<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="冗余：关联批记录实例ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入冗余：关联批记录实例ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联表单实例ID" prop="formId">
        <el-input
          v-model="queryParams.formId"
          placeholder="请输入关联表单实例ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联发布态菜单ID" prop="menuId">
        <el-input
          v-model="queryParams.menuId"
          placeholder="请输入关联发布态菜单ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冗余：排产计划ID" prop="planId">
        <el-input
          v-model="queryParams.planId"
          placeholder="请输入冗余：排产计划ID"
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
      <el-form-item label="前端组件路径" prop="component">
        <el-input
          v-model="queryParams.component"
          placeholder="请输入前端组件路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冗余：物理表名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入冗余：物理表名"
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
          v-hasPermi="['fill:instance_operation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:instance_operation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:instance_operation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:instance_operation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="instance_operationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="实例操作主键" align="center" prop="instanceOperationId" />
      <el-table-column label="冗余：关联批记录实例ID" align="center" prop="instanceId" />
      <el-table-column label="关联表单实例ID" align="center" prop="formId" />
      <el-table-column label="关联发布态菜单ID" align="center" prop="menuId" />
      <el-table-column label="冗余：排产计划ID" align="center" prop="planId" />
      <el-table-column label="前端路由地址" align="center" prop="path" />
      <el-table-column label="后端接口路径" align="center" prop="backendRoute" />
      <el-table-column label="前端组件路径" align="center" prop="component" />
      <el-table-column label="冗余：物理表名" align="center" prop="tableName" />
      <el-table-column label="业务表主键" align="center" prop="businessRecordId" />
      <el-table-column label="操作码" align="center" prop="operationCode" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作时间" align="center" prop="operatorTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operatorTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:instance_operation:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:instance_operation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:instance_operation:remove']">删除</el-button>
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

    <!-- 填报操作运行态详情抽屉 -->
    <instance_operation-view-drawer ref="instance_operationViewRef" />
    <!-- 添加或修改填报操作运行态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="instance_operationRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="冗余：关联批记录实例ID" prop="instanceId">
              <el-input v-model="form.instanceId" placeholder="请输入冗余：关联批记录实例ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联表单实例ID" prop="formId">
              <el-input v-model="form.formId" placeholder="请输入关联表单实例ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联发布态菜单ID" prop="menuId">
              <el-input v-model="form.menuId" placeholder="请输入关联发布态菜单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="冗余：排产计划ID" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入冗余：排产计划ID" />
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
            <el-form-item label="前端组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入前端组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="冗余：物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入冗余：物理表名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务表主键" prop="businessRecordId">
              <el-input v-model="form.businessRecordId" placeholder="请输入业务表主键" />
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

<script setup name="Instance_operation">
import { listInstance_operation, getInstance_operation, delInstance_operation, addInstance_operation, updateInstance_operation } from "@/api/fill/instance_operation"
import Instance_operationViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const instance_operationList = ref([])
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
    formId: undefined,
    menuId: undefined,
    planId: undefined,
    path: undefined,
    backendRoute: undefined,
    component: undefined,
    tableName: undefined,
    businessRecordId: undefined,
    operationCode: undefined,
    operator: undefined,
    operatorTime: undefined,
    orderNum: undefined,
    status: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
    instanceId: [
      { required: true, message: "冗余：关联批记录实例ID不能为空", trigger: "blur" }
    ],
    formId: [
      { required: true, message: "关联表单实例ID不能为空", trigger: "blur" }
    ],
    menuId: [
      { required: true, message: "关联发布态菜单ID不能为空", trigger: "blur" }
    ],
    planId: [
      { required: true, message: "冗余：排产计划ID不能为空", trigger: "blur" }
    ],
    operationCode: [
      { required: true, message: "操作码不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报操作运行态列表 */
function getList() {
  loading.value = true
  listInstance_operation(queryParams.value).then(response => {
    instance_operationList.value = response.rows
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
    instanceOperationId: null,
    instanceId: null,
    formId: null,
    menuId: null,
    planId: null,
    path: null,
    backendRoute: null,
    component: null,
    tableName: null,
    businessRecordId: null,
    operationCode: null,
    operator: null,
    operatorTime: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("instance_operationRef")
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
  ids.value = selection.map(item => item.instanceOperationId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报操作运行态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _instanceOperationId = row.instanceOperationId || ids.value
  getInstance_operation(_instanceOperationId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报操作运行态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["instance_operationRef"].validate(valid => {
    if (valid) {
      if (form.value.instanceOperationId != null) {
        updateInstance_operation(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addInstance_operation(form.value).then(() => {
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
  const _instanceOperationIds = row.instanceOperationId || ids.value
  proxy.$modal.confirm('是否确认删除填报操作运行态编号为"' + _instanceOperationIds + '"的数据项？').then(function() {
    return delInstance_operation(_instanceOperationIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["instance_operationViewRef"].open(row.instanceOperationId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/instance_operation/export', {
    ...queryParams.value
  }, `instance_operation_${new Date().getTime()}.xlsx`)
}

getList()
</script>
