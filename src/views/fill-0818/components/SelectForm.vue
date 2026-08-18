<template>
  <!-- 选择物理表对话框（单选模式，点击整行选中） -->
  <el-dialog title="选择物理表" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="物理表名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入物理表名"
          clearable
          style="width: 180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物理表注释" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入物理表注释"
          clearable
          style="width: 180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        ref="formTableRef"
        :data="formList"
        @row-click="handleRowClick"
        style="width: 100%"
        height="460px"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="物理表名" align="center" prop="tableName" :show-overflow-tooltip="true" />
        <el-table-column label="物理表注释" align="center" prop="tableComment" :show-overflow-tooltip="true" />
        <el-table-column label="所属模块" align="center" prop="module" />
        <el-table-column label="所在分组" align="center" prop="groupName" />
      </el-table>
      <pagination
        v-show="total>0"
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
import { listForm } from "@/api/fill/form"

const { proxy } = getCurrentInstance()

const visible = ref(false)
const total = ref(0)
const formList = ref([])
const selectedRows = ref([])
const formTableRef = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tableName: undefined,
  tableComment: undefined,
  status: '0',
  delFlag: '0'
})

const emit = defineEmits(["ok"])

/** 打开对话框 */
function show() {
  getList()
  visible.value = true
}

/** 查询表单模板列表 */
function getList() {
  listForm(queryParams).then(res => {
    formList.value = res.rows
    total.value = res.total
    // 清除所有选中
    formTableRef.value?.clearSelection()
    selectedRows.value = []
  })
}

/**
 * 行点击事件：实现点击整行选中/取消，且保持最多选中一行
 */
function handleRowClick(row) {
  const isSelected = selectedRows.value.some(r => r.tableName === row.tableName)
  if (isSelected) {
    // 取消选中当前行
    formTableRef.value.toggleRowSelection(row, false)
    selectedRows.value = []
  } else {
    // 先清除所有选中，再选中当前行
    formTableRef.value.clearSelection()
    formTableRef.value.toggleRowSelection(row, true)
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
    proxy.$modal.msgWarning('请选择一条物理表记录')
    return
  }
  visible.value = false
  emit("ok", selectedRows.value[0])
}

defineExpose({ show })
</script>