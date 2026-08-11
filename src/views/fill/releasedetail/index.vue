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
      <el-form-item label="物理表名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入物理表名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前置明细ID" prop="predecessorDetailId">
        <el-input
          v-model="queryParams.predecessorDetailId"
          placeholder="请输入前置明细ID"
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
          v-hasPermi="['fill:releasedetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:releasedetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:releasedetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:releasedetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="releasedetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发布明细主键" align="center" prop="releaseDetailId" />
      <el-table-column label="关联发布ID" align="center" prop="releaseId" />
      <el-table-column label="分组类型" align="center" prop="groupType" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="自定义参数" align="center" prop="customParams" />
      <el-table-column label="前置明细ID" align="center" prop="predecessorDetailId" />
      <el-table-column label="排序号" align="center" prop="sortOrder" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:releasedetail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:releasedetail:remove']">删除</el-button>
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

    <!-- 添加或修改填报明细发布态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="releasedetailRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联发布ID" prop="releaseId">
              <el-input v-model="form.releaseId" placeholder="请输入关联发布ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入物理表名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义参数" prop="customParams">
              <el-input v-model="form.customParams" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前置明细ID" prop="predecessorDetailId">
              <el-input v-model="form.predecessorDetailId" placeholder="请输入前置明细ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序号" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入排序号" />
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

<script setup name="Releasedetail">
import { listReleasedetail, getReleasedetail, delReleasedetail, addReleasedetail, updateReleasedetail } from "@/api/fill/releasedetail"

const { proxy } = getCurrentInstance()

const releasedetailList = ref([])
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
    tableName: undefined,
    customParams: undefined,
    predecessorDetailId: undefined,
    sortOrder: undefined,
  },
  rules: {
    releaseId: [
      { required: true, message: "关联发布ID不能为空", trigger: "blur" }
    ],
    groupType: [
      { required: true, message: "分组类型不能为空", trigger: "change" }
    ],
    tableName: [
      { required: true, message: "物理表名不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报明细发布态列表 */
function getList() {
  loading.value = true
  listReleasedetail(queryParams.value).then(response => {
    releasedetailList.value = response.rows
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
    releaseDetailId: null,
    releaseId: null,
    groupType: null,
    tableName: null,
    customParams: null,
    predecessorDetailId: null,
    sortOrder: null,
    delFlag: null,
    createBy: null,
    createTime: null
  }
  proxy.resetForm("releasedetailRef")
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
  ids.value = selection.map(item => item.releaseDetailId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报明细发布态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _releaseDetailId = row.releaseDetailId || ids.value
  getReleasedetail(_releaseDetailId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报明细发布态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["releasedetailRef"].validate(valid => {
    if (valid) {
      if (form.value.releaseDetailId != null) {
        updateReleasedetail(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addReleasedetail(form.value).then(() => {
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
  const _releaseDetailIds = row.releaseDetailId || ids.value
  proxy.$modal.confirm('是否确认删除填报明细发布态编号为"' + _releaseDetailIds + '"的数据项？').then(function() {
    return delReleasedetail(_releaseDetailIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/releasedetail/export', {
    ...queryParams.value
  }, `releasedetail_${new Date().getTime()}.xlsx`)
}

getList()
</script>
