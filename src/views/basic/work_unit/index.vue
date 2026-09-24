<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作单元编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入工作单元编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作单元名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工作单元名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联部门" prop="deptId">
        <el-tree-select
          v-model="queryParams.deptId"
          :data="enabledDeptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          value-key="id"
          placeholder="请选择关联部门"
          clearable
          check-strictly
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="显示顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入显示顺序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['basic:work_unit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:work_unit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:work_unit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['basic:work_unit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="work_unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="工作单元编码" align="center" prop="code" />
      <el-table-column label="工作单元名称" align="center" prop="name" />
      <el-table-column label="关联部门" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ getDeptName(scope.row.deptId) }}
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['basic:work_unit:edit']">修改</el-button>
          <el-button link type="primary" icon="Check" @click="handleAuthRole(scope.row)" v-hasPermi="['basic:work_unit:edit']">分配角色</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['basic:work_unit:remove']">删除</el-button>
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

    <!-- 添加或修改工作单元对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="work_unitRef" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作单元编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入工作单元编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作单元名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入工作单元名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联部门" prop="deptId">
              <el-tree-select
                v-model="form.deptId"
                :data="enabledDeptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择关联部门"
                clearable
                check-strictly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
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
  </div>
</template>

<script setup name="Work_unit">
import { listWork_unit, getWork_unit, delWork_unit, addWork_unit, updateWork_unit } from "@/api/basic/work_unit"
import { deptTreeSelect } from "@/api/system/user"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

/** 工作单元列表数据 */
const work_unitList = ref([])

/** 对话框可见性 */
const open = ref(false)

/** 表格加载状态 */
const loading = ref(true)

/** 是否显示搜索区域 */
const showSearch = ref(true)

/** 主表多选选中的 ID 集合 */
const ids = ref([])

/** 主表修改按钮是否禁用（单选） */
const single = ref(true)

/** 主表删除按钮是否禁用（至少选 1 条） */
const multiple = ref(true)

/** 列表总条数 */
const total = ref(0)

/** 对话框标题 */
const title = ref("")

/** 部门树原始数据（含禁用节点） */
const deptOptions = ref(undefined)

/** 部门树可用数据（已过滤禁用节点，用于下拉选择） */
const enabledDeptOptions = ref(undefined)

/**
 * deptId → deptName 映射
 *
 * 由 deptOptions 递归扁平化得到，用于在列表中将 deptId 快速转换为部门名称。
 * 之所以在前端做映射而不在后端联表返回 deptName：
 * - basic 模块只依赖 ruoyi-common，不依赖 ruoyi-system，Service 层无法注入 ISysDeptService
 * - 修改 Mapper XML 联表会侵入基础数据层，与"不改官方基础设施"的约定冲突
 * - 部门数据量小，一次性拉取到前端做映射，成本可忽略
 */
const deptNameMap = computed(() => {
  const map = {}
  const walk = (nodes) => {
    if (!nodes || !nodes.length) return
    nodes.forEach(node => {
      map[node.id] = node.label
      if (node.children && node.children.length) {
        walk(node.children)
      }
    })
  }
  walk(deptOptions.value)
  return map
})

/** 表单、查询参数与校验规则 */
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: undefined,
    name: undefined,
    deptId: undefined,
    orderNum: undefined,
    status: undefined,
    orderByColumn: 'order_num',
    isAsc: 'asc'
  },
  rules: {
    code: [
      { required: true, message: "工作单元编码不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "工作单元名称不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "关联部门不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/**
 * 根据 deptId 获取部门名称
 *
 * 从 deptNameMap 中查找；若 deptId 为空或映射中不存在，返回空字符串。
 * 用于列表"关联部门"列的展示。
 *
 * @param {Number|String} deptId 部门ID
 * @returns {String} 部门名称，找不到时返回空字符串
 */
function getDeptName(deptId) {
  if (deptId == null || deptId === '') return ''
  return deptNameMap.value[deptId] || ''
}

/**
 * 查询工作单元列表
 * 
 * 分页查询主表数据，响应结果中的 rows 为当前页数据，total 为总条数。
 * 关联部门名称由前端根据 deptId 从 deptNameMap 中查找，不依赖后端返回。
 */
function getList() {
  loading.value = true
  listWork_unit(queryParams.value).then(response => {
    work_unitList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/**
 * 查询部门下拉树结构
 *
 * 复用若依官方 deptTreeSelect 接口（与 system/user/index.vue 一致）。
 * 返回值 data 为树形结构，每个节点含 id / label / children / disabled。
 * - deptOptions：原始数据，保留完整信息，用于构建 deptNameMap
 * - enabledDeptOptions：过滤掉禁用节点后的数据，用于表单/查询中的部门选择器
 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data
    enabledDeptOptions.value = filterDisabledDept(JSON.parse(JSON.stringify(response.data)))
  })
}

/**
 * 过滤禁用的部门
 *
 * 递归遍历部门树，剔除 disabled 为 true 的节点。
 * 与若依官方 system/user/index.vue 中的 filterDisabledDept 逻辑保持一致。
 *
 * @param {Array} deptList 部门树数组
 * @returns {Array} 过滤后的部门树数组
 */
function filterDisabledDept(deptList) {
  return deptList.filter(dept => {
    if (dept.disabled) {
      return false
    }
    if (dept.children && dept.children.length) {
      dept.children = filterDisabledDept(dept.children)
    }
    return true
  })
}

/**
 * 取消按钮
 * 
 * 关闭对话框并重置表单。
 */
function cancel() {
  open.value = false
  reset()
}

/**
 * 表单重置
 * 
 * 将主表字段恢复到初始状态，并通过 proxy.resetForm 清理表单校验状态。
 */
function reset() {
  form.value = {
    id: null,
    code: null,
    name: null,
    deptId: null,
    orderNum: 0,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("work_unitRef")
}

/**
 * 搜索按钮操作
 * 
 * 重置页码到第 1 页后重新查询列表。
 */
function handleQuery() {
  queryParams.value.pageNum = 1
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
 * 主表多选框选中数据
 * 
 * 更新 ids 集合、single（是否恰好选中 1 条）、multiple（是否至少选中 1 条）。
 * 
 * @param {Array} selection 当前选中的行数据数组
 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/**
 * 新增按钮操作
 * 
 * 重置表单后打开空白对话框，标题切换为"添加工作单元"。
 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加工作单元"
}

/**
 * 修改按钮操作
 * 
 * 根据行数据或选中 ID 加载主表详情，回填表单后打开对话框。
 * 
 * @param {Object} row 当前点击的行数据（若从工具栏触发则为 undefined，使用 ids.value）
 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getWork_unit(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改工作单元"
  })
}

/**
 * 提交按钮
 * 
 * 先进行表单校验，校验通过后根据 form.id 是否为空判定是新增还是修改，
 * 分别调用对应接口。
 */
function submitForm() {
  proxy.$refs["work_unitRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateWork_unit(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addWork_unit(form.value).then(() => {
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
 * 
 * 弹出二次确认，用户确认后调用删除接口，成功后刷新列表。
 * 
 * @param {Object} row 当前点击的行数据（若从工具栏触发则为 undefined，使用 ids.value）
 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除工作单元编号为"' + _ids + '"的数据项？').then(function() {
    return delWork_unit(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/**
 * 分配角色按钮操作
 * 
 * 跳转到独立的角色分配子页面（与若依官方用户管理"分配角色"的交互一致）。
 * 通过 $tab.openPage 打开新标签页，在子页面中展示角色列表并勾选。
 * 
 * @param {Object} row 当前工作单元行数据
 */
function handleAuthRole(row) {
  proxy.$tab.openPage('分配角色 - ' + row.name, '/basic/work_unit-auth/role/' + row.id)
  // proxy.$tab.openPage('分配角色', '/basic/work_unit-auth/role/' + row.id)
}

/**
 * 导出按钮操作
 * 
 * 以当前查询条件为参数请求导出接口。
 */
function handleExport() {
  proxy.download('basic/work_unit/export', {
    ...queryParams.value
  }, `work_unit_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getDeptTree()
  getList()
})
</script>