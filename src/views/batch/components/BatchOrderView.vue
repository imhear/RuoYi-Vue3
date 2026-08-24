<template>
  <el-dialog v-model="visible" title="生产任务单" width="210mm" append-to-body @closed="handleClosed">
    <div v-loading="loading" class="order-view-body">
      <template v-if="order">
        <div style="display: flex; align-items: flex-end; margin-bottom: 14px;">
          <h3 style="flex: 1; text-align: center; margin: 0;">灌包生产指令单</h3>
          <span style="font-size: 12px;">编号：{{ order.fileTemplateCode }}</span>
        </div>

        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12"><label>指令单类别：</label>{{ order.orderType }}</el-col>
          <el-col :span="12"><label>生产订单号：</label>{{ order.customerOrderNum }}</el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="24"><label>指令单说明：</label>{{ order.orderDesc }}</el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12"><label>产品编码：</label>{{ order.productCode }}</el-col>
          <el-col :span="12"><label>产品名称：</label>{{ order.productName }}</el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12"><label>生产批号：</label>{{ order.batchNumber }}</el-col>
          <el-col :span="6"><label>计划数量：</label>{{ order.requireNum }}</el-col>
          <el-col :span="6"><label>单位：</label>{{ order.unit }}</el-col>
        </el-row>

        <el-table :data="materials" border size="small">
          <el-table-column label="序号" prop="seqNo" align="center" width="60" />
          <el-table-column label="物料代码" prop="materialCode" />
          <el-table-column label="名称/部件" prop="materialName" />
          <el-table-column label="规格" prop="spec" />
          <el-table-column label="单位" prop="unit" width="60" />
          <el-table-column label="定额数量" prop="quotaQty" align="right" />
          <el-table-column label="总计划数量" prop="totalQty" align="right" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
      </template>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getBatchOrderDetail } from '@/api/batch/batch_order'

defineOptions({ name: 'BatchOrderView' })

const visible = ref(false)
const loading = ref(false)
const order = ref(null)
const materials = ref([])

/**
 * 打开工单详情，根据 orderId 自治加载数据
 * @param {Number} orderId 工单ID
 */
function open(orderId) {
  visible.value = true
  loading.value = true
  getBatchOrderDetail(orderId).then(res => {
    order.value = res.data.order
    materials.value = res.data.materials || []
  }).finally(() => {
    loading.value = false
  })
}

/**
 * 对话框关闭回调
 */
function handleClosed() {
  order.value = null
  materials.value = []
}

defineExpose({ open })
</script>

<style scoped>
.order-view-body {
  max-height: 75vh;
  overflow-y: auto;
}
</style>