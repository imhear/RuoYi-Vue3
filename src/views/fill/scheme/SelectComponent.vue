<template>
  <!-- 选择组件路径对话框（单选模式，点击整行选中） -->
  <el-dialog title="选择组件路径" v-model="visible" width="900px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="组件完整路径" prop="componentPath">
        <el-input v-model="queryParams.componentPath" placeholder="请输入组件完整路径" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="是否当前生效" prop="isCurrent">
        <el-select v-model="queryParams.isCurrent" placeholder="请选择" clearable style="width: 120px">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        ref="componentTableRef"
        :data="componentList"
        @row-click="handleRowClick"
        style="width: 100%"
        height="400px"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="组件完整路径" align="center" prop="componentPath" :show-overflow-tooltip="true" />
        <el-table-column label="是否当前生效" align="center" prop="isCurrent" />
        <el-table-column label="生效日期" align="center" prop="effectiveDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更说明" align="center" prop="changelog" :show-overflow-tooltip="true" />
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
import { listComponent } from "@/api/fill/component"

const { proxy } = getCurrentInstance()

const visible = ref(false)
const total = ref(0)
const componentList = ref([])
const selectedRows = ref([])
const componentTableRef = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  componentPath: undefined,
  isCurrent: undefined,
  status: '0',
  delFlag: '0'
})

const emit = defineEmits(["ok"])

/** 打开对话框 */
function show() {
  getList()
  visible.value = true
}

/** 查询组件路径列表 */
function getList() {
  listComponent(queryParams).then(res => {
    componentList.value = res.rows
    total.value = res.total
    // 清除所有选中
    componentTableRef.value?.clearSelection()
    selectedRows.value = []
  })
}

/**
 * 行点击事件：实现点击整行选中/取消，且保持最多选中一行
 */
function handleRowClick(row) {
  const isSelected = selectedRows.value.some(r => r.componentPath === row.componentPath)
  if (isSelected) {
    componentTableRef.value.toggleRowSelection(row, false)
    selectedRows.value = []
  } else {
    componentTableRef.value.clearSelection()
    componentTableRef.value.toggleRowSelection(row, true)
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
    proxy.$modal.msgWarning('请选择一条组件路径记录')
    return
  }
  visible.value = false
  emit("ok", selectedRows.value[0])
}

defineExpose({ show })
</script>