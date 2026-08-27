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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['batch:record:add']">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="180">
        <template #default="scope">
          <!-- 审核按钮：待审核状态显示 -->
          <el-button v-if="scope.row.status === '0' && scope.row.releaseId" link type="warning" @click="handleAudit(scope.row)" v-hasPermi="['batch:record:audit']">审核</el-button>
          <!-- 删除按钮 -->
          <el-button link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['batch:record:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template #default="scope">
          <dict-tag :options="batch_record_status" :value="scope.row.status" />
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
            <el-button link type="primary" v-hasPermi="['batch:record:import']">导入</el-button>
          </el-upload>
          <!-- 已导入工单：显示工单号链接 -->
          <el-button v-else link type="primary" @click="handleViewOrder(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="批记录" align="center" min-width="120">
        <template #default="scope">
          <!-- 生成按钮：已导入工单且未生成方案时显示 -->
          <el-button v-if="scope.row.orderNum && !scope.row.releaseId && scope.row.status === '0'" link type="success" @click="handleGenerate(scope.row)" v-hasPermi="['batch:record:generate']">生成</el-button>
          <!-- 查看批记录结构按钮：已生成后显示 -->
          <el-button v-if="scope.row.releaseId" link type="primary" @click="handleViewRecord(scope.row)" v-hasPermi="['batch:record:query']">查看</el-button>
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
  </div>
</template>

<script setup name="BatchRecord">
import { ref, reactive, toRefs } from 'vue'
import { listBatch_record, createBatchRecord, delBatch_record, auditBatchRecord, deleteBatchRecordCascade } from "@/api/batch/batch_record"
import { getToken } from '@/utils/auth'
import BatchRecordGenerate from '@/views/batch/components/BatchRecordGenerate.vue'
import BatchOrderView from '@/views/batch/components/BatchOrderView.vue'
import BatchRecordView from '@/views/batch/components/BatchRecordView.vue'

const { proxy } = getCurrentInstance()
const { batch_record_status } = proxy.useDict('batch_record_status')

const recordList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const total = ref(0)

const generateRef = ref(null)
const orderViewRef = ref(null)
const recordViewRef = ref(null)

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
/** 删除按钮操作 */
// function handleDelete(row) {
//   proxy.$modal.confirm('确认删除该批记录？').then(() => {
//     return delBatch_record(row.recordId)
//   }).then(() => {
//     proxy.$modal.msgSuccess('删除成功')
//     getList()
//   }).catch(() => {})
// }

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId)
}

getList()
</script>