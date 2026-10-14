<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联主表主键" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入关联主表主键"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序号" prop="seqNo">
        <el-input
          v-model="queryParams.seqNo"
          placeholder="请输入序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="不合格物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入不合格物料名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格" prop="spec">
        <el-input
          v-model="queryParams.spec"
          placeholder="请输入规格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="不合格总数量" prop="nonConformingQty">
        <el-input
          v-model="queryParams.nonConformingQty"
          placeholder="请输入不合格总数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="破损数量" prop="damageQty">
        <el-input
          v-model="queryParams.damageQty"
          placeholder="请输入破损数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="色差数量" prop="colorDifferenceQty">
        <el-input
          v-model="queryParams.colorDifferenceQty"
          placeholder="请输入色差数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="其他数量" prop="otherQty">
        <el-input
          v-model="queryParams.otherQty"
          placeholder="请输入其他数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="其他原因" prop="otherReason">
        <el-input
          v-model="queryParams.otherReason"
          placeholder="请输入其他原因"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乐观锁版本号" prop="revision">
        <el-input
          v-model="queryParams.revision"
          placeholder="请输入乐观锁版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统版本号" prop="sysVersion">
        <el-input
          v-model="queryParams.sysVersion"
          placeholder="请输入系统版本号"
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
          v-hasPermi="['bizdata:bizDisinfectionPackaging2Step6:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bizdata:bizDisinfectionPackaging2Step6:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bizdata:bizDisinfectionPackaging2Step6:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bizdata:bizDisinfectionPackaging2Step6:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bizDisinfectionPackaging2Step6List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="步骤主键" align="center" prop="stepId" />
      <el-table-column label="关联主表主键" align="center" prop="recordId" />
      <el-table-column label="序号" align="center" prop="seqNo" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="不合格物料名称" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="不合格总数量" align="center" prop="nonConformingQty" />
      <el-table-column label="是否破损原因" align="center" prop="damageFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.damageFlag ? scope.row.damageFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否色差原因" align="center" prop="colorDifferenceFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.colorDifferenceFlag ? scope.row.colorDifferenceFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否其他原因" align="center" prop="otherFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.otherFlag ? scope.row.otherFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="破损数量" align="center" prop="damageQty" />
      <el-table-column label="色差数量" align="center" prop="colorDifferenceQty" />
      <el-table-column label="其他数量" align="center" prop="otherQty" />
      <el-table-column label="其他原因" align="center" prop="otherReason" />
      <el-table-column label="是否销毁" align="center" prop="destroyFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.destroyFlag ? scope.row.destroyFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否剪毁" align="center" prop="shearFailureFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.shearFailureFlag ? scope.row.shearFailureFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bizdata:bizDisinfectionPackaging2Step6:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bizdata:bizDisinfectionPackaging2Step6:remove']">删除</el-button>
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
      <el-form ref="bizDisinfectionPackaging2Step6Ref" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联主表主键" prop="recordId">
              <el-input v-model="form.recordId" placeholder="请输入关联主表主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="序号" prop="seqNo">
              <el-input v-model="form.seqNo" placeholder="请输入序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不合格物料名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder="请输入不合格物料名称" />
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
            <el-form-item label="不合格总数量" prop="nonConformingQty">
              <el-input v-model="form.nonConformingQty" placeholder="请输入不合格总数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否破损原因" prop="damageFlag">
              <el-checkbox-group v-model="form.damageFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否色差原因" prop="colorDifferenceFlag">
              <el-checkbox-group v-model="form.colorDifferenceFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否其他原因" prop="otherFlag">
              <el-checkbox-group v-model="form.otherFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="破损数量" prop="damageQty">
              <el-input v-model="form.damageQty" placeholder="请输入破损数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="色差数量" prop="colorDifferenceQty">
              <el-input v-model="form.colorDifferenceQty" placeholder="请输入色差数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他数量" prop="otherQty">
              <el-input v-model="form.otherQty" placeholder="请输入其他数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他原因" prop="otherReason">
              <el-input v-model="form.otherReason" placeholder="请输入其他原因" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否销毁" prop="destroyFlag">
              <el-checkbox-group v-model="form.destroyFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否剪毁" prop="shearFailureFlag">
              <el-checkbox-group v-model="form.shearFailureFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
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
          <el-col :span="24">
            <el-form-item label="乐观锁版本号" prop="revision">
              <el-input v-model="form.revision" placeholder="请输入乐观锁版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统版本号" prop="sysVersion">
              <el-input v-model="form.sysVersion" placeholder="请输入系统版本号" />
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

<script setup name="BizDisinfectionPackaging2Step6">
import { listBizDisinfectionPackaging2Step6, getBizDisinfectionPackaging2Step6, delBizDisinfectionPackaging2Step6, addBizDisinfectionPackaging2Step6, updateBizDisinfectionPackaging2Step6 } from "@/api/bizdata/bizDisinfectionPackaging2Step6"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = useDict('sys_yes_no')

const bizDisinfectionPackaging2Step6List = ref([])
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
    seqNo: undefined,
    materialCode: undefined,
    materialName: undefined,
    spec: undefined,
    unit: undefined,
    nonConformingQty: undefined,
    damageFlag: undefined,
    colorDifferenceFlag: undefined,
    otherFlag: undefined,
    damageQty: undefined,
    colorDifferenceQty: undefined,
    otherQty: undefined,
    otherReason: undefined,
    destroyFlag: undefined,
    shearFailureFlag: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
    recordId: [
      { required: true, message: "关联主表主键不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录2子步骤6业务字段列表 */
function getList() {
  loading.value = true
  listBizDisinfectionPackaging2Step6(queryParams.value).then(response => {
    bizDisinfectionPackaging2Step6List.value = response.rows
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
    seqNo: null,
    materialCode: null,
    materialName: null,
    spec: null,
    unit: null,
    nonConformingQty: null,
    damageFlag: [],
    colorDifferenceFlag: [],
    otherFlag: [],
    damageQty: null,
    colorDifferenceQty: null,
    otherQty: null,
    otherReason: null,
    destroyFlag: [],
    shearFailureFlag: [],
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("bizDisinfectionPackaging2Step6Ref")
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
  getBizDisinfectionPackaging2Step6(_stepId).then(response => {
    form.value = response.data
    form.value.damageFlag = form.value.damageFlag.split(",")
    form.value.colorDifferenceFlag = form.value.colorDifferenceFlag.split(",")
    form.value.otherFlag = form.value.otherFlag.split(",")
    form.value.destroyFlag = form.value.destroyFlag.split(",")
    form.value.shearFailureFlag = form.value.shearFailureFlag.split(",")
    open.value = true
    title.value = "修改灌装包材处理记录2子步骤6业务字段"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bizDisinfectionPackaging2Step6Ref"].validate(valid => {
    if (valid) {
      form.value.damageFlag = form.value.damageFlag.join(",")
      form.value.colorDifferenceFlag = form.value.colorDifferenceFlag.join(",")
      form.value.otherFlag = form.value.otherFlag.join(",")
      form.value.destroyFlag = form.value.destroyFlag.join(",")
      form.value.shearFailureFlag = form.value.shearFailureFlag.join(",")
      if (form.value.stepId != null) {
        updateBizDisinfectionPackaging2Step6(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBizDisinfectionPackaging2Step6(form.value).then(() => {
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
    return delBizDisinfectionPackaging2Step6(_stepIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bizdata/bizDisinfectionPackaging2Step6/export', {
    ...queryParams.value
  }, `bizDisinfectionPackaging2Step6_${new Date().getTime()}.xlsx`)
}

getList()
</script>
