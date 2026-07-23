<!--
  灌装包材处理记录1 处理对话框（Step1 可编辑版）
  基线：完整复制查看对话框代码
  改造：Step1 操作记录列可编辑，签名行增加提交按钮
  交互：完全被动模式，emit 数据给父组件处理
-->
<template>
  <el-dialog v-model="visible" width="280mm" append-to-body @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">灌装包材处理记录1</span>
      </div>
    </template>

    <div v-if="form.recordId" class="view-container">

      <!-- ===== 公司名称 + 编号 + 标题 ===== -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-006)-01</span>
      </div>
      <div style="text-align: center; margin-bottom: 4px;">
        灌装包材处理记录
      </div>

      <!-- ===== 产品信息（只读） ===== -->
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
          <td class="info-label">{{ form.productName || '' }}</td>
          <td class="info-label">规格</td>
          <td class="info-label">{{ form.spec || '' }}</td>
          <td class="info-label">产品批号</td>
          <td class="info-label">{{ form.batchNumber || '' }}</td>
        </tr>
      </table>

      <!-- ===== 表头（只读） ===== -->
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

      <!-- ===== Step1 开工前检查（可编辑） ===== -->
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
                <td colspan="2" style="text-align: center;">
                  <el-date-picker v-model="form.s1StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:00" placeholder="开始时间" size="small" style="width: 180px;" />
                  <span style="margin: 0 8px;">至</span>
                  <el-date-picker v-model="form.s1EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:00" placeholder="结束时间" size="small" style="width: 180px;" />
                </td>
                <!-- <td colspan="2">{{ form.s1StartTime ? parseTime(form.s1StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ form.s1EndTime ? parseTime(form.s1EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}</td> -->
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
                  一般区：
                  <input v-model="form.s1NormalAreaTemperature" class="edit-input-short" placeholder="℃" /> ℃，
                  <input v-model="form.s1NormalAreaHumidity" class="edit-input-short" placeholder="%" /> %，
                  洁净区：
                  <input v-model="form.s1CleanAreaTemperature" class="edit-input-short" placeholder="℃" /> ℃，
                  <input v-model="form.s1CleanAreaHumidity" class="edit-input-short" placeholder="%" /> %
                  <br/>
                  <div style="height: 5px;"></div>
                  <span>检查是否合格：</span>
                  <!-- "文字在前、复选框在后" 使用 native-checkbox-after 类 -->
                  <label class="native-checkbox-after">
                    <span>是</span>
                    <input type="checkbox" v-model="form.s1QualifiedFlag" true-value="Y" false-value="" />
                  </label>
                  <label class="native-checkbox-after">
                    <span>否</span>
                    <input type="checkbox" v-model="form.s1QualifiedFlag" true-value="N" false-value="" />
                  </label>
                  ；不合格情况说明及处理方式：<br/>
                  <textarea v-model="form.s1Remark" class="edit-textarea" rows="2" placeholder="请输入不合格情况说明"></textarea>
                </td>
              </tr>
            </table>
          </td>
          <td></td>
          <td class="td-sign">
            <div v-if="form.s1OperateShowHide !== '1'">操作人：{{ form.s1Operator || '' }}</div>
            <div v-if="form.s1OperatorTime" style="color: gray; font-size: 12px;">{{ form.s1OperatorTime ? form.s1OperatorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s1ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.s1Reviewer || '' }}</div>
            <div v-if="form.s1ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s1ReviewerTime ? form.s1ReviewerTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s1InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s1Inspector || '' }}</div>
            <div v-if="form.s1InspectorTime" style="color: gray; font-size: 12px;">{{ form.s1InspectorTime ? form.s1InspectorTime.substring(0, 16) : '' }}</div>
            <!-- 检查人未提交时，显示操作按钮 -->
            <div v-if="!form.s1InspectorTime" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmitStep1">提交</el-button>
            </div>
          </td>
        </tr>
      </table>

      <!-- ===== Step2 处理（可编辑） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 400px;">
          <col>
          <col style="width: 100px;">
        </colgroup>
        <tr style="height: 188px;">
          <td class="td-step-label">
            2.<el-select v-model="form.s2StepName" clearable placeholder="物料名称" size="small" style="width: 75px;">
                <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select><br>处理
          </td>
          <td class="td-no-padding">
            <table class="inner-fill-table step2-inner" style="border-collapse: collapse; font-size: 13px; width: 100%; height: 100%;">
              <tr style="height: 28px;">
                <td colspan="2" style="text-align: center;">
                  <el-date-picker v-model="form.s2StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:00" placeholder="开始时间" size="small" style="width: 180px;" />
                  <span style="margin: 0 8px;">至</span>
                  <el-date-picker v-model="form.s2EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:00" placeholder="结束时间" size="small" style="width: 180px;" />
                </td>
              </tr>
              <tr style="height: 28px;">
                <td class="split-left">
                  <label class="native-checkbox">
                    <input type="checkbox" v-model="form.s2OzoneDesinfectionFlag" true-value="Y" false-value="N" />
                    <span>臭氧</span>
                  </label>
                </td>
                <td class="split-right">
                  <label class="native-checkbox">
                    <input type="checkbox" v-model="form.s2HighDesinfectionTemperatureFlag" true-value="Y" false-value="N" />
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
            <div style="padding: 0px 0px;">
              <div class="step-text">
                1）设备/编码：
                <label class="native-checkbox">
                  <input type="checkbox" v-model="form.s2OzoneGeneratorFlag" true-value="Y" false-value="N" />
                  <span>臭氧机</span>
                </label>
                （<input v-model="form.s2OzoneGeneratorNumber" class="edit-input-short" style="width: 20px;"/>）
                <label class="native-checkbox">
                  <input type="checkbox" v-model="form.s2BottleWashingMachineFlag" true-value="Y" false-value="N" />
                  <span>洗瓶机</span>
                </label>
                （<input v-model="form.s2BottleWashingMachineNumber" class="edit-input-short" style="width: 20px;"/>）
                <label class="native-checkbox">
                  <input type="checkbox" v-model="form.s2BottleBlowingMachineFlag" true-value="Y" false-value="N" />
                  <span>吹瓶机</span>
                </label>
                （<input v-model="form.s2BottleBlowingMachineNumber" class="edit-input-short" style="width: 20px;"/>）
                <br>
                <label class="native-checkbox" style="margin-left: 92px;">
                  <input type="checkbox" v-model="form.s2AirGunFlag" true-value="Y" false-value="N" />
                  <span>气枪</span>
                </label>
                <label class="native-checkbox" style="margin-left: 25px;">
                  <input type="checkbox" v-model="form.s2ManualWashingFlag" true-value="Y" false-value="N" />
                  <span>手动洗</span>
                </label>
                <label class="native-checkbox" style="margin-left: 25px;">
                  <input type="checkbox" v-model="form.s2WasherDryerComboFlag" true-value="Y" false-value="N" />
                  <span>洗烘一体机</span>
                </label>
                （<input v-model="form.s2WasherDryerComboNumber" class="edit-input-short" />）
                <br>
                2）
                <label class="native-checkbox">
                  <input type="checkbox" v-model="form.s2OzoneDesinfectionFlag" true-value="Y" false-value="N" />
                  <span>臭氧</span>
                </label>
                ：消毒臭氧浓度 <input v-model="form.s2OzoneConcentration" class="edit-input-short" /> ppm，
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间 <el-time-picker v-model="form.s2OzoneDesinfectionStartTime" value-format="HH:mm:00" placeholder="" size="small" style="width: 100px;" />
                  至 <el-time-picker v-model="form.s2OzoneDesinfectionEndTime" value-format="HH:mm:00" placeholder="" size="small" style="width: 100px;" />
                  ，共 <input v-model="form.s2OzoneDesinfectionCost" disabled class="edit-input-short" /> 分钟
                </span>
                <br/>
                <label class="native-checkbox" style="margin-left: 25px;">
                  <input type="checkbox" v-model="form.s2HighDesinfectionTemperatureFlag" true-value="Y" false-value="N" />
                  <span>高温</span>
                </label>
                ：烘干消毒温度 <input v-model="form.s2DryingDesinfectionTemperature" class="edit-input-short" /> ℃，
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间 <el-time-picker v-model="form.s2DryingDesinfectionStartTime" value-format="HH:mm:00" placeholder="" size="small" style="width: 100px;" />
                  至 <el-time-picker v-model="form.s2DryingDesinfectionEndTime" value-format="HH:mm:00" placeholder="" size="small" style="width: 100px;" />
                  ，共 <input v-model="form.s2DryingDesinfectionCost" disabled class="edit-input-short" /> 分钟
                </span>
                <br/>
                <label class="native-checkbox" style="margin-left: 25px;">
                  <input type="checkbox" v-model="form.s2WasherDryerComboFlag" true-value="Y" false-value="N" />
                  <span>洗烘一体机</span>
                </label>
                ：高温烘干消毒温度 <input v-model="form.s2HighDryingDesinfectionTemperature" class="edit-input-short" /> ℃，
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间 <el-time-picker v-model="form.s2HighDryingDesinfectionStartTime" value-format="HH:mm:00" placeholder="" size="small" style="width: 100px;" />
                  至 <el-time-picker v-model="form.s2HighDryingDesinfectionEndTime" value-format="HH:mm:00" placeholder="" size="small" style="width: 100px;" />
                </span>
                <br/>
                <span>3）是否干净，干燥、完好、外观无变色：</span>
                <label class="native-checkbox-after">
                  <span>是</span>
                  <input type="checkbox" v-model="form.s2WaiguanFlag" true-value="Y" false-value="N" />
                </label>
                <label class="native-checkbox-after">
                  <span>否</span>
                  <input type="checkbox" v-model="form.s2WaiguanFlag" true-value="N" false-value="Y" />
                </label>
                <br/>
                <span>4）洗瓶用水是否纯化水：</span>
                <label class="native-checkbox-after">
                  <span>是</span>
                  <input type="checkbox" v-model="form.s2PurifiedWaterFlag" true-value="Y" false-value="N" />
                </label>
                <label class="native-checkbox-after">
                  <span>否</span>
                  <input type="checkbox" v-model="form.s2PurifiedWaterFlag" true-value="N" false-value="Y" />
                </label>
                <label class="native-checkbox-after">
                  <span>；无此项</span>
                  <input type="checkbox" v-model="form.s2NoPurifiedWaterFlag" true-value="Y" false-value="N" />
                </label>
                <br/>
                <span>5）是否装入洁净袋：</span>
                <label class="native-checkbox-after">
                  <span>是</span>
                  <input type="checkbox" v-model="form.s2CleanBagFlag" true-value="Y" false-value="N" />
                </label>
                <label class="native-checkbox-after">
                  <span>否</span>
                  <input type="checkbox" v-model="form.s2CleanBagFlag" true-value="N" false-value="Y" />
                </label>
              </div>
            </div>
          </td>
          <td class="td-sign">
            <div v-if="form.s2OperateShowHide !== '1'">操作人：{{ form.s2Operator || '' }}</div>
            <div v-if="form.s2OperatorTime" style="color: gray; font-size: 12px;">{{ form.s2OperatorTime ? form.s2OperatorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s2ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.s2Reviewer || '' }}</div>
            <div v-if="form.s2ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s2ReviewerTime ? form.s2ReviewerTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s2InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s2Inspector || '' }}</div>
            <div v-if="form.s2InspectorTime" style="color: gray; font-size: 12px;">{{ form.s2InspectorTime ? form.s2InspectorTime.substring(0, 16) : '' }}</div>
            <!-- 检查人未提交时，显示提交按钮 -->
            <div v-if="!form.s2InspectorTime" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmitStep2">提交</el-button>
            </div>
          </td>
        </tr>
      </table>

      <!-- ===== Step3 处理（可编辑） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 400px;">
          <col>
          <col style="width: 100px;">
        </colgroup>
        <tr style="height: 153px;">
          <td class="td-step-label">
            3.<el-select v-model="form.s3StepName" clearable placeholder="物料名称" size="small" style="width: 75px;">
                <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select><br>处理
          </td>
          <td class="td-no-padding">
            <table class="inner-fill-table step3-inner" style="border-collapse: collapse; font-size: 13px; width: 100%; height: 100%;">
              <tr style="height: 28px;">
                <td colspan="2" style="text-align: center;">
                  <el-date-picker v-model="form.s3StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:00" placeholder="开始时间" size="small" style="width: 180px;" />
                  <span style="margin: 0 8px;">至</span>
                  <el-date-picker v-model="form.s3EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:00" placeholder="结束时间" size="small" style="width: 180px;" />
                </td>
              </tr>
              <tr style="height: 28px;">
                <td class="split-left">
                  <label class="native-checkbox">
                    <input type="checkbox" v-model="form.s3OzoneDesinfectionFlag" true-value="Y" false-value="N" />
                    <span>臭氧</span>
                  </label>
                </td>
                <td class="split-right">
                  <label class="native-checkbox">
                    <input type="checkbox" v-model="form.s3AirShowerFlag" true-value="Y" false-value="N" />
                    <span>风淋</span>
                  </label>
                </td>
              </tr>
              <tr style="height: 113px;">
                <td class="split-left split-text">
                  1）脱包；<br/>2）挑选；<br/>3）用臭氧灭菌柜消毒；<br/>4）消毒臭氧浓度20ppm，30分钟。
                </td>
                <td class="split-right split-text">
                  1）脱包；<br/>2）75%酒精消毒或者紫外消毒；<br/>3）放入风淋室，风淋吹扫静置。
                </td>
              </tr>
            </table>
          </td>
          <td>
            <div style="padding: 0px 0px;">
              <div class="step-text">
                1）设备/编码：
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3OzoneGeneratorFlag" true-value="Y" false-value="N" /><span>臭氧机</span></label>
                （<input v-model="form.s3OzoneGeneratorNumber" class="edit-input-short"  style="width: 20px;"/>）
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3BottleWashingMachineFlag" true-value="Y" false-value="N" /><span>洗瓶机</span></label>
                （<input v-model="form.s3BottleWashingMachineNumber" class="edit-input-short"  style="width: 20px;"/>）
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3BottleBlowingMachineFlag" true-value="Y" false-value="N" /><span>吹瓶机</span></label>
                （<input v-model="form.s3BottleBlowingMachineNumber" class="edit-input-short"  style="width: 20px;"/>）
                <br>
                <label class="native-checkbox" style="margin-left: 92px;"><input type="checkbox" v-model="form.s3AirShowerMachineFlag" true-value="Y" false-value="N" /><span>风淋室</span></label>
                （<input v-model="form.s3AirShowerMachineNumber" class="edit-input-short"  style="width: 20px;"/>）
                <br>
                <span>2）消毒</span><br>
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3OzoneDesinfectionFlag" true-value="Y" false-value="N" /><span>臭氧</span></label>
                ：臭氧浓度 <input v-model="form.s3OzoneConcentration" class="edit-input-short" /> ppm，
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3AlcoholDesinfectionFlag" true-value="Y" false-value="N" /><span>75%酒精消毒；</span></label>
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3UvDesinfectionFlag" true-value="Y" false-value="N" /><span>紫外线消毒</span></label>
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间 <el-time-picker v-model="form.s3OzoneDesinfectionStartTime" value-format="HH:mm:00" size="small" style="width: 100px;" />
                  至 <el-time-picker v-model="form.s3OzoneDesinfectionEndTime" value-format="HH:mm:00" size="small" style="width: 100px;" />
                  ，共 <input v-model="form.s3OzoneDesinfectionCost" disabled class="edit-input-short" /> 分钟
                </span>
                <br/>
                <label class="native-checkbox"><input type="checkbox" v-model="form.s3AirShowerFlag" true-value="Y" false-value="N" /><span>风淋</span></label>
                <span>，内包装是否完整：</span>
                <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.s3AirShowerInnerPackagingFlag" true-value="Y" false-value="N" /></label>
                <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.s3AirShowerInnerPackagingFlag" true-value="N" false-value="Y" /></label>
                <br/>
                <span>3）是否干净，干燥、完好、外观无变色：</span>
                <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.s3WaiguanFlag" true-value="Y" false-value="N" /></label>
                <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.s3WaiguanFlag" true-value="N" false-value="Y" /></label>
                <br/>
                <span>4）是否装入洁净袋：</span>
                <label class="native-checkbox-after"><span>是</span><input type="checkbox" v-model="form.s3CleanBagFlag" true-value="Y" false-value="N" /></label>
                <label class="native-checkbox-after"><span>否</span><input type="checkbox" v-model="form.s3CleanBagFlag" true-value="N" false-value="Y" /></label>
              </div>
            </div>
          </td>
          <td class="td-sign">
            <div v-if="form.s3OperateShowHide !== '1'">操作人：{{ form.s3Operator || '' }}</div>
            <div v-if="form.s3OperatorTime" style="color: gray; font-size: 12px;">{{ form.s3OperatorTime ? form.s3OperatorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s3ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.s3Reviewer || '' }}</div>
            <div v-if="form.s3ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s3ReviewerTime ? form.s3ReviewerTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s3InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s3Inspector || '' }}</div>
            <div v-if="form.s3InspectorTime" style="color: gray; font-size: 12px;">{{ form.s3InspectorTime ? form.s3InspectorTime.substring(0, 16) : '' }}</div>
            <!-- 检查人未提交时，显示提交按钮 -->
            <div v-if="!form.s3InspectorTime" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmitStep3">提交</el-button>
            </div>
          </td>
        </tr>
      </table>


      <!-- ===== Step4 物料使用统计（可编辑） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col><col><col style="width: 100px;">
        </colgroup>
        <tr style="height: 156px;">
          <td class="td-step-label">4.物料使用统计</td>
          <td class="td-no-padding" colspan="2">
            <table class="inner-fill-table step4-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
              <tr style="height: 28px; background: #ffffff; font-weight: normal;">
                <td>物料名称</td><td>规格</td><td>单位</td><td>领入量</td><td>使用量</td><td>损耗量</td><td>剩余量</td>
              </tr>
              <tr v-for="(item, idx) in paddedStep4List" :key="idx" style="height: 32px;">
                <td>
                  <el-select v-model="item.materialName" clearable placeholder="" size="small" style="width: 80px;">
                    <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </td>
                <td>
                  <el-select v-model="item.spec" clearable placeholder="" size="small" style="width: 60px;">
                    <el-option v-for="dict in receiving_spec" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </td>
                <td>
                  <el-select v-model="item.unit" clearable placeholder="" size="small" style="width: 60px;">
                    <el-option v-for="dict in pro_unit" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </td>
                <td><input v-model="item.receiveQty" class="edit-input-short" style="width: 60px;" /></td>
                <td><input v-model="item.useQty" class="edit-input-short" style="width: 60px;" /></td>
                <td><input v-model="item.lossQty" class="edit-input-short" style="width: 60px;" /></td>
                <td><input v-model="item.remainQty" class="edit-input-short" style="width: 60px;" /></td>
              </tr>
            </table>
          </td>
          <td class="td-sign">
            <div v-if="form.s4OperateShowHide !== '1'">操作人：{{ form.s4Operator || '' }}</div>
            <div v-if="form.s4OperatorTime" style="color: gray; font-size: 12px;">{{ form.s4OperatorTime ? form.s4OperatorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s4ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.s4Reviewer || '' }}</div>
            <div v-if="form.s4ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s4ReviewerTime ? form.s4ReviewerTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s4InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s4Inspector || '' }}</div>
            <div v-if="form.s4InspectorTime" style="color: gray; font-size: 12px;">{{ form.s4InspectorTime ? form.s4InspectorTime.substring(0, 16) : '' }}</div>
            <!-- 复核人未提交时，显示提交按钮 -->
            <div v-if="!form.s4ReviewerTime" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmitStep4">提交</el-button>
            </div>
          </td>
        </tr>
      </table>

    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
// 获取数据字典
const { receiving_material, receiving_spec, pro_unit } = proxy.useDict('receiving_material', 'receiving_spec', 'pro_unit')

const visible = ref(false)
const currentRecordId = ref(null)

/** 表单数据（由父组件 open(data) 传入） */
const form = reactive({
  recordId: null,
  orderNum: '', planCode: '', productName: '', spec: '', batchNumber: '',
  // Step1
  s1StepName: '', s1StartTime: null, s1EndTime: null,
  s1QualifiedFlag: '',
  s1NormalAreaTemperature: '', s1NormalAreaHumidity: '',
  s1CleanAreaTemperature: '', s1CleanAreaHumidity: '',
  s1Remark: '',
  s1Operator: '', s1Reviewer: '', s1Inspector: '',
  s1OperateShowHide: '', s1ReviewShowHide: '', s1InspectShowHide: '',
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
  s2Operator: '', s2Reviewer: '', s2Inspector: '',
  s2OperateShowHide: '', s2ReviewShowHide: '', s2InspectShowHide: '',
  // Step3
  s3StepName: '', s3StartTime: null, s3EndTime: null,
  s3OzoneDesinfectionFlag: '', s3AirShowerFlag: '', s3OzoneGeneratorFlag: '',
  s3OzoneGeneratorNumber: '', s3BottleWashingMachineFlag: '', s3BottleWashingMachineNumber: '',
  s3BottleBlowingMachineFlag: '', s3BottleBlowingMachineNumber: '',
  s3AirShowerMachineFlag: '', s3AirShowerMachineNumber: '',
  s3OzoneConcentration: '', s3OzoneDesinfectionStartTime: null, s3OzoneDesinfectionEndTime: null,
  s3OzoneDesinfectionCost: '', s3AlcoholDesinfectionFlag: '', s3UvDesinfectionFlag: '',
  s3AirShowerInnerPackagingFlag: '', s3WaiguanFlag: '', s3CleanBagFlag: '',
  s3Operator: '', s3Reviewer: '', s3Inspector: '',
  s3OperateShowHide: '', s3ReviewShowHide: '', s3InspectShowHide: '',
  // Step4
  s4StepName: '', s4StepNumber: null,
  s4Operator: '', s4Reviewer: '', s4Inspector: '',
  s4OperateShowHide: '', s4ReviewShowHide: '', s4InspectShowHide: '',
  step4List: []
})

/** 确保 Step4 至少有 4 行 */
const paddedStep4List = computed(() => {
  const list = form.step4List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push({})
  return result
})

/** 打开对话框，接收父组件传入的完整数据 */
function open(data) {
  currentRecordId.value = data.recordId
  Object.assign(form, data)
  // 确保子表至少有4行
  if (!form.step4List || form.step4List.length === 0) {
    form.step4List = []
    for (let i = 0; i < 4; i++) {
      form.step4List.push({ materialCode: '', materialName: '', spec: '', unit: '', receiveQty: '', useQty: '', lossQty: '', remainQty: '' })
    }
  }
  visible.value = true
}

/** Step1 提交：校验 + emit 数据给父组件处理 */
function handleSubmitStep1() {
  // 追加去空格（安全转换，避免数字类型报 replace 错误）
  form.s1NormalAreaTemperature = String(form.s1NormalAreaTemperature ?? '').replace(/\s/g, '')
  form.s1NormalAreaHumidity = String(form.s1NormalAreaHumidity ?? '').replace(/\s/g, '')
  form.s1CleanAreaTemperature = String(form.s1CleanAreaTemperature ?? '').replace(/\s/g, '')
  form.s1CleanAreaHumidity = String(form.s1CleanAreaHumidity ?? '').replace(/\s/g, '')
  form.s1Remark = String(form.s1Remark ?? '').replace(/\s/g, '')
  // 前端校验
  if (form.s1NormalAreaTemperature && (isNaN(form.s1NormalAreaTemperature) || Number(form.s1NormalAreaTemperature) <= 0)) {
    proxy.$modal.msgError('一般区温度必须为正数')
    return
  }
  if (form.s1NormalAreaHumidity && (isNaN(form.s1NormalAreaHumidity) || Number(form.s1NormalAreaHumidity) <= 0)) {
    proxy.$modal.msgError('一般区湿度必须为正数')
    return
  }
  if (form.s1CleanAreaTemperature && (isNaN(form.s1CleanAreaTemperature) || Number(form.s1CleanAreaTemperature) <= 0)) {
    proxy.$modal.msgError('洁净区温度必须为正数')
    return
  }
  if (form.s1CleanAreaHumidity && (isNaN(form.s1CleanAreaHumidity) || Number(form.s1CleanAreaHumidity) <= 0)) {
    proxy.$modal.msgError('洁净区湿度必须为正数')
    return
  }
  // 时间字段必填校验
  if (!form.s1StartTime) {
    proxy.$modal.msgError('请选择开始时间')
    return
  }
  if (!form.s1EndTime) {
    proxy.$modal.msgError('请选择结束时间')
    return
  }

  // Step1 提交：emit 数据给父组件，由父组件处理二次确认和调接口
  emit('step1Submit', {
    recordId: currentRecordId.value,
    s1StartTime: form.s1StartTime,           // 新增
    s1EndTime: form.s1EndTime,               // 新增
    s1NormalAreaTemperature: form.s1NormalAreaTemperature,
    s1NormalAreaHumidity: form.s1NormalAreaHumidity,
    s1CleanAreaTemperature: form.s1CleanAreaTemperature,
    s1CleanAreaHumidity: form.s1CleanAreaHumidity,
    s1QualifiedFlag: form.s1QualifiedFlag,
    s1Remark: form.s1Remark
  })
}


/** Step2 提交：校验 + emit 数据给父组件处理 */
function handleSubmitStep2() {
  // 去空格处理（文本字段）
  form.s2StepName = String(form.s2StepName ?? '').replace(/\s/g, '')
  form.s2OzoneGeneratorNumber = String(form.s2OzoneGeneratorNumber ?? '').replace(/\s/g, '')
  form.s2BottleWashingMachineNumber = String(form.s2BottleWashingMachineNumber ?? '').replace(/\s/g, '')
  form.s2BottleBlowingMachineNumber = String(form.s2BottleBlowingMachineNumber ?? '').replace(/\s/g, '')
  form.s2WasherDryerComboNumber = String(form.s2WasherDryerComboNumber ?? '').replace(/\s/g, '')
  form.s2OzoneConcentration = String(form.s2OzoneConcentration ?? '').replace(/\s/g, '')
  form.s2OzoneDesinfectionCost = String(form.s2OzoneDesinfectionCost ?? '').replace(/\s/g, '')
  form.s2DryingDesinfectionTemperature = String(form.s2DryingDesinfectionTemperature ?? '').replace(/\s/g, '')
  form.s2DryingDesinfectionCost = String(form.s2DryingDesinfectionCost ?? '').replace(/\s/g, '')
  form.s2HighDryingDesinfectionTemperature = String(form.s2HighDryingDesinfectionTemperature ?? '').replace(/\s/g, '')
  form.s2HighDryingDesinfectionCost = String(form.s2HighDryingDesinfectionCost ?? '').replace(/\s/g, '')

  // 时间字段必填校验
  if (!form.s2StepName) { proxy.$modal.msgError('物料名称不能为空'); return }
  if (!form.s2StartTime) { proxy.$modal.msgError('请选择开始时间'); return }
  if (!form.s2EndTime) { proxy.$modal.msgError('请选择结束时间'); return }

  emit('step2Submit', {
    recordId: currentRecordId.value,
    s2StepName: form.s2StepName,
    s2StartTime: form.s2StartTime,
    s2EndTime: form.s2EndTime,
    s2OzoneDesinfectionFlag: form.s2OzoneDesinfectionFlag,
    s2HighDesinfectionTemperatureFlag: form.s2HighDesinfectionTemperatureFlag,
    s2OzoneGeneratorFlag: form.s2OzoneGeneratorFlag,
    s2OzoneGeneratorNumber: form.s2OzoneGeneratorNumber,
    s2BottleWashingMachineFlag: form.s2BottleWashingMachineFlag,
    s2BottleWashingMachineNumber: form.s2BottleWashingMachineNumber,
    s2BottleBlowingMachineFlag: form.s2BottleBlowingMachineFlag,
    s2BottleBlowingMachineNumber: form.s2BottleBlowingMachineNumber,
    s2AirGunFlag: form.s2AirGunFlag,
    s2ManualWashingFlag: form.s2ManualWashingFlag,
    s2WasherDryerComboFlag: form.s2WasherDryerComboFlag,
    s2WasherDryerComboNumber: form.s2WasherDryerComboNumber,
    s2OzoneConcentration: form.s2OzoneConcentration,
    s2OzoneDesinfectionStartTime: form.s2OzoneDesinfectionStartTime,
    s2OzoneDesinfectionEndTime: form.s2OzoneDesinfectionEndTime,
    s2OzoneDesinfectionCost: form.s2OzoneDesinfectionCost,
    s2DryingDesinfectionTemperature: form.s2DryingDesinfectionTemperature,
    s2DryingDesinfectionStartTime: form.s2DryingDesinfectionStartTime,
    s2DryingDesinfectionEndTime: form.s2DryingDesinfectionEndTime,
    s2DryingDesinfectionCost: form.s2DryingDesinfectionCost,
    s2HighDryingDesinfectionTemperature: form.s2HighDryingDesinfectionTemperature,
    s2HighDryingDesinfectionStartTime: form.s2HighDryingDesinfectionStartTime,
    s2HighDryingDesinfectionEndTime: form.s2HighDryingDesinfectionEndTime,
    s2HighDryingDesinfectionCost: form.s2HighDryingDesinfectionCost,
    s2WaiguanFlag: form.s2WaiguanFlag,
    s2PurifiedWaterFlag: form.s2PurifiedWaterFlag,
    s2NoPurifiedWaterFlag: form.s2NoPurifiedWaterFlag,
    s2CleanBagFlag: form.s2CleanBagFlag
  })
}


/** 格式化时间 HH:mm:ss → HH:mm */
function formatTime(timeStr) {
  if (!timeStr || timeStr.length < 5) return ''
  return timeStr.substring(0, 5)
}

/** Step3 提交 */
function handleSubmitStep3() {
  // 去空格
  form.s3StepName = String(form.s3StepName ?? '').replace(/\s/g, '')
  form.s3OzoneGeneratorNumber = String(form.s3OzoneGeneratorNumber ?? '').replace(/\s/g, '')
  form.s3BottleWashingMachineNumber = String(form.s3BottleWashingMachineNumber ?? '').replace(/\s/g, '')
  form.s3BottleBlowingMachineNumber = String(form.s3BottleBlowingMachineNumber ?? '').replace(/\s/g, '')
  form.s3AirShowerMachineNumber = String(form.s3AirShowerMachineNumber ?? '').replace(/\s/g, '')
  form.s3OzoneConcentration = String(form.s3OzoneConcentration ?? '').replace(/\s/g, '')
  form.s3OzoneDesinfectionCost = String(form.s3OzoneDesinfectionCost ?? '').replace(/\s/g, '')
  if (!form.s3StepName) { proxy.$modal.msgError('物料名称不能为空'); return }
  if (!form.s3StartTime) { proxy.$modal.msgError('请选择开始时间'); return }
  if (!form.s3EndTime) { proxy.$modal.msgError('请选择结束时间'); return }

  emit('step3Submit', {
    recordId: currentRecordId.value,
    s3StepName: form.s3StepName,
    s3StartTime: form.s3StartTime,
    s3EndTime: form.s3EndTime,
    s3OzoneDesinfectionFlag: form.s3OzoneDesinfectionFlag,
    s3AirShowerFlag: form.s3AirShowerFlag,
    s3OzoneGeneratorFlag: form.s3OzoneGeneratorFlag,
    s3OzoneGeneratorNumber: form.s3OzoneGeneratorNumber,
    s3BottleWashingMachineFlag: form.s3BottleWashingMachineFlag,
    s3BottleWashingMachineNumber: form.s3BottleWashingMachineNumber,
    s3BottleBlowingMachineFlag: form.s3BottleBlowingMachineFlag,
    s3BottleBlowingMachineNumber: form.s3BottleBlowingMachineNumber,
    s3AirShowerMachineFlag: form.s3AirShowerMachineFlag,
    s3AirShowerMachineNumber: form.s3AirShowerMachineNumber,
    s3OzoneConcentration: form.s3OzoneConcentration,
    s3OzoneDesinfectionStartTime: form.s3OzoneDesinfectionStartTime,
    s3OzoneDesinfectionEndTime: form.s3OzoneDesinfectionEndTime,
    s3OzoneDesinfectionCost: form.s3OzoneDesinfectionCost,
    s3AlcoholDesinfectionFlag: form.s3AlcoholDesinfectionFlag,
    s3UvDesinfectionFlag: form.s3UvDesinfectionFlag,
    s3AirShowerInnerPackagingFlag: form.s3AirShowerInnerPackagingFlag,
    s3WaiguanFlag: form.s3WaiguanFlag,
    s3CleanBagFlag: form.s3CleanBagFlag
  })
}

/** Step4 提交 */
function handleSubmitStep4() {
  emit('step4Submit', {
    recordId: currentRecordId.value,
    step4List: form.step4List
  })
}

function handleClosed() {
  currentRecordId.value = null
}

function close() { visible.value = false }

const emit = defineEmits(['step1Submit', 'step2Submit', 'step3Submit', 'step4Submit', 'submit'])

// 计算时间差（分钟），输入 HH:mm:ss
function getMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  return parts[0] * 60 + parts[1];
}

function diffMinutes(start, end) {
  if (!start || !end) return '';
  let startMin = getMinutes(start);
  let endMin = getMinutes(end);
  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60; // 跨天处理
  return diff;
}

// 自动计算 Step2 臭氧消毒时长
watch(
  () => [form.s2OzoneDesinfectionStartTime, form.s2OzoneDesinfectionEndTime],
  ([start, end]) => {
    form.s2OzoneDesinfectionCost = diffMinutes(start, end);
  },
  { immediate: true }
);

// 自动计算 Step2 高温消毒时长
watch(
  () => [form.s2DryingDesinfectionStartTime, form.s2DryingDesinfectionEndTime],
  ([start, end]) => {
    form.s2DryingDesinfectionCost = diffMinutes(start, end);
  },
  { immediate: true }
);

// 自动计算 Step3 臭氧消毒时长
watch(
  () => [form.s3OzoneDesinfectionStartTime, form.s3OzoneDesinfectionEndTime],
  ([start, end]) => {
    form.s3OzoneDesinfectionCost = diffMinutes(start, end);
  },
  { immediate: true }
);

defineExpose({ open, close })
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
  cursor: pointer;
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

/* ===== 新增：可编辑组件样式 ===== */
.edit-input-short {
  width: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 1px;
  font-size: 14px;
  text-align: center;
}
.edit-textarea {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 4px 6px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}
/* 输入框获得焦点时高亮背景色 */
.edit-input-short:focus,
.edit-textarea:focus {
  background-color: #e6f7ff; /* 浅蓝色，辨识度高 */
  outline: none;             /* 移除默认外边框，保持风格统一 */
}
</style>