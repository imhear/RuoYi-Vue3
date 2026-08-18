<template>
  <el-drawer title="业务表详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">数据库schema：</label>
            <span class="info-value plaintext">
              {{ info.tableSchema }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物理表名：</label>
            <span class="info-value plaintext">
              {{ info.tableName }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物理表注释：</label>
            <span class="info-value plaintext">
              {{ info.tableComment }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物理表DDL创建时间：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.ddlCreateTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物理表DDL修改时间：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.ddlUpdateTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">表单类型：</label>
            <span class="info-value plaintext">
              {{ info.formType }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">所属模块：</label>
            <span class="info-value plaintext">
              {{ info.module }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">所属分组：</label>
            <span class="info-value plaintext">
              {{ info.groupName }}
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

<script setup name="FormViewDrawer">
import { getForm } from '@/api/fill/form'

const { sys_normal_disable } = useDict('sys_normal_disable')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (formId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getForm(formId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取业务表信息失败:', error)
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
