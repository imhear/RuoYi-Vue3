<template>
  <el-drawer title="生产指令单详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">导入主键：</label>
            <span class="info-value plaintext">
              {{ info.importId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">工单号：</label>
            <span class="info-value plaintext">
              {{ info.orderNum }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">编号：</label>
            <span class="info-value plaintext">
              {{ info.fileTemplateCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">指令单类别：</label>
            <span class="info-value plaintext">
              {{ info.orderType }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">生产订单号：</label>
            <span class="info-value plaintext">
              {{ info.customerOrderNum }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">指令单说明：</label>
            <span class="info-value plaintext">
              {{ info.orderDesc }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">产品编码：</label>
            <span class="info-value plaintext">
              {{ info.productCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">产品名称：</label>
            <span class="info-value plaintext">
              {{ info.productName }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">品牌：</label>
            <span class="info-value plaintext">
              {{ info.brand }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">规格/型号：</label>
            <span class="info-value plaintext">
              {{ info.spec }}
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
            <label class="info-label">计划数量：</label>
            <span class="info-value plaintext">
              {{ info.requireNum }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">计划开始：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.planStart, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">计划结束：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.planEnd, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">制单人：</label>
            <span class="info-value plaintext">
              {{ info.preparedBy }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">制单日期：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.preparedTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">批准人：</label>
            <span class="info-value plaintext">
              {{ info.approvedBy }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">批准日期：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.approvedTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">取消工单原因：</label>
            <span class="info-value plaintext">
              {{ info.cancelReason }}
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

<script setup name="Batch_orderViewDrawer">
import { getBatch_order } from '@/api/batch/batch_order'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (orderId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_order(orderId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取生产指令单信息失败:', error)
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
