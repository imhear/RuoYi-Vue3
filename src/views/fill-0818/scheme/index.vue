<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="方案编码" prop="schemeCode">
        <el-input v-model="queryParams.schemeCode" placeholder="请输入方案编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="方案名称" prop="schemeName">
        <el-input v-model="queryParams.schemeName" placeholder="请输入方案名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="包含的分组类型数量" prop="groupTypeCount">
        <el-input v-model="queryParams.groupTypeCount" placeholder="请输入包含的分组类型数量" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="当前已发布版本ID" prop="currentReleaseId">
        <el-input v-model="queryParams.currentReleaseId" placeholder="请输入当前已发布版本ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['fill:scheme:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['fill:scheme:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['fill:scheme:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['fill:scheme:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleConfigure(scope.row)" v-hasPermi="['fill:scheme:configure']">配置</el-button>
          <el-button link type="primary" icon="" @click="handleUpdate(scope.row)" v-hasPermi="['fill:scheme:edit']">修改</el-button>
          <el-button link type="primary" icon="" @click="handleDelete(scope.row)" v-hasPermi="['fill:scheme:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="方案主键" align="center" prop="schemeId" />
      <el-table-column label="方案编码" align="center" prop="schemeCode" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="方案类型" align="center" prop="schemeType" />
      <el-table-column label="包含的分组类型数量" align="center" prop="groupTypeCount" />
      <el-table-column label="当前已发布版本ID" align="center" prop="currentReleaseId" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 配置对话框（三栏卡片布局） -->
    <el-dialog :title="configDialogTitle" v-model="configVisible" width="90%" top="5vh" destroy-on-close :close-on-click-modal="false">
      <el-row :gutter="10">
        <el-col :span="7">
          <SchemeGroupCard :scheme-id="currentSchemeId" @select="onGroupSelect" />
        </el-col>
        <el-col :span="7">
          <SchemeDetailCard :group-scheme-id="selectedGroupId" @select="onDetailSelect" />
        </el-col>
        <el-col :span="10">
          <SchemeOperationCard :detail-id="selectedDetailId" />
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 添加或修改填报方案设计态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="schemeRef" :model="form" :rules="rules" label-width="100px">
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

<script setup name="Scheme">
import { listScheme, getScheme, delScheme, addScheme, updateScheme } from "@/api/fill/scheme"
// 引入三个卡片组件
import SchemeGroupCard from './components/SchemeGroupCard.vue'
import SchemeDetailCard from './components/SchemeDetailCard.vue'
import SchemeOperationCard from './components/SchemeOperationCard.vue'

const { proxy } = getCurrentInstance()

const schemeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 配置对话框状态
const configVisible = ref(false)
const currentSchemeId = ref(null)       // 当前正在配置的方案ID
const selectedGroupId = ref(null)       // 左卡片选中的分组ID
const selectedDetailId = ref(null)      // 中卡片选中的明细ID
// 新增：配置对话框标题变量
const configDialogTitle = ref('配置填报方案')

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
    schemeCode: [{ required: true, message: "方案编码不能为空", trigger: "blur" }],
    schemeName: [{ required: true, message: "方案名称不能为空", trigger: "blur" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报方案设计态列表 */
function getList() {
  loading.value = true
  listScheme(queryParams.value).then(response => {
    schemeList.value = response.rows
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
    schemeId: null, schemeCode: null, schemeName: null, schemeType: null,
    groupTypeCount: null, currentReleaseId: null, status: null,
    remark: null, delFlag: null, createBy: null, createTime: null,
    updateBy: null, updateTime: null
  }
  proxy.resetForm("schemeRef")
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

/**
 * 配置按钮操作：打开三栏配置对话框
 */
function handleConfigure(row) {
  currentSchemeId.value = row.schemeId
  configDialogTitle.value = "修改[" + row.schemeCode + " "+ row.schemeName + "]填报方案配置"  // 动态设置标题
  selectedGroupId.value = null
  selectedDetailId.value = null
  configVisible.value = true
}

/**
 * 左卡片分组选中事件：联动加载中卡片明细
 */
function onGroupSelect(groupSchemeId) {
  selectedGroupId.value = groupSchemeId
  selectedDetailId.value = null  // 清空右卡片
}

/**
 * 中卡片明细选中事件：联动加载右卡片操作
 */
function onDetailSelect(detailId) {
  selectedDetailId.value = detailId
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _schemeId = row.schemeId || ids.value
  getScheme(_schemeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案设计态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schemeRef"].validate(valid => {
    if (valid) {
      if (form.value.schemeId != null) {
        updateScheme(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addScheme(form.value).then(() => {
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
    return delScheme(_schemeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/scheme/export', { ...queryParams.value }, `scheme_${new Date().getTime()}.xlsx`)
}

getList()
</script>