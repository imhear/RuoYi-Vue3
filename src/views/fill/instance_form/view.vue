<template>
  <el-drawer title="填报单实例运行态详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联批记录实例ID：</label>
            <span class="info-value plaintext">
              {{ info.instanceId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联发布态菜单ID：</label>
            <span class="info-value plaintext">
              {{ info.menuId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">冗余：发布版本ID：</label>
            <span class="info-value plaintext">
              {{ info.releaseId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">冗余：排产计划ID：</label>
            <span class="info-value plaintext">
              {{ info.planId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">冗余：物理表名：</label>
            <span class="info-value plaintext">
              {{ info.tableName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">冗余：自定义参数：</label>
            <span class="info-value plaintext">
              {{ info.customParams }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前端路由地址：</label>
            <span class="info-value plaintext">
              {{ info.path }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">后端接口路径：</label>
            <span class="info-value plaintext">
              {{ info.backendRoute }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">业务表主键：</label>
            <span class="info-value plaintext">
              {{ info.businessRecordId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实例日期：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.instanceDate, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">表单实例序号：</label>
            <span class="info-value plaintext">
              {{ info.instanceSeq }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">表单生成状态：</label>
            <span class="info-value plaintext">
              {{ info.instanceStatus }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">填报流程控制状态：</label>
            <span class="info-value plaintext">
              {{ info.instanceControlStatus }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">乐观锁版本号：</label>
            <span class="info-value plaintext">
              {{ info.revision }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">系统版本号：</label>
            <span class="info-value plaintext">
              {{ info.sysVersion }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup name="Instance_formViewDrawer">
import { getInstance_form } from '@/api/fill/instance_form'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (formId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getInstance_form(formId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取填报单实例运行态信息失败:', error)
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
