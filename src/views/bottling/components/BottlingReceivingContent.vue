<!--
  领料单纯内容组件（数据无关版）
  支持真实数据查看，也支持无数据空白预览
-->
<template>
  <div class="view-container">

    <!-- ===== 公司名称 + 编号（居右） ===== -->
    <div style="display: flex; align-items: flex-end; margin-bottom: 0px;">
      <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
      <span style="flex-shrink: 0; font-size: 12px;">编号：{{ safePlan.fileTemplateCode || 'R-(LS-SOP-S-G-001)-01' }}</span>
    </div>

    <!-- ===== 物料类别 ===== -->
    <div style="text-align: center; margin-top: 4px; margin-bottom: -6px; display: flex; justify-content: center; align-items: center;">
      <span style="font-weight: bold;">（</span>
      <el-checkbox :model-value="safeReceiving.materialType === 'RAW_MATERIAL'" disabled>原料</el-checkbox>
      <el-checkbox :model-value="safeReceiving.materialType === 'SEMI_FINISHED_PRODUCT'" disabled>半成品</el-checkbox>
      <el-checkbox :model-value="safeReceiving.materialType === 'INTERMEDIATE_PRODUCT'" disabled>半制品</el-checkbox>
      <el-checkbox :model-value="safeReceiving.materialType === 'PACKAGING_MATERIAL'" disabled>包装材料</el-checkbox>
      <span style="font-weight: bold;">）领料单</span>
    </div>

    <!-- ===== 第一行表格：产品信息 ===== -->
    <el-table
      :data="[{}]"
      :show-header="false"
      border
      size="small"
      class="top-table"
    >
      <el-table-column width="120" align="center">
        <template #default>
          <span style="font-weight: bold;">产品名称</span>
        </template>
      </el-table-column>
      <el-table-column width="331">
        <template #default>{{ safePlan.productName || '' }}</template>
      </el-table-column>
      <el-table-column width="80" align="center">
        <template #default>
          <span style="font-weight: bold;">规格</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>{{ safePlan.spec || '' }}</template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template #default>
          <span style="font-weight: bold;">产品批号</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>{{ safePlan.batchNumber || '' }}</template>
      </el-table-column>
    </el-table>

    <!-- ===== 第二行表格：物料明细（严格换行表头 + 紧凑复选框） ===== -->
    <el-table
      :data="displayItems"
      border
      size="small"
      class="mid-table"
      :header-cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
      :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
    >
      <!-- 序号 -->
      <el-table-column label="序号" width="45" align="center">
        <template #default="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <!-- 物料名称 -->
      <el-table-column label="物料名称" min-width="120" align="center">
        <template #default="scope">{{ scope.row?.materialName || '' }}</template>
      </el-table-column>

      <!-- 规格 -->
      <el-table-column label="规格" width="90" align="center">
        <template #default="scope">{{ scope.row?.spec || '' }}</template>
      </el-table-column>

      <!-- 单位 -->
      <el-table-column label="单位" width="60" align="center">
        <template #default="scope">{{ scope.row?.unit || '' }}</template>
      </el-table-column>

      <!-- 计划领用量（表头换行） -->
      <el-table-column width="70" align="center">
        <template #header>
          <div style="line-height: 1.2;">计划<br/>领用量</div>
        </template>
        <template #default="scope">{{ scope.row?.requireQty || '' }}</template>
      </el-table-column>

      <!-- 物料核对（父列） -->
      <el-table-column label="物料核对" align="center">
        <!-- 包装是否完整（表头换行） -->
        <el-table-column width="80" align="center">
          <template #header>
            <div style="line-height: 1.2;">包装<br/>是否完整</div>
          </template>
          <template #default="scope">
            <span style="white-space: nowrap;">
              是<el-checkbox :model-value="scope.row?.baozhuangFlag === 'Y'" disabled />
              否<el-checkbox :model-value="scope.row?.baozhuangFlag === 'N'" disabled />
            </span>
          </template>
        </el-table-column>

        <!-- 标签是否正确（表头换行） -->
        <el-table-column width="80" align="center">
          <template #header>
            <div style="line-height: 1.2;">标签<br/>是否正确</div>
          </template>
          <template #default="scope">
            <span style="white-space: nowrap;">
              是<el-checkbox :model-value="scope.row?.biaoqianFlag === 'Y'" disabled />
              否<el-checkbox :model-value="scope.row?.biaoqianFlag === 'N'" disabled />
            </span>
          </template>
        </el-table-column>

        <!-- 是否无发霉...（表头换行） -->
        <el-table-column min-width="90" align="center">
          <template #header>
            <div style="line-height: 1.2;">是否无<br/>发霉、无变质、无生<br/>虫、无变色等</div>
          </template>
          <template #default="scope">
            <span style="white-space: nowrap;">
              是<el-checkbox :model-value="scope.row?.waiguanFlag === 'Y'" disabled />
              否<el-checkbox :model-value="scope.row?.waiguanFlag === 'N'" disabled />
            </span>
          </template>
        </el-table-column>

        <!-- 是否已放行 -->
        <el-table-column width="80" align="center">
          <template #header>
            <div style="line-height: 1.2;">是否已放行</div>
          </template>
          <template #default="scope">
            <span style="white-space: nowrap;">
              是<el-checkbox :model-value="scope.row?.fangxingFlag === 'Y'" disabled />
              否<el-checkbox :model-value="scope.row?.fangxingFlag === 'N'" disabled />
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 物料批号 -->
      <el-table-column label="物料批号" width="80" align="center">
        <template #default="scope">{{ scope.row?.batchNumber || '' }}</template>
      </el-table-column>

      <!-- 实际发料量（表头换行） -->
      <el-table-column width="70" align="center">
        <template #header>
          <div style="line-height: 1.2;">实际<br/>发料量</div>
        </template>
        <template #default="scope">{{ scope.row?.actualQty || '' }}</template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column label="备 注" min-width="70" align="center">
        <template #default="scope">{{ scope.row?.remark || '' }}</template>
      </el-table-column>
    </el-table>

    <!-- ===== 第三行表格：签名行 ===== -->
    <el-table
      :data="[{}]"
      :show-header="false"
      border
      size="small"
      class="bottom-table"
    >
      <el-table-column width="130" align="center">
        <template #default>
          <span style="font-weight: normal;">领用人/日期：</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          {{ safeReceiving.receiveBy || '' }} / {{ safeReceiving.receiveDate ? parseTime(safeReceiving.receiveDate, '{y}-{m}-{d}') : '' }}
        </template>
      </el-table-column>
      <el-table-column width="130" align="center">
        <template #default>
          <span style="font-weight: normal;">发料人/日期：</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          {{ safeReceiving.deliveryBy || '' }} / {{ safeReceiving.deliveryDate ? parseTime(safeReceiving.deliveryDate, '{y}-{m}-{d}') : '' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { parseTime } from '@/utils/ruoyi'

const receiving = ref({})
const plan = ref({})

/** 安全访问：空对象兜底 */
const safeReceiving = computed(() => receiving.value || {})
const safePlan = computed(() => plan.value || {})

/** 固定展示 14 行物料明细，缺失行用空对象补齐 */
const displayItems = computed(() => {
  const items = safeReceiving.value.itemList || []
  const result = []
  for (let i = 0; i < 14; i++) {
    result.push(items[i] || {})
  }
  return result
})

/**
 * 打开组件
 * @param {Object|null} data 领料单详情（可为 null 预览空白模板）
 */
function open(data) {
  receiving.value = data || {}
  plan.value = data?.plan || {}
}

/** 重置为空白状态 */
function reset() {
  receiving.value = {}
  plan.value = {}
}

defineExpose({ open, reset })
</script>

<style scoped>
.view-container {
  height: 201mm;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 0 0px;
  box-sizing: border-box;
  color: #000;
}

.view-container :deep(.el-table) {
  color: #000;
}
.view-container :deep(.el-table th) {
  color: #000;
  font-weight: normal;
}

/* 物料类别复选框文字颜色黑色 */
.view-container :deep(.el-checkbox__label) {
  color: #000 !important;
}

.top-table {
  margin-bottom: -1px;
}
/* 第一行产品信息表格背景色设为第2行表头默认灰色 */
.top-table :deep(.el-table__body tr) {
  background-color: #f5f7fa !important;
}
.bottom-table :deep(.el-table__body tr) {
  background-color: #f5f7fa !important;
}

.mid-table {
  margin-top: -1px;
  margin-bottom: -1px;
}
.bottom-table {
  margin-top: -1px;
}

/* 允许表头文字正常换行 */
.mid-table :deep(.el-table__header) .cell {
  white-space: normal;
  word-break: break-all;
  line-height: 1.2;
}

/* 表头行高改为30px，同时背景色改为白色 */
.mid-table :deep(.el-table__header-wrapper th),
.mid-table :deep(.el-table__fixed-header-wrapper th) {
  height: 30px !important;
  background-color: #ffffff !important;
}

/* 收紧复选框，隐藏其自带的 label（只对表格内部生效） */
.mid-table :deep(.el-checkbox) {
  margin-left: 0px;
  margin-right: 8px;
}
.mid-table :deep(.el-checkbox__label) {
  display: none;
}

/* 所有选中复选框高亮（含物料类别 + 表格内） */
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}
.view-container :deep(.el-checkbox.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

/* 统一复选框圆角 */
.view-container :deep(.el-checkbox__inner) {
  border-radius: 2px;
}
</style>