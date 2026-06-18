<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联记录主键" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入关联记录主键"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包材编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入包材编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包材名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入包材名称"
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
      <el-form-item label="数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理方式" prop="processMethod">
        <el-input
          v-model="queryParams.processMethod"
          placeholder="请输入处理方式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束时间">
        </el-date-picker>
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
          v-hasPermi="['bottling:disPack1Item:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:disPack1Item:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:disPack1Item:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:disPack1Item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="disPack1ItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="明细主键" align="center" prop="itemId" />
      <el-table-column label="关联记录主键" align="center" prop="recordId" />
      <el-table-column label="包材编码" align="center" prop="materialCode" />
      <el-table-column label="包材名称" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="处理方式" align="center" prop="processMethod" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:disPack1Item:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:disPack1Item:remove']">删除</el-button>
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

    <!-- 添加或修改灌装包材处理记录1明细对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="disPack1ItemRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联记录主键" prop="recordId">
              <el-input v-model="form.recordId" placeholder="请输入关联记录主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包材编码" prop="materialCode">
              <el-input v-model="form.materialCode" placeholder="请输入包材编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包材名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder="请输入包材名称" />
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
            <el-form-item label="数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理方式" prop="processMethod">
              <el-input v-model="form.processMethod" placeholder="请输入处理方式" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable
                v-model="form.startTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable
                v-model="form.endTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
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

<script setup name="DisPack1Item">
import { listDisPack1Item, getDisPack1Item, delDisPack1Item, addDisPack1Item, updateDisPack1Item } from "@/api/bottling/disPack1Item"

const { proxy } = getCurrentInstance()

const disPack1ItemList = ref([])
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
    materialCode: undefined,
    materialName: undefined,
    spec: undefined,
    unit: undefined,
    quantity: undefined,
    processMethod: undefined,
    startTime: undefined,
    endTime: undefined,
  },
  rules: {
    recordId: [
      { required: true, message: "关联记录主键不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录1明细列表 */
function getList() {
  loading.value = true
  listDisPack1Item(queryParams.value).then(response => {
    disPack1ItemList.value = response.rows
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
    recordId: null,
    materialCode: null,
    materialName: null,
    spec: null,
    unit: null,
    quantity: null,
    processMethod: null,
    startTime: null,
    endTime: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("disPack1ItemRef")
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
  title.value = "添加灌装包材处理记录1明细"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _itemId = row.itemId || ids.value
  getDisPack1Item(_itemId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装包材处理记录1明细"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["disPack1ItemRef"].validate(valid => {
    if (valid) {
      if (form.value.itemId != null) {
        updateDisPack1Item(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDisPack1Item(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除灌装包材处理记录1明细编号为"' + _itemIds + '"的数据项？').then(function() {
    return delDisPack1Item(_itemIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/disPack1Item/export', {
    ...queryParams.value
  }, `disPack1Item_${new Date().getTime()}.xlsx`)
}

getList()
</script>
