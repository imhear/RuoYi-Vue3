<template>
  <div class="app-container">
    <h4 class="form-header">工作单元：{{ workUnit.name }}（{{ workUnit.code }}）</h4>
    <el-form @submit.native.prevent>
      <el-form-item label="工作单元名称">
        <el-input v-model="workUnit.name" disabled />
      </el-form-item>
      <el-form-item label="工作单元编码">
        <el-input v-model="workUnit.code" disabled />
      </el-form-item>
      <el-form-item label="分配角色">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="roleList"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="角色编号" prop="roleId" width="120" />
          <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" />
          <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" />
          <el-table-column label="显示顺序" prop="roleSort" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
                {{ scope.row.status === '0' ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center;margin-left:120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="WorkUnitAuthRole">
import { getWork_unit } from '@/api/basic/work_unit'
import { getWorkUnitRoleIds, saveWorkUnitRoles } from '@/api/basic/work_unit_role'
import { listRole } from '@/api/system/role'

const route = useRoute()
const { proxy } = getCurrentInstance()

/** 当前工作单元信息 */
const workUnit = ref({})
/** 全部角色列表 */
const roleList = ref([])
/** 已分配的角色ID集合 */
const roleIds = ref([])
/** 表格已选中的角色 */
const selectedRoles = ref([])
/** 加载状态 */
const loading = ref(false)
/** 表格组件引用 */
const tableRef = ref(null)

/**
 * 初始化加载
 * 
 * 并行加载三个数据：
 * 1. 工作单元详情
 * 2. 全部角色列表
 * 3. 该工作单元已关联的角色ID
 * 
 * 加载完成后，根据已关联角色ID设置表格的勾选状态。
 */
async function init() {
  const workUnitId = route.params && route.params.workUnitId
  if (!workUnitId) {
    proxy.$modal.msgError('工作单元ID无效')
    return
  }
  loading.value = true
  try {
    const [workUnitRes, roleListRes, roleIdsRes] = await Promise.all([
      getWork_unit(workUnitId),
      listRole({ pageNum: 1, pageSize: 1000 }),
      getWorkUnitRoleIds(workUnitId)
    ])
    workUnit.value = workUnitRes.data || {}
    roleList.value = (roleListRes.rows || roleListRes.data || []).filter(r => r.status === '0')
    roleIds.value = roleIdsRes.data || []
    // 设置表格勾选状态
    nextTick(() => {
      roleList.value.forEach(role => {
        if (roleIds.value.includes(role.roleId)) {
          tableRef.value?.toggleRowSelection(role, true)
        }
      })
    })
  } catch (error) {
    proxy.$modal.msgError('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 表格多选变化回调
 * 
 * 记录当前已选中的角色行，供提交时提取 roleId。
 */
function handleSelectionChange(selection) {
  selectedRoles.value = selection
}

/**
 * 提交角色分配
 * 
 * 收集已选中的角色ID，调用保存接口（全量替换）。
 * 成功后调用 close 返回上一页。
 */
function submitForm() {
  const roleIds = selectedRoles.value.map(item => item.roleId)
  const workUnitId = route.params && route.params.workUnitId
  if (!workUnitId) {
    proxy.$modal.msgError('工作单元ID无效')
    return
  }
  saveWorkUnitRoles(workUnitId, roleIds).then(() => {
    proxy.$modal.msgSuccess('分配角色成功')
    close()
  })
}

/**
 * 返回上一页
 */
function close() {
  const obj = { path: '/basic/work_unit' }
  proxy.$tab.closeOpenPage(obj)
}

init()
</script>