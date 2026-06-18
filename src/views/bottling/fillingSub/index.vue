<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联孙表" prop="mainId">
        <el-input
          v-model="queryParams.mainId"
          placeholder="请输入关联孙表"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="样品序号" prop="sampleNo">
        <el-input
          v-model="queryParams.sampleNo"
          placeholder="请输入样品序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装量" prop="fillingWeight">
        <el-input
          v-model="queryParams.fillingWeight"
          placeholder="请输入装量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外观" prop="appearance">
        <el-input
          v-model="queryParams.appearance"
          placeholder="请输入外观"
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
      <el-form-item label="复核人" prop="reviewer">
        <el-input
          v-model="queryParams.reviewer"
          placeholder="请输入复核人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检查人" prop="inspector">
        <el-input
          v-model="queryParams.inspector"
          placeholder="请输入检查人"
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
          v-hasPermi="['bottling:fillingSub:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:fillingSub:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:fillingSub:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:fillingSub:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillingSubList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="曾孙表主键" align="center" prop="subId" />
      <el-table-column label="关联孙表" align="center" prop="mainId" />
      <el-table-column label="样品序号" align="center" prop="sampleNo" />
      <el-table-column label="装量" align="center" prop="fillingWeight" />
      <el-table-column label="外观" align="center" prop="appearance" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="复核人" align="center" prop="reviewer" />
      <el-table-column label="检查人" align="center" prop="inspector" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:fillingSub:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:fillingSub:remove']">删除</el-button>
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

    <!-- 添加或修改灌装量行记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillingSubRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联孙表" prop="mainId">
              <el-input v-model="form.mainId" placeholder="请输入关联孙表" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="样品序号" prop="sampleNo">
              <el-input v-model="form.sampleNo" placeholder="请输入样品序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="装量" prop="fillingWeight">
              <el-input v-model="form.fillingWeight" placeholder="请输入装量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="外观" prop="appearance">
              <el-input v-model="form.appearance" placeholder="请输入外观" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人" prop="reviewer">
              <el-input v-model="form.reviewer" placeholder="请输入复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人" prop="inspector">
              <el-input v-model="form.inspector" placeholder="请输入检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="FillingSub">
import { listFillingSub, getFillingSub, delFillingSub, addFillingSub, updateFillingSub } from "@/api/bottling/fillingSub"

const { proxy } = getCurrentInstance()

const fillingSubList = ref([])
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
    mainId: undefined,
    sampleNo: undefined,
    fillingWeight: undefined,
    appearance: undefined,
    operator: undefined,
    reviewer: undefined,
    inspector: undefined,
  },
  rules: {
    mainId: [
      { required: true, message: "关联孙表不能为空", trigger: "blur" }
    ],
    sampleNo: [
      { required: true, message: "样品序号不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装量行记录列表 */
function getList() {
  loading.value = true
  listFillingSub(queryParams.value).then(response => {
    fillingSubList.value = response.rows
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
    subId: null,
    mainId: null,
    sampleNo: null,
    fillingWeight: null,
    appearance: null,
    operator: null,
    reviewer: null,
    inspector: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillingSubRef")
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
  ids.value = selection.map(item => item.subId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加灌装量行记录"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _subId = row.subId || ids.value
  getFillingSub(_subId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装量行记录"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillingSubRef"].validate(valid => {
    if (valid) {
      if (form.value.subId != null) {
        updateFillingSub(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFillingSub(form.value).then(() => {
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
  const _subIds = row.subId || ids.value
  proxy.$modal.confirm('是否确认删除灌装量行记录编号为"' + _subIds + '"的数据项？').then(function() {
    return delFillingSub(_subIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/fillingSub/export', {
    ...queryParams.value
  }, `fillingSub_${new Date().getTime()}.xlsx`)
}

getList()
</script>
