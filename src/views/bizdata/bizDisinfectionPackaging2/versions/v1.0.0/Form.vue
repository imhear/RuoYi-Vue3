<template>
  <div class="dis-pack2-form-container" :class="{ 'is-a4-mode': useA4Preview }">
    <!-- 顶部操作按钮（v1.7 改造：flex 居中 + 全屏按钮最前） -->
    <div v-if="isEditMode || isApproveMode || dialogCtx" class="form-action-bar">
      <el-button
        v-if="dialogCtx"
        @click="dialogCtx.toggleFullscreen()"
      >{{ dialogCtx.isFullscreen.value ? '取消全屏' : '全屏' }}</el-button>
      <el-button v-if="isEditMode" type="primary" @click="handleSyncMaterialFromReceiving">从领料单同步物料</el-button>
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
      <!-- ===== 公司名称 + 编号 + 标题 ===== -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-006)-01</span>
      </div>
      <div style="text-align: center; margin-bottom: 4px; margin-left: -190px;">
        灌装包材处理记录
      </div>

      <!-- ===== 产品信息（只读，保持默认文本色，不做突出显示） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 320px;">
          <col style="width: 80px;">
          <col>
          <col style="width: 80px;">
          <col style="width: 130px;">
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

      <!-- ===== 表头 ===== -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col><col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="header-value">操作项目</td>
          <td class="header-value">操作记录</td>
          <!-- <td class="header-value">/</td> -->
          <td class="header-value">/</td>
        </tr>
      </table>

      <!-- ===== Step4 物料使用统计（自 packaging_1 迁移而来） =====
           【v1.10 修复】非编辑态数量字段从 `|| ''` 改为 `?? ''`，0 值可正常显示
      -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">   <!-- 操作项目 -->
          <col style="width: 30px;">   <!-- 序号 -->
          <col style="width: 140px;">  <!-- 物料名称 -->
          <col style="width: 90px;">   <!-- 物料批号 -->
          <col style="width: 110px;">  <!-- 规格 -->
          <col style="width: 70px;">   <!-- 单位 -->
          <col style="width: 80px;">   <!-- 领入量 -->
          <col style="width: 80px;">   <!-- 使用量 -->
          <col style="width: 80px;">   <!-- 损耗量 -->
          <col>                         <!-- 剩余量 -->
          <col style="width: 130px;">  <!-- 签名列 -->
        </colgroup>
        <tr>
          <td class="td-step-label" :rowspan="1 + paddedStep4List.length">4.物料使用统计</td>
          <td></td>
          <td class="header-value">物料名称</td>
          <td class="header-value">物料批号</td>
          <td class="header-value">规格</td>
          <td class="header-value">单位</td>
          <td class="header-value">领入量</td>
          <td class="header-value">使用量</td>
          <td class="header-value">损耗量</td>
          <td class="header-value">剩余量</td>
          <!-- Step4 为最上方 step 表格：签名列底部无线，顶部随表头保留 -->
          <td class="td-sign" :rowspan="1 + paddedStep4List.length" style="border-bottom: none;"></td>
        </tr>
        <tr v-for="(item, idx) in paddedStep4List" :key="idx" style="height: 32px;">
          <td style="vertical-align: middle;">{{ idx + 1 }}）</td>
          <td class="td-record-cell">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="item.materialCode"
                api-url="/basic/material/listByCategory"
                :category-code="MATERIAL_CATEGORY_CODE"
                placeholder=""
                @change="(code, name) => handleSelectChange(item, 'material', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ item.materialName || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.batchNumber" class="edit-input-short" style="width: 80px;" /></template>
            <template v-else><span class="filled-value">{{ item.batchNumber || '' }}</span></template>
          </td>
          <td class="td-record-cell">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="item.spec"
                api-url="/basic/spec/listByCategory"
                :category-code="MATERIAL_CATEGORY_CODE"
                placeholder=""
                @change="(code, name) => handleSelectChange(item, 'spec', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ item.spec || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="item.unit"
                api-url="/basic/unit/listByCategory"
                :category-code="MATERIAL_CATEGORY_CODE"
                placeholder=""
                @change="(code, name) => handleSelectChange(item, 'unit', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ item.unit || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.receiveQty" class="edit-input-short" style="width: 60px;" /></template>
            <template v-else><span class="filled-value">{{ item.receiveQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.useQty" class="edit-input-short" style="width: 60px;" /></template>
            <template v-else><span class="filled-value">{{ item.useQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.lossQty" class="edit-input-short" style="width: 60px;" /></template>
            <template v-else><span class="filled-value">{{ item.lossQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.remainQty" class="edit-input-short" style="width: 60px;" /></template>
            <template v-else><span class="filled-value">{{ item.remainQty ?? '' }}</span></template>
          </td>
        </tr>
      </table>

      <!-- ===== Step5 物料储存/周转（v-for 重构，与 Step4/Step6 统一） =====
           【v1.10 修复】非编辑态数量字段从 `|| ''` 改为 `?? ''`，0 值可正常显示
      -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">   <!-- 操作项目 -->
          <col style="width: 30px;">   <!-- 序号 -->
          <col style="width: 140px;">  <!-- 物料名称 -->
          <col style="width: 90px;">   <!-- 物料批号 -->
          <col style="width: 110px;">  <!-- 规格 -->
          <col style="width: 70px;">   <!-- 单位 -->
          <col style="width: 80px;">   <!-- 数量 -->
          <col>                         <!-- 备注 -->
          <col style="width: 130px;">  <!-- 签名列（承载签名内容） -->
        </colgroup>
        <tr>
          <td class="td-step-label" :rowspan="1 + paddedStep5List.length">5.物料储存/周转</td>
          <td></td>
          <td class="header-value">物料名称</td>
          <td class="header-value">物料批号</td>
          <td class="header-value">规格</td>
          <td class="header-value">单位</td>
          <td class="header-value">数量</td>
          <td class="header-value">备注</td>
          <!-- 签名内容承载此处：三表合并后，签名显示在 Step5 右侧（保持原样，不做突出显示） -->
          <td class="td-sign" :rowspan="1 + paddedStep5List.length" style="border-top: none; border-bottom: none;">
            <div>操作人：{{ submitSignatureName }}</div>
            <div>{{ submitSignatureTime }}</div>
            <div style="height: 8px;"></div>
            <div>复核人：{{ reviewSignatureName }}</div>
            <div>{{ reviewSignatureTime }}</div>
            <div style="height: 8px;"></div>
            <div>检查人：{{ inspectSignatureName }}</div>
            <div>{{ inspectSignatureTime }}</div>
          </td>
        </tr>
        <tr v-for="(item, idx) in paddedStep5List" :key="idx" style="height: 32px;">
          <td style="vertical-align: middle;">{{ idx + 1 }}）</td>
          <td class="td-record-cell">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="item.materialCode"
                api-url="/basic/material/listByCategory"
                :category-code="MATERIAL_CATEGORY_CODE"
                placeholder=""
                @change="(code, name) => handleSelectChange(item, 'material', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ item.materialName || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.batchNumber" class="edit-input-short" style="width: 80px;" /></template>
            <template v-else><span class="filled-value">{{ item.batchNumber || '' }}</span></template>
          </td>
          <td class="td-record-cell">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="item.spec"
                api-url="/basic/spec/listByCategory"
                :category-code="MATERIAL_CATEGORY_CODE"
                placeholder=""
                @change="(code, name) => handleSelectChange(item, 'spec', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ item.spec || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="item.unit"
                api-url="/basic/unit/listByCategory"
                :category-code="MATERIAL_CATEGORY_CODE"
                placeholder=""
                @change="(code, name) => handleSelectChange(item, 'unit', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ item.unit || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.storeQty" class="edit-input-short" style="width: 60px;" /></template>
            <template v-else><span class="filled-value">{{ item.storeQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell">
            <template v-if="isEditMode"><input v-model="item.remark" class="edit-input-short" style="width: 99%; text-align: left;" /></template>
            <template v-else><span class="filled-value">{{ item.remark || '' }}</span></template>
          </td>
        </tr>
      </table>

      <!-- ===== Step6 生产过程不合格物料处理 =====
           【v1.9 改造】非编辑态：取消 rowspan=3 合并，每物料 1 行；
           "不合格原因及对应数量"列、处理方式列转为纯文本；降低整体高度
           【v1.10 修复】非编辑态数量字段从 `|| ''` 改为 `?? ''`，0 值可正常显示
      -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">   <!-- 操作项目 -->
          <col style="width: 30px;">   <!-- 序号 -->
          <col style="width: 140px;">  <!-- 不合格物料名称 -->
          <col style="width: 90px;">   <!-- 物料批号 -->
          <col style="width: 110px;">  <!-- 规格 -->
          <col style="width: 70px;">   <!-- 单位 -->
          <col style="width: 80px;">   <!-- 总数量 -->
          <col>                         <!-- 不合格原因及对应数量 -->
          <col style="width: 90px;">  <!-- 处理方式 -->
          <col style="width: 130px;">  <!-- 签名列 -->
        </colgroup>

        <!-- ============ 编辑态：保持原有 3 行展开结构 ============ -->
        <template v-if="isEditMode">
          <tr style="height: 28px;">
            <td class="td-step-label" :rowspan="1 + paddedStep6List.length * 3">6.生产过程不合格物料处理</td>
            <td></td>
            <td class="header-value">不合格物料名称</td>
            <td class="header-value">物料批号</td>
            <td class="header-value">规格</td>
            <td class="header-value">单位</td>
            <td class="header-value">总数量</td>
            <td class="header-value">不合格原因及对应数量</td>
            <td class="header-value">处理方式</td>
            <!-- Step6 为最下方 step 表格：签名列顶部无线，底部随表保留 -->
            <td class="td-sign" :rowspan="1 + paddedStep6List.length * 3" style="border-top: none;"></td>
          </tr>
          <template v-for="(item, idx) in paddedStep6List" :key="idx">
            <!-- 破损行 -->
            <tr style="height: 28px;">
              <td :rowspan="3" style="vertical-align: middle;">{{ idx + 1 }}）</td>
              <td :rowspan="3" class="td-record-cell">
                <BaseCategorySelect
                  v-model="item.materialCode"
                  api-url="/basic/material/listByCategory"
                  :category-code="MATERIAL_CATEGORY_CODE"
                  placeholder=""
                  @change="(code, name) => handleSelectChange(item, 'material', code, name)"
                />
              </td>
              <td :rowspan="3" class="td-record-cell td-record-center">
                <input v-model="item.batchNumber" class="edit-input-short" style="width: 80px;" />
              </td>
              <td :rowspan="3" class="td-record-cell">
                <BaseCategorySelect
                  v-model="item.spec"
                  api-url="/basic/spec/listByCategory"
                  :category-code="MATERIAL_CATEGORY_CODE"
                  placeholder=""
                  @change="(code, name) => handleSelectChange(item, 'spec', code, name)"
                />
              </td>
              <td :rowspan="3" class="td-record-cell td-record-center">
                <BaseCategorySelect
                  v-model="item.unit"
                  api-url="/basic/unit/listByCategory"
                  :category-code="MATERIAL_CATEGORY_CODE"
                  placeholder=""
                  @change="(code, name) => handleSelectChange(item, 'unit', code, name)"
                />
              </td>
              <td :rowspan="3" class="td-record-cell td-record-center">
                <input v-model="item.nonConformingQty" class="edit-input-short" style="width: 60px;" />
              </td>
              <td class="td-record-cell">
                <el-checkbox v-model="item.damageFlag" true-value="Y" false-value="">破损</el-checkbox>
                ，数量 <input v-model="item.damageQty" class="edit-input-short" style="width: 30px;" /> 个
              </td>
              <td :rowspan="3" class="td-record-cell">
                <el-checkbox v-model="item.destroyFlag" true-value="Y" false-value="">销毁</el-checkbox>
                <br/><br/>
                <el-checkbox v-model="item.shearFailureFlag" true-value="Y" false-value="">剪毁</el-checkbox>
              </td>
            </tr>
            <!-- 色差行 -->
            <tr style="height: 28px;">
              <td class="td-record-cell">
                <el-checkbox v-model="item.colorDifferenceFlag" true-value="Y" false-value="">色差</el-checkbox>
                ，数量 <input v-model="item.colorDifferenceQty" class="edit-input-short" style="width: 30px;" /> 个
              </td>
            </tr>
            <!-- 其他行 -->
            <tr style="height: 28px;">
              <td class="td-record-cell">
                <el-checkbox v-model="item.otherFlag" true-value="Y" false-value="">其他</el-checkbox>，<input v-model="item.otherReason" class="edit-input-short" style="width: 70px;" />&nbsp;&nbsp;数量 <input v-model="item.otherQty" class="edit-input-short" style="width: 30px;" /> 个
              </td>
            </tr>
          </template>
        </template>

        <!-- ============ 非编辑态：每物料 1 行（三种原因合并到 1 行文本 + 处理方式合并） ============ -->
        <template v-else>
          <tr style="height: 28px;">
            <td class="td-step-label" :rowspan="1 + paddedStep6List.length">6.生产过程不合格物料处理</td>
            <td></td>
            <td class="header-value">不合格物料名称</td>
            <td class="header-value">物料批号</td>
            <td class="header-value">规格</td>
            <td class="header-value">单位</td>
            <td class="header-value">总数量</td>
            <td class="header-value">不合格原因及对应数量</td>
            <td class="header-value">处理方式</td>
            <!-- 非编辑态：签名列跨 1 + 4 = 5 行 -->
            <td class="td-sign" :rowspan="1 + paddedStep6List.length" style="border-top: none;"></td>
          </tr>
          <tr v-for="(item, idx) in paddedStep6List" :key="idx" style="height: 28px;">
            <td class="td-record-cell td-record-center">{{ idx + 1 }}）</td>
            <td class="td-record-cell">
              <span class="filled-value">{{ item.materialName || '' }}</span>
            </td>
            <td class="td-record-cell td-record-center">
              <span class="filled-value">{{ item.batchNumber || '' }}</span>
            </td>
            <td class="td-record-cell">
              <span class="filled-value">{{ item.spec || '' }}</span>
            </td>
            <td class="td-record-cell td-record-center">
              <span class="filled-value">{{ item.unit || '' }}</span>
            </td>
            <td class="td-record-cell td-record-center">
              <span class="filled-value">{{ item.nonConformingQty ?? '' }}</span>
            </td>
            <td class="td-record-cell">
              <!-- 不合格原因及对应数量：三种原因合并为纯文本 -->
              <span class="filled-value">{{ formatNonConformingReason(item) }}</span>
            </td>
            <td class="td-record-cell td-record-center">
              <!-- 处理方式：销毁/剪毁合并为纯文本 -->
              <span class="filled-value">{{ formatDisposalMethod(item) }}</span>
            </td>
          </tr>
        </template>
      </table>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBizDisinfectionPackaging2Detail,
  syncMaterialFromReceiving
} from '@/api/bizdata/bizDisinfectionPackaging2'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import BaseCategorySelect from '@/components/BaseCategorySelect/index.vue'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'DisinfectionPackaging2Form' })

/** Step4/Step5/Step6 物料/规格/单位选择的分类码（本表单为包装材料相关，固定） */
const MATERIAL_CATEGORY_CODE = 'PACKAGING_MATERIAL'

/**
 * 本表单为消毒车间专属表单，从消毒车间（D）的领料单同步物料。
 * 未来迁移其他车间表单时对应改为：
 *   - 灌装车间：'F'
 *   - 包装车间：'P'
 */
const SYNC_WORKSHOP = 'D'

/**
 * 组件 Props 定义
 *
 * 【v1.5 新增】useA4Preview：
 * - true：view-container 固定为 201mm（A4 物理高度），用于打印场景
 * - false（默认）：view-container 使用 flex: 1 自适应父容器高度，用于聚合入口场景
 */
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

/** 主表业务字段 */
const record = reactive({
  recordId: null,
  orderId: null, orderNum: '', workshop: '',
  startTime: null, endTime: null, processDate: null,
  s5StepName: '', s6StepName: '',
  remark: '',
  step4List: [],
  step5List: [],
  step6List: []
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

// ==================== 签名行计算属性 ====================
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

// ==================== 子表显示行 ====================
/** 确保 Step4 至少 4 行 */
const paddedStep4List = computed(() => {
  const list = record.step4List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push(createEmptyStep4Row())
  return result
})

/** 确保 Step5 至少 4 行 */
const paddedStep5List = computed(() => {
  const list = record.step5List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push(createEmptyStep5Row())
  return result
})

/** 确保 Step6 至少 4 行 */
const paddedStep6List = computed(() => {
  const list = record.step6List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push(createEmptyStep6Row())
  return result
})

// ==================== 空行创建 ====================
function createEmptyStep4Row() {
  return {
    stepId: null, recordId: null, seqNo: null,
    materialCode: '', materialName: '', batchNumber: '',
    spec: '', unit: '',
    receiveQty: '', useQty: '', lossQty: '', remainQty: ''
  }
}

function createEmptyStep5Row() {
  return {
    stepId: null, recordId: null, seqNo: null,
    materialCode: '', materialName: '', batchNumber: '',
    spec: '', unit: '', storeQty: '',
    remark: ''
  }
}

function createEmptyStep6Row() {
  return {
    stepId: null, recordId: null, seqNo: null,
    materialCode: '', materialName: '', batchNumber: '',
    spec: '', unit: '',
    nonConformingQty: '',
    damageFlag: '', damageQty: '',
    colorDifferenceFlag: '', colorDifferenceQty: '',
    otherFlag: '', otherReason: '', otherQty: '',
    destroyFlag: '', shearFailureFlag: ''
  }
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
  record.step4List = [createEmptyStep4Row(), createEmptyStep4Row(), createEmptyStep4Row(), createEmptyStep4Row()]
  record.step5List = [createEmptyStep5Row(), createEmptyStep5Row(), createEmptyStep5Row(), createEmptyStep5Row()]
  record.step6List = [createEmptyStep6Row(), createEmptyStep6Row(), createEmptyStep6Row(), createEmptyStep6Row()]
}

async function loadData() {
  loading.value = true
  try {
    const detailPromise = getBizDisinfectionPackaging2Detail(props.businessRecordId)
    const recordPromise = props.recordId
      ? getBatch_record(props.recordId)
      : Promise.resolve({ data: null })
    const [detailRes, recordRes] = await Promise.all([detailPromise, recordPromise])

    batchRecord.value = recordRes.data || null
    const data = detailRes.data || {}
    Object.assign(record, data)

    // 补齐 Step4 至 4 行
    const step4 = Array.isArray(record.step4List) ? record.step4List : []
    while (step4.length < 4) step4.push(createEmptyStep4Row())
    record.step4List = step4

    // 补齐 Step5 至 4 行
    const step5 = Array.isArray(record.step5List) ? record.step5List : []
    while (step5.length < 4) step5.push(createEmptyStep5Row())
    record.step5List = step5

    // 补齐 Step6 至 4 行
    const step6 = Array.isArray(record.step6List) ? record.step6List : []
    while (step6.length < 4) step6.push(createEmptyStep6Row())
    record.step6List = step6
  } catch (error) {
    ElMessage.error('加载灌装包材处理记录2数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 选择器回填 ====================
function handleSelectChange(row, type, code, name) {
  if (type === 'material') row.materialName = name || ''
  else if (type === 'spec') row.spec = name || ''
  else if (type === 'unit') row.unit = name || ''
}

// ==================== Step6 非编辑态纯文本格式化 ====================
/**
 * 【v1.9 新增】非编辑态：Step6 不合格原因及对应数量的纯文本格式化
 *
 * 格式化规则：
 * - 破损勾选：破损，数量X个
 * - 色差勾选：色差，数量X个
 * - 其他勾选：其他：xxx，数量X个（reason 为空时省略"：xxx"）
 * - 多个同时勾选：用"；"分隔
 * - 均未勾选：返回空字符串
 *
 * 【v1.10 修复】数量拼接从 `|| ''` 改为 `?? ''`，0 值可正常显示
 *
 * @param {Object} item Step6 行数据
 * @returns {String} 格式化后的纯文本
 */
function formatNonConformingReason(item) {
  const parts = []
  if (item.damageFlag === 'Y') {
    parts.push(`破损，数量${item.damageQty ?? ''}个`)
  }
  if (item.colorDifferenceFlag === 'Y') {
    parts.push(`色差，数量${item.colorDifferenceQty ?? ''}个`)
  }
  if (item.otherFlag === 'Y') {
    const reason = item.otherReason || ''
    parts.push(`其他${reason ? '：' + reason : ''}，数量${item.otherQty ?? ''}个`)
  }
  return parts.join('；')
}

/**
 * 【v1.9 新增】非编辑态：Step6 处理方式的纯文本格式化
 *
 * 格式化规则：
 * - 销毁勾选：销毁
 * - 剪毁勾选：剪毁
 * - 多个同时勾选：用"、"分隔
 * - 均未勾选：返回空字符串
 *
 * @param {Object} item Step6 行数据
 * @returns {String} 格式化后的纯文本
 */
function formatDisposalMethod(item) {
  const parts = []
  if (item.destroyFlag === 'Y') parts.push('销毁')
  if (item.shearFailureFlag === 'Y') parts.push('剪毁')
  return parts.join('、')
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

// ==================== 校验 ====================
function beforeSubmitCheck() {
  return true
}

// ==================== 编辑保存 ====================
async function handleEditSubmit() {
  if (!beforeSubmitCheck()) return
  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
  } catch (error) { return }

  const payload = { ...record }
  // 过滤全空的 Step4 行
  payload.step4List = record.step4List.filter(item =>
    item.stepId || item.materialCode || item.materialName
  )
  // 过滤全空的 Step5 行
  payload.step5List = record.step5List.filter(item =>
    item.stepId || item.materialCode || item.materialName
  )
  // 过滤全空的 Step6 行
  payload.step6List = record.step6List.filter(item =>
    item.stepId || item.materialCode || item.materialName
  )

  try {
    const routeTemplate = props.backendRoute ||
      '/bizdata/bizDisinfectionPackaging2/edit/{businessRecordId}?menuId={menuId}'
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

// ==================== 从领料单同步物料 ====================
/**
 * 从领料单同步物料到 Step4 / Step5 / Step6 子表
 *
 * 交互流程：
 * 1. 二次确认（提示当前三表内容将被覆盖）
 * 2. 调后端同步接口，后端同时更新 step4/step5/step6
 * 3. 后端返回完整对象（含三个子表 List），前端一次刷新 record
 * 4. 不关闭对话框，用户可继续编辑
 *
 * 允许重复点击：每次调用均以后端最新领料单数据覆盖三表。
 */
async function handleSyncMaterialFromReceiving() {
  try {
    await ElMessageBox.confirm(
      '确认从领料单同步物料？当前 Step4 / Step5 / Step6 的物料明细将被覆盖。',
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch (error) {
    return
  }

  try {
    const res = await syncMaterialFromReceiving(props.businessRecordId, SYNC_WORKSHOP)
    // 后端返回完整对象（含三个子表 List）
    const data = res.data || {}
    Object.assign(record, data)

    // 补齐 Step4
    const step4 = Array.isArray(record.step4List) ? record.step4List : []
    while (step4.length < 4) step4.push(createEmptyStep4Row())
    record.step4List = step4

    // 补齐 Step5
    const step5 = Array.isArray(record.step5List) ? record.step5List : []
    while (step5.length < 4) step5.push(createEmptyStep5Row())
    record.step5List = step5

    // 补齐 Step6
    const step6 = Array.isArray(record.step6List) ? record.step6List : []
    while (step6.length < 4) step6.push(createEmptyStep6Row())
    record.step6List = step6

    // 判断是否有数据（以 step4 或 step5 任一有物料判断）
    const hasAnyItem = record.step4List.some(it =>
      it.materialCode || it.materialName
    ) || record.step5List.some(it =>
      it.materialCode || it.materialName
    )
    if (!hasAnyItem) {
      ElMessage.warning('未找到关联的领料单，Step4 / Step5 / Step6 已清空')
    } else {
      ElMessage.success('同步成功')
    }
  } catch (error) {
    ElMessage.error('同步失败')
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
   容器（v1.5 改造：flex 自适应）
   ============================================================ */
.dis-pack2-form-container {
  /* 上 padding 从 8px 改为 4px，给按钮留出贴紧顶部的空间 */
  padding: 4px 8px 8px 8px;
  /* 根容器撑满 dialog body，由父容器驱动高度 */
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
/* 【v1.5】A4 打印模式：根容器改为自然高度，不撑满 dialog */
.dis-pack2-form-container.is-a4-mode {
  height: auto;
  display: block;
}

/* 【v1.7 改造】顶部按钮区：正常文档流占位 + 居中显示 */
.form-action-bar {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

/* ============================================================
   滚动容器（v1.5 改造：flex 自适应 / A4 固定高度 两种模式）
   ============================================================ */
.view-container {
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  color: #000;
}
/* 【v1.5】Flex 自适应模式（聚合入口：查看/编辑/审批都走这个） */
.preview-mode-flex {
  flex: 1;
  min-height: 0;
}
/* 【v1.5】A4 打印模式（独立打印对话框） */
.preview-mode-a4 {
  height: 201mm;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 【v1.8 新增】动态回填值突出显示（区别于固定文本） */
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

/* 关闭 Step4~Step6 表格上下边框，用于签名列跨表合并 */
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

/* Step4~Step6 外层单元格通用样式 */
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 1px 1px;
  vertical-align: top;
  box-sizing: border-box;
}

/* 操作项目列、签名列 */
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}
.td-sign {
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 6px !important;
}

/* Step4~Step6 数据行单元格 */
.td-record-cell {
  vertical-align: middle !important;
  text-align: left;
  padding: 4px 6px;
  font-size: 13px;
}
.td-record-center {
  text-align: center;
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
   编辑态短输入框
   ============================================================ */
.edit-input-short {
  width: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 1px;
  font-size: 14px;
  text-align: center;
}
.edit-input-short:focus {
  background-color: #e6f7ff;
  outline: none;
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
</style>