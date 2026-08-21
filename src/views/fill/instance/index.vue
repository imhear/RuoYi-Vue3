<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联发布版本ID" prop="releaseId">
        <el-input
          v-model="queryParams.releaseId"
          placeholder="请输入关联发布版本ID"
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
      <el-form-item label="工单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入工单号"
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
      <el-table-column label="批记录实例集主键" align="center" prop="instanceId" />
      <el-table-column label="关联发布版本ID" align="center" prop="releaseId" />
      <el-table-column label="关联排产计划ID" align="center" prop="planId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:instance:query']">详情</el-button>
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

    <!-- 填报实例运行态详情抽屉 -->
    <instance-view-drawer ref="instanceViewRef" />
    <!-- 添加或修改填报实例运行态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="instanceRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联发布版本ID" prop="releaseId">
              <el-input v-model="form.releaseId" placeholder="请输入关联发布版本ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联排产计划ID" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案名称" prop="schemeName">
              <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
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

<script setup name="Instance">
import { listInstance, getInstance, delInstance, addInstance, updateInstance } from "@/api/fill/instance"
import InstanceViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

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
    releaseId: undefined,
    planId: undefined,
    orderNum: undefined,
    schemeName: undefined,
    status: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
    releaseId: [
      { required: true, message: "关联发布版本ID不能为空", trigger: "blur" }
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
    releaseId: null,
    planId: null,
    orderNum: null,
    schemeName: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
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

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["instanceViewRef"].open(row.instanceId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/instance/export', {
    ...queryParams.value
  }, `instance_${new Date().getTime()}.xlsx`)
}

getList()
</script>
