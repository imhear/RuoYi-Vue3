<template>
  <div class="receiving-form-container" :class="{ 'is-a4-mode': useA4Preview }">
      <!-- 顶部操作按钮（位于表单之上，打印时通过 print 或截图时可直接忽略）
           【v1.7 改造】
           - 居中显示（原 text-align: right）
           - 全屏按钮排列在最前（文字按钮，全屏 / 取消全屏）
           - v-if 放宽为"编辑态 / 审批态 / 对话框内预览态"三选一
           - 独立打印场景（dialogCtx = null）预览态不渲染按钮栏，走 A4 模式
      -->
      <div v-if="isEditMode || isApproveMode || isAddPageMode || dialogCtx" class="form-action-bar">
        <el-button v-if="dialogCtx" @click="dialogCtx.toggleFullscreen()">{{ dialogCtx.isFullscreen.value ? '取消全屏' : '全屏' }}</el-button>
        <el-button v-if="isEditMode" type="primary" @click="handleSyncMaterialFromReceiving">从领料单同步物料</el-button>
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
      <div style="display: flex; align-items: flex-end; margin-bottom: 0px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SOP-S-G-001)-01</span>
      </div>

      <!-- 物料类别 -->
      <!-- <div style="text-align: center; margin-top: 4px; margin-bottom: -6px; display: flex; justify-content: center; align-items: center;">
        <span style="font-weight: bold;">（</span>
        <el-checkbox :model-value="receiving?.bizMaterialType === 'RAW_MATERIAL'" >原料</el-checkbox>
        <el-checkbox :model-value="receiving?.bizMaterialType === 'SEMI_FINISHED_PRODUCT'" >半成品</el-checkbox>
        <el-checkbox :model-value="receiving?.bizMaterialType === 'INTERMEDIATE_PRODUCT'" >半制品</el-checkbox>
        <el-checkbox :model-value="receiving?.bizMaterialType === 'PACKAGING_MATERIAL'" >包装材料</el-checkbox>
        <span style="font-weight: bold;">）退料单</span>
      </div> -->

      <!-- 物料类别 -->
      <div style="text-align: center; margin-top: 4px; margin-bottom: -6px; display: flex; justify-content: center; align-items: center;">
        <span style="font-weight: bold;">（</span>
            <el-checkbox :model-value="receiving?.bizMaterialType === 'RAW_MATERIAL'"
                :disabled="!isEditMode"
                @change="(val) => handleMaterialTypeChange('RAW_MATERIAL', val)">原料</el-checkbox>
            <el-checkbox   :model-value="receiving?.bizMaterialType === 'SEMI_FINISHED_PRODUCT'"
                :disabled="!isEditMode"
                @change="(val) => handleMaterialTypeChange('SEMI_FINISHED_PRODUCT', val)">半成品</el-checkbox>
            <el-checkbox  :model-value="receiving?.bizMaterialType === 'INTERMEDIATE_PRODUCT'"
                :disabled="!isEditMode"
                @change="(val) => handleMaterialTypeChange('INTERMEDIATE_PRODUCT', val)">半制品</el-checkbox>
            <el-checkbox  :model-value="receiving?.bizMaterialType === 'PACKAGING_MATERIAL'"
                :disabled="!isEditMode"
                @change="(val) => handleMaterialTypeChange('PACKAGING_MATERIAL', val)">包装材料</el-checkbox>
        <span style="font-weight: bold;">）退料单</span>
      </div>

      <!-- 产品信息
           【v1.8 改造】非编辑态下产品名称 / 规格 / 产品批号 为动态回填值，
           用 .filled-value 突出显示（区分固定标题文本）
      -->
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

      <!-- 物料明细
           【v1.8 改造】非编辑态下各文本字段（物料名称 / 规格 / 单位 / 计划领用量 /
           物料批号 / 实际发料量 / 备注）为动态回填值，用 .filled-value 突出显示。
           复选框列（物料核对 4 列）保持原样不改。
      -->
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
              <BaseCategorySelect
                v-model="scope.row.materialCode"
                api-url="/basic/material/listByCategory"
                :category-code="receiving?.bizMaterialType"
                placeholder="请选择物料"
                @change="(code, name) => handleSelectChange(scope.row, 'material', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ scope.row.materialName || '' }}</span></template>
          </template>
        </el-table-column>

        <el-table-column label="规格" min-width="90" align="center">
          <template #default="scope">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="scope.row.specCode"
                api-url="/basic/spec/listByCategory"
                :category-code="receiving?.bizMaterialType"
                placeholder="请选择规格"
                @change="(code, name) => handleSelectChange(scope.row, 'spec', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ scope.row.spec || '' }}</span></template>
          </template>
        </el-table-column>

        <el-table-column label="单位" min-width="60" align="center">
          <template #default="scope">
            <template v-if="isEditMode">
              <BaseCategorySelect
                v-model="scope.row.unitCode"
                api-url="/basic/unit/listByCategory"
                :category-code="receiving?.bizMaterialType"
                placeholder="请选择单位"
                @change="(code, name) => handleSelectChange(scope.row, 'unit', code, name)"
              />
            </template>
            <template v-else><span class="filled-value">{{ scope.row.unit || '' }}</span></template>
          </template>
        </el-table-column>

        <el-table-column label="物料批号" min-width="80" align="center">
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.batchNumber" size="small" /></template>
            <template v-else><span class="filled-value">{{ scope.row.batchNumber || '' }}</span></template>
          </template>
        </el-table-column>

        <el-table-column min-width="60" align="center">
          <template #header><div style="line-height: 1.2;">请退量</div></template>
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.requireQty" size="small" /></template>
            <template v-else><span class="filled-value">{{ scope.row.requireQty || '' }}</span></template>
          </template>
        </el-table-column>

        <el-table-column label="物料核对" align="center">
          <el-table-column min-width="80" align="center">
            <template #header><div style="line-height: 1.2;">包装是否完整</div></template>
            <template #default="scope">
              <div class="checkbox-pair">
                <el-checkbox v-model="scope.row.baozhuangFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="scope.row.baozhuangFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" align="center">
            <template #header><div style="line-height: 1.2;">标识是否清晰</div></template>
            <template #default="scope">
              <div class="checkbox-pair">
                <el-checkbox v-model="scope.row.biaoqianFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="scope.row.biaoqianFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
              </div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column min-width="60" align="center">
          <template #header><div style="line-height: 1.2;">实退量</div></template>
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.actualQty" size="small" /></template>
            <template v-else><span class="filled-value">{{ scope.row.actualQty || '' }}</span></template>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="60" align="center">
          <template #default="scope">
            <template v-if="isEditMode"><el-input v-model="scope.row.remark" size="small" /></template>
            <template v-else><span class="filled-value">{{ scope.row.remark || '' }}</span></template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 签名行（只读，数据源来自 batch_record_menu 控制表）
           【v1.8 改造】非编辑态签名内容为动态回填值，用 .filled-value 突出显示
      -->
      <el-table :data="[{}]" :show-header="false" border size="small" class="bottom-table">
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">交料人/日期：</span></template>
        </el-table-column>
        <el-table-column>
          <template #default><span class="filled-value">{{ submitSignatureText }}</span></template>
        </el-table-column>
        <el-table-column width="130" align="center">
          <template #default><span style="font-weight: normal;">接料人/日期：</span></template>
        </el-table-column>
        <el-table-column>
          <template #default><span class="filled-value">{{ reviewSignatureText }}</span></template>
        </el-table-column>
      </el-table>

    </div>

    <!-- ===== 加页对话框 ===== -->
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
import { getBizRetrunDetail, syncMaterialFromReceiving } from '@/api/bizdata/biz_return'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import BaseCategorySelect from '@/components/BaseCategorySelect/index.vue'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'ReturnForm' })

/**
 * 组件 Props 定义
 * actionType: 操作类型（大写：PREVIEW/EDIT/SUBMIT等）
 * recordId: 批记录ID（必填）
 * menuId: 按钮节点ID（编辑/审批时必填）
 * businessRecordId: 业务记录ID（编辑/审批/查看真实数据时必填；预览空模板时可不传）
 * cMenuId: 当前表单对应的 C 节点 ID（用于获取签名行数据）
 * backendRoute: 后端接口路径模板（来自操作码配置，需包含占位符）
 * 其余为按钮节点相关信息
 *
 * 【v1.5 新增】useA4Preview：
 * - true：view-container 固定为 201mm（A4 物理高度），用于打印场景
 * - false（默认）：view-container 使用 flex: 1 自适应父容器高度，用于聚合入口场景
 * 聚合入口（查看/编辑/审批）始终为 false；打印对话框为 true
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
const receiving = ref(null)
const batchRecord = ref(null)
const displayItems = ref([])
const fNodes = ref([])            // 当前 C 节点下所有 F 节点

const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isApproveMode = computed(() => !isEditMode.value && !isPreviewMode.value && !isAddPageMode.value)

// ==================== 加页状态（v1.1 新增） ====================
const isAddPageMode = computed(() => props.actionType === 'ADD_PAGE')
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = reactive({ date: '' })
const addRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

// ==================== 滚动条显隐控制 ====================

/**
 * 是否正在滚动
 *
 * 用于控制 .view-container（预览/编辑/审批三模式通用）下滚动条的显示/隐藏：
 * - true：显示滚动条
 * - false：隐藏滚动条（滑块透明）
 *
 * 触发逻辑由 handlePreviewScroll 方法维护。
 */
const isScrolling = ref(false)

/**
 * 滚动隐藏定时器句柄
 *
 * 每次触发滚动时清除上一个定时器并重新设置，
 * 保证停止滚动 800ms 后才真正隐藏滚动条（防抖）。
 * 不使用 ref 包装，因为它不参与模板渲染。
 */
let scrollHideTimer = null

/**
 * 处理 .view-container 的滚动事件（预览/编辑/审批模式通用）
 *
 * 需求：滚动时显示滚动条，停止滚动后隐藏。
 * 实现：
 * 1. 置 isScrolling = true，模板动态 class 立即应用，滚动条显示
 * 2. 清除上一个定时器，避免多次触发叠加导致提前隐藏
 * 3. 设置新的 800ms 定时器，到时后置 isScrolling = false，滚动条隐藏
 *
 * 说明：该事件在 .view-container 上监听，三种模式（预览/编辑/审批）统一生效；
 * 滚动条样式通过 CSS 中的 .is-scrolling class 控制透明度。
 */
function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) {
    clearTimeout(scrollHideTimer)
  }
  scrollHideTimer = setTimeout(() => {
    isScrolling.value = false
  }, 800)
}

// ==================== 签名行计算属性 ====================

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
 * 处理 BaseCategorySelect 的选中变化
 * 
 * 根据类型回填对应的 name 快照字段。
 * code 已由 v-model 双向绑定，此处只需回填 name。
 * 
 * @param {Object} row 当前行数据对象
 * @param {String} type 字段类型（material / spec / unit）
 * @param {String} code 选中的 code（可忽略，因 v-model 已绑定）
 * @param {String} name 选中的 name 快照
 */
function handleSelectChange(row, type, code, name) {
  if (type === 'material') {
    row.materialName = name || ''
  } else if (type === 'spec') {
    row.spec = name || ''
  } else if (type === 'unit') {
    row.unit = name || ''
  }
}

/**
 * 物料类别复选框单选处理
 *
 * 四个复选框共用 receiving.bizMaterialType，只能选中一个。
 * 点击未选中项：设为该类别；
 *
 * @param {String} type 物料类别枚举值
 * @param {Boolean} checked 点击后是否选中
 */
function handleMaterialTypeChange(type, checked) {
  if (!receiving.value || !checked) return
  receiving.value.bizMaterialType = type
}

/**
 * 动态调用后端接口
 *
 * 将路径模板中的占位符替换为实际参数值，然后发起请求。
 * 占位符格式：{参数名}，例如 /batch/batch_record_menu/approve/{menuId}?remark={remark}
 *
 * @param {String} routeTemplate 路径模板
 * @param {Object} pathParams 占位符参数映射，键为占位符名称，值为实际值
 * @param {Object} data 请求体（POST/PUT 等需要时使用）
 * @param {String} method 请求方法，默认为 post
 * @returns {Promise} 请求 Promise
 */
async function dynamicRequest(routeTemplate, pathParams, data = {}, method = 'post') {
  let url = routeTemplate
  Object.keys(pathParams).forEach(key => {
    const value = pathParams[key] !== undefined && pathParams[key] !== null
      ? encodeURIComponent(pathParams[key])
      : ''
    url = url.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  })
  url = url.replace(/[?&][^=]*=\{[^}]*\}/g, '')
  url = url.replace(/[?&]$/, '')

  return request({
    url,
    method,
    data
  })
}

// ==================== 从领料单同步 ====================
/**
 * 物料类别 → 来源车间（仅用于确认框文案提示）
 * 消毒车间领料单固定为包装材料，灌装车间领料单固定为半成品
 */
const SYNC_WORKSHOP_LABEL_MAP = {
  PACKAGING_MATERIAL: '消毒车间',
  SEMI_FINISHED_PRODUCT: '灌装车间'
}

// ==================== 从领料单同步 ====================
/**
 * 物料类别 → 来源车间映射
 * 消毒车间领料单固定为包装材料，灌装车间领料单固定为半成品
 */
const SYNC_WORKSHOP_MAP = {
  PACKAGING_MATERIAL: 'DISINFECTION',
  SEMI_FINISHED_PRODUCT: 'FILLING'
}

/** 车间编码 → 中文名称（仅用于确认框文案） */
const WORKSHOP_LABEL_MAP = {
  DISINFECTION: '消毒车间',
  FILLING: '灌装车间'
}

async function handleSyncMaterialFromReceiving() {
  // script 中 receiving 是 ref，必须通过 .value 访问
  const bizMaterialType = receiving.value?.bizMaterialType

  if (!bizMaterialType) {
    ElMessage.warning('请先选择物料类别后再同步')
    return
  }

  const workshop = SYNC_WORKSHOP_MAP[bizMaterialType]
  if (!workshop) {
    ElMessage.warning('仅“包装材料”或“半成品”支持从领料单同步物料')
    return
  }

  const workshopLabel = WORKSHOP_LABEL_MAP[workshop]

  try {
    await ElMessageBox.confirm(
      `确认从${workshopLabel}领料单同步物料？当前物料明细将被覆盖。`,
      '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch (error) { return }

  try {
    const res = await syncMaterialFromReceiving(props.businessRecordId, workshop)
    const data = res.data || {}

    // 主表字段回填（receiving 是 ref，需 .value）
    if (receiving.value) {
      Object.assign(receiving.value, data)
    }

    // 物料明细模板渲染依赖 displayItems，同步后必须重新初始化
    initItems(data.itemList || [])

    ElMessage.success('同步成功')
  } catch (error) {
    ElMessage.error(error?.message || '同步失败')
  }
}

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
 * 加载批记录信息与退料单详情
 */
async function loadData() {
  loading.value = true
  try {
    const [recordRes, receivingRes] = await Promise.all([
      getBatch_record(props.recordId),
      getBizRetrunDetail(props.businessRecordId)
    ])
    batchRecord.value = recordRes.data || null
    receiving.value = receivingRes.data || null

    const items = receiving.value?.itemList || []
    initItems(items)
  } catch (error) {
    ElMessage.error('加载退料单数据失败')
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
    rows.push(createEmptyRow())
  }
  displayItems.value = rows
}

/**
 * 创建空白行对象
 */
function createEmptyRow() {
  return {
    materialCode: '', materialName: '',
    specCode: '', spec: '',
    unitCode: '', unit: '',
    requireQty: '',
    baozhuangFlag: null, biaoqianFlag: null,
    batchNumber: '', actualQty: '', remark: ''
  }
}

/**
 * 根据已有数据初始化物料明细，不足14行补空
 */
function initItems(items) {
  const rows = []
  for (let i = 0; i < 14; i++) {
    if (items[i]) {
      rows.push({ ...createEmptyRow(), ...items[i] })
    } else {
      rows.push(createEmptyRow())
    }
  }
  displayItems.value = rows
}

/**
 * 编辑提交前的校验（仅校验物料明细，不含签名）
 * 
 * 校验项：
 * - 行内至少填写物料、规格、单位之一
 * - 已填写的行必须连续，不允许中间空行
 * - 每行的物料、规格、单位、计划领用量、物料批号、实际发料量均为必填
 * 
 * @returns {Boolean} 校验是否通过
 */
function beforeSubmitCheck() {
  const numberPattern = /^\d+(\.\d+)?$/
  let foundEmpty = false
  let hasItem = false

  for (let i = 0; i < displayItems.value.length; i++) {
    const item = displayItems.value[i]
    const rowNum = i + 1
    const isEmpty = !item.materialCode && !item.specCode && !item.unitCode &&
                    !item.requireQty && !item.baozhuangFlag && !item.biaoqianFlag &&
                    !item.batchNumber && !item.actualQty && !item.remark

    if (isEmpty) {
      foundEmpty = true
      continue
    }

    hasItem = true
    if (foundEmpty) { ElMessage.error(`第${rowNum}行之前存在空行，请连续填写`); return false }
    if (!item.materialCode) { ElMessage.error(`第${rowNum}行物料名称不能为空`); return false }
    if (!item.specCode) { ElMessage.error(`第${rowNum}行规格不能为空`); return false }
    if (!item.unitCode) { ElMessage.error(`第${rowNum}行单位不能为空`); return false }
    if (!item.requireQty || !numberPattern.test(String(item.requireQty).trim()) || Number(item.requireQty) <= 0) {
      ElMessage.error(`第${rowNum}行请退量必须为正数`); return false
    }
    if (!item.batchNumber) { ElMessage.error(`第${rowNum}行物料批号不能为空`); return false }
    if (!item.actualQty || !numberPattern.test(String(item.actualQty).trim()) || Number(item.actualQty) <= 0) {
      ElMessage.error(`第${rowNum}行实退量必须为正数`); return false
    }
  }

  if (!hasItem) { ElMessage.error('请至少填写一条物料明细'); return false }
  return true
}

/**
 * 编辑模式：保存修改（带二次确认）
 * 
 * 先执行表单校验，校验通过后弹出二次确认框，用户确认后才提交保存请求。
 * 保存接口通过 props.backendRoute 动态拼接，不再硬编码具体 API。
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
    recordId: props.businessRecordId,
    bizMaterialType: receiving.value?.bizMaterialType || null,
    itemList: displayItems.value.filter(item =>
      item.materialCode || item.specCode || item.unitCode || item.batchNumber || item.remark
    )
  }

  try {
    const routeTemplate = props.backendRoute || '/bizdata/biz_return/edit/{businessRecordId}?menuId={menuId}'
    await dynamicRequest(routeTemplate, {
      businessRecordId: props.businessRecordId,
      menuId: props.menuId
    }, payload, 'post')
    ElMessage.success('保存成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

/**
 * 审批模式：执行审批/反审操作
 * 
 * 根据操作类型判断是否需要强制输入意见（反审操作必须输入原因）。
 * 审批接口通过 props.backendRoute 动态拼接，默认使用通用审批路径。
 */
async function handleApproveSubmit() {
  let remark = ''

  if (props.actionType && props.actionType.toUpperCase().startsWith('CANCEL_')) {
    try {
      const { value } = await ElMessageBox.prompt('请输入取消原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: '',
          inputPlaceholder: '审批意见（可选）'
        }
      )
      remark = value ? value.trim() : ''
    } catch (error) {
      return
    }
  }

  try {
    const routeTemplate = props.backendRoute || '/batch/batch_record_menu/approve/{menuId}?remark={remark}'
    await dynamicRequest(routeTemplate, {
      menuId: props.menuId,
      remark
    })
    ElMessage.success('操作成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// ==================== 加页（v1.1 新增） ====================
/**
 * 打开加页对话框（仅 ADD_PAGE 态可点）
 */
function handleAddPage() {
  addForm.date = new Date().toISOString().slice(0, 10)
  addDialogVisible.value = true
}

/**
 * 提交加页
 */
async function handleAddSubmit() {
  if (addFormRef.value) {
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
}
</script>

<style scoped>
/* ============================================================
   容器（v1.5 改造：flex 自适应）
   ============================================================ */
.receiving-form-container {
  /* 上 padding 从 8px 改为 4px，给按钮留出贴紧顶部的空间 */
  padding: 4px 8px 8px 8px;
  /* 根容器撑满 dialog body，由父容器驱动高度 */
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
/* 【v1.5】A4 打印模式：根容器改为自然高度，不撑满 dialog */
.receiving-form-container.is-a4-mode {
  height: auto;
  display: block;
}

/* 【v1.7 改造】顶部按钮区：正常文档流占位 + 居中显示
 * - flex-shrink: 0：避免被 flex 布局压缩
 * - justify-content: center：居中（原为 text-align: right）
 * - gap: 8px：按钮间距
 * - margin-bottom: 4px：与下方内容的间距
 */
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
/* 【v1.5】A4 打印模式（独立打印对话框）
 * - 保持 height: 201mm（A4 比例视觉）
 * - 使用 overflow-y: auto 允许内容超出 201mm 时滚动查看
 *   原因：物料明细固定 14 行时内容高度可能超过 201mm，
 *   overflow: hidden 会把底部签名栏等元素裁掉，导致用户无法查看；
 *   auto 让预览模式也能滚动到底部查看完整内容（如签名行）
 */
.preview-mode-a4 {
  height: 201mm;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 【v1.8 新增】动态回填值突出显示（区别于固定文本）
 * 适用范围：非编辑态下的所有动态回填纯文本（产品信息 / 物料明细文本字段 / 签名行）
 * 注意：复选框列（物料核对 4 列）保持原样，不使用此样式
 */
.filled-value {
  color: #4046ff;
}

.view-container :deep(.el-table) { color: #000; }
.view-container :deep(.el-table th) { color: #000; font-weight: normal; }
/* .view-container :deep(.el-checkbox__label) { color: #000 !important; } */
.top-table { margin-bottom: -1px; }
.top-table :deep(.el-table__body tr) { background-color: #f5f7fa !important; }
.bottom-table :deep(.el-table__body tr) { background-color: #f5f7fa !important; }
.mid-table { margin-top: -1px; margin-bottom: -1px; }
.bottom-table { margin-top: -1px; }
.mid-table :deep(.el-table__header) .cell { white-space: normal; word-break: break-all; line-height: 1.2; }
.mid-table :deep(.el-table__header-wrapper th),
.mid-table :deep(.el-table__fixed-header-wrapper th) { height: 30px !important; background-color: #ffffff !important; }
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner) { background-color: #409eff; border-color: #409eff; }
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner::after) { border-color: #fff; }
.view-container :deep(.el-checkbox__inner) { border-radius: 2px; }
/* 单元格内复选框对：flex 横排，gap 表示相邻元素之间的间距，最后一个之后天然无间距 */
.checkbox-pair {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 清除 el-checkbox 默认的 margin-right，避免与 gap 叠加 */
.checkbox-pair :deep(.el-checkbox) {
  margin-right: 0;
}

/* ============================================================
 * 滚动条样式：滚动时显示，停止滚动后隐藏
 *
 * 生效范围：.view-container，即预览模式 + 编辑模式 + 审批模式统一生效。
 * - 默认状态下滚动条滑块完全透明（视觉上"隐藏"）
 * - 当 .view-container 带有 is-scrolling class 时（正在滚动中）显示滑块
 * - is-scrolling class 由 @scroll 事件驱动的 handlePreviewScroll 方法切换
 * - 使用半透明灰色，与 Element Plus 默认滚动条风格接近
 * - Firefox 通过 scrollbar-width / scrollbar-color 单独处理，行为近似
 * ============================================================ */

/* 滚动条本体：宽度 6px，高度不占用（横向不滚动） */
.view-container::-webkit-scrollbar {
  width: 6px;
  height: 0;
}

/* 轨道：透明，不占用视觉空间 */
.view-container::-webkit-scrollbar-track {
  background: transparent;
}

/* 滑块：默认透明（视觉隐藏），带过渡动画 */
.view-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
  transition: background 0.25s ease;
}

/* 滚动中：显示滑块（半透明灰） */
.view-container.is-scrolling::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.5);
}

/* 鼠标悬停在滑块上：略微加深，便于拖动 */
.view-container.is-scrolling::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.8);
}

/* Firefox 兼容：细滚动条 + 滚动时着色（无法做到停止时隐藏，行为近似） */
.view-container {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.view-container.is-scrolling {
  scrollbar-color: rgba(144, 147, 153, 0.5) transparent;
}
</style>