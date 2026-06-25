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
      <el-form-item label="生产日期" prop="recordDate">
        <el-date-picker clearable
          v-model="queryParams.recordDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择生产日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="灌装开始时间" prop="fillingStartTime">
        <el-date-picker clearable
          v-model="queryParams.fillingStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择灌装开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="灌装结束时间" prop="fillingEndTime">
        <el-date-picker clearable
          v-model="queryParams.fillingEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择灌装结束时间">
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
          v-hasPermi="['bottling:filling:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:filling:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:filling:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:filling:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fillingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 加页按钮：仅生产中状态显示 -->
          <el-button link type="primary" icon="" @click="handleAddPage(scope.row)"   v-hasPermi="['bottling:filling:add']" >加页</el-button>
          <!-- <el-button link type="primary" icon="" @click="handleAddPage(scope.row)" v-if="scope.row.status === '1'"  v-hasPermi="['bottling:filling:add']" >加页</el-button> -->
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:filling:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:filling:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="记录主键" align="center" prop="recordId" />
      <el-table-column label="关联排产计划" align="center" prop="planId" />
      <el-table-column label="生产日期" align="center" prop="recordDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.recordDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="灌装开始时间" align="center" prop="fillingStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.fillingStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="灌装结束时间" align="center" prop="fillingEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.fillingEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="复核人" align="center" prop="reviewer" />
      <el-table-column label="检查人" align="center" prop="inspector" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改灌装生产记录1对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillingRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联排产计划" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生产日期" prop="recordDate">
              <el-date-picker clearable
                v-model="form.recordDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择生产日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="灌装开始时间" prop="fillingStartTime">
              <el-date-picker clearable
                v-model="form.fillingStartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择灌装开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="灌装结束时间" prop="fillingEndTime">
              <el-date-picker clearable
                v-model="form.fillingEndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择灌装结束时间">
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

    <!-- 加页对话框 -->
    <BottlingFillingAddPage ref="addPageRef" @submit="handleConfirmAddPage" />
  </div>

</template>

<script setup name="Filling">
import { listFilling, getFilling, delFilling, addFilling, updateFilling } from "@/api/bottling/filling"
import { getPlan } from "@/api/bottling/plan"
import { getOrderDetailByNum } from "@/api/bottling/order"
import { addPage } from "@/api/bottling/filling"
import BottlingFillingAddPage from '@/views/bottling/components/BottlingFillingAddPage.vue'

const addPageRef = ref(null)

const { proxy } = getCurrentInstance()

const fillingList = ref([])
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
    recordDate: undefined,
    fillingStartTime: undefined,
    fillingEndTime: undefined,
    operator: undefined,
    reviewer: undefined,
    inspector: undefined,
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    planId: [
      { required: true, message: "关联排产计划不能为空", trigger: "blur" }
    ],
    recordDate: [
      { required: true, message: "生产日期不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装生产记录1列表 */
function getList() {
  loading.value = true
  listFilling(queryParams.value).then(response => {
    fillingList.value = response.rows
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
    recordId: null,
    planId: null,
    recordDate: null,
    fillingStartTime: null,
    fillingEndTime: null,
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
  proxy.resetForm("fillingRef")
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
  ids.value = selection.map(item => item.recordId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加灌装生产记录1"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getFilling(_recordId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装生产记录1"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillingRef"].validate(valid => {
    if (valid) {
      if (form.value.recordId != null) {
        updateFilling(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFilling(form.value).then(() => {
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
  const _recordIds = row.recordId || ids.value
  proxy.$modal.confirm('是否确认删除灌装生产记录1编号为"' + _recordIds + '"的数据项？').then(function() {
    return delFilling(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/filling/export', {
    ...queryParams.value
  }, `filling_${new Date().getTime()}.xlsx`)
}

/** 打开加页对话框（改造后） */
async function handleAddPage(row) {
  try {
    // 1. 根据行数据中的 planId 获取排产计划
    const planRes = await getPlan(row.planId)
    const plan = planRes.data
    // 2. 通过排产计划里的 orderNum 获取工单详情
    const orderRes = await getOrderDetailByNum(plan.orderNum)
    const orderDetail = orderRes.data
    // 3. 将 plan 附加到工单详情中，与“开始”对话框一致
    // ✅ 显式添加 planId（BottlingOrderContent 会用到）
    orderDetail.planId = row.planId
    orderDetail.plan = plan
    // 4. 传递给子组件打开
    addPageRef.value?.open(orderDetail)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}


// /** 打开加页对话框 */
// function handleAddPage(row) {
//   addPageRef.value?.open(row.planId)
// }

/** 确认加页：二次确认后调用后端接口 */
function handleConfirmAddPage({ planId, recordDate }) {
  proxy.$modal.confirm('是否确认新增生产日期为 ' + recordDate + ' 的灌装记录？').then(() => {
    return addPage(planId, { recordDate })
  }).then(() => {
    proxy.$modal.msgSuccess('加页成功')
    addPageRef.value?.close()
    getList()
  }).catch(() => {})
}

getList()
</script>
