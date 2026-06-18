<!--
  灌装包材处理记录1 处理对话框
  完全被动模式，内部渲染所有可编辑字段，提交时 emit 数据
-->
<template>
  <el-dialog v-model="visible" width="300mm" append-to-body @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">灌装包材处理记录1</span>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </div>
    </template>

    <div v-if="form.recordId" class="view-container">

      <!-- ===== 主表基本信息（只读） ===== -->
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="工单号">{{ form.orderNum || '' }}</el-descriptions-item>
        <el-descriptions-item label="排产单号">{{ form.planCode || '' }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ form.productName || '' }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ form.spec || '' }}</el-descriptions-item>
        <el-descriptions-item label="产品批号">{{ form.batchNumber || '' }}</el-descriptions-item>
      </el-descriptions>

      <!-- ===== Step1：开工前检查 ===== -->
      <el-divider content-position="left">{{ form.s1StepName || '步骤1：开工前检查' }}</el-divider>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="开始时间">
          <el-date-picker v-model="form.s1StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          <el-date-picker v-model="form.s1EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="检查是否合格">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s1QualifiedFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s1QualifiedFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="一般区温度（℃）">
          <el-input v-model="form.s1NormalAreaTemperature" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="一般区湿度（%）">
          <el-input v-model="form.s1NormalAreaHumidity" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="不合格情况说明">
          <el-input v-model="form.s1Remark" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="洁净区温度（℃）">
          <el-input v-model="form.s1CleanAreaTemperature" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="洁净区湿度（%）">
          <el-input v-model="form.s1CleanAreaHumidity" size="small" />
        </el-descriptions-item>
      </el-descriptions>

      <!-- ===== Step2 ===== -->
      <el-divider content-position="left">{{ form.s2StepName || '步骤2' }}</el-divider>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="开始时间">
          <el-date-picker v-model="form.s2StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          <el-date-picker v-model="form.s2EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否臭氧消毒">
          <el-checkbox v-model="form.s2OzoneDesinfectionFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否高温消毒">
          <el-checkbox v-model="form.s2HighDesinfectionTemperatureFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用臭氧机">
          <el-checkbox v-model="form.s2OzoneGeneratorFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧机编号">
          <el-input v-model="form.s2OzoneGeneratorNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用洗瓶机">
          <el-checkbox v-model="form.s2BottleWashingMachineFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="洗瓶机编号">
          <el-input v-model="form.s2BottleWashingMachineNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用吹瓶机">
          <el-checkbox v-model="form.s2BottleBlowingMachineFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="吹瓶机编号">
          <el-input v-model="form.s2BottleBlowingMachineNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用气枪">
          <el-checkbox v-model="form.s2AirGunFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否手动洗">
          <el-checkbox v-model="form.s2ManualWashingFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用烘洗一体机">
          <el-checkbox v-model="form.s2WasherDryerComboFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="烘洗一体机编号">
          <el-input v-model="form.s2WasherDryerComboNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="消毒臭氧浓度（ppm）">
          <el-input v-model="form.s2OzoneConcentration" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧消毒开始时间">
          <el-time-picker v-model="form.s2OzoneDesinfectionStartTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧消毒结束时间">
          <el-time-picker v-model="form.s2OzoneDesinfectionEndTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧消毒时间（分钟）">
          <el-input v-model="form.s2OzoneDesinfectionCost" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="烘干消毒温度（℃）">
          <el-input v-model="form.s2DryingDesinfectionTemperature" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="烘干消毒开始时间">
          <el-time-picker v-model="form.s2DryingDesinfectionStartTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="烘干消毒结束时间">
          <el-time-picker v-model="form.s2DryingDesinfectionEndTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="烘干消毒时间（分钟）">
          <el-input v-model="form.s2DryingDesinfectionCost" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="高温烘干消毒温度（℃）">
          <el-input v-model="form.s2HighDryingDesinfectionTemperature" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="高温烘干消毒开始时间">
          <el-time-picker v-model="form.s2HighDryingDesinfectionStartTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="高温烘干消毒结束时间">
          <el-time-picker v-model="form.s2HighDryingDesinfectionEndTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="高温烘干消毒时间（分钟）">
          <el-input v-model="form.s2HighDryingDesinfectionCost" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="干净干燥完好">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s2WaiguanFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s2WaiguanFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="洗瓶用水是否纯化水">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s2PurifiedWaterFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s2PurifiedWaterFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="无此项">
          <el-checkbox v-model="form.s2NoPurifiedWaterFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否装入洁净袋">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s2CleanBagFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s2CleanBagFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- ===== Step3 ===== -->
      <el-divider content-position="left">{{ form.s3StepName || '步骤3' }}</el-divider>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="开始时间">
          <el-date-picker v-model="form.s3StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          <el-date-picker v-model="form.s3EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否臭氧消毒">
          <el-checkbox v-model="form.s3OzoneDesinfectionFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否风淋消毒">
          <el-checkbox v-model="form.s3AirShowerFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用臭氧机">
          <el-checkbox v-model="form.s3OzoneGeneratorFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧机编号">
          <el-input v-model="form.s3OzoneGeneratorNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用洗瓶机">
          <el-checkbox v-model="form.s3BottleWashingMachineFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="洗瓶机编号">
          <el-input v-model="form.s3BottleWashingMachineNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用吹瓶机">
          <el-checkbox v-model="form.s3BottleBlowingMachineFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="吹瓶机编号">
          <el-input v-model="form.s3BottleBlowingMachineNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否使用风淋室">
          <el-checkbox v-model="form.s3AirShowerMachineFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="风淋室编号">
          <el-input v-model="form.s3AirShowerMachineNumber" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="消毒臭氧浓度（ppm）">
          <el-input v-model="form.s3OzoneConcentration" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧消毒开始时间">
          <el-time-picker v-model="form.s3OzoneDesinfectionStartTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧消毒结束时间">
          <el-time-picker v-model="form.s3OzoneDesinfectionEndTime" value-format="HH:mm:ss" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="臭氧消毒时间（分钟）">
          <el-input v-model="form.s3OzoneDesinfectionCost" size="small" />
        </el-descriptions-item>
        <el-descriptions-item label="是否75%酒精消毒">
          <el-checkbox v-model="form.s3AlcoholDesinfectionFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="是否紫外线消毒">
          <el-checkbox v-model="form.s3UvDesinfectionFlag" true-value="Y" false-value="N" />
        </el-descriptions-item>
        <el-descriptions-item label="内包装是否完整">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s3AirShowerInnerPackagingFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s3AirShowerInnerPackagingFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="干净干燥完好">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s3WaiguanFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s3WaiguanFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="是否装入洁净袋">
          <span style="white-space: nowrap;">
            是<el-checkbox v-model="form.s3CleanBagFlag" true-value="Y" false-value="N" />
            否<el-checkbox v-model="form.s3CleanBagFlag" true-value="N" false-value="Y" />
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- ===== Step4：物料使用统计 ===== -->
      <el-divider content-position="left">{{ form.s4StepName || '步骤4：物料使用统计' }}</el-divider>
      <el-table :data="form.step4List || []" border size="small">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="物料编码" width="100">
          <template #default="scope"><el-input v-model="scope.row.materialCode" size="small" /></template>
        </el-table-column>
        <el-table-column label="物料名称" min-width="120">
          <template #default="scope"><el-input v-model="scope.row.materialName" size="small" /></template>
        </el-table-column>
        <el-table-column label="规格" width="80">
          <template #default="scope"><el-input v-model="scope.row.spec" size="small" /></template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template #default="scope"><el-input v-model="scope.row.unit" size="small" /></template>
        </el-table-column>
        <el-table-column label="领入量" width="80">
          <template #default="scope"><el-input v-model="scope.row.receiveQty" size="small" /></template>
        </el-table-column>
        <el-table-column label="使用量" width="80">
          <template #default="scope"><el-input v-model="scope.row.useQty" size="small" /></template>
        </el-table-column>
        <el-table-column label="损耗量" width="80">
          <template #default="scope"><el-input v-model="scope.row.lossQty" size="small" /></template>
        </el-table-column>
        <el-table-column label="剩余量" width="80">
          <template #default="scope"><el-input v-model="scope.row.remainQty" size="small" /></template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const currentRecordId = ref(null)

const form = reactive({
  recordId: null,
  orderNum: '',
  planCode: '',
  productName: '',
  spec: '',
  batchNumber: '',
  // Step1
  s1StepName: '', s1StartTime: null, s1EndTime: null, s1QualifiedFlag: '',
  s1NormalAreaTemperature: '', s1NormalAreaHumidity: '', s1Remark: '',
  s1CleanAreaTemperature: '', s1CleanAreaHumidity: '',
  // Step2
  s2StepName: '', s2StartTime: null, s2EndTime: null,
  s2OzoneDesinfectionFlag: '', s2HighDesinfectionTemperatureFlag: '', s2OzoneGeneratorFlag: '',
  s2OzoneGeneratorNumber: '', s2BottleWashingMachineFlag: '', s2BottleWashingMachineNumber: '',
  s2BottleBlowingMachineFlag: '', s2BottleBlowingMachineNumber: '', s2AirGunFlag: '',
  s2ManualWashingFlag: '', s2WasherDryerComboFlag: '', s2WasherDryerComboNumber: '',
  s2OzoneConcentration: '', s2OzoneDesinfectionStartTime: null, s2OzoneDesinfectionEndTime: null,
  s2OzoneDesinfectionCost: '', s2DryingDesinfectionTemperature: '',
  s2DryingDesinfectionStartTime: null, s2DryingDesinfectionEndTime: null, s2DryingDesinfectionCost: '',
  s2HighDryingDesinfectionTemperature: '', s2HighDryingDesinfectionStartTime: null,
  s2HighDryingDesinfectionEndTime: null, s2HighDryingDesinfectionCost: '',
  s2WaiguanFlag: '', s2PurifiedWaterFlag: '', s2NoPurifiedWaterFlag: '', s2CleanBagFlag: '',
  // Step3
  s3StepName: '', s3StartTime: null, s3EndTime: null,
  s3OzoneDesinfectionFlag: '', s3AirShowerFlag: '', s3OzoneGeneratorFlag: '',
  s3OzoneGeneratorNumber: '', s3BottleWashingMachineFlag: '', s3BottleWashingMachineNumber: '',
  s3BottleBlowingMachineFlag: '', s3BottleBlowingMachineNumber: '',
  s3AirShowerMachineFlag: '', s3AirShowerMachineNumber: '',
  s3OzoneConcentration: '', s3OzoneDesinfectionStartTime: null, s3OzoneDesinfectionEndTime: null,
  s3OzoneDesinfectionCost: '', s3AlcoholDesinfectionFlag: '', s3UvDesinfectionFlag: '',
  s3AirShowerInnerPackagingFlag: '', s3WaiguanFlag: '', s3CleanBagFlag: '',
  // Step4
  step4List: []
})

/** 打开对话框 */
function open(data) {
  currentRecordId.value = data.recordId
  // 将 data 中所有字段浅拷贝到 form
  Object.assign(form, data)
  // 确保子表至少有3行
  if (!form.step4List || form.step4List.length === 0) {
    form.step4List = []
    for (let i = 0; i < 3; i++) {
      form.step4List.push({ materialCode: '', materialName: '', spec: '', unit: '', receiveQty: '', useQty: '', lossQty: '', remainQty: '' })
    }
  }
  visible.value = true
}

/** 提交 */
function handleSubmit() {
  emit('submit', { recordId: currentRecordId.value, ...form })
}

function handleClosed() {
  currentRecordId.value = null
}

function close() {
  visible.value = false
}

const emit = defineEmits(['submit'])

defineExpose({ open, close })
</script>

<style scoped>
.view-container {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 8px;
}
</style>