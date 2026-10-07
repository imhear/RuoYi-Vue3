<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单号" prop="orderNum">
        <el-input v-model="queryParams.orderNum" placeholder="请输入工单号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="产品编码" prop="productCode">
        <el-input v-model="queryParams.productCode" placeholder="请输入产品编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="生产批号" prop="batchNumber">
        <el-input v-model="queryParams.batchNumber" placeholder="请输入生产批号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="方案名称" prop="schemeName">
        <el-input v-model="queryParams.schemeName" placeholder="请输入方案名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['batch:batch_record:add']">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="180">
        <template #default="scope">
          <!-- 审核按钮：待审核状态显示 -->
          <el-button v-if="scope.row.status === '0' && scope.row.releaseId" link type="warning" @click="handleAudit(scope.row)" v-hasPermi="['batch:batch_record:audit']">审核</el-button>
          <!-- 删除按钮 -->
          <el-button v-if="scope.row.status === '0'" link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_record:remove']">删除</el-button>
          <!-- 取消按钮 -->
          <el-button v-if="scope.row.status === '1'" link type="danger" @click="handleUnAudit(scope.row)" v-hasPermi="['batch:batch_record:unaudit']">取消</el-button>
        </template>
      </el-table-column>
      <!--
        状态列：
        - 常态下仅显示 dict-tag 状态标签
        - 当状态为 '9'（已取消）且 remark 非空时，在标签右侧紧跟一个警示图标；
          鼠标悬停在图标上显示该行数据对应的 remark（取消理由），提高数据可读性
        - 图标使用 WarningFilled（橙色），与"已取消"的语义相符，视觉上不抢占状态标签
      -->
      <el-table-column label="状态" align="center" prop="status" width="120">
        <template #default="scope">
          <div class="status-cell">
            <dict-tag :options="biz_record_status" :value="scope.row.status" />
            <el-tooltip
              v-if="scope.row.status === '9' && scope.row.remark"
              :content="scope.row.remark"
              placement="top"
            >
              <el-icon class="status-remark-icon"><WarningFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <!-- 工单号：无值显示导入按钮，有值显示超链接 -->
      <el-table-column label="工单号" align="center" min-width="120">
        <template #default="scope">
          <!-- 未导入工单：显示上传按钮 -->
          <el-upload
            v-if="!scope.row.orderNum"
            :action="importUrl + scope.row.recordId"
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleImportSuccess"
            :on-error="handleImportError"
            style="display: inline-block;"
          >
            <el-button link type="primary" v-hasPermi="['batch:batch_order:import']">导入</el-button>
          </el-upload>
          <!-- 已导入工单：显示工单号链接 -->
          <el-button v-else link type="primary" @click="handleViewOrder(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="批记录" align="center" min-width="120">
        <template #default="scope">
          <!-- 生成按钮：已导入工单且未生成方案时显示 -->
          <el-button v-if="scope.row.orderNum && !scope.row.releaseId && scope.row.status === '0'" link type="success" @click="handleGenerate(scope.row)" v-hasPermi="['batch:batch_record:generate']">生成</el-button>
          <!-- 查看批记录结构按钮：已生成后显示 -->
          <el-button v-if="scope.row.releaseId" link type="primary" @click="handleViewRecord(scope.row)" v-hasPermi="['batch:batch_record:query']">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="产品编码" align="center" prop="productCode" min-width="100" />
      <el-table-column label="产品名称" align="center" prop="productName" min-width="120" show-overflow-tooltip />
      <el-table-column label="生产批号" align="center" prop="batchNumber" min-width="100" />
      <el-table-column label="方案名称" align="center" prop="schemeName" min-width="120" show-overflow-tooltip />
      <el-table-column label="发布版本" align="center" prop="releaseCode" min-width="80" />
      <el-table-column label="计划开始" align="center" prop="planStart" width="100">
        <template #default="scope">{{ parseTime(scope.row.planStart, '{y}-{m}-{d}') }}</template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" prop="planEnd" width="100">
        <template #default="scope">{{ parseTime(scope.row.planEnd, '{y}-{m}-{d}') }}</template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 生成批记录对话框 -->
    <BatchRecordGenerate ref="generateRef" @success="getList" />
    <!-- 查看生产任务单组件 -->
    <BatchOrderView ref="orderViewRef" />
    <!-- 查看批记录结构组件 -->
    <BatchRecordView ref="recordViewRef" />

    <!--
      取消批记录对话框
      - 相比原 ElMessageBox.prompt，改用自定义 el-dialog + el-form，
        目的是能够对输入框的值进行 trim 回填（所见即所得），并支持 element-plus 的表单校验
      - input 失焦时自动 trim 回填，用户点击"确定"时也能感知到输入被整理
      - 提交前再做一次 trim（防止用户按回车直接提交时未触发 blur）
    -->
    <el-dialog v-model="cancelDialogVisible" :title="cancelTitle" width="500px" append-to-body>
      <el-form ref="cancelFormRef" :model="cancelForm" :rules="cancelRules" label-width="80px">
        <el-form-item label="取消理由" prop="remark">
          <el-input
            v-model="cancelForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入取消理由（不少于4个字符）"
            maxlength="200"
            show-word-limit
            @blur="handleCancelRemarkBlur"
            @keyup.enter="submitCancel"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCancel">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BatchRecord">
import { ref, reactive, toRefs, nextTick } from 'vue'
// WarningFilled 用于状态列"已取消"时显示的提示图标
import { WarningFilled } from '@element-plus/icons-vue'
import { listBatch_record, createBatchRecord, delBatch_record, auditBatchRecord, deleteBatchRecordCascade, cancelBatchRecord } from "@/api/batch/batch_record"
import { getToken } from '@/utils/auth'
import { useBizDict } from '@/utils/bizDict'
import BatchRecordGenerate from '@/views/batch/components/BatchRecordGenerate.vue'
import BatchOrderView from '@/views/batch/components/BatchOrderView.vue'
import BatchRecordView from '@/views/batch/components/BatchRecordView.vue'

const { proxy } = getCurrentInstance()
const { biz_record_status } = useBizDict('biz_record_status')

const recordList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const total = ref(0)

const generateRef = ref(null)
const orderViewRef = ref(null)
const recordViewRef = ref(null)

// ==================== 取消批记录对话框状态 ====================
/**
 * 取消批记录对话框是否可见
 */
const cancelDialogVisible = ref(false)

/**
 * 取消批记录对话框标题
 */
const cancelTitle = ref('取消批记录')

/**
 * 取消批记录表单引用（用于调用 validate 方法）
 */
const cancelFormRef = ref(null)

/**
 * 取消批记录表单数据
 * - recordId：待取消的批记录ID
 * - remark：取消理由（提交前会做 trim 处理）
 */
const cancelForm = reactive({
  recordId: null,
  remark: ''
})

/**
 * 取消批记录表单校验规则
 * - remark 必填
 * - remark 长度 4~200 字符（与前端输入框 show-word-limit 的 maxlength 一致）
 * - 校验基于 trim 后的值（提交前会先 trim）
 */
const cancelRules = {
  remark: [
    { required: true, message: '取消理由不能为空', trigger: 'blur' },
    { min: 4, max: 200, message: '取消理由不少于4个字符', trigger: 'blur' }
  ]
}

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    productCode: undefined,
    productName: undefined,
    batchNumber: undefined,
    schemeName: undefined,
    status: undefined,
    delFlag: '0',
    orderByColumn: 'create_time',
    isAsc: 'desc'
  }
})

const { queryParams } = toRefs(data)

/**
 * 导入相关配置
 */
const importUrl = ref(import.meta.env.VITE_APP_BASE_API + '/batch/batch_order/import/')
const headers = ref({ Authorization: 'Bearer ' + getToken() })

/**
 * 上传前校验：只允许上传 Excel 文件
 * @param {Object} file 上传文件对象
 * @returns {Boolean} 是否通过校验
 */
function beforeUpload(file) {
  const isExcel = file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx')
  if (!isExcel) {
    proxy.$modal.msgError('只能上传 .xls 或 .xlsx 格式文件')
    return false
  }
  return true
}

/**
 * 导入成功回调
 * @param {Object} response 后端响应
 * @param {Object} uploadFile 上传文件对象
 */
function handleImportSuccess(response) {
  if (response.code === 200) {
    proxy.$modal.msgSuccess('导入成功')
    getList()
  } else {
    proxy.$modal.msgError(response.msg || '导入失败')
  }
}

/**
 * 导入失败回调
 * @param {Error} error 错误对象
 */
function handleImportError(error) {
  proxy.$modal.msgError('导入失败：' + error.message)
}

/** 查询批记录列表 */
function getList() {
  loading.value = true
  listBatch_record(queryParams.value).then(response => {
    recordList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 新增按钮操作：快速创建批记录 */
function handleAdd() {
  createBatchRecord().then(() => {
    proxy.$modal.msgSuccess('新建成功')
    getList()
  })
}

/** 生成按钮操作 */
function handleGenerate(row) {
  generateRef.value?.open(row)
}

/** 查看工单详情 */
function handleViewOrder(row) {
  orderViewRef.value?.open(row.orderId)
}

/** 查看批记录结构 */
function handleViewRecord(row) {
  recordViewRef.value?.open(row.recordId)
}

/** 审核按钮操作 */
function handleAudit(row) {
  proxy.$modal.confirm('确认审核通过该批记录？').then(() => {
    return auditBatchRecord(row.recordId)
  }).then(() => {
    proxy.$modal.msgSuccess('审核成功')
    getList()
  }).catch(() => {})
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('确认删除该批记录？此操作将同时删除关联数据，且不可恢复！').then(() => {
    return deleteBatchRecordCascade(row.recordId)
  }).then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  }).catch(() => {})
}

/**
 * 取消按钮操作：打开取消批记录对话框
 *
 * 相比原来的 $prompt 方式，改为自定义 el-dialog 打开：
 * - 支持对输入框值进行 trim 回填（所见即所得）
 * - 支持 element-plus 的表单校验（必填 + 长度）
 * - 传入当前行的 recordId，用于提交时定位目标记录
 *
 * @param {Object} row 当前行的批记录数据
 */
function handleUnAudit(row) {
  cancelForm.recordId = row.recordId
  cancelForm.remark = ''
  cancelDialogVisible.value = true
  // 等待对话框渲染后再清除校验状态，避免残留上一次的红色错误提示
  nextTick(() => cancelFormRef.value?.clearValidate())
}

/**
 * 取消理由输入框失焦时自动 trim 回填
 *
 * 用户输入完成后点击"确定"，先触发 input 的 blur 事件：
 * 1. 将输入值去除首尾空格
 * 2. 回填到输入框（所见即所得，用户能感知输入被整理）
 * 然后再执行提交逻辑（submitCancel）
 *
 * 该处理避免了用户带着多余空格提交，也避免 form 校验失败时用户困惑
 */
function handleCancelRemarkBlur() {
  if (cancelForm.remark) {
    cancelForm.remark = cancelForm.remark.trim()
  }
}

/**
 * 提交取消批记录
 *
 * 执行步骤：
 * 1. 先 trim 输入框的值并回填（双保险，防止用户通过回车提交时未触发 blur）
 * 2. 执行表单校验（必填 + 长度 4~200）
 * 3. 校验通过后调用接口，将取消理由持久化到 batch_record.remark
 * 4. 成功后关闭对话框、提示、刷新列表
 *
 * 接口异常由 request 拦截器统一提示，本方法内不重复提示
 */
async function submitCancel() {
  // 第一步：trim 回填（双保险）
  cancelForm.remark = (cancelForm.remark || '').trim()

  // 第二步：表单校验
  try {
    await cancelFormRef.value.validate()
  } catch (e) {
    return
  }

  // 第三步：提交
  try {
    await cancelBatchRecord(cancelForm.recordId, cancelForm.remark)
    proxy.$modal.msgSuccess('取消成功')
    cancelDialogVisible.value = false
    getList()
  } catch (e) {
    // 接口异常由 request 拦截器统一提示
  }
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId)
}

getList()
</script>

<style scoped>
/* ============================================================
 * 状态列样式
 * - .status-cell 使用 flex 布局，让 dict-tag 与提示图标水平居中对齐
 * - .status-remark-icon 为取消理由提示图标，鼠标悬停显示 remark
 * ============================================================ */
.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-remark-icon {
  font-size: 14px;
  color: #e6a23c;       /* 橙色，与"已取消"的警示语义相符 */
  cursor: help;         /* 鼠标变为问号样式，暗示可查看提示 */
}
</style>