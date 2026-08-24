<template>
  <!-- 选择用户对话框（单选模式） -->
  <el-dialog title="选择用户" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
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
        ref="userTableRef"
        :data="userList"
        @row-click="handleRowClick"
        style="width: 100%"
        height="400px"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机" align="center" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
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
        <el-button type="primary" @click="handleConfirm" :disabled="!selectedUser">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listUser } from "@/api/system/user"

defineOptions({ name: 'SelectUser' })

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const visible = ref(false)
const total = ref(0)
const userList = ref([])
const userTableRef = ref(null)
const selectedUser = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  status: '0'
})

const emit = defineEmits(['ok'])

/** 打开对话框 */
function show() {
  getList()
  visible.value = true
}

/** 查询用户列表 */
function getList() {
  listUser(queryParams).then(res => {
    userList.value = res.rows
    total.value = res.total
    userTableRef.value?.clearSelection()
    selectedUser.value = null
  })
}

/**
 * 行点击事件：单选，点击整行选中/取消
 */
function handleRowClick(row) {
  const isSelected = selectedUser.value?.userId === row.userId
  if (isSelected) {
    userTableRef.value.toggleRowSelection(row, false)
    selectedUser.value = null
  } else {
    userTableRef.value.clearSelection()
    userTableRef.value.toggleRowSelection(row, true)
    selectedUser.value = row
  }
}

/** 搜索按钮 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 确认选择 */
function handleConfirm() {
  if (!selectedUser.value) {
    proxy.$modal.msgWarning('请选择一个用户')
    return
  }
  visible.value = false
  emit('ok', selectedUser.value)
}

defineExpose({ show })
</script>