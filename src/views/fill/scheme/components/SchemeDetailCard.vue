<template>
  <el-card style="height: calc(100vh - 200px)">
    <template #header>
      <span>明细列表</span>
      <el-button style="float: right" link type="primary" icon="Plus" @click="handleAdd"></el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="detailList"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
      height="calc(100vh - 280px)"
    >
      <el-table-column label="排序号" prop="sortOrder" align="center"  min-width="26"/>
      <el-table-column label="操作" width="80" align="center" min-width="10">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click.stop="handleEdit(scope.row)"></el-button>
          <el-button link type="primary" icon="Delete" @click.stop="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="物理表名" prop="tableName" align="center" show-overflow-tooltip min-width="50"/>
      <el-table-column label="自定义参数" prop="customParams" align="center" show-overflow-tooltip min-width="50"/>
    </el-table>

    <!-- 新增/编辑明细对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑明细' : '新增明细'" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="物理表名" prop="tableName">
          <el-input v-model="form.tableName" placeholder="请选择物理表" readonly>
            <template #append>
              <el-button icon="Search" @click="openSelectForm" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="自定义参数" prop="customParams">
          <el-input v-model="form.customParams" placeholder='如 {"MaterialType":"PACKAGING_MATERIAL"}' />
        </el-form-item>
        <el-form-item label="前置明细ID" prop="predecessorDetailId">
          <el-input v-model="form.predecessorDetailId" placeholder="前置明细ID" />
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

    <!-- 选择物理表对话框 -->
    <SelectForm ref="selectFormRef" @ok="onFormSelected" />
  </el-card>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { listSchemedetail, getSchemedetail, addSchemedetail, updateSchemedetail, delSchemedetail } from "@/api/fill/schemedetail"
import { listSchemeoperation } from "@/api/fill/schemeoperation"
import SelectForm from '../../components/SelectForm.vue'

const props = defineProps({
  groupSchemeId: { type: Number, default: null }
})

const emit = defineEmits(['select'])
const { proxy } = getCurrentInstance()

const loading = ref(false)
const detailList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const selectFormRef = ref(null)

const form = ref({
  detailId: null,
  tableName: '',
  customParams: '',
  predecessorDetailId: null,
  sortOrder: 0
})

const rules = {
  tableName: [{ required: true, message: '物理表名不能为空', trigger: 'change' }]
}

/**
 * 加载当前分组已关联的明细列表
 */
function loadDetails() {
  if (!props.groupSchemeId) {
    detailList.value = []
    return
  }
  loading.value = true
  listSchemedetail({ groupSchemeId: props.groupSchemeId, status: '0' }).then(res => {
    detailList.value = res.rows
    loading.value = false
  })
}

/**
 * 行点击选中（中卡片选中）
 */
function handleCurrentChange(row) {
  emit('select', row ? row.detailId : null)
}

// ========== 新增 ==========
function handleAdd() {
  if (!props.groupSchemeId) {
    proxy.$modal.msgWarning('请先选择左侧的分组')
    return
  }
  isEdit.value = false
  form.value = { detailId: null, tableName: '', customParams: '', predecessorDetailId: null, sortOrder: 0 }
  dialogVisible.value = true
  nextTick(() => formRef.value?.resetFields())
}

// ========== 编辑 ==========
function handleEdit(row) {
  isEdit.value = true
  getSchemedetail(row.detailId).then(res => {
    form.value = res.data
    dialogVisible.value = true
  })
}

// ========== 打开选择物理表对话框 ==========
function openSelectForm() {
  selectFormRef.value.show()
}

// ========== 选择物理表回调 ==========
function onFormSelected(row) {
  form.value.tableName = row.tableName
}

// ========== 提交新增/编辑 ==========
function submitForm() {
  formRef.value?.validate(valid => {
    if (!valid) return
    if (isEdit.value) {
      updateSchemedetail(form.value).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        dialogVisible.value = false
        loadDetails()
      })
    } else {
      addSchemedetail({ ...form.value, groupSchemeId: props.groupSchemeId }).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        dialogVisible.value = false
        loadDetails()
      })
    }
  })
}

// ========== 删除（前端校验是否存在子操作） ==========
function handleDelete(row) {
  listSchemeoperation({ detailId: row.detailId, pageNum: 1, pageSize: 1 }).then(res => {
    if (res.total > 0) {
      proxy.$modal.msgError('存在关联操作，无法删除')
      return
    }
    proxy.$modal.confirm('确认删除该明细？').then(() => {
      return delSchemedetail(row.detailId)
    }).then(() => {
      proxy.$modal.msgSuccess('删除成功')
      loadDetails()
    }).catch(() => {})
  })
}

watch(() => props.groupSchemeId, loadDetails, { immediate: true })
</script>