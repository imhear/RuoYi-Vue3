<!--
  清场记录 处理对话框（可编辑版）
  基线：在最新版纯内容组件基础上改造
  改造：所有 Y/N 复选框改为可编辑，清场日期可编辑，签名行增加提交按钮
  交互：完全被动模式，emit 数据给父组件处理
-->
<template>
  <el-dialog v-model="visible" width="280mm" append-to-body @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">清场记录</span>
      </div>
    </template>

    <div v-if="form.cleaningId" class="view-container">

      <!-- ===== 公司名称 + 编号 ===== -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h4 style="flex: 1; text-align: center; margin: 0; font-size: 16px;">兰树化妆品股份有限公司</h4>
        <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SMP-S-08)-01</span>
      </div>

      <!-- 标题：清场记录 + 车间复选框（只读） -->
      <div style="text-align: center; margin-bottom: 4px; font-size: 15px;">
        清场记录（
        <label class="native-checkbox-after"><span>消毒</span><input type="checkbox" :checked="form.workshop === 'D'" disabled /></label>
        <label class="native-checkbox-after"><span>灌装</span><input type="checkbox" :checked="form.workshop === 'F'" disabled /></label>
        <label class="native-checkbox-after"><span>包装</span><input type="checkbox" :checked="form.workshop === 'P'" disabled /></label>
        <label class="native-checkbox-after"><span>组套</span><input type="checkbox" :checked="form.workshop === 'G'" disabled /></label>
        ）
      </div>

      <!-- ===== 产品信息（只读） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 170px;">
          <col>
          <col style="width: 100px;">
          <col style="width: 150px;">
          <col style="width: 120px;">
          <col style="width: 210px;">
        </colgroup>
        <tr>
          <td class="info-label">产品名称</td>
          <td class="info-value">{{ form.productName || '' }}</td>
          <td class="info-label">规格</td>
          <td class="info-value">{{ form.spec || '' }}</td>
          <td class="info-label">产品批号</td>
          <td class="info-value">{{ form.batchNumber || '' }}</td>
        </tr>
      </table>

      <!-- ===== 清场日期（可编辑） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 170px;">
          <col>
        </colgroup>
        <tr>
          <td class="info-label">清场日期</td>
          <td class="info-value" style="text-align: center;">
            <el-date-picker v-model="form.cleaningDate" type="date" value-format="YYYY-MM-DD" placeholder="选择清场日期" size="small" style="width: 180px;" />
          </td>
        </tr>
      </table>

      <!-- ===== 表头 ===== -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 170px;">
          <col>
          <col style="width: 120px;">
          <col style="width: 210px;">
        </colgroup>
        <tr>
          <td class="header-value">清场项目</td>
          <td class="header-value">清场要求</td>
          <td class="header-value">操作记录</td>
        <td class="header-value" style="border-bottom-color: #fff;"></td>
        </tr>
      </table>

      <!-- ===== 清场检查项（可编辑复选框） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 170px;">
          <col>
          <col style="width: 120px;">
          <col style="width: 210px;">
        </colgroup>

        <!-- 1. 更换状态标识 -->
        <tr style="height: 28px;">
          <td class="td-step-label">更换状态标识</td>
          <td class="td-require">更换设备状态标识</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.statusLabelReplaceFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.statusLabelReplaceFlag" true-value="N" false-value="Y" /></label>
          </td>
          <td class="td-sign" rowspan="13" style="border-top-color: #fff;">
            <!-- 签名显示，根据显示开关控制 -->
            <div v-if="form.operateShowHide !== '1'">操作人：{{ form.operator || '' }}</div>
            <div v-if="form.operatorTime" style="color: gray; font-size: 12px;">{{ form.operatorTime ? form.operatorTime.substring(0, 16) : '' }}</div>
            <br><br>
            <div v-if="form.reviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.reviewer || '' }}</div>
            <div v-if="form.reviewerTime" style="color: gray; font-size: 12px;">{{ form.reviewerTime ? form.reviewerTime.substring(0, 16) : '' }}</div>
            <br><br>
            <div v-if="form.inspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.inspector || '' }}</div>
            <div v-if="form.inspectorTime" style="color: gray; font-size: 12px;">{{ form.inspectorTime ? form.inspectorTime.substring(0, 16) : '' }}</div>
            <!-- 处理按钮：操作人未提交且显示，或检查按钮显示且检查人未提交时显示 -->
            <div v-if="(form.operateShowHide === '0' && !form.operatorTime) || (form.operateShowHide === '0' && form.inspectShowHide === '0' && !form.inspectorTime)" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmit">提交</el-button>
            </div>
          </td>
        </tr>

        <!-- 2-4. 物料清除 -->
        <tr style="height: 28px;">
          <td class="td-step-label" rowspan="3">物料清除</td>
          <td class="td-require">移出工序产品</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.materialRemoveProductFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.materialRemoveProductFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>
        <tr style="height: 28px;">
          <td class="td-require">移出剩余物料及不合格物料</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.materialRemoveResidualFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.materialRemoveResidualFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>
        <tr style="height: 28px;">
          <td class="td-require">无本批残留物</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.materialRemoveBatchResidueFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.materialRemoveBatchResidueFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>

        <!-- 5-6. 场所清洁 -->
        <tr style="height: 28px;">
          <td class="td-step-label" rowspan="2">场所清洁</td>
          <td class="td-require">地面无积水、无粉尘、无污物</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.siteCleanFloorFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.siteCleanFloorFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>
        <tr style="height: 28px;">
          <td class="td-require">门窗、内墙、顶棚、灯具、管道、线路等清洁干净</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.siteCleanStructureFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.siteCleanStructureFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>

        <!-- 7-8. 设备清洁 -->
        <tr style="height: 28px;">
          <td class="td-step-label" rowspan="2">设备清洁</td>
          <td class="td-require">无粉尘、无油污</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.equipCleanDustOilFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.equipCleanDustOilFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>
        <tr style="height: 28px;">
          <td class="td-require">设备见本色、光亮、洁净</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.equipCleanOriginalColorFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.equipCleanOriginalColorFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>

        <!-- 9. 工器具清洁 -->
        <tr style="height: 28px;">
          <td class="td-step-label">工器具清洁</td>
          <td class="td-require">无粉尘、无污物，洁净见本色</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.toolCleanDustDirtFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.toolCleanDustDirtFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>

        <!-- 10-11. 设施清洁 -->
        <tr style="height: 28px;">
          <td class="td-step-label" rowspan="2">设施清洁</td>
          <td class="td-require">无粉尘、无污物、干净见本色</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.facilityCleanDustDirtFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.facilityCleanDustDirtFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>
        <tr style="height: 28px;">
          <td class="td-require">摆放整齐</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.facilityCleanArrangementFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.facilityCleanArrangementFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>

        <!-- 12. 其它 -->
        <tr style="height: 28px;">
          <td class="td-step-label">其 它</td>
          <td class="td-require">洁 净</td>
          <td class="td-record">
            <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.otherCleanStatusFlag" true-value="Y" false-value="N" /></label>
            <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.otherCleanStatusFlag" true-value="N" false-value="Y" /></label>
          </td>
        </tr>
      </table>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const currentCleaningId = ref(null)

/** 表单数据（由父组件 open(data) 传入） */
const form = reactive({
  cleaningId: null,
  workshop: '',
  productName: '', spec: '', batchNumber: '',
  cleaningDate: null,
  // 显示开关
  operateShowHide: '', reviewShowHide: '', inspectShowHide: '',
  // 签名及时间
  operator: '', reviewer: '', inspector: '',
  operatorTime: null, reviewerTime: null, inspectorTime: null,
  // 清场检查项
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

/**
 * 打开对话框，接收父组件传入的完整数据
 * @param {Object} data - 清场记录详情数据
 */
function open(data) {
  currentCleaningId.value = data.cleaningId
  // 清空旧数据
  Object.keys(form).forEach(key => {
    if (key !== 'cleaningId' && key !== 'workshop') form[key] = null
  })
  // 赋值新数据
  Object.assign(form, data)
  visible.value = true
}

/** 处理提交：emit 数据给父组件处理 */
function handleSubmit() {
  emit('cleaningSubmit', {
    cleaningId: currentCleaningId.value,
    cleaningDate: form.cleaningDate,
    statusLabelReplaceFlag: form.statusLabelReplaceFlag,
    materialRemoveProductFlag: form.materialRemoveProductFlag,
    materialRemoveResidualFlag: form.materialRemoveResidualFlag,
    materialRemoveBatchResidueFlag: form.materialRemoveBatchResidueFlag,
    siteCleanFloorFlag: form.siteCleanFloorFlag,
    siteCleanStructureFlag: form.siteCleanStructureFlag,
    equipCleanDustOilFlag: form.equipCleanDustOilFlag,
    equipCleanOriginalColorFlag: form.equipCleanOriginalColorFlag,
    toolCleanDustDirtFlag: form.toolCleanDustDirtFlag,
    facilityCleanDustDirtFlag: form.facilityCleanDustDirtFlag,
    facilityCleanArrangementFlag: form.facilityCleanArrangementFlag,
    otherCleanStatusFlag: form.otherCleanStatusFlag
  })
}

function handleClosed() {
  currentCleaningId.value = null
}

function close() { visible.value = false }

const emit = defineEmits(['cleaningSubmit', 'submit'])
defineExpose({ open, close })
</script>

<style scoped>
/* ============================================================
   容器
   ============================================================ */
.view-container {
  max-height: 75vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px;
  padding-bottom: 2px;
  box-sizing: border-box;
  color: #000;
  transform: translateZ(0);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.view-container::-webkit-scrollbar { display: none; }

/* ============================================================
   所有一行表格的基础样式
   ============================================================ */
.row-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  table-layout: fixed;
  margin-bottom: -1px;
}

/* ============================================================
   产品信息表格 / 清场日期表格
   ============================================================ */
.info-table td {
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
.info-value {
  font-size: 14px;
  text-align: center;
}

/* ============================================================
   表头表格
   ============================================================ */
.header-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: middle;
  box-sizing: border-box;
}
.header-value {
  font-weight: normal;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
  vertical-align: middle !important;
}

/* ============================================================
   清场检查项表格外层样式
   ============================================================ */
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 1px 1px;
  vertical-align: top;
  box-sizing: border-box;
}

/* ============================================================
   第一列：清场项目列 170px，水平居中、垂直居中
   ============================================================ */
.td-step-label {
  font-weight: normal;
  text-align: center;
  vertical-align: middle !important;
  font-size: 14px;
}
/* 清场要求列 */
.td-require {
  font-size: 14px;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 8px;
}
/* 操作记录列：水平居中、垂直居中 */
.td-record {
  font-size: 13px;
  text-align: center;
  vertical-align: middle !important;
  padding: 4px 8px;
}
/* 签名列：垂直居中 */
.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
}

/* ============================================================
   原生复选框样式（文字在前、复选框在后）
   ============================================================ */
.native-checkbox-after {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  color: #000;
  font-weight: normal;
  user-select: none;
}
.native-checkbox-after input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.native-checkbox-after span::after {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-left: 4px;
  vertical-align: middle;
  box-sizing: border-box;
  background: #fff;
}
.native-checkbox-after:has(input:checked) span::after {
  background-color: #409eff;
  border-color: #409eff;
}
.native-checkbox-after:has(input:checked) span::before {
  content: '';
  position: absolute;
  right: 4px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  z-index: 1;
}
.native-checkbox-after span {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.native-checkbox-after + .native-checkbox-after {
  margin-left: 20px;
}
</style>