<template>
  <!-- 选择表单模板对话框（单选模式，点击整行选中） -->
  <el-dialog title="选择表单模板" v-model="visible" width="800px" height="460px" top="5vh" append-to-body>
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
        ref="templateTableRef"
        :data="templateList"
        @row-click="handleRowClick"
        style="width: 100%"
        height="460px"
      >
        <el-table-column type="selection" width="55" align="center" min-width="30"/>
        <el-table-column label="物理表名" align="center" prop="tableName" :show-overflow-tooltip="true" min-width="100"/>
        <el-table-column label="物理表注释" align="center" prop="tableComment" :show-overflow-tooltip="true" min-width="130"/>
        <el-table-column label="所属模块" align="center" prop="moduleName" min-width="40"/>
        <el-table-column label="所在分组" align="center" prop="groupName" min-width="40"/>
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
import { listFormtemplate } from "@/api/fill/formtemplate"

const { proxy } = getCurrentInstance()

const visible = ref(false)
const total = ref(0)
const templateList = ref([])
const selectedRows = ref([])
const templateTableRef = ref(null)

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

/** 查询模板列表，并清空选中状态 */
function getList() {
  listFormtemplate(queryParams).then(res => {
    templateList.value = res.rows
    total.value = res.total
    // 清除所有选中
    templateTableRef.value?.clearSelection()
    selectedRows.value = []
  })
}

/**
 * 行点击事件：实现点击整行选中/取消，且保持最多选中一行
 */
function handleRowClick(row) {
  // 判断当前行是否已被选中
  const isSelected = selectedRows.value.some(r => r.formId === row.formId)
  if (isSelected) {
    // 取消选中当前行
    templateTableRef.value.toggleRowSelection(row, false)
    selectedRows.value = []
  } else {
    // 先清除所有选中，再选中当前行
    templateTableRef.value.clearSelection()
    templateTableRef.value.toggleRowSelection(row, true)
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
    proxy.$modal.msgWarning('请选择一条表单模板记录')
    return
  }
  visible.value = false
  emit("ok", selectedRows.value[0])
}

defineExpose({ show })
</script>