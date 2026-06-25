<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联主表" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入关联主表"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="取样时间" prop="sampleTime">
        <el-date-picker clearable
          v-model="queryParams.sampleTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择取样时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="取样日期" prop="sampleDate">
        <el-date-picker clearable
          v-model="queryParams.sampleDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择取样日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="灌装头编号" prop="nozzleNo">
        <el-input
          v-model="queryParams.nozzleNo"
          placeholder="请输入灌装头编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="复核人" prop="reviewer">
        <el-input
          v-model="queryParams.reviewer"
          placeholder="请输入复核人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检查人" prop="inspector">
        <el-input
          v-model="queryParams.inspector"
          placeholder="请输入检查人"
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
          v-hasPermi="['bottling:fillingMain:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:fillingMain:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:fillingMain:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:fillingMain:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillingMainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="子表主键" align="center" prop="mainId" />
      <el-table-column label="关联主表" align="center" prop="recordId" />
      <el-table-column label="取样时间" align="center" prop="sampleTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sampleTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="取样日期" align="center" prop="sampleDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sampleDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="灌装头编号" align="center" prop="nozzleNo" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="复核人" align="center" prop="reviewer" />
      <el-table-column label="检查人" align="center" prop="inspector" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:fillingMain:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:fillingMain:remove']">删除</el-button>
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

    <!-- 添加或修改灌装量记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillingMainRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联主表" prop="recordId">
              <el-input v-model="form.recordId" placeholder="请输入关联主表" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="取样时间" prop="sampleTime">
              <el-date-picker clearable
                v-model="form.sampleTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择取样时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="取样日期" prop="sampleDate">
              <el-date-picker clearable
                v-model="form.sampleDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择取样日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="灌装头编号" prop="nozzleNo">
              <el-input v-model="form.nozzleNo" placeholder="请输入灌装头编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人" prop="reviewer">
              <el-input v-model="form.reviewer" placeholder="请输入复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人" prop="inspector">
              <el-input v-model="form.inspector" placeholder="请输入检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="FillingMain">
import { listFillingMain, getFillingMain, delFillingMain, addFillingMain, updateFillingMain } from "@/api/bottling/fillingMain"

const { proxy } = getCurrentInstance()

const fillingMainList = ref([])
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
    recordId: undefined,
    sampleTime: undefined,
    sampleDate: undefined,
    nozzleNo: undefined,
    operator: undefined,
    reviewer: undefined,
    inspector: undefined,
  },
  rules: {
    recordId: [
      { required: true, message: "关联主表不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装量记录列表 */
function getList() {
  loading.value = true
  listFillingMain(queryParams.value).then(response => {
    fillingMainList.value = response.rows
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
    mainId: null,
    recordId: null,
    sampleTime: null,
    sampleDate: null,
    nozzleNo: null,
    operator: null,
    reviewer: null,
    inspector: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillingMainRef")
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
  ids.value = selection.map(item => item.mainId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加灌装量记录"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _mainId = row.mainId || ids.value
  getFillingMain(_mainId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装量记录"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillingMainRef"].validate(valid => {
    if (valid) {
      if (form.value.mainId != null) {
        updateFillingMain(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFillingMain(form.value).then(() => {
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
  const _mainIds = row.mainId || ids.value
  proxy.$modal.confirm('是否确认删除灌装量记录编号为"' + _mainIds + '"的数据项？').then(function() {
    return delFillingMain(_mainIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/fillingMain/export', {
    ...queryParams.value
  }, `fillingMain_${new Date().getTime()}.xlsx`)
}

getList()
</script>
