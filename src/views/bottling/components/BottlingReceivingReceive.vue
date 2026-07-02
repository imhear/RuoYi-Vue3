<!--
  领料对话框（纯被动模式）
  接收完整数据，提交时校验并 emit，不调用后端
  改造：物料名称、规格、单位改为下拉选择，数据字典对应 receiving_material、receiving_spec、pro_unit
-->
<template>
  <el-dialog v-model="visible" width="300mm" append-to-body @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">领料单</span>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </div>
    </template>

    <div v-if="receiving" class="view-container">
      <!-- 公司名称 + 编号 -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 0px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 12px;">编号：{{ plan?.fileTemplateCode || 'R-(LS-SOP-S-G-001)-01' }}</span>
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

      <!-- 第一行表格：产品信息 -->
      <el-table :data="[{}]" :show-header="false" border size="small" class="top-table">
        <el-table-column width="120" align="center">
          <template #default><span style="font-weight: bold;">产品名称</span></template>
        </el-table-column>
        <el-table-column width="331">
          <template #default>{{ plan?.productName || '' }}</template>
        </el-table-column>
        <el-table-column width="80" align="center">
          <template #default><span style="font-weight: bold;">规格</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>{{ plan?.spec || '' }}</template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template #default><span style="font-weight: bold;">产品批号</span></template>
        </el-table-column>
        <el-table-column>
          <template #default>{{ plan?.batchNumber || '' }}</template>
        </el-table-column>
      </el-table>

      <!-- 第二行表格：可编辑物料明细 -->
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
        <!-- 物料名称改为下拉选择 -->
        <el-table-column label="物料名称" min-width="120" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.materialName" size="small" placeholder="请选择" clearable>
              <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>
        <!-- 规格改为下拉选择 -->
        <el-table-column label="规格" width="90" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.spec" size="small" placeholder="请选择" clearable>
              <el-option v-for="dict in receiving_spec" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>
        <!-- 单位改为下拉选择 -->
        <el-table-column label="单位" width="60" align="center">
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
        <el-table-column label="备 注" min-width="70" align="center">
          <template #default="scope"><el-input v-model="scope.row.remark" size="small" /></template>
        </el-table-column>
      </el-table>

      <!-- 第三行表格：签名行（可编辑） -->
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
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const receiving = ref(null)
const plan = ref(null)
const currentReceivingId = ref(null)

const editForm = reactive({
  receiveBy: '',
  receiveDate: null,
  deliveryBy: '',
  deliveryDate: null
})

const displayItems = ref([])

// 引入数据字典
const { receiving_material, receiving_spec, pro_unit } = proxy.useDict('receiving_material', 'receiving_spec', 'pro_unit')

/** 打开对话框，接收完整数据（含 plan） */
async function open(data) {
  currentReceivingId.value = data.receivingId
  receiving.value = data
  plan.value = data.plan || null
  visible.value = true

  // 初始化物料行，不足14行补空
  const items = data.itemList || []
  const rows = []
  for (let i = 0; i < 14; i++) {
    if (items[i]) {
      rows.push({ ...items[i] })
    } else {
      rows.push({ materialName: '', spec: '', unit: '', requireQty: '', baozhuangFlag: null, biaoqianFlag: null, waiguanFlag: null, fangxingFlag: null, batchNumber: '', actualQty: '', remark: '' })
    }
  }
  displayItems.value = rows

  // 初始化签名行
  editForm.receiveBy = data.receiveBy || ''
  editForm.receiveDate = data.receiveDate || null
  editForm.deliveryBy = data.deliveryBy || ''
  editForm.deliveryDate = data.deliveryDate || null
}

/** 提交前校验，返回 true 通过，false 失败 */
function beforeSubmitCheck() {
  // 1. 领料人/发料人去空格
  if (editForm.receiveBy) editForm.receiveBy = editForm.receiveBy.replace(/\s/g, '');
  if (editForm.deliveryBy) editForm.deliveryBy = editForm.deliveryBy.replace(/\s/g, '');

  // 2. 领料人/发料人必填校验
  if (!editForm.receiveBy || editForm.receiveBy === '') {
    proxy.$modal.msgError('领料人不能为空');
    return false;
  }
  if (!editForm.deliveryBy || editForm.deliveryBy === '') {
    proxy.$modal.msgError('发料人不能为空');
    return false;
  }

  // 3. 领料日期/发料日期必选校验
  if (!editForm.receiveDate) {
    proxy.$modal.msgError('领料日期不能为空');
    return false;
  }
  if (!editForm.deliveryDate) {
    proxy.$modal.msgError('发料日期不能为空');
    return false;
  }

  // 4. 所有字段去除全部空格
  for (const item of displayItems.value) {
    if (item.materialName) item.materialName = item.materialName.replace(/\s/g, '');
    if (item.spec) item.spec = item.spec.replace(/\s/g, '');
    if (item.unit) item.unit = item.unit.replace(/\s/g, '');
    if (item.batchNumber) item.batchNumber = item.batchNumber.replace(/\s/g, '');
    if (item.remark) item.remark = item.remark.replace(/\s/g, '');
    if (item.requireQty) item.requireQty = String(item.requireQty).replace(/\s/g, '');
    if (item.actualQty) item.actualQty = String(item.actualQty).replace(/\s/g, '');
  }

  // 5. 物料明细校验
  const numberPattern = /^\d+(\.\d+)?$/;
  let foundEmpty = false;
  let hasItem = false;

  for (let i = 0; i < displayItems.value.length; i++) {
    const item = displayItems.value[i];
    const rowNum = i + 1;
    const isEmpty = !item.materialName && !item.spec && !item.unit &&
                    !item.requireQty && !item.baozhuangFlag && !item.biaoqianFlag &&
                    !item.waiguanFlag && !item.fangxingFlag && !item.batchNumber &&
                    !item.actualQty && !item.remark;

    if (isEmpty) {
      foundEmpty = true;
    } else {
      hasItem = true;
      if (foundEmpty) {
        proxy.$modal.msgError(`第${rowNum}行之前存在空行，请按顺序连续填写物料明细`);
        return false;
      }
      if (!item.materialName || item.materialName === '') {
        proxy.$modal.msgError(`第${rowNum}行物料名称不能为空`);
        return false;
      }
      if (!item.requireQty || String(item.requireQty).trim() === '') {
        proxy.$modal.msgError(`第${rowNum}行计划领用量不能为空`);
        return false;
      }
      if (!item.batchNumber || item.batchNumber === '') {
        proxy.$modal.msgError(`第${rowNum}行物料批号不能为空`);
        return false;
      }
      if (!item.actualQty || String(item.actualQty).trim() === '') {
        proxy.$modal.msgError(`第${rowNum}行实际发料量不能为空`);
        return false;
      }
      const reqVal = String(item.requireQty).trim();
      if (!numberPattern.test(reqVal) || Number(reqVal) <= 0) {
        proxy.$modal.msgError(`第${rowNum}行计划领用量必须为正数`);
        return false;
      }
      const actVal = String(item.actualQty).trim();
      if (!numberPattern.test(actVal) || Number(actVal) <= 0) {
        proxy.$modal.msgError(`第${rowNum}行实际发料量必须为正数`);
        return false;
      }
    }
  }

  if (!hasItem) {
    proxy.$modal.msgError('请至少填写一条物料明细');
    return false;
  }
  return true;
}

/** 提交：校验通过后 emit 数据给父组件 */
function handleSubmit() {
  if (!beforeSubmitCheck()) return;

  const itemList = displayItems.value.filter(item =>
    item.materialName || item.spec || item.unit || item.batchNumber || item.remark
  );

  emit('submit', {
    receivingId: currentReceivingId.value,
    receiveBy: editForm.receiveBy,
    receiveDate: editForm.receiveDate,
    deliveryBy: editForm.deliveryBy,
    deliveryDate: editForm.deliveryDate,
    itemList
  });
}

function handleClosed() {
  receiving.value = null;
  plan.value = null;
  displayItems.value = [];
}

function close() {
  visible.value = false;
}

const emit = defineEmits(['submit']);

defineExpose({ open, close });
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