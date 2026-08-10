<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联方案ID" prop="schemeId">
        <el-input
          v-model="queryParams.schemeId"
          placeholder="请输入关联方案ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布版本号" prop="releaseCode">
        <el-input
          v-model="queryParams.releaseCode"
          placeholder="请输入发布版本号"
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
          v-hasPermi="['fill:schemerelease:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:schemerelease:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:schemerelease:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:schemerelease:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemereleaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发布主键" align="center" prop="releaseId" />
      <el-table-column label="关联方案ID" align="center" prop="schemeId" />
      <el-table-column label="发布版本号" align="center" prop="releaseCode" />
      <el-table-column label="方案类型" align="center" prop="schemeType" />
      <el-table-column label="发布说明" align="center" prop="releaseNote" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:schemerelease:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:schemerelease:remove']">删除</el-button>
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

    <!-- 添加或修改填报方案发布对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="schemereleaseRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联方案ID" prop="schemeId">
              <el-input v-model="form.schemeId" placeholder="请输入关联方案ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布版本号" prop="releaseCode">
              <el-input v-model="form.releaseCode" placeholder="请输入发布版本号" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案类型" prop="schemeType">
              <el-input v-model="form.schemeType" placeholder="请输入方案类型" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布说明" prop="releaseNote">
              <el-input v-model="form.releaseNote" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="dict.value"
                    :value="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
          </el-form-item>
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

<script setup name="Schemerelease">
import { listSchemerelease, getSchemerelease, delSchemerelease, addSchemerelease, updateSchemerelease } from "@/api/fill/schemerelease"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict("sys_normal_disable")

const schemereleaseList = ref([])
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
    releaseCode: undefined,
    schemeType: undefined,
    releaseNote: undefined,
    status: undefined,
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

/** 查询填报方案发布列表 */
function getList() {
  loading.value = true
  listSchemerelease(queryParams.value).then(response => {
    schemereleaseList.value = response.rows
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
    releaseNote: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null
  }
  proxy.resetForm("schemereleaseRef")
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
  title.value = "添加填报方案发布"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _releaseId = row.releaseId || ids.value
  getSchemerelease(_releaseId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案发布"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schemereleaseRef"].validate(valid => {
    if (valid) {
      if (form.value.releaseId != null) {
        updateSchemerelease(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchemerelease(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除填报方案发布编号为"' + _releaseIds + '"的数据项？').then(function() {
    return delSchemerelease(_releaseIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/schemerelease/export', {
    ...queryParams.value
  }, `schemerelease_${new Date().getTime()}.xlsx`)
}

getList()
</script>
