<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="节点类型" prop="nodeType">
        <el-select v-model="queryParams.nodeType" placeholder="请选择节点类型" clearable style="width: 150px">
          <el-option label="一级目录" value="M" />
          <el-option label="二级目录" value="C" />
          <el-option label="叶子节点" value="F" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料大类" prop="categoryCode">
        <el-select v-model="queryParams.categoryCode" placeholder="请选择物料大类" clearable style="width: 180px">
          <el-option
            v-for="dict in biz_material_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
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
          v-hasPermi="['basic:spec:add']"
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
      :data="specList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="类型" align="center" prop="nodeType" width="110">
        <template #default="scope">
          <el-tag v-if="scope.row.nodeType === 'M'" type="primary" size="small">一级目录</el-tag>
          <el-tag v-else-if="scope.row.nodeType === 'C'" type="success" size="small">二级目录</el-tag>
          <el-tag v-else-if="scope.row.nodeType === 'F'" type="warning" size="small">叶子节点</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编码" align="center" prop="code" width="180" />
      <el-table-column label="物料大类" align="center" prop="categoryCode" width="140">
        <template #default="scope">
          <dict-tag :options="biz_material_type" :value="scope.row.categoryCode" />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum" width="80" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['basic:spec:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['basic:spec:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['basic:spec:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改基础数据-规格对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="specRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级节点" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="specOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="id"
                placeholder="请选择上级节点"
                check-strictly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="节点类型" prop="nodeType">
              <el-radio-group v-model="form.nodeType" :disabled="form.id != null">
                <el-radio value="M">一级目录</el-radio>
                <el-radio value="C">二级目录</el-radio>
                <el-radio value="F">叶子节点</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="叶子节点必填，目录节点留空" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物料大类" prop="categoryCode">
              <el-select v-model="form.categoryCode" placeholder="请选择物料大类" style="width: 100%">
                <el-option
                  v-for="dict in biz_material_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序" prop="orderNum">
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

<script setup name="BasicSpec">
import { listSpec, getSpec, delSpec, addSpec, updateSpec } from "@/api/basic/spec"
import { useBizDict } from '@/utils/bizDict'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')
const { biz_material_type } = useBizDict('biz_material_type')

const specList = ref([])
const specOptions = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref("")
const isExpandAll = ref(true)
const refreshTable = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    code: undefined,
    name: undefined,
    nodeType: undefined,
    categoryCode: undefined,
    status: undefined,
  },
  rules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    nodeType: [
      { required: true, message: "节点类型不能为空", trigger: "change" }
    ],
    categoryCode: [
      { required: true, message: "物料大类不能为空", trigger: "change" }
    ],
    code: [
      {
        validator: (rule, value, callback) => {
          // 仅叶子节点（F）必填编码
          if (form.value.nodeType === 'F' && !value) {
            callback(new Error('叶子节点必须填写编码'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询基础数据-规格列表 */
function getList() {
  loading.value = true
  listSpec(queryParams.value).then(response => {
    specList.value = proxy.handleTree(response.data, "id", "parentId")
    loading.value = false
  })
}

/** 查询基础数据-规格下拉树结构 */
function getTreeselect() {
  listSpec().then(response => {
    specOptions.value = []
    const data = { id: 0, name: '顶级节点', children: [] }
    data.children = proxy.handleTree(response.data, "id", "parentId")
    specOptions.value.push(data)
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
    id: null,
    code: null,
    name: null,
    parentId: null,
    ancestors: null,
    nodeType: 'F',
    categoryCode: null,
    orderNum: 0,
    status: '0',
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("specRef")
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
  if (row != null && row.id) {
    form.value.parentId = row.id
  } else {
    form.value.parentId = 0
  }
  open.value = true
  title.value = "添加基础数据-规格"
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset()
  await getTreeselect()
  if (row != null) {
    form.value.parentId = row.parentId
  }
  getSpec(row.id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改基础数据-规格"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["specRef"].validate(valid => {
    if (valid) {
      // 目录节点 code 清空，避免唯一索引冲突
      if (form.value.nodeType !== 'F') {
        form.value.code = null
      }
      if (form.value.id != null) {
        updateSpec(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSpec(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项？').then(function() {
    return delSpec(row.id)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

getList()
</script>