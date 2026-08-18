<template>
  <el-drawer title="填报方案设计态详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">方案编码：</label>
            <span class="info-value plaintext">
              {{ info.schemeCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">方案名称：</label>
            <span class="info-value plaintext">
              {{ info.schemeName }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">方案类型：</label>
            <span class="info-value plaintext">
              {{ info.schemeType }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">包含的分组类型数量：</label>
            <span class="info-value plaintext">
              {{ info.groupTypeCount }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">当前已发布版本ID：</label>
            <span class="info-value plaintext">
              {{ info.currentReleaseId }}
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
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">备注：</label>
            <span class="info-value plaintext">
              {{ info.remark }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup name="Scheme_designViewDrawer">
import { getScheme_design } from '@/api/fill/scheme_design'

const { sys_normal_disable } = useDict('sys_normal_disable')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (schemeId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getScheme_design(schemeId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取填报方案设计态信息失败:', error)
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
