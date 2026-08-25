<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联批记录ID" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入关联批记录ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冗余：发布版本ID" prop="releaseId">
        <el-input
          v-model="queryParams.releaseId"
          placeholder="请输入冗余：发布版本ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父菜单ID" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父菜单ID"
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
      <el-form-item label="前端路由地址" prop="path">
        <el-input
          v-model="queryParams.path"
          placeholder="请输入前端路由地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前端组件路径" prop="component">
        <el-input
          v-model="queryParams.component"
          placeholder="请输入前端组件路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="路由参数" prop="query">
        <el-input
          v-model="queryParams.query"
          placeholder="请输入路由参数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="路由名称" prop="routeName">
        <el-input
          v-model="queryParams.routeName"
          placeholder="请输入路由名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否为外链" prop="isFrame">
        <el-input
          v-model="queryParams.isFrame"
          placeholder="请输入是否为外链"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否缓存" prop="isCache">
        <el-input
          v-model="queryParams.isCache"
          placeholder="请输入是否缓存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单状态" prop="visible">
        <el-input
          v-model="queryParams.visible"
          placeholder="请输入菜单状态"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限标识" prop="perms">
        <el-input
          v-model="queryParams.perms"
          placeholder="请输入权限标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input
          v-model="queryParams.icon"
          placeholder="请输入菜单图标"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="后端接口路径" prop="backendRoute">
        <el-input
          v-model="queryParams.backendRoute"
          placeholder="请输入后端接口路径"
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
      <el-form-item label="前置运行态菜单ID" prop="predecessorDetailId">
        <el-input
          v-model="queryParams.predecessorDetailId"
          placeholder="请输入前置运行态菜单ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作码" prop="operationCode">
        <el-input
          v-model="queryParams.operationCode"
          placeholder="请输入操作码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否在聚合入口卡片显示" prop="operationVisible">
        <el-input
          v-model="queryParams.operationVisible"
          placeholder="请输入是否在聚合入口卡片显示"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务表主键" prop="businessRecordId">
        <el-input
          v-model="queryParams.businessRecordId"
          placeholder="请输入业务表主键"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实例日期" prop="instanceDate">
        <el-date-picker clearable
          v-model="queryParams.instanceDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择实例日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="表单实例序号" prop="instanceSeq">
        <el-input
          v-model="queryParams.instanceSeq"
          placeholder="请输入表单实例序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
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
      <el-form-item label="操作时间" prop="operatorTime">
        <el-date-picker clearable
          v-model="queryParams.operatorTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择操作时间">
        </el-date-picker>
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
          v-hasPermi="['batch:batch_record_menu:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['batch:batch_record_menu:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['batch:batch_record_menu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['batch:batch_record_menu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batch_record_menuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="批记录节点主键" align="center" prop="menuId" />
      <el-table-column label="关联批记录ID" align="center" prop="recordId" />
      <el-table-column label="冗余：发布版本ID" align="center" prop="releaseId" />
      <el-table-column label="菜单名称" align="center" prop="menuName" />
      <el-table-column label="父菜单ID" align="center" prop="parentId" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="前端路由地址" align="center" prop="path" />
      <el-table-column label="前端组件路径" align="center" prop="component" />
      <el-table-column label="路由参数" align="center" prop="query" />
      <el-table-column label="路由名称" align="center" prop="routeName" />
      <el-table-column label="是否为外链" align="center" prop="isFrame" />
      <el-table-column label="是否缓存" align="center" prop="isCache" />
      <el-table-column label="菜单类型" align="center" prop="menuType" />
      <el-table-column label="菜单状态" align="center" prop="visible" />
      <el-table-column label="节点状态" align="center" prop="status" />
      <el-table-column label="权限标识" align="center" prop="perms" />
      <el-table-column label="菜单图标" align="center" prop="icon" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="后端接口路径" align="center" prop="backendRoute" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="自定义字段预赋值" align="center" prop="customParams" />
      <el-table-column label="前置运行态菜单ID" align="center" prop="predecessorDetailId" />
      <el-table-column label="操作码" align="center" prop="operationCode" />
      <el-table-column label="是否在聚合入口卡片显示" align="center" prop="operationVisible" />
      <el-table-column label="业务表主键" align="center" prop="businessRecordId" />
      <el-table-column label="实例日期" align="center" prop="instanceDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.instanceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单实例序号" align="center" prop="instanceSeq" />
      <el-table-column label="表单生成状态" align="center" prop="instanceStatus" />
      <el-table-column label="填报流程控制状态" align="center" prop="instanceControlStatus" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="工作单元名称" align="center" prop="workUnitName" />
      <el-table-column label="操作时间" align="center" prop="operatorTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operatorTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['batch:batch_record_menu:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['batch:batch_record_menu:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['batch:batch_record_menu:remove']">删除</el-button>
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

    <!-- 批记录结构详情抽屉 -->
    <batch_record_menu-view-drawer ref="batch_record_menuViewRef" />
    <!-- 添加或修改批记录结构对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batch_record_menuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联批记录ID" prop="recordId">
              <el-input v-model="form.recordId" placeholder="请输入关联批记录ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="冗余：发布版本ID" prop="releaseId">
              <el-input v-model="form.releaseId" placeholder="请输入冗余：发布版本ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="父菜单ID" prop="parentId">
              <el-input v-model="form.parentId" placeholder="请输入父菜单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入前端路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入前端组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="路由参数" prop="query">
              <el-input v-model="form.query" placeholder="请输入路由参数" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="路由名称" prop="routeName">
              <el-input v-model="form.routeName" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否为外链" prop="isFrame">
              <el-input v-model="form.isFrame" placeholder="请输入是否为外链" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否缓存" prop="isCache">
              <el-input v-model="form.isCache" placeholder="请输入是否缓存" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单状态" prop="visible">
              <el-input v-model="form.visible" placeholder="请输入菜单状态" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限标识" prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="form.icon" placeholder="请输入菜单图标" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="后端接口路径" prop="backendRoute">
              <el-input v-model="form.backendRoute" placeholder="请输入后端接口路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入物理表名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义字段预赋值" prop="customParams">
              <el-input v-model="form.customParams" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前置运行态菜单ID" prop="predecessorDetailId">
              <el-input v-model="form.predecessorDetailId" placeholder="请输入前置运行态菜单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作码" prop="operationCode">
              <el-input v-model="form.operationCode" placeholder="请输入操作码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否在聚合入口卡片显示" prop="operationVisible">
              <el-input v-model="form.operationVisible" placeholder="请输入是否在聚合入口卡片显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务表主键" prop="businessRecordId">
              <el-input v-model="form.businessRecordId" placeholder="请输入业务表主键" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实例日期" prop="instanceDate">
              <el-date-picker clearable
                v-model="form.instanceDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择实例日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表单实例序号" prop="instanceSeq">
              <el-input v-model="form.instanceSeq" placeholder="请输入表单实例序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作单元名称" prop="workUnitName">
              <el-input v-model="form.workUnitName" placeholder="请输入工作单元名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间" prop="operatorTime">
              <el-date-picker clearable
                v-model="form.operatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择操作时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="乐观锁版本号" prop="revision">
              <el-input v-model="form.revision" placeholder="请输入乐观锁版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统版本号" prop="sysVersion">
              <el-input v-model="form.sysVersion" placeholder="请输入系统版本号" />
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

<script setup name="Batch_record_menu">
import { listBatch_record_menu, getBatch_record_menu, delBatch_record_menu, addBatch_record_menu, updateBatch_record_menu } from "@/api/batch/batch_record_menu"
import Batch_record_menuViewDrawer from "./view"

const { proxy } = getCurrentInstance()

const batch_record_menuList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    recordId: undefined,
    releaseId: undefined,
    menuName: undefined,
    parentId: undefined,
    orderNum: undefined,
    path: undefined,
    component: undefined,
    query: undefined,
    routeName: undefined,
    isFrame: undefined,
    isCache: undefined,
    menuType: undefined,
    visible: undefined,
    status: undefined,
    perms: undefined,
    icon: undefined,
    backendRoute: undefined,
    tableName: undefined,
    customParams: undefined,
    predecessorDetailId: undefined,
    operationCode: undefined,
    operationVisible: undefined,
    businessRecordId: undefined,
    instanceDate: undefined,
    instanceSeq: undefined,
    instanceStatus: undefined,
    instanceControlStatus: undefined,
    operator: undefined,
    workUnitName: undefined,
    operatorTime: undefined,
    revision: undefined,
    sysVersion: undefined,
  },
  rules: {
    recordId: [
      { required: true, message: "关联批记录ID不能为空", trigger: "blur" }
    ],
    menuName: [
      { required: true, message: "菜单名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询批记录结构列表 */
function getList() {
  loading.value = true
  listBatch_record_menu(queryParams.value).then(response => {
    batch_record_menuList.value = response.rows
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
    menuId: null,
    recordId: null,
    releaseId: null,
    menuName: null,
    parentId: null,
    orderNum: null,
    path: null,
    component: null,
    query: null,
    routeName: null,
    isFrame: null,
    isCache: null,
    menuType: null,
    visible: null,
    status: null,
    perms: null,
    icon: null,
    remark: null,
    backendRoute: null,
    tableName: null,
    customParams: null,
    predecessorDetailId: null,
    operationCode: null,
    operationVisible: null,
    businessRecordId: null,
    instanceDate: null,
    instanceSeq: null,
    instanceStatus: null,
    instanceControlStatus: null,
    operator: null,
    workUnitName: null,
    operatorTime: null,
    delFlag: null,
    revision: null,
    sysVersion: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("batch_record_menuRef")
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
  ids.value = selection.map(item => item.menuId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加批记录结构"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _menuId = row.menuId || ids.value
  getBatch_record_menu(_menuId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改批记录结构"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batch_record_menuRef"].validate(valid => {
    if (valid) {
      if (form.value.menuId != null) {
        updateBatch_record_menu(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBatch_record_menu(form.value).then(() => {
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
  const _menuIds = row.menuId || ids.value
  proxy.$modal.confirm('是否确认删除批记录结构编号为"' + _menuIds + '"的数据项？').then(function() {
    return delBatch_record_menu(_menuIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["batch_record_menuViewRef"].open(row.menuId)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('batch/batch_record_menu/export', {
    ...queryParams.value
  }, `batch_record_menu_${new Date().getTime()}.xlsx`)
}

getList()
</script>
