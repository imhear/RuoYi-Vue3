<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作码" prop="operationCode">
        <el-input
          v-model="queryParams.operationCode"
          placeholder="请输入操作码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作名称" prop="operationName">
        <el-input
          v-model="queryParams.operationName"
          placeholder="请输入操作名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="按钮名称" prop="buttonLabel">
        <el-input
          v-model="queryParams.buttonLabel"
          placeholder="请输入按钮名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="actionType">
        <el-select
          v-model="queryParams.actionType"
          placeholder="请选择操作类型"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="type in actionTypeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="权限标识" prop="perms">
        <el-input
          v-model="queryParams.perms"
          placeholder="请输入权限标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物理表名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入物理表名"
          clearable
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
          @click="handleAdd"
          v-hasPermi="['fill:operation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:operation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:operation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:operation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="operationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作码" align="center" prop="operationCode" />
      <el-table-column label="操作名称" align="center" prop="operationName" />
      <el-table-column label="操作类型" align="center" prop="actionType">
        <template #default="scope">
          <el-tag v-if="scope.row.actionType">{{ getActionTypeLabel(scope.row.actionType) }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="按钮名称" align="center" prop="buttonLabel" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="权限标识" align="center" prop="perms" :show-overflow-tooltip="true" />
      <el-table-column label="后端接口路径" align="center" prop="backendRoute" :show-overflow-tooltip="true" />
      <el-table-column label="前端组件路径" align="center" prop="component" :show-overflow-tooltip="true" />
      <el-table-column label="排序号" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:operation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:operation:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改操作码注册对话框 -->
    <el-dialog :title="title" v-model="open" width="650px" append-to-body>
      <el-form ref="operationRef" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作码" prop="operationCode">
              <el-input v-model="form.operationCode" placeholder="请输入操作码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作名称" prop="operationName">
              <el-input v-model="form.operationName" placeholder="请输入操作名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作类型" prop="actionType">
              <el-select v-model="form.actionType" placeholder="请选择操作类型" style="width: 100%">
                <el-option
                  v-for="type in actionTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="按钮名称" prop="buttonLabel">
              <el-input v-model="form.buttonLabel" placeholder="请输入按钮名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请选择物理表" readonly>
                <template #append>
                  <el-button icon="Search" @click="openSelectForm" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限标识" prop="perms">
              <el-tree-select
                v-model="selectedSysMenuId"
                :data="sysMenuTreeData"
                :props="sysMenuTreeProps"
                node-key="menuId"
                check-strictly
                placeholder="请选择系统按钮权限标识"
                style="width: 100%"
                @change="handleSysMenuSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="后端接口路径" prop="backendRoute">
              <el-input v-model="form.backendRoute" placeholder="请输入后端接口路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请选择前端组件文件" readonly>
                <template #append>
                  <el-button icon="Search" @click="openFrontendFileSelector" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序号" prop="orderNum">
              <el-input-number v-model="form.orderNum" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选择物理表对话框 -->
    <SelectForm ref="selectFormRef" @ok="onFormSelected" />
    <!-- 选择前端组件文件对话框 -->
    <FrontendFileSelector ref="frontendFileSelectorRef" @ok="onFrontendFileSelected" />
  </div>
</template>

<script setup name="Operation">
import { ref, reactive, computed } from 'vue'
import { listOperation, getOperation, delOperation, addOperation, updateOperation } from "@/api/fill/operation"
import { listMenu } from "@/api/system/menu"
import SelectForm from "@/views/fill/components/SelectForm.vue"
import FrontendFileSelector from "@/views/fill/components/FrontendFileSelector.vue"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const operationList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const selectFormRef = ref(null)
const frontendFileSelectorRef = ref(null)

/** 系统菜单树数据（用于 el-tree-select） */
const sysMenuTreeData = ref([])

/** 当前选中的系统菜单ID（权限标识回显） */
const selectedSysMenuId = ref(null)

/** 操作类型选项 */
const actionTypeOptions = [
  { value: 'PREVIEW', label: '查看' },
  { value: 'SUBMIT', label: '提交' },
  { value: 'REVIEW', label: '复核' },
  { value: 'INSPECT', label: '检查' },
  { value: 'ARCHIVE', label: '归档' },
  { value: 'CANCEL_REVIEW', label: '取消复核' },
  { value: 'CANCEL_INSPECT', label: '取消检查' },
  { value: 'CANCEL_ARCHIVE', label: '取消归档' }
]

const data = reactive({
  form: {
    operationId: null,
    operationCode: null,
    operationName: null,
    actionType: null,
    buttonLabel: null,
    tableName: null,
    perms: null,
    backendRoute: null,
    component: null,
    orderNum: 0,
    status: '0',
    delFlag: '0',
    remark: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    operationCode: undefined,
    operationName: undefined,
    buttonLabel: undefined,
    actionType: undefined,
    perms: undefined,
    tableName: undefined,
    status: undefined,
  },
  rules: {
    operationCode: [
      { required: true, message: "操作码不能为空", trigger: "blur" }
    ],
    operationName: [
      { required: true, message: "操作名称不能为空", trigger: "blur" }
    ],
    actionType: [
      { required: true, message: "操作类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/**
 * el-tree-select props：只允许选择按钮类型（F）
 */
const sysMenuTreeProps = computed(() => {
  return {
    label: 'menuName',
    children: 'children',
    disabled: (data) => data.menuType !== 'F'
  }
})

/** 获取操作类型标签 */
function getActionTypeLabel(value) {
  const found = actionTypeOptions.find(item => item.value === value)
  return found ? found.label : value
}

/** 查询操作码注册列表 */
function getList() {
  loading.value = true
  listOperation(queryParams.value).then(response => {
    operationList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 加载系统菜单树 */
async function loadSysMenuTree() {
  try {
    const res = await listMenu()
    const list = res.data || []
    sysMenuTreeData.value = buildSysMenuTree(list)
  } catch (e) {
    proxy.$modal.msgError('加载系统菜单树失败')
  }
}

/** 构建系统菜单树 */
function buildSysMenuTree(list) {
  const map = {}
  list.forEach(item => {
    item.children = []
    map[item.menuId] = item
  })
  const tree = []
  list.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) {
      tree.push(item)
    } else {
      const parent = map[item.parentId]
      if (parent) parent.children.push(item)
    }
  })
  return tree
}

/** 在系统菜单树中查找节点 */
function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.menuId === id) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/** 在系统菜单树中根据 perms 查找节点 */
function findNodeByPerms(nodes, perms) {
  for (const node of nodes) {
    if (node.perms === perms) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeByPerms(node.children, perms)
      if (found) return found
    }
  }
  return null
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    operationId: null,
    operationCode: null,
    operationName: null,
    actionType: null,
    buttonLabel: null,
    tableName: null,
    perms: null,
    backendRoute: null,
    component: null,
    orderNum: 0,
    status: '0',
    delFlag: '0',
    remark: null
  }
  selectedSysMenuId.value = null
  proxy.resetForm("operationRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.operationId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  loadSysMenuTree()
  open.value = true
  title.value = "添加操作码注册"
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset()
  await loadSysMenuTree()
  const _operationId = row.operationId || ids.value
  getOperation(_operationId).then(response => {
    form.value = response.data
    // 根据 perms 回显系统菜单选中项
    selectedSysMenuId.value = null
    if (form.value.perms) {
      const matched = findNodeByPerms(sysMenuTreeData.value, form.value.perms)
      if (matched) {
        selectedSysMenuId.value = matched.menuId
      }
    }
    open.value = true
    title.value = "修改操作码注册"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["operationRef"].validate(valid => {
    if (valid) {
      if (form.value.operationId != null) {
        updateOperation(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addOperation(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _operationIds = row.operationId || ids.value
  proxy.$modal.confirm('是否确认删除操作码注册编号为"' + _operationIds + '"的数据项？').then(function() {
    return delOperation(_operationIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/operation/export', {
    ...queryParams.value
  }, `operation_${new Date().getTime()}.xlsx`)
}

/** 打开选择物理表对话框 */
function openSelectForm() {
  selectFormRef.value.show()
}

/** 物理表选择回调 */
function onFormSelected(row) {
  form.value.tableName = row.tableName
}

/** 打开前端文件选择器 */
function openFrontendFileSelector() {
  frontendFileSelectorRef.value.show()
}

/** 前端组件文件选择回调 */
function onFrontendFileSelected(filePath) {
  form.value.component = filePath
}

/** 系统菜单选择回调（仅回填 perms 和名称） */
function handleSysMenuSelect(menuId) {
  if (!menuId) {
    form.value.perms = ''
    return
  }
  const node = findNodeById(sysMenuTreeData.value, menuId)
  if (node) {
    form.value.perms = node.perms || ''
    if (!form.value.operationName) {
      form.value.operationName = node.menuName || ''
    }
  }
}

// 初始化加载系统菜单树
loadSysMenuTree()
getList()
</script>