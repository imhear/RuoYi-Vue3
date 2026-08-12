<template>
  <el-card style="height: calc(100vh - 200px)">
    <template #header>
      <span>操作列表</span>
      <el-button style="float: right" link type="primary" icon="Plus" @click="handleAdd"></el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="operationList"
      style="width: 100%"
      height="calc(100vh - 280px)"
    >
      <el-table-column label="排序号" prop="sortOrder" align="center"  min-width="10"/>
      <el-table-column label="操作" width="80" align="center" min-width="15">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click.stop="handleEdit(scope.row)"></el-button>
          <el-button link type="primary" icon="Delete" @click.stop="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作码" prop="operationCode" align="center" min-width="10"/>
      <el-table-column label="操作名称" prop="operationName" align="center" min-width="20"/>
      <el-table-column label="组件路径" prop="componentPath" align="center" show-overflow-tooltip min-width="20"/>
      <el-table-column label="卡片显示" prop="displayOnCard" align="center" min-width="15"/>
    </el-table>

    <!-- 新增/编辑操作对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑操作' : '新增操作'" width="400px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="操作码" prop="operationCode">
          <el-input v-model="form.operationCode" placeholder="请选择操作码" readonly>
            <template #append>
              <el-button icon="Search" @click="openSelectOperation" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="操作名称" prop="operationName">
          <el-input v-model="form.operationName" placeholder="操作名称（自动填充）" disabled />
        </el-form-item>
        <el-form-item label="组件路径" prop="componentPath">
          <el-input v-model="form.componentPath" placeholder="请选择组件路径" readonly>
            <template #append>
              <el-button icon="Search" @click="openSelectComponent" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="卡片显示" prop="displayOnCard">
          <el-select v-model="form.displayOnCard" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="sortOrder">
          <el-input v-model="form.sortOrder" placeholder="排序号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择操作码对话框 -->
    <SelectOperation ref="selectOperationRef" @ok="onOperationSelected" />
    <!-- 选择组件路径对话框 -->
    <SelectComponent ref="selectComponentRef" @ok="onComponentSelected" />
  </el-card>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { listSchemeoperation, getSchemeoperation, addSchemeoperation, updateSchemeoperation, delSchemeoperation } from "@/api/fill/schemeoperation"
import SelectOperation from './SelectOperation.vue'
import SelectComponent from './SelectComponent.vue'

const props = defineProps({
  detailId: { type: Number, default: null }
})

const { proxy } = getCurrentInstance()

const loading = ref(false)
const operationList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const selectOperationRef = ref(null)
const selectComponentRef = ref(null)

const form = ref({
  detailOperateId: null,
  operationCode: '',
  operationName: '',    // 新增冗余字段
  componentPath: '',
  displayOnCard: '1',
  sortOrder: 0
})

const rules = {
  operationCode: [{ required: true, message: '操作码不能为空', trigger: 'change' }],
  componentPath: [{ required: true, message: '组件路径不能为空', trigger: 'change' }]
}

/**
 * 加载当前明细已关联的操作列表
 */
function loadOperations() {
  if (!props.detailId) {
    operationList.value = []
    return
  }
  loading.value = true
  listSchemeoperation({ detailId: props.detailId, status: '0' }).then(res => {
    operationList.value = res.rows
    loading.value = false
  })
}

// ========== 新增 ==========
function handleAdd() {
  if (!props.detailId) {
    proxy.$modal.msgWarning('请先选择左侧的明细')
    return
  }
  isEdit.value = false
  form.value = { detailOperateId: null, operationCode: '', operationName: '', componentPath: '', displayOnCard: '1', sortOrder: 0 }
  dialogVisible.value = true
  nextTick(() => formRef.value?.resetFields())
}

// ========== 编辑 ==========
function handleEdit(row) {
  isEdit.value = true
  getSchemeoperation(row.detailOperateId).then(res => {
    form.value = res.data
    dialogVisible.value = true
  })
}

// ========== 打开选择操作码对话框 ==========
function openSelectOperation() {
  selectOperationRef.value.show()
}

// ========== 选择操作码回调：同时回填操作码和操作名称 ==========
function onOperationSelected(row) {
  form.value.operationCode = row.operationCode
  form.value.operationName = row.operationName
}

// ========== 打开选择组件路径对话框 ==========
function openSelectComponent() {
  selectComponentRef.value.show()
}

// ========== 选择组件路径回调 ==========
function onComponentSelected(row) {
  form.value.componentPath = row.componentPath
}

// ========== 提交新增/编辑 ==========
function submitForm() {
  formRef.value?.validate(valid => {
    if (!valid) return
    if (isEdit.value) {
      updateSchemeoperation(form.value).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        dialogVisible.value = false
        loadOperations()
      })
    } else {
      addSchemeoperation({ ...form.value, detailId: props.detailId }).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        dialogVisible.value = false
        loadOperations()
      })
    }
  })
}

// ========== 删除 ==========
function handleDelete(row) {
  proxy.$modal.confirm('确认删除该操作？').then(() => {
    return delSchemeoperation(row.detailOperateId)
  }).then(() => {
    proxy.$modal.msgSuccess('删除成功')
    loadOperations()
  }).catch(() => {})
}

watch(() => props.detailId, loadOperations, { immediate: true })
</script>