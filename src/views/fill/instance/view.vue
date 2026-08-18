<template>
  <el-drawer title="填报实例运行态详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联菜单权限表发布态：</label>
            <span class="info-value plaintext">
              {{ info.menuId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联排产计划ID：</label>
            <span class="info-value plaintext">
              {{ info.planId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实例日期：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.instanceDate, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">表单实例序号：</label>
            <span class="info-value plaintext">
              {{ info.instanceSeq }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实例生成状态：</label>
            <span class="info-value plaintext">
              {{ info.instanceStatus }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">填报流程控制状态：</label>
            <span class="info-value plaintext">
              {{ info.instanceControlStatus }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">业务记录ID：</label>
            <span class="info-value plaintext">
              {{ info.businessRecordId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前端路由地址：</label>
            <span class="info-value plaintext">
              {{ info.path }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">后端接口路径：</label>
            <span class="info-value plaintext">
              {{ info.backendRoute }}
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
            <label class="info-label">分组类型：</label>
            <span class="info-value plaintext">
              {{ info.groupType }}
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
            <label class="info-label">自定义参数：</label>
            <span class="info-value plaintext">
              {{ info.customParams }}
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

<script setup name="InstanceViewDrawer">
import { getInstance } from '@/api/fill/instance'

const { sys_normal_disable } = useDict('sys_normal_disable')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (instanceId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getInstance(instanceId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取填报实例运行态信息失败:', error)
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
