<template>
  <el-card style="height: calc(100vh - 200px)">
    <template #header>
      <span>分组列表</span>
      <el-button style="float: right" link type="primary" icon="Plus" @click="handleAdd"></el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="groupList"
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
      <el-table-column label="分组类型" prop="groupType" align="center" min-width="50"/>
      <el-table-column label="分组名称" prop="groupTypeName" align="center" min-width="50"/>
    </el-table>

    <!-- 新增/编辑分组对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分组' : '新增分组'" width="400px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分组类型" prop="groupType">
          <el-select v-model="form.groupType" placeholder="请选择分组类型" style="width: 100%">
            <el-option label="DISINFECTION" value="DISINFECTION" />
            <el-option label="FILLING" value="FILLING" />
            <el-option label="PACKING" value="PACKING" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组名称" prop="groupTypeName">
          <el-input v-model="form.groupTypeName" placeholder="如 消毒车间" />
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
  </el-card>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { listSchemegroup, getSchemegroup, addSchemegroup, updateSchemegroup, delSchemegroup } from "@/api/fill/schemegroup"
import { listSchemedetail } from "@/api/fill/schemedetail"

const props = defineProps({
  schemeId: { type: Number, required: true }
})

const emit = defineEmits(['select'])
const { proxy } = getCurrentInstance()

const loading = ref(false)
const groupList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const form = ref({
  groupSchemeId: null,
  groupType: '',
  groupTypeName: '',
  sortOrder: 0
})

const rules = {
  groupType: [{ required: true, message: '分组类型不能为空', trigger: 'change' }],
  groupTypeName: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
}

/**
 * 加载当前方案已关联的分组列表
 */
function loadGroups() {
  if (!props.schemeId) {
    groupList.value = []
    return
  }
  loading.value = true
  listSchemegroup({ schemeId: props.schemeId, status: '0' }).then(res => {
    groupList.value = res.rows
    loading.value = false
  })
}

/**
 * 行点击选中（左卡片选中）
 */
function handleCurrentChange(row) {
  emit('select', row ? row.groupSchemeId : null)
}

// ========== 新增 ==========
function handleAdd() {
  isEdit.value = false
  form.value = { groupSchemeId: null, groupType: '', groupTypeName: '', sortOrder: 0 }
  dialogVisible.value = true
  nextTick(() => formRef.value?.resetFields())
}

// ========== 编辑 ==========
function handleEdit(row) {
  isEdit.value = true
  getSchemegroup(row.groupSchemeId).then(res => {
    form.value = res.data
    dialogVisible.value = true
  })
}

// ========== 提交新增/编辑 ==========
function submitForm() {
  formRef.value?.validate(valid => {
    if (!valid) return
    if (isEdit.value) {
      updateSchemegroup(form.value).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        dialogVisible.value = false
        loadGroups()
      })
    } else {
      addSchemegroup({ ...form.value, schemeId: props.schemeId }).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        dialogVisible.value = false
        loadGroups()
      })
    }
  })
}

// ========== 删除（前端校验是否存在子明细） ==========
function handleDelete(row) {
  listSchemedetail({ groupSchemeId: row.groupSchemeId, pageNum: 1, pageSize: 1 }).then(res => {
    if (res.total > 0) {
      proxy.$modal.msgError('存在关联明细，无法删除')
      return
    }
    proxy.$modal.confirm('确认删除该分组？').then(() => {
      return delSchemegroup(row.groupSchemeId)
    }).then(() => {
      proxy.$modal.msgSuccess('删除成功')
      loadGroups()
    }).catch(() => {})
  })
}

watch(() => props.schemeId, loadGroups, { immediate: true })
</script>