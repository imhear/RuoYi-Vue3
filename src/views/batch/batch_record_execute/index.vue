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
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template #default="scope">
          <dict-tag :options="batch_record_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- 工单号：点击打开聚合入口 -->
      <el-table-column label="工单号" align="center" min-width="120">
        <template #default="scope">
          <el-button v-if="scope.row.orderNum" link type="primary" @click="handleOpen(scope.row)">{{ scope.row.orderNum }}</el-button>
          <span v-else>-</span>
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

    <!-- 聚合入口弹窗 -->
    <BatchRecordAggregateDialog ref="aggregateRef" />
  </div>
</template>

<script setup name="BatchRecordExecute">
import { ref, reactive, toRefs } from 'vue'
import { listBatch_record } from "@/api/batch/batch_record"
import BatchRecordAggregateDialog from './components/BatchRecordAggregateDialog.vue'

const { proxy } = getCurrentInstance()
const { batch_record_status } = proxy.useDict('batch_record_status')

const recordList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const total = ref(0)
const aggregateRef = ref(null)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    productCode: undefined,
    productName: undefined,
    batchNumber: undefined,
    schemeName: undefined,
    status: '1',   // 已审核，进入填报阶段
    delFlag: '0',
    orderByColumn: 'create_time',
    isAsc: 'desc'
  }
})

const { queryParams } = toRefs(data)

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

/** 打开聚合入口 */
function handleOpen(row) {
  aggregateRef.value?.open(row.recordId, row.orderNum)
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId)
}

getList()
</script>