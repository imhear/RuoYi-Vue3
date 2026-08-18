<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作单元编码" prop="workUnitCode">
        <el-input
          v-model="queryParams.workUnitCode"
          placeholder="请输入工作单元编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作单元名称" prop="workUnitName">
        <el-input
          v-model="queryParams.workUnitName"
          placeholder="请输入工作单元名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联若依部门ID" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入关联若依部门ID"
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['fill:work_unit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:work_unit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:work_unit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:work_unit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="work_unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工作单元主键" align="center" prop="workUnitId" />
      <el-table-column label="工作单元编码" align="center" prop="workUnitCode" />
      <el-table-column label="工作单元名称" align="center" prop="workUnitName" />
      <el-table-column label="关联若依部门ID" align="center" prop="deptId" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:work_unit:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:work_unit:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:work_unit:remove']">删除</el-button>
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

    <!-- 工作单元详情抽屉 -->
    <work_unit-view-drawer ref="work_unitViewRef" />
    <!-- 添加或修改工作单元对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="work_unitRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作单元编码" prop="workUnitCode">
              <el-input v-model="form.workUnitCode" placeholder="请输入工作单元编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作单元名称" prop="workUnitName">
              <el-input v-model="form.workUnitName" placeholder="请输入工作单元名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联若依部门ID" prop="deptId">
              <el-input v-model="form.deptId" placeholder="请输入关联若依部门ID" />
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

<script setup name="Work_unit">
import { listWork_unit, getWork_unit, delWork_unit, addWork_unit, updateWork_unit } from "@/api/fill/work_unit"
import Work_unitViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const work_unitList = ref([])
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
    workUnitCode: undefined,
    workUnitName: undefined,
    deptId: undefined,
    orderNum: undefined,
    status: undefined,
  },
  rules: {
    workUnitCode: [
      { required: true, message: "工作单元编码不能为空", trigger: "blur" }
    ],
    workUnitName: [
      { required: true, message: "工作单元名称不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "关联若依部门ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询工作单元列表 */
function getList() {
  loading.value = true
  listWork_unit(queryParams.value).then(response => {
    work_unitList.value = response.rows
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
    workUnitId: null,
    workUnitCode: null,
    workUnitName: null,
    deptId: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("work_unitRef")
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
  ids.value = selection.map(item => item.workUnitId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加工作单元"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _workUnitId = row.workUnitId || ids.value
  getWork_unit(_workUnitId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改工作单元"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["work_unitRef"].validate(valid => {
    if (valid) {
      if (form.value.workUnitId != null) {
        updateWork_unit(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addWork_unit(form.value).then(() => {
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
  const _workUnitIds = row.workUnitId || ids.value
  proxy.$modal.confirm('是否确认删除工作单元编号为"' + _workUnitIds + '"的数据项？').then(function() {
    return delWork_unit(_workUnitIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["work_unitViewRef"].open(row.workUnitId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/work_unit/export', {
    ...queryParams.value
  }, `work_unit_${new Date().getTime()}.xlsx`)
}

getList()
</script>
