<template>
  <div class="filling-record-3-form-container" :class="{ 'is-a4-mode': useA4Preview }">
    <!-- 顶部操作按钮 -->
    <div v-if="isEditMode || isApproveMode || dialogCtx" class="form-action-bar">
      <el-button v-if="dialogCtx" @click="dialogCtx.toggleFullscreen()">
        {{ dialogCtx.isFullscreen.value ? '取消全屏' : '全屏' }}
      </el-button>
      <el-button v-if="isEditMode" type="primary" @click="handleSyncMaterialFromReceiving">从领料单同步物料</el-button>
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
        <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SOP-S-G-004)-01</span>
      </div>

      <!-- 标题 -->
      <div style="text-align: center; margin-bottom: 4px; font-size: 15px; font-weight: bold;">
        灌装生产记录
      </div>

      <!-- ===== 产品信息表 ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col>
          <col style="width: 80px;">
          <col style="width: 150px;">
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
          <col style="width: 80px;"><col/><col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="header-value">操作项目</td>
          <td class="header-value">操作记录</td>
          <td class="header-value">/</td>
        </tr>
      </table>

      <!-- ================= Step4 产品/半成品统计 ================= -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col><col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="td-step-label">4.产品/半成品统计</td>
          <td class="td-record-cell" style="line-height: 2;">
            <div style="display: flex; justify-content: space-between; padding: 0 10px;">
              <div>
                <span style="margin-right: 10px;">产品统计：</span>
                良品量：<input v-if="isEditMode" v-model="record.productGoodQty" class="edit-input-short" style="width: 15%;" type="number" />
                <span v-else class="filled-value">{{ record.productGoodQty ?? '' }}</span>
                <span style="margin: 0 10px;">不良品量：</span>
                <input v-if="isEditMode" v-model="record.productBadQty" class="edit-input-short" style="width: 15%;" type="number" />
                <span v-else class="filled-value">{{ record.productBadQty ?? '' }}</span>
                <span style="margin: 0 10px;">取样量：</span>
                <input v-if="isEditMode" v-model="record.productSampleQty" class="edit-input-short" style="width: 15%;" type="number" />
                <span v-else class="filled-value">{{ record.productSampleQty ?? '' }}</span>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0 10px; margin-top: 5px;">
              <div>
                <span style="margin-right: 10px;">半成品：</span>
                领用量：<input v-if="isEditMode" v-model="record.semiFinishedUseQty" class="edit-input-short" style="width: 15%;" type="number" />
                <span v-else class="filled-value">{{ record.semiFinishedUseQty ?? '' }}</span>
                <span style="margin: 0 10px;">可计损耗量：</span>
                <input v-if="isEditMode" v-model="record.semiFinishedLossQty" class="edit-input-short" style="width: 15%;" type="number" />
                <span v-else class="filled-value">{{ record.semiFinishedLossQty ?? '' }}</span>
                <span style="margin: 0 10px;">退料量：</span>
                <input v-if="isEditMode" v-model="record.semiFinishedReturnQty" class="edit-input-short" style="width: 15%;" type="number" />
                <span v-else class="filled-value">{{ record.semiFinishedReturnQty ?? '' }}</span>
              </div>
            </div>
          </td>
          <!-- 签名列（底部无线） -->
          <td class="td-sign" style="border-bottom: none;"></td>
        </tr>
      </table>

      <!-- ================= Step5 包材统计 ================= -->
      <!-- 调整了 colgroup 宽度以适应下拉框 -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 150px;"> <!-- 物料名称 -->
          <col style="width: 90px;">  <!-- 物料批号 -->
          <col style="width: 90px;">  <!-- 规格 -->
          <col style="width: 60px;">  <!-- 单位 -->
          <col>  <!-- 领用量 -->
          <col>  <!-- 使用量 -->
          <col>  <!-- 损耗量 -->
          <col style="width: 130px;"> <!-- 退料量 -->
          <col style="width: 130px;"> <!-- 签名 -->
        </colgroup>
        <tr>
          <td class="td-step-label" :rowspan="1 + paddedStep5List.length">5.包材统计</td>
          <td class="header-value">物料名称</td>
          <td class="header-value">物料批号</td>
          <td class="header-value">规格</td>
          <td class="header-value">单位</td>
          <td class="header-value">领用量 pcs</td>
          <td class="header-value">使用量 pcs</td>
          <td class="header-value">损耗量 pcs</td>
          <td class="header-value">退料量 pcs</td>
          <!-- 签名列 -->
          <td class="td-sign" :rowspan="1 + paddedStep5List.length" style="border-top: none; border-bottom: none;"></td>
        </tr>
        <tr v-for="(item, idx) in paddedStep5List" :key="idx" style="height: 32px;">
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
            <template v-if="isEditMode"><input v-model="item.batchNumber" class="edit-input-short" style="width: 90%;" /></template>
            <template v-else><span class="filled-value">{{ item.batchNumber || '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
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
            <template v-if="isEditMode"><input v-model="item.receiveQty" class="edit-input-short" style="width: 90%;" type="number" /></template>
            <template v-else><span class="filled-value">{{ item.receiveQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.useQty" class="edit-input-short" style="width: 90%;" type="number" /></template>
            <template v-else><span class="filled-value">{{ item.useQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.lossQty" class="edit-input-short" style="width: 90%;" type="number" /></template>
            <template v-else><span class="filled-value">{{ item.lossQty ?? '' }}</span></template>
          </td>
          <td class="td-record-cell td-record-center">
            <template v-if="isEditMode"><input v-model="item.returnQty" class="edit-input-short" style="width: 90%;" type="number" /></template>
            <template v-else><span class="filled-value">{{ item.returnQty ?? '' }}</span></template>
          </td>
        </tr>
      </table>

      <!-- ================= Step6 不合格及损耗统计 ================= -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 50px;">
          <col style="width: 100px;"> <!-- 加宽以容纳下拉框 -->
          <col>
          <col style="width: 130px;">
          <col style="width: 130px;">
        </colgroup>
        
        <!-- 表头 -->
        <tr>
          <td class="td-step-label" :rowspan="11">6.不合格及损耗统计</td>
          <td class="header-value">类别</td>
          <td class="header-value">名称/代码</td>
          <td class="header-value">原因及数量 pcs</td>
          <td class="header-value">处理方式</td>
          <!-- 签名列 -->
          <td class="td-sign" :rowspan="11" style="border-top: none; vertical-align: top; padding: 10px 6px;">
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

        <!-- 半成品行 -->
        <tr style="height: 28px;">
          <td class="td-record-cell td-record-center">半成品</td>
          <td class="td-record-cell">
            <template v-if="isEditMode"><input v-model="step6Semi.materialName" class="edit-input-short" style="width: 90%;" /></template>
            <template v-else><span class="filled-value">{{ step6Semi.materialName || '' }}</span></template>
          </td>
          <td class="td-record-cell" style="text-align: left; font-size: 13px; padding: 4px 6px;">
            <div>可计损耗统计(kg)：<input v-if="isEditMode" v-model="step6Semi.semiLossTotal" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Semi.semiLossTotal ?? '' }}</span>；其中：
            倾倒损耗 <input v-if="isEditMode" v-model="step6Semi.semiPourLoss" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Semi.semiPourLoss ?? '' }}</span>，泄漏损耗 <input v-if="isEditMode" v-model="step6Semi.semiLeakLoss" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Semi.semiLeakLoss ?? '' }}</span>，</div>
            <div>调机损耗 <input v-if="isEditMode" v-model="step6Semi.semiMachineLoss" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Semi.semiMachineLoss ?? '' }}</span>，收集余料 <input v-if="isEditMode" v-model="step6Semi.semiCollectLoss" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Semi.semiCollectLoss ?? '' }}</span>。</div>
          </td>
          <td class="td-record-cell" style="font-size: 12px; padding: 0 4px;">
            <div style="display: flex; flex-direction: column; gap: 0px;">
              <el-checkbox v-model="step6Semi.semiDisposalFlush" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">用水冲洗</el-checkbox>
              <el-checkbox v-model="step6Semi.semiDisposalSewage" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">收集送污水站</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 成品行 -->
        <tr style="height: 28px;">
          <td class="td-record-cell td-record-center">成品</td>
          <td class="td-record-cell">
            <template v-if="isEditMode"><input v-model="step6Finished.materialName" class="edit-input-short" style="width: 90%;" /></template>
            <template v-else><span class="filled-value">{{ step6Finished.materialName || '' }}</span></template>
          </td>
          <td class="td-record-cell" style="text-align: left; font-size: 13px; padding: 4px 6px;">
            <div>不良品总量(pcs)：<input v-if="isEditMode" v-model="step6Finished.finishedBadTotal" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedBadTotal ?? '' }}</span>；其中，
            错装、错灌：<input v-if="isEditMode" v-model="step6Finished.finishedWrong" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedWrong ?? '' }}</span>，装量不足：<input v-if="isEditMode" v-model="step6Finished.finishedShort" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedShort ?? '' }}</span>，</div>
            <div>打码不良：<input v-if="isEditMode" v-model="step6Finished.finishedCodeBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedCodeBad ?? '' }}</span>，密封性不良：<input v-if="isEditMode" v-model="step6Finished.finishedSealBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedSealBad ?? '' }}</span>，
            外观不良：<input v-if="isEditMode" v-model="step6Finished.finishedAppearanceBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedAppearanceBad ?? '' }}</span>，破损<input v-if="isEditMode" v-model="step6Finished.finishedDamage" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedDamage ?? '' }}</span>，其他<input v-if="isEditMode" v-model="step6Finished.finishedOther" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ step6Finished.finishedOther ?? '' }}</span></div>
          </td>
          <td class="td-record-cell" style="font-size: 12px; padding: 0 4px;">
            <div style="display: flex; flex-direction: column; gap: 0px;">
              <el-checkbox v-model="step6Finished.finishedDisposalFlush" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">冲洗收销毁</el-checkbox>
              <el-checkbox v-model="step6Finished.finishedDisposalSolid" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">固废处理</el-checkbox>
            </div>
          </td>
        </tr>

        <!-- 包材行 (4组，每组2行) -->
        <template v-for="(pkg, pkgIdx) in step6Pkgs" :key="'pkg'+pkgIdx">
          <tr style="height: 28px;">
            <td v-if="pkgIdx === 0" :rowspan="paddedStep6PkgCount * 2" class="td-record-cell td-record-center">包材</td>
            <td :rowspan="2" class="td-record-cell">
              <template v-if="isEditMode">
                <BaseCategorySelect
                  v-model="pkg.materialCode"
                  api-url="/basic/material/listByCategory"
                  :category-code="MATERIAL_CATEGORY_CODE"
                  placeholder=""
                  @change="(code, name) => handleSelectChange(pkg, 'material', code, name)"
                />
              </template>
              <template v-else><span class="filled-value">{{ pkg.materialName || '' }}</span></template>
            </td>
            <td class="td-record-cell" style="text-align: left; font-size: 13px; padding: 4px 6px; line-height: 1.5;">
              <div>外观不良 <input v-if="isEditMode" v-model="pkg.pkgAppearanceBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgAppearanceBad ?? '' }}</span>，密封不良 <input v-if="isEditMode" v-model="pkg.pkgSealBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgSealBad ?? '' }}</span>，肮污不良 <input v-if="isEditMode" v-model="pkg.pkgDirtyBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgDirtyBad ?? '' }}</span>，破损 <input v-if="isEditMode" v-model="pkg.pkgDamage" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgDamage ?? '' }}</span>，</div>
              <div>尺寸不良 <input v-if="isEditMode" v-model="pkg.pkgSizeBad" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgSizeBad ?? '' }}</span>，调机损耗 <input v-if="isEditMode" v-model="pkg.pkgMachineLoss" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgMachineLoss ?? '' }}</span>，其他 <input v-if="isEditMode" v-model="pkg.pkgOther" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgOther ?? '' }}</span></div>
            </td>
            <td class="td-record-cell" style="font-size: 12px; padding: 0 4px;">
              <div style="display: flex; flex-direction: column; gap: 0px;">
                <el-checkbox v-model="pkg.pkgDisposalDiscard" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">丢弃</el-checkbox>
                <el-checkbox v-model="pkg.pkgDisposalSolid" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">固废处理</el-checkbox>
              </div>
            </td>
          </tr>
          <tr style="height: 28px;">
            <td class="td-record-cell" style="text-align: left; font-size: 12px; padding: 4px 6px; line-height: 1.8;">
              <div>采购来料不良描述：<input v-if="isEditMode" v-model="pkg.pkgMaterialBadDesc" class="edit-input-short" style="width: 200px;" /><span v-else class="filled-value">{{ pkg.pkgMaterialBadDesc || '' }}</span>，不良数量：<input v-if="isEditMode" v-model="pkg.pkgMaterialBadQty" class="edit-input-short" type="number" /><span v-else class="filled-value">{{ pkg.pkgMaterialBadQty ?? '' }}</span></div>
            </td>
            <td class="td-record-cell" style="font-size: 12px; padding: 0 4px;">
              <div style="display: flex; ">
                <el-checkbox v-model="pkg.pkgDisposalReturn" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-right: 0;" size="small">退库</el-checkbox>
                <el-checkbox v-model="pkg.pkgDisposalDestroy" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 6px;" size="small">现场销毁</el-checkbox>
              </div>
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
  getBizFillingRecord3Detail, 
  editBizFillingRecord3, 
  syncMaterialFromReceiving 
} from '@/api/bizdata/biz_filling_record_3'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import BaseCategorySelect from '@/components/BaseCategorySelect/index.vue'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'FillingRecord3Form' })

/** 物料选择的分类码（本表单为包装材料相关，固定） */
const MATERIAL_CATEGORY_CODE = 'PACKAGING_MATERIAL'

/** 本表单为灌装车间专属表单，领料单关联消毒车间（D） */
const SYNC_WORKSHOP = 'D'

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
const isApproveMode = computed(() => !isEditMode.value && !isPreviewMode.value)

const loading = ref(false)
const batchRecord = ref(null)
const fNodes = ref([])

const record = reactive({
  recordId: null,
  orderId: null,
  orderNum: '',
  bizWorkshopType: 'FILLING',
  productGoodQty: null,
  productBadQty: null,
  productSampleQty: null,
  semiFinishedUseQty: null,
  semiFinishedLossQty: null,
  semiFinishedReturnQty: null,
  step5List: [],
  step6List: []
})

// ==================== 滚动条显隐 ====================
const isScrolling = ref(false)
let scrollHideTimer = null
function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) clearTimeout(scrollHideTimer)
  scrollHideTimer = setTimeout(() => { isScrolling.value = false }, 800)
}

// ==================== 签名行 ====================
const submitNode = computed(() => fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'SUBMIT' && btn.operatorTime))
const reviewNode = computed(() => fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'REVIEW' && btn.operatorTime))
const inspectNode = computed(() => fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'INSPECT' && btn.operatorTime))
const submitSignatureName = computed(() => submitNode.value?.operator || '')
const submitSignatureTime = computed(() => submitNode.value?.operatorTime ? parseTime(submitNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : '')
const reviewSignatureName = computed(() => reviewNode.value?.operator || '')
const reviewSignatureTime = computed(() => reviewNode.value?.operatorTime ? parseTime(reviewNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : '')
const inspectSignatureName = computed(() => inspectNode.value?.operator || '')
const inspectSignatureTime = computed(() => inspectNode.value?.operatorTime ? parseTime(inspectNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : '')

// ==================== 子表数据预处理 ====================
const paddedStep5List = computed(() => {
  const list = record.step5List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push(createEmptyStep5Row())
  return result
})

const step6Semi = computed(() => {
  return (record.step6List || []).find(i => i.bizMaterialType === 'SEMI_FINISHED_PRODUCT') || createEmptyStep6Row()
})
const step6Finished = computed(() => {
  return (record.step6List || []).find(i => i.bizMaterialType === 'FINISHED_PRODUCT') || createEmptyStep6Row()
})
const step6Pkgs = computed(() => {
  const pkgs = (record.step6List || []).filter(i => i.bizMaterialType === 'PACKAGING_MATERIAL')
  if (pkgs.length >= 4) return pkgs
  const result = [...pkgs]
  while (result.length < 4) result.push(createEmptyStep6Row())
  return result
})
const paddedStep6PkgCount = computed(() => step6Pkgs.value.length)

// ==================== 空行创建 ====================
function createEmptyStep5Row() {
  return {
    stepId: null, recordId: null, seqNo: null,
    materialCode: '', materialName: '', batchNumber: '', spec: '', unit: '',
    receiveQty: null, useQty: null, lossQty: null, returnQty: null
  }
}

function createEmptyStep6Row() {
  return {
    stepId: null, recordId: null, seqNo: null, bizMaterialType: '',
    materialCode: '', materialName: '', batchNumber: '', spec: '', unit: '',
    semiLossTotal: null, semiPourLoss: null, semiLeakLoss: null, semiMachineLoss: null, semiCollectLoss: null,
    semiDisposalFlush: '', semiDisposalSewage: '', // 半成品处理方式
    finishedBadTotal: null, finishedWrong: null, finishedShort: null, finishedCodeBad: null, finishedSealBad: null, finishedAppearanceBad: null, finishedDamage: null, finishedOther: null,
    finishedDisposalFlush: '', finishedDisposalSolid: '',
    pkgAppearanceBad: null, pkgSealBad: null, pkgDirtyBad: null, pkgDamage: null, pkgSizeBad: null, pkgMachineLoss: null, pkgOther: null,
    pkgMaterialBadDesc: '', pkgMaterialBadQty: null,
    pkgDisposalDiscard: '', pkgDisposalSolid: '', pkgDisposalReturn: '', pkgDisposalDestroy: ''
  }
}

// ==================== 选择器回填 ====================
function handleSelectChange(row, type, code, name) {
  if (type === 'material') row.materialName = name || ''
  else if (type === 'spec') row.spec = name || ''
  else if (type === 'unit') row.unit = name || ''
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
  }
}

function initEmptyTemplate() {
  record.step5List = [createEmptyStep5Row(), createEmptyStep5Row(), createEmptyStep5Row(), createEmptyStep5Row()]
  record.step6List = [
    { ...createEmptyStep6Row(), bizMaterialType: 'SEMI_FINISHED_PRODUCT' },
    { ...createEmptyStep6Row(), bizMaterialType: 'FINISHED_PRODUCT' },
    { ...createEmptyStep6Row(), bizMaterialType: 'PACKAGING_MATERIAL' },
    { ...createEmptyStep6Row(), bizMaterialType: 'PACKAGING_MATERIAL' },
    { ...createEmptyStep6Row(), bizMaterialType: 'PACKAGING_MATERIAL' },
    { ...createEmptyStep6Row(), bizMaterialType: 'PACKAGING_MATERIAL' }
  ]
}

async function loadData() {
  loading.value = true
  try {
    const detailPromise = getBizFillingRecord3Detail(props.businessRecordId)
    const recordPromise = props.recordId ? getBatch_record(props.recordId) : Promise.resolve({ data: null })
    const [detailRes, recordRes] = await Promise.all([detailPromise, recordPromise])

    batchRecord.value = recordRes.data || null
    const data = detailRes.data || {}
    Object.assign(record, data)
  } catch (error) {
    ElMessage.error('加载灌装生产记录3数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 动态请求 ====================
async function dynamicRequest(routeTemplate, pathParams, data = {}, method = 'post') {
  let url = routeTemplate
  Object.keys(pathParams).forEach(key => {
    const value = (pathParams[key] !== undefined && pathParams[key] !== null) ? encodeURIComponent(pathParams[key]) : ''
    url = url.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  })
  url = url.replace(/[?&][^=]*=\{[^}]*\}/g, '')
  url = url.replace(/[?&]$/, '')
  return request({ url, method, data })
}

// ==================== 从领料单同步 ====================
async function handleSyncMaterialFromReceiving() {
  try {
    await ElMessageBox.confirm(
      '确认从消毒车间领料单同步物料？当前包材明细将被覆盖。',
      '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch (error) { return }

  try {
    const res = await syncMaterialFromReceiving(props.businessRecordId, SYNC_WORKSHOP)
    const data = res.data || {}
    Object.assign(record, data)
    ElMessage.success('同步成功')
  } catch (error) {
    ElMessage.error(error?.message || '同步失败')
  }
}

// ==================== 编辑保存 ====================
async function handleEditSubmit() {
  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
  } catch (error) { return }

  // 组装 payload
  const payload = {
    ...record,
    step5List: paddedStep5List.value,
    step6List: [
      step6Semi.value,
      step6Finished.value,
      ...step6Pkgs.value
    ]
  }

  try {
    const routeTemplate = props.backendRoute || '/bizdata/biz_filling_record_3/edit/{businessRecordId}?menuId={menuId}'
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
    } catch (error) { return }
  } else {
    try {
      const { value } = await ElMessageBox.prompt(
        `确认执行「${props.menuName || props.buttonLabel}」操作吗？可输入审批意见`,
        '提示', { confirmButtonText: '确定', cancelButtonText: '取消', inputValue: '', inputPlaceholder: '审批意见（可选）' }
      )
      remark = value ? value.trim() : ''
    } catch (error) { return }
  }
  try {
    const routeTemplate = props.backendRoute || '/batch/batch_record_menu/approve/{menuId}?remark={remark}'
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
/* ===== 根容器（flex 自适应 + 双模式） ===== */
.filling-record-3-form-container {
  padding: 4px 8px 8px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.filling-record-3-form-container.is-a4-mode {
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
.td-record-cell {
  vertical-align: middle !important;
  text-align: left;
  padding: 0px 1px;
  font-size: 13px;
}
.td-record-center {
  text-align: center;
}
.td-sign {
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  vertical-align: top !important;
  padding: 4px 6px !important;
}

/* ===== 编辑框样式 ===== */
.edit-input-short {
  width: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 1px;
  font-size: 13px;
  text-align: center;
  box-sizing: border-box;
  -moz-appearance: textfield;
}
.edit-input-short::-webkit-outer-spin-button,
.edit-input-short::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.edit-input-short:focus {
  background-color: #e6f7ff;
  outline: none;
}

/* 操作项目列、签名列 */
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}

/* ===== 复选框选中高亮 ===== */
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

/* ===== 滚动条 ===== */
.view-container::-webkit-scrollbar { width: 6px; height: 0; }
.view-container::-webkit-scrollbar-track { background: transparent; }
.view-container::-webkit-scrollbar-thumb { background: transparent; border-radius: 3px; transition: background 0.25s ease; }
.view-container.is-scrolling::-webkit-scrollbar-thumb { background: rgba(144, 147, 153, 0.5); }
.view-container { scrollbar-width: thin; scrollbar-color: transparent transparent; }
.view-container.is-scrolling { scrollbar-color: rgba(144, 147, 153, 0.5) transparent; }
</style>
