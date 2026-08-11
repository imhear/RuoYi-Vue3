<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联表单ID" prop="formId">
        <el-input
          v-model="queryParams.formId"
          placeholder="请输入关联表单ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本号" prop="versionCode">
        <el-input
          v-model="queryParams.versionCode"
          placeholder="请输入版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本名称" prop="versionName">
        <el-input
          v-model="queryParams.versionName"
          placeholder="请输入版本名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否当前生效版本" prop="isCurrent">
        <el-input
          v-model="queryParams.isCurrent"
          placeholder="请输入是否当前生效版本"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生效日期" prop="effectiveDate">
        <el-date-picker clearable
          v-model="queryParams.effectiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择生效日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="前端组件基础路径" prop="componentBasePath">
        <el-input
          v-model="queryParams.componentBasePath"
          placeholder="请输入前端组件基础路径"
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
          v-hasPermi="['fill:componentsversion:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:componentsversion:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:componentsversion:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:componentsversion:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="componentsversionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="100">
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleUpdate(scope.row)" v-hasPermi="['fill:componentsversion:edit']">修改</el-button>
          <el-button link type="primary" icon="" @click="handleDelete(scope.row)" v-hasPermi="['fill:componentsversion:remove']">删除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="版本主键" align="center" prop="versionId" /> -->
      <!-- <el-table-column label="关联表单ID" align="center" prop="formId" /> -->
      <el-table-column label="版本号" align="center" prop="versionCode" />
      <el-table-column label="版本名称" align="center" prop="versionName" />
      <el-table-column label="是否当前生效版本" align="center" prop="isCurrent" />
      <el-table-column label="生效日期" align="center" prop="effectiveDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端组件基础路径" align="center" prop="componentBasePath" />
      <el-table-column label="自定义组件映射" align="center" prop="componentNames" />
      <!-- <el-table-column label="变更说明" align="center" prop="changelog" /> -->
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="物理表名" align="center" prop="tableName" :show-overflow-tooltip="true" min-width="100"/>
      <el-table-column label="物理表注释" align="center" prop="tableComment" :show-overflow-tooltip="true" min-width="130"/>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改前端组件版本对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="componentsversionRef" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <!-- <el-col :span="24">
            <el-form-item label="关联表单ID" prop="formId">
              <el-input v-model="form.formId" placeholder="请输入关联表单ID" disabled/>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="物理表名（自动填充）" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表注释" prop="tableComment">
              <el-input v-model="form.tableComment" placeholder="物理表注释（自动填充）" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端组件基础路径" prop="componentBasePath">
              <el-input v-model="form.componentBasePath" placeholder="前端组件基础路径（如 filling/versions/v1.0.0/）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义组件映射" prop="componentNames">
              <el-input v-model="form.componentNames" type="textarea" placeholder='自定义组件映射（JSON格式，如 {"handle":"Handle.vue","review":"Review.vue"}）' />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入版本号" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版本名称" prop="versionName">
              <el-input v-model="form.versionName" placeholder="请输入版本名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否当前生效版本" prop="isCurrent">
              <el-input v-model="form.isCurrent" placeholder="请输入是否当前生效版本" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker clearable
                v-model="form.effectiveDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择生效日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="变更说明" prop="changelog">
              <el-input v-model="form.changelog" type="textarea" placeholder="请输入内容" />
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

    <!-- 选择表单模板对话框（独立组件） -->
    <SelectFormTemplate ref="selectTemplateRef" @ok="onTemplateSelected" />
  </div>
</template>

<script setup name="Componentsversion">
import { ref, reactive, toRefs, watch } from 'vue'   // 新增 watch
import { listComponentsversion, getComponentsversion, delComponentsversion, addComponentsversion, updateComponentsversion } from "@/api/fill/componentsversion"
// 引入选择表单模板组件
import SelectFormTemplate from "./SelectFormTemplate.vue"

const { proxy } = getCurrentInstance()

const componentsversionList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 选择表单模板组件引用
const selectTemplateRef = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    formId: undefined,
    tableName: null,          // 新增
    tableComment: null,       // 新增
    versionCode: undefined,
    versionName: undefined,
    isCurrent: undefined,
    effectiveDate: undefined,
    componentBasePath: undefined,
    componentNames: undefined,
    changelog: undefined,
    status: undefined,
  },
  rules: {
    formId: [{ required: true, message: "关联表单ID不能为空", trigger: "blur" } ],
    versionCode: [{ required: true, message: "版本号不能为空", trigger: "blur" } ],
    componentBasePath: [{ required: true, message: "前端组件基础路径不能为空", trigger: "blur" } ],
    componentNames: [{ required: true, message: "自定义组件映射不能为空", trigger: "blur" } ],
  }
})

const { queryParams, form, rules } = toRefs(data)

// ===== 新增：监听 componentBasePath 变化，自动截取版本号 =====
watch(
  () => form.value.componentBasePath,
  (newVal) => {
    if (newVal && typeof newVal === 'string') {
      // 截取 versions/ 和下一个 / 之间的内容
      const match = newVal.match(/versions\/(.*?)\//)
      if (match) {
        form.value.versionCode = match[1]      // 如 v1.0.0
      } else {
        form.value.versionCode = ''            // 不符合格式则清空
      }
    } else {
      form.value.versionCode = ''
    }
  }
)

/** 查询前端组件版本列表 */
function getList() {
  loading.value = true
  listComponentsversion(queryParams.value).then(response => {
    componentsversionList.value = response.rows
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
    versionId: null,
    formId: null,
    versionCode: null,
    versionName: null,
    isCurrent: null,
    effectiveDate: null,
    componentBasePath: null,
    componentNames: null,
    changelog: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("componentsversionRef")
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
  ids.value = selection.map(item => item.versionId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/**
 * 新增按钮操作：打开选择表单模板对话框（完全参考代码生成导入逻辑）
 */
function handleAdd() {
  // 调用独立组件的 show 方法
  selectTemplateRef.value.show()
}

/**
 * 选择模板确认回调：接收选中行数据，直接打开新增对话框并填充 formId
 * @param {Object} row 选中的表单模板行数据
 */
function onTemplateSelected(row) {
  reset()                           // 重置新增表单
  form.value.formId = row.formId    // 将选中的 formId 赋值给新增表单
  form.value.tableName = row.tableName   // 物理表名（新增冗余字段）
  form.value.tableComment = row.tableComment // 物理表注释（可选，用于调试）
  open.value = true                 // 打开新增对话框
  title.value = "添加前端组件版本"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _versionId = row.versionId || ids.value
  getComponentsversion(_versionId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改前端组件版本"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["componentsversionRef"].validate(valid => {
    if (valid) {
      if (form.value.versionId != null) {
        updateComponentsversion(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addComponentsversion(form.value).then(() => {
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
  const _versionIds = row.versionId || ids.value
  proxy.$modal.confirm('是否确认删除前端组件版本编号为"' + _versionIds + '"的数据项？').then(function() {
    return delComponentsversion(_versionIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/componentsversion/export', {
    ...queryParams.value
  }, `componentsversion_${new Date().getTime()}.xlsx`)
}

getList()
</script>
