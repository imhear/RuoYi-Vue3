<template>
  <!-- 选择操作码对话框（单选模式） -->
  <el-dialog title="选择操作码" v-model="visible" width="900px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="操作码" prop="operationCode">
        <el-input v-model="queryParams.operationCode" placeholder="请输入操作码" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="操作名称" prop="operationName">
        <el-input v-model="queryParams.operationName" placeholder="请输入操作名称" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="按钮名称" prop="buttonLabel">
        <el-input v-model="queryParams.buttonLabel" placeholder="请输入按钮名称" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        ref="operationTableRef"
        :data="operationList"
        @row-click="handleRowClick"
        style="width: 100%"
        height="400px"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="操作码" align="center" prop="operationCode" :show-overflow-tooltip="true" />
        <el-table-column label="操作名称" align="center" prop="operationName" :show-overflow-tooltip="true" />
        <el-table-column label="按钮名称" align="center" prop="buttonLabel" />
        <el-table-column label="后端接口路径" align="center" prop="backendRoute" :show-overflow-tooltip="true" />
        <el-table-column label="前端组件路径" align="center" prop="component" :show-overflow-tooltip="true" />
        <!-- 新增权限标识列 -->
        <el-table-column label="权限标识" align="center" prop="perms" :show-overflow-tooltip="true" />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm" :disabled="selectedRows.length === 0">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listOperation } from "@/api/fill/operation"

const { proxy } = getCurrentInstance()

const visible = ref(false)
const total = ref(0)
const operationList = ref([])
const selectedRows = ref([])
const operationTableRef = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  operationCode: undefined,
  operationName: undefined,
  buttonLabel: undefined,
  status: '0',
  delFlag: '0'
})

const emit = defineEmits(["ok"])

/** 打开对话框 */
function show() {
  getList()
  visible.value = true
}

/** 查询操作码列表 */
function getList() {
  listOperation(queryParams).then(res => {
    operationList.value = res.rows || res.data || []
    total.value = res.total || 0
    operationTableRef.value?.clearSelection()
    selectedRows.value = []
  })
}

/**
 * 行点击事件：单选
 */
function handleRowClick(row) {
  const isSelected = selectedRows.value.some(r => r.operationId === row.operationId)
  if (isSelected) {
    operationTableRef.value.toggleRowSelection(row, false)
    selectedRows.value = []
  } else {
    operationTableRef.value.clearSelection()
    operationTableRef.value.toggleRowSelection(row, true)
    selectedRows.value = [row]
  }
}

/** 搜索按钮 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 确认选择 */
function handleConfirm() {
  if (selectedRows.value.length === 0) {
    proxy.$modal.msgWarning('请选择一条操作码记录')
    return
  }
  visible.value = false
  emit("ok", selectedRows.value[0])
}

defineExpose({ show })
</script>