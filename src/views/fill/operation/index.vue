<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作名称" prop="operationName">
        <el-input
          v-model="queryParams.operationName"
          placeholder="请输入操作名称"
          clearable
          style="width: 180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="节点类型" prop="menuType">
        <el-select v-model="queryParams.menuType" placeholder="节点类型" clearable style="width: 180px">
          <el-option label="目录" value="M" />
          <el-option label="菜单" value="C" />
          <el-option label="按钮" value="F" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 180px">
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
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
          type="warning"
          plain
          icon="Check"
          @click="handleSaveSort"
          v-hasPermi="['fill:operation:edit']"
        >保存排序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Sort"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 树形表格 -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="operationList"
      row-key="operationId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="operationName" label="操作名称" :show-overflow-tooltip="true" width="220">
        <template #default="scope">
          <span class="ml5">{{ scope.row.operationName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="类型" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.menuType === 'M'" type="primary" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.menuType === 'C'" type="success" size="small">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 'F'" type="warning" size="small">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operationCode" label="操作码" width="120" align="center" />
      <el-table-column prop="actionType" label="操作类型" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.actionType">{{ getActionTypeLabel(scope.row.actionType) }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="buttonLabel" label="按钮名称" width="100" align="center" />
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column prop="orderNum" label="排序" width="200">
        <template #default="scope">
          <el-input-number v-model="scope.row.orderNum" controls-position="right" :min="0" style="width: 88px" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:operation:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['fill:operation:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:operation:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/修改对话框 -->
    <el-dialog :title="title" v-model="open" width="720px" append-to-body>
      <el-form ref="operationRef" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级节点">
              <el-tree-select
                v-model="form.parentId"
                :data="operationOptions"
                :props="{ value: 'operationId', label: 'operationName', children: 'children' }"
                value-key="operationId"
                placeholder="选择上级节点"
                check-strictly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="节点类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio value="M">目录</el-radio>
                <el-radio value="C">菜单</el-radio>
                <el-radio value="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作名称" prop="operationName">
              <el-input v-model="form.operationName" placeholder="请输入操作名称" />
            </el-form-item>
          </el-col>

          <!-- 按钮专用字段 -->
          <template v-if="form.menuType === 'F'">
            <el-col :span="24">
              <el-form-item label="操作码" prop="operationCode">
                <el-input v-model="form.operationCode" placeholder="请输入操作码，如 3001" />
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
                <el-input v-model="form.buttonLabel" placeholder="请输入按钮名称，如 提交" />
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
                <el-input v-model="form.backendRoute" placeholder="请输入后端接口路径模板，如 /batch/batch_record_menu/approve/{menuId}?remark={remark}" />
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
            <el-col :span="12">
              <el-form-item label="是否可反审" prop="isUnaudit">
                <el-radio-group v-model="form.isUnaudit">
                  <el-radio label="0">可反审</el-radio>
                  <el-radio label="1">不可反审</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
import { ref, reactive, computed, nextTick } from 'vue'
import { listOperation, getOperation, delOperation, addOperation, updateOperation, updateOperationSort } from "@/api/fill/operation"
import { listMenu } from "@/api/system/menu"
import SelectForm from "@/views/fill/components/SelectForm.vue"
import FrontendFileSelector from "@/views/fill/components/FrontendFileSelector.vue"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const operationList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref("")
const operationOptions = ref([])
const isExpandAll = ref(false)
const refreshTable = ref(true)
const selectFormRef = ref(null)
const frontendFileSelectorRef = ref(null)

/** 系统菜单树数据（用于权限标识选择） */
const sysMenuTreeData = ref([])
/** 当前选中的系统菜单ID（权限标识回显） */
const selectedSysMenuId = ref(null)

/** 原始排序记录，用于保存排序时比对 */
const originalOrders = ref({})

/** 操作类型选项 */
const actionTypeOptions = [
  { value: 'PREVIEW', label: '查看' },
  { value: 'EDIT', label: '编辑' },
  { value: 'SUBMIT', label: '提交' },
  { value: 'REVIEW', label: '复核' },
  { value: 'INSPECT', label: '检查' },
  { value: 'ARCHIVE', label: '归档' },
  { value: 'CANCEL_SUBMIT', label: '取消提交' },
  { value: 'CANCEL_REVIEW', label: '取消复核' },
  { value: 'CANCEL_INSPECT', label: '取消检查' },
  { value: 'CANCEL_ARCHIVE', label: '取消归档' }
]

const data = reactive({
  form: {
    operationId: null,
    parentId: 0,
    menuType: 'F',
    operationCode: null,
    actionType: null,
    buttonLabel: null,
    tableName: null,
    perms: null,
    backendRoute: null,
    component: null,
    orderNum: 0,
    status: '0',
    isUnaudit: '1',
    delFlag: '0',
    remark: null
  },
  queryParams: {
    operationName: undefined,
    menuType: undefined,
    status: undefined
  },
  rules: {
    operationName: [{ required: true, message: "操作名称不能为空", trigger: "blur" }],
    menuType: [{ required: true, message: "节点类型不能为空", trigger: "change" }],
    orderNum: [{ required: true, message: "显示顺序不能为空", trigger: "blur" }],
    operationCode: [
      {
        validator: (rule, value, callback) => {
          if (data.form.menuType === 'F' && !value) {
            callback(new Error('操作码不能为空'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    actionType: [
      {
        validator: (rule, value, callback) => {
          if (data.form.menuType === 'F' && !value) {
            callback(new Error('操作类型不能为空'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/**
 * el-tree-select props：只允许选择系统菜单中的按钮类型（F）
 */
const sysMenuTreeProps = computed(() => {
  return {
    label: 'menuName',
    children: 'children',
    disabled: (node) => node.menuType !== 'F'
  }
})

/**
 * 获取操作类型标签文本
 * @param {String} value 操作类型值
 * @returns {String} 操作类型中文标签
 */
function getActionTypeLabel(value) {
  const found = actionTypeOptions.find(item => item.value === value)
  return found ? found.label : value
}

/**
 * 查询操作码列表（树形）
 * 
 * 调用 listOperation 获取平铺列表，使用 proxy.handleTree 构建树形结构。
 * 与系统菜单管理保持一致。
 */
function getList() {
  loading.value = true
  listOperation(queryParams.value).then(response => {
    const list = response.data || []
    operationList.value = proxy.handleTree(list, "operationId")
    recordOriginalOrders(operationList.value)
    loading.value = false
  })
}

/**
 * 查询操作码下拉树结构
 * 
 * 完全参考系统菜单管理：调用 listOperation 获取平铺列表，
 * 使用 proxy.handleTree 构建树，并添加虚拟根节点“主类目”。
 * 字段契约使用 operationId / operationName。
 */
function getTreeselect() {
  operationOptions.value = []
  listOperation({}).then(response => {
    const root = { operationId: 0, operationName: "主类目", children: [] }
    root.children = proxy.handleTree(response.data || [], "operationId")
    operationOptions.value.push(root)
  })
}

/**
 * 加载系统菜单树（用于权限标识选择）
 * 
 * 使用官方推荐的 proxy.handleTree 构建树，不再自定义 buildSysMenuTree。
 */
async function loadSysMenuTree() {
  try {
    const res = await listMenu()
    const list = res.data || []
    sysMenuTreeData.value = proxy.handleTree(list, "menuId")
  } catch (e) {
    proxy.$modal.msgError('加载系统菜单树失败')
  }
}

/**
 * 在系统菜单树中根据 ID 查找节点
 * @param {Array} nodes 节点数组
 * @param {Number} id 菜单ID
 * @returns {Object|null} 匹配节点
 */
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

/**
 * 在系统菜单树中根据 perms 查找节点
 * @param {Array} nodes 节点数组
 * @param {String} perms 权限标识
 * @returns {Object|null} 匹配节点
 */
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

/**
 * 递归记录当前树形结构的原始排序值
 * @param {Array} list 树形节点数组
 */
function recordOriginalOrders(list) {
  list.forEach(item => {
    originalOrders.value[item.operationId] = item.orderNum
    if (item.children && item.children.length) {
      recordOriginalOrders(item.children)
    }
  })
}

/**
 * 保存排序
 * 遍历树形结构，收集发生变化的节点 ID 和排序值，调用后端排序接口保存
 */
function handleSaveSort() {
  const changedOperationIds = []
  const changedOrderNums = []
  const collectChanged = (list) => {
    list.forEach(item => {
      if (String(originalOrders.value[item.operationId]) !== String(item.orderNum)) {
        changedOperationIds.push(item.operationId)
        changedOrderNums.push(item.orderNum)
      }
      if (item.children && item.children.length) {
        collectChanged(item.children)
      }
    })
  }
  collectChanged(operationList.value)
  if (changedOperationIds.length === 0) {
    proxy.$modal.msgWarning("未检测到排序修改")
    return
  }
  updateOperationSort({ operationIds: changedOperationIds.join(","), orderNums: changedOrderNums.join(",") }).then(() => {
    proxy.$modal.msgSuccess("排序保存成功")
    recordOriginalOrders(operationList.value)
  })
}

/**
 * 展开/折叠所有树节点
 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/**
 * 取消按钮
 */
function cancel() {
  open.value = false
  reset()
}

/**
 * 表单重置
 */
function reset() {
  form.value = {
    operationId: null,
    parentId: 0,
    menuType: 'F',
    operationCode: null,
    actionType: null,
    buttonLabel: null,
    tableName: null,
    perms: null,
    backendRoute: null,
    component: null,
    orderNum: 0,
    status: '0',
    isUnaudit: '1',
    delFlag: '0',
    remark: null
  }
  selectedSysMenuId.value = null
  proxy.resetForm("operationRef")
}

/**
 * 搜索按钮操作
 */
function handleQuery() {
  getList()
}

/**
 * 重置按钮操作
 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/**
 * 新增按钮操作
 * @param {Object} row 父级节点（可选），若传入则作为上级节点
 */
function handleAdd(row) {
  reset()
  getTreeselect()
  loadSysMenuTree()
  if (row && row.operationId) {
    form.value.parentId = row.operationId
  } else {
    form.value.parentId = 0
  }
  open.value = true
  title.value = "添加操作码节点"
}

/**
 * 修改按钮操作
 * @param {Object} row 当前行数据
 */
async function handleUpdate(row) {
  reset()
  await getTreeselect()
  await loadSysMenuTree()
  getOperation(row.operationId).then(response => {
    form.value = response.data
    selectedSysMenuId.value = null
    if (form.value.perms) {
      const matched = findNodeByPerms(sysMenuTreeData.value, form.value.perms)
      if (matched) {
        selectedSysMenuId.value = matched.menuId
      }
    }
    open.value = true
    title.value = "修改操作码节点"
  })
}

/**
 * 提交表单
 */
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

/**
 * 删除按钮操作
 * @param {Object} row 当前行数据
 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.operationName + '"的数据项?').then(function() {
    return delOperation(row.operationId)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/**
 * 导出按钮操作
 */
function handleExport() {
  proxy.download('fill/operation/export', {
    ...queryParams.value
  }, `operation_${new Date().getTime()}.xlsx`)
}

/**
 * 打开选择物理表对话框
 */
function openSelectForm() {
  selectFormRef.value.show()
}

/**
 * 物理表选择回调
 * @param {Object} row 选中的物理表信息
 */
function onFormSelected(row) {
  form.value.tableName = row.tableName
}

/**
 * 打开前端组件文件选择器
 */
function openFrontendFileSelector() {
  frontendFileSelectorRef.value.show()
}

/**
 * 前端组件文件选择回调
 * @param {String} filePath 文件路径
 */
function onFrontendFileSelected(filePath) {
  form.value.component = filePath
}

/**
 * 系统菜单选择回调（仅回填 perms 和名称）
 * @param {Number} menuId 系统菜单ID
 */
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

// 初始化
getList()
</script>