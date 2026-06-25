<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联排产计划" prop="planId">
        <el-input
          v-model="queryParams.planId"
          placeholder="请输入关联排产计划"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入车间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="清场日期" prop="cleaningDate">
        <el-date-picker clearable
          v-model="queryParams.cleaningDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择清场日期">
        </el-date-picker>
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
      <el-form-item label="检查结果" prop="checkResult">
        <el-input
          v-model="queryParams.checkResult"
          placeholder="请输入检查结果"
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
          v-hasPermi="['bottling:cleaning:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:cleaning:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:cleaning:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:cleaning:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cleaningList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="清场记录主键" align="center" prop="cleaningId" />
      <el-table-column label="关联排产计划" align="center" prop="planId" />
      <el-table-column label="车间" align="center" prop="workshop" />
      <el-table-column label="清场日期" align="center" prop="cleaningDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.cleaningDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="复核人" align="center" prop="reviewer" />
      <el-table-column label="检查人" align="center" prop="inspector" />
      <el-table-column label="检查结果" align="center" prop="checkResult" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:cleaning:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:cleaning:remove']">删除</el-button>
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

    <!-- 添加或修改清场记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="cleaningRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联排产计划" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车间" prop="workshop">
              <el-input v-model="form.workshop" placeholder="请输入车间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="清场日期" prop="cleaningDate">
              <el-date-picker clearable
                v-model="form.cleaningDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择清场日期">
              </el-date-picker>
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
            <el-form-item label="检查结果" prop="checkResult">
              <el-input v-model="form.checkResult" placeholder="请输入检查结果" />
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

<script setup name="Cleaning">
import { listCleaning, getCleaning, delCleaning, addCleaning, updateCleaning } from "@/api/bottling/cleaning"

const route = useRoute() // 获取当前路由信息

// 从 URL 查询参数 ?workshop=D 中获取车间值，若无则默认 'D'
const currentWorkshop = computed(() => route.query.workshop || 'D')

const { proxy } = getCurrentInstance()

const cleaningList = ref([])
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
    planId: undefined,
    // workshop 不再需要，由 currentWorkshop 自动注入
    cleaningDate: undefined,
    operator: undefined,
    reviewer: undefined,
    inspector: undefined,
    checkResult: undefined,
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    planId: [
      { required: true, message: "关联排产计划不能为空", trigger: "blur" }
    ],
    // workshop: [
    //   { required: true, message: "车间不能为空", trigger: "blur" }
    // ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询清场记录列表（自动过滤当前车间） */
function getList() {
  loading.value = true
  // 注入当前车间参数，确保只查询本车间数据
  listCleaning({
    ...queryParams.value,
    workshop: currentWorkshop.value
  }).then(response => {
    cleaningList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}
/** 查询清场记录列表 */
// function getList() {
//   loading.value = true
//   listCleaning(queryParams.value).then(response => {
//     cleaningList.value = response.rows
//     total.value = response.total
//     loading.value = false
//   })
// }

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    cleaningId: null,
    planId: null,
    workshop: currentWorkshop.value,   // 自动填充当前车间
    cleaningDate: null,
    operator: null,
    reviewer: null,
    inspector: null,
    checkResult: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("cleaningRef")
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
  ids.value = selection.map(item => item.cleaningId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加清场记录"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _cleaningId = row.cleaningId || ids.value
  getCleaning(_cleaningId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改清场记录"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cleaningRef"].validate(valid => {
    if (valid) {
      if (form.value.cleaningId != null) {
        updateCleaning(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCleaning(form.value).then(() => {
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
  const _cleaningIds = row.cleaningId || ids.value
  proxy.$modal.confirm('是否确认删除清场记录编号为"' + _cleaningIds + '"的数据项？').then(function() {
    return delCleaning(_cleaningIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/cleaning/export', {
    ...queryParams.value
  }, `cleaning_${new Date().getTime()}.xlsx`)
}

getList()
</script>
