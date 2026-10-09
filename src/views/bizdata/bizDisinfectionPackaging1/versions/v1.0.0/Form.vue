<template>
  <div class="dis-pack1-form-container">
    <!-- 顶部操作按钮 -->
    <div v-if="isEditMode || isApproveMode" style="text-align: right; margin-top: -52px; margin-bottom: 1px; width: 220px;">
      <el-button v-if="isEditMode" type="primary" @click="handleEditSubmit">保 存</el-button>
      <el-button v-if="isApproveMode" type="primary" @click="handleApproveSubmit">{{ buttonLabel || '确认' }}</el-button>
    </div>

    <div
      v-if="actionType !== 'PREVIEW' || !loading"
      class="view-container"
      :class="[
        actionType === 'PREVIEW' ? 'preview-mode' : '',
        isScrolling ? 'is-scrolling' : ''
      ]"
      @scroll="handlePreviewScroll"
    >
      <!-- ===== 公司名称 + 编号 + 标题 ===== -->
      <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
        <h3 style="flex: 1; text-align: center; margin: 0;">兰树化妆品股份有限公司</h3>
        <span style="flex-shrink: 0; font-size: 14px;">编号：R-(LS-SOP-S-G-006)-01</span>
      </div>
      <div style="text-align: center; margin-bottom: 4px; margin-left: -190px;">
        灌装包材处理记录
      </div>

      <!-- ===== 产品信息（只读） ===== -->
      <table class="row-table info-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 320px;">
          <col style="width: 80px;">
          <col style="width: 398px;">
          <col>
          <col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="info-label">产品名称</td>
          <td class="info-value">{{ batchRecord?.productName || '' }}</td>
          <td class="info-label">规格</td>
          <td class="info-value">{{ batchRecord?.spec || '' }}</td>
          <td class="info-label">产品批号</td>
          <td class="info-value">{{ batchRecord?.batchNumber || '' }}</td>
        </tr>
      </table>

      <!-- ===== 表头 ===== -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 400px;"><col><col style="width: 130px;">
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
          <col style="width: 80px;"><col style="width: 400px;"><col><col style="width: 130px;">
        </colgroup>
        <tr style="height: 120px;">
          <td class="td-step-label">1.开工前检查</td>
          <!-- td-no-padding 跨 col2+col3，承载内部左右分栏的 step1-inner -->
          <td class="td-no-padding" colspan="2">
            <table class="inner-fill-table step1-inner" style="border-collapse: collapse; font-size: 14px; width: 100%; height: 100%;">
              <tr style="height: 28px;">
                <td colspan="2" style="text-align: center;">
                  <template v-if="isEditMode">
                    <el-date-picker v-model="record.s1StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间" size="small" style="width: 180px;" />
                    <span style="margin: 0 8px;">至</span>
                    <el-date-picker v-model="record.s1EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间" size="small" style="width: 180px;" />
                  </template>
                  <template v-else>
                    {{ record.s1StartTime ? parseTime(record.s1StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s1EndTime ? parseTime(record.s1EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
                  </template>
                </td>
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
                  <template v-if="isEditMode">
                    <input v-model="record.s1NormalAreaTemperature" class="edit-input-short" placeholder="℃" /> ℃，
                    <input v-model="record.s1NormalAreaHumidity" class="edit-input-short" placeholder="%" /> %，
                    洁净区：
                    <input v-model="record.s1CleanAreaTemperature" class="edit-input-short" placeholder="℃" /> ℃，
                    <input v-model="record.s1CleanAreaHumidity" class="edit-input-short" placeholder="%" /> %
                  </template>
                  <template v-else>
                    {{ record.s1NormalAreaTemperature || '' }} ℃，{{ record.s1NormalAreaHumidity || '' }} %，
                    洁净区：{{ record.s1CleanAreaTemperature || '' }} ℃，{{ record.s1CleanAreaHumidity || '' }} %
                  </template>
                  <br/>
                  <div style="height: 5px;"></div>
                  <span>检查是否合格：</span>
                  <el-checkbox v-model="record.s1QualifiedFlag" true-value="Y" false-value="" :disabled="!isEditMode">是</el-checkbox>
                  <el-checkbox v-model="record.s1QualifiedFlag" true-value="N" false-value="" :disabled="!isEditMode">否</el-checkbox>
                  ；不合格情况说明及处理方式：<br/>
                  <template v-if="isEditMode">
                    <textarea v-model="record.s1Remark" class="edit-textarea" rows="2" placeholder="请输入不合格情况说明"></textarea>
                  </template>
                  <template v-else>
                    {{ record.s1Remark || '' }}
                  </template>
                </td>
              </tr>
            </table>
          </td>
          <td class="td-sign" style="border-bottom: none;"></td>
        </tr>
      </table>

      <!-- ===== Step2 处理 ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 400px;"><col><col style="width: 130px;">
        </colgroup>
        <tr style="height: 188px;">
          <td class="td-step-label">
            2.
            <template v-if="isEditMode">
              <el-input v-model="record.s2StepName" size="small" style="width: 75px;" />
            </template>
            <template v-else>{{ record.s2StepName || '' }}</template>
            <br>处理
          </td>
          <td class="td-no-padding">
            <table class="inner-fill-table step2-inner" style="border-collapse: collapse; font-size: 13px; width: 100%; height: 100%;">
              <tr style="height: 28px;">
                <td colspan="2" style="text-align: center;">
                  <template v-if="isEditMode">
                    <el-date-picker v-model="record.s2StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间" size="small" style="width: 180px;" />
                    <span style="margin: 0 8px;">至</span>
                    <el-date-picker v-model="record.s2EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间" size="small" style="width: 180px;" />
                  </template>
                  <template v-else>
                    {{ record.s2StartTime ? parseTime(record.s2StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s2EndTime ? parseTime(record.s2EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
                  </template>
                </td>
              </tr>
              <tr style="height: 28px;">
                <td class="split-left">
                  <el-checkbox v-model="record.s2OzoneDesinfectionFlag" true-value="Y" false-value="N" :disabled="!isEditMode">臭氧</el-checkbox>
                </td>
                <td class="split-right">
                  <el-checkbox v-model="record.s2HighDesinfectionTemperatureFlag" true-value="Y" false-value="N" :disabled="!isEditMode">高温</el-checkbox>
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
            <div style="padding: 0px 8px;">
              <div class="step-text">
                1）设备/编码：
                <el-checkbox v-model="record.s2OzoneGeneratorFlag" true-value="Y" false-value="N" :disabled="!isEditMode">臭氧机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s2OzoneGeneratorNumber" class="edit-input-short" /><span v-else>{{ record.s2OzoneGeneratorNumber || '' }}</span>）
                <el-checkbox v-model="record.s2BottleWashingMachineFlag" true-value="Y" false-value="N" :disabled="!isEditMode">洗瓶机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s2BottleWashingMachineNumber" class="edit-input-short" /><span v-else>{{ record.s2BottleWashingMachineNumber || '' }}</span>）
                <el-checkbox v-model="record.s2BottleBlowingMachineFlag" true-value="Y" false-value="N" :disabled="!isEditMode">吹瓶机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s2BottleBlowingMachineNumber" class="edit-input-short" /><span v-else>{{ record.s2BottleBlowingMachineNumber || '' }}</span>）
                <br>
                <el-checkbox v-model="record.s2AirGunFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 92px;">气枪</el-checkbox>
                <el-checkbox v-model="record.s2ManualWashingFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 16px;">手动洗</el-checkbox>
                <el-checkbox v-model="record.s2WasherDryerComboFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 16px;">洗烘一体机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s2WasherDryerComboNumber" class="edit-input-short" /><span v-else>{{ record.s2WasherDryerComboNumber || '' }}</span>）
                <br>
                2）
                <el-checkbox v-model="record.s2OzoneDesinfectionFlag" true-value="Y" false-value="N" :disabled="!isEditMode">臭氧</el-checkbox>
                ：消毒臭氧浓度
                <input v-if="isEditMode" v-model="record.s2OzoneConcentration" class="edit-input-short" /><span v-else>{{ record.s2OzoneConcentration || '' }}</span> ppm，
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间
                  <template v-if="isEditMode">
                    <el-time-picker v-model="record.s2OzoneDesinfectionStartTime" value-format="HH:mm:ss" placeholder="" size="small" style="width: 100px;" />
                    至 <el-time-picker v-model="record.s2OzoneDesinfectionEndTime" value-format="HH:mm:ss" placeholder="" size="small" style="width: 100px;" />
                  </template>
                  <template v-else>
                    {{ formatHm(record.s2OzoneDesinfectionStartTime) }} 至 {{ formatHm(record.s2OzoneDesinfectionEndTime) }}
                  </template>
                  ，共<input v-model="record.s2OzoneDesinfectionCost" disabled class="edit-input-short" /> 分钟
                </span>
                <br/>
                <el-checkbox v-model="record.s2HighDesinfectionTemperatureFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 16px;">高温</el-checkbox>
                ：烘干消毒温度
                <input v-if="isEditMode" v-model="record.s2DryingDesinfectionTemperature" class="edit-input-short" /><span v-else>{{ record.s2DryingDesinfectionTemperature || '' }}</span> ℃，
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间
                  <template v-if="isEditMode">
                    <el-time-picker v-model="record.s2DryingDesinfectionStartTime" value-format="HH:mm:ss" placeholder="" size="small" style="width: 100px;" />
                    至 <el-time-picker v-model="record.s2DryingDesinfectionEndTime" value-format="HH:mm:ss" placeholder="" size="small" style="width: 100px;" />
                  </template>
                  <template v-else>
                    {{ formatHm(record.s2DryingDesinfectionStartTime) }} 至 {{ formatHm(record.s2DryingDesinfectionEndTime) }}
                  </template>
                  ，共<input v-model="record.s2DryingDesinfectionCost" disabled class="edit-input-short" /> 分钟
                </span>
                <br/>
                <el-checkbox v-model="record.s2WasherDryerComboFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 16px;">洗烘一体机</el-checkbox>
                ：高温烘干消毒温度
                <input v-if="isEditMode" v-model="record.s2HighDryingDesinfectionTemperature" class="edit-input-short" /><span v-else>{{ record.s2HighDryingDesinfectionTemperature || '' }}</span> ℃，
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间
                  <template v-if="isEditMode">
                    <el-time-picker v-model="record.s2HighDryingDesinfectionStartTime" value-format="HH:mm:ss" placeholder="" size="small" style="width: 100px;" />
                    至 <el-time-picker v-model="record.s2HighDryingDesinfectionEndTime" value-format="HH:mm:ss" placeholder="" size="small" style="width: 100px;" />
                  </template>
                  <template v-else>
                    {{ formatHm(record.s2HighDryingDesinfectionStartTime) }} 至 {{ formatHm(record.s2HighDryingDesinfectionEndTime) }}
                  </template>
                </span>
                <br/>
                <span>3）是否干净，干燥、完好、外观无变色：</span>
                <el-checkbox v-model="record.s2WaiguanFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="record.s2WaiguanFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
                <br/>
                <span>4）洗瓶用水是否纯化水：</span>
                <el-checkbox v-model="record.s2PurifiedWaterFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="record.s2PurifiedWaterFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
                <el-checkbox v-model="record.s2NoPurifiedWaterFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 8px;">无此项</el-checkbox>
                <br/>
                <span>5）是否装入洁净袋：</span>
                <el-checkbox v-model="record.s2CleanBagFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="record.s2CleanBagFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
              </div>
            </div>
          </td>
          <td class="td-sign" style="border-top: none; border-bottom: none;">
            <div>操作人：{{ submitSignatureName }}</div>
            <div>{{ submitSignatureTime }}</div>
            <div style="height: 8px;"></div>
            <div>复核人：{{ reviewSignatureName }}</div>
            <div>{{ reviewSignatureTime }}</div>
            <div style="height: 8px;"></div>
            <div>检查人：{{ inspectSignatureName }}</div>
            <div>{{ inspectSignatureTime }}</div>
          </td>
        </tr>
      </table>

      <!-- ===== Step3 处理 ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 400px;"><col><col style="width: 130px;">
        </colgroup>
        <tr style="height: 153px;">
          <td class="td-step-label">
            3.
            <template v-if="isEditMode">
              <el-input v-model="record.s3StepName" size="small" style="width: 75px;" />
            </template>
            <template v-else>{{ record.s3StepName || '' }}</template>
            <br>处理
          </td>
          <td class="td-no-padding">
            <table class="inner-fill-table step3-inner" style="border-collapse: collapse; font-size: 13px; width: 100%; height: 100%;">
              <tr style="height: 28px;">
                <td colspan="2" style="text-align: center;">
                  <template v-if="isEditMode">
                    <el-date-picker v-model="record.s3StartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间" size="small" style="width: 180px;" />
                    <span style="margin: 0 8px;">至</span>
                    <el-date-picker v-model="record.s3EndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间" size="small" style="width: 180px;" />
                  </template>
                  <template v-else>
                    {{ record.s3StartTime ? parseTime(record.s3StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s3EndTime ? parseTime(record.s3EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }}
                  </template>
                </td>
              </tr>
              <tr style="height: 28px;">
                <td class="split-left">
                  <el-checkbox v-model="record.s3OzoneDesinfectionFlag" true-value="Y" false-value="N" :disabled="!isEditMode">臭氧</el-checkbox>
                </td>
                <td class="split-right">
                  <el-checkbox v-model="record.s3AirShowerFlag" true-value="Y" false-value="N" :disabled="!isEditMode">风淋</el-checkbox>
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
            <div style="padding: 0px 8px;">
              <div class="step-text">
                1）设备/编码：
                <el-checkbox v-model="record.s3OzoneGeneratorFlag" true-value="Y" false-value="N" :disabled="!isEditMode">臭氧机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s3OzoneGeneratorNumber" class="edit-input-short" /><span v-else>{{ record.s3OzoneGeneratorNumber || '' }}</span>）
                <el-checkbox v-model="record.s3BottleWashingMachineFlag" true-value="Y" false-value="N" :disabled="!isEditMode">洗瓶机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s3BottleWashingMachineNumber" class="edit-input-short" /><span v-else>{{ record.s3BottleWashingMachineNumber || '' }}</span>）
                <el-checkbox v-model="record.s3BottleBlowingMachineFlag" true-value="Y" false-value="N" :disabled="!isEditMode">吹瓶机</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s3BottleBlowingMachineNumber" class="edit-input-short" /><span v-else>{{ record.s3BottleBlowingMachineNumber || '' }}</span>）
                <br>
                <el-checkbox v-model="record.s3AirShowerMachineFlag" true-value="Y" false-value="N" :disabled="!isEditMode" style="margin-left: 92px;">风淋室</el-checkbox>
                （<input v-if="isEditMode" v-model="record.s3AirShowerMachineNumber" class="edit-input-short" /><span v-else>{{ record.s3AirShowerMachineNumber || '' }}</span>）
                <br>
                <span>2）消毒</span><br>
                <el-checkbox v-model="record.s3OzoneDesinfectionFlag" true-value="Y" false-value="N" :disabled="!isEditMode">臭氧</el-checkbox>
                ：臭氧浓度
                <input v-if="isEditMode" v-model="record.s3OzoneConcentration" class="edit-input-short" /><span v-else>{{ record.s3OzoneConcentration || '' }}</span> ppm，
                <el-checkbox v-model="record.s3AlcoholDesinfectionFlag" true-value="Y" false-value="N" :disabled="!isEditMode">75%酒精消毒</el-checkbox>
                <el-checkbox v-model="record.s3UvDesinfectionFlag" true-value="Y" false-value="N" :disabled="!isEditMode">紫外线消毒</el-checkbox>
                <br/>
                <span style="margin-left: 30px;">
                  消毒时间
                  <template v-if="isEditMode">
                    <el-time-picker v-model="record.s3OzoneDesinfectionStartTime" value-format="HH:mm:ss" size="small" style="width: 100px;" />
                    至 <el-time-picker v-model="record.s3OzoneDesinfectionEndTime" value-format="HH:mm:ss" size="small" style="width: 100px;" />
                  </template>
                  <template v-else>
                    {{ formatHm(record.s3OzoneDesinfectionStartTime) }} 至 {{ formatHm(record.s3OzoneDesinfectionEndTime) }}
                  </template>
                  ，共<input v-model="record.s3OzoneDesinfectionCost" disabled class="edit-input-short" /> 分钟
                </span>
                <br/>
                <el-checkbox v-model="record.s3AirShowerFlag" true-value="Y" false-value="N" :disabled="!isEditMode">风淋</el-checkbox>
                <span>，内包装是否完整：</span>
                <el-checkbox v-model="record.s3AirShowerInnerPackagingFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="record.s3AirShowerInnerPackagingFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
                <br/>
                <span>3）是否干净，干燥、完好、外观无变色：</span>
                <el-checkbox v-model="record.s3WaiguanFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="record.s3WaiguanFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
                <br/>
                <span>4）是否装入洁净袋：</span>
                <el-checkbox v-model="record.s3CleanBagFlag" true-value="Y" false-value="N" :disabled="!isEditMode">是</el-checkbox>
                <el-checkbox v-model="record.s3CleanBagFlag" true-value="N" false-value="Y" :disabled="!isEditMode">否</el-checkbox>
              </div>
            </div>
          </td>
          <td class="td-sign" style="border-top: none; border-bottom: none;"></td>
        </tr>
      </table>

      <!-- ===== Step4 物料使用统计 ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 400px;"><col><col style="width: 130px;">
        </colgroup>
        <tr style="height: 156px;">
          <td class="td-step-label">
            4.
            <template v-if="isEditMode">
              <el-input v-model="record.s4StepName" size="small" style="width: 75px;" />
            </template>
            <template v-else>{{ record.s4StepName || '物料使用统计' }}</template>
          </td>
          <td class="td-no-padding" colspan="2">
             <table class="inner-fill-table step4-inner" style="border-collapse: collapse; font-size: 12px; width: 100%; height: 100%;">
              <colgroup>
                <col style="width: 140px;"><col style="width: 130px;"><col style="width: 130px;">
                <col><col><col><col>
              </colgroup>
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
                <td>
                  <template v-if="isEditMode">
                    <BaseCategorySelect
                      v-model="item.materialCode"
                      api-url="/basic/material/listByCategory"
                      :category-code="STEP4_CATEGORY_CODE"
                      placeholder=""
                      @change="(code, name) => handleSelectChange(item, 'material', code, name)"
                    />
                  </template>
                  <template v-else>{{ item.materialName || '' }}</template>
                </td>
                <td>
                  <template v-if="isEditMode">
                    <BaseCategorySelect
                      v-model="item.spec"
                      api-url="/basic/spec/listByCategory"
                      :category-code="STEP4_CATEGORY_CODE"
                      placeholder=""
                      @change="(code, name) => handleSelectChange(item, 'spec', code, name)"
                    />
                  </template>
                  <template v-else>{{ item.spec || '' }}</template>
                </td>
                <td>
                  <template v-if="isEditMode">
                    <BaseCategorySelect
                      v-model="item.unit"
                      api-url="/basic/unit/listByCategory"
                      :category-code="STEP4_CATEGORY_CODE"
                      placeholder=""
                      @change="(code, name) => handleSelectChange(item, 'unit', code, name)"
                    />
                  </template>
                  <template v-else>{{ item.unit || '' }}</template>
                </td>
                <td>
                  <template v-if="isEditMode"><input v-model="item.receiveQty" class="edit-input-short" style="width: 60px;" /></template>
                  <template v-else>{{ item.receiveQty || '' }}</template>
                </td>
                <td>
                  <template v-if="isEditMode"><input v-model="item.useQty" class="edit-input-short" style="width: 60px;" /></template>
                  <template v-else>{{ item.useQty || '' }}</template>
                </td>
                <td>
                  <template v-if="isEditMode"><input v-model="item.lossQty" class="edit-input-short" style="width: 60px;" /></template>
                  <template v-else>{{ item.lossQty || '' }}</template>
                </td>
                <td>
                  <template v-if="isEditMode"><input v-model="item.remainQty" class="edit-input-short" style="width: 60px;" /></template>
                  <template v-else>{{ item.remainQty || '' }}</template>
                </td>
              </tr>
            </table>
          </td>
          <td class="td-sign" style="border-top: none;"></td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBizDisinfectionPackaging1Detail } from '@/api/bizdata/bizDisinfectionPackaging1'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import BaseCategorySelect from '@/components/BaseCategorySelect/index.vue'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'DisinfectionPackaging1Form' })

/** Step4 物料/规格/单位选择的分类码（本表单为包装材料相关，暂固定） */
const STEP4_CATEGORY_CODE = 'PACKAGING_MATERIAL'

/**
 * 组件 Props 定义
 * actionType: 操作类型（大写：PREVIEW/EDIT/SUBMIT 等）
 * recordId: 批记录ID（预览空模板时可不传，其他场景必填）
 * menuId: 按钮节点ID（编辑/审批时必填）
 * businessRecordId: 业务记录ID（编辑/审批/查看真实数据时必填；预览空模板时可不传）
 * cMenuId: 当前表单对应的 C 节点 ID（用于获取签名行数据；预览空模板时可不传）
 * backendRoute: 后端接口路径模板（来自操作码配置，需包含占位符）
 */
const props = defineProps({
  actionType: { type: String, default: 'PREVIEW' },
  recordId: { type: Number, default: null },
  menuId: { type: Number, default: null },
  businessRecordId: { type: Number, default: null },
  cMenuId: { type: Number, default: null },
  operationCode: { type: String, default: '' },
  backendRoute: { type: String, default: '' },
  tableName: { type: String, default: '' },
  menuName: { type: String, default: '' },
  buttonLabel: { type: String, default: '确认' }
})

const emit = defineEmits(['closed', 'refresh'])

const loading = ref(false)
const batchRecord = ref(null)
const fNodes = ref([])

/** 主表业务字段（初始化为空，避免模板访问 undefined） */
const record = reactive({
  recordId: null,
  orderId: null, orderNum: '', workshop: '',
  startTime: null, endTime: null, processDate: null,
  // Step1
  s1StepName: '', s1StartTime: null, s1EndTime: null,
  s1NormalAreaTemperature: '', s1NormalAreaHumidity: '',
  s1CleanAreaTemperature: '', s1CleanAreaHumidity: '',
  s1QualifiedFlag: '', s1Remark: '',
  // Step2
  s2StepName: '', s2StartTime: null, s2EndTime: null,
  s2OzoneDesinfectionFlag: '', s2HighDesinfectionTemperatureFlag: '',
  s2OzoneGeneratorFlag: '', s2OzoneGeneratorNumber: '',
  s2BottleWashingMachineFlag: '', s2BottleWashingMachineNumber: '',
  s2BottleBlowingMachineFlag: '', s2BottleBlowingMachineNumber: '',
  s2AirGunFlag: '', s2ManualWashingFlag: '',
  s2WasherDryerComboFlag: '', s2WasherDryerComboNumber: '',
  s2OzoneConcentration: '',
  s2OzoneDesinfectionStartTime: null, s2OzoneDesinfectionEndTime: null, s2OzoneDesinfectionCost: '',
  s2DryingDesinfectionTemperature: '',
  s2DryingDesinfectionStartTime: null, s2DryingDesinfectionEndTime: null, s2DryingDesinfectionCost: '',
  s2HighDryingDesinfectionTemperature: '',
  s2HighDryingDesinfectionStartTime: null, s2HighDryingDesinfectionEndTime: null, s2HighDryingDesinfectionCost: '',
  s2WaiguanFlag: '', s2PurifiedWaterFlag: '', s2NoPurifiedWaterFlag: '', s2CleanBagFlag: '',
  // Step3
  s3StepName: '', s3StartTime: null, s3EndTime: null,
  s3OzoneDesinfectionFlag: '', s3AirShowerFlag: '',
  s3OzoneGeneratorFlag: '', s3OzoneGeneratorNumber: '',
  s3BottleWashingMachineFlag: '', s3BottleWashingMachineNumber: '',
  s3BottleBlowingMachineFlag: '', s3BottleBlowingMachineNumber: '',
  s3AirShowerMachineFlag: '', s3AirShowerMachineNumber: '',
  s3OzoneConcentration: '',
  s3OzoneDesinfectionStartTime: null, s3OzoneDesinfectionEndTime: null, s3OzoneDesinfectionCost: '',
  s3AlcoholDesinfectionFlag: '', s3UvDesinfectionFlag: '',
  s3AirShowerInnerPackagingFlag: '', s3WaiguanFlag: '', s3CleanBagFlag: '',
  // Step4
  s4StepName: '',
  step4List: []
})

const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isApproveMode = computed(() => !isEditMode.value && !isPreviewMode.value)

// ==================== 滚动条显隐控制 ====================
/**
 * 是否正在滚动。用于控制 .view-container（预览/编辑/审批三模式通用）下滚动条的显示/隐藏。
 * 由 handlePreviewScroll 维护；停止滚动 800ms 后自动隐藏。
 */
const isScrolling = ref(false)
let scrollHideTimer = null

function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) clearTimeout(scrollHideTimer)
  scrollHideTimer = setTimeout(() => { isScrolling.value = false }, 800)
}

// ==================== 签名行计算属性 ====================
/**
 * 从 fNodes 中筛选出已完成的 SUBMIT / REVIEW / INSPECT 节点。
 * 筛选条件：actionType 匹配且 operatorTime 非空。
 * 未完成时对应 node 为 undefined，签名区显示空字符串。
 */
const submitNode = computed(() =>
  fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'SUBMIT' && btn.operatorTime)
)
const reviewNode = computed(() =>
  fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'REVIEW' && btn.operatorTime)
)
const inspectNode = computed(() =>
  fNodes.value.find(btn => btn.actionType?.toUpperCase() === 'INSPECT' && btn.operatorTime)
)

const submitSignatureName = computed(() => submitNode.value?.operator || '')
const submitSignatureTime = computed(() =>
  submitNode.value?.operatorTime ? parseTime(submitNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : ''
)
const reviewSignatureName = computed(() => reviewNode.value?.operator || '')
const reviewSignatureTime = computed(() =>
  reviewNode.value?.operatorTime ? parseTime(reviewNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : ''
)
const inspectSignatureName = computed(() => inspectNode.value?.operator || '')
const inspectSignatureTime = computed(() =>
  inspectNode.value?.operatorTime ? parseTime(inspectNode.value.operatorTime, '{y}-{m}-{d} {h}:{i}') : ''
)

// ==================== Step4 显示行 ====================
/** 确保 Step4 至少有 4 行（前端展示层保证） */
const paddedStep4List = computed(() => {
  const list = record.step4List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push(createEmptyStep4Row())
  return result
})

// ==================== 时间格式化辅助 ====================
/** 将 HH:mm:ss 截断为 HH:mm 用于只读展示 */
function formatHm(timeStr) {
  if (!timeStr) return ''
  const s = String(timeStr)
  return s.length >= 5 ? s.substring(0, 5) : s
}

// ==================== 数据加载 ====================
/**
 * 组件初始化：
 * - 加载 C 节点下 F 节点用于签名回显（无 cMenuId 时内部防御）
 * - 预览态且无 businessRecordId：不调用任何后端接口，纯本地初始化空模板
 *   （对齐领料单 Form.vue：设计态预览 / 生成批记录时预览空模板均走此分支）
 * - 其余场景（编辑/审批/预览真实数据）：加载批记录信息 + 业务详情
 */
onMounted(async () => {
  await loadFNodes()
  if (isPreviewMode.value && !props.businessRecordId) {
    // 预览空模板：不调任何后端接口，仅本地初始化
    initEmptyTemplate()
  } else {
    await loadData()
  }
})

/**
 * 加载当前 C 节点下的所有 F 节点（用于签名行数据回显）
 *
 * 关键防御：预览空模板态下 cMenuId 为 undefined，直接返回，避免触发接口请求。
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
 * 预览空模板初始化（预览态且无 businessRecordId）
 *
 * 关键约束：预览态下 recordId / businessRecordId / cMenuId 均为 undefined，
 * 不允许调用任何后端接口。此处仅本地初始化：
 * - step4List 补齐为 4 行空对象
 * - batchRecord 保持 null，模板通过 batchRecord?.xxx 显示为空
 * - record 已通过 reactive 初始化为全空字段，无需额外处理
 */
function initEmptyTemplate() {
  record.step4List = [
    createEmptyStep4Row(),
    createEmptyStep4Row(),
    createEmptyStep4Row(),
    createEmptyStep4Row()
  ]
}

/**
 * 创建 Step4 空白行
 */
function createEmptyStep4Row() {
  return {
    stepId: null,
    recordId: null,
    seqNo: null,
    materialCode: '', materialName: '',
    spec: '', unit: '',
    receiveQty: '', useQty: '', lossQty: '', remainQty: ''
  }
}

/**
 * 加载批记录信息 + 业务详情（含 step4List）
 *
 * 防御：recordId 未传时不请求批记录接口（避免 /batch/batch_record/undefined 报错）。
 * 正常编辑/审批场景 recordId 必有值，此防御仅兜底。
 */
async function loadData() {
  loading.value = true
  try {
    const detailPromise = getBizDisinfectionPackaging1Detail(props.businessRecordId)
    const recordPromise = props.recordId
      ? getBatch_record(props.recordId)
      : Promise.resolve({ data: null })
    const [detailRes, recordRes] = await Promise.all([detailPromise, recordPromise])

    batchRecord.value = recordRes.data || null
    const data = detailRes.data || {}
    Object.assign(record, data)

    // 保证 step4List 至少 4 行（后端按固定 4 行返回，此处兜底）
    const step4 = Array.isArray(record.step4List) ? record.step4List : []
    while (step4.length < 4) step4.push(createEmptyStep4Row())
    record.step4List = step4
  } catch (error) {
    ElMessage.error('加载灌装包材处理记录1数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 选择器回填 ====================
/**
 * 处理 BaseCategorySelect 的选中变化
 *
 * code 已由 v-model 双向绑定，此处只需回填 name 快照字段。
 *
 * @param {Object} row 当前行数据对象
 * @param {String} type 字段类型（material / spec / unit）
 * @param {String} code 选中的 code（可忽略，因 v-model 已绑定）
 * @param {String} name 选中的 name 快照
 */
function handleSelectChange(row, type, code, name) {
  if (type === 'material') row.materialName = name || ''
  else if (type === 'spec') row.spec = name || ''
  else if (type === 'unit') row.unit = name || ''
}

// ==================== 通用动态请求 ====================
/**
 * 动态调用后端接口
 *
 * 将路径模板中的占位符替换为实际参数值，然后发起请求。
 * 占位符格式：{参数名}，例如 /batch/batch_record_menu/approve/{menuId}?remark={remark}
 * 空值占位符会连同其前面的 ? 或 & 一起剔除。
 *
 * @param {String} routeTemplate 路径模板
 * @param {Object} pathParams 占位符参数映射
 * @param {Object} data 请求体（POST/PUT 等需要时使用）
 * @param {String} method 请求方法，默认 post
 * @returns {Promise}
 */
async function dynamicRequest(routeTemplate, pathParams, data = {}, method = 'post') {
  let url = routeTemplate
  Object.keys(pathParams).forEach(key => {
    const value = (pathParams[key] !== undefined && pathParams[key] !== null)
      ? encodeURIComponent(pathParams[key])
      : ''
    url = url.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  })
  url = url.replace(/[?&][^=]*=\{[^}]*\}/g, '')
  url = url.replace(/[?&]$/, '')

  return request({ url, method, data })
}

// ==================== 校验 ====================
/**
 * 编辑提交前的校验（仅校验业务字段，不含签名）
 *
 * 校验项：
 * - Step1/2/3 的开始/结束时间均必填
 * - Step4 已填写行的领入量/使用量若填写必须为数字
 */
function beforeSubmitCheck() {
  if (!record.s1StartTime) { ElMessage.error('请选择 Step1 开始时间'); return false }
  if (!record.s1EndTime) { ElMessage.error('请选择 Step1 结束时间'); return false }

  if (!record.s2StartTime) { ElMessage.error('请选择 Step2 开始时间'); return false }
  if (!record.s2EndTime) { ElMessage.error('请选择 Step2 结束时间'); return false }

  if (!record.s3StartTime) { ElMessage.error('请选择 Step3 开始时间'); return false }
  if (!record.s3EndTime) { ElMessage.error('请选择 Step3 结束时间'); return false }

  const numberPattern = /^\d+(\.\d+)?$/
  for (let i = 0; i < record.step4List.length; i++) {
    const item = record.step4List[i]
    const hasAny = item.materialCode || item.spec || item.unit ||
                   item.receiveQty || item.useQty || item.lossQty || item.remainQty
    if (!hasAny) continue
    const rowNum = i + 1
    if (item.receiveQty && !numberPattern.test(String(item.receiveQty).trim())) {
      ElMessage.error(`Step4 第${rowNum}行领入量格式错误`); return false
    }
    if (item.useQty && !numberPattern.test(String(item.useQty).trim())) {
      ElMessage.error(`Step4 第${rowNum}行使用量格式错误`); return false
    }
  }
  return true
}

// ==================== 编辑保存 ====================
/**
 * 编辑模式：保存修改（带二次确认）
 *
 * 通过 props.backendRoute 动态拼接后端接口，不再硬编码具体 API。
 * step4List 提交前过滤掉全空行，后端按 stepId 存在与否做 update/insert。
 */
async function handleEditSubmit() {
  if (!beforeSubmitCheck()) return
  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
  } catch (error) { return }

  const payload = { ...record }
  payload.step4List = record.step4List.filter(item =>
    item.materialCode || item.spec || item.unit ||
    item.receiveQty || item.useQty || item.lossQty || item.remainQty
  )

  try {
    const routeTemplate = props.backendRoute ||
      '/bizdata/bizDisinfectionPackaging1/edit/{businessRecordId}?menuId={menuId}'
    const urlParams = {
      businessRecordId: props.businessRecordId,
      menuId: props.menuId
    }
    // 兼容某些操作码模板用 {recordId} 的情况
    if (routeTemplate.includes('{recordId}')) {
      urlParams.recordId = props.businessRecordId
    }
    await dynamicRequest(routeTemplate, urlParams, payload, 'post')
    ElMessage.success('保存成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// ==================== 审批提交 ====================
/**
 * 审批模式：执行审批/反审操作
 *
 * 反审操作必须输入原因；正向操作可输入审批意见（可选）。
 * 通过 props.backendRoute 动态拼接后端接口，默认走通用审批路径。
 */
async function handleApproveSubmit() {
  let remark = ''

  if (props.actionType && props.actionType.toUpperCase().startsWith('CANCEL_')) {
    try {
      const { value } = await ElMessageBox.prompt('请输入取消原因', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消',
        inputValidator: (val) => val && val.trim() ? true : '原因不能为空'
      })
      remark = value.trim()
    } catch (error) { return }
  } else {
    try {
      const { value } = await ElMessageBox.prompt(
        `确认执行「${props.menuName || props.buttonLabel}」操作吗？可输入审批意见`,
        '提示',
        {
          confirmButtonText: '确定', cancelButtonText: '取消',
          inputValue: '', inputPlaceholder: '审批意见（可选）'
        }
      )
      remark = value ? value.trim() : ''
    } catch (error) { return }
  }

  try {
    const routeTemplate = props.backendRoute ||
      '/batch/batch_record_menu/approve/{menuId}?remark={remark}'
    await dynamicRequest(routeTemplate, { menuId: props.menuId, remark })
    ElMessage.success('操作成功')
    emit('refresh')
    emit('closed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
/* ============================================================
   容器
   ============================================================ */
.dis-pack1-form-container {
  padding: 8px;
}
.view-container {
  overflow-x: hidden;
  overflow-y: auto;
  height: 85vh;
  box-sizing: border-box;
  color: #000;
}
/* 预览模式固定高度，用于生成批记录时展示 A4 样式；允许滚动，避免底部内容被裁 */
.preview-mode {
  height: 201mm;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ============================================================
   表格通用样式
   ============================================================ */
.row-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  table-layout: fixed;
  margin-bottom: -1px;
}

/* ============================================================
 * 关闭 Step1~Step4 表格的上下边框
 *
 * 原因：在 border-collapse: collapse 模式下，table 的 border 与
 * 边缘 td 的 border 竞争显示。即使签名 td 用行内样式把自身
 * border-top / border-bottom 设为 none，table 的上下边框仍会在
 * 签名列位置留下水平分隔线（用户观察到的"table 边框线"）。
 *
 * 处理：
 * - 关闭 step table 的上下边框，让上下水平线改由相邻 td 的
 *   border 合并提供（左侧三列 td 边框不受影响，视觉保持 1px）。
 * - 签名 td 的上下边框已在模板行内样式中设为 none，因此签名列
 *   在 Step1~Step4 之间完全无线，视觉上呈现为跨 4 行的合并单元格。
 *
 * 注意：产品信息表（info-table）与表头（header-table）不在此列，
 * 它们的上下边框保留，用于和相邻表格形成正常的水平分隔线。
 * ============================================================ */
.step-table-native {
  border-top: none;
  border-bottom: none;
}

.info-table td, .header-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: middle;
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
.header-value {
  font-weight: normal;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
}

/* Step1~Step4 外层单元格通用样式 */
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

/* Step1~Step3 内部表格分隔线 */
.step1-inner td,
.step2-inner td,
.step3-inner td {
  border-bottom: 1px solid #dcdfe6;
  padding: 4px 0px;
}
.step1-inner td:first-child,
.step2-inner td:first-child,
.step3-inner td:first-child {
  border-right: 1px solid #dcdfe6;
}
.step1-inner tr:last-child td,
.step2-inner tr:last-child td,
.step3-inner tr:last-child td {
  border-bottom: none;
}
.step1-inner td[colspan="2"],
.step2-inner td[colspan="2"],
.step3-inner td[colspan="2"] {
  text-align: center;
  border-right: none;
}

/* 左右分栏 */
.s1-split-left { width: 400px; }
.split-left { width: 52%; }
.split-right { width: 48%; }

/* Step2/Step3 内部样式 */
.step2-inner td,
.step3-inner td { vertical-align: middle; }
.step2-inner .split-left,
.step2-inner .split-right,
.step3-inner .split-left,
.step3-inner .split-right { text-align: center; }
.step2-inner .split-text,
.step3-inner .split-text { text-align: left; vertical-align: middle; }

/* Step4 内部表格分隔线 */
.step4-inner td, .step4-inner th {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 4px;
  text-align: center;
  vertical-align: middle;
}
.step4-inner td:last-child, .step4-inner th:last-child { border-right: none; }
.step4-inner tr:last-child td { border-bottom: none; }

/* 共用单元格样式 */
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}
.td-sign {
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 6px !important;
}
.step-text {
  font-size: 13px;
  line-height: 1.5;
}

/* ============================================================
   el-checkbox 微调：统一紧凑样式
   ============================================================ */
.view-container :deep(.el-checkbox) {
  height: auto;
  margin-right: 12px;
  font-size: 13px;
}
.view-container :deep(.el-checkbox__label) {
  font-size: 13px;
  padding-left: 4px;
}
.view-container :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

/* ============================================================
   编辑态短输入框 / 文本域
   ============================================================ */
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
.edit-input-short:focus,
.edit-textarea:focus {
  background-color: #e6f7ff;
  outline: none;
}

/* ============================================================
   滚动条：滚动时显示，停止 800ms 后隐藏
   ============================================================ */
.view-container::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.view-container::-webkit-scrollbar-track {
  background: transparent;
}
.view-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
  transition: background 0.25s ease;
}
.view-container.is-scrolling::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.5);
}
.view-container.is-scrolling::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.8);
}
.view-container {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.view-container.is-scrolling {
  scrollbar-color: rgba(144, 147, 153, 0.5) transparent;
}

</style>