<template>
  <div class="receiving-form-container">
    <div
      v-if="actionType !== 'PREVIEW' || !loading"
      class="view-container"
      :class="actionType === 'PREVIEW' ? 'preview-mode' : ''"
    >
      <!-- 公司名称 + 编号 -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 0px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SOP-S-G-001)-01</span>
      </div>

      <!-- 物料类别 -->
      <div style="text-align: center; margin-top: 4px; margin-bottom: -6px; display: flex; justify-content: center; align-items: center;">
        <span style="font-weight: bold;">（</span>
        <el-checkbox :model-value="receiving?.materialType === 'RAW_MATERIAL'" disabled>原料</el-checkbox>
        <el-checkbox :model-value="receiving?.materialType === 'SEMI_FINISHED_PRODUCT'" disabled>半成品</el-checkbox>
        <el-checkbox :model-value="receiving?.materialType === 'INTERMEDIATE_PRODUCT'" disabled>半制品</el-checkbox>
        <el-checkbox :model-value="receiving?.materialType === 'PACKAGING_MATERIAL'" disabled>包装材料</el-checkbox>
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

      <!-- 物料明细 -->
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
            <template v-if="isEditMode">
              <el-select v-model="scope.row.materialName" size="small" placeholder="请选择" clearable>
                <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
            <template v-else>{{ scope.row.materialName || '' }}</template>
          </template>
        </el-table-column>

        <el-table-column label="规格" width="90" align="center">
          <template #default="scope">
            <template v-if="isEditMode">
              <el-select v-model="scope.row.spec" size="small" placeholder="请选择" clearable>
                <el-option v-for="dict in receiving_spec" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
            <template v-else>{{ scope.row.spec || '' }}</template>
          </template>
        </el-table-column>

        <el-table-column label="单位" width="70" align="center">
          <template #default="scope">
            <template v-if="isEditMode">
              <el-select v-model="scope.row.unit" size="small" placeholder="请选择" clearable>
                <el-option v-for="dict in pro_unit" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
            <template v-else>{{ scope.row.unit || '' }}</template>
          </template>
        </el-table-column>

        <el-table-column width="70" align="center">
          <template #header><div style="line-height: 1.2;">计划<br/>领用量</div></template>
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.requireQty" size="small" /></template>
            <template v-else>{{ scope.row.requireQty || '' }}</template>
          </template>
        </el-table-column>

        <el-table-column label="物料核对" align="center">
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">包装<br/>是否完整</div></template>
            <template #default="scope">
              <template v-if="isEditMode">
                <span style="white-space: nowrap;">
                  是<el-checkbox v-model="scope.row.baozhuangFlag" true-value="Y" false-value="N" />
                  否<el-checkbox v-model="scope.row.baozhuangFlag" true-value="N" false-value="Y" />
                </span>
              </template>
              <template v-else>{{ scope.row.baozhuangFlag === 'Y' ? '是' : scope.row.baozhuangFlag === 'N' ? '否' : '' }}</template>
            </template>
          </el-table-column>
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">标签<br/>是否正确</div></template>
            <template #default="scope">
              <template v-if="isEditMode">
                <span style="white-space: nowrap;">
                  是<el-checkbox v-model="scope.row.biaoqianFlag" true-value="Y" false-value="N" />
                  否<el-checkbox v-model="scope.row.biaoqianFlag" true-value="N" false-value="Y" />
                </span>
              </template>
              <template v-else>{{ scope.row.biaoqianFlag === 'Y' ? '是' : scope.row.biaoqianFlag === 'N' ? '否' : '' }}</template>
            </template>
          </el-table-column>
          <el-table-column min-width="90" align="center">
            <template #header><div style="line-height: 1.2;">是否无<br/>发霉、无变质、无生<br/>虫、无变色等</div></template>
            <template #default="scope">
              <template v-if="isEditMode">
                <span style="white-space: nowrap;">
                  是<el-checkbox v-model="scope.row.waiguanFlag" true-value="Y" false-value="N" />
                  否<el-checkbox v-model="scope.row.waiguanFlag" true-value="N" false-value="Y" />
                </span>
              </template>
              <template v-else>{{ scope.row.waiguanFlag === 'Y' ? '是' : scope.row.waiguanFlag === 'N' ? '否' : '' }}</template>
            </template>
          </el-table-column>
          <el-table-column width="80" align="center">
            <template #header><div style="line-height: 1.2;">是否已放行</div></template>
            <template #default="scope">
              <template v-if="isEditMode">
                <span style="white-space: nowrap;">
                  是<el-checkbox v-model="scope.row.fangxingFlag" true-value="Y" false-value="N" />
                  否<el-checkbox v-model="scope.row.fangxingFlag" true-value="N" false-value="Y" />
                </span>
              </template>
              <template v-else>{{ scope.row.fangxingFlag === 'Y' ? '是' : scope.row.fangxingFlag === 'N' ? '否' : '' }}</template>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="物料批号" width="80" align="center">
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.batchNumber" size="small" /></template>
            <template v-else>{{ scope.row.batchNumber || '' }}</template>
          </template>
        </el-table-column>

        <el-table-column width="70" align="center">
          <template #header><div style="line-height: 1.2;">实际<br/>发料量</div></template>
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.actualQty" size="small" /></template>
            <template v-else>{{ scope.row.actualQty || '' }}</template>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="70" align="center">
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.remark" size="small" /></template>
            <template v-else>{{ scope.row.remark || '' }}</template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 签名行（只读，数据源来自 batch_record_menu 控制表） -->
      <el-table :data="[{}]" :show-header="false" border size="small" class="bottom-table">
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">领用人/日期：</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>{{ submitSignatureText }}</template>
        </el-table-column>
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">发料人/日期：</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>{{ reviewSignatureText }}</template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮 -->
      <div v-if="isEditMode" style="text-align: right; margin-top: 12px;">
        <el-button type="primary" @click="handleEditSubmit">保 存</el-button>
      </div>
      <div v-if="isApproveMode" style="text-align: right; margin-top: 12px;">
        <el-button type="primary" @click="handleApproveSubmit">{{ buttonLabel || '确认' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBizReceivingDetail, updateBizReceiving } from '@/api/bizdata/biz_receiving'
import { getBatch_record } from '@/api/batch/batch_record'
import { approveBatchRecordMenu, listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'ReceivingForm' })

/**
 * 组件 Props 定义
 * actionType: 操作类型（大写：PREVIEW/EDIT/SUBMIT等）
 * recordId: 批记录ID（必填）
 * menuId: 按钮节点ID（编辑/审批时必填）
 * businessRecordId: 业务记录ID（编辑/审批/查看真实数据时必填；预览空模板时可不传）
 * cMenuId: 当前表单对应的 C 节点 ID（用于获取签名行数据）
 * 其余为按钮节点相关信息
 */
const props = defineProps({
  actionType: { type: String, default: 'PREVIEW' },
  recordId: { type: Number, required: true },
  menuId: { type: Number, default: null },
  businessRecordId: { type: Number, default: null },
  cMenuId: { type: Number, default: null },
  operationCode: { type: String, default: '' },
  backendRoute: { type: String, default: '' },
  tableName: { type: String, default: '' },
  menuName: { type: String, default: '' },
  buttonLabel: { type: String, default: '确认' }
})

const emit = defineEmits(['closed', 'refresh'])

const { proxy } = getCurrentInstance()
const { receiving_material, receiving_spec, pro_unit } = proxy.useDict('receiving_material', 'receiving_spec', 'pro_unit')

const loading = ref(false)
const receiving = ref(null)
const batchRecord = ref(null)
const displayItems = ref([])
const fNodes = ref([])            // 当前 C 节点下所有 F 节点

const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isApproveMode = computed(() => !isEditMode.value && !isPreviewMode.value)

/**
 * 提交操作按钮节点（actionType=SUBMIT 且 operatorTime 非空）
 */
const submitNode = computed(() => {
  return fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'SUBMIT' && btn.operatorTime)
})

/**
 * 复核操作按钮节点（actionType=REVIEW 且 operatorTime 非空）
 */
const reviewNode = computed(() => {
  return fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'REVIEW' && btn.operatorTime)
})

/**
 * 提交签名行文本：操作人 / 日期
 */
const submitSignatureText = computed(() => {
  if (!submitNode.value) return ''
  const operator = submitNode.value.operator || ''
  const time = submitNode.value.operatorTime ? parseTime(submitNode.value.operatorTime, '{y}-{m}-{d}') : ''
  return `${operator} / ${time}`
})

/**
 * 复核签名行文本：操作人 / 日期
 */
const reviewSignatureText = computed(() => {
  if (!reviewNode.value) return ''
  const operator = reviewNode.value.operator || ''
  const time = reviewNode.value.operatorTime ? parseTime(reviewNode.value.operatorTime, '{y}-{m}-{d}') : ''
  return `${operator} / ${time}`
})

/**
 * 组件初始化：
 * - 加载 C 节点下 F 节点用于签名回显
 * - 预览模式且无业务记录ID：初始化空模板
 * - 预览模式且有业务记录ID：加载真实数据（只读查看）
 * - 编辑/审批模式：加载真实数据
 */
onMounted(async () => {
  await loadFNodes()
  if (isPreviewMode.value) {
    if (props.businessRecordId) {
      await loadData()
    } else {
      initEmptyItems()
    }
  } else {
    await loadData()
  }
})

/**
 * 加载当前 C 节点下的所有 F 节点（用于签名行数据）
 */
async function loadFNodes() {
  if (!props.cMenuId) return
  try {
    const res = await listBatchRecordMenuButtonsByCMenuId(props.cMenuId)
    fNodes.value = res.data || []
  } catch (error) {
    fNodes.value = []
    console.error('加载按钮节点失败', error)
  }
}

/**
 * 加载批记录信息与领料单详情
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

    const items = receiving.value?.itemList || []
    initItems(items)
  } catch (error) {
    ElMessage.error('加载领料单数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 初始化空物料明细（固定14行）
 */
function initEmptyItems() {
  const rows = []
  for (let i = 0; i < 14; i++) {
    rows.push({
      materialName: '', spec: '', unit: '', requireQty: '',
      baozhuangFlag: null, biaoqianFlag: null, waiguanFlag: null,
      fangxingFlag: null, batchNumber: '', actualQty: '', remark: ''
    })
  }
  displayItems.value = rows
}

/**
 * 根据已有数据初始化物料明细，不足14行补空
 */
function initItems(items) {
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
}

/**
 * 编辑提交前的校验（仅校验物料明细，不含签名）
 * @returns {Boolean} 校验是否通过
 */
function beforeSubmitCheck() {
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
    if (foundEmpty) { ElMessage.error(`第${rowNum}行之前存在空行，请连续填写`); return false }
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
 * 编辑模式：保存修改（带二次确认）
 * 
 * 先执行表单校验，校验通过后弹出二次确认框，用户确认后才提交保存请求。
 * 签名行数据不在此提交，由审批操作在控制表中维护。
 */
async function handleEditSubmit() {
  if (!beforeSubmitCheck()) return

  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  const payload = {
    receivingId: props.businessRecordId,
    itemList: displayItems.value.filter(item =>
      item.materialName || item.spec || item.unit || item.batchNumber || item.remark
    )
  }

  try {
    await updateBizReceiving(props.businessRecordId, props.menuId, payload)
    ElMessage.success('保存成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

/**
 * 审批模式：执行审批操作
 */
async function handleApproveSubmit() {
  try {
    await ElMessageBox.confirm(`确认执行「${props.menuName || props.buttonLabel}」操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await approveBatchRecordMenu(props.menuId, '')
    ElMessage.success('操作成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}
</script>

<style scoped>
.receiving-form-container {
  padding: 8px;
}
.view-container {
  overflow-x: hidden;
  overflow-y: auto;
  height: 75vh;
  box-sizing: border-box;
  color: #000;
}
/* 预览模式固定高度，用于生成批记录时展示 A4 样式 */
.preview-mode {
  height: 201mm;
  overflow: hidden;
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