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
      <el-form-item label="关联若依部门ID" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入关联若依部门ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入显示顺序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
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
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="工作单元编码" align="center" prop="code" />
      <el-table-column label="工作单元名称" align="center" prop="name" />
      <el-table-column label="关联若依部门ID" align="center" prop="deptId" />
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
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
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
            <el-form-item label="关联若依部门ID" prop="deptId">
              <el-input v-model="form.deptId" placeholder="请输入关联若依部门ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
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
        <el-divider content-position="center">基础数据-工作单元作业人员信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddBasicWorkUnitOperator">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteBasicWorkUnitOperator">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="basicWorkUnitOperatorList" @selection-change="handleBasicWorkUnitOperatorSelectionChange" ref="basicWorkUnitOperator">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" width="60">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <!-- 操作码：只读输入框 + 搜索按钮，点击按钮弹出 SelectOperation 选择器 -->
          <el-table-column label="操作码" prop="operationCode" min-width="100">
            <template #default="scope">
              <el-input v-model="scope.row.operationCode" placeholder="请选择操作码" readonly>
                <template #append>
                  <el-button icon="Search" @click="openOperationSelect(scope.row)" />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <!-- 操作人：只读输入框 + 搜索按钮，点击按钮弹出 SelectUser 选择器 -->
          <el-table-column label="操作人" prop="operator" min-width="130">
            <template #default="scope">
              <el-input v-model="scope.row.operator" placeholder="请选择操作人" readonly>
                <template #append>
                  <el-button icon="Search" @click="openUserSelect(scope.row)" />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <!-- 操作名称：由操作码选择器回调自动回填，只读展示 -->
          <el-table-column label="操作名称" prop="operationName" min-width="150">
            <template #default="scope">
              <el-input v-model="scope.row.operationName" placeholder="选择操作码后自动带出" disabled />
            </template>
          </el-table-column>
          <!-- <el-table-column label="显示顺序" prop="orderNum" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.orderNum" placeholder="请输入显示顺序" />
            </template>
          </el-table-column> -->
          <el-table-column label="状态" prop="status" width="100">
            <template #default="scope">
              <el-select v-model="scope.row.status" placeholder="请选择状态">
                <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 操作码选择器：由子表"操作码"列的搜索按钮触发 -->
    <SelectOperation ref="selectOperationRef" @ok="onOperationSelected" />

    <!-- 用户选择器：由子表"操作人"列的搜索按钮触发 -->
    <SelectUser ref="selectUserRef" @ok="onUserSelected" />
  </div>
</template>

<script setup name="Work_unit">
import { listWork_unit, getWork_unit, delWork_unit, addWork_unit, updateWork_unit } from "@/api/basic/work_unit"
import SelectOperation from '@/views/basic/components/SelectOperation.vue'
import SelectUser from '@/views/fill/components/SelectUser.vue'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

/** 工作单元列表数据 */
const work_unitList = ref([])

/** 当前编辑的子表（作业人员）数据列表 */
const basicWorkUnitOperatorList = ref([])

/** 对话框可见性 */
const open = ref(false)

/** 表格加载状态 */
const loading = ref(true)

/** 是否显示搜索区域 */
const showSearch = ref(true)

/** 主表多选选中的 ID 集合 */
const ids = ref([])

/** 子表多选选中的行（此处存的是 selection 数组） */
const checkedBasicWorkUnitOperator = ref([])

/** 主表修改按钮是否禁用（单选） */
const single = ref(true)

/** 主表删除按钮是否禁用（至少选 1 条） */
const multiple = ref(true)

/** 列表总条数 */
const total = ref(0)

/** 对话框标题 */
const title = ref("")

/** 操作码选择器组件引用 */
const selectOperationRef = ref(null)

/** 当前正在编辑操作码的子表行（供选择器回调定位目标行） */
const currentOperationRow = ref(null)

/** 用户选择器组件引用 */
const selectUserRef = ref(null)

/** 当前正在编辑操作人的子表行（供选择器回调定位目标行） */
const currentUserRow = ref(null)

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
  },
  rules: {
    code: [
      { required: true, message: "工作单元编码不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "工作单元名称不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "关联若依部门ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/**
 * 查询工作单元列表
 * 
 * 分页查询主表数据，响应结果中的 rows 为当前页数据，total 为总条数。
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
 * 取消按钮
 * 
 * 关闭对话框并重置表单与子表数据。
 */
function cancel() {
  open.value = false
  reset()
}

/**
 * 表单重置
 * 
 * 将主表字段恢复到初始状态，并清空子表列表。
 * 同时通过 proxy.resetForm 清理表单校验状态。
 */
function reset() {
  form.value = {
    id: null,
    code: null,
    name: null,
    deptId: null,
    orderNum: null,
    status: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  basicWorkUnitOperatorList.value = []
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
 * 根据行数据或选中 ID 加载主表 + 子表详情，回填表单后打开对话框。
 * 主表信息填充到 form，子表列表填充到 basicWorkUnitOperatorList。
 * 
 * @param {Object} row 当前点击的行数据（若从工具栏触发则为 undefined，使用 ids.value）
 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getWork_unit(_id).then(response => {
    form.value = response.data
    basicWorkUnitOperatorList.value = response.data.basicWorkUnitOperatorList
    open.value = true
    title.value = "修改工作单元"
  })
}

/**
 * 提交按钮
 * 
 * 先进行表单校验，校验通过后将子表数据挂载到 form 上，
 * 根据 form.id 是否为空判定是新增还是修改，分别调用对应接口。
 */
function submitForm() {
  proxy.$refs["work_unitRef"].validate(valid => {
    if (valid) {
      form.value.basicWorkUnitOperatorList = basicWorkUnitOperatorList.value
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
  proxy.$tab.openPage('分配角色', '/basic/work_unit-auth/role/' + row.id)
}

/**
 * 子表（作业人员）添加按钮操作
 * 
 * 向子表列表末尾追加一个空白行对象，所有字段初始化为 undefined，
 * 保证 Vue 的响应式系统能追踪到后续对 operationCode / operationName 等字段的赋值。
 */
function handleAddBasicWorkUnitOperator() {
  let obj = {}
  obj.operationCode = undefined
  obj.operationName = undefined
  obj.operator = undefined
  obj.orderNum = undefined
  obj.status = undefined
  basicWorkUnitOperatorList.value.push(obj)
}

/**
 * 子表（作业人员）删除按钮操作
 * 
 * 从子表列表中移除已选中的行。若未选中任何行则给出提示。
 */
function handleDeleteBasicWorkUnitOperator() {
  if (checkedBasicWorkUnitOperator.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的基础数据-工作单元作业人员数据")
  } else {
    const basicWorkUnitOperators = basicWorkUnitOperatorList.value
    const checkedBasicWorkUnitOperators = checkedBasicWorkUnitOperator.value
    basicWorkUnitOperatorList.value = basicWorkUnitOperators.filter(function(item) {
      return checkedBasicWorkUnitOperators.indexOf(item.index) == -1
    })
  }
}

/**
 * 子表多选框选中数据
 * 
 * 记录已选中的行索引集合，用于 handleDeleteBasicWorkUnitOperator 过滤。
 * 
 * @param {Array} selection 当前选中的行数据数组
 */
function handleBasicWorkUnitOperatorSelectionChange(selection) {
  checkedBasicWorkUnitOperator.value = selection.map(item => item.index)
}

/**
 * 打开操作码选择器
 * 
 * 记录当前正在编辑的行，供 onOperationSelected 回调时定位目标行。
 * 通过 ref 调用 SelectOperation 组件的 show 方法弹出选择器。
 * 
 * @param {Object} row 当前正在编辑的子表行对象
 */
function openOperationSelect(row) {
  currentOperationRow.value = row
  selectOperationRef.value?.show()
}

/**
 * 操作码选择回调
 * 
 * 用户从 SelectOperation 组件选择操作码后，回填两个字段到目标行：
 * - operationCode：操作码的值（来自 BasicOperation.code，作为外键存储）
 * - operationName：操作名称快照（来自 BasicOperation.name，供列表展示）
 * 
 * 说明：
 * - 调用方实体字段名保持 operationCode / operationName 不变（它们是外键字段和冗余快照）
 * - 选择器返回的原始对象字段名为 code / name（遵循 basic_xxx 表的通用字段约定）
 * 
 * @param {Object} selected 选中的操作码对象（含 id、code、name、actionType 等字段）
 */
function onOperationSelected(selected) {
  if (currentOperationRow.value) {
    currentOperationRow.value.operationCode = selected.code
    currentOperationRow.value.operationName = selected.name
  }
}

/**
 * 打开用户选择器
 * 
 * 记录当前正在编辑的行，供 onUserSelected 回调时定位目标行。
 * 通过 ref 调用 SelectUser 组件的 show 方法弹出选择器。
 * 
 * @param {Object} row 当前正在编辑的子表行对象
 */
function openUserSelect(row) {
  currentUserRow.value = row
  selectUserRef.value?.show()
}

/**
 * 用户选择回调
 * 
 * 用户从 SelectUser 组件选择用户后，将选中用户的 userName 回填到目标行。
 * 
 * 选用 userName 而非 nickName 的原因：
 * - userName 是若依中稳定唯一的登录名，用于权限校验（与 basic_work_unit_operator.operator 语义一致）
 * - nickName 可重复、可修改，不适合做数据关联
 * 
 * @param {Object} selected 选中的用户对象（含 userName、nickName、userId 等字段）
 */
function onUserSelected(selected) {
  if (currentUserRow.value) {
    currentUserRow.value.operator = selected.userName || ''
  }
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

getList()
</script>