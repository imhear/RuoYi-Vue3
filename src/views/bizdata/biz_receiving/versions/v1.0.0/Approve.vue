<template>
  <div class="approve-container">
    <!-- 只读展示业务数据 -->
    <div v-if="receiving" class="view-container">
      <!-- 公司名称 + 编号 -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 0px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SOP-S-G-001)-01</span>
      </div>

      <!-- 物料类别 -->
      <div style="text-align: center; margin-top: 4px; margin-bottom: -6px; display: flex; justify-content: center; align-items: center;">
        <span style="font-weight: bold;">（</span>
        <el-checkbox :model-value="receiving.materialType === 'RAW_MATERIAL'" disabled>原料</el-checkbox>
        <el-checkbox :model-value="receiving.materialType === 'SEMI_FINISHED_PRODUCT'" disabled>半成品</el-checkbox>
        <el-checkbox :model-value="receiving.materialType === 'INTERMEDIATE_PRODUCT'" disabled>半制品</el-checkbox>
        <el-checkbox :model-value="receiving.materialType === 'PACKAGING_MATERIAL'" disabled>包装材料</el-checkbox>
        <span style="font-weight: bold;">）领料单</span>
      </div>

      <!-- 产品信息 -->
      <el-table :data="[{}]" :show-header="false" border size="small" class="top-table">
        <el-table-column width="120" align="center">
          <template #default><span style="font-weight: bold;">产品名称</span></template>
        </el-table-column>
        <el-table-column width="331">
          <template #default>{{ batchRecord?.productName || '' }}</template>
        </el-table-column>
        <el-table-column width="80" align="center">
          <template #default><span style="font-weight: bold;">规格</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>{{ batchRecord?.spec || '' }}</template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template #default><span style="font-weight: bold;">产品批号</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>{{ batchRecord?.batchNumber || '' }}</template>
        </el-table-column>
      </el-table>

      <!-- 物料明细（只读） -->
      <el-table :data="displayItems" border size="small" class="mid-table"
                :header-cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
                :cell-style="{ 'text-align': 'center', 'font-size': '12px' }">
        <el-table-column label="序号" width="45" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="物料名称" min-width="120" align="center" prop="materialName" />
        <el-table-column label="规格" width="90" align="center" prop="spec" />
        <el-table-column label="单位" width="70" align="center" prop="unit" />
        <el-table-column width="70" align="center">
          <template #header><div style="line-height: 1.2;">计划<br/>领用量</div></template>
          <template #default="scope">{{ scope.row.requireQty }}</template>
        </el-table-column>
        <el-table-column label="物料核对" align="center">
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">包装<br/>是否完整</div></template>
            <template #default="scope">{{ scope.row.baozhuangFlag === 'Y' ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">标签<br/>是否正确</div></template>
            <template #default="scope">{{ scope.row.biaoqianFlag === 'Y' ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column min-width="90" align="center">
            <template #header><div style="line-height: 1.2;">是否无<br/>发霉、无变质、无生<br/>虫、无变色等</div></template>
            <template #default="scope">{{ scope.row.waiguanFlag === 'Y' ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">是否已放行</div></template>
            <template #default="scope">{{ scope.row.fangxingFlag === 'Y' ? '是' : '否' }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="物料批号" width="80" align="center" prop="batchNumber" />
        <el-table-column width="70" align="center">
          <template #header><div style="line-height: 1.2;">实际<br/>发料量</div></template>
          <template #default="scope">{{ scope.row.actualQty }}</template>
        </el-table-column>
        <el-table-column label="备注" min-width="70" align="center" prop="remark" />
      </el-table>

      <!-- 签名行 -->
      <el-table :data="[{}]" :show-header="false" border size="small" class="bottom-table">
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">领用人/日期：</span></template>
        </el-table-column>
        <el-table-column>{{ receiving.receiveBy }} / {{ receiving.receiveDate }}</el-table-column>
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">发料人/日期：</span></template>
        </el-table-column>
        <el-table-column>{{ receiving.deliveryBy }} / {{ receiving.deliveryDate }}</el-table-column>
      </el-table>
    </div>

    <!-- 底部操作按钮 -->
    <div style="text-align: right; margin-top: 12px;">
      <el-button type="primary" @click="handleConfirm">{{ buttonLabel }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBizReceivingDetail } from '@/api/bizdata/biz_receiving'
import { getBatch_record } from '@/api/batch/batch_record'
import { approveBatchRecordMenu } from '@/api/batch/batch_record_menu'

defineOptions({ name: 'ReceivingApprove' })

/**
 * 父组件传入的 props
 */
const props = defineProps({
  recordId: { type: Number, required: true },         // 批记录ID
  menuId: { type: Number, required: true },           // 按钮节点ID
  businessRecordId: { type: Number, required: true }, // 业务记录ID
  operationCode: { type: String, default: '' },       // 操作码
  backendRoute: { type: String, default: '' },        // 后端接口路径
  tableName: { type: String, default: '' },           // 物理表名
  menuName: { type: String, default: '' },            // 按钮节点名称（用于确认框）
  buttonLabel: { type: String, default: '确认' }      // 按钮标签（用于按钮文字）
})

// 定义对外事件：closed 关闭弹窗；refresh 通知父组件刷新数据
const emit = defineEmits(['closed', 'refresh'])

const loading = ref(false)        // 是否加载中
const receiving = ref(null)       // 领料单主表数据
const batchRecord = ref(null)     // 批记录数据（产品信息）

/**
 * 固定显示14行物料明细（不足补空行）
 */
const displayItems = computed(() => {
  const items = receiving.value?.itemList || []
  const rows = []
  for (let i = 0; i < 14; i++) {
    rows.push(items[i] || {})
  }
  return rows
})

/**
 * 组件挂载时加载数据
 */
onMounted(async () => {
  await loadData()
})

/**
 * 并行加载批记录信息与业务数据
 */
async function loadData() {
  loading.value = true
  try {
    const [recordRes, receivingRes] = await Promise.all([
      getBatch_record(props.recordId),
      getBizReceivingDetail(props.businessRecordId)
    ])
    batchRecord.value = recordRes.data || null
    receiving.value = receivingRes.data || null
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 确认审批操作
 */
async function handleConfirm() {
  try {
    await ElMessageBox.confirm(`确认执行「${props.menuName || props.buttonLabel}」操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await approveBatchRecordMenu(props.menuId, '')
    ElMessage.success('操作成功')

    // 先触发刷新事件，再关闭自身
    emit('refresh')
    await nextTick()
    emit('closed')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}
</script>

<style scoped>
.approve-container {
  padding: 8px;
}
.view-container {
  overflow-x: hidden;
  overflow-y: auto;
  height: 75vh;
  box-sizing: border-box;
  color: #000;
}
.view-container :deep(.el-table) { color: #000; }
.view-container :deep(.el-table th) { color: #000; font-weight: normal; }
.view-container :deep(.el-checkbox__label) { color: #000 !important; }
.top-table { margin-bottom: -1px; }
.top-table :deep(.el-table__body tr) { background-color: #f5f7fa !important; }
.bottom-table :deep(.el-table__body tr) { background-color: #f5f7fa !important; }
.mid-table { margin-top: -1px; margin-bottom: -1px; }
.bottom-table { margin-top: -1px; }
.mid-table :deep(.el-table__header) .cell { white-space: normal; word-break: break-all; line-height: 1.2; }
.mid-table :deep(.el-table__header-wrapper th),
.mid-table :deep(.el-table__fixed-header-wrapper th) { height: 30px !important; background-color: #ffffff !important; }
</style>