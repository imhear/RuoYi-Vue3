<template>
  <el-drawer title="领料单子表详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联领料单主键：</label>
            <span class="info-value plaintext">
              {{ info.receivingId }}
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
            <label class="info-label">物料编码：</label>
            <span class="info-value plaintext">
              {{ info.materialCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物料名称：</label>
            <span class="info-value plaintext">
              {{ info.materialName }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">规格：</label>
            <span class="info-value plaintext">
              {{ info.spec }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">单位：</label>
            <span class="info-value plaintext">
              {{ info.unit }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">计划领用量：</label>
            <span class="info-value plaintext">
              {{ info.requireQty }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">包装是否完整：</label>
            <span class="info-value plaintext">
              {{ info.baozhuangFlag }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">标签是否正确：</label>
            <span class="info-value plaintext">
              {{ info.biaoqianFlag }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">是否无发霉/变质/生虫/变色等：</label>
            <span class="info-value plaintext">
              {{ info.waiguanFlag }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">是否已放行：</label>
            <span class="info-value plaintext">
              {{ info.fangxingFlag }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物料批号：</label>
            <span class="info-value plaintext">
              {{ info.batchNumber }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实际发料量：</label>
            <span class="info-value plaintext">
              {{ info.actualQty }}
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

<script setup name="Batch_receiving_itemViewDrawer">
import { getBatch_receiving_item } from '@/api/batch/batch_receiving_item'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (itemId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_receiving_item(itemId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取领料单子表信息失败:', error)
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
