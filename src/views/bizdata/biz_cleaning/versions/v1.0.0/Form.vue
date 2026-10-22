<template>
  <div class="cleaning-form-container" :class="{ 'is-a4-mode': useA4Preview }">
    <!-- 顶部操作按钮（flex 居中 + 全屏按钮最前） -->
    <div v-if="isEditMode || isApproveMode || dialogCtx" class="form-action-bar">
      <el-button
        v-if="dialogCtx"
        @click="dialogCtx.toggleFullscreen()"
      >{{ dialogCtx.isFullscreen.value ? '取消全屏' : '全屏' }}</el-button>
      <el-button v-if="isEditMode" type="primary" @click="handleEditSubmit">保 存</el-button>
      <el-button v-if="isApproveMode" type="primary" @click="handleApproveSubmit">{{ buttonLabel || '确认' }}</el-button>
    </div>

    <div
      v-if="actionType !== 'PREVIEW' || !loading"
      class="view-container"
      :class="[
        actionType === 'PREVIEW' && useA4Preview ? 'preview-mode-a4' : 'preview-mode-flex',
        isScrolling ? 'is-scrolling' : ''
      ]"
      @scroll="handlePreviewScroll"
    >
      <!-- ===== 公司名称 + 编号 ===== -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SMP-S-08)-01</span>
      </div>

      <!-- ===== 标题：清场记录 + 车间复选框（选中高亮） ===== -->
      <div class="cleaning-title-bar">
        <span>清场记录（</span>
        <el-checkbox :model-value="record.workshop === 'D'" disabled>消毒</el-checkbox>
        <el-checkbox :model-value="record.workshop === 'F'" disabled>灌装</el-checkbox>
        <el-checkbox :model-value="record.workshop === 'P'" disabled>外包</el-checkbox>
        <el-checkbox :model-value="record.workshop === 'G'" disabled>组套</el-checkbox>
        <span>）</span>
      </div>

      <!-- ===== 产品信息（只读，不突出） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 110px;">
          <col>
          <col style="width: 80px;">
          <col style="width: 110px;">
          <col style="width: 120px;">
          <col style="width: 160px;">
        </colgroup>
        <tr>
          <td class="info-label">产品名称</td>
          <td class="info-value">{{ batchRecord?.productName || '' }}</td>
          <td class="info-label">规格</td>
          <td class="info-value">{{ batchRecord?.spec || '' }}</td>
          <td class="info-label">产品批号</td>
          <td class="info-value">{{ batchRecord?.batchNumber || '' }}</td>
        </tr>
      </table>

      <!-- ===== 清场日期（编辑态可编辑） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 110px;">
          <col>
        </colgroup>
        <tr>
          <td class="info-label">清场日期</td>
          <td class="info-value">
            <template v-if="isEditMode">
              <el-date-picker
                v-model="record.cleaningDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择清场日期"
                size="small"
                style="width: 180px;"
              />
            </template>
            <template v-else>
              <span class="filled-value">{{ record.cleaningDate || '' }}</span>
            </template>
          </td>
        </tr>
      </table>

      <!-- ===== 表头 ===== -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 170px;">
          <col>
          <col style="width: 120px;">
          <col style="width: 160px;">
        </colgroup>
        <tr>
          <td class="header-value">清场项目</td>
          <td class="header-value">清场要求</td>
          <td class="header-value">操作记录</td>
          <td class="header-value" style="border-bottom-color: #fff;"></td>
        </tr>
      </table>

      <!-- ===== 12 项清场检查（7 类，含 rowspan 合并） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 170px;">
          <col>
          <col style="width: 120px;">
          <col style="width: 160px;">
        </colgroup>

        <!-- 1. 更换状态标识 -->
        <tr style="height: 32px;">
          <td class="td-step-label">更换状态标识</td>
          <td class="td-require">更换设备状态标识</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.statusLabelReplaceFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.statusLabelReplaceFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
          <!-- 签名列：跨 12 行数据 -->
          <td class="td-sign" :rowspan="12" style="border-top-color: #fff;">
            <div>操作人：{{ submitSignatureName }}</div>
            <div v-if="submitSignatureTime">{{ submitSignatureTime }}</div>
            <div style="height: 16px;"></div>
            <div>复核人：{{ reviewSignatureName }}</div>
            <div v-if="reviewSignatureTime">{{ reviewSignatureTime }}</div>
            <div style="height: 16px;"></div>
            <div>检查人：{{ inspectSignatureName }}</div>
            <div v-if="inspectSignatureTime">{{ inspectSignatureTime }}</div>
          </td>
        </tr>

        <!-- 2-4. 物料清除 -->
        <tr style="height: 32px;">
          <td class="td-step-label" rowspan="3">物料清除</td>
          <td class="td-require">移出工序产品</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.materialRemoveProductFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.materialRemoveProductFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>
        <tr style="height: 32px;">
          <td class="td-require">移出剩余物料及不合格物料</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.materialRemoveResidualFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.materialRemoveResidualFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>
        <tr style="height: 32px;">
          <td class="td-require">无本批残留物</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.materialRemoveBatchResidueFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.materialRemoveBatchResidueFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 5-6. 场所清洁 -->
        <tr style="height: 32px;">
          <td class="td-step-label" rowspan="2">场所清洁</td>
          <td class="td-require">地面无积水、无粉尘、无污物</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.siteCleanFloorFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.siteCleanFloorFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>
        <tr style="height: 32px;">
          <td class="td-require">门窗、内墙、顶棚、灯具、管道、线路等清洁干净</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.siteCleanStructureFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.siteCleanStructureFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 7-8. 设备清洁 -->
        <tr style="height: 32px;">
          <td class="td-step-label" rowspan="2">设备清洁</td>
          <td class="td-require">无粉尘、无油污</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.equipCleanDustOilFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.equipCleanDustOilFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>
        <tr style="height: 32px;">
          <td class="td-require">设备见本色、光亮、洁净</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.equipCleanOriginalColorFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.equipCleanOriginalColorFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 9. 工器具清洁 -->
        <tr style="height: 32px;">
          <td class="td-step-label">工器具清洁</td>
          <td class="td-require">无粉尘、无污物，洁净见本色</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.toolCleanDustDirtFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.toolCleanDustDirtFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 10-11. 设施清洁 -->
        <tr style="height: 32px;">
          <td class="td-step-label" rowspan="2">设施清洁</td>
          <td class="td-require">无粉尘、无污物、干净见本色</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.facilityCleanDustDirtFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.facilityCleanDustDirtFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>
        <tr style="height: 32px;">
          <td class="td-require">摆放整齐</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.facilityCleanArrangementFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.facilityCleanArrangementFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 12. 其它 -->
        <tr style="height: 32px;">
          <td class="td-step-label">其 它</td>
          <td class="td-require">洁 净</td>
          <td class="td-record">
            <div class="checkbox-pair">
              <el-checkbox v-model="record.otherCleanStatusFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
              <el-checkbox v-model="record.otherCleanStatusFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBizCleaningDetail } from '@/api/bizdata/biz_cleaning'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'BizCleaningForm' })

const props = defineProps({
  actionType: { type: String, default: 'PREVIEW' },
  recordId: { type: Number, default: null },
  menuId: { type: Number, default: null },
  businessRecordId: { type: Number, default: null },
  cMenuId: { type: Number, default: null },
  operationCode: { type: String, default: '' },
  backendRoute: { type: String, default: '' },
  tableName: { type: String, default: '' },
  menuName: { type: String, default: '' },
  buttonLabel: { type: String, default: '确认' },
  useA4Preview: { type: Boolean, default: false }
})

const emit = defineEmits(['closed', 'refresh'])

/**
 * 【v1.6 新增】获取父对话框提供的全屏上下文
 *
 * 父组件 DynamicComponentDialog 通过 provide 暴露：
 *   - isFullscreen：ref，当前全屏状态（需 .value 访问）
 *   - toggleFullscreen：函数，切换全屏
 *
 * 如果本组件不在对话框内（如独立打印场景），inject 返回 null，
 * 上方按钮区 v-if 判断会降级，不渲染全屏按钮。
 */
const dialogCtx = inject('dynamicDialogCtx', null)

const loading = ref(false)
const batchRecord = ref(null)
const fNodes = ref([])

/** 主表业务字段（12 个 Y/N 检查项） */
const record = reactive({
  cleaningId: null,
  orderId: null, orderNum: '', workshop: '',
  cleaningDate: null,
  statusLabelReplaceFlag: '',
  materialRemoveProductFlag: '',
  materialRemoveResidualFlag: '',
  materialRemoveBatchResidueFlag: '',
  siteCleanFloorFlag: '',
  siteCleanStructureFlag: '',
  equipCleanDustOilFlag: '',
  equipCleanOriginalColorFlag: '',
  toolCleanDustDirtFlag: '',
  facilityCleanDustDirtFlag: '',
  facilityCleanArrangementFlag: '',
  otherCleanStatusFlag: ''
})

const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isApproveMode = computed(() => !isEditMode.value && !isPreviewMode.value)

// ==================== 滚动条显隐控制 ====================
const isScrolling = ref(false)
let scrollHideTimer = null

function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) clearTimeout(scrollHideTimer)
  scrollHideTimer = setTimeout(() => { isScrolling.value = false }, 800)
}

// ==================== 签名行（从 batch_record_menu 回显） ====================
const submitNode = computed(() =>
  fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'SUBMIT' && btn.operatorTime)
)
const reviewNode = computed(() =>
  fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'REVIEW' && btn.operatorTime)
)
const inspectNode = computed(() =>
  fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'INSPECT' && btn.operatorTime)
)

const submitSignatureName = computed(() => submitNode.value?.operator || '')
const submitSignatureTime = computed(() =>
  submitNode.value?.operatorTime ? parseTime(submitNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : ''
)
const reviewSignatureName = computed(() => reviewNode.value?.operator || '')
const reviewSignatureTime = computed(() =>
  reviewNode.value?.operatorTime ? parseTime(reviewNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : ''
)
const inspectSignatureName = computed(() => inspectNode.value?.operator || '')
const inspectSignatureTime = computed(() =>
  inspectNode.value?.operatorTime ? parseTime(inspectNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : ''
)

// ==================== 数据加载 ====================
onMounted(async () => {
  await loadFNodes()
  if (isPreviewMode.value && !props.businessRecordId) {
    // 预览态不调后端，展示空模板
  } else {
    await loadData()
  }
})

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

async function loadData() {
  loading.value = true
  try {
    const detailPromise = getBizCleaningDetail(props.businessRecordId)
    const recordPromise = props.recordId
      ? getBatch_record(props.recordId)
      : Promise.resolve({ data: null })
    const [detailRes, recordRes] = await Promise.all([detailPromise, recordPromise])

    batchRecord.value = recordRes.data || null
    const data = detailRes.data || {}
    Object.assign(record, data)
  } catch (error) {
    ElMessage.error('加载清场记录数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 通用动态请求 ====================
async function dynamicRequest(routeTemplate, pathParams, data = {}, method = 'post') {
  let url = routeTemplate
  Object.keys(pathParams).forEach(key => {
    const value = (pathParams[key] !== undefined && pathParams[key] !== null)
      ? encodeURIComponent(pathParams[key])
      : ''
    url = url.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  })
  url = url.replace(/[?&][^=]*=\{[^}]*\}/g, '')
  url = url.replace(/[?&]$/, '')

  return request({ url, method, data })
}

// ==================== 编辑保存 ====================
async function handleEditSubmit() {
  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
  } catch (error) { return }

  const payload = { ...record }
  try {
    const routeTemplate = props.backendRoute ||
      '/bizdata/biz_cleaning/edit/{businessRecordId}?menuId={menuId}'
    const urlParams = {
      businessRecordId: props.businessRecordId,
      menuId: props.menuId
    }
    // 兼容后端路径参数为 {cleaningId} 的场景
    if (routeTemplate.includes('{cleaningId}')) {
      urlParams.cleaningId = props.businessRecordId
    }
    await dynamicRequest(routeTemplate, urlParams, payload, 'post')
    ElMessage.success('保存成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// ==================== 审批提交 ====================
async function handleApproveSubmit() {
  let remark = ''

  if (props.actionType && props.actionType.toUpperCase().startsWith('CANCEL_')) {
    try {
      const { value } = await ElMessageBox.prompt('请输入取消原因', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消',
        inputValidator: (val) => val && val.trim() ? true : '原因不能为空'
      })
      remark = value.trim()
    } catch (error) { return }
  } else {
    try {
      const { value } = await ElMessageBox.prompt(
        `确认执行「${props.menuName || props.buttonLabel}」操作吗？可输入审批意见`,
        '提示',
        {
          confirmButtonText: '确定', cancelButtonText: '取消',
          inputValue: '', inputPlaceholder: '审批意见（可选）'
        }
      )
      remark = value ? value.trim() : ''
    } catch (error) { return }
  }

  try {
    const routeTemplate = props.backendRoute ||
      '/batch/batch_record_menu/approve/{menuId}?remark={remark}'
    await dynamicRequest(routeTemplate, { menuId: props.menuId, remark })
    ElMessage.success('操作成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
/* ============================================================
   容器
   ============================================================ */
.cleaning-form-container {
  padding: 4px 8px 8px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.cleaning-form-container.is-a4-mode {
  height: auto;
  display: block;
}

.form-action-bar {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

/* ============================================================
   滚动容器（双模式）
   ============================================================ */
.view-container {
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  color: #000;
}
.preview-mode-flex {
  flex: 1;
  min-height: 0;
}
.preview-mode-a4 {
  height: 201mm;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ============================================================
   动态回填值突出显示
   ============================================================ */
.filled-value {
  color: #4046ff;
}

/* ============================================================
   表格通用样式
   ============================================================ */
.row-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  table-layout: fixed;
  margin-bottom: -1px;
}

.step-table-native {
  border-top: none;
  border-bottom: none;
}

.info-table td, .header-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: middle;
  box-sizing: border-box;
}
.info-label {
  font-weight: bold;
  font-size: 14px;
  background: #f5f7fa;
  text-align: center;
}
.info-value {
  font-size: 14px;
  text-align: center;
}
.header-value {
  font-weight: normal;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
}

.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 1px 1px;
  vertical-align: top;
  box-sizing: border-box;
}

.td-step-label {
  font-weight: normal;
  text-align: center;
  vertical-align: middle !important;
  font-size: 14px;
}
.td-require {
  font-size: 14px;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 8px;
}
.td-record {
  font-size: 13px;
  text-align: center;
  vertical-align: middle !important;
  padding: 4px 8px;
}
.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 6px !important;
}

/* ============================================================
   el-checkbox 紧凑样式
   ============================================================ */
.view-container :deep(.el-checkbox) {
  height: auto;
  margin-right: 8px;
  font-size: 13px;
}
.view-container :deep(.el-checkbox__label) {
  font-size: 13px;
  padding-left: 4px;
}

/* ============================================================
   滚动条：滚动显示，停止 800ms 后隐藏
   ============================================================ */
.view-container::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.view-container::-webkit-scrollbar-track {
  background: transparent;
}
.view-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
  transition: background 0.25s ease;
}
.view-container.is-scrolling::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.5);
}
.view-container.is-scrolling::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.8);
}
.view-container {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.view-container.is-scrolling {
  scrollbar-color: rgba(144, 147, 153, 0.5) transparent;
}

/* ============================================================
   标题区（清场记录 + 车间复选框）
   ============================================================ */
.cleaning-title-bar {
  text-align: center;
  margin-bottom: 4px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ============================================================
   复选框对（互斥 Y/N 双 checkbox，与领料单一致）
   ============================================================ */
.checkbox-pair {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.checkbox-pair :deep(.el-checkbox) {
  margin-right: 0;
}

/* ============================================================
   复选框选中高亮（覆盖 Element Plus disabled 状态的默认灰色）
   - 应用于：标题车间复选框 + 12 项 Y/N 复选框
   - 与领料单完全一致
   ============================================================ */
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}
.view-container :deep(.el-checkbox__inner) {
  border-radius: 2px;
}
.view-container :deep(.el-checkbox__label) {
  color: #000 !important;
}
</style>