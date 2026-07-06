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
          v-hasPermi="['bottling:ProDisinfectionPackaging2Step6:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:ProDisinfectionPackaging2Step6:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:ProDisinfectionPackaging2Step6:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:ProDisinfectionPackaging2Step6:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ProDisinfectionPackaging2Step6List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="步骤主键" align="center" prop="stepId" />
      <el-table-column label="关联记录主键" align="center" prop="recordId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="排产单号" align="center" prop="planCode" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="不合格物料名称" align="center" prop="materialName">
        <template #default="scope">
          <dict-tag :options="receiving_material" :value="scope.row.materialName"/>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="unit">
        <template #default="scope">
          <dict-tag :options="pro_unit" :value="scope.row.unit"/>
        </template>
      </el-table-column>
      <el-table-column label="不合格总数量" align="center" prop="s6NonConformingQty" />
      <el-table-column label="是否破损原因" align="center" prop="s6DamageFlag" />
      <el-table-column label="是否色差原因" align="center" prop="s6ColorDifferenceFlag" />
      <el-table-column label="是否其他原因" align="center" prop="s6OtherFlag" />
      <el-table-column label="破损数量" align="center" prop="s6DamageQty" />
      <el-table-column label="色差数量" align="center" prop="s6ColorDifferenceQty" />
      <el-table-column label="其他数量" align="center" prop="s6OtherQty" />
      <el-table-column label="其他原因" align="center" prop="s6OtherReason" />
      <el-table-column label="是否销毁" align="center" prop="s6DestroyFlag" />
      <el-table-column label="是否剪毁" align="center" prop="s6ShearFailureFlag" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:ProDisinfectionPackaging2Step6:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:ProDisinfectionPackaging2Step6:remove']">删除</el-button>
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

    <!-- 添加或修改灌装包材处理记录2子步骤6业务字段对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="ProDisinfectionPackaging2Step6Ref" :model="form" :rules="rules" label-width="100px">
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
            <el-form-item label="不合格物料名称" prop="materialName">
              <el-select v-model="form.materialName" placeholder="请选择不合格物料名称">
                <el-option
                  v-for="dict in receiving_material"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择单位">
                <el-option
                  v-for="dict in pro_unit"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不合格总数量" prop="s6NonConformingQty">
              <el-input v-model="form.s6NonConformingQty" placeholder="请输入不合格总数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="破损数量" prop="s6DamageQty">
              <el-input v-model="form.s6DamageQty" placeholder="请输入破损数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="色差数量" prop="s6ColorDifferenceQty">
              <el-input v-model="form.s6ColorDifferenceQty" placeholder="请输入色差数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他数量" prop="s6OtherQty">
              <el-input v-model="form.s6OtherQty" placeholder="请输入其他数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他原因" prop="s6OtherReason">
              <el-input v-model="form.s6OtherReason" placeholder="请输入其他原因" />
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

<script setup name="ProDisinfectionPackaging2Step6">
import { listProDisinfectionPackaging2Step6, getProDisinfectionPackaging2Step6, delProDisinfectionPackaging2Step6, addProDisinfectionPackaging2Step6, updateProDisinfectionPackaging2Step6 } from "@/api/bottling/disinfectionPackaging2Step6"

const { proxy } = getCurrentInstance()
const { pro_unit, receiving_material } = useDict('pro_unit', 'receiving_material')

const ProDisinfectionPackaging2Step6List = ref([])
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

/** 查询灌装包材处理记录2子步骤6业务字段列表 */
function getList() {
  loading.value = true
  listProDisinfectionPackaging2Step6(queryParams.value).then(response => {
    ProDisinfectionPackaging2Step6List.value = response.rows
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
    unit: null,
    s6NonConformingQty: null,
    s6DamageFlag: [],
    s6ColorDifferenceFlag: [],
    s6OtherFlag: [],
    s6DamageQty: null,
    s6ColorDifferenceQty: null,
    s6OtherQty: null,
    s6OtherReason: null,
    s6DestroyFlag: [],
    s6ShearFailureFlag: [],
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("ProDisinfectionPackaging2Step6Ref")
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
  title.value = "添加灌装包材处理记录2子步骤6业务字段"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _stepId = row.stepId || ids.value
  getProDisinfectionPackaging2Step6(_stepId).then(response => {
    form.value = response.data
    form.value.s6DamageFlag = form.value.s6DamageFlag.split(",")
    form.value.s6ColorDifferenceFlag = form.value.s6ColorDifferenceFlag.split(",")
    form.value.s6OtherFlag = form.value.s6OtherFlag.split(",")
    form.value.s6DestroyFlag = form.value.s6DestroyFlag.split(",")
    form.value.s6ShearFailureFlag = form.value.s6ShearFailureFlag.split(",")
    open.value = true
    title.value = "修改灌装包材处理记录2子步骤6业务字段"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["ProDisinfectionPackaging2Step6Ref"].validate(valid => {
    if (valid) {
      form.value.s6DamageFlag = form.value.s6DamageFlag.join(",")
      form.value.s6ColorDifferenceFlag = form.value.s6ColorDifferenceFlag.join(",")
      form.value.s6OtherFlag = form.value.s6OtherFlag.join(",")
      form.value.s6DestroyFlag = form.value.s6DestroyFlag.join(",")
      form.value.s6ShearFailureFlag = form.value.s6ShearFailureFlag.join(",")
      if (form.value.stepId != null) {
        updateProDisinfectionPackaging2Step6(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addProDisinfectionPackaging2Step6(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除灌装包材处理记录2子步骤6业务字段编号为"' + _stepIds + '"的数据项？').then(function() {
    return delProDisinfectionPackaging2Step6(_stepIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/ProDisinfectionPackaging2Step6/export', {
    ...queryParams.value
  }, `ProDisinfectionPackaging2Step6_${new Date().getTime()}.xlsx`)
}

getList()
</script>
