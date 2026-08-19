<template>
  <!-- 选择系统菜单对话框（单选模式） -->
  <el-dialog title="选择系统菜单" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          style="width: 180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限标识" prop="perms">
        <el-input
          v-model="queryParams.perms"
          placeholder="请输入权限标识"
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
        ref="menuTableRef"
        :data="filteredMenuList"
        @row-click="handleRowClick"
        style="width: 100%"
        height="400px"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="菜单名称" align="center" prop="menuName" :show-overflow-tooltip="true" />
        <el-table-column label="菜单类型" align="center" prop="menuType" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === 'M'" type="primary" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.menuType === 'C'" type="success" size="small">菜单</el-tag>
            <el-tag v-else-if="scope.row.menuType === 'F'" type="warning" size="small">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="路由地址" align="center" prop="path" :show-overflow-tooltip="true" />
        <el-table-column label="组件路径" align="center" prop="component" :show-overflow-tooltip="true" />
        <el-table-column label="权限标识" align="center" prop="perms" :show-overflow-tooltip="true" />
      </el-table>
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
import { ref, reactive, computed } from 'vue'
import { listMenu } from "@/api/system/menu"

const { proxy } = getCurrentInstance()

const props = defineProps({
  menuType: { type: String, default: 'F' }   // 期望选择的菜单类型：M/C/F，默认按钮F
})

const visible = ref(false)
const allMenuList = ref([])          // 扁平化后的全部菜单（含子节点）
const selectedRows = ref([])
const menuTableRef = ref(null)

const queryParams = reactive({
  menuName: undefined,
  perms: undefined
})

const emit = defineEmits(["ok"])

/** 打开对话框 */
function show() {
  loadMenu()
  visible.value = true
}

/** 加载系统菜单并扁平化 */
async function loadMenu() {
  try {
    const res = await listMenu()
    const tree = res.data || []
    allMenuList.value = flatten(tree)
    // 清除选中
    menuTableRef.value?.clearSelection()
    selectedRows.value = []
  } catch (e) {
    proxy.$modal.msgError('加载系统菜单失败')
  }
}

/** 递归扁平化菜单树 */
function flatten(nodes) {
  let result = []
  nodes.forEach(node => {
    result.push(node)
    if (node.children && node.children.length > 0) {
      result = result.concat(flatten(node.children))
    }
  })
  return result
}

/** 根据菜单类型和查询条件过滤 */
const filteredMenuList = computed(() => {
  return allMenuList.value.filter(item => {
    if (item.menuType !== props.menuType) return false
    if (queryParams.menuName && !item.menuName.includes(queryParams.menuName)) return false
    if (queryParams.perms && !(item.perms || '').includes(queryParams.perms)) return false
    return true
  })
})

/**
 * 行点击事件：单选，点击整行选中/取消
 */
function handleRowClick(row) {
  const isSelected = selectedRows.value.some(r => r.menuId === row.menuId)
  if (isSelected) {
    menuTableRef.value.toggleRowSelection(row, false)
    selectedRows.value = []
  } else {
    menuTableRef.value.clearSelection()
    menuTableRef.value.toggleRowSelection(row, true)
    selectedRows.value = [row]
  }
}

/** 搜索按钮 */
function handleQuery() {
  // 无需分页，直接过滤
}

/** 重置按钮 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 确认选择 */
function handleConfirm() {
  if (selectedRows.value.length === 0) {
    proxy.$modal.msgWarning('请选择一条系统菜单记录')
    return
  }
  visible.value = false
  emit("ok", selectedRows.value[0])
}

defineExpose({ show })
</script>