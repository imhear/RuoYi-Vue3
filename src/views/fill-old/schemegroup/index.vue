<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属方案ID" prop="schemeId">
        <el-input
          v-model="queryParams.schemeId"
          placeholder="请输入所属方案ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分组类型名称" prop="groupTypeName">
        <el-input
          v-model="queryParams.groupTypeName"
          placeholder="请输入分组类型名称"
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
          v-hasPermi="['fill:schemegroup:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:schemegroup:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:schemegroup:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:schemegroup:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemegroupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分组方案主键" align="center" prop="groupSchemeId" />
      <el-table-column label="所属方案ID" align="center" prop="schemeId" />
      <el-table-column label="分组类型" align="center" prop="groupType" />
      <el-table-column label="分组类型名称" align="center" prop="groupTypeName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:schemegroup:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:schemegroup:remove']">删除</el-button>
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

    <!-- 添加或修改填报方案分组对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="schemegroupRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属方案ID" prop="schemeId">
              <el-input v-model="form.schemeId" placeholder="请输入所属方案ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分组类型" prop="groupType">
              <el-input v-model="form.groupType" placeholder="请输入分组类型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分组类型名称" prop="groupTypeName">
              <el-input v-model="form.groupTypeName" placeholder="请输入分组类型名称" />
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

<script setup name="Schemegroup">
import { listSchemegroup, getSchemegroup, delSchemegroup, addSchemegroup, updateSchemegroup } from "@/api/fill/schemegroup"

const { proxy } = getCurrentInstance()

const schemegroupList = ref([])
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
    schemeId: undefined,
    groupType: undefined,
    groupTypeName: undefined,
    orderNum: undefined,
    status: undefined,
  },
  rules: {
    schemeId: [
      { required: true, message: "所属方案ID不能为空", trigger: "blur" }
    ],
    groupType: [
      { required: true, message: "分组类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报方案分组列表 */
function getList() {
  loading.value = true
  listSchemegroup(queryParams.value).then(response => {
    schemegroupList.value = response.rows
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
    groupSchemeId: null,
    schemeId: null,
    groupType: null,
    groupTypeName: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("schemegroupRef")
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
  ids.value = selection.map(item => item.groupSchemeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报方案分组"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _groupSchemeId = row.groupSchemeId || ids.value
  getSchemegroup(_groupSchemeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案分组"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schemegroupRef"].validate(valid => {
    if (valid) {
      if (form.value.groupSchemeId != null) {
        updateSchemegroup(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchemegroup(form.value).then(() => {
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
  const _groupSchemeIds = row.groupSchemeId || ids.value
  proxy.$modal.confirm('是否确认删除填报方案分组编号为"' + _groupSchemeIds + '"的数据项？').then(function() {
    return delSchemegroup(_groupSchemeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/schemegroup/export', {
    ...queryParams.value
  }, `schemegroup_${new Date().getTime()}.xlsx`)
}

getList()
</script>
