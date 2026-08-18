<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择菜单状态" clearable>
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
      <el-form-item label="操作码" prop="operationCode">
        <el-input
          v-model="queryParams.operationCode"
          placeholder="请输入操作码"
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
          v-hasPermi="['fill:scheme_release_menu:add']"
        >新增</el-button>
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

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="scheme_release_menuList"
      row-key="menuId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="关联发布版本ID" prop="releaseId" />
      <el-table-column label="所属方案ID" align="center" prop="schemeId" />
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
      <el-table-column label="菜单状态" align="center" prop="visible">
        <template #default="scope">
          <dict-tag :options="sys_show_hide" :value="scope.row.visible"/>
        </template>
      </el-table-column>
      <el-table-column label="菜单状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="权限标识" align="center" prop="perms" />
      <el-table-column label="菜单图标" align="center" prop="icon" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="后端接口路径" align="center" prop="backendRoute" />
      <el-table-column label="目录类型编码" align="center" prop="typeCode" />
      <el-table-column label="物理表名" align="center" prop="tableName" />
      <el-table-column label="自定义字段预赋值" align="center" prop="customParams" />
      <el-table-column label="前置发布态菜单ID" align="center" prop="predecessorDetailId" />
      <el-table-column label="操作码" align="center" prop="operationCode" />
      <el-table-column label="是否在聚合入口卡片显示" align="center" prop="operationVisible">
        <template #default="scope">
          <dict-tag :options="sys_show_hide" :value="scope.row.operationVisible"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:scheme_release_menu:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:scheme_release_menu:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['fill:scheme_release_menu:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:scheme_release_menu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单权限发布态详情抽屉 -->
    <scheme_release_menu-view-drawer ref="scheme_release_menuViewRef" />
    <!-- 添加或修改菜单权限发布态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="scheme_release_menuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联发布版本ID" prop="releaseId">
              <el-input v-model="form.releaseId" placeholder="请输入关联发布版本ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属方案ID" prop="schemeId">
              <el-input v-model="form.schemeId" placeholder="请输入所属方案ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="父菜单ID" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="scheme_release_menuOptions"
                :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                value-key="menuId"
                placeholder="请选择父菜单ID"
                check-strictly
              />
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
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单状态" prop="status">
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
            <el-form-item label="目录类型编码" prop="typeCode">
              <el-input v-model="form.typeCode" placeholder="请输入目录类型编码" />
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
            <el-form-item label="前置发布态菜单ID" prop="predecessorDetailId">
              <el-input v-model="form.predecessorDetailId" placeholder="请输入前置发布态菜单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作码" prop="operationCode">
              <el-input v-model="form.operationCode" placeholder="请输入操作码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否在聚合入口卡片显示" prop="operationVisible">
              <el-radio-group v-model="form.operationVisible">
                <el-radio
                  v-for="dict in sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
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

<script setup name="Scheme_release_menu">
import { listScheme_release_menu, getScheme_release_menu, delScheme_release_menu, addScheme_release_menu, updateScheme_release_menu } from "@/api/fill/scheme_release_menu"
import Scheme_release_menuViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable, sys_show_hide } = useDict('sys_normal_disable', 'sys_show_hide')

const scheme_release_menuList = ref([])
const scheme_release_menuOptions = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref("")
const isExpandAll = ref(true)
const refreshTable = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    menuName: undefined,
    status: undefined,
    perms: undefined,
    tableName: undefined,
    operationCode: undefined,
  },
  rules: {
    releaseId: [
      { required: true, message: "关联发布版本ID不能为空", trigger: "blur" }
    ],
    schemeId: [
      { required: true, message: "所属方案ID不能为空", trigger: "blur" }
    ],
    menuName: [
      { required: true, message: "菜单名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询菜单权限发布态列表 */
function getList() {
  loading.value = true
  listScheme_release_menu(queryParams.value).then(response => {
    scheme_release_menuList.value = proxy.handleTree(response.data, "menuId", "parentId")
    loading.value = false
  })
}

/** 查询菜单权限发布态下拉树结构 */
function getTreeselect() {
  listScheme_release_menu().then(response => {
    scheme_release_menuOptions.value = []
    const data = { menuId: 0, menuName: '顶级节点', children: [] }
    data.children = proxy.handleTree(response.data, "menuId", "parentId")
    scheme_release_menuOptions.value.push(data)
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
    releaseId: null,
    schemeId: null,
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
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    backendRoute: null,
    typeCode: null,
    tableName: null,
    customParams: null,
    predecessorDetailId: null,
    operationCode: null,
    operationVisible: null
  }
  proxy.resetForm("scheme_release_menuRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset()
  getTreeselect()
  if (row != null && row.menuId) {
    form.value.parentId = row.menuId
  } else {
    form.value.parentId = 0
  }
  open.value = true
  title.value = "添加菜单权限发布态"
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 详情按钮操作 */
function handleViewData(row) {
  proxy.$refs["scheme_release_menuViewRef"].open(row.menuId)
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset()
  await getTreeselect()
  if (row != null) {
    form.value.parentId = row.parentId
  }
  getScheme_release_menu(row.menuId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改菜单权限发布态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scheme_release_menuRef"].validate(valid => {
    if (valid) {
      if (form.value.menuId != null) {
        updateScheme_release_menu(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addScheme_release_menu(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除菜单权限发布态编号为"' + row.menuId + '"的数据项？').then(function() {
    return delScheme_release_menu(row.menuId)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

getList()
</script>
