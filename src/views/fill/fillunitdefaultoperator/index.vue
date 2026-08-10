<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联填报单元ID" prop="unitId">
        <el-input
          v-model="queryParams.unitId"
          placeholder="请输入关联填报单元ID"
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
          v-hasPermi="['fill:fillunitdefaultoperator:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:fillunitdefaultoperator:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:fillunitdefaultoperator:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:fillunitdefaultoperator:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillunitdefaultoperatorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="填报单元默认操作人主键" align="center" prop="unitOperatorId" />
      <el-table-column label="关联填报单元ID" align="center" prop="unitId" />
      <el-table-column label="操作类型" align="center" prop="operatorType" />
      <el-table-column label="操作名称" align="center" prop="operatorName" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:fillunitdefaultoperator:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:fillunitdefaultoperator:remove']">删除</el-button>
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

    <!-- 添加或修改填报单元默认操作人对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillunitdefaultoperatorRef" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联填报单元ID" prop="unitId">
              <el-input v-model="form.unitId" placeholder="请输入关联填报单元ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作类型" prop="operatorType">
              <el-input v-model="form.operatorType" placeholder="操作类型（如 handle=填报, review=复核, inspect=检查）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作名称" prop="operatorName">
              <el-input v-model="form.operatorName" placeholder="操作名称（如 填报人、复核人、检查人）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="操作人（用户ID或用户名）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
               <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
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

<script setup name="Fillunitdefaultoperator">
import { listFillunitdefaultoperator, getFillunitdefaultoperator, delFillunitdefaultoperator, addFillunitdefaultoperator, updateFillunitdefaultoperator } from "@/api/fill/fillunitdefaultoperator"

const { proxy } = getCurrentInstance()

const fillunitdefaultoperatorList = ref([])
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
    unitId: undefined,
    operatorType: undefined,
    operatorName: undefined,
    operator: undefined,
    orderNum: undefined,
    status: undefined,
  },
  rules: {
    unitId: [{ required: true, message: "关联填报单元ID不能为空", trigger: "blur" }],
    operatorType: [{ required: true, message: "操作类型不能为空", trigger: "blur" }],
    operatorName: [{ required: true, message: "操作名称不能为空", trigger: "blur" }],
    operator: [{ required: true, message: "操作人不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示顺序不能为空", trigger: "blur" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报单元默认操作人列表 */
function getList() {
  loading.value = true
  listFillunitdefaultoperator(queryParams.value).then(response => {
    fillunitdefaultoperatorList.value = response.rows
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
    unitOperatorId: null,
    unitId: null,
    operatorType: null,
    operatorName: null,
    operator: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillunitdefaultoperatorRef")
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
  ids.value = selection.map(item => item.unitOperatorId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报单元默认操作人"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _unitOperatorId = row.unitOperatorId || ids.value
  getFillunitdefaultoperator(_unitOperatorId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报单元默认操作人"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillunitdefaultoperatorRef"].validate(valid => {
    if (valid) {
      if (form.value.unitOperatorId != null) {
        updateFillunitdefaultoperator(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFillunitdefaultoperator(form.value).then(() => {
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
  const _unitOperatorIds = row.unitOperatorId || ids.value
  proxy.$modal.confirm('是否确认删除填报单元默认操作人编号为"' + _unitOperatorIds + '"的数据项？').then(function() {
    return delFillunitdefaultoperator(_unitOperatorIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/fillunitdefaultoperator/export', {
    ...queryParams.value
  }, `fillunitdefaultoperator_${new Date().getTime()}.xlsx`)
}

getList()
</script>
