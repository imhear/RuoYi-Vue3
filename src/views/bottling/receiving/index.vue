<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="关联排产计划" prop="planId">
        <el-input
          v-model="queryParams.planId"
          placeholder="请输入关联排产计划"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车间" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入车间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="任务单号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入任务单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领料日期" prop="receiveDate">
        <el-date-picker clearable
          v-model="queryParams.receiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择领料日期">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="复核人" prop="reviewer">
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
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['bottling:receiving:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:receiving:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:receiving:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:receiving:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="receivingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="50">
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleReceive(scope.row)"
                    v-if="scope.row.status === '0' || scope.row.status === '1'" >领料</el-button>
          <el-button link type="primary" icon="" @click="handleReview(scope.row)"
                    v-if="scope.row.status === '1'" >复核</el-button>
          <!-- <el-button link type="primary" icon="" @click="handleView(scope.row)">查看</el-button> -->
          <!-- <el-button link type="primary" icon="" @click="handleReceive(scope.row)" v-hasPermi="['bottling:receiving:edit']">领料</el-button> -->
          <!-- <el-button link type="primary" icon="" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:receiving:edit']">修改</el-button> -->
          <!-- <el-button link type="primary" icon="" @click="handleDelete(scope.row)" v-hasPermi="['bottling:receiving:remove']">删除</el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="领料单主键" align="center" prop="receivingId" /> -->
      <!-- 状态列 -->
      <el-table-column label="状态" align="center" prop="status" min-width="70">
        <template #default="scope">
          <dict-tag :options="receiving_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- 任务单号改为超链接，点击触发查看 -->
      <el-table-column label="任务单号" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.planCode }}</el-button>
        </template>
      </el-table-column>
      <!-- 工单号改为超链接，点击触发查看 -->
      <el-table-column label="工单号" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleOrderView(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" min-width="80"/> -->
      <!-- <el-table-column label="关联排产计划" align="center" prop="planId" /> -->
      <!-- <el-table-column label="车间" align="center" prop="workshop" /> -->
      <!-- 物料类别改为字典标签 -->
      <el-table-column label="物料类别" align="center" prop="materialType">
        <template #default="scope">
          <dict-tag :options="pro_material_type" :value="scope.row.materialType" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="物料类别" align="center" prop="materialType" /> -->
      <el-table-column label="领料人" align="center" prop="receiveBy" />
      <el-table-column label="领料日期" align="center" prop="receiveDate" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.receiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发料人" align="center" prop="deliveryBy" />
      <el-table-column label="发料日期" align="center" prop="deliveryDate" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复核人" align="center" prop="reviewer" />
      <el-table-column label="复核日期" align="center" prop="reviewDate" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="100" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="操作人" align="center" prop="operator" /> -->
      <!-- <el-table-column label="复核人" align="center" prop="reviewer" /> -->
      <!-- <el-table-column label="检查人" align="center" prop="inspector" /> -->
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改领料单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="receivingRef" :model="form" :rules="rules" label-width="100px">
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
            <el-form-item label="领料日期" prop="receiveDate">
              <el-date-picker clearable
                v-model="form.receiveDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择领料日期">
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

    <!-- 查看领料单对话框组件 -->
    <BottlingReceivingView ref="receivingViewRef" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 领料对话框组件 -->
    <BottlingReceivingReceive ref="receiveRef" @submit="handleConfirmReceive" />

    <!-- 复核对话框 -->
    <BottlingReceivingReview ref="reviewRef" @submit="handleConfirmReview" />

  </div>
</template>

<script setup name="Receiving">
import { listReceiving, getReceiving, delReceiving, addReceiving, updateReceiving, receiveReceiving, reviewReceiving} from "@/api/bottling/receiving"
import { getOrderDetail } from "@/api/bottling/order"
import { getPlan } from '@/api/bottling/plan' // 导入 getPlan
// 引入领料单查看组件
import BottlingReceivingView from '@/views/bottling/components/BottlingReceivingView.vue'
// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'
// 引入领料组件
import BottlingReceivingReceive from '@/views/bottling/components/BottlingReceivingReceive.vue'
// 引入复核组件
import BottlingReceivingReview from '@/views/bottling/components/BottlingReceivingReview.vue'

const route = useRoute() // 获取当前路由信息

// 从 URL 查询参数 ?workshop=D 中获取车间值，若无则默认 'D'
const currentWorkshop = computed(() => route.query.workshop || 'D')

const { proxy } = getCurrentInstance()
// 引入 pro_material_type 字典
const { pro_material_type, receiving_status } = proxy.useDict('pro_material_type', 'receiving_status')

const receivingList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const receivingViewRef = ref(null)   // 查看领料单组件引用
const orderViewRef = ref(null) // 查看工单组件引用
// 领料组件引用
const receiveRef = ref(null)
// 复核组件引用
const reviewRef = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planId: undefined,
    planCode: undefined,   // 任务单号模糊查询
    // workshop 不再需要，由 currentWorkshop 自动注入
    receiveDate: undefined,
    operator: undefined,
    reviewer: undefined,
    inspector: undefined,
    status: '0,1,2', // 默认排除已取消
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

/** 查询领料单列表（自动过滤当前车间） */
function getList() {
  loading.value = true
  // 注入当前车间参数，确保只查询本车间数据
  listReceiving({
    ...queryParams.value,
    workshop: currentWorkshop.value
  }).then(response => {
    receivingList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 查询领料单列表 */
// function getList() {
//   loading.value = true
//   listReceiving(queryParams.value).then(response => {
//     receivingList.value = response.rows
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
    receivingId: null,
    planId: null,
    workshop: currentWorkshop.value,   // 自动填充当前车间
    receiveDate: null,
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
  proxy.resetForm("receivingRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  // 对任务单号字段去首尾空格
  if (queryParams.value.planCode) {
    queryParams.value.planCode = queryParams.value.planCode.replace(/\s/g, '');
  }
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
  ids.value = selection.map(item => item.receivingId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加领料单"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _receivingId = row.receivingId || ids.value
  getReceiving(_receivingId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改领料单"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["receivingRef"].validate(valid => {
    if (valid) {
      if (form.value.receivingId != null) {
        updateReceiving(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addReceiving(form.value).then(() => {
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
  const _receivingIds = row.receivingId || ids.value
  proxy.$modal.confirm('是否确认删除领料单编号为"' + _receivingIds + '"的数据项？').then(function() {
    return delReceiving(_receivingIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/receiving/export', {
    ...queryParams.value
  }, `receiving_${new Date().getTime()}.xlsx`)
}

/** 查看领料单详情（任务单号超链接触发） */
// function handleView(row) {
//   getReceiving(row.receivingId).then(res => {
//     receivingViewRef.value?.open(res.data)
//   }).catch(() => {
//     proxy.$modal.msgError('获取领料单详情失败')
//   })
// }
async function handleView(row) {
  try {
    const res = await getReceiving(row.receivingId)
    // viewOpen.value = true
    await nextTick()
    receivingViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取领料单详情失败')
  }
}

/** 查看工单详情 */
async function handleOrderView(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    // viewOpen.value = true
    await nextTick()
    orderViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 打开领料对话框 */
async function handleReceive(row) {
  try {
    const res = await getReceiving(row.receivingId);
    // 获取排产计划信息
    const planRes = await getPlan(row.planId);
    const data = { ...res.data, plan: planRes.data };
    await nextTick();
    receiveRef.value?.open(data);
  } catch (e) {
    proxy.$modal.msgError('获取领料单详情失败');
  }
}

/** 领料确认：二次确认后调接口 */
async function handleConfirmReceive(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交领料单？');
    await receiveReceiving(formData.receivingId, formData);
    proxy.$modal.msgSuccess('领料成功');
    receiveRef.value?.close();
    getList();
  } catch (e) {
    if (e !== 'cancel') {
      proxy.$modal.msgError('领料失败');
    }
  }
}

/** 打开复核对话框 */
async function handleReview(row) {
  try {
    const res = await getReceiving(row.receivingId);
    await nextTick();
    reviewRef.value?.open(res.data);
  } catch (e) {
    proxy.$modal.msgError('获取领料单详情失败');
  }
}

/** 复核确认：二次确认后调接口 */
async function handleConfirmReview({ receivingId }) {
  try {
    await proxy.$modal.confirm('该操作将无法修改对应的批记录数据，确认复核吗？');
    await reviewReceiving(receivingId);
    proxy.$modal.msgSuccess('复核成功');
    reviewRef.value?.close();
    getList();
  } catch (e) {
    if (e !== 'cancel') {
      proxy.$modal.msgError('复核失败');
    }
  }
}

getList()
</script>
