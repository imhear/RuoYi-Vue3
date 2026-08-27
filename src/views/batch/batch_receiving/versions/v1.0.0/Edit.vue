<template>
  <div class="receiving-edit-container">
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

      <!-- 产品信息（来自 batch_record） -->
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

      <!-- 物料明细（可编辑） -->
      <el-table
        :data="displayItems"
        border
        size="small"
        class="mid-table"
        :header-cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
        :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
      >
        <el-table-column label="序号" width="45" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="物料名称" min-width="120" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.materialName" size="small" placeholder="请选择" clearable>
              <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="90" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.spec" size="small" placeholder="请选择" clearable>
              <el-option v-for="dict in receiving_spec" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="70" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.unit" size="small" placeholder="请选择" clearable>
              <el-option v-for="dict in pro_unit" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="70" align="center">
          <template #header><div style="line-height: 1.2;">计划<br/>领用量</div></template>
          <template #default="scope"><el-input v-model="scope.row.requireQty" size="small" /></template>
        </el-table-column>
        <el-table-column label="物料核对" align="center">
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">包装<br/>是否完整</div></template>
            <template #default="scope">
              <span style="white-space: nowrap;">
                是<el-checkbox v-model="scope.row.baozhuangFlag" true-value="Y" false-value="N" />
                否<el-checkbox v-model="scope.row.baozhuangFlag" true-value="N" false-value="Y" />
              </span>
            </template>
          </el-table-column>
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">标签<br/>是否正确</div></template>
            <template #default="scope">
              <span style="white-space: nowrap;">
                是<el-checkbox v-model="scope.row.biaoqianFlag" true-value="Y" false-value="N" />
                否<el-checkbox v-model="scope.row.biaoqianFlag" true-value="N" false-value="Y" />
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="90" align="center">
            <template #header><div style="line-height: 1.2;">是否无<br/>发霉、无变质、无生<br/>虫、无变色等</div></template>
            <template #default="scope">
              <span style="white-space: nowrap;">
                是<el-checkbox v-model="scope.row.waiguanFlag" true-value="Y" false-value="N" />
                否<el-checkbox v-model="scope.row.waiguanFlag" true-value="N" false-value="Y" />
              </span>
            </template>
          </el-table-column>
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">是否已放行</div></template>
            <template #default="scope">
              <span style="white-space: nowrap;">
                是<el-checkbox v-model="scope.row.fangxingFlag" true-value="Y" false-value="N" />
                否<el-checkbox v-model="scope.row.fangxingFlag" true-value="N" false-value="Y" />
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="物料批号" width="80" align="center">
          <template #default="scope"><el-input v-model="scope.row.batchNumber" size="small" /></template>
        </el-table-column>
        <el-table-column width="70" align="center">
          <template #header><div style="line-height: 1.2;">实际<br/>发料量</div></template>
          <template #default="scope"><el-input v-model="scope.row.actualQty" size="small" /></template>
        </el-table-column>
        <el-table-column label="备注" min-width="70" align="center">
          <template #default="scope"><el-input v-model="scope.row.remark" size="small" /></template>
        </el-table-column>
      </el-table>

      <!-- 签名行（可编辑） -->
      <el-table :data="[{}]" :show-header="false" border size="small" class="bottom-table">
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">领用人/日期：</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>
            <el-input v-model="editForm.receiveBy" placeholder="领用人" size="small" style="width: 100px;" />
            <el-date-picker v-model="editForm.receiveDate" type="date" value-format="YYYY-MM-DD" placeholder="日期" size="small" style="width: 140px; margin-left: 8px;" />
          </template>
        </el-table-column>
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">发料人/日期：</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>
            <el-input v-model="editForm.deliveryBy" placeholder="发料人" size="small" style="width: 100px;" />
            <el-date-picker v-model="editForm.deliveryDate" type="date" value-format="YYYY-MM-DD" placeholder="日期" size="small" style="width: 140px; margin-left: 8px;" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 保存按钮 -->
      <div style="text-align: right; margin-top: 12px;">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBatchReceivingDetail, updateBatchReceiving } from '@/api/batch/batch_receiving'
import { getBatch_record } from '@/api/batch/batch_record'

defineOptions({ name: 'ReceivingEdit' })

const props = defineProps({
  recordId: { type: Number, required: true },
  menuId: { type: Number, required: true },
  businessRecordId: { type: Number, required: true },
  operationCode: { type: String, default: '' },
  backendRoute: { type: String, default: '' },
  tableName: { type: String, default: '' }
})

const emit = defineEmits(['closed'])

const { proxy } = getCurrentInstance()
const { receiving_material, receiving_spec, pro_unit } = proxy.useDict('receiving_material', 'receiving_spec', 'pro_unit')

const loading = ref(false)      // 保留变量，仅用于控制加载逻辑，不渲染 loading 动画
const receiving = ref(null)
const batchRecord = ref(null)
const displayItems = ref([])
const editForm = reactive({
  receiveBy: '',
  receiveDate: null,
  deliveryBy: '',
  deliveryDate: null
})

/**
 * 组件初始化时并行加载批记录信息与领料单详情
 */
onMounted(async () => {
  await loadData()
})

/**
 * 加载数据：并行获取批记录头信息和领料单业务数据
 */
async function loadData() {
  loading.value = true
  try {
    const [recordRes, receivingRes] = await Promise.all([
      getBatch_record(props.recordId),
      getBatchReceivingDetail(props.businessRecordId)
    ])

    batchRecord.value = recordRes.data || null
    receiving.value = receivingRes.data || null

    // 初始化物料明细，固定14行，不足补空
    const items = receiving.value?.itemList || []
    const rows = []
    for (let i = 0; i < 14; i++) {
      if (items[i]) {
        rows.push({ ...items[i] })
      } else {
        rows.push({
          materialName: '', spec: '', unit: '', requireQty: '',
          baozhuangFlag: null, biaoqianFlag: null, waiguanFlag: null,
          fangxingFlag: null, batchNumber: '', actualQty: '', remark: ''
        })
      }
    }
    displayItems.value = rows

    // 初始化签名行
    editForm.receiveBy = receiving.value?.receiveBy || ''
    editForm.receiveDate = receiving.value?.receiveDate || null
    editForm.deliveryBy = receiving.value?.deliveryBy || ''
    editForm.deliveryDate = receiving.value?.deliveryDate || null
  } catch (error) {
    ElMessage.error('加载领料单数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 保存前校验，返回 true/false
 */
function beforeSubmitCheck() {
  editForm.receiveBy = editForm.receiveBy?.replace(/\s/g, '') || ''
  editForm.deliveryBy = editForm.deliveryBy?.replace(/\s/g, '') || ''

  if (!editForm.receiveBy) { ElMessage.error('领料人不能为空'); return false }
  if (!editForm.deliveryBy) { ElMessage.error('发料人不能为空'); return false }
  if (!editForm.receiveDate) { ElMessage.error('领料日期不能为空'); return false }
  if (!editForm.deliveryDate) { ElMessage.error('发料日期不能为空'); return false }

  const numberPattern = /^\d+(\.\d+)?$/
  let foundEmpty = false
  let hasItem = false

  for (let i = 0; i < displayItems.value.length; i++) {
    const item = displayItems.value[i]
    const rowNum = i + 1
    const isEmpty = !item.materialName && !item.spec && !item.unit &&
                    !item.requireQty && !item.baozhuangFlag && !item.biaoqianFlag &&
                    !item.waiguanFlag && !item.fangxingFlag && !item.batchNumber &&
                    !item.actualQty && !item.remark

    if (isEmpty) {
      foundEmpty = true
      continue
    }

    hasItem = true
    if (foundEmpty) {
      ElMessage.error(`第${rowNum}行之前存在空行，请连续填写`)
      return false
    }
    if (!item.materialName) { ElMessage.error(`第${rowNum}行物料名称不能为空`); return false }
    if (!item.requireQty || !numberPattern.test(String(item.requireQty).trim()) || Number(item.requireQty) <= 0) {
      ElMessage.error(`第${rowNum}行计划领用量必须为正数`); return false
    }
    if (!item.batchNumber) { ElMessage.error(`第${rowNum}行物料批号不能为空`); return false }
    if (!item.actualQty || !numberPattern.test(String(item.actualQty).trim()) || Number(item.actualQty) <= 0) {
      ElMessage.error(`第${rowNum}行实际发料量必须为正数`); return false
    }
  }

  if (!hasItem) { ElMessage.error('请至少填写一条物料明细'); return false }
  return true
}

/**
 * 保存编辑
 */
async function handleSubmit() {
  if (!beforeSubmitCheck()) return

  const payload = {
    receivingId: props.businessRecordId,
    receiveBy: editForm.receiveBy,
    receiveDate: editForm.receiveDate,
    deliveryBy: editForm.deliveryBy,
    deliveryDate: editForm.deliveryDate,
    itemList: displayItems.value.filter(item =>
      item.materialName || item.spec || item.unit || item.batchNumber || item.remark
    )
  }

  try {
    await updateBatchReceiving(props.businessRecordId, payload)
    ElMessage.success('保存成功')
    emit('closed')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}
</script>

<style scoped>
.receiving-edit-container {
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
.mid-table :deep(.el-checkbox) { margin-left: 0px; margin-right: 8px; }
.mid-table :deep(.el-checkbox__label) { display: none; }
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner) { background-color: #409eff; border-color: #409eff; }
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner::after) { border-color: #fff; }
.view-container :deep(.el-checkbox__inner) { border-radius: 2px; }
</style>