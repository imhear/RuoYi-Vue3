<template>
  <el-drawer title="生产计划详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">排产单号：</label>
            <span class="info-value plaintext">
              {{ info.planCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联工单ID：</label>
            <span class="info-value plaintext">
              {{ info.orderId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">工单号：</label>
            <span class="info-value plaintext">
              {{ info.orderNum }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">产品编码：</label>
            <span class="info-value plaintext">
              {{ info.productCode }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">产品名称：</label>
            <span class="info-value plaintext">
              {{ info.productName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">要求数量：</label>
            <span class="info-value plaintext">
              {{ info.requireNum }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">排产数量：</label>
            <span class="info-value plaintext">
              {{ info.planQty }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">完成数量：</label>
            <span class="info-value plaintext">
              {{ info.finishQty }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">单位：</label>
            <span class="info-value plaintext">
              {{ info.unit }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">生产批号：</label>
            <span class="info-value plaintext">
              {{ info.batchNumber }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">计划开始：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.planStart, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">计划结束：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.planEnd, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实际开始：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.startTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实际结束：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.endTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联发布方案ID：</label>
            <span class="info-value plaintext">
              {{ info.releaseId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联批记录实例集ID：</label>
            <span class="info-value plaintext">
              {{ info.instanceId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">状态：</label>
            <span class="info-value plaintext">
              {{ info.status }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">备注：</label>
            <span class="info-value plaintext">
              {{ info.remark }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">取消排产原因：</label>
            <span class="info-value plaintext">
              {{ info.cancelReason }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">编号：</label>
            <span class="info-value plaintext">
              {{ info.fileTemplateCode }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">规格/型号：</label>
            <span class="info-value plaintext">
              {{ info.spec }}
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

<script setup name="Batch_planViewDrawer">
import { getBatch_plan } from '@/api/batch/batch_plan'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (planId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_plan(planId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取生产计划信息失败:', error)
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
