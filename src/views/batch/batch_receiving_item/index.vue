<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联领料单主键" prop="receivingId">
        <el-input
          v-model="queryParams.receivingId"
          placeholder="请输入关联领料单主键"
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
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
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
      <el-form-item label="计划领用量" prop="requireQty">
        <el-input
          v-model="queryParams.requireQty"
          placeholder="请输入计划领用量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包装是否完整" prop="baozhuangFlag">
        <el-input
          v-model="queryParams.baozhuangFlag"
          placeholder="请输入包装是否完整"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签是否正确" prop="biaoqianFlag">
        <el-input
          v-model="queryParams.biaoqianFlag"
          placeholder="请输入标签是否正确"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否无发霉/变质/生虫/变色等" prop="waiguanFlag">
        <el-input
          v-model="queryParams.waiguanFlag"
          placeholder="请输入是否无发霉/变质/生虫/变色等"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否已放行" prop="fangxingFlag">
        <el-input
          v-model="queryParams.fangxingFlag"
          placeholder="请输入是否已放行"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入物料批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际发料量" prop="actualQty">
        <el-input
          v-model="queryParams.actualQty"
          placeholder="请输入实际发料量"
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
          v-hasPermi="['batch:batch_receiving_item:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['batch:batch_receiving_item:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['batch:batch_receiving_item:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['batch:batch_receiving_item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batch_receiving_itemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="明细主键" align="center" prop="itemId" />
      <el-table-column label="关联领料单主键" align="center" prop="receivingId" />
      <el-table-column label="序号" align="center" prop="seqNo" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="计划领用量" align="center" prop="requireQty" />
      <el-table-column label="包装是否完整" align="center" prop="baozhuangFlag" />
      <el-table-column label="标签是否正确" align="center" prop="biaoqianFlag" />
      <el-table-column label="是否无发霉/变质/生虫/变色等" align="center" prop="waiguanFlag" />
      <el-table-column label="是否已放行" align="center" prop="fangxingFlag" />
      <el-table-column label="物料批号" align="center" prop="batchNumber" />
      <el-table-column label="实际发料量" align="center" prop="actualQty" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['batch:batch_receiving_item:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['batch:batch_receiving_item:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_receiving_item:remove']">删除</el-button>
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

    <!-- 领料单子表详情抽屉 -->
    <batch_receiving_item-view-drawer ref="batch_receiving_itemViewRef" />
    <!-- 添加或修改领料单子表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batch_receiving_itemRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联领料单主键" prop="receivingId">
              <el-input v-model="form.receivingId" placeholder="请输入关联领料单主键" />
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
            <el-form-item label="计划领用量" prop="requireQty">
              <el-input v-model="form.requireQty" placeholder="请输入计划领用量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包装是否完整" prop="baozhuangFlag">
              <el-input v-model="form.baozhuangFlag" placeholder="请输入包装是否完整" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签是否正确" prop="biaoqianFlag">
              <el-input v-model="form.biaoqianFlag" placeholder="请输入标签是否正确" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否无发霉/变质/生虫/变色等" prop="waiguanFlag">
              <el-input v-model="form.waiguanFlag" placeholder="请输入是否无发霉/变质/生虫/变色等" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否已放行" prop="fangxingFlag">
              <el-input v-model="form.fangxingFlag" placeholder="请输入是否已放行" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料批号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="请输入物料批号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实际发料量" prop="actualQty">
              <el-input v-model="form.actualQty" placeholder="请输入实际发料量" />
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

<script setup name="Batch_receiving_item">
import { listBatch_receiving_item, getBatch_receiving_item, delBatch_receiving_item, addBatch_receiving_item, updateBatch_receiving_item } from "@/api/batch/batch_receiving_item"
import Batch_receiving_itemViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const batch_receiving_itemList = ref([])
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
    receivingId: undefined,
    seqNo: undefined,
    materialCode: undefined,
    materialName: undefined,
    spec: undefined,
    unit: undefined,
    requireQty: undefined,
    baozhuangFlag: undefined,
    biaoqianFlag: undefined,
    waiguanFlag: undefined,
    fangxingFlag: undefined,
    batchNumber: undefined,
    actualQty: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
    receivingId: [
      { required: true, message: "关联领料单主键不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询领料单子表列表 */
function getList() {
  loading.value = true
  listBatch_receiving_item(queryParams.value).then(response => {
    batch_receiving_itemList.value = response.rows
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
    itemId: null,
    receivingId: null,
    seqNo: null,
    materialCode: null,
    materialName: null,
    spec: null,
    unit: null,
    requireQty: null,
    baozhuangFlag: null,
    biaoqianFlag: null,
    waiguanFlag: null,
    fangxingFlag: null,
    batchNumber: null,
    actualQty: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("batch_receiving_itemRef")
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
  ids.value = selection.map(item => item.itemId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加领料单子表"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _itemId = row.itemId || ids.value
  getBatch_receiving_item(_itemId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改领料单子表"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batch_receiving_itemRef"].validate(valid => {
    if (valid) {
      if (form.value.itemId != null) {
        updateBatch_receiving_item(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBatch_receiving_item(form.value).then(() => {
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
  const _itemIds = row.itemId || ids.value
  proxy.$modal.confirm('是否确认删除领料单子表编号为"' + _itemIds + '"的数据项？').then(function() {
    return delBatch_receiving_item(_itemIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["batch_receiving_itemViewRef"].open(row.itemId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('batch/batch_receiving_item/export', {
    ...queryParams.value
  }, `batch_receiving_item_${new Date().getTime()}.xlsx`)
}

getList()
</script>
