<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联发布ID" prop="releaseId">
        <el-input
          v-model="queryParams.releaseId"
          placeholder="请输入关联发布ID"
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
          v-hasPermi="['fill:releasegroup:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:releasegroup:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:releasegroup:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:releasegroup:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="releasegroupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发布分组主键" align="center" prop="releaseGroupId" />
      <el-table-column label="关联发布ID" align="center" prop="releaseId" />
      <el-table-column label="分组类型" align="center" prop="groupType" />
      <el-table-column label="分组类型名称" align="center" prop="groupTypeName" />
      <el-table-column label="排序号" align="center" prop="sortOrder" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:releasegroup:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:releasegroup:remove']">删除</el-button>
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

    <!-- 添加或修改填报分组发布态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="releasegroupRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联发布ID" prop="releaseId">
              <el-input v-model="form.releaseId" placeholder="请输入关联发布ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分组类型名称" prop="groupTypeName">
              <el-input v-model="form.groupTypeName" placeholder="请输入分组类型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序号" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入排序号" />
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

<script setup name="Releasegroup">
import { listReleasegroup, getReleasegroup, delReleasegroup, addReleasegroup, updateReleasegroup } from "@/api/fill/releasegroup"

const { proxy } = getCurrentInstance()

const releasegroupList = ref([])
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
    groupType: undefined,
    groupTypeName: undefined,
    sortOrder: undefined,
  },
  rules: {
    releaseId: [
      { required: true, message: "关联发布ID不能为空", trigger: "blur" }
    ],
    groupType: [
      { required: true, message: "分组类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报分组发布态列表 */
function getList() {
  loading.value = true
  listReleasegroup(queryParams.value).then(response => {
    releasegroupList.value = response.rows
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
    releaseGroupId: null,
    releaseId: null,
    groupType: null,
    groupTypeName: null,
    sortOrder: null,
    createBy: null,
    createTime: null
  }
  proxy.resetForm("releasegroupRef")
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
  ids.value = selection.map(item => item.releaseGroupId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报分组发布态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _releaseGroupId = row.releaseGroupId || ids.value
  getReleasegroup(_releaseGroupId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报分组发布态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["releasegroupRef"].validate(valid => {
    if (valid) {
      if (form.value.releaseGroupId != null) {
        updateReleasegroup(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addReleasegroup(form.value).then(() => {
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
  const _releaseGroupIds = row.releaseGroupId || ids.value
  proxy.$modal.confirm('是否确认删除填报分组发布态编号为"' + _releaseGroupIds + '"的数据项？').then(function() {
    return delReleasegroup(_releaseGroupIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/releasegroup/export', {
    ...queryParams.value
  }, `releasegroup_${new Date().getTime()}.xlsx`)
}

getList()
</script>
