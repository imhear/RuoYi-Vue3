<template>
  <el-drawer title="物料计划详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联工单ID：</label>
            <span class="info-value plaintext">
              {{ info.orderId }}
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
            <label class="info-label">工单号：</label>
            <span class="info-value plaintext">
              {{ info.orderNum }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">序号：</label>
            <span class="info-value plaintext">
              {{ info.seqNo }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物料二维码：</label>
            <span class="info-value plaintext">
              {{ info.qrCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物料代码：</label>
            <span class="info-value plaintext">
              {{ info.materialCode }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">名称/部件：</label>
            <span class="info-value plaintext">
              {{ info.materialName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">规格：</label>
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
            <label class="info-label">定额数量：</label>
            <span class="info-value plaintext">
              {{ info.quotaQty }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">总计划数量：</label>
            <span class="info-value plaintext">
              {{ info.totalQty }}
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
            <label class="info-label">乐观锁版本号：</label>
            <span class="info-value plaintext">
              {{ info.revision }}
            </span>
          </div>
        </el-col>
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

<script setup name="Batch_bom_itemViewDrawer">
import { getBatch_bom_item } from '@/api/batch/batch_bom_item'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (bomId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_bom_item(bomId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取物料计划信息失败:', error)
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
