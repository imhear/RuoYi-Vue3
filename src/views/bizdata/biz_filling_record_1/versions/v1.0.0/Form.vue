<template>
  <div class="filling-record-1-form-container" :class="{ 'is-a4-mode': useA4Preview }">
    <!-- 顶部操作按钮 -->
    <div v-if="isEditMode || isApproveMode || isAddPageMode || dialogCtx" class="form-action-bar">
      <el-button v-if="dialogCtx" @click="dialogCtx.toggleFullscreen()">
        {{ dialogCtx.isFullscreen.value ? '取消全屏' : '全屏' }}
      </el-button>
      <el-button v-if="isAddPageMode" type="primary" @click="handleAddPage">加 页</el-button>
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
      <!-- 公司名称 + 编号 -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-004)-01</span>
      </div>
      <div style="text-align: center; margin-bottom: 4px; font-size: 15px;">灌装生产记录</div>

      <!-- 产品信息（只读，不突出） -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 280px;">
          <col style="width: 80px;"><col>
          <col style="width: 180px;"><col style="width: 130px;">
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

      <!-- 起止时间 + 灌装首件确认 -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 480px;">
          <col><col style="width: 310px;">
        </colgroup>
        <tr style="height: 40px;">
          <td class="info-label">起止时间</td>
          <td class="info-value">
            <template v-if="isEditMode">
              <el-date-picker
                v-model="record.startTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始时间"
                size="small"
                style="width: 180px;"
              />
              <span style="margin: 0 6px;">至</span>
              <el-date-picker
                v-model="record.endTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
                size="small"
                style="width: 180px;"
              />
            </template>
            <template v-else>
              <span class="filled-value">
                {{ record.startTime ? parseTime(record.startTime, '{y}-{m}-{d} {h}:{i}') : '' }} - {{ record.endTime ? parseTime(record.endTime, '{y}-{m}-{d} {h}:{i}') : '' }}
              </span>
              <!-- <span class="filled-value">{{ formatDateTime(record.startTime) }}</span>
              <span v-if="record.startTime && record.endTime" style="margin: 0 6px;">-</span>
              <span class="filled-value">{{ formatDateTime(record.endTime) }}</span> -->
            </template>
          </td>
          <td class="info-label">灌装首件确认</td>
          <td style="text-align: left;">
            <div class="checkbox-pair" style="justify-content: flex-start;">
              <el-checkbox v-model="record.firstQualifiedFlag" true-value="Y" false-value="N" :disabled="!isEditMode">符合规定</el-checkbox>
              <el-checkbox v-model="record.firstQualifiedFlag" true-value="N" false-value="Y" :disabled="!isEditMode">不符合规定</el-checkbox>
                检查人：
                <span v-if="!isEditMode && inspectSignatureName" class="filled-value">{{ inspectSignatureName }}</span>
            </div>
          </td>
        </tr>
      </table>

      <!-- 表头 -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="header-value">操作项目</td>
          <td class="header-value">工艺要求</td>
          <td class="header-value">操作记录</td>
          <td class="header-value" style="border-bottom-color: #fff;"></td>
        </tr>
      </table>

      <!-- Step1 开工前检查 -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 130px;">
        </colgroup>
        <tr style="min-height: 120px;">
          <td class="td-step-label">1.开工前<br/>检查</td>
          <td class="td-require">
            1）操作间温度18～26℃相对湿度 45%～65%；<br/>
            2）该批次生产记录齐全；<br/>
            3）人员、环境卫生符合要求；<br/>
            4）操作间及设备已清洁；<br/>
            5）岗位操作规程、设备操作规程、灌包工艺规程齐全；<br/>
            6）物料准备齐全。
          </td>
          <td class="td-record" style="text-align: left;">
            <template v-if="isEditMode">
              温湿度：
              <input v-model="record.s1Temperature" class="edit-input-short" placeholder="温度" style="width: 40px;" /> ℃，
              <input v-model="record.s1Humidity" class="edit-input-short" placeholder="湿度" style="width: 40px;" /> %，
              检查是否合格：
              <span class="checkbox-pair" style="display: inline-flex; justify-content: flex-start; margin-left: 4px;">
                <el-checkbox v-model="record.s1QualifiedFlag" true-value="Y" false-value="N">是</el-checkbox>
                <el-checkbox v-model="record.s1QualifiedFlag" true-value="N" false-value="Y">否</el-checkbox>
              </span>
              <br/>
              不合格情况说明及处理方式：<br/>
              <textarea v-model="record.s1Remark" class="edit-textarea" rows="2" placeholder="请输入不合格情况说明"></textarea>
            </template>
            <template v-else>
              <div class="record-view-text">
                温湿度：<span class="filled-value">{{ record.s1Temperature ?? '' }}</span> ℃，
                <span class="filled-value">{{ record.s1Humidity ?? '' }}</span> %；
                检查是否合格：
                <span class="filled-value">{{ formatYesNo(record.s1QualifiedFlag) }}</span>
                <br/><br/>
                不合格情况说明及处理方式：<br/>
                <span class="filled-value">{{ record.s1Remark || '' }}</span>
              </div>
            </template>
          </td>
          <td class="td-sign" style="border-bottom: none;"></td>
        </tr>
      </table>

      <!-- Step2 设备、容器、工具处理 -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 130px;">
        </colgroup>
        <tr style="min-height: 120px;">
          <td class="td-step-label">2.设备、容<br/>器、工具处<br/>理</td>
          <td class="td-require" style="line-height: 1.6;">
            检查主要生产设备、容器、工器具清洁消毒效期，在有<br/>
            效期内的使用前用纯化水清洗，超过清洁消毒效期的用<br/>
            纯化水清洁后，再用75%酒精或其他消毒液或CIP热水<br/>
            消毒。
          </td>
          <td class="td-record" style="text-align: left; line-height: 2.0;">
            <template v-if="isEditMode">
              <!-- 【改造】设备：下拉选名称 + 只读编码 -->
              <div class="device-row">
                <span class="device-row-label">1）主要设备名称/编码：</span>
                <el-select
                  v-model="record.deviceCode"
                  size="small"
                  placeholder="请选择设备"
                  class="device-select"
                  clearable
                  @change="handleDeviceChange">
                  <el-option
                    v-for="opt in deviceOptions"
                    :key="opt.code"
                    :label="opt.name"
                    :value="opt.code">
                    {{ opt.name }} {{ opt.code }}
                  </el-option>
                </el-select>
                <input v-model="record.deviceCode" readonly class="edit-input-device-code" placeholder="编码" />
              </div>
              <br/>
              2）检查是否在清洁消毒有效期内：<br/>
              <el-checkbox v-model="record.s2InCleanValidityFlag" true-value="Y" false-value="N">在清洁效期内:使用纯化水清洗</el-checkbox>
              <br/>
              <el-checkbox v-model="record.s2InCleanValidityFlag" true-value="N" false-value="Y">超过清洁效期:重新清洁消毒</el-checkbox>
              <br/>
              清洁方式：
              <!-- 【改造】清洁方式：pro_cleaning_method → biz_cleaning_method -->
              <el-select v-model="record.s2CleaningMethod" placeholder="请选择" size="small" style="width: 110px;" clearable>
                <el-option v-for="d in biz_cleaning_method" :key="d.value" :label="d.label" :value="d.value" />
              </el-select>
              消毒方式：
              <!-- 【改造】消毒方式：pro_desinfection_method → biz_disinfection_method -->
              <el-select v-model="record.s2DesinfectionMethod" placeholder="请选择" size="small" style="width: 110px;" clearable>
                <el-option v-for="d in biz_disinfection_method" :key="d.value" :label="d.label" :value="d.value" />
              </el-select>
            </template>
            <template v-else>
              <div class="record-view-text">
                1）主要设备名称/编码：
                <span class="filled-value">{{ record.deviceName || '' }}</span> /
                <span class="filled-value">{{ record.deviceCode || '' }}</span>
                <br/>
                2）检查是否在清洁消毒有效期内：
                <span class="filled-value">{{ formatInCleanValidity(record.s2InCleanValidityFlag) }}</span>
                <br/>
                清洁方式：<span class="filled-value">{{ record.s2CleaningMethod || '' }}</span>
                消毒方式：<span class="filled-value">{{ record.s2DesinfectionMethod || '' }}</span>
              </div>
            </template>
          </td>
          <td class="td-sign" style="border-top: none; border-bottom: none;"></td>
        </tr>
      </table>

      <!-- Step3 灌装（不含灌装量记录表格） -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 130px;">
        </colgroup>
        <tr style="min-height: 100px;">
          <td class="td-step-label">3.灌装</td>
          <td class="td-require" style="line-height: 2.0;">
            1）先用少量料液冲洗设备；<br/>
            2）装量调节:按照产品规格/净含量，设定装量，称量、<br/>
            微调校正至合格范围；<br/>
            3）检查每个灌装头对应外包半成品的装量和外观；<br/>
            4）有打码的产品，需按照生产指令，调整打印内容；<br/>
            5）开始灌装；<br/>
            6）随时检查装量和外观，每2小时记录一次。
          </td>
          <td class="td-record" style="text-align: left; line-height: 2.0;">
            <template v-if="isEditMode">
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="white-space: nowrap;">1) 是否用料液冲洗：</span>
                <span class="checkbox-pair" style="display: inline-flex; justify-content: flex-start;">
                  <el-checkbox v-model="record.s3UseMaterialLiquidRinseFlag" true-value="Y" false-value="N">是</el-checkbox>
                  <el-checkbox v-model="record.s3UseMaterialLiquidRinseFlag" true-value="N" false-value="Y">否</el-checkbox>
                </span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="white-space: nowrap;">2) 净含量范围：</span>
                <input v-model="record.s3NetContentRangeLower" class="edit-input-short" style="width: 60px;" placeholder="下限" />
                <span style="margin: 0 4px;">-</span>
                <input v-model="record.s3NetContentRangeUpper" class="edit-input-short" style="width: 60px;" placeholder="上限" />
                <input v-model="record.s3NetContentUnit" class="edit-input-short" style="width: 40px; margin-left: 4px;" placeholder="单位" />
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="white-space: nowrap; margin-right: 8px;">3) 打码方式：</span>
                <!-- 【改造】打码方式：printCodeTypeOptions → biz_print_code_type -->
                <el-radio-group v-model="record.s3PrintCodeType">
                  <el-radio v-for="opt in biz_print_code_type" :key="opt.value" :value="opt.value">{{ opt.label }}</el-radio>
                </el-radio-group>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="white-space: nowrap;">4) 打码信息：</span>
                <input v-model="record.s3CodingInfo" class="edit-input-short" style="width: 200px;" />
                <el-button link type="primary" size="small" @click="handleAutoFillCodingInfo">自动计算</el-button>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="white-space: nowrap;">5) 灌装量及外观检查见下页</span>
              </div>
            </template>
            <template v-else>
              <div class="record-view-text">
                1) 是否用料液冲洗：<span class="filled-value">{{ formatYesNo(record.s3UseMaterialLiquidRinseFlag) }}</span><br/>
                2) 净含量范围：<span class="filled-value">{{ record.s3NetContentRangeLower ?? '' }}</span> -
                <span class="filled-value">{{ record.s3NetContentRangeUpper ?? '' }}</span>
                <span class="filled-value">{{ record.s3NetContentUnit || 'g' }}</span><br/>
                3) 打码方式：<span class="filled-value">{{ formatPrintCodeType(record.s3PrintCodeType) }}</span><br/>
                4) 打码信息：<span class="filled-value">{{ record.s3CodingInfo || '' }}</span><br/>
                5) 灌装量及外观检查见下页
              </div>
            </template>
          </td>
          <!-- Step3 签名列：承载 3 组签名 -->
          <td class="td-sign" style="border-top: none;">
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
      </table>
    </div>

    <!-- 加页对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加日期" width="400px" append-to-body>
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="addForm.date" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%" />
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
import { getBizFillingRecord1Detail } from '@/api/bizdata/biz_filling_record_1'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import { listDeviceOptions } from '@/api/basic/device'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'
// 【改造】useDict → useBizDict
import { useBizDict } from '@/utils/bizDict'

defineOptions({ name: 'BizFillingRecord1Form' })

// 【改造】3 个数据源迁移到 biz_dict
const { biz_cleaning_method, biz_disinfection_method, biz_print_code_type } =
  useBizDict('biz_cleaning_method', 'biz_disinfection_method', 'biz_print_code_type')

/** 设备下拉选项（从基础数据 API 加载） */
const deviceOptions = ref([])
/** 当前节点所属工作单元编码（从 batch_record_menu 查） */
const currentWorkUnitCode = ref('')

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

const loading = ref(false)
const batchRecord = ref(null)
const fNodes = ref([])

const record = reactive({
  recordId: null,
  orderId: null, orderNum: '', workshop: 'F',
  recordDate: null,
  startTime: null, endTime: null,
  firstQualifiedFlag: '',
  s1Temperature: '', s1Humidity: '',
  s1QualifiedFlag: '', s1Remark: '',
  deviceCode: '', deviceName: '',
  s2InCleanValidityFlag: '',
  s2CleaningMethod: '', s2DesinfectionMethod: '',
  s3UseMaterialLiquidRinseFlag: '',
  s3NetContentRangeLower: '', s3NetContentRangeUpper: '', s3NetContentUnit: 'g',
  s3PrintCodeType: '',
  s3CodingInfo: ''
})

const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isAddPageMode = computed(() => props.actionType === 'ADD_PAGE')
const isApproveMode = computed(() =>
  !isEditMode.value && !isPreviewMode.value && !isAddPageMode.value
)

// ==================== 滚动条 ====================
const isScrolling = ref(false)
let scrollHideTimer = null
function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) clearTimeout(scrollHideTimer)
  scrollHideTimer = setTimeout(() => { isScrolling.value = false }, 800)
}

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

// ==================== 格式化 ====================
function formatYesNo(flag) {
  if (flag === 'Y') return '是'
  if (flag === 'N') return '否'
  return ''
}

function formatDateTime(val) {
  if (!val) return ''
  return parseTime(val, '{y}-{m}-{d} {h}:{i}')
}

function formatInCleanValidity(flag) {
  if (flag === 'Y') return '在清洁效期内:使用纯化水清洗'
  if (flag === 'N') return '超过清洁效期:重新清洁消毒'
  return ''
}

/**
 * 打码方式中文标签（从 biz_dict 取）
 */
function formatPrintCodeType(value) {
  const list = biz_print_code_type.value || []
  const opt = list.find(o => o.value === value)
  return opt ? opt.label : ''
}

/**
 * 自动计算打码信息并回填
 *
 * 计算规则：
 * - 基础格式：`{产品批号} EXP：{限制使用日期}`
 * - 限制使用日期 = 批记录计划开始日期（planStart）+ 3 年 - 1 天
 * - 日期格式化：yyyyMMdd（如 20291010）
 *
 * 数据来源：
 * - 产品批号：`batchRecord.batchNumber`（来自 batch_record 表）
 * - 计划开始日期：`batchRecord.planStart`（Date 类型）
 *
 * 计算示例：
 * - 产品批号：FC0504
 * - 计划开始日期：2026-10-11
 * - 加 3 年：2029-10-11
 * - 减 1 天：2029-10-10
 * - 格式化：20291010
 * - 最终结果：FC0504 EXP：20291010
 *
 * 业务背景：
 * 化妆品灌装 GMP 规则要求打码信息包含产品批号与限制使用日期；
 * 限制使用日期基于首次生产计划日期（planStart）计算，3 年内有效。
 *
 * 边界处理：
 * - 产品批号缺失：提示后终止
 * - 计划开始日期缺失或非法：提示后终止
 */
function handleAutoFillCodingInfo() {
  const batchNumber = batchRecord.value?.batchNumber || ''
  const planStart = batchRecord.value?.planStart

  if (!batchNumber) {
    ElMessage.warning('产品批号缺失，无法自动计算打码信息')
    return
  }
  if (!planStart) {
    ElMessage.warning('计划开始日期缺失，无法计算限制使用日期')
    return
  }

  const startDate = new Date(planStart)
  if (isNaN(startDate.getTime())) {
    ElMessage.warning('计划开始日期格式不正确，无法计算')
    return
  }

  // 基于 Date 对象运算，规避手工拼接年月日时的闰年/跨月边界问题
  const limitDate = new Date(startDate)
  limitDate.setFullYear(limitDate.getFullYear() + 3)
  limitDate.setDate(limitDate.getDate() - 1)

  // 格式化为 yyyyMMdd
  const year = limitDate.getFullYear()
  const month = String(limitDate.getMonth() + 1).padStart(2, '0')
  const day = String(limitDate.getDate()).padStart(2, '0')
  const formattedLimitDate = `${year}${month}${day}`

  record.s3CodingInfo = `${batchNumber} EXP:${formattedLimitDate}`
}

/**
 * 设备下拉切换：自动回填设备名称快照
 *
 * @param {String} code 选中的设备编码（空字符串表示清空）
 */
function handleDeviceChange(code) {
  if (!code) {
    record.deviceName = ''
    return
  }
  const matched = deviceOptions.value.find(opt => opt.code === code)
  record.deviceName = matched ? matched.name : ''
}

/**
 * 加载当前 C 节点所属工作单元编码
 *
 * 通过若依标准节点查询接口取 batch_record_menu.work_unit_code，
 * 避免依赖父组件透传（可扩展性更佳）。
 */
async function loadCurrentWorkUnitCode() {
  if (!props.cMenuId) return
  try {
    const res = await request({
      url: '/batch/batch_record_menu/' + props.cMenuId,
      method: 'get'
    })
    currentWorkUnitCode.value = res.data?.workUnitCode || ''
  } catch (error) {
    console.error('加载当前节点工作单元编码失败', error)
    currentWorkUnitCode.value = ''
  }
}

/**
 * 按工作单元加载设备下拉选项
 */
async function loadDeviceOptions() {
  if (!currentWorkUnitCode.value) {
    deviceOptions.value = []
    return
  }
  try {
    const res = await listDeviceOptions({ workUnitCode: currentWorkUnitCode.value })
    deviceOptions.value = res.data || []
  } catch (error) {
    console.error('加载设备下拉选项失败', error)
    deviceOptions.value = []
  }
}
// ==================== 加页状态 ====================
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = reactive({ date: '' })
const addRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

// ==================== 数据加载 ====================
onMounted(async () => {
  await loadFNodes()
  await loadCurrentWorkUnitCode()   // 新增
  await loadDeviceOptions()          // 新增
  if (isPreviewMode.value && !props.businessRecordId) {
    // 预览无数据
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
    const detailPromise = getBizFillingRecord1Detail(props.businessRecordId)
    const recordPromise = props.recordId
      ? getBatch_record(props.recordId)
      : Promise.resolve({ data: null })
    const [detailRes, recordRes] = await Promise.all([detailPromise, recordPromise])
    batchRecord.value = recordRes.data || null
    Object.assign(record, detailRes.data || {})
  } catch (error) {
    ElMessage.error('加载灌装生产记录1数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 通用请求 ====================
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
      '/bizdata/biz_filling_record_1/edit/{businessRecordId}?menuId={menuId}'
    const urlParams = {
      businessRecordId: props.businessRecordId,
      menuId: props.menuId
    }
    if (routeTemplate.includes('{recordId}')) {
      urlParams.recordId = props.businessRecordId
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
.filling-record-1-form-container {
  padding: 4px 8px 8px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.filling-record-1-form-container.is-a4-mode {
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

.view-container {
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  color: #000;
}
.preview-mode-flex { flex: 1; min-height: 0; }
.preview-mode-a4 {
  height: 201mm;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.filled-value { color: #4046ff; }

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
  font-weight: normal;
  font-size: 14px;
  background: #f5f7fa;
  text-align: center;
}
.info-value { font-size: 14px; text-align: center; }
.header-value {
  font-weight: normal;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
}
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 2px 2px;
  vertical-align: top;
  box-sizing: border-box;
}
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}
.td-require {
  font-size: 14px;
  text-align: left;
  vertical-align: middle !important;
  padding: 6px 8px;
}
.td-record {
  font-size: 13px;
  text-align: left;
  vertical-align: middle !important;
  padding: 6px 8px;
}
.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 6px !important;
}

/* 动态回填值 */
.record-view-text {
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
  white-space: normal;
  word-break: break-word;
}

/* 复选框对 */
.checkbox-pair {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}
.checkbox-pair :deep(.el-checkbox) {
  margin-right: 0;
}

/* 复选框选中高亮（覆盖 disabled 默认灰） */
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}
.view-container :deep(.el-checkbox__inner) { border-radius: 2px; }
.view-container :deep(.el-checkbox__label) {
  font-size: 13px;
  padding-left: 4px;
}

/* radio-group 紧凑 */
.view-container :deep(.el-radio) {
  margin-right: 12px;
  height: auto;
}
.view-container :deep(.el-radio__label) {
  font-size: 13px;
  padding-left: 4px;
  color: #000 !important;
}
.view-container :deep(.el-radio.is-checked .el-radio__inner) {
  background-color: #409eff;
  border-color: #409eff;
}
.view-container :deep(.el-radio.is-checked .el-radio__label) {
  color: #000 !important;
}

/* 编辑态控件 */
.edit-input-short {
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 4px;
  font-size: 13px;
  text-align: center;
}
.edit-input-short:focus { background-color: #e6f7ff; outline: none; }
.edit-textarea {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 4px 6px;
  font-size: 13px;
  resize: vertical;
  box-sizing: border-box;
}
.edit-textarea:focus { background-color: #e6f7ff; outline: none; }

/* 【改造】Step2 设备行（对齐包材处理1） */
.device-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.device-row-label {
  flex-shrink: 0;
  white-space: nowrap;
}
.device-select {
  width: 140px;
}
.edit-input-device-code {
  width: 80px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 0px;
  font-size: 13px;
  text-align: center;
  background-color: #f5f7fa;
  color: #606266;
  vertical-align: middle;
}
.edit-input-device-code:focus {
  outline: none;
}

/* 滚动条显隐 */
.view-container::-webkit-scrollbar { width: 6px; height: 0; }
.view-container::-webkit-scrollbar-track { background: transparent; }
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
.view-container { scrollbar-width: thin; scrollbar-color: transparent transparent; }
.view-container.is-scrolling { scrollbar-color: rgba(144, 147, 153, 0.5) transparent; }
</style>