<template>
  <div class="filling-record-2-form-container" :class="{ 'is-a4-mode': useA4Preview }">
    <!-- 顶部操作按钮 -->
    <div v-if="isEditMode || isApproveMode || isAddPageMode || dialogCtx" class="form-action-bar">
      <el-button v-if="dialogCtx" @click="dialogCtx.toggleFullscreen()">
        {{ dialogCtx.isFullscreen.value ? '取消全屏' : '全屏' }}
      </el-button>
      <el-button v-if="isAddPageMode" type="primary" @click="handleAddPage">加 页</el-button>
      <el-button v-if="isEditMode" type="primary" @click="handleEditSubmit">保 存</el-button>
      <el-button v-if="isApproveMode" type="primary" @click="handleApproveSubmit">
        {{ buttonLabel || '确认' }}
      </el-button>
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
      <!-- 公司名称 + 编号 -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SOP-S-G-004)-02</span>
      </div>

      <!-- 标题 -->
      <div style="text-align: center; margin-bottom: 4px; font-size: 15px;">
        灌装量记录
      </div>

      <!-- ===== 产品信息表（第一行） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col>
          <col style="width: 50px;">
          <col style="width: 70px;">
          <col style="width: 140px;">
          <col style="width: 150px;">
          <col style="width: 100px;">
          <col style="width: 150px;">
        </colgroup>
        <tr>
          <td class="info-label">产品名称</td>
          <td class="info-value">{{ batchRecord?.productName || '' }}</td>
          <td class="info-label">规格</td>
          <td class="info-value">{{ batchRecord?.spec || '' }}</td>
          <td class="info-label">批号及限制使用日期</td>
          <td class="info-value">
            <span class="filled-value">{{ batchNumberWithExp }}</span>
          </td>
          <td class="info-label">生产起止时间</td>
          <td class="info-value">
            <!-- 编辑态：datetimerange 组件 -->
            <el-date-picker
              v-if="isEditMode"
              v-model="dateTimeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              size="small"
              style="width: 100%;"
            />
            <!-- 非编辑态：显示文本 -->
            <span v-else class="filled-value">
              <!-- {{ startTimeText }}
              <template v-if="startTimeText && endTimeText"> - </template>
              {{ endTimeText }} -->
              {{ startEndTimeText }}
            </span>
          </td>
        </tr>
      </table>

      <!-- ===== 主表格：灌装量记录 ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col >
          <col v-for="n in 12" :key="'col-' + n" style="width: 55px;">
          <col style="width: 150px;">
        </colgroup>

        <!-- ===== 表头第 1 行 ===== -->
        <tr>
          <td rowspan="2" class="header-value">检测时间</td>
          <td rowspan="2" class="header-value">样品</td>
          <td colspan="12" class="header-value">灌装头数及对应装量(g)</td>
          <!-- 签名列：rowspan = 表头2行 + 表体4组×7行 = 30 -->
          <td rowspan="30" class="td-sign">
            <div>操作人：{{ submitSignatureName }}</div>
            <div v-if="submitSignatureTime" style="color: gray; font-size: 12px;">{{ submitSignatureTime }}</div>
            <div style="height: 12px;"></div>
            <div>复核人：{{ reviewSignatureName }}</div>
            <div v-if="reviewSignatureTime" style="color: gray; font-size: 12px;">{{ reviewSignatureTime }}</div>
            <div style="height: 12px;"></div>
            <div>检查人：{{ inspectSignatureName }}</div>
            <div v-if="inspectSignatureTime" style="color: gray; font-size: 12px;">{{ inspectSignatureTime }}</div>
          </td>
        </tr>
        <!-- ===== 表头第 2 行：1~12 号灌装头编号 ===== -->
        <tr>
          <td v-for="n in 12" :key="'th-' + n" class="header-value">{{ n }}</td>
        </tr>

        <!-- ===== 表体：4 组（每组 7 行） ===== -->
        <template v-for="(main, mainIdx) in record.mainList" :key="'main-' + mainIdx">
          <!-- 第 1~6 行：样品 1~6 的重量 -->
          <tr v-for="sampleIdx in 6" :key="'row-' + mainIdx + '-' + sampleIdx" style="height: 20px;">
            <!-- 检测时间（仅第 1 行渲染，rowspan=7） -->
            <td
              v-if="sampleIdx === 1"
              :rowspan="7"
              class="td-record-cell"
              style="text-align: center; vertical-align: middle; padding: 2px;"
            >
              <el-time-picker
                v-if="isEditMode"
                v-model="main.sampleTime"
                format="HH:mm"
                value-format="HH:mm:00"
                placeholder="检测时间"
                size="small"
                style="width: 100%;"
              />
              <!-- 非编辑态：截取 HH:mm -->
              <span v-else class="filled-value">{{ main.sampleTime ? main.sampleTime.substring(0, 5) : '' }}</span>
            </td>
            <!-- 样品序号 -->
            <td class="td-record-cell td-record-center">{{ sampleIdx }}</td>
            <!-- 12 个灌装头的重量 -->
            <td
              v-for="(sub, subIdx) in main.subList"
              :key="'w-' + mainIdx + '-' + sampleIdx + '-' + subIdx"
              class="td-record-cell td-record-center"
              style="padding: 1px;"
            >
              <input
                v-if="isEditMode"
                v-model="sub['weight' + sampleIdx]"
                class="weight-input"
                type="number"
              />
              <span v-else class="filled-value">{{ sub['weight' + sampleIdx] ?? '' }}</span>
            </td>
          </tr>

          <!-- 第 7 行：外观结果 -->
          <tr style="height: 20px;">
            <td class="td-record-cell td-record-center">外观结果</td>
            <td
              v-for="(sub, subIdx) in main.subList"
              :key="'a-' + mainIdx + '-' + subIdx"
              class="td-record-cell td-record-center"
              style="padding: 1px;"
            >
              <el-select
                v-if="isEditMode"
                v-model="sub.appearance"
                size="small"
                style="width: 100%;"
                clearable
              >
                <el-option label="√" value="√" />
                <el-option label="×" value="×" />
              </el-select>
              <span v-else class="filled-value">{{ sub.appearance || '' }}</span>
            </td>
          </tr>
        </template>
      </table>
    </div>

    <!-- ===== 加页对话框 ===== -->
    <el-dialog v-model="addDialogVisible" title="添加日期" width="400px" append-to-body>
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="addForm.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBizFillingRecord2Detail } from '@/api/bizdata/biz_filling_record_2'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'FillingRecord2Form' })

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

const dialogCtx = inject('dynamicDialogCtx', null)

// ==================== 三态判断 ====================
const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isAddPageMode = computed(() => props.actionType === 'ADD_PAGE')
const isApproveMode = computed(() =>
  !isEditMode.value && !isPreviewMode.value && !isAddPageMode.value
)

// ==================== 基础状态 ====================
const loading = ref(false)
const batchRecord = ref(null)
const fNodes = ref([])

/** 主表 + 子表 + 孙表 */
const record = reactive({
  recordId: null,
  orderId: null,
  orderNum: '',
  workshop: 'F',
  recordDate: null,
  limitUseDate: null,
  startTime: null,
  endTime: null,
  remark: '',
  mainList: []
})

// ==================== 加页状态 ====================
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = reactive({ date: '' })
const addRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

// ==================== 滚动条显隐 ====================
const isScrolling = ref(false)
let scrollHideTimer = null
function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) clearTimeout(scrollHideTimer)
  scrollHideTimer = setTimeout(() => { isScrolling.value = false }, 800)
}

// ==================== 表头组合显示 ====================
/** 批号及限制使用日期：`{批号} EXP:{YYYYMMDD}` */
const batchNumberWithExp = computed(() => {
  const batchNumber = batchRecord.value?.batchNumber || ''
  if (!batchNumber) return ''
  if (!record.limitUseDate) return batchNumber
  const expDate = parseTime(record.limitUseDate, '{y}{m}{d}')
  return `${batchNumber} EXP:${expDate}`
})

/** 生产起止时间文本（非编辑态）：严格按 YY-MM-DD HH:mm - HH:mm 显示，不考虑跨天 */
const startEndTimeText = computed(() => {
  if (!record.startTime || !record.endTime) return ''
  const s = parseTime(record.startTime, '{y}-{m}-{d} {h}:{i}')
  const e = parseTime(record.endTime, '{y}-{m}-{d} {h}:{i}')
  if (!s || !e) return ''
  
  // s 格式例如：2026-10-18 12:00
  const sShort = s.substring(2) // 截取：26-10-18 12:00
  const eTime = e.substring(11) // 截取：12:15
  return `${sShort} - ${eTime}`
})

/** datetimerange 双向绑定：将 startTime / endTime 拼成数组 */
const dateTimeRange = computed({
  get: () => {
    return record.startTime && record.endTime
      ? [record.startTime, record.endTime]
      : null
  },
  set: (val) => {
    if (val && val.length === 2) {
      record.startTime = val[0]
      record.endTime = val[1]
    } else {
      record.startTime = null
      record.endTime = null
    }
  }
})

// ==================== 签名行 ====================
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

// ==================== 子表 / 孙表空行 ====================
function createEmptyMain(seq) {
  return {
    mainId: null,
    recordId: null,
    sampleSeq: seq,
    sampleTime: null,
    subList: []
  }
}

function createEmptySub(nozzleNo) {
  return {
    subId: null,
    mainId: null,
    nozzleNo: nozzleNo,
    weight1: '',
    weight2: '',
    weight3: '',
    weight4: '',
    weight5: '',
    weight6: '',
    appearance: ''
  }
}

/**
 * 保证 mainList 恰好 4 行，每行 subList 恰好 12 行，并按 nozzleNo 排序
 * 说明：正常情况下后端已预置，这里仅作容错（防止极端情况空数据导致渲染异常）。
 * 若触发补齐，后续保存时因 mainId/subId 为空，会被后端严格校验拒绝，
 * 从而把"数据异常"暴露给用户，而不是静默插入。
 */
function ensureMainList(mainList) {
  const list = Array.isArray(mainList) ? mainList : []
  while (list.length < 4) {
    list.push(createEmptyMain(list.length + 1))
  }
  list.forEach((main, idx) => {
    main.sampleSeq = main.sampleSeq || idx + 1
    if (!Array.isArray(main.subList)) main.subList = []
    while (main.subList.length < 12) {
      main.subList.push(createEmptySub(main.subList.length + 1))
    }
    // 按灌装头编号排序，保证渲染列与 nozzleNo 一致
    main.subList.sort((a, b) => (a.nozzleNo || 0) - (b.nozzleNo || 0))
  })
  return list
}

// ==================== 数据加载 ====================
onMounted(async () => {
  await loadFNodes()
  if (isPreviewMode.value && !props.businessRecordId) {
    initEmptyTemplate()
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

function initEmptyTemplate() {
  record.mainList = ensureMainList([])
}

async function loadData() {
  loading.value = true
  try {
    const detailPromise = getBizFillingRecord2Detail(props.businessRecordId)
    const recordPromise = props.recordId
      ? getBatch_record(props.recordId)
      : Promise.resolve({ data: null })
    const [detailRes, recordRes] = await Promise.all([detailPromise, recordPromise])

    batchRecord.value = recordRes.data || null
    const data = detailRes.data || {}
    Object.assign(record, data)
    record.mainList = ensureMainList(record.mainList)
  } catch (error) {
    ElMessage.error('加载灌装生产记录2数据失败')
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
  // 简单前端校验：start_time / end_time 要么同时填，要么同时空
  if ((record.startTime && !record.endTime) || (!record.startTime && record.endTime)) {
    ElMessage.error('生产起止时间需同时填写或同时为空')
    return
  }

  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
  } catch (error) {
    return
  }

  // 组装 payload：mainList 直接传，subList 也一起
  const payload = {
    recordId: record.recordId,
    orderId: record.orderId,
    orderNum: record.orderNum,
    workshop: record.workshop,
    recordDate: record.recordDate,
    limitUseDate: record.limitUseDate,
    startTime: record.startTime,
    endTime: record.endTime,
    remark: record.remark,
    mainList: record.mainList
  }

  try {
    const routeTemplate = props.backendRoute ||
      '/bizdata/biz_filling_record_2/edit/{businessRecordId}?menuId={menuId}'
    await dynamicRequest(routeTemplate, {
      businessRecordId: props.businessRecordId,
      menuId: props.menuId
    }, payload, 'post')
    ElMessage.success('保存成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error(error?.message || '保存失败')
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
    } catch (error) {
      return
    }
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
    } catch (error) {
      return
    }
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

// ==================== 加页 ====================
function handleAddPage() {
  addForm.date = new Date().toISOString().slice(0, 10)
  addDialogVisible.value = true
}

async function handleAddSubmit() {
  if (!addFormRef.value) return
  addFormRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      const routeTemplate = props.backendRoute || '/batch/batch_record/addPage/{cMenuId}'
      await dynamicRequest(routeTemplate, { cMenuId: props.cMenuId }, { instanceDate: addForm.date })
      ElMessage.success('操作成功')
      addDialogVisible.value = false
      emit('refresh')
      emit('closed')
    } catch (error) {
      ElMessage.error(error?.message || '加页失败')
    }
  })
}
</script>

<style scoped>
/* ===== 根容器（flex 自适应 + 双模式） ===== */
.filling-record-2-form-container {
  padding: 4px 8px 8px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.filling-record-2-form-container.is-a4-mode {
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

/* ===== 滚动容器 ===== */
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

/* ===== 动态回填值突出显示 ===== */
.filled-value {
  color: #4046ff;
}

/* ===== 表格通用 ===== */
.row-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  table-layout: fixed;
  margin-bottom: -1px;
}
.info-table td,
.header-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 0px;
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
.td-record-cell {
  vertical-align: middle !important;
  text-align: left;
  padding: 4px 6px;
  font-size: 13px;
}
.td-record-center {
  text-align: center;
}
.td-sign {
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 6px !important;
}

/* ===== 重量输入框（严格 40px） ===== */
.weight-input {
  width: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 1px;
  font-size: 13px;
  text-align: center;
  box-sizing: border-box;
  -moz-appearance: textfield;
}
.weight-input::-webkit-outer-spin-button,
.weight-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.weight-input:focus {
  background-color: #e6f7ff;
  outline: none;
}

/* ===== 滚动条：滚动显示，停止 800ms 后隐藏 ===== */
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
</style>