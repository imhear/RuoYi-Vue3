<!--
  灌装包材处理记录1 纯内容组件（全原生 table 最终版·原生复选框）
  Step2/Step3 工艺要求列复选框改为原生 checkbox + label
-->
<template>
  <div v-if="record" class="view-container">

    <!-- ===== 公司名称 + 编号 + 标题 ===== -->
    <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
      <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
      <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-006)-01</span>
    </div>
    <div style="text-align: center; margin-bottom: 4px;">
      灌装包材处理记录
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
        <col style="width: 823px;">
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 120px;">
        <td class="td-step-label">1.开工前检查</td>
        <td class="td-no-padding" >
          <table class="inner-fill-table step1-inner" style="border-collapse: collapse; font-size: 14px; width: 100%; height: 100%;">
            <tr style="height: 28px;">
              <!-- <td colspan="2">{{ record.s1StartTime ? parseTime(record.s1StartTime, '{y}-{m}-{d} {h}:{i}') : '' }} 至 {{ record.s1EndTime ? parseTime(record.s1EndTime, '{y}-{m}-{d} {h}:{i}') : '' }}</td> -->
              <td colspan="2">{{ record.s1StartTime ? parseTime(record.s1StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s1EndTime ? parseTime(record.s1EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}</td>
            </tr>
            <tr style="height: 92px;">
              <td class="s1-split-left">
                1）一般区操作间温度0～35℃，相对湿度20%～85%；<br/>
                2）洁净区温度18～26℃，相对湿度 45%～65%；<br/>
                3）该批次生产记录齐全；<br/>
                4）岗位操作规程、设备操作规程齐全；<br/>
                5）操作间及设备已清洁。
              </td>
              <td class="s1-split-right">
                温湿度记录：<br/>
                一般区：{{ record.s1NormalAreaTemperature || '' }} ℃，{{ record.s1NormalAreaHumidity || '' }} %，
                洁净区：{{ record.s1CleanAreaTemperature || '' }} ℃，{{ record.s1CleanAreaHumidity || '' }} %
                <br/>
                <div style="height: 5px;"></div>
                <span>检查是否合格：</span>
                <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
                <label class="native-checkbox-after">
                  <span>是</span>
                  <input type="checkbox" :checked="record.s1QualifiedFlag === 'Y'" disabled />
                </label>
                <label class="native-checkbox-after">
                  <span>否</span>
                  <input type="checkbox" :checked="record.s1QualifiedFlag === 'N'" disabled />
                </label>
                <!-- 检查是否合格：{{ record.s1QualifiedFlag === 'Y' ? '☑是 □否' : '□是 ☑否' }} -->
                ；不合格情况说明及处理方式：<br/>
                {{ record.s1Remark || '' }}
              </td>
            </tr>
          </table>
        </td>
        <td></td>
        <!-- 签名列：固定文本始终显示，名字仅当对应时间非空时显示 -->
        <td class="td-sign">
          <div v-if="record.s1OperateShowHide !== '1'">操作人：{{ record.s1Operator && record.s1OperatorTime ? record.s1Operator : '' }}</div>
          <div v-if="record.s1ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s1Reviewer && record.s1ReviewerTime ? record.s1Reviewer : '' }}</div>
          <div v-if="record.s1InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s1Inspector && record.s1InspectorTime ? record.s1Inspector : '' }}</div>
        </td>
      </tr>
    </table>

    <!-- ===== Step2 处理 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col style="width: 400px;">
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 188px;">
        <td class="td-step-label">2.{{ record.s2StepName || '' }}<br>处理</td>
        <td class="td-no-padding">
          <table class="inner-fill-table step2-inner" style="border-collapse: collapse; font-size: 13px; width: 100%; height: 100%;">
            <tr style="height: 28px;">
              <td colspan="2">{{ record.s2StartTime ? parseTime(record.s2StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s2EndTime ? parseTime(record.s2EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}</td>
            </tr>
            <tr style="height: 28px;">
              <td class="split-left">
                <label class="native-checkbox">
                  <input type="checkbox" :checked="record.s2OzoneDesinfectionFlag === 'Y'" disabled />
                  <span>臭氧</span>
                </label>
              </td>
              <td class="split-right">
                <label class="native-checkbox">
                  <input type="checkbox" :checked="record.s2HighDesinfectionTemperatureFlag === 'Y'" disabled />
                  <span>高温</span>
                </label>
              </td>
            </tr>
            <tr style="height: 174px;">
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
              1）设备/编码：
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s2OzoneGeneratorFlag === 'Y'" disabled />
                <span>臭氧机</span>
              </label>
              （{{ record.s2OzoneGeneratorNumber || '' }}）
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s2BottleWashingMachineFlag === 'Y'" disabled />
                <span>洗瓶机</span>
              </label>
              （{{ record.s2BottleWashingMachineNumber || '' }}）
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s2BottleBlowingMachineFlag === 'Y'" disabled />
                <span>吹瓶机</span>
              </label>
              （{{ record.s2BottleBlowingMachineNumber || '' }}）
              <br>
              <label class="native-checkbox" style="margin-left: 92px;">
                <input type="checkbox" :checked="record.s2AirGunFlag === 'Y'" disabled />
                <span>气枪</span>
              </label>
              <label class="native-checkbox" style="margin-left: 25px;">
                <input type="checkbox" :checked="record.s2ManualWashingFlag === 'Y'" disabled />
                <span>手动洗</span>
              </label>
              <label class="native-checkbox" style="margin-left: 25px;">
                <input type="checkbox" :checked="record.s2WasherDryerComboFlag === 'Y'" disabled />
                <span>洗烘一体机</span>
              </label>
              （{{ record.s2WasherDryerComboNumber || '' }}）
              <br>
              2）
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s2OzoneDesinfectionFlag === 'Y'" disabled />
                <span>臭氧</span>
              </label>
              ：消毒臭氧浓度
              {{ record.s2OzoneConcentration || '' }}ppm，
              <br/>
              <span style="margin-left: 30px;">
                消毒时间 {{ (record.s2OzoneDesinfectionStartTime || '').substring(0, 5) }} 至 {{ (record.s2OzoneDesinfectionEndTime || '').substring(0, 5) }}
                ，共{{ record.s2OzoneDesinfectionCost || '' }}分钟
              </span>
              <br/>
              <label class="native-checkbox" style="margin-left: 25px;">
                <input type="checkbox" :checked="record.s2HighDesinfectionTemperatureFlag === 'Y'" disabled />
                <span>高温</span>
              </label>
              ：烘干消毒温度
              {{ record.s2DryingDesinfectionTemperature || '' }} ℃，
              <br/>
              <span style="margin-left: 30px;">
                消毒时间 {{ (record.s2DryingDesinfectionStartTime || '').substring(0, 5) }} 至 {{ (record.s2DryingDesinfectionEndTime || '').substring(0, 5) }}
                ，共{{ record.s2DryingDesinfectionCost || '' }}分钟
              </span>
              <br/>
              <label class="native-checkbox" style="margin-left: 25px;">
                <input type="checkbox" :checked="record.s2WasherDryerComboFlag === 'Y'" disabled />
                <span>洗烘一体机</span>
              </label>
              ：高温烘干消毒温度
              {{ record.s2HighDryingDesinfectionTemperature || '' }} ℃，
              <br/>
              <span style="margin-left: 30px;">
                消毒时间 {{ (record.s2HighDryingDesinfectionStartTime || '').substring(0, 5) }} 至 {{ (record.s2HighDryingDesinfectionEndTime || '').substring(0, 5) }}
              </span>
              <br/>
              <span>3）是否干净，干燥、完好、外观无变色：</span>
              <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
              <label class="native-checkbox-after">
                <span>是</span>
                <input type="checkbox" :checked="record.s2WaiguanFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after">
                <span>否</span>
                <input type="checkbox" :checked="record.s2WaiguanFlag === 'N'" disabled />
              </label>
              <br/>
              <span>4）洗瓶用水是否纯化水：</span>
              <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
              <label class="native-checkbox-after">
                <span>是</span>
                <input type="checkbox" :checked="record.s2PurifiedWaterFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after">
                <span>否</span>
                <input type="checkbox" :checked="record.s2PurifiedWaterFlag === 'N'" disabled />
              </label>
              <label class="native-checkbox-after">
                <span>；无此项</span>
                <input type="checkbox" :checked="record.s2NoPurifiedWaterFlag === 'Y'" disabled />
              </label>
              <br/>
              <span>5）是否装入洁净袋：</span>
              <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
              <label class="native-checkbox-after">
                <span>是</span>
                <input type="checkbox" :checked="record.s2PurifiedWaterFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after">
                <span>否</span>
                <input type="checkbox" :checked="record.s2CleanBagFlag === 'N'" disabled />
              </label>
            </div>
          </div>
        </td>
        <td class="td-sign">
          <div v-if="record.s2OperateShowHide !== '1'">操作人：{{ record.s2Operator && record.s2OperatorTime ? record.s2Operator : '' }}</div>
          <div v-if="record.s2ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s2Reviewer && record.s2ReviewerTime ? record.s2Reviewer : '' }}</div>
          <div v-if="record.s2InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s2Inspector && record.s2InspectorTime ? record.s2Inspector : '' }}</div>
        </td>
      </tr>
    </table>

    <!-- ===== Step3 处理 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 80px;">
        <col style="width: 400px;">
        <col>
        <col style="width: 100px;">
      </colgroup>
      <tr style="height: 153px;">
        <td class="td-step-label">3.{{ record.s3StepName || '' }}<br>处理</td>
        <td class="td-no-padding">
          <table class="inner-fill-table step3-inner" style="border-collapse: collapse; font-size: 13px; width: 100%; height: 100%;">
            <tr style="height: 28px;">
              <td colspan="2">{{ record.s3StartTime ? parseTime(record.s3StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s3EndTime ? parseTime(record.s3EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}</td>
              <!-- <td colspan="2">年 月 日 ： 至 月 日 ：</td> -->
            </tr>
            <tr style="height: 28px;">
              <td class="split-left">
                <label class="native-checkbox">
                  <input type="checkbox" :checked="record.s3OzoneDesinfectionFlag === 'Y'" disabled />
                  <span>臭氧</span>
                </label>
              </td>
              <td class="split-right">
                <label class="native-checkbox">
                  <input type="checkbox" :checked="record.s3AirShowerFlag === 'Y'" disabled />
                  <span>风淋</span>
                </label>
              </td>
            </tr>
            <tr style="height: 113px;">
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
          <div style="padding: 0px 16px;">
            <div class="step-text">
              1）设备/编码：
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3OzoneGeneratorFlag === 'Y'" disabled />
                <span>臭氧机</span>
              </label>
              （{{ record.s3OzoneGeneratorNumber || '' }}）
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3BottleWashingMachineFlag === 'Y'" disabled />
                <span>洗瓶机</span>
              </label>
              （{{ record.s3BottleWashingMachineNumber || '' }}）
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3BottleBlowingMachineFlag === 'Y'" disabled />
                <span>吹瓶机</span>
              </label>
              （{{ record.s3BottleBlowingMachineNumber || '' }}）
              <br>
              <label class="native-checkbox" style="margin-left: 92px;">
                <input type="checkbox" :checked="record.s3AirShowerMachineFlag === 'Y'" disabled />
                <span>风淋室</span>
              </label>
              （{{ record.s3AirShowerMachineNumber || '' }}）
              <br>
              <span>2）消毒</span>
              <br>
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3OzoneDesinfectionFlag === 'Y'" disabled />
                <span>臭氧</span>
              </label>
              ：臭氧浓度
              {{ record.s3OzoneConcentration || '' }}ppm，
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3AlcoholDesinfectionFlag === 'Y'" disabled />
                <span>75%酒精消毒；</span>
              </label>
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3UvDesinfectionFlag === 'Y'" disabled />
                <span>紫外线消毒</span>
              </label>
              <br/>
              <span style="margin-left: 30px;">
                  消毒时间 {{ (record.s3OzoneDesinfectionStartTime || '').substring(0, 5) }} 至 {{ (record.s3OzoneDesinfectionEndTime || '').substring(0, 5) }}
                  ，共{{ record.s3OzoneDesinfectionCost || '' }}分钟
              </span>
              <br/>
              <label class="native-checkbox">
                <input type="checkbox" :checked="record.s3AirShowerFlag === 'Y'" disabled />
                <span>风淋</span>
              </label>
              <span>，内包装是否完整：</span>
              <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
              <label class="native-checkbox-after">
                <span>是</span>
                <input type="checkbox" :checked="record.s3AirShowerInnerPackagingFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after">
                <span>否</span>
                <input type="checkbox" :checked="record.s3AirShowerInnerPackagingFlag === 'N'" disabled />
              </label>
              <br/>
              <span>3）是否干净，干燥、完好、外观无变色：</span>
              <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
              <label class="native-checkbox-after">
                <span>是</span>
                <input type="checkbox" :checked="record.s3WaiguanFlag === 'Y'" disabled />
              </label>
              <label class="native-checkbox-after">
                <span>否</span>
                <input type="checkbox" :checked="record.s3WaiguanFlag === 'N'" disabled />
              </label>
              <br/>
              <span>4）是否装入洁净袋：</span>
              <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
              <label class="native-checkbox-after">
                <span>是</span>
                <input type="checkbox" :checked="record.s3CleanBagFlag === 'Y'" disabled />
              </label>
              <!-- <span style="margin-left: 18px;">,</span> -->
              <label class="native-checkbox-after">
                <span>否</span>
                <input type="checkbox" :checked="record.s3CleanBagFlag === 'N'" disabled />
              </label>
            </div>
          </div>
        </td>
        <td class="td-sign">
          <div v-if="record.s3OperateShowHide !== '1'">操作人：{{ record.s3Operator && record.s3OperatorTime ? record.s3Operator : '' }}</div>
          <div v-if="record.s3ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s3Reviewer && record.s3ReviewerTime ? record.s3Reviewer : '' }}</div>
          <div v-if="record.s3InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s3Inspector && record.s3InspectorTime ? record.s3Inspector : '' }}</div>
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
      <tr style="height: 156px;">
        <td class="td-step-label">4.物料使用统计</td>
        <td class="td-no-padding" colspan="2">
          <table class="inner-fill-table step4-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
            <tr style="height: 28px; background: #ffffff; font-weight: normal;">
              <td>物料名称</td>
              <td>规格</td>
              <td>单位</td>
              <td>领入量</td>
              <td>使用量</td>
              <td>损耗量</td>
              <td>剩余量</td>
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
          <div v-if="record.s4OperateShowHide !== '1'">操作人：{{ record.s4Operator && record.s4OperatorTime ? record.s4Operator : '' }} </div>
          <div v-if="record.s4ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s4Reviewer && record.s4ReviewerTime ? record.s4Reviewer : '' }} </div>
          <div v-if="record.s4InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s4Inspector && record.s4InspectorTime ? record.s4Inspector : '' }} </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const record = ref(null)

/** 确保 Step4 至少有 4 行 */
const paddedStep4List = computed(() => {
  const list = record.value?.step4List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push({})
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
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px;
  box-sizing: border-box;
  color: #000;
  transform: translateZ(0);
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
  padding: 1px 1px;
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
  padding: 4px 0px;
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
.s1-split-left {
  width: 400px;
}
.s1-split-right {
  /* width: 400px; */
}

/* ============================================================
   左右分栏单元格（通用）
   ============================================================ */
.split-left {
  width: 52%;
}
.split-right {
  width: 48%;
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
   原生复选框样式（替代 el-checkbox）
   ============================================================ */
/* 隐藏原生 input */
.native-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
/* 标签整体样式 */
.native-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: default;
  font-size: 13px;
  color: #000;
  font-weight: normal; /* 新增：取消粗体 */
  user-select: none;
}
/* 自定义复选框外观 */
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
/* 选中状态 */
.native-checkbox input:checked + span::before {
  background-color: #409eff;
  border-color: #409eff;
}
/* 选中对勾 */
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
/* 让 span 相对定位以承载对勾 */
.native-checkbox span {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* ============================================================
   原生复选框样式（文字在前、复选框在后）
   使用 :has() 伪类实现选中效果，兼容 span 在 input 之前的结构
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
/* 隐藏原生 input */
.native-checkbox-after input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
/* 自定义复选框外观 */
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
/* 选中状态：使用 :has() 选择器 */
.native-checkbox-after:has(input:checked) span::after {
  background-color: #409eff;
  border-color: #409eff;
}
/* 选中对勾 */
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
/* span 相对定位以承载对勾 */
.native-checkbox-after span {
  position: relative;
  display: inline-flex;
  align-items: center;
}
/* 给“否”复选框增加左边距 */
.native-checkbox-after + .native-checkbox-after {
  margin-left: 20px;
}
/* ============================================================
   共用单元格样式
   ============================================================ */
/* 操作项目列：垂直居中 */
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}
/* 签名列：垂直居中 */
.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
}
/* 操作记录列文本 */
.step-text {
  font-size: 13px;
  line-height: 1.5;
}
</style>