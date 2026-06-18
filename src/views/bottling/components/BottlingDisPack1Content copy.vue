<!--
  灌装包材处理记录1 纯内容组件（全原生 table 最终版·优化2）
  优化：操作项目列/签名列垂直居中，Step2/3工艺文本左对齐
-->
<template>
  <div v-if="record" class="view-container">

    <!-- ===== 公司名称 + 编号 + 标题 ===== -->
    <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
      <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
      <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SOP-S-G-006)-01</span>
    </div>
    <div style="text-align: center; margin-bottom: 4px;">
      <strong>灌装包材处理记录</strong>
    </div>

    <!-- ===== 产品信息 ===== -->
    <table class="row-table info-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col>
        <col style="width: 80px;">
        <col>
        <col style="width: 100px;">
        <col>
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

    <!-- ===== 表头 ===== -->
    <table class="row-table header-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col>
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr>
        <td class="header-value">操作项目</td>
        <td class="header-value">工艺要求</td>
        <td class="header-value">操作记录</td>
        <td class="header-value">/</td>
      </tr>
    </table>

    <!-- ===== Step1 开工前检查 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col style="width: 900px;">
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 140px;">
        <td class="td-step-label">1.开工前检查</td>
        <td class="td-no-padding">
          <table class="inner-fill-table step1-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
            <tr style="height: 28px;">
              <td colspan="2">年 月 日 ： 至 月 日 ：</td>
            </tr>
            <tr style="height: 112px;">
              <td class="split-left">
                1）一般区操作间温度0～35℃，相对湿度20%～85%；<br/>
                2）洁净区温度18～26℃，相对湿度 45%～65%；<br/>
                3）该批次生产记录齐全；<br/>
                4）岗位操作规程、设备操作规程齐全；<br/>
                5）操作间及设备已清洁。
              </td>
              <td class="split-right">
                温湿度记录：<br/>
                一般区：{{ record.s1NormalAreaTemperature || '' }}℃，{{ record.s1NormalAreaHumidity || '' }}%<br/>
                洁净区：{{ record.s1CleanAreaTemperature || '' }}℃，{{ record.s1CleanAreaHumidity || '' }}%<br/>
                检查是否合格：{{ record.s1QualifiedFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}<br/>
                不合格情况说明及处理方式：{{ record.s1Remark || '' }}
              </td>
            </tr>
          </table>
        </td>
        <td></td>
        <td class="td-sign">
          <div>操作人：{{ record.operator || '' }}</div>
          <div style="margin-top: 8px;">复核人：{{ record.reviewer || '' }}</div>
          <div style="margin-top: 8px;">检查人：{{ record.inspector || '' }}</div>
        </td>
      </tr>
    </table>

    <!-- ===== Step2 处理 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col style="width: 450px;">
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 188px;">
        <td class="td-step-label">2.处理</td>
        <td class="td-no-padding">
          <table class="inner-fill-table step2-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
            <tr style="height: 28px;">
              <td colspan="2">年 月 日 ： 至 月 日 ：</td>
            </tr>
            <tr style="height: 28px;">
              <td class="split-left">□臭氧</td>
              <td class="split-right">□高温</td>
            </tr>
            <tr style="height: 132px;">
              <td class="split-left split-text">
                1）脱包；<br/>
                2）挑选，确认外观无变色；<br/>
                3）用吹瓶机或气枪吹瓶；<br/>
                4）用臭氧灭菌柜消毒；<br/>
                5）消毒臭氧浓度20ppm，30分钟。
              </td>
              <td class="split-right split-text">
                1）脱包；<br/>
                2）挑拣，确认外观无变色；<br/>
                3）用洗瓶机洗瓶、烘干消毒；<br/>
                4）洗瓶用水为纯化水；<br/>
                5）按照瓶型设定烘干消毒温度。
              </td>
            </tr>
          </table>
        </td>
        <td>
          <div style="padding: 0px 16px;">
            <div class="step-text">
              设备/编码：
              {{ record.s2OzoneGeneratorFlag === 'Y' ? '☑' : '□' }}臭氧机({{ record.s2OzoneGeneratorNumber || '' }})
              {{ record.s2BottleWashingMachineFlag === 'Y' ? '☑' : '□' }}洗瓶机({{ record.s2BottleWashingMachineNumber || '' }})
              {{ record.s2BottleBlowingMachineFlag === 'Y' ? '☑' : '□' }}吹瓶机({{ record.s2BottleBlowingMachineNumber || '' }})<br/>
              {{ record.s2AirGunFlag === 'Y' ? '☑' : '□' }}气枪
              {{ record.s2ManualWashingFlag === 'Y' ? '☑' : '□' }}手动洗
              {{ record.s2WasherDryerComboFlag === 'Y' ? '☑' : '□' }}洗烘一体机({{ record.s2WasherDryerComboNumber || '' }})<br/>
              {{ record.s2OzoneDesinfectionFlag === 'Y' ? '☑' : '□' }}臭氧：消毒臭氧浓度{{ record.s2OzoneConcentration || '' }}ppm<br/>
              消毒时间 {{ record.s2OzoneDesinfectionStartTime || ':' }} 至 {{ record.s2OzoneDesinfectionEndTime || ':' }}，共{{ record.s2OzoneDesinfectionCost || '' }}分钟<br/>
              {{ record.s2HighDesinfectionTemperatureFlag === 'Y' ? '☑' : '□' }}高温：烘干消毒温度{{ record.s2DryingDesinfectionTemperature || '' }}℃<br/>
              消毒时间 {{ record.s2DryingDesinfectionStartTime || ':' }} 至 {{ record.s2DryingDesinfectionEndTime || ':' }}，共{{ record.s2DryingDesinfectionCost || '' }}分钟<br/>
              是否干净干燥完好：{{ record.s2WaiguanFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}<br/>
              洗瓶用水是否纯化水：{{ record.s2PurifiedWaterFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}；无此项{{ record.s2NoPurifiedWaterFlag === 'Y' ? '☑' : '□' }}<br/>
              是否装入洁净袋：{{ record.s2CleanBagFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}
            </div>
          </div>
        </td>
        <td class="td-sign">
          <div>操作人：{{ record.operator || '' }}</div>
          <div style="margin-top: 8px;">复核人：{{ record.reviewer || '' }}</div>
          <div style="margin-top: 8px;">检查人：{{ record.inspector || '' }}</div>
        </td>
      </tr>
    </table>

    <!-- ===== Step3 处理 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col style="width: 450px;">
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 216px;">
        <td class="td-step-label">3.处理</td>
        <td class="td-no-padding">
          <table class="inner-fill-table step3-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
            <tr style="height: 28px;">
              <td colspan="2">年 月 日 ： 至 月 日 ：</td>
            </tr>
            <tr style="height: 28px;">
              <td class="split-left">□臭氧</td>
              <td class="split-right">□风淋</td>
            </tr>
            <tr style="height: 160px;">
              <td class="split-left split-text">
                1）脱包；<br/>
                2）挑选；<br/>
                3）用臭氧灭菌柜消毒；<br/>
                4）消毒臭氧浓度20ppm，30分钟。
              </td>
              <td class="split-right split-text">
                1）脱包；<br/>
                2）75%酒精消毒或者紫外消毒；<br/>
                3）放入风淋室，风淋吹扫静置。
              </td>
            </tr>
          </table>
        </td>
        <td>
          <div style="padding: 4px 6px;">
            <div class="step-text">
              设备/编码：<br/>
              {{ record.s3OzoneGeneratorFlag === 'Y' ? '☑' : '□' }}臭氧机({{ record.s3OzoneGeneratorNumber || '' }})
              {{ record.s3BottleWashingMachineFlag === 'Y' ? '☑' : '□' }}洗瓶机({{ record.s3BottleWashingMachineNumber || '' }})
              {{ record.s3BottleBlowingMachineFlag === 'Y' ? '☑' : '□' }}吹瓶机({{ record.s3BottleBlowingMachineNumber || '' }})<br/>
              {{ record.s3AirShowerMachineFlag === 'Y' ? '☑' : '□' }}风淋室({{ record.s3AirShowerMachineNumber || '' }})<br/><br/>
              消毒：<br/>
              {{ record.s3OzoneDesinfectionFlag === 'Y' ? '☑' : '□' }}臭氧：臭氧浓度{{ record.s3OzoneConcentration || '' }}ppm；
              {{ record.s3AlcoholDesinfectionFlag === 'Y' ? '☑' : '□' }}75%酒精消毒；
              {{ record.s3UvDesinfectionFlag === 'Y' ? '☑' : '□' }}紫外线消毒<br/>
              消毒时间 {{ record.s3OzoneDesinfectionStartTime || ':' }} 至 {{ record.s3OzoneDesinfectionEndTime || ':' }}，共{{ record.s3OzoneDesinfectionCost || '' }}分钟<br/><br/>
              {{ record.s3AirShowerFlag === 'Y' ? '☑' : '□' }}风淋，内包装是否完整：{{ record.s3AirShowerInnerPackagingFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}<br/>
              是否干净干燥完好：{{ record.s3WaiguanFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}<br/>
              是否装入洁净袋：{{ record.s3CleanBagFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }}
            </div>
          </div>
        </td>
        <td class="td-sign">
          <div>操作人：{{ record.operator || '' }}</div>
          <div style="margin-top: 8px;">复核人：{{ record.reviewer || '' }}</div>
          <div style="margin-top: 8px;">检查人：{{ record.inspector || '' }}</div>
        </td>
      </tr>
    </table>

    <!-- ===== Step4 物料使用统计 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col>
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 124px;">
        <td class="td-step-label">4.物料使用统计</td>
        <td class="td-no-padding" colspan="2">
          <table class="inner-fill-table step4-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
            <tr style="height: 28px; background: #ffffff; font-weight: bold;">
              <th>物料名称</th>
              <th>规格</th>
              <th>单位</th>
              <th>领入量</th>
              <th>使用量</th>
              <th>损耗量</th>
              <th>剩余量</th>
            </tr>
            <tr v-for="(item, idx) in paddedStep4List" :key="idx" style="height: 32px;">
              <td>{{ item.materialName || '' }}</td>
              <td>{{ item.spec || '' }}</td>
              <td>{{ item.unit || '' }}</td>
              <td>{{ item.receiveQty || '' }}</td>
              <td>{{ item.useQty || '' }}</td>
              <td>{{ item.lossQty || '' }}</td>
              <td>{{ item.remainQty || '' }}</td>
            </tr>
          </table>
        </td>
        <td class="td-sign">
          <div>操作人：{{ record.operator || '' }}</div>
          <div style="margin-top: 8px;">复核人：{{ record.reviewer || '' }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const record = ref(null)

/** 确保 Step4 至少有 3 行 */
const paddedStep4List = computed(() => {
  const list = record.value?.step4List || []
  if (list.length >= 3) return list
  const result = [...list]
  while (result.length < 3) result.push({})
  return result
})

function open(data) { record.value = data }
function reset() { record.value = null }

defineExpose({ open, reset })
</script>

<style scoped>
/* ============================================================
   容器
   ============================================================ */
.view-container {
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px;
  box-sizing: border-box;
  color: #000;
}

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
   产品信息表格
   ============================================================ */
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

/* ============================================================
   表头表格
   ============================================================ */
.header-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: top;
  box-sizing: border-box;
}
.header-label {
  font-weight: normal;
  font-size: 14px;
  background: #f5f7fa;
  text-align: center;
}
.header-value {
  font-weight: normal;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
}

/* ============================================================
   Step1~Step4 外层单元格通用样式
   ============================================================ */
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: top;
  box-sizing: border-box;
}

/* 内部表格填满外层单元格 */
.td-no-padding {
  padding: 0 !important;
}
.inner-fill-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}
/* 内部单元格默认无边框 */
.inner-fill-table td, .inner-fill-table th {
  border: none;
}

/* ============================================================
   Step1~Step3 内部表格分隔线
   ============================================================ */
.step1-inner td,
.step2-inner td,
.step3-inner td {
  border-bottom: 1px solid #dcdfe6;
  padding: 4px 6px;
}
/* 首列添加右边框（左右分栏竖线） */
.step1-inner td:first-child,
.step2-inner td:first-child,
.step3-inner td:first-child {
  border-right: 1px solid #dcdfe6;
}
/* 最后一行无下边框 */
.step1-inner tr:last-child td,
.step2-inner tr:last-child td,
.step3-inner tr:last-child td {
  border-bottom: none;
}
/* 跨列单元格取消右边框，居中 */
.step1-inner td[colspan="2"],
.step2-inner td[colspan="2"],
.step3-inner td[colspan="2"] {
  text-align: center;
  border-right: none;
}

/* ============================================================
   左右分栏单元格（通用）
   ============================================================ */
.split-left, .split-right {
  width: 50%;
}

/* ============================================================
   Step2/Step3 内部样式
   ============================================================ */
/* 所有行垂直居中 */
.step2-inner td,
.step3-inner td {
  vertical-align: middle;
}
/* 复选框行居中 */
.step2-inner .split-left,
.step2-inner .split-right,
.step3-inner .split-left,
.step3-inner .split-right {
  text-align: center;
}
/* 工艺多行文本左对齐 */
.step2-inner .split-text,
.step3-inner .split-text {
  text-align: left;
  vertical-align: middle;
}

/* ============================================================
   Step4 内部表格分隔线
   ============================================================ */
.step4-inner td,
.step4-inner th {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 4px;
  text-align: center;
  vertical-align: middle;
}
/* 最后一列无右边框 */
.step4-inner td:last-child,
.step4-inner th:last-child {
  border-right: none;
}
/* 最后一行无下边框 */
.step4-inner tr:last-child td {
  border-bottom: none;
}

/* ============================================================
   共用单元格样式
   ============================================================ */
/* 操作项目列：垂直居中 */
.td-step-label {
  font-weight: normal;
  text-align: center;
  vertical-align: middle !important;
  font-size: 14px;
}
/* 签名列：垂直居中 */
.td-sign {
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
}
/* 操作记录列文本 */
.step-text {
  font-size: 12px;
  line-height: 1.5;
}
</style>