<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发布版本号" prop="releaseCode">
        <el-input
          v-model="queryParams.releaseCode"
          placeholder="请输入发布版本号"
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
          v-hasPermi="['fill:scheme_release:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:scheme_release:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:scheme_release:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:scheme_release:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scheme_releaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发布主键" align="center" prop="releaseId" />
      <el-table-column label="关联方案ID" align="center" prop="schemeId" />
      <el-table-column label="发布版本号" align="center" prop="releaseCode" />
      <el-table-column label="方案类型" align="center" prop="schemeType" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="发布说明" align="center" prop="releaseNote" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:scheme_release:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:scheme_release:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:scheme_release:remove']">删除</el-button>
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

    <!-- 填报方案发布态详情抽屉 -->
    <scheme_release-view-drawer ref="scheme_releaseViewRef" />
    <!-- 添加或修改填报方案发布态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="scheme_releaseRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联方案ID" prop="schemeId">
              <el-input v-model="form.schemeId" placeholder="请输入关联方案ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布版本号" prop="releaseCode">
              <el-input v-model="form.releaseCode" placeholder="请输入发布版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案名称" prop="schemeName">
              <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布说明" prop="releaseNote">
              <el-input v-model="form.releaseNote" type="textarea" placeholder="请输入内容" />
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

<script setup name="Scheme_release">
import { listScheme_release, getScheme_release, delScheme_release, addScheme_release, updateScheme_release } from "@/api/fill/scheme_release"
import Scheme_releaseViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const scheme_releaseList = ref([])
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
    releaseCode: undefined,
    schemeName: undefined,
    status: undefined,
    delFlag: '0',
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    schemeId: [
      { required: true, message: "关联方案ID不能为空", trigger: "blur" }
    ],
    releaseCode: [
      { required: true, message: "发布版本号不能为空", trigger: "blur" }
    ],
    schemeType: [
      { required: true, message: "方案类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报方案发布态列表 */
function getList() {
  loading.value = true
  listScheme_release(queryParams.value).then(response => {
    scheme_releaseList.value = response.rows
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
    releaseId: null,
    schemeId: null,
    releaseCode: null,
    schemeType: null,
    schemeName: null,
    releaseNote: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("scheme_releaseRef")
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
  ids.value = selection.map(item => item.releaseId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报方案发布态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _releaseId = row.releaseId || ids.value
  getScheme_release(_releaseId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案发布态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scheme_releaseRef"].validate(valid => {
    if (valid) {
      if (form.value.releaseId != null) {
        updateScheme_release(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addScheme_release(form.value).then(() => {
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
  const _releaseIds = row.releaseId || ids.value
  proxy.$modal.confirm('是否确认删除填报方案发布态编号为"' + _releaseIds + '"的数据项？').then(function() {
    return delScheme_release(_releaseIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["scheme_releaseViewRef"].open(row.releaseId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/scheme_release/export', {
    ...queryParams.value
  }, `scheme_release_${new Date().getTime()}.xlsx`)
}

getList()
</script>
