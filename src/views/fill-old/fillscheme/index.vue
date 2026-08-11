<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="方案编码" prop="schemeCode">
        <el-input
          v-model="queryParams.schemeCode"
          placeholder="请输入方案编码"
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
      <el-form-item label="包含的分组类型数量" prop="groupTypeCount">
        <el-input
          v-model="queryParams.groupTypeCount"
          placeholder="请输入包含的分组类型数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前已发布版本ID" prop="currentReleaseId">
        <el-input
          v-model="queryParams.currentReleaseId"
          placeholder="请输入当前已发布版本ID"
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
          v-hasPermi="['fill:fillscheme:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:fillscheme:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:fillscheme:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:fillscheme:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillschemeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="方案主键" align="center" prop="schemeId" />
      <el-table-column label="方案编码" align="center" prop="schemeCode" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="方案类型" align="center" prop="schemeType" />
      <el-table-column label="包含的分组类型数量" align="center" prop="groupTypeCount" />
      <el-table-column label="当前已发布版本ID" align="center" prop="currentReleaseId" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:fillscheme:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:fillscheme:remove']">删除</el-button>
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

    <!-- 添加或修改填报方案设计主对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillschemeRef" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="方案编码" prop="schemeCode">
              <el-input v-model="form.schemeCode" placeholder="请输入方案编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案名称" prop="schemeName">
              <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包含的分组类型数量" prop="groupTypeCount">
              <el-input v-model="form.groupTypeCount" placeholder="请输入包含的分组类型数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="当前已发布版本ID" prop="currentReleaseId">
              <el-input v-model="form.currentReleaseId" placeholder="请输入当前已发布版本ID" />
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

<script setup name="Fillscheme">
import { listFillscheme, getFillscheme, delFillscheme, addFillscheme, updateFillscheme } from "@/api/fill/fillscheme"

const { proxy } = getCurrentInstance()

const fillschemeList = ref([])
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
    schemeCode: undefined,
    schemeName: undefined,
    schemeType: undefined,
    groupTypeCount: undefined,
    currentReleaseId: undefined,
    status: undefined,
  },
  rules: {
    schemeCode: [
      { required: true, message: "方案编码不能为空", trigger: "blur" }
    ],
    schemeName: [
      { required: true, message: "方案名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报方案设计主列表 */
function getList() {
  loading.value = true
  listFillscheme(queryParams.value).then(response => {
    fillschemeList.value = response.rows
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
    schemeId: null,
    schemeCode: null,
    schemeName: null,
    schemeType: null,
    groupTypeCount: null,
    currentReleaseId: null,
    status: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillschemeRef")
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
  ids.value = selection.map(item => item.schemeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报方案设计主"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _schemeId = row.schemeId || ids.value
  getFillscheme(_schemeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案设计主"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillschemeRef"].validate(valid => {
    if (valid) {
      if (form.value.schemeId != null) {
        updateFillscheme(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFillscheme(form.value).then(() => {
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
  const _schemeIds = row.schemeId || ids.value
  proxy.$modal.confirm('是否确认删除填报方案设计主编号为"' + _schemeIds + '"的数据项？').then(function() {
    return delFillscheme(_schemeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/fillscheme/export', {
    ...queryParams.value
  }, `fillscheme_${new Date().getTime()}.xlsx`)
}

getList()
</script>
