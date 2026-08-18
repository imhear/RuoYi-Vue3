<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联方案明细ID" prop="detailId">
        <el-input
          v-model="queryParams.detailId"
          placeholder="请输入关联方案明细ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作码" prop="operationCode">
        <el-input
          v-model="queryParams.operationCode"
          placeholder="请输入操作码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前端组件完整路径" prop="componentPath">
        <el-input
          v-model="queryParams.componentPath"
          placeholder="请输入前端组件完整路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否在聚合入口卡片上显示" prop="displayOnCard">
        <el-input
          v-model="queryParams.displayOnCard"
          placeholder="请输入是否在聚合入口卡片上显示"
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
          v-hasPermi="['fill:schemeoperation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:schemeoperation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:schemeoperation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:schemeoperation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemeoperationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="明细能力主键" align="center" prop="detailOperateId" />
      <el-table-column label="关联方案明细ID" align="center" prop="detailId" />
      <el-table-column label="操作码" align="center" prop="operationCode" />
      <el-table-column label="前端组件完整路径" align="center" prop="componentPath" />
      <el-table-column label="是否在聚合入口卡片上显示" align="center" prop="displayOnCard" />
      <el-table-column label="排序号" align="center" prop="sortOrder" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:schemeoperation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:schemeoperation:remove']">删除</el-button>
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

    <!-- 添加或修改填报操作设计态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="schemeoperationRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联方案明细ID" prop="detailId">
              <el-input v-model="form.detailId" placeholder="请输入关联方案明细ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作码" prop="operationCode">
              <el-input v-model="form.operationCode" placeholder="请输入操作码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端组件完整路径" prop="componentPath">
              <el-input v-model="form.componentPath" placeholder="请输入前端组件完整路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否在聚合入口卡片上显示" prop="displayOnCard">
              <el-input v-model="form.displayOnCard" placeholder="请输入是否在聚合入口卡片上显示" />
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

<script setup name="Schemeoperation">
import { listSchemeoperation, getSchemeoperation, delSchemeoperation, addSchemeoperation, updateSchemeoperation } from "@/api/fill/schemeoperation"

const { proxy } = getCurrentInstance()

const schemeoperationList = ref([])
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
    detailId: undefined,
    operationCode: undefined,
    componentPath: undefined,
    displayOnCard: undefined,
    sortOrder: undefined,
    status: undefined,
  },
  rules: {
    detailId: [
      { required: true, message: "关联方案明细ID不能为空", trigger: "blur" }
    ],
    operationCode: [
      { required: true, message: "操作码不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询填报操作设计态列表 */
function getList() {
  loading.value = true
  listSchemeoperation(queryParams.value).then(response => {
    schemeoperationList.value = response.rows
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
    detailOperateId: null,
    detailId: null,
    operationCode: null,
    componentPath: null,
    displayOnCard: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("schemeoperationRef")
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
  ids.value = selection.map(item => item.detailOperateId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加填报操作设计态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _detailOperateId = row.detailOperateId || ids.value
  getSchemeoperation(_detailOperateId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改填报操作设计态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schemeoperationRef"].validate(valid => {
    if (valid) {
      if (form.value.detailOperateId != null) {
        updateSchemeoperation(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchemeoperation(form.value).then(() => {
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
  const _detailOperateIds = row.detailOperateId || ids.value
  proxy.$modal.confirm('是否确认删除填报操作设计态编号为"' + _detailOperateIds + '"的数据项？').then(function() {
    return delSchemeoperation(_detailOperateIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/schemeoperation/export', {
    ...queryParams.value
  }, `schemeoperation_${new Date().getTime()}.xlsx`)
}

getList()
</script>
