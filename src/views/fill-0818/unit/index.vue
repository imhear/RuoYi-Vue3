<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="填报单元编码" prop="unitCode">
        <el-input
          v-model="queryParams.unitCode"
          placeholder="请输入填报单元编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="填报单元名称" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入填报单元名称"
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
      <el-form-item label="排序号" prop="sortOrder">
        <el-input
          v-model="queryParams.sortOrder"
          placeholder="请输入排序号"
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
          v-hasPermi="['fill:unit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:unit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:unit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:unit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="填报单元主键" align="center" prop="unitId" />
      <el-table-column label="填报单元编码" align="center" prop="unitCode" />
      <el-table-column label="填报单元名称" align="center" prop="unitName" />
      <el-table-column label="关联若依部门ID" align="center" prop="deptId" />
      <el-table-column label="排序号" align="center" prop="sortOrder" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:unit:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:unit:remove']">删除</el-button>
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

    <!-- 添加或修改填报单元注册对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="unitRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="填报单元编码" prop="unitCode">
              <el-input v-model="form.unitCode" placeholder="请输入填报单元编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="填报单元名称" prop="unitName">
              <el-input v-model="form.unitName" placeholder="请输入填报单元名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联若依部门ID" prop="deptId">
              <el-input v-model="form.deptId" placeholder="请输入关联若依部门ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序号" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入排序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Unit">
import { listUnit, getUnit, delUnit, addUnit, updateUnit } from "@/api/fill/unit"

const { proxy } = getCurrentInstance()

const unitList = ref([])
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
    unitCode: undefined,
    unitName: undefined,
    deptId: undefined,
    sortOrder: undefined,
    status: undefined,
  },
  rules: {
    unitCode: [
      { required: true, message: "填报单元编码不能为空", trigger: "blur" }
    ],
    unitName: [
      { required: true, message: "填报单元名称不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "关联若依部门ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报单元注册列表 */
function getList() {
  loading.value = true
  listUnit(queryParams.value).then(response => {
    unitList.value = response.rows
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
    unitId: null,
    unitCode: null,
    unitName: null,
    deptId: null,
    sortOrder: null,
    remark: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("unitRef")
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
  ids.value = selection.map(item => item.unitId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报单元注册"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _unitId = row.unitId || ids.value
  getUnit(_unitId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报单元注册"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["unitRef"].validate(valid => {
    if (valid) {
      if (form.value.unitId != null) {
        updateUnit(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addUnit(form.value).then(() => {
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
  const _unitIds = row.unitId || ids.value
  proxy.$modal.confirm('是否确认删除填报单元注册编号为"' + _unitIds + '"的数据项？').then(function() {
    return delUnit(_unitIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/unit/export', {
    ...queryParams.value
  }, `unit_${new Date().getTime()}.xlsx`)
}

getList()
</script>
