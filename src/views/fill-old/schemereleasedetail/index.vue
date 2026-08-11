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
      <el-form-item label="指定版本号" prop="versionCode">
        <el-input
          v-model="queryParams.versionCode"
          placeholder="请输入指定版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="锁定的版本ID" prop="lockedVersionId">
        <el-input
          v-model="queryParams.lockedVersionId"
          placeholder="请输入锁定的版本ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="锁定的组件基础路径" prop="lockedComponentPath">
        <el-input
          v-model="queryParams.lockedComponentPath"
          placeholder="请输入锁定的组件基础路径"
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
          v-hasPermi="['fill:schemereleasedetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:schemereleasedetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:schemereleasedetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:schemereleasedetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemereleasedetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发布明细主键" align="center" prop="releaseDetailId" />
      <el-table-column label="关联发布ID" align="center" prop="releaseId" />
      <el-table-column label="分组类型" align="center" prop="groupType" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="指定版本号" align="center" prop="versionCode" />
      <el-table-column label="自定义参数" align="center" prop="customParams" />
      <el-table-column label="锁定的版本ID" align="center" prop="lockedVersionId" />
      <el-table-column label="锁定的组件基础路径" align="center" prop="lockedComponentPath" />
      <el-table-column label="锁定的组件映射快照" align="center" prop="lockedComponentNames" />
      <el-table-column label="前置明细ID" align="center" prop="predecessorDetailId" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:schemereleasedetail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:schemereleasedetail:remove']">删除</el-button>
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

    <!-- 添加或修改填报方案发布明细（发布时快照）对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="schemereleasedetailRef" :model="form" :rules="rules" label-width="150px">
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
            <el-form-item label="指定版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入指定版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义参数" prop="customParams">
              <el-input v-model="form.customParams" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="锁定的版本ID" prop="lockedVersionId">
              <el-input v-model="form.lockedVersionId" placeholder="请输入锁定的版本ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="锁定的组件基础路径" prop="lockedComponentPath">
              <el-input v-model="form.lockedComponentPath" placeholder="请输入锁定的组件基础路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="锁定的组件映射快照" prop="lockedComponentNames">
              <el-input v-model="form.lockedComponentNames" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前置明细ID" prop="predecessorDetailId">
              <el-input v-model="form.predecessorDetailId" placeholder="请输入前置明细ID" />
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

<script setup name="Schemereleasedetail">
import { listSchemereleasedetail, getSchemereleasedetail, delSchemereleasedetail, addSchemereleasedetail, updateSchemereleasedetail } from "@/api/fill/schemereleasedetail"

const { proxy } = getCurrentInstance()

const schemereleasedetailList = ref([])
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
    versionCode: undefined,
    customParams: undefined,
    lockedVersionId: undefined,
    lockedComponentPath: undefined,
    lockedComponentNames: undefined,
    predecessorDetailId: undefined,
    orderNum: undefined,
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
    lockedVersionId: [
      { required: true, message: "锁定的版本ID不能为空", trigger: "blur" }
    ],
    lockedComponentPath: [
      { required: true, message: "锁定的组件基础路径不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报方案发布明细（发布时快照）列表 */
function getList() {
  loading.value = true
  listSchemereleasedetail(queryParams.value).then(response => {
    schemereleasedetailList.value = response.rows
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
    versionCode: null,
    customParams: null,
    lockedVersionId: null,
    lockedComponentPath: null,
    lockedComponentNames: null,
    predecessorDetailId: null,
    orderNum: null,
    delFlag: null,
    createBy: null,
    createTime: null
  }
  proxy.resetForm("schemereleasedetailRef")
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
  title.value = "添加填报方案发布明细（发布时快照）"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _releaseDetailId = row.releaseDetailId || ids.value
  getSchemereleasedetail(_releaseDetailId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案发布明细（发布时快照）"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schemereleasedetailRef"].validate(valid => {
    if (valid) {
      if (form.value.releaseDetailId != null) {
        updateSchemereleasedetail(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchemereleasedetail(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除填报方案发布明细（发布时快照）编号为"' + _releaseDetailIds + '"的数据项？').then(function() {
    return delSchemereleasedetail(_releaseDetailIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/schemereleasedetail/export', {
    ...queryParams.value
  }, `schemereleasedetail_${new Date().getTime()}.xlsx`)
}

getList()
</script>
