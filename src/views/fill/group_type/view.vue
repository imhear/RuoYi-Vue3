<template>
  <el-drawer title="分组类型详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">父类型ID：</label>
            <span class="info-value plaintext">
              {{ info.parentId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">分组类型编码：</label>
            <span class="info-value plaintext">
              {{ info.typeCode }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">分组类型名称：</label>
            <span class="info-value plaintext">
              {{ info.typeName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">层级：</label>
            <span class="info-value plaintext">
              {{ info.level }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">显示顺序：</label>
            <span class="info-value plaintext">
              {{ info.orderNum }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">状态：</label>
            <span class="info-value plaintext">
              <dict-tag :options="sys_normal_disable" :value="info.status" />
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup name="Group_typeViewDrawer">
import { getGroup_type } from '@/api/fill/group_type'

const { sys_normal_disable } = useDict('sys_normal_disable')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (groupTypeId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getGroup_type(groupTypeId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取分组类型信息失败:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  visible.value = false
  Object.keys(info).forEach(key => delete info[key])
}

defineExpose({ open })
</script>
