<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组件完整路径" prop="componentPath">
        <el-input
          v-model="queryParams.componentPath"
          placeholder="请输入组件完整路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否当前生效" prop="isCurrent">
        <el-input
          v-model="queryParams.isCurrent"
          placeholder="请输入是否当前生效"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生效日期" prop="effectiveDate">
        <el-date-picker clearable
          v-model="queryParams.effectiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择生效日期">
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
          v-hasPermi="['fill:component:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:component:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:component:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:component:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="componentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="注册主键" align="center" prop="componentId" />
      <el-table-column label="组件完整路径" align="center" prop="componentPath" />
      <el-table-column label="是否当前生效" align="center" prop="isCurrent" />
      <el-table-column label="生效日期" align="center" prop="effectiveDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更说明" align="center" prop="changelog" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:component:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:component:remove']">删除</el-button>
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

    <!-- 添加或修改前端组件注册对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="componentRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="组件完整路径" prop="componentPath">
              <el-input v-model="form.componentPath" placeholder="请输入组件完整路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否当前生效" prop="isCurrent">
              <el-input v-model="form.isCurrent" placeholder="请输入是否当前生效" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker clearable
                v-model="form.effectiveDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择生效日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="变更说明" prop="changelog">
              <el-input v-model="form.changelog" type="textarea" placeholder="请输入内容" />
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

<script setup name="Component">
import { listComponent, getComponent, delComponent, addComponent, updateComponent } from "@/api/fill/component"

const { proxy } = getCurrentInstance()

const componentList = ref([])
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
    componentPath: undefined,
    isCurrent: undefined,
    effectiveDate: undefined,
    changelog: undefined,
    status: undefined,
  },
  rules: {
    componentPath: [
      { required: true, message: "组件完整路径不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询前端组件注册列表 */
function getList() {
  loading.value = true
  listComponent(queryParams.value).then(response => {
    componentList.value = response.rows
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
    componentId: null,
    componentPath: null,
    isCurrent: null,
    effectiveDate: null,
    changelog: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("componentRef")
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
  ids.value = selection.map(item => item.componentId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加前端组件注册"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _componentId = row.componentId || ids.value
  getComponent(_componentId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改前端组件注册"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["componentRef"].validate(valid => {
    if (valid) {
      if (form.value.componentId != null) {
        updateComponent(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addComponent(form.value).then(() => {
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
  const _componentIds = row.componentId || ids.value
  proxy.$modal.confirm('是否确认删除前端组件注册编号为"' + _componentIds + '"的数据项？').then(function() {
    return delComponent(_componentIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/component/export', {
    ...queryParams.value
  }, `component_${new Date().getTime()}.xlsx`)
}

getList()
</script>
