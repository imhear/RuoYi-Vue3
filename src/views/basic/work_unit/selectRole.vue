<template>
  <!-- 选择角色 -->
  <el-dialog title="选择角色" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
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
        @row-click="clickRow"
        ref="refTable"
        :data="roleList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="角色编号" prop="roleId" width="120" />
        <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" />
        <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
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
        <el-button type="primary" @click="handleSelectRole">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SelectRole">
import { unallocatedRoleList, authRoleSelectAll } from "@/api/basic/work_unit"

const props = defineProps({
  /** 当前工作单元ID */
  workUnitId: {
    type: [Number, String],
    required: true
  }
})

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict("sys_normal_disable")

/** 未分配角色列表（当前页） */
const roleList = ref([])

/** 对话框可见性 */
const visible = ref(false)

/** 总条数 */
const total = ref(0)

/** 当前已勾选的角色ID */
const roleIds = ref([])

/** 查询参数 */
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  workUnitId: undefined,
  roleName: undefined,
  roleKey: undefined
})

/**
 * 显示弹框
 *
 * 由父组件通过 ref 调用，打开对话框并加载未分配角色列表。
 */
function show() {
  queryParams.workUnitId = props.workUnitId
  queryParams.pageNum = 1
  getList()
  visible.value = true
}

/**
 * 行点击选择
 *
 * 与若依 selectUser.vue 一致：点击整行切换勾选状态。
 *
 * @param {Object} row 点击的角色行数据
 */
function clickRow(row) {
  proxy.$refs["refTable"].toggleRowSelection(row)
}

/**
 * 多选框选中数据
 *
 * @param {Array} selection 当前选中的角色行数组
 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map(item => item.roleId)
}

/**
 * 查询未分配角色列表
 *
 * 直接调用后端 /authRole/unallocatedList 分页接口，
 * 与若依官方 authUser/unallocatedList 完全一致。
 */
function getList() {
  unallocatedRoleList(queryParams).then(res => {
    roleList.value = res.rows
    total.value = res.total
  })
}

/**
 * 搜索按钮操作
 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/**
 * 重置按钮操作
 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

const emit = defineEmits(["ok"])

/**
 * 提交角色选择
 *
 * 调用后端 /authRole/selectAll 接口，传入 { workUnitId, roleIds: '1,2,3' }。
 */
function handleSelectRole() {
  const uIds = roleIds.value.join(",")
  if (uIds === "") {
    proxy.$modal.msgError("请选择要分配的角色")
    return
  }
  authRoleSelectAll({ workUnitId: props.workUnitId, roleIds: uIds }).then(res => {
    proxy.$modal.msgSuccess(res.msg || "分配角色成功")
    visible.value = false
    emit("ok")
  })
}

defineExpose({
  show,
})
</script>