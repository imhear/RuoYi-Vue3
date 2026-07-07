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
      <el-form-item label="计划开始" prop="planStart">
        <el-date-picker clearable
          v-model="queryParams.planStart"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划开始">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划结束" prop="planEnd">
        <el-date-picker clearable
          v-model="queryParams.planEnd"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in pro_wokerorder_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-upload
          :action="importUrl"
          :headers="headers"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="handleImportSuccess"
        >
          <el-button type="info" plain icon="Upload">导入</el-button>
        </el-upload>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['bottling:order:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:order:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:order:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:order:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="80">
        <template #default="scope">
          <!-- 查看按钮，位于修改之前 -->
          <!-- <el-button link type="primary" icon="" @click="handleView(scope.row)">查看</el-button> -->
          <!-- 取消按钮，仅状态为订单确认(1)时可用 -->
          <el-button link type="danger" icon="" @click="handleCancel(scope.row)" v-if="scope.row.status === '1'" v-hasPermi="['bottling:order:cancel']">取消</el-button>
          <!-- 审核按钮，仅状态为创建订单(0)时可用 -->
          <el-button link type="success" icon="" @click="handleAudit(scope.row)" v-if="scope.row.status === '0'" v-hasPermi="['bottling:order:audit']">审核</el-button>
          <!-- <el-button link type="primary" icon="" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:order:edit']">修改</el-button> -->
          <!-- 删除按钮，仅状态为创建订单(0)时可用 -->
          <el-button link type="warning" icon="" @click="handleDelete(scope.row)" v-if="scope.row.status === '0'" v-hasPermi="['bottling:order:remove']">删除</el-button>
        </template>
      </el-table-column>
      <!-- 工单号改为超链接，点击触发查看 -->
      <el-table-column label="工单号" align="center" min-width="131">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" min-width="131" /> -->
      <!-- 新增：产品编码 -->
      <el-table-column label="产品编码" align="center" prop="productCode" min-width="110" show-overflow-tooltip />
      <!-- 新增：生产批号 -->
      <el-table-column label="生产批号" align="center" prop="batchNumber" min-width="80" show-overflow-tooltip />
      <!-- 新增：计划生产数量 -->
      <el-table-column label="计划数" align="center" prop="requireNum" min-width="70" />
      <!-- <el-table-column label="指令单类别" align="center" prop="orderType">
        <template #default="scope">
          <dict-tag :options="pro_order_type" :value="scope.row.orderType"/>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="生产订单号" align="center" prop="customerOrderNum" /> -->
      <!-- <el-table-column label="指令单说明" align="center" prop="orderDesc">
        <template #default="scope">
          <dict-tag :options="pro_order_desc" :value="scope.row.orderDesc"/>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="计划开始" align="center" prop="planStart" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="计划开始" align="center" prop="planStart" min-width="140">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planStart, '{y}-{m}-{d}') }}</span>
          <!-- 设置按钮，仅状态为0或1时显示 -->
          <el-button v-if="scope.row.status === '0' || scope.row.status === '1'"  v-hasPermi="['bottling:order:updateplandate']" link type="primary" icon="" @click="handleSetPlan(scope.row)">设置</el-button>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" prop="planEnd" min-width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="pro_wokerorder_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="100" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
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

    <!-- 添加或修改罐包装生产指令单对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="orderRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="导入主键" prop="importId">
              <el-input v-model="form.importId" placeholder="请输入导入主键" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="fileTemplateCode">
              <el-input v-model="form.fileTemplateCode" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令单类别" prop="orderType">
              <el-select v-model="form.orderType" placeholder="请选择指令单类别">
                <el-option
                  v-for="dict in pro_order_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号" prop="customerOrderNum">
              <el-input v-model="form.customerOrderNum" placeholder="请输入生产订单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令单说明" prop="orderDesc">
              <el-select v-model="form.orderDesc" placeholder="请选择指令单说明">
                <el-option
                  v-for="dict in pro_order_desc"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始" prop="planStart">
              <el-date-picker clearable
                v-model="form.planStart"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择计划开始">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束" prop="planEnd">
              <el-date-picker clearable
                v-model="form.planEnd"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择计划结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option
                  v-for="dict in pro_wokerorder_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制单人" prop="preparedBy">
              <el-input v-model="form.preparedBy" placeholder="请输入制单人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制单日期" prop="preparedTime">
              <el-date-picker clearable
                v-model="form.preparedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择制单日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准人" prop="approvedBy">
              <el-input v-model="form.approvedBy" placeholder="请输入批准人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期" prop="approvedTime">
              <el-date-picker clearable
                v-model="form.approvedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择批准日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取消工单原因" prop="cancelReason">
              <el-input v-model="form.cancelReason" placeholder="请输入取消工单原因" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

    <!-- 查看指令单组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 审核指令单组件 -->
    <BottlingOrderAudit ref="orderAuditRef" @audit="handleConfirmAudit" />

    <!-- 取消指令单组件 -->
    <BottlingOrderCancel ref="orderCancelRef" @cancel="handleConfirmCancel" />

    <!-- 删除指令单组件 -->
    <BottlingOrderDelete ref="orderDeleteRef" @delete="handleConfirmDelete" />

    <!-- 设置计划日期组件 -->
    <BottlingOrderSetPlan ref="orderSetPlanRef" @submit="handleConfirmSetPlan" />   
  </div>
</template>

<script setup name="Order">
import { ref, reactive, toRefs, nextTick } from 'vue'
import { listOrder, getOrder, delOrder, addOrder, updateOrder, importBottlingOrder, getOrderDetail, auditOrder, cancelOrder, deleteOrder, updatePlanDate} from "@/api/bottling/order"
import { getToken } from '@/utils/auth'
// 引入查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'
// 引入审核组件
import BottlingOrderAudit from '@/views/bottling/components/BottlingOrderAudit.vue'
// 引入取消组件
import BottlingOrderCancel from '@/views/bottling/components/BottlingOrderCancel.vue'
// 引入删除组件
import BottlingOrderDelete from '@/views/bottling/components/BottlingOrderDelete.vue'
// 引入设置计划日期组件
import BottlingOrderSetPlan from '@/views/bottling/components/BottlingOrderSetPlan.vue'

const { proxy } = getCurrentInstance()
const { pro_order_type, pro_order_desc, pro_wokerorder_status } = proxy.useDict('pro_order_type', 'pro_order_desc', 'pro_wokerorder_status')

const orderList = ref([])
const open = ref(false)
const viewOpen = ref(false)      // 查看对话框开关
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 查看组件引用
const orderViewRef = ref(null)
// 审核组件引用
const orderAuditRef = ref(null)
// 取消组件引用
const orderCancelRef = ref(null)
// 删除组件引用
const orderDeleteRef = ref(null)
// 入设置计划日期组件引用
const orderSetPlanRef = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    orderType: undefined,
    customerOrderNum: undefined,
    orderDesc: undefined,
    planStart: undefined,
    planEnd: undefined,
    status: undefined,
    createBy: undefined,
    createTime: undefined,
    // status: '0,1,2', // 默认排除已取消
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询罐包装生产指令单列表 */
function getList() {
  loading.value = true
  listOrder(queryParams.value).then(response => {
    orderList.value = response.rows
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
    importId: null,
    orderId: null,
    orderNum: null,
    fileTemplateCode: null,
    orderType: null,
    customerOrderNum: null,
    orderDesc: null,
    planStart: null,
    planEnd: null,
    status: null,
    preparedBy: null,
    preparedTime: null,
    approvedBy: null,
    approvedTime: null,
    cancelReason: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("orderRef")
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
  ids.value = selection.map(item => item.orderId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加罐包装生产指令单"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _orderId = row.orderId || ids.value
  getOrder(_orderId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改罐包装生产指令单"
  })
}

/** 查看工单详情 */
// async function handleView(row) {
//   try {
//     const res = await getOrderDetail(row.orderId)
//     // 调用组件的 open 方法，传入后端返回的完整数据
//     orderViewRef.value?.open(res.data)
//   } catch (e) {
//     proxy.$modal.msgError('获取工单详情失败')
//   }
// }
/** 查看工单详情 */
async function handleView(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    viewOpen.value = true
    await nextTick()
    orderViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 打开审核对话框：加载工单详情后打开审核组件 */
async function handleAudit(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    orderAuditRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 审核确认：二次确认后调用后端接口 */
function handleConfirmAudit(order) {
  const orderNo = order.orderNum || order.orderId
  proxy.$modal.confirm('是否确认审核通过工单：' + orderNo + '？').then(() => {
    return auditOrder(order.orderId)
  }).then(() => {
    proxy.$modal.msgSuccess('审核成功')
    orderAuditRef.value?.handleClose()
    getList()
  }).catch(() => {})
}

/** 打开设置计划日期对话框 */
function handleSetPlan(row) {
  orderSetPlanRef.value?.open(row)
}

/** 设置确认：二次确认后调用后端接口 */
function handleConfirmSetPlan({ order, planStart, planEnd }) {
  const orderNo = order.orderNum || order.orderId
  proxy.$modal.confirm('是否确定设置工单计划生产日期：' + orderNo + '？').then(() => {
    return updatePlanDate(order.orderId, { planStart, planEnd })
  }).then(() => {
    proxy.$modal.msgSuccess('设置成功')
    orderSetPlanRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 打开取消对话框 */
function handleCancel(row) {
  if (row.status !== '1') {
    proxy.$modal.msgWarning('只能取消状态为"工单确认"的工单')
    return
  }
  getOrderDetail(row.orderId).then(res => {
    orderCancelRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取工单详情失败')
  })
}

/** 取消确认：二次确认后调用后端接口 */
function handleConfirmCancel({ order, reason }) {
  const orderNo = order.orderNum || order.orderId
  proxy.$modal.confirm('是否确定取消工单：' + orderNo + '？').then(() => {
    return cancelOrder(order.orderId, { cancelReason: reason })
  }).then(() => {
    proxy.$modal.msgSuccess('取消成功')
    orderCancelRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["orderRef"].validate(valid => {
    if (valid) {
      if (form.value.orderId != null) {
        updateOrder(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addOrder(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
// function handleDelete(row) {
//   const _orderIds = row.orderId || ids.value
//   proxy.$modal.confirm('是否确认删除罐包装生产指令单编号为"' + _orderIds + '"的数据项？').then(function() {
//     return delOrder(_orderIds)
//   }).then(() => {
//     getList()
//     proxy.$modal.msgSuccess("删除成功")
//   }).catch(() => {})
// }
/** 打开删除对话框 */
function handleDelete(row) {
  getOrderDetail(row.orderId).then(res => {
    orderDeleteRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取工单详情失败')
  })
}

/** 删除确认：二次确认后调用后端接口 */
function handleConfirmDelete({ order, reason }) {
  const orderNo = order.orderNum || order.orderId
  proxy.$modal.confirm('是否确定删除工单：' + orderNo + '？').then(() => {
    return deleteOrder(order.orderId, { cancelReason: reason })
  }).then(() => {
    proxy.$modal.msgSuccess('删除成功')
    orderDeleteRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/order/export', {
    ...queryParams.value
  }, `order_${new Date().getTime()}.xlsx`)
}


/** 导入相关操作 */
const importUrl = ref(import.meta.env.VITE_APP_BASE_API + '/bottling/order/import')
const headers = ref({ Authorization: 'Bearer ' + getToken() })

function beforeUpload(file) {
  const isExcel = file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx')
  if (!isExcel) proxy.$modal.msgError('只能上传 .xls 或 .xlsx 格式文件')
  return isExcel
}

function handleImportSuccess(response) {
  if (response.code === 200) {
    proxy.$modal.msgSuccess('导入成功')
    getList()
  } else {
    proxy.$modal.msgError(response.msg)
  }
}

getList()
</script>