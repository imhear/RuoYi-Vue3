<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
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
          @click="openSelectRole"
          v-hasPermi="['basic:work_unit:edit']"
        >添加角色</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="CircleClose"
          :disabled="multiple"
          @click="cancelAuthRoleAll"
          v-hasPermi="['basic:work_unit:edit']"
        >批量取消授权</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Close"
          @click="handleClose"
        >关闭</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="CircleClose"
            @click="cancelAuthRole(scope.row)"
            v-hasPermi="['basic:work_unit:edit']"
          >取消授权</el-button>
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

    <!-- 选择角色对话框 -->
    <select-role ref="selectRef" :workUnitId="queryParams.workUnitId" @ok="handleQuery" />
  </div>
</template>

<script setup name="WorkUnitAuthRole">
import SelectRole from "./selectRole"
import { allocatedRoleList, authRoleCancel, authRoleCancelAll } from '@/api/basic/work_unit'

const route = useRoute()
const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict("sys_normal_disable")

/** 已分配角色列表（当前页） */
const roleList = ref([])

/** 多选选中的角色ID集合 */
const selectedRoleIds = ref([])

/** 加载状态 */
const loading = ref(true)

/** 是否显示搜索区域 */
const showSearch = ref(true)

/** 批量取消按钮是否禁用（未选中时禁用） */
const multiple = ref(true)

/** 列表总条数 */
const total = ref(0)

/** 角色选择对话框引用 */
const selectRef = ref(null)

/** 查询参数（含从路由参数解析的 workUnitId） */
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  workUnitId: route.params.workUnitId,
  roleName: undefined,
  roleKey: undefined
})

/**
 * 查询已分配角色列表
 *
 * 直接调用后端 /authRole/allocatedList 分页接口，
 * 由后端联表 sys_role 返回角色完整信息，与若依官方 authUser/allocatedList 完全一致。
 */
function getList() {
  loading.value = true
  allocatedRoleList(queryParams).then(response => {
    roleList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/**
 * 搜索按钮操作
 *
 * 重置页码到第 1 页后重新查询列表。
 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/**
 * 重置按钮操作
 *
 * 清空查询条件后重新查询列表。
 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/**
 * 多选框选中数据
 *
 * @param {Array} selection 当前选中的角色行数组
 */
function handleSelectionChange(selection) {
  selectedRoleIds.value = selection.map(item => item.roleId)
  multiple.value = !selection.length
}

/**
 * 打开选择角色对话框
 *
 * 对话框内部调用 /authRole/unallocatedList 分页接口，只展示未分配角色。
 */
function openSelectRole() {
  proxy.$refs["selectRef"].show()
}

/**
 * 取消单个角色授权
 *
 * 调用后端 /authRole/cancel 接口，传入 { workUnitId, roleId }。
 *
 * @param {Object} row 当前点击的角色行数据
 */
function cancelAuthRole(row) {
  proxy.$modal.confirm('确认要取消该角色"' + row.roleName + '"的授权吗？').then(function() {
    return authRoleCancel({ workUnitId: queryParams.workUnitId, roleId: row.roleId })
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("取消授权成功")
  }).catch(() => {})
}

/**
 * 批量取消授权
 *
 * 调用后端 /authRole/cancelAll 接口，传入 { workUnitId, roleIds: '1,2,3' }。
 */
function cancelAuthRoleAll() {
  const ids = selectedRoleIds.value.join(",")
  proxy.$modal.confirm("是否取消选中角色的授权数据项?").then(function() {
    return authRoleCancelAll({ workUnitId: queryParams.workUnitId, roleIds: ids })
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("取消授权成功")
  }).catch(() => {})
}

/**
 * 关闭并返回工作单元列表页
 *
 * 与若依官方分配用户页面的"关闭"行为一致：通过 $tab.closeOpenPage 关闭当前标签页并回到列表页。
 */
function handleClose() {
  const obj = { path: '/basic/work_unit' }
  proxy.$tab.closeOpenPage(obj)
}

/**
 * 初始化
 *
 * 校验路由参数，若 workUnitId 缺失则给出错误提示并终止。
 * 与官方 authUser.vue 一致：在 setup 顶层直接调用 getList()。
 */
function init() {
  if (!queryParams.workUnitId) {
    proxy.$modal.msgError('工作单元ID无效')
    return
  }
  getList()
}

init()
</script>