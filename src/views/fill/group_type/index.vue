<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="父类型ID" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父类型ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分组类型编码" prop="typeCode">
        <el-input
          v-model="queryParams.typeCode"
          placeholder="请输入分组类型编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分组类型名称" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入分组类型名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="层级" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入层级"
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
          v-hasPermi="['fill:group_type:add']"
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
      :data="group_typeList"
      row-key="groupTypeId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="父类型ID" prop="parentId" />
      <el-table-column label="分组类型编码" align="center" prop="typeCode" />
      <el-table-column label="分组类型名称" align="center" prop="typeName" />
      <el-table-column label="层级" align="center" prop="level" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewData(scope.row)" v-hasPermi="['fill:group_type:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fill:group_type:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['fill:group_type:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fill:group_type:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分组类型详情抽屉 -->
    <group_type-view-drawer ref="group_typeViewRef" />
    <!-- 添加或修改分组类型对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="group_typeRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父类型ID" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="group_typeOptions"
                :props="{ value: 'groupTypeId', label: 'typeName', children: 'children' }"
                value-key="groupTypeId"
                placeholder="请选择父类型ID"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分组类型编码" prop="typeCode">
              <el-input v-model="form.typeCode" placeholder="请输入分组类型编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分组类型名称" prop="typeName">
              <el-input v-model="form.typeName" placeholder="请输入分组类型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="层级" prop="level">
              <el-input v-model="form.level" placeholder="请输入层级" />
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
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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

<script setup name="Group_type">
import { listGroup_type, getGroup_type, delGroup_type, addGroup_type, updateGroup_type } from "@/api/fill/group_type"
import Group_typeViewDrawer from "./view"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')

const group_typeList = ref([])
const group_typeOptions = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref("")
const isExpandAll = ref(true)
const refreshTable = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    parentId: undefined,
    typeCode: undefined,
    typeName: undefined,
    level: undefined,
    orderNum: undefined,
    status: undefined,
  },
  rules: {
    typeCode: [
      { required: true, message: "分组类型编码不能为空", trigger: "blur" }
    ],
    typeName: [
      { required: true, message: "分组类型名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询分组类型列表 */
function getList() {
  loading.value = true
  listGroup_type(queryParams.value).then(response => {
    group_typeList.value = proxy.handleTree(response.data, "groupTypeId", "parentId")
    loading.value = false
  })
}

/** 查询分组类型下拉树结构 */
function getTreeselect() {
  listGroup_type().then(response => {
    group_typeOptions.value = []
    const data = { groupTypeId: 0, typeName: '顶级节点', children: [] }
    data.children = proxy.handleTree(response.data, "groupTypeId", "parentId")
    group_typeOptions.value.push(data)
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
    groupTypeId: null,
    parentId: null,
    typeCode: null,
    typeName: null,
    level: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("group_typeRef")
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
  if (row != null && row.groupTypeId) {
    form.value.parentId = row.groupTypeId
  } else {
    form.value.parentId = 0
  }
  open.value = true
  title.value = "添加分组类型"
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
  proxy.$refs["group_typeViewRef"].open(row.groupTypeId)
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset()
  await getTreeselect()
  if (row != null) {
    form.value.parentId = row.parentId
  }
  getGroup_type(row.groupTypeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改分组类型"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["group_typeRef"].validate(valid => {
    if (valid) {
      if (form.value.groupTypeId != null) {
        updateGroup_type(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addGroup_type(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除分组类型编号为"' + row.groupTypeId + '"的数据项？').then(function() {
    return delGroup_type(row.groupTypeId)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

getList()
</script>
