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
          icon="Upload"
          @click="handleImportClick"
          v-hasPermi="['fill:scheme_design:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['fill:scheme_design:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:scheme_design:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:scheme_design:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:scheme_design:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scheme_designList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Grid" @click="openConfig(scope.row)">配置</el-button>
          <el-button link type="primary" icon="Upload" @click="handleRelease(scope.row)" v-hasPermi="['fill:scheme_design:release']">发布</el-button>
          <el-button link type="primary" icon="Download" @click="handleExport(scope.row)" v-hasPermi="['fill:scheme_design:export']">导出</el-button>
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:scheme_design:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:scheme_design:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:scheme_design:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="方案主键" align="center" prop="schemeId" />
      <el-table-column label="方案编码" align="center" prop="schemeCode" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="方案类型" align="center" prop="schemeType" />
      <el-table-column label="包含的分组类型数量" align="center" prop="groupTypeCount" />
      <el-table-column label="当前已发布版本ID" align="center" prop="currentReleaseId" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 填报方案设计态详情抽屉 -->
    <scheme_design-view-drawer ref="scheme_designViewRef" />
    <!-- 添加或修改填报方案设计态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="scheme_designRef" :model="form" :rules="rules" label-width="100px">
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
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

    <!-- 设计态配置对话框 -->
    <DesignConfigDialog ref="designConfigRef" :scheme-id="currentSchemeId" />

    <!-- 发布方案对话框 -->
    <el-dialog title="发布方案" v-model="releaseVisible" width="400px" append-to-body>
      <el-form :model="releaseForm" :rules="releaseRules" ref="releaseFormRef" label-width="80px">
        <el-form-item label="发布说明" prop="releaseNote">
          <el-input v-model="releaseForm.releaseNote" type="textarea" placeholder="请输入发布说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="releaseVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRelease">确定</el-button>
      </template>
    </el-dialog>

    <!-- 隐藏的文件选择 -->
    <input
      ref="importInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleImportFile"
    />

    <!-- 导入预览对话框 -->
    <ImportPreviewDialog
      v-model="importPreviewVisible"
      :scheme="previewScheme"
      :menus="previewMenus"
      @confirm="handleImportConfirm"
    />
  </div>
</template>

<script setup name="Scheme_design">
import { listScheme_design, getScheme_design, delScheme_design, addScheme_design, updateScheme_design, releaseScheme, exportScheme, importScheme } from "@/api/fill/scheme_design"
import Scheme_designViewDrawer from "./view"
import DesignConfigDialog from './components/DesignConfigDialog.vue'
import ImportPreviewDialog from './components/ImportPreviewDialog.vue'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const scheme_designList = ref([])
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
    delFlag: '0',
    orderByColumn: 'create_time',
    isAsc: 'desc'
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


//配置功能
const designConfigRef = ref(null)
const currentSchemeId = ref(null)

function openConfig(row) {
  currentSchemeId.value = row.schemeId
  nextTick(() => {
    designConfigRef.value?.open()
  })
}

/** 查询填报方案设计态列表 */
function getList() {
  loading.value = true
  listScheme_design(queryParams.value).then(response => {
    scheme_designList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 发布功能
const releaseVisible = ref(false)
const releaseFormRef = ref(null)
const releaseForm = reactive({ schemeId: null, releaseNote: '' })
const releaseRules = { releaseNote: [{ required: false }] }

function handleRelease(row) {
  releaseForm.schemeId = row.schemeId
  releaseForm.releaseNote = ''
  releaseVisible.value = true
  nextTick(() => releaseFormRef.value?.clearValidate())
}

function submitRelease() {
  releaseFormRef.value?.validate(valid => {
    if (!valid) return
    releaseScheme(releaseForm.schemeId, releaseForm.releaseNote).then(() => {
      proxy.$modal.msgSuccess('发布成功')
      releaseVisible.value = false
      getList()
    })
  })
}

//导入导出功能
const importInput = ref(null)
const importPreviewVisible = ref(false)
const previewScheme = ref(null)
const previewMenus = ref([])

function handleExport(row) {
  exportScheme(row.schemeId).then(response => {
    // 创建下载链接
    const blob = new Blob([response], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${row.schemeCode}_${row.schemeName}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  })
}

/** 点击导入按钮，触发文件选择 */
function handleImportClick() {
  importInput.value?.click()
}

/** 文件选择变化，解析 JSON 并打开预览 */
function handleImportFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const rawText = e.target.result
      const parsed = JSON.parse(rawText)
      // 兼容旧版本带有 AjaxResult 包装的文件
      let schemeData = parsed
      if (parsed.data && parsed.data.scheme && parsed.data.menus) {
        schemeData = parsed.data
      }
      if (!schemeData.scheme || !schemeData.menus) {
        throw new Error('文件格式不正确')
      }
      previewScheme.value = schemeData.scheme
      previewMenus.value = schemeData.menus
      importPreviewVisible.value = true
    } catch (err) {
      proxy.$modal.msgError('导入文件解析失败：' + err.message)
    }
  }
  reader.readAsText(file)
  // 清除 input 值，允许重复选择同一文件
  event.target.value = ''
}

/** 确认导入，重新构造 JSON 字符串并调用后端 */
function handleImportConfirm() {
  const jsonObj = {
    scheme: previewScheme.value,
    menus: previewMenus.value
  }
  const jsonStr = JSON.stringify(jsonObj)
  importScheme(jsonStr).then(res => {
    proxy.$modal.msgSuccess(res.msg || '导入成功')
    importPreviewVisible.value = false
    getList()
  }).catch(() => {})
}
// function handleImport() {
//   proxy.$refs.importInput.click()
// }

// function handleImportFile(event) {
//   const file = event.target.files[0]
//   if (!file) return
//   const formData = new FormData()
//   formData.append('file', file)
//   importScheme(formData).then(res => {
//     proxy.$modal.msgSuccess(res.msg || '导入成功')
//     getList()
//   }).catch(() => {})
// }



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
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("scheme_designRef")
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
  title.value = "添加填报方案设计态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _schemeId = row.schemeId || ids.value
  getScheme_design(_schemeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案设计态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scheme_designRef"].validate(valid => {
    if (valid) {
      if (form.value.schemeId != null) {
        updateScheme_design(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addScheme_design(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除填报方案设计态编号为"' + _schemeIds + '"的数据项？').then(function() {
    return delScheme_design(_schemeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["scheme_designViewRef"].open(row.schemeId)
}

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('fill/scheme_design/export', {
//     ...queryParams.value
//   }, `scheme_design_${new Date().getTime()}.xlsx`)
// }

getList()
</script>
