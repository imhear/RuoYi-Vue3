<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联分组方案ID" prop="groupSchemeId">
        <el-input
          v-model="queryParams.groupSchemeId"
          placeholder="请输入关联分组方案ID"
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
      <el-form-item label="指定前端组件版本ID" prop="versionId">
        <el-input
          v-model="queryParams.versionId"
          placeholder="请输入指定前端组件版本ID"
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
          v-hasPermi="['fill:schemedetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:schemedetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:schemedetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:schemedetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemedetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="明细主键" align="center" prop="detailId" />
      <el-table-column label="关联分组方案ID" align="center" prop="groupSchemeId" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="指定前端组件版本ID" align="center" prop="versionId" />
      <el-table-column label="指定版本号" align="center" prop="versionCode" />
      <el-table-column label="自定义字段预赋值" align="center" prop="customParams" />
      <el-table-column label="前置明细ID" align="center" prop="predecessorDetailId" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:schemedetail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:schemedetail:remove']">删除</el-button>
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

    <!-- 添加或修改填报方案设计明细对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="schemedetailRef" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联分组方案ID" prop="groupSchemeId">
              <el-input v-model="form.groupSchemeId" placeholder="请输入关联分组方案ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入物理表名" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="指定前端组件版本ID" prop="versionId">
              <el-input v-model="form.versionId" placeholder="请输入指定前端组件版本ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="指定版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入指定版本号" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义字段预赋值" prop="customParams">
              <el-input v-model="form.customParams" type="textarea" placeholder='自定义字段预赋值（JSON格式，如 {"MaterialType":"PACKAGING_MATERIAL"}）' />
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

<script setup name="Schemedetail">
import { listSchemedetail, getSchemedetail, delSchemedetail, addSchemedetail, updateSchemedetail } from "@/api/fill/schemedetail"

const { proxy } = getCurrentInstance()

const schemedetailList = ref([])
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
    groupSchemeId: undefined,
    tableName: undefined,
    versionId: undefined,
    versionCode: undefined,
    customParams: undefined,
    predecessorDetailId: undefined,
    orderNum: undefined,
    status: undefined,
  },
  rules: {
    groupSchemeId: [{ required: true, message: "关联分组方案ID不能为空", trigger: "blur" } ],
    tableName: [{ required: true, message: "物理表名不能为空", trigger: "blur" }],
    versionId: [{ required: true, message: "指定前端组件版本ID不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示顺序不能为空", trigger: "blur" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报方案设计明细列表 */
function getList() {
  loading.value = true
  listSchemedetail(queryParams.value).then(response => {
    schemedetailList.value = response.rows
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
    detailId: null,
    groupSchemeId: null,
    tableName: null,
    versionId: null,
    versionCode: null,
    customParams: null,
    predecessorDetailId: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("schemedetailRef")
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
  ids.value = selection.map(item => item.detailId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报方案设计明细"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _detailId = row.detailId || ids.value
  getSchemedetail(_detailId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报方案设计明细"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schemedetailRef"].validate(valid => {
    if (valid) {
      if (form.value.detailId != null) {
        updateSchemedetail(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchemedetail(form.value).then(() => {
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
  const _detailIds = row.detailId || ids.value
  proxy.$modal.confirm('是否确认删除填报方案设计明细编号为"' + _detailIds + '"的数据项？').then(function() {
    return delSchemedetail(_detailIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/schemedetail/export', {
    ...queryParams.value
  }, `schemedetail_${new Date().getTime()}.xlsx`)
}

getList()
</script>
