<template>
  <el-drawer title="填报方案发布态详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联方案ID：</label>
            <span class="info-value plaintext">
              {{ info.schemeId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">发布版本号：</label>
            <span class="info-value plaintext">
              {{ info.releaseCode }}
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
            <label class="info-label">发布说明：</label>
            <span class="info-value plaintext">
              {{ info.releaseNote }}
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

<script setup name="Scheme_releaseViewDrawer">
import { getScheme_release } from '@/api/fill/scheme_release'

const { sys_normal_disable } = useDict('sys_normal_disable')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (releaseId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getScheme_release(releaseId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取填报方案发布态信息失败:', error)
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
