<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入工单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排产单号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入排产单号"
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
          v-hasPermi="['bottling:disinfectionPackaging1Step4:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:disinfectionPackaging1Step4:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:disinfectionPackaging1Step4:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:disinfectionPackaging1Step4:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="disinfectionPackaging1Step4List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="步骤主键" align="center" prop="stepId" />
      <el-table-column label="关联记录主键" align="center" prop="recordId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="排产单号" align="center" prop="planCode" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="领入量" align="center" prop="receiveQty" />
      <el-table-column label="使用量" align="center" prop="useQty" />
      <el-table-column label="损耗量" align="center" prop="lossQty" />
      <el-table-column label="剩余量" align="center" prop="remainQty" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:disinfectionPackaging1Step4:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:disinfectionPackaging1Step4:remove']">删除</el-button>
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

    <!-- 添加或修改灌装包材处理记录1子步骤4业务字段对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="disinfectionPackaging1Step4Ref" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联记录主键" prop="recordId">
              <el-input v-model="form.recordId" placeholder="请输入关联记录主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排产单号" prop="planCode">
              <el-input v-model="form.planCode" placeholder="请输入排产单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder="请输入物料名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="领入量" prop="receiveQty">
              <el-input v-model="form.receiveQty" placeholder="请输入领入量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="使用量" prop="useQty">
              <el-input v-model="form.useQty" placeholder="请输入使用量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="损耗量" prop="lossQty">
              <el-input v-model="form.lossQty" placeholder="请输入损耗量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="剩余量" prop="remainQty">
              <el-input v-model="form.remainQty" placeholder="请输入剩余量" />
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

<script setup name="DisinfectionPackaging1Step4">
import { listDisinfectionPackaging1Step4, getDisinfectionPackaging1Step4, delDisinfectionPackaging1Step4, addDisinfectionPackaging1Step4, updateDisinfectionPackaging1Step4 } from "@/api/bottling/disinfectionPackaging1Step4"

const { proxy } = getCurrentInstance()

const disinfectionPackaging1Step4List = ref([])
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
    orderNum: undefined,
    planCode: undefined,
  },
  rules: {
    recordId: [
      { required: true, message: "关联记录主键不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录1子步骤4业务字段列表 */
function getList() {
  loading.value = true
  listDisinfectionPackaging1Step4(queryParams.value).then(response => {
    disinfectionPackaging1Step4List.value = response.rows
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
    stepId: null,
    recordId: null,
    orderNum: null,
    planCode: null,
    materialCode: null,
    materialName: null,
    spec: null,
    unit: null,
    receiveQty: null,
    useQty: null,
    lossQty: null,
    remainQty: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("disinfectionPackaging1Step4Ref")
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
  ids.value = selection.map(item => item.stepId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加灌装包材处理记录1子步骤4业务字段"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _stepId = row.stepId || ids.value
  getDisinfectionPackaging1Step4(_stepId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装包材处理记录1子步骤4业务字段"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["disinfectionPackaging1Step4Ref"].validate(valid => {
    if (valid) {
      if (form.value.stepId != null) {
        updateDisinfectionPackaging1Step4(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDisinfectionPackaging1Step4(form.value).then(() => {
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
  const _stepIds = row.stepId || ids.value
  proxy.$modal.confirm('是否确认删除灌装包材处理记录1子步骤4业务字段编号为"' + _stepIds + '"的数据项？').then(function() {
    return delDisinfectionPackaging1Step4(_stepIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/disinfectionPackaging1Step4/export', {
    ...queryParams.value
  }, `disinfectionPackaging1Step4_${new Date().getTime()}.xlsx`)
}

getList()
</script>
