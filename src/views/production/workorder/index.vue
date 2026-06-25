<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="工单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入工单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品编码" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产批号" prop="productBatchNo">
        <el-input
          v-model="queryParams.productBatchNo"
          placeholder="请输入生产批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划起止" prop="planStartDate">
        <el-date-picker clearable
          v-model="queryParams.planStartDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划开始">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="planEndDate">
        <el-date-picker clearable
          v-model="queryParams.planEndDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划结束">
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
          v-hasPermi="['production:workorder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['production:workorder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['production:workorder:export']"
        >导出</el-button>
      </el-col>
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
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workorderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="140" show-overflow-tooltip>
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" icon="" @click="handleSetPlan(scope.row)">设置</el-button>
          <el-button link type="primary" icon="" @click="handleAudit(scope.row)" v-hasPermi="['production:workorder:audit']">审核</el-button>
          <el-button link type="primary" icon="" @click="handleCancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
      <el-table-column label="工单号" align="center" prop="orderNum" min-width="140" show-overflow-tooltip/>
      <el-table-column label="产品编码" align="center" prop="productCode" min-width="120" show-overflow-tooltip />
      <el-table-column label="产品名称" align="center" prop="productName" min-width="260" show-overflow-tooltip/>
      <el-table-column label="生产批号" align="center" prop="productBatchNo" show-overflow-tooltip/>
      <el-table-column label="计划生产数量" align="center" prop="plannedQuantity" min-width="110" show-overflow-tooltip/>
      <el-table-column label="计划开始" align="center" prop="planStartDate" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ parseTime(scope.row.planStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" prop="planEndDate" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ parseTime(scope.row.planEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="pro_wokerorder_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip>
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

    <!-- 添加或修改生产工单对话框 -->
    <el-dialog :title="title" v-model="open" width="1100px" append-to-body>
      <el-form ref="workorderRef" :model="form" :rules="rules" label-width="100px">
        <!-- 原有编辑表单内容不变 -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- ========== 查看工单对话框 ========== -->
    <el-dialog v-model="viewOpen" width="210mm" append-to-body>
      <template #header>
        <div style="display: flex; align-items: flex-end; width: 100%;">
          <h3 style="flex: 1; text-align: center; margin: 0;">灌包生产指令单</h3>
          <span style="flex-shrink: 0; font-size: 12px;">编号：{{ viewData.order?.fileTemplateCode }}</span>
        </div>
      </template>

      <div v-if="viewData.order" class="view-container">

        <!-- ===== 主表字段（行间距 7px） ===== -->
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>指令单类别：</label><span>{{ viewData.order.orderType }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>生产订单号：</label><span>{{ viewData.order.productOrderNo }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="24">
            <div class="field-item"><label>指令单说明：</label><span>{{ viewData.order.orderDesc }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>成品/半制品编码：</label><span>{{ viewData.order.productCode }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>品牌：</label><span>{{ viewData.order.productBrand }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>产品名称：</label><span>{{ viewData.order.productName }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>生产批号：</label><span>{{ viewData.order.productBatchNo }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>规格/型号：</label><span>{{ viewData.order.productSpec }}</span></div>
          </el-col>
          <el-col :span="6">
            <div class="field-item"><label>计划生产数量：</label><span>{{ viewData.order.plannedQuantity }}</span></div>
          </el-col>
          <el-col :span="6">
            <div class="field-item"><label>单位：</label><span>{{ viewData.order.unit }}</span></div>
          </el-col>
        </el-row>

        <!-- ===== 子表（BOM） ===== -->
        <el-table :data="viewData.materials" border size="small" class="bom-table"
                  :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column label="序号" prop="seqNo" width="40" align="center"/>
          <!-- 物料二维码：改造为显示 QR Code 图片 -->
          <el-table-column label="物料二维码" min-width="70" align="left">
            <template #default="scope">
              <!-- 二维码图片存在则展示，否则回退显示文本 -->
              <img v-if="scope.row.qrCodeImage" :src="scope.row.qrCodeImage" style="width: 58px; height: 58px; display: block; margin: 0 auto;" />
              <span v-else>{{ scope.row.qrCode || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料代码" prop="materialCode" min-width="80" align="left" show-overflow-tooltip/>
          <el-table-column label="名称/部件" prop="materialName" min-width="139" align="left" class-name="wrap-column"/>
          <el-table-column label="规格" prop="spec" min-width="60" align="left" class-name="wrap-column"/>
          <el-table-column label="单位" prop="unit" width="50" align="center"/>
          <el-table-column label="定额数量" width="90" align="right">
            <template #default="scope">
              {{ scope.row.quotaQty != null ? Number(scope.row.quotaQty).toFixed(6) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="总计划数量" width="90" align="right">
            <template #default="scope">
              {{ scope.row.totalQty != null ? Number(scope.row.totalQty).toFixed(2) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="90" align="left" show-overflow-tooltip/>
        </el-table>

        <!-- ===== 固定文本 ===== -->
        <div class="el-table el-table--fit el-table--border el-table--small bom-table" style="margin-top: 8px;">
          <div class="el-table__inner-wrapper">
            <table class="el-table__body" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
              <tbody>
                <tr class="el-table__row">
                  <td class="el-table__cell" style="width: 16.66%; text-align: center; vertical-align: middle; ">
                    <div class="cell" style="font-size: 14px;">通用工艺要求<br/>及注意事项</div>
                  </td>
                  <td class="el-table__cell" style="width: 83.34%; vertical-align: middle; padding: 0 0 0px 4px;">
                    <div class="cell" style="font-size: 11px; padding: 0 8px 0 1px; white-space: normal; line-height: 1.8;">
                      1）内包材需要经过消毒处理才能使用；<br/>
                      2）灌装和彩盒喷码需要首件确认(灌装量、外观、位置、内容、字体、清晰度等)；<br/>
                      3）灌装温湿度要符合要求；<br/>
                      4）瓶底打码，需要首件确认(位置、内容、字体、清晰度等)；<br/>
                      5）油墨喷码，将码喷在包装记录背面，激光打码手工填写打码内容；<br/>
                      按照包装形式进行包装，过程随时检查外观、数量等。
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ===== 尾部主表字段 ===== -->
        <el-row :gutter="16" style="margin-top: 8px; margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>制单人：</label><span>{{ viewData.order.preparedBy }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>制单日期：</label><span>{{ parseTime(viewData.order.preparedTime, '{y}-{m}-{d}') }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 8px;">
          <el-col :span="12">
            <div class="field-item"><label>计划生产日期：</label><span>{{ parseTime(viewData.order.planStartDate, '{y}-{m}-{d}') }} - {{ parseTime(viewData.order.planEndDate, '{y}-{m}-{d}') }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>批准/日期：</label><span>{{ viewData.order.approvedBy }} {{ viewData.order.approvedTime ? parseTime(viewData.order.approvedTime, '{y}-{m}-{d}') : '' }}</span></div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="viewOpen = false">关 闭</el-button>
      </template>
    </el-dialog>

    <!-- ========== 取消工单对话框 ========== -->
    <el-dialog v-model="cancelOpen" title="取消工单" width="500px" append-to-body>
    <div style="font-size: 24px;text-align: center;padding-bottom: 20px;">
     {{ currentCancelRow?.orderNum || currentCancelRow?.workOrderId }}
    </div>
      <el-form :model="cancelForm" :rules="cancelRules" ref="cancelFormRef" label-width="100px">
        <el-form-item label="取消原因" prop="cancelReason">
          <el-input
            v-model="cancelForm.cancelReason"
            type="textarea"
            :rows="3"
            placeholder="请输入取消工单原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelOpen = false">取 消</el-button>
        <el-button type="danger" @click="confirmCancel">确 定</el-button>
      </template>
    </el-dialog>

    <!-- ========== 设置计划日期对话框 ========== -->
    <el-dialog v-model="planDateOpen" title="设置计划日期" width="400px" append-to-body>
      <div style="font-size: 16px; text-align: center; padding-bottom: 16px;">
        <strong>{{ currentPlanRow?.orderNum || currentPlanRow?.workOrderId }}</strong>
      </div>
      <el-form :model="planDateForm" :rules="planDateRules" ref="planDateFormRef" label-width="100px">
        <el-form-item label="计划开始" prop="planStartDate">
          <el-date-picker
            v-model="planDateForm.planStartDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择计划开始"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="计划结束" prop="planEndDate">
          <el-date-picker
            v-model="planDateForm.planEndDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择计划结束"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="planDateOpen = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetPlan">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Workorder">
import { listWorkorder, getWorkorder, delWorkorder, addWorkorder, updateWorkorder, getWorkorderDetail, cancelWorkorder, auditWorkorder, updatePlanDate } from "@/api/production/workorder"
import { getToken } from '@/utils/auth'
// 新增导入：QRCode 生成库
import QRCode from 'qrcode'

const { proxy } = getCurrentInstance()
const { pro_unit, pro_order_type, pro_order_desc, pro_product_spec, pro_product_type, pro_wokerorder_status, pro_product_brand } = proxy.useDict('pro_unit', 'pro_order_type', 'pro_order_desc', 'pro_product_spec', 'pro_product_type', 'pro_wokerorder_status', 'pro_product_brand')

const importUrl = ref(import.meta.env.VITE_APP_BASE_API + '/production/workorder/import')
const headers = ref({ Authorization: 'Bearer ' + getToken() })

const workorderList = ref([])
const open = ref(false)
const viewOpen = ref(false)          // 查看对话框开关
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 查看对话框数据
const viewData = reactive({
  order: null,
  materials: []
})

// ========== 取消工单相关状态 ==========
const cancelOpen = ref(false)
const currentCancelRow = ref(null)
const cancelFormRef = ref(null)
const cancelForm = reactive({ cancelReason: '' })
const cancelRules = {
  cancelReason: [
    { required: true, message: '取消原因不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && value.trim().length < 4) {
          cancelForm.cancelReason = cancelForm.cancelReason.trim()
          callback(new Error('取消原因最少4个字'))
        } else { callback() }
      },
      trigger: 'blur'
    }
  ]
}

// ========== 设置计划日期相关状态 ==========
const planDateOpen = ref(false)
const currentPlanRow = ref(null)
const planDateFormRef = ref(null)
const planDateForm = reactive({ planStartDate: null, planEndDate: null })
const planDateRules = {
  planStartDate: [{ required: true, message: '计划开始不能为空', trigger: 'change' }],
  planEndDate:   [{ required: true, message: '计划结束不能为空', trigger: 'change' }]
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    productCode: undefined,
    productBatchNo: undefined,
    planStartDate: undefined,
    planEndDate: undefined,
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },


  
  rules: {
    status: [{ required: true, message: "状态不能为空", trigger: "change" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  queryParams.value.orderByColumn = 'create_time'
  queryParams.value.isAsc = 'desc'
  listWorkorder(queryParams.value).then(response => {
    workorderList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function cancel() { open.value = false; reset() }

function reset() {
  form.value = {
    workOrderId: null, productType: null, fileTemplateCode: null, orderType: null,
    productOrderNo: null, orderDesc: null, productCode: null, productBrand: null,
    productName: null, productBatchNo: null, productSpec: null, plannedQuantity: null,
    unit: null, planStartDate: null, planEndDate: null, realStartDate: null, realEndDate: null,
    status: null, preparedBy: null, preparedTime: null, approvedBy: null, approvedTime: null,
    finishedBy: null, finishedTime: null, cancelReason: null, remark: null, delFlag: null,
    createBy: null, createTime: null, updateBy: null, updateTime: null
  }
  proxy.resetForm("workorderRef")
}

function handleQuery() { queryParams.value.pageNum = 1; getList() }
function resetQuery() { proxy.resetForm("queryRef"); handleQuery() }

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.workOrderId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() { reset(); open.value = true; title.value = "添加生产工单" }

function handleUpdate(row) {
  reset()
  const _workOrderId = row.workOrderId || ids.value
  getWorkorder(_workOrderId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改生产工单"
  })
}

/** 查看工单详情：获取数据后为每行物料生成二维码图片 */
async function handleView(row) {
  viewData.order = null
  viewData.materials = []
  try {
    const res = await getWorkorderDetail(row.workOrderId)
    viewData.order = res.data.order

    // 遍历物料列表，为有 qrCode 的行异步生成二维码 base64 图片
    const materials = res.data.materials || []
    for (const item of materials) {
      if (item.qrCode) {
        try {
          // 生成 100x100 的二维码，margin 为 1 保证边框
          item.qrCodeImage = await QRCode.toDataURL(item.qrCode, { width: 100, margin: 1 })
        } catch (e) {
          // 生成失败时保持文本显示
          item.qrCodeImage = null
        }
      } else {
        item.qrCodeImage = null
      }
    }
    viewData.materials = materials
    viewOpen.value = true
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

// ========== 取消工单相关方法 ==========
function handleCancel(row) {
  if (row.status === '9') { proxy.$modal.msgWarning('该工单已取消'); return }
  currentCancelRow.value = row
  cancelForm.cancelReason = ''
  cancelOpen.value = true
  nextTick(() => { cancelFormRef.value?.resetFields() })
}

function confirmCancel() {
  cancelFormRef.value?.validate(valid => {
    if (!valid) return
    cancelForm.cancelReason = cancelForm.cancelReason.trim()
    const orderNo = currentCancelRow.value.orderNum || currentCancelRow.value.workOrderId
    proxy.$modal.confirm('是否确定取消工单：' + orderNo + '？').then(() => {
      return cancelWorkorder(currentCancelRow.value.workOrderId, { cancelReason: cancelForm.cancelReason })
    }).then(() => { proxy.$modal.msgSuccess('取消成功'); cancelOpen.value = false; getList() }).catch(() => {})
  })
}

// ========== 设置计划日期相关方法 ==========
function handleSetPlan(row) {
  if (row.status === '9') { proxy.$modal.msgWarning('已取消的工单不能设置计划日期'); return }
  currentPlanRow.value = row
  planDateForm.planStartDate = row.planStartDate || null
  planDateForm.planEndDate = row.planEndDate || null
  planDateOpen.value = true
  nextTick(() => { planDateFormRef.value?.resetFields() })
}

function confirmSetPlan() {
  planDateFormRef.value?.validate(valid => {
    if (!valid) return
    const orderNo = currentPlanRow.value.orderNum || currentPlanRow.value.workOrderId
    proxy.$modal.confirm('是否确定设置工单计划生产日期：' + orderNo + '？').then(() => {
      return updatePlanDate(currentPlanRow.value.workOrderId, {
        planStartDate: planDateForm.planStartDate,
        planEndDate: planDateForm.planEndDate
      })
    }).then(() => { proxy.$modal.msgSuccess('设置成功'); planDateOpen.value = false; getList() }).catch(() => {})
  })
}

/** 审核工单 */
function handleAudit(row) {
  if (row.status === '9') { proxy.$modal.msgWarning('已取消的工单不能审核'); return }
  if (row.status !== '0') { proxy.$modal.msgWarning('只能审核状态为"创建工单"的工单'); return }
  const orderNo = row.orderNum || row.workOrderId
  proxy.$modal.confirm('是否确认审核通过工单：' + orderNo + '？').then(() => {
    return auditWorkorder(row.workOrderId)
  }).then(() => { proxy.$modal.msgSuccess('审核成功'); getList() }).catch(() => {})
}

function submitForm() {
  proxy.$refs["workorderRef"].validate(valid => {
    if (valid) {
      if (form.value.workOrderId != null) {
        updateWorkorder(form.value).then(() => { proxy.$modal.msgSuccess("修改成功"); open.value = false; getList() })
      } else {
        addWorkorder(form.value).then(() => { proxy.$modal.msgSuccess("新增成功"); open.value = false; getList() })
      }
    }
  })
}

function handleDelete(row) {
  const _workOrderIds = row.workOrderId || ids.value
  let tipContent
  if (row.workOrderId) {
    tipContent = row.productOrderNo || row.workOrderId
  } else {
    const selectedRows = workorderList.value.filter(item => ids.value.includes(item.workOrderId))
    tipContent = selectedRows.map(item => item.productOrderNo || item.workOrderId).join(', ')
  }
  proxy.$modal.confirm('是否确认删除生产工单：' + tipContent + '？').then(function() {
    return delWorkorder(_workOrderIds)
  }).then(() => { getList(); proxy.$modal.msgSuccess("删除成功") }).catch(() => {})
}

function handleExport() {
  proxy.download('production/workorder/export', { ...queryParams.value }, `workorder_${new Date().getTime()}.xlsx`)
}

function beforeUpload(file) {
  const isXls = file.name.toLowerCase().endsWith('.xls')
  if (!isXls) proxy.$modal.msgError('只能上传 .xls 格式文件')
  return isXls
}

function handleImportSuccess(response) {
  if (response.code === 200) { proxy.$modal.msgSuccess('导入成功'); getList() }
  else { proxy.$modal.msgError(response.msg) }
}

getList()
</script>

<style>
/* 全局表格单元格不换行（保持列表页效果） */
.el-table .cell {
  white-space: nowrap;
}

/* ===== 查看容器滚动 ===== */
.view-container {
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 2px;
  box-sizing: border-box;
}
.view-container::-webkit-scrollbar {
  width: 0px;
}

/* 主表字段样式 */
.field-item {
  line-height: 1.6;
}
.field-item label {
  font-weight: bold;
  margin-right: 4px;
}

/* ===== 子表样式 ===== */
.bom-table {
  font-size: 11px;
}
.bom-table .el-table__header th .cell {
  font-size: 10px;
  text-align: center;
}
.bom-table .el-table__cell .cell {
  padding-left: 0px;
  padding-right: 0px;
}
/* 子表行高固定63px，内容垂直居中 */
.bom-table .el-table__body tr {
  height: 60px;
}
.bom-table .el-table__body tr td {
  height: 60px;
  padding-top: 0;
  padding-bottom: 0;
  vertical-align: middle;
}
.wrap-column .cell {
  white-space: normal;
  word-break: break-all;
  line-height: 1.6;
}
</style>