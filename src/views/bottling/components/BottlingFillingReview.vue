<!--
  灌装生产记录1 复核对话框（全部只读，签名列可点击复核按钮）
  宽度 300mm，完全被动模式，子组件 emit 数据给父组件
-->
<template>
  <el-dialog v-model="visible" title="灌装生产记录复核" width="300mm" append-to-body @closed="handleClosed">
    <div v-if="form" class="view-container">

      <!-- 公司名称 + 编号 + 标题 -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h2 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h2>
        <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-004)-01</span>
      </div>
      <div style="font-size: 18px; text-align: center; margin-bottom: 4px; margin-left: -100px;">灌装生产记录</div>

      <!-- 产品信息 -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 280px;">
          <col style="width: 70px;"><col>
          <col style="width: 210px;"><col style="width: 100px;">
        </colgroup>
        <tr>
          <td class="info-label">产品名称</td>
          <td class="info-label">{{ form.productName || '' }}</td>
          <td class="info-label">规格</td>
          <td class="info-label">{{ form.spec || '' }}</td>
          <td class="info-label">产品批号</td>
          <td class="info-label">{{ form.batchNumber || '' }}</td>
        </tr>
      </table>

      <!-- 起止时间 + 灌装首件确认（只读） -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 500px;">
          <col><col style="width: 310px;">
        </colgroup>
        <tr style="height: 28px;">
          <td class="info-label" style="font-weight: normal;">起止时间</td>
          <td class="info-label" style="text-align: center; font-weight: normal;">
            {{ form.fillingStartTime ? parseTime(form.fillingStartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
            {{ form.fillingStartTime && form.fillingEndTime ? ' 至 ' : '' }}
            {{ form.fillingEndTime ? parseTime(form.fillingEndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
          </td>
          <td class="info-label" style="font-weight: normal;">灌装首件确认</td>
          <td class="info-label" style="text-align: left; font-weight: normal;">
            <label class="native-checkbox-before" style="vertical-align: middle;">
              <input type="checkbox" :checked="form.firstQualifiedFlag === 'Y'" disabled />
              <span>符合规定</span>
            </label>
            <label class="native-checkbox-before" style="margin-left: 20px; vertical-align: middle;">
              <input type="checkbox" :checked="form.firstQualifiedFlag === 'N'" disabled />
              <span>不符合规定</span>
            </label>
            <span style="margin-left: 10px; vertical-align: middle;">
              检查人：<template v-if="form.firstQualifiedInspector && form.firstQualifiedInspectorTime">{{ form.firstQualifiedInspector }}</template>
            </span>
          </td>
        </tr>
      </table>

      <!-- 表头 -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 100px;">
        </colgroup>
        <tr>
          <td class="header-value">操作项目</td>
          <td class="header-value">工艺要求</td>
          <td class="header-value">操作记录</td>
          <td class="header-value">/</td>
        </tr>
      </table>

      <!-- ========== Step1 开工前检查（只读） ========== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 100px;">
        </colgroup>
        <tr style="height: 120px;">
          <td class="td-step-label">1.开工前<br/>检查</td>
          <td class="td-requirement" style="text-align: left; vertical-align: middle;">
            1）操作间温度18～26℃相对湿度 45%～65%；<br/>
            2）该批次生产记录齐全；<br/>
            3）人员、环境卫生符合要求；<br/>
            4）操作间及设备已清洁；<br/>
            5）岗位操作规程、设备操作规程、灌包工艺规程齐全；<br/>
            6）物料准备齐全。
          </td>
          <!-- 操作记录列：只读（复用纯内容组件） -->
          <td class="td-record" style="text-align: left; vertical-align: middle; font-size: 14px;">
            温湿度：{{ form.s1CleanAreaTemperature || '' }}℃ ， {{ form.s1CleanAreaHumidity || '' }}% ；检查是否合格：
            <label class="native-checkbox-after" style="font-size: 12px;">
              <span>是</span>
              <input type="checkbox" :checked="form.s1QualifiedFlag === 'Y'" disabled />
            </label>
            <label class="native-checkbox-after" style="font-size: 12px;">
              <span>否</span>
              <input type="checkbox" :checked="form.s1QualifiedFlag === 'N'" disabled />
            </label>
            <br/><br/>
            不合格情况说明及处理方式：<br/>
            {{ form.s1Remark || '' }}
          </td>
          <!-- 签名列：显示操作人/检查人签名，复核人位置添加复核按钮 -->
          <td class="td-sign">
            <div v-if="form.s1OperateShowHide !== '1'">操作人：{{ form.s1Operator || '' }}</div>
            <div v-if="form.s1OperatorTime" style="color: gray; font-size: 12px;">{{ form.s1OperatorTime ? form.s1OperatorTime.substring(0, 16) : '' }}</div>
            <!-- 复核人 -->
            <div v-if="form.s1ReviewShowHide !== '1'" style="margin-top: 8px;">
              复核人：{{ form.s1Reviewer || '' }}
              <div v-if="form.s1ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s1ReviewerTime.substring(0, 16) }}</div>
            </div>
            <div v-if="form.s1InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s1Inspector || '' }}</div>
            <div v-if="form.s1InspectorTime" style="color: gray; font-size: 12px;">{{ form.s1InspectorTime ? form.s1InspectorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s1ReviewShowHide !== '1' && !form.s1InspectorTime" style="margin-top: 4px;">
                <el-button type="success" size="small" @click="handleStep1Review">复核</el-button>
            </div>
          </td>
        </tr>
      </table>

      <!-- ========== Step2 设备、容器、工具处理（只读） ========== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 100px;">
        </colgroup>
        <tr style="height: 100px;">
          <td class="td-step-label">2.设备、容<br/>器、工具处<br/>理</td>
          <td class="td-requirement" style="text-align: left; vertical-align: middle; line-height: 1.5;">
            检查主要生产设备、容器、工器具清洁消毒效期，在有<br/>
            效期内的使用前用纯化水清洗，超过清洁消毒效期的用<br/>
            纯化水清洁后，再用75%酒精或其他消毒液或CIP热水<br/>
            消毒。
          </td>
          <td class="td-record" style="text-align: left; vertical-align: middle; font-size: 13px; line-height: 2.0;">
            &nbsp;&nbsp;&nbsp;1） 主要设备名称/编码：{{ form.s2MainEquipName || '' }} / {{ form.s2MainEquipNo || '' }}<br/>
            &nbsp;&nbsp;&nbsp;2） 检查是否在清洁消毒有效期内：<br/>
            &nbsp;&nbsp;
            <label class="native-checkbox-before" style="font-size: 13px;">
              <input type="checkbox" :checked="form.s2PurifiedWaterFlag === 'Y'" disabled />
              <span>在清洁效期内:使用纯化水清洗；</span>
            </label>
            <br/>
            &nbsp;&nbsp;
            <label class="native-checkbox-before" style="font-size: 13px;">
              <input type="checkbox" :checked="form.s2ReCleanDisinfectFlag === 'Y'" disabled />
              <span style="font-size: 13px;">超过清洁效期:重新清洁消毒。清洁方式：{{ form.s2CleaningMethod || '' }}，消毒方式：{{ form.s2DesinfectionMethod || '' }}</span> 
            </label>
          </td>
          <td class="td-sign">
            <div v-if="form.s2OperateShowHide !== '1'">操作人：{{ form.s2Operator || '' }}</div>
            <div v-if="form.s2OperatorTime" style="color: gray; font-size: 12px;">{{ form.s2OperatorTime ? form.s2OperatorTime.substring(0, 16) : '' }}</div>
            <!-- 复核人 -->
            <div v-if="form.s2ReviewShowHide !== '1'" style="margin-top: 8px;">
              复核人：{{ form.s2Reviewer || '' }}
              <div v-if="form.s2ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s2ReviewerTime.substring(0, 16) }}</div>
            </div>
            <div v-if="form.s2InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s2Inspector || '' }}</div>
            <div v-if="form.s2InspectorTime" style="color: gray; font-size: 12px;">{{ form.s2InspectorTime ? form.s2InspectorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s2ReviewShowHide !== '1' && !form.s2ReviewerTime" style="margin-top: 4px;">
                <el-button type="success" size="small" @click="handleStep2Review">复核</el-button>
            </div>
          </td>
        </tr>
      </table>

      <!-- ========== Step3 灌装（只读） ========== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 350px;">
          <col><col style="width: 100px;">
        </colgroup>
        <tr style="height: auto;">
          <td class="td-step-label">3.灌装</td>
          <td class="td-requirement" style="text-align: left; vertical-align: middle; line-height: 2.0;">
            1）先用少量料液冲洗设备；<br/>
            2） 装量调节:按照产品规格/净含量，设定装量，称量、<br/>
            微调校正至合格范围；<br/>
            3）检查每个灌装头对应外包半成品的装量和外观；<br/>
            4） 有打码的产品，需按照生产指令，调整打印内容。<br/>
            5）开始灌装；<br/>
            6）随时检查装量和外观，每2小时记录一次。
          </td>
          <td class="td-no-padding" style="vertical-align: top;">
            <div style="padding: 6px 6px 0 6px; font-size: 12px;">
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="white-space: nowrap; margin-right: 8px;">1) 是否用料液冲洗:</span>
                <label class="native-checkbox-after" style="font-size: 11px;">
                  <span>是</span>
                  <input type="checkbox" :checked="form.s3UseMaterialLiquidRinseFlag === 'Y'" disabled />
                </label>
                <label class="native-checkbox-after" style="font-size: 11px;">
                  <span>否</span>
                  <input type="checkbox" :checked="form.s3UseMaterialLiquidRinseFlag === 'N'" disabled />
                </label>
                <span style="margin-left: 30px; white-space: nowrap; margin-right: 8px;">2) 净含量范围:</span>
                <span>{{ form.s3NetContentRangeLower }} - {{ form.s3NetContentRangeUpper }} {{ form.s3NetContentUnit || 'g' }}</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="white-space: nowrap; margin-right: 8px;">3) 打码方式:</span>
                <label class="native-checkbox-before" style="font-size: 12px;">
                  <input type="checkbox" :checked="form.s3InkPrintCodeFlag === 'Y'" disabled />
                  <span>油墨码</span>
                </label>
                <label class="native-checkbox-before" style="font-size: 12px; margin-left: 5px;">
                  <input type="checkbox" :checked="form.s3LaserPrintCodeFlag === 'Y'" disabled />
                  <span>激光码</span>
                </label>
                <label class="native-checkbox-before" style="font-size: 12px; margin-left: 5px;">
                  <input type="checkbox" :checked="form.s3StampPrintCodeFlag === 'Y'" disabled />
                  <span>钢印码</span>
                </label>
                <span style="margin-left: 15px; white-space: nowrap;">4) 打码信息</span>
                <span style="margin-left: 5px; white-space: nowrap;">{{ form.s3CodingInfo || '' }}</span>
              </div>
            </div>
            <!-- 灌装量记录表格（只读） -->
            <table class="inner-fill-table filling-inner" style="border-collapse: collapse; font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <td rowspan="2" class="filling-cell">项目</td>
                  <td colspan="13" class="filling-cell">（灌装量记录）灌装头编号</td>
                </tr>
                <tr>
                  <td class="filling-cell">时间</td>
                  <td v-for="n in 12" :key="n" class="filling-cell">{{ n }}</td>
                </tr>
              </thead>
              <tbody>
                <template v-for="(main, idx) in form.fillingMainList" :key="idx">
                  <tr>
                    <td class="filling-cell">装量</td>
                    <td rowspan="2" class="filling-cell">{{ main.sampleTime ? main.sampleTime.substring(11, 16) : '' }}</td>
                    <td v-for="n in 12" :key="'w'+n" class="filling-cell">
                      {{ main.subMap ? main.subMap[n]?.fillingWeight : '' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="filling-cell">外观</td>
                    <td v-for="n in 12" :key="'a'+n" class="filling-cell">
                      {{ main.subMap ? main.subMap[n]?.appearance : '' }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </td>
          <td class="td-sign">
            <div v-if="form.s3OperateShowHide !== '1'">操作人：{{ form.s3Operator || '' }}</div>
            <div v-if="form.s3OperatorTime" style="color: gray; font-size: 12px;">{{ form.s3OperatorTime ? form.s3OperatorTime.substring(0, 16) : '' }}</div>
            <br/>
            <!-- 复核人 -->
            <div v-if="form.s3ReviewShowHide !== '1'" style="margin-top: 8px;">
              复核人：{{ form.s3Reviewer || '' }}
              <div v-if="form.s3ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s3ReviewerTime.substring(0, 16) }}</div>
            </div>
            <br/>
            <div v-if="form.s3InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s3Inspector || '' }}</div>
            <div v-if="form.s3InspectorTime" style="color: gray; font-size: 12px;">{{ form.s3InspectorTime ? form.s3InspectorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s3ReviewShowHide !== '1' && !form.s3InspectorTime" style="margin-top: 4px;">
                <el-button type="success" size="small" @click="handleStep3Review">复核</el-button>
            </div>
          </td>
        </tr>
      </table>
    </div>

  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { parseTime } from '@/utils/ruoyi'

const visible = ref(false)
const form = reactive({})

// 定义 emit 事件，每个步骤复核单独事件
const emit = defineEmits(['step1Review', 'step2Review', 'step3Review'])

/**
 * 打开复核对话框，接收完整数据对象
 */
function open(rowData) {
  Object.assign(form, JSON.parse(JSON.stringify(rowData)))
  // 预处理灌装量子表 subMap
  if (form.fillingMainList) {
    form.fillingMainList.forEach(main => {
      if (!main.subMap && main.fillingSubList) {
        const map = {}
        main.fillingSubList.forEach(sub => {
          map[sub.nozzleNo] = sub
        })
        main.subMap = map
      }
    })
  }
  visible.value = true
}

function close() { visible.value = false }

function handleClosed() {
  // 清理可在此处理
}

/** 复核 Step1：emit 事件，传递 recordId */
function handleStep1Review() {
  emit('step1Review', { recordId: form.recordId })
}

/** 复核 Step2 */
function handleStep2Review() {
  emit('step2Review', { recordId: form.recordId })
}

/** 复核 Step3 */
function handleStep3Review() {
  emit('step3Review', { recordId: form.recordId })
}

defineExpose({ open, close })
</script>


<style scoped>
/* 容器与基础表格 */
.view-container {
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px 12px 8px;
  box-sizing: border-box;
  color: #000;
  transform: translateZ(0);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.view-container::-webkit-scrollbar {
  display: none;
}

.row-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  table-layout: fixed;
  margin-bottom: -1px;
}

.info-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: top;
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

.header-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: top;
  box-sizing: border-box;
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

.td-no-padding {
  padding: 0 !important;
}

.inner-fill-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}
.inner-fill-table td, .inner-fill-table th {
  border: none;
}

.td-requirement,
.td-record {
  font-size: 14px;
  padding: 4px 6px;
}

.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
}

.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}

/* ============================================================
   复选框（前置）- native-checkbox-before
   勾号垂直居中，top 设为 2px 与后置保持一致
   ============================================================ */
.native-checkbox-before {
  display: inline-flex;
  align-items: center;
  cursor: default;
  font-size: 13px;
  color: #000;
  font-weight: normal;
  user-select: none;
}
.native-checkbox-before input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.native-checkbox-before span::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
  box-sizing: border-box;
  background: #fff;
}
.native-checkbox-before input:checked + span::before {
  background-color: #409eff;
  border-color: #409eff;
}
.native-checkbox-before input:checked + span::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;        /* 与后置复选框的 top 保持一致 */
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.native-checkbox-before span {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1;          /* ← 新增，防止继承父元素 line-height 导致勾号偏位 */
}

/* ============================================================
   复选框（后置）- native-checkbox-after
   ============================================================ */
.native-checkbox-after {
  display: inline-flex;
  align-items: center;
  cursor: default;
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
  margin-left: 10px;
}

/* ============================================================
   灌装量记录表格样式
   ============================================================ */
.filling-inner td,
.filling-inner th {
  border-top: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  padding: 0 4px;
  text-align: center;
  vertical-align: middle;
  height: 24px;
  line-height: 1;
}

.filling-inner thead td {
  height: 24px;
}

.filling-inner td[rowspan] {
  height: auto;
}

.filling-inner td:last-child,
.filling-inner th:last-child {
  border-right: none;
}

.filling-inner {
  border: none !important;
}

.filling-inner,
.filling-inner *,
.filling-inner *:before,
.filling-inner *:after {
  box-sizing: content-box;
}
</style>