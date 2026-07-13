<!--
  灌装生产记录1 纯内容组件（字体优化 + 行间距调整 + 复选框字体）
-->
<template>
  <div v-if="record" class="view-container">

    <!-- 公司名称 + 编号 + 标题 -->
    <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
      <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
      <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-004)-01</span>
    </div>
    <div style="text-align: center; margin-bottom: 4px;">灌装生产记录</div>

    <!-- 产品信息 -->
    <table class="row-table info-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;"><col style="width: 280px;">
        <col style="width: 70px;"><col>
        <col style="width: 100px;"><col>
      </colgroup>
      <tr>
        <td class="info-label">产品名称</td>
        <td class="info-label">{{ record.productName || '' }}</td>
        <td class="info-label">规格</td>
        <td class="info-label">{{ record.spec || '' }}</td>
        <td class="info-label">产品批号</td>
        <td class="info-label">{{ record.batchNumber || '' }}</td>
      </tr>
    </table>


    <!-- 起止时间 + 灌装首件确认（所有文本 font-weight: normal） -->
    <table class="row-table header-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col style="width: 450px;">
        <col>
        <col style="width: 340px;">
      </colgroup>
      <tr style="height: 28px;">
        <td class="info-label" style="font-weight: normal;">起止时间</td>
        <td class="info-label" style="text-align: center; font-weight: normal;">
          {{ record.fillingStartTime ? parseTime(record.fillingStartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
          {{ record.fillingStartTime && record.fillingEndTime ? ' 至 ' : '' }}
          {{ record.fillingEndTime ? parseTime(record.fillingEndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
        </td>
        <td class="info-label" style="font-weight: normal;">灌装首件确认</td>
        <td class="info-label" style="text-align: left; font-weight: normal;">
          <label class="native-checkbox-after">
            <span>符合规定</span>
            <input type="checkbox" :checked="record.firstQualifiedFlag === 'Y'" disabled />
          </label>
          <label class="native-checkbox-after" style="margin-left: 20px;">
            <span>不符合规定</span>
            <input type="checkbox" :checked="record.firstQualifiedFlag === 'N'" disabled />
          </label>
          <span style="margin-left: 10px;">
            检查人：<template v-if="record.firstQualifiedInspector && record.firstQualifiedInspectorTime">{{ record.firstQualifiedInspector }}</template>
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

    <!-- Step1 开工前检查（回显文字 12px） -->
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
        <!-- 操作记录列：字体 12px -->
        <td class="td-record" style="text-align: left; vertical-align: middle; font-size: 14px;">
          温湿度：{{ record.s1CleanAreaTemperature || '' }}℃ ， {{ record.s1CleanAreaHumidity || '' }}% ；检查是否合格：
          <label class="native-checkbox-after" style="font-size: 12px;">
            <span>是</span>
            <input type="checkbox" :checked="record.s1QualifiedFlag === 'Y'" disabled />
          </label>
          <label class="native-checkbox-after" style="font-size: 12px;">
            <span>否</span>
            <input type="checkbox" :checked="record.s1QualifiedFlag === 'N'" disabled />
          </label>
          <br/><br/>
          不合格情况说明及处理方式：<br/>
          {{ record.s1Remark || '' }}
        </td>
        <!-- 签名列：固定文本始终显示，名字仅当对应时间非空时显示 -->
        <td class="td-sign">
          <div v-if="record.s1OperateShowHide !== '1'">操作人：{{ record.s1Operator && record.s1OperatorTime ? record.s1Operator : '' }}</div>
          <div v-if="record.s1ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s1Reviewer && record.s1ReviewerTime ? record.s1Reviewer : '' }}</div>
          <div v-if="record.s1InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s1Inspector && record.s1InspectorTime ? record.s1Inspector : '' }}</div>
        </td>
      </tr>
    </table>

    <!-- Step2 设备、容器、工具处理（回显文字 12px） -->
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
        <!-- 操作记录列：字体 12px -->
        <td class="td-record" style="text-align: left; vertical-align: middle; font-size: 12px; line-height: 2.0;">
          &nbsp;&nbsp;&nbsp;&nbsp;1) 主要设备名称/编码：{{ record.s2MainEquipName || '' }} / {{ record.s2MainEquipNo || '' }}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;2) 检查是否在清洁消毒有效期内：<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label class="native-checkbox" style="font-size: 12px;">
            <input type="checkbox" :checked="record.s2PurifiedWaterFlag === 'Y'" disabled />
            <span>在清洁效期内:使用纯化水清洗</span>
          </label>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label class="native-checkbox" style="font-size: 12px;">
            <input type="checkbox" :checked="record.s2ReCleanDisinfectFlag === 'Y'" disabled />
            <span>超过清洁效期:重新清洁消毒&nbsp;&nbsp;&nbsp;&nbsp;清洁方式：{{ record.s2CleaningMethod || '' }}，消毒方式：{{ record.s2DesinfectionMethod || '' }}</span> 
          </label>
        </td>
        <!-- 签名列：固定文本始终显示，名字仅当对应时间非空时显示 -->
        <td class="td-sign">
          <div v-if="record.s2OperateShowHide !== '1'">操作人：{{ record.s2Operator && record.s2OperatorTime ? record.s2Operator : '' }}</div>
          <div v-if="record.s2ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s2Reviewer && record.s2ReviewerTime ? record.s2Reviewer : '' }}</div>
          <div v-if="record.s2InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s2Inspector && record.s2InspectorTime ? record.s2Inspector : '' }}</div>
        </td>
      </tr>
    </table>

    <!-- Step3 灌装（复选框文字 11px） -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;"><col style="width: 350px;">
        <col><col style="width: 100px;">
      </colgroup>
      <tr style="height: auto;">
        <td class="td-step-label">3.灌装</td>
        <!-- 工艺要求列，行间距 2.0 -->
        <td class="td-requirement" style="text-align: left; vertical-align: middle; line-height: 2.0;">
          1) 先用少量料液冲洗设备;<br/>
          2) 装量调节:按照产品规格/净含量，设定装量，称量、<br/>
          微调校正至合格范围;<br/>
          3) 检查每个灌装头对应外包半成品的装量和外观;<br/>
          4) 有打码的产品，需按照生产指令，调整打印内容;<br/>
          5) 开始灌装;<br/>
          6) 随时检查装量和外观，每2小时记录一次。
        </td>
        <!-- 操作记录列：字体 11px -->
        <td class="td-no-padding" style="vertical-align: top;">
          <!-- 上方控件区域，字体 11px，复选框也设为 11px -->
          <div style="padding: 6px 6px 0 6px; font-size: 11px;">
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <span style="white-space: nowrap; margin-right: 8px;">1) 是否用料液冲洗:</span>
              <label class="native-checkbox-after" style="font-size: 11px;">
                <span>是</span>
                <input type="checkbox" :checked="record.s3UseMaterialLiquidRinseFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after" style="font-size: 11px;">
                <span>否</span>
                <input type="checkbox" :checked="record.s3UseMaterialLiquidRinseFlag === 'N'" disabled />
              </label>
              <span style="margin-left: 40px; white-space: nowrap; margin-right: 8px;">2) 净含量范围:</span>
              <span>{{ record.s3NetContentRangeLower }} - {{ record.s3NetContentRangeUpper }} {{ record.s3NetContentUnit }}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="white-space: nowrap; margin-right: 8px;">3) 打码方式:</span>
              <label class="native-checkbox-after" style="font-size: 11px;">
                <span>油墨码,</span>
                <input type="checkbox" :checked="record.s3InkPrintCodeFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after" style="font-size: 11px;">
                <span>激光码,</span>
                <input type="checkbox" :checked="record.s3LaserPrintCodeFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after" style="font-size: 11px;">
                <span>钢印码</span>
                <input type="checkbox" :checked="record.s3StampPrintCodeFlag === 'Y'" disabled />
              </label>
              <span style="margin-left: 10px; white-space: nowrap; margin-right: 8px;">;4) 打码信息:</span>
              <span>{{ record.s3CodingInfo || '' }}</span>
            </div>
          </div>

          <!-- 灌装量记录表格（固定高度） -->
          <table class="inner-fill-table filling-inner" style="border-collapse: collapse; font-size: 12px; width: 100%;">
            <thead>
              <tr>
                <td rowspan="2" class="filling-cell">项目</td>
                <td colspan="13" class="filling-cell">(灌装量记录)灌装头编号</td>
              </tr>
              <tr>
                <td class="filling-cell">时间</td>
                <td v-for="n in 12" :key="n" class="filling-cell">{{ n }}</td>
              </tr>
            </thead>
            <tbody>
              <template v-for="(main, idx) in processedMainList" :key="idx">
                <tr>
                  <td class="filling-cell">装量</td>
                  <td rowspan="2" class="filling-cell">{{ main.sampleTime ? main.sampleTime.substring(11, 16) : '' }}</td>
                  <td v-for="n in 12" :key="'w'+n" class="filling-cell">
                    {{ main.subMap[n]?.fillingWeight || '' }}
                  </td>
                </tr>
                <tr>
                  <td class="filling-cell">外观</td>
                  <td v-for="n in 12" :key="'a'+n" class="filling-cell">
                    {{ main.subMap[n]?.appearance || '' }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </td>
        <!-- 签名列：固定文本始终显示，名字仅当对应时间非空时显示 -->
        <td class="td-sign">
          <div v-if="record.s3OperateShowHide !== '1'">操作人：{{ record.s3Operator && record.s3OperatorTime ? record.s3Operator : '' }}</div>
          <div v-if="record.s3ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s3Reviewer && record.s3ReviewerTime ? record.s3Reviewer : '' }}</div>
          <div v-if="record.s3InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s3Inspector && record.s3InspectorTime ? record.s3Inspector : '' }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { parseTime } from '@/utils/ruoyi'

const record = ref(null)

const processedMainList = computed(() => {
  const list = record.value?.fillingMainList || []
  return list.map(main => {
    const map = {}
    if (main.fillingSubList) {
      main.fillingSubList.forEach(sub => {
        map[sub.nozzleNo] = sub
      })
    }
    return {
      ...main,
      subMap: map
    }
  })
})

function open(data) { record.value = data }
function reset() { record.value = null }

defineExpose({ open, reset })
</script>

<style scoped>
/* 容器 + 隐藏滚动条 */
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

/* 原生复选框 */
.native-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.native-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: default;
  font-size: 13px;
  color: #000;
  font-weight: normal;
  user-select: none;
}
.native-checkbox span::before {
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
.native-checkbox input:checked + span::before {
  background-color: #409eff;
  border-color: #409eff;
}
.native-checkbox input:checked + span::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.native-checkbox span {
  position: relative;
  display: inline-flex;
  align-items: center;
}

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

/* ===== 灌装量表格专用样式（顶框+右框，固定高度） ===== */
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

/* 表头行稍高一点 */
.filling-inner thead td {
  height: 28px;
}

/* 时间列合并单元格高度自适应 */
.filling-inner td[rowspan] {
  height: auto;
}

/* 最后一列无右边框 */
.filling-inner td:last-child,
.filling-inner th:last-child {
  border-right: none;
}

/* 表格自身无任何外框 */
.filling-inner {
  border: none !important;
}

/* 修正 box-sizing 干扰 */
.filling-inner,
.filling-inner *,
.filling-inner *:before,
.filling-inner *:after {
  box-sizing: content-box;
}
</style>