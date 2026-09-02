<template>
  <div class="app-container">
    <!-- 查询表单（未改动） -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作单元编码" prop="workUnitCode">
        <el-input
          v-model="queryParams.workUnitCode"
          placeholder="请输入工作单元编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作单元名称" prop="workUnitName">
        <el-input
          v-model="queryParams.workUnitName"
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
      <el-form-item label="乐观锁版本号" prop="revision">
        <el-input
          v-model="queryParams.revision"
          placeholder="请输入乐观锁版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统版本号" prop="sysVersion">
        <el-input
          v-model="queryParams.sysVersion"
          placeholder="请输入系统版本号"
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
          v-hasPermi="['fill:work_unit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fill:work_unit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fill:work_unit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fill:work_unit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="work_unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:work_unit:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:work_unit:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:work_unit:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="工作单元编码" align="center" prop="workUnitCode" />
      <el-table-column label="工作单元名称" align="center" prop="workUnitName" />
      <!-- <el-table-column label="关联若依部门ID" align="center" prop="deptId" /> -->
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
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

    <!-- 工作单元详情抽屉 -->
    <work_unit-view-drawer ref="work_unitViewRef" />

    <!-- 添加或修改工作单元对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="work_unitRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作单元编码" prop="workUnitCode">
              <el-input v-model="form.workUnitCode" placeholder="请输入工作单元编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作单元名称" prop="workUnitName">
              <el-input v-model="form.workUnitName" placeholder="请输入工作单元名称" />
            </el-form-item>
          </el-col>
          <!-- 改造：关联若依部门ID 改为下拉选择 -->
          <el-col :span="24">
            <el-form-item label="关联若依部门" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择关联若依部门" clearable style="width: 100%">
                <el-option
                  v-for="dept in deptList"
                  :key="dept.deptId"
                  :label="dept.deptName"
                  :value="dept.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
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

        <el-divider content-position="center">单元作业人员信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddFillWorkUnitOperator">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteFillWorkUnitOperator">删除</el-button>
          </el-col>
        </el-row>

        <el-table :data="fillWorkUnitOperatorList" @selection-change="handleFillWorkUnitOperatorSelectionChange" ref="fillWorkUnitOperator">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" width="60">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <!-- 改造：操作码 改为按钮选择 -->
          <el-table-column label="操作码" prop="operationCode" min-width="180">
            <template #default="scope">
              <el-input v-model="scope.row.operationCode" placeholder="请选择操作码" readonly>
                <template #append>
                  <el-button icon="Search" @click="openOperationSelect(scope.row)" />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <!-- 改造：操作人 改为按钮选择 -->
          <el-table-column label="操作人" prop="operator" min-width="180">
            <template #default="scope">
              <el-input v-model="scope.row.operator" placeholder="请选择操作人" readonly>
                <template #append>
                  <el-button icon="Search" @click="openUserSelect(scope.row)" />
                </template>
              </el-input>
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

    <!-- 操作码选择器 -->
    <SelectOperation ref="selectOperationRef" @ok="onOperationSelected" />
    <!-- 用户选择器 -->
    <SelectUser ref="selectUserRef" @ok="onUserSelected" />
  </div>
</template>

<script setup name="Work_unit">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { listWork_unit, getWork_unit, delWork_unit, addWork_unit, updateWork_unit } from "@/api/fill/work_unit"
import { listDept } from "@/api/system/dept"
import Work_unitViewDrawer from "./view"
import SelectOperation from '@/views/fill/components/SelectOperation.vue'
import SelectUser from '@/views/fill/components/SelectUser.vue'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const work_unitList = ref([])
const fillWorkUnitOperatorList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const checkedFillWorkUnitOperator = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 新增：部门列表、选择器引用、当前编辑行
const deptList = ref([])
const selectOperationRef = ref(null)
const selectUserRef = ref(null)
const currentOperationRow = ref(null)
const currentUserRow = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    workUnitCode: undefined,
    workUnitName: undefined,
    deptId: undefined,
    orderNum: undefined,
    status: undefined,
    revision: undefined,
    sysVersion: undefined,
  },
  rules: {
    workUnitCode: [
      { required: true, message: "工作单元编码不能为空", trigger: "blur" }
    ],
    workUnitName: [
      { required: true, message: "工作单元名称不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "关联若依部门不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 加载部门列表 */
async function loadDeptList() {
  try {
    const res = await listDept({ status: '0' })
    deptList.value = res.data || []
  } catch (e) {
    console.error('获取部门列表失败', e)
  }
}

/** 查询工作单元列表 */
function getList() {
  loading.value = true
  listWork_unit(queryParams.value).then(response => {
    work_unitList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    workUnitId: null,
    workUnitCode: null,
    workUnitName: null,
    deptId: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null,
    remark: null
  }
  fillWorkUnitOperatorList.value = []
  proxy.resetForm("work_unitRef")
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
  ids.value = selection.map(item => item.workUnitId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加工作单元"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _workUnitId = row.workUnitId || ids.value
  getWork_unit(_workUnitId).then(response => {
    form.value = response.data
    fillWorkUnitOperatorList.value = response.data.fillWorkUnitOperatorList || []
    open.value = true
    title.value = "修改工作单元"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["work_unitRef"].validate(valid => {
    if (valid) {
      form.value.fillWorkUnitOperatorList = fillWorkUnitOperatorList.value
      if (form.value.workUnitId != null) {
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

/** 删除按钮操作 */
function handleDelete(row) {
  const _workUnitIds = row.workUnitId || ids.value
  proxy.$modal.confirm('是否确认删除工作单元编号为"' + _workUnitIds + '"的数据项？').then(function() {
    return delWork_unit(_workUnitIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 单元作业人员添加按钮操作 */
function handleAddFillWorkUnitOperator() {
  let obj = {}
  obj.operationCode = undefined
  obj.operator = undefined
  obj.orderNum = undefined
  obj.status = undefined
  obj.revision = undefined
  obj.sysVersion = undefined
  fillWorkUnitOperatorList.value.push(obj)
}

/** 单元作业人员删除按钮操作 */
function handleDeleteFillWorkUnitOperator() {
  if (checkedFillWorkUnitOperator.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的单元作业人员数据")
  } else {
    const fillWorkUnitOperators = fillWorkUnitOperatorList.value
    const checkedFillWorkUnitOperators = checkedFillWorkUnitOperator.value
    fillWorkUnitOperatorList.value = fillWorkUnitOperators.filter(function(item) {
      return checkedFillWorkUnitOperators.indexOf(item.index) == -1
    })
  }
}

/** 复选框选中数据 */
function handleFillWorkUnitOperatorSelectionChange(selection) {
  checkedFillWorkUnitOperator.value = selection.map(item => item.index)
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["work_unitViewRef"].open(row.workUnitId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fill/work_unit/export', {
    ...queryParams.value
  }, `work_unit_${new Date().getTime()}.xlsx`)
}

/** 打开操作码选择器 */
function openOperationSelect(row) {
  currentOperationRow.value = row
  selectOperationRef.value?.show()
}

/** 操作码选择回调 */
function onOperationSelected(selected) {
  if (currentOperationRow.value) {
    currentOperationRow.value.operationCode = selected.operationCode
    // 如果需要带出其他字段，可在此补充
    // currentOperationRow.value.actionType = selected.actionType
  }
}

/** 打开用户选择器 */
function openUserSelect(row) {
  currentUserRow.value = row
  selectUserRef.value?.show()
}

/** 用户选择回调 */
function onUserSelected(selected) {
  if (currentUserRow.value) {
    currentUserRow.value.operator = selected.userName || selected.nickName || ''
  }
}

// 初始加载
onMounted(() => {
  loadDeptList()
})

getList()
</script>