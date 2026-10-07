<template>
  <el-drawer title="批记录详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联发布版本ID：</label>
            <span class="info-value plaintext">
              {{ info.releaseId }}
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
            <label class="info-label">完成数量：</label>
            <span class="info-value plaintext">
              {{ info.finishQty }}
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
            <label class="info-label">生产批号：</label>
            <span class="info-value plaintext">
              {{ info.batchNumber }}
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
            <label class="info-label">备注：</label>
            <span class="info-value plaintext">
              {{ info.remark }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">取消原因：</label>
            <span class="info-value plaintext">
              {{ info.cancelReason }}
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
            <label class="info-label">方案编码：</label>
            <span class="info-value plaintext">
              {{ info.schemeCode }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">发布版本号：</label>
            <span class="info-value plaintext">
              {{ info.releaseCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">方案类型：</label>
            <span class="info-value plaintext">
              {{ info.schemeType }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">方案名称：</label>
            <span class="info-value plaintext">
              {{ info.schemeName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">状态：</label>
            <span class="info-value plaintext">
              <!--
                状态字段：从业务字典 biz_record_status 显示中文标签
                - 业务字典结构：[{ label: '已审核', value: '1' }, ...]
                - dict-tag 组件根据 value 匹配 label 并显示带颜色的标签
                - 若未匹配到（如 value 为空），dict-tag 会展示原始 value，避免空白
              -->
              <dict-tag :options="biz_record_status" :value="info.status" />
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

<script setup name="Batch_recordViewDrawer">
import { getBatch_record } from '@/api/batch/batch_record'
// 引入业务字典 Hook（项目自定义 hook，需显式 import，不依赖 auto-import）
import { useBizDict } from '@/utils/bizDict'

// 批记录状态字典（0=待审核 1=已审核 2=已归档 9=已取消），用于状态字段的中文展示
const { biz_record_status } = useBizDict('biz_record_status')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (recordId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_record(recordId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取批记录信息失败:', error)
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