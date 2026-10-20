<template>
  <div class="dis-pack1-form-container">
    <!-- 顶部操作按钮 -->
    <div v-if="isEditMode || isApproveMode" style="text-align: right; margin-top: -52px; margin-bottom: 1px; width: 380px;">
      <el-button v-if="isEditMode" type="primary" @click="handleSyncMaterialFromReceiving">从领料单同步物料</el-button>
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
          <col style="width: 300px;">
          <col style="width: 80px;">
          <col>
          <col style="width: 80px;">
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

      <!-- ===== 表头（4 列） ===== -->
      <table class="row-table header-table" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;"><col style="width: 300px;"><col><col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="header-value">操作项目</td>
          <td class="header-value">工艺要求</td>
          <td class="header-value">操作记录</td>
          <td class="header-value">/</td>
        </tr>
      </table>

      <!-- ===== Step1 开工前检查（主表区域，独立签名列） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 300px;">
          <col>
          <col style="width: 130px;">
        </colgroup>
        <tr>
          <td class="td-step-label td-step-label-row">1.开工前检查</td>

          <!-- 第2列：工艺要求（时间 + 5 条固定文本，参考 Step2） -->
          <td class="td-process-cell">
            <div class="process-time-row">
              <template v-if="isEditMode">
                <el-date-picker
                  v-model="s1TimeRange"
                  type="datetimerange"
                  value-format="YYYY-MM-DD HH:mm:00"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  size="small"
                  style="width: 280px;" />
              </template>
              <template v-else>
                <span class="filled-value" style="color: #4046ff;">
                {{ record.s1StartTime ? parseTime(record.s1StartTime, '{y}-{m}-{d} {h}:{i}') : '' }} 至 {{ record.s1EndTime ? parseTime(record.s1EndTime, '{y}-{m}-{d} {h}:{i}') : '' }}
                </span>
                <!-- {{ record.s1StartTime ? parseTime(record.s1StartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ record.s1EndTime ? parseTime(record.s1EndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} -->
              </template>
            </div>
            <div class="process-fixed-text1">
              1）一般区操作间温度0～35℃，相对湿度20%～85%；<br/>
              2）洁净区温度18～26℃，相对湿度 45%～65%；<br/>
              3）该批次生产记录齐全；<br/>
              4）岗位操作规程、设备操作规程齐全；<br/>
              5）操作间及设备已清洁。
            </div>
          </td>

          <!-- 第3列：操作记录（温湿度 + 检查 + 不合格说明） -->
          <td class="td-record-cell td-record-block">
            <div :class="isEditMode ? 'step-text' : 'record-view-text'">
              <!-- ========== 编辑态：输入框 + checkbox ========== -->
              <template v-if="isEditMode">
                温湿度记录：<br/>
                一般区：
                <input v-model="record.s1NormalAreaTemperature" class="edit-input-short" placeholder="℃" /> ℃，
                <input v-model="record.s1NormalAreaHumidity" class="edit-input-short" placeholder="%" /> %，
                洁净区：
                <input v-model="record.s1CleanAreaTemperature" class="edit-input-short" placeholder="℃" /> ℃，
                <input v-model="record.s1CleanAreaHumidity" class="edit-input-short" placeholder="%" /> %
                <br/>
                <div style="height: 5px;"></div>
                <span>检查是否合格：</span>
                <el-checkbox v-model="record.s1QualifiedFlag" true-value="Y" false-value="">是</el-checkbox>
                <el-checkbox v-model="record.s1QualifiedFlag" true-value="N" false-value="">否</el-checkbox>
                ；不合格情况说明及处理方式：<br/>
                <textarea v-model="record.s1Remark" class="edit-textarea" rows="2" placeholder="请输入不合格情况说明"></textarea>
              </template>

              <!-- ========== 非编辑态：纯文本 + 动态值突出 ========== -->
              <template v-else>
                温湿度记录：<br/>
                一般区：
                <span class="filled-value">{{ record.s1NormalAreaTemperature || '' }}</span> ℃，
                <span class="filled-value">{{ record.s1NormalAreaHumidity || '' }}</span> %，
                洁净区：
                <span class="filled-value">{{ record.s1CleanAreaTemperature || '' }}</span> ℃，
                <span class="filled-value">{{ record.s1CleanAreaHumidity || '' }}</span> %
                <br/>
                <div style="height: 5px;"></div>
                <span>检查是否合格：</span>
                <span class="filled-value">{{ record.s1QualifiedFlag === 'Y' ? '是' : (record.s1QualifiedFlag === 'N' ? '否' : '') }}</span>
                ；不合格情况说明及处理方式：<br/>
                <span class="filled-value">{{ record.s1Remark || '' }}</span>
              </template>
            </div>
          </td>

          <!-- 第4列：签名（留空） -->
          <td class="td-sign"></td>
        </tr>
      </table>

       <!-- ===== Step2 消毒处理（子表区域，4 行 v-for，无表头） ===== -->
      <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 80px;">   <!-- 操作项目 -->
          <col style="width: 300px;">  <!-- 工艺要求 -->
          <col>                         <!-- 操作记录 -->
          <col style="width: 130px;">  <!-- 签名（跨4行） -->
        </colgroup>
        <tr v-for="(item, idx) in paddedStep2List" :key="idx" style="height: 105px;">
          <!-- 第1列：每行独立（编辑态：物料下拉 + 回显；非编辑态：2.n 物料名处理） -->
          <td class="td-step-label td-step-label-row">
            <template v-if="isEditMode">
              <div class="step-row-top">
                <div class="step-material-wrap">
                  <BaseCategorySelect
                    v-model="item.materialCode"
                    api-url="/basic/material/listByCategory"
                    :category-code="MATERIAL_CATEGORY_CODE"
                    placeholder=""
                    @change="(code, name) => handleSelectChange(item, 'material', code, name)"
                  />
                </div>
              </div>
              <div class="step-row-echo">
                2.{{ idx + 1 }}{{ item.materialName || '' }}
                <br/>处理
              </div>
            </template>
            <template v-else>
              <div class="step-row-view">
                2.{{ idx + 1 }} {{ item.materialName || '' }}处理
              </div>
            </template>
          </td>

          <!-- 第2列：工艺要求（时间 + 工艺复选 + 工艺文本） -->
          <td class="td-process-cell">
            <!-- 时间字段：datetimerange 单组件（编辑态） / 纯文本（非编辑态） -->
            <div class="process-time-row">
              <template v-if="isEditMode">
                <el-date-picker
                  :model-value="getStepTimeRange(item)"
                  @update:model-value="(val) => setStepTimeRange(item, val)"
                  type="datetimerange"
                  value-format="YYYY-MM-DD HH:mm:00"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  size="small"
                  style="width: 280px;" />
              </template>
              <template v-else>
                <span class="filled-value" style="color: #4046ff;">
                {{ item.stepStartTime ? parseTime(item.stepStartTime, '{y}-{m}-{d} {h}:{i}') : '' }} 至 {{ item.stepEndTime ? parseTime(item.stepEndTime, '{y}-{m}-{d} {h}:{i}') : '' }}
                </span>
                <!-- {{ item.stepStartTime ? parseTime(item.stepStartTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} 至 {{ item.stepEndTime ? parseTime(item.stepEndTime, '{y}年{m}月{d}日 {h}:{i}') : '' }} -->
              </template>
            </div>

            <!-- 工艺单选（4 个复选框视觉，行为互斥） -->
            <div class="process-checkbox-row" style="text-align: center;">
              <el-checkbox
                :model-value="item.disinfectionProcess === 'process_OZONE1'"
                :disabled="!isEditMode"
                @change="(val) => toggleProcess(item, 'process_OZONE1', val)">臭氧1</el-checkbox>
              <el-checkbox
                :model-value="item.disinfectionProcess === 'process_HIGH_TEMP'"
                :disabled="!isEditMode"
                @change="(val) => toggleProcess(item, 'process_HIGH_TEMP', val)">高温</el-checkbox>
              <el-checkbox
                :model-value="item.disinfectionProcess === 'process_OZONE2'"
                :disabled="!isEditMode"
                @change="(val) => toggleProcess(item, 'process_OZONE2', val)">臭氧2</el-checkbox>
              <el-checkbox
                :model-value="item.disinfectionProcess === 'process_AIR_SHOWER'"
                :disabled="!isEditMode"
                @change="(val) => toggleProcess(item, 'process_AIR_SHOWER', val)">风淋</el-checkbox>
            </div>

            <!-- 工艺固定文本（未选时提示，选中时展示对应文本） -->
            <div class="process-fixed-text1">
              <template v-if="!item.disinfectionProcess">
                <br/>
                <span style="color: #ff0000;">外盖、内塞、手拉垫、泵头、次抛，请选择工艺：臭氧2</span>
              </template>
              <template v-else-if="item.disinfectionProcess === 'process_OZONE1'">
                1）脱包；<br/>
                2）挑选，确认外观无变色；<br/>
                3）用吹瓶机或气枪吹瓶；<br/>
                4）用臭氧灭菌柜消毒；<br/>
                5）消毒臭氧浓度20ppm，30分钟。
              </template>
              <template v-else-if="item.disinfectionProcess === 'process_HIGH_TEMP'">
                1）脱包；<br/>
                2）挑拣，确认外观无变色；<br/>
                3）用洗瓶机洗瓶、烘干消毒；<br/>
                4）洗瓶用水为纯化水；<br/>
                5）按照瓶型设定烘干消毒温度。
              </template>
              <template v-else-if="item.disinfectionProcess === 'process_OZONE2'">
                1）脱包；<br/>
                2）挑选；<br/>
                3）用臭氧灭菌柜消毒；<br/>
                4）消毒臭氧浓度20ppm，30分钟。
              </template>
              <template v-else-if="item.disinfectionProcess === 'process_AIR_SHOWER'">
                1）脱包；<br/>
                2）75%酒精消毒或者紫外消毒；<br/>
                3）放入风淋室，风淋吹扫静置。
              </template>
            </div>
          </td>

          <!-- 第3列：操作记录（按工艺物理拆分：臭氧1 / 高温 / 臭氧2 / 风淋） -->
          <td class="td-record-cell td-record-block">
            <div :class="isEditMode ? 'step-text' : 'record-view-text'">

              <!-- ============================ 编辑态 ============================ -->
              <template v-if="isEditMode">

                <!-- ========== 工艺：臭氧1 ========== -->
                <template v-if="item.disinfectionProcess === 'process_OZONE1'">
                  <!-- 1）设备/编码 -->
                  <div class="device-row">
                    <span class="device-row-label">1）设备/编码：</span>
                    <el-select
                      v-model="item.deviceCode1"
                      size="small"
                      placeholder="请选择设备1"
                      class="device-select"
                      @change="(code) => handleDeviceChange(item, 1, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode1" readonly class="edit-input-device-code" placeholder="编码" />
                    <el-select
                      v-model="item.deviceCode2"
                      size="small"
                      placeholder="请选择设备2"
                      class="device-select"
                      style="margin-left: 20px;"
                      @change="(code) => handleDeviceChange(item, 2, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode2" readonly class="edit-input-device-code" placeholder="编码" />
                  </div>
                  <!-- 2）消毒 -->
                  <div style="margin-top: 0px;">
                    <span>2）消毒</span>
                    <span style="font-weight: bold; margin-left: 18px;">臭氧</span>
                    ，臭氧浓度
                    <input v-model="item.disinfectionParam" class="edit-input-short" style="width: 50px;" /> ppm
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <el-time-picker
                        :model-value="getDisinfectionTimeRange(item)"
                        @update:model-value="(val) => setDisinfectionTimeRange(item, val)"
                        is-range
                        value-format="HH:mm:00"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        size="small"
                        style="width: 120px;" />
                      ，共 <input v-model="item.disinfectionCost" disabled class="edit-input-short" /> 分钟
                    </span>
                  </div>
                  <!-- 3）干净干燥完好 -->
                  <div style="margin-top: 0px;">
                    <span>3）是否干净，干燥、完好、外观无变色：</span>
                    <el-checkbox :model-value="item.waiguanFlag === 'Y'"
                      @change="(val) => { item.waiguanFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.waiguanFlag === 'N'"
                      @change="(val) => { item.waiguanFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                  <!-- 4）装入洁净袋 -->
                  <div style="margin-top: 0px;">
                    <span>4）是否装入洁净袋：</span>
                    <el-checkbox :model-value="item.cleanBagFlag === 'Y'"
                      @change="(val) => { item.cleanBagFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.cleanBagFlag === 'N'"
                      @change="(val) => { item.cleanBagFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                </template>

                <!-- ========== 工艺：高温 ========== -->
                <template v-else-if="item.disinfectionProcess === 'process_HIGH_TEMP'">
                  <!-- 1）设备/编码 -->
                  <div class="device-row">
                    <span class="device-row-label">1）设备/编码：</span>
                    <el-select
                      v-model="item.deviceCode1"
                      size="small"
                      placeholder="请选择设备1"
                      class="device-select"
                      @change="(code) => handleDeviceChange(item, 1, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode1" readonly class="edit-input-device-code" placeholder="编码" />
                    <el-select
                      v-model="item.deviceCode2"
                      size="small"
                      placeholder="请选择设备2"
                      class="device-select"
                      style="margin-left: 20px;"
                      @change="(code) => handleDeviceChange(item, 2, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode2" readonly class="edit-input-device-code" placeholder="编码" />
                  </div>
                  <!-- 2）消毒 -->
                  <div style="margin-top: 0px;">
                    <span>2）消毒</span>
                    <el-select
                      v-model="item.disinfectionMethod"
                      size="small"
                      placeholder="请选择消毒方式"
                      style="width: 110px; margin-left: 18px;">
                      <el-option
                        v-for="opt in getMethodOptions(item.disinfectionProcess)"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value" />
                    </el-select>
                    <template v-if="isParamVisible(item.disinfectionMethod)">
                      ，{{ getParamLabel(item.disinfectionMethod) }}
                      <input v-model="item.disinfectionParam" class="edit-input-short" style="width: 50px;" />
                      {{ getParamUnit(item.disinfectionMethod) }}
                    </template>
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <el-time-picker
                        :model-value="getDisinfectionTimeRange(item)"
                        @update:model-value="(val) => setDisinfectionTimeRange(item, val)"
                        is-range
                        value-format="HH:mm:00"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        size="small"
                        style="width: 120px;" />
                      ，共 <input v-model="item.disinfectionCost" disabled class="edit-input-short" /> 分钟
                    </span>
                  </div>
                  <!-- 3）干净干燥完好 -->
                  <div style="margin-top: 0px;">
                    <span>3）是否干净，干燥、完好、外观无变色：</span>
                    <el-checkbox :model-value="item.waiguanFlag === 'Y'"
                      @change="(val) => { item.waiguanFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.waiguanFlag === 'N'"
                      @change="(val) => { item.waiguanFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                  <!-- 4）洗瓶用水是否纯化水（高温专属） -->
                  <div style="margin-top: 0px;">
                    <span>4）洗瓶用水是否纯化水：</span>
                    <el-checkbox :model-value="item.purifiedWaterFlag === 'Y'"
                      @change="(val) => { item.purifiedWaterFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.purifiedWaterFlag === 'N'"
                      @change="(val) => { item.purifiedWaterFlag = val ? 'N' : '' }">否</el-checkbox>
                    <el-checkbox v-model="item.noPurifiedWaterFlag" true-value="Y" false-value="" style="margin-left: 8px;">无此项</el-checkbox>
                  </div>
                  <!-- 5）装入洁净袋 -->
                  <div style="margin-top: 0px;">
                    <span>5）是否装入洁净袋：</span>
                    <el-checkbox :model-value="item.cleanBagFlag === 'Y'"
                      @change="(val) => { item.cleanBagFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.cleanBagFlag === 'N'"
                      @change="(val) => { item.cleanBagFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                </template>

                <!-- ========== 工艺：臭氧2 ========== -->
                <template v-else-if="item.disinfectionProcess === 'process_OZONE2'">
                  <!-- 1）设备/编码 -->
                  <div class="device-row">
                    <span class="device-row-label">1）设备/编码：</span>
                    <el-select
                      v-model="item.deviceCode1"
                      size="small"
                      placeholder="请选择设备1"
                      class="device-select"
                      @change="(code) => handleDeviceChange(item, 1, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode1" readonly class="edit-input-device-code" placeholder="编码" />
                    <el-select
                      v-model="item.deviceCode2"
                      size="small"
                      placeholder="请选择设备2"
                      class="device-select"
                      style="margin-left: 20px;"
                      @change="(code) => handleDeviceChange(item, 2, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode2" readonly class="edit-input-device-code" placeholder="编码" />
                  </div>
                  <!-- 2）消毒 -->
                  <div style="margin-top: 0px;">
                    <span>2）消毒</span>
                    <span style="font-weight: bold; margin-left: 18px;">臭氧</span>
                    ，臭氧浓度
                    <input v-model="item.disinfectionParam" class="edit-input-short" style="width: 50px;" /> ppm
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <el-time-picker
                        :model-value="getDisinfectionTimeRange(item)"
                        @update:model-value="(val) => setDisinfectionTimeRange(item, val)"
                        is-range
                        value-format="HH:mm:00"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        size="small"
                        style="width: 120px;" />
                      ，共 <input v-model="item.disinfectionCost" disabled class="edit-input-short" /> 分钟
                    </span>
                  </div>
                  <!-- 3）干净干燥完好 -->
                  <div style="margin-top: 0px;">
                    <span>3）是否干净，干燥、完好、外观无变色：</span>
                    <el-checkbox :model-value="item.waiguanFlag === 'Y'"
                      @change="(val) => { item.waiguanFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.waiguanFlag === 'N'"
                      @change="(val) => { item.waiguanFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                  <!-- 4）装入洁净袋 -->
                  <div style="margin-top: 0px;">
                    <span>4）是否装入洁净袋：</span>
                    <el-checkbox :model-value="item.cleanBagFlag === 'Y'"
                      @change="(val) => { item.cleanBagFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.cleanBagFlag === 'N'"
                      @change="(val) => { item.cleanBagFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                </template>

                <!-- ========== 工艺：风淋 ========== -->
                <template v-else-if="item.disinfectionProcess === 'process_AIR_SHOWER'">
                  <!-- 1）设备/编码 -->
                  <div class="device-row">
                    <span class="device-row-label">1）设备/编码：</span>
                    <el-select
                      v-model="item.deviceCode1"
                      size="small"
                      placeholder="请选择设备1"
                      class="device-select"
                      @change="(code) => handleDeviceChange(item, 1, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode1" readonly class="edit-input-device-code" placeholder="编码" />
                    <el-select
                      v-model="item.deviceCode2"
                      size="small"
                      placeholder="请选择设备2"
                      class="device-select"
                      style="margin-left: 20px;"
                      @change="(code) => handleDeviceChange(item, 2, code)">
                      <el-option
                        v-for="opt in DEVICE_OPTIONS"
                        :key="opt.code"
                        :label="opt.name"
                        :value="opt.code" />
                    </el-select>
                    <input v-model="item.deviceCode2" readonly class="edit-input-device-code" placeholder="编码" />
                  </div>
                  <!-- 2）消毒 -->
                  <div style="margin-top: 0px;">
                    <span>2）消毒</span>
                    <el-select
                      v-model="item.disinfectionMethod"
                      size="small"
                      placeholder="请选择消毒方式"
                      style="width: 110px; margin-left: 18px;">
                      <el-option
                        v-for="opt in getMethodOptions(item.disinfectionProcess)"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value" />
                    </el-select>
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <el-time-picker
                        :model-value="getDisinfectionTimeRange(item)"
                        @update:model-value="(val) => setDisinfectionTimeRange(item, val)"
                        is-range
                        value-format="HH:mm:00"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        size="small"
                        style="width: 120px;" />
                      ，共 <input v-model="item.disinfectionCost" disabled class="edit-input-short" /> 分钟
                    </span>
                    <!-- 3）内包装是否完整（风淋专属） -->
                    <div style="margin-top: 0px;">
                      <span>3）内包装是否完整：</span>
                      <el-checkbox :model-value="item.innerPackagingIntactFlag === 'Y'"
                        @change="(val) => { item.innerPackagingIntactFlag = val ? 'Y' : '' }">是</el-checkbox>
                      <el-checkbox :model-value="item.innerPackagingIntactFlag === 'N'"
                        @change="(val) => { item.innerPackagingIntactFlag = val ? 'N' : '' }">否</el-checkbox>
                      <el-checkbox v-model="item.noInnerPackagingIntactFlag" true-value="Y" false-value="" style="margin-left: 8px;">无此项</el-checkbox>
                    </div>
                  </div>
                  <!-- 4）干净干燥完好 -->
                  <div style="margin-top: 0px;">
                    <span>4）是否干净，干燥、完好、外观无变色：</span>
                    <el-checkbox :model-value="item.waiguanFlag === 'Y'"
                      @change="(val) => { item.waiguanFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.waiguanFlag === 'N'"
                      @change="(val) => { item.waiguanFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                  <!-- 5）装入洁净袋 -->
                  <div style="margin-top: 0px;">
                    <span>5）是否装入洁净袋：</span>
                    <el-checkbox :model-value="item.cleanBagFlag === 'Y'"
                      @change="(val) => { item.cleanBagFlag = val ? 'Y' : '' }">是</el-checkbox>
                    <el-checkbox :model-value="item.cleanBagFlag === 'N'"
                      @change="(val) => { item.cleanBagFlag = val ? 'N' : '' }">否</el-checkbox>
                  </div>
                </template>

                <!-- 未选工艺 -->
                <template v-else>
                  <span style="color: #909399;">请先选择工艺</span>
                </template>
              </template>

              <!-- ============================ 非编辑态 ============================ -->
              <template v-else>

                <!-- ========== 工艺：臭氧1 ========== -->
                <template v-if="item.disinfectionProcess === 'process_OZONE1'">
                  <div>
                    1）设备/编码：
                    <span class="filled-value">{{ item.deviceName1 || '' }}<template v-if="item.deviceCode1">（{{ item.deviceCode1 }}）</template></span>
                    <span v-if="item.deviceCode2" style="margin-left: 12px;" class="filled-value">{{ item.deviceName2 || '' }}（{{ item.deviceCode2 }}）</span>
                  </div>
                  <div>
                    2）消毒：
                    <span class="filled-value" style=" margin-left: 27px;">臭氧</span>
                    ，臭氧浓度 <span class="filled-value">{{ item.disinfectionParam || '' }}</span> ppm
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <span class="filled-value" style="margin-left: 14px;">{{ formatHm(item.disinfectionStartTime) }}</span>
                      至
                      <span class="filled-value">{{ formatHm(item.disinfectionEndTime) }}</span>
                      ，共 <span class="filled-value">{{ item.disinfectionCost || '' }}</span> 分钟
                    </span>
                  </div>
                  <div>
                    3）是否干净，干燥、完好、外观无变色：
                    <span class="filled-value">{{ item.waiguanFlag === 'Y' ? '是' : (item.waiguanFlag === 'N' ? '否' : '') }}</span>
                  </div>
                  <div>
                    4）是否装入洁净袋：
                    <span class="filled-value">{{ item.cleanBagFlag === 'Y' ? '是' : (item.cleanBagFlag === 'N' ? '否' : '') }}</span>
                  </div>
                </template>

                <!-- ========== 工艺：高温 ========== -->
                <template v-else-if="item.disinfectionProcess === 'process_HIGH_TEMP'">
                  <div>
                    1）设备/编码：
                    <span class="filled-value">{{ item.deviceName1 || '' }}<template v-if="item.deviceCode1">（{{ item.deviceCode1 }}）</template></span>
                    <span v-if="item.deviceCode2" style="margin-left: 12px;" class="filled-value">{{ item.deviceName2 || '' }}（{{ item.deviceCode2 }}）</span>
                  </div>
                  <div>
                    2）消毒：
                    <span style="margin-left: 27px;" class="filled-value">{{ getMethodLabel(item.disinfectionMethod) }}</span>
                    <template v-if="isParamVisible(item.disinfectionMethod)">
                      ，{{ getParamLabel(item.disinfectionMethod) }} <span class="filled-value">{{ item.disinfectionParam || '' }}</span> {{ getParamUnit(item.disinfectionMethod) }}
                    </template>
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <span class="filled-value" style="margin-left: 14px;">{{ formatHm(item.disinfectionStartTime) }}</span>
                      至
                      <span class="filled-value">{{ formatHm(item.disinfectionEndTime) }}</span>
                      ，共 <span class="filled-value">{{ item.disinfectionCost || '' }}</span> 分钟
                    </span>
                  </div>
                  <div>
                    3）是否干净，干燥、完好、外观无变色：
                    <span class="filled-value">{{ item.waiguanFlag === 'Y' ? '是' : (item.waiguanFlag === 'N' ? '否' : '') }}</span>
                  </div>
                  <div>
                    4）洗瓶用水是否纯化水：
                    <span class="filled-value">{{ item.purifiedWaterFlag === 'Y' ? '是' : (item.purifiedWaterFlag === 'N' ? '否' : '') }}</span>
                    <span v-if="item.noPurifiedWaterFlag === 'Y'" style="margin-left: 8px;" class="filled-value">（无此项）</span>
                  </div>
                  <div>
                    5）是否装入洁净袋：
                    <span class="filled-value">{{ item.cleanBagFlag === 'Y' ? '是' : (item.cleanBagFlag === 'N' ? '否' : '') }}</span>
                  </div>
                </template>

                <!-- ========== 工艺：臭氧2 ========== -->
                <template v-else-if="item.disinfectionProcess === 'process_OZONE2'">
                  <div>
                    1）设备/编码：
                    <span class="filled-value">{{ item.deviceName1 || '' }}<template v-if="item.deviceCode1">（{{ item.deviceCode1 }}）</template></span>
                    <span v-if="item.deviceCode2" style="margin-left: 12px;" class="filled-value">{{ item.deviceName2 || '' }}（{{ item.deviceCode2 }}）</span>
                  </div>
                  <div>
                    2）消毒：
                    <span class="filled-value" style=" margin-left: 27px;">臭氧</span>
                    ，臭氧浓度 <span class="filled-value">{{ item.disinfectionParam || '' }}</span> ppm
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <span class="filled-value" style="margin-left: 14px;">{{ formatHm(item.disinfectionStartTime) }}</span>
                      至
                      <span class="filled-value">{{ formatHm(item.disinfectionEndTime) }}</span>
                      ，共 <span class="filled-value">{{ item.disinfectionCost || '' }}</span> 分钟
                    </span>
                  </div>
                  <div>
                    3）是否干净，干燥、完好、外观无变色：
                    <span class="filled-value">{{ item.waiguanFlag === 'Y' ? '是' : (item.waiguanFlag === 'N' ? '否' : '') }}</span>
                  </div>
                  <div>
                    4）是否装入洁净袋：
                    <span class="filled-value">{{ item.cleanBagFlag === 'Y' ? '是' : (item.cleanBagFlag === 'N' ? '否' : '') }}</span>
                  </div>
                </template>

                <!-- ========== 工艺：风淋 ========== -->
                <template v-else-if="item.disinfectionProcess === 'process_AIR_SHOWER'">
                  <div>
                    1）设备/编码：
                    <span class="filled-value">{{ item.deviceName1 || '' }}<template v-if="item.deviceCode1">（{{ item.deviceCode1 }}）</template></span>
                    <span v-if="item.deviceCode2" style="margin-left: 12px;" class="filled-value">{{ item.deviceName2 || '' }}（{{ item.deviceCode2 }}）</span>
                  </div>
                  <div>
                    2）消毒：
                    <span style="margin-left: 27px;" class="filled-value">{{ getMethodLabel(item.disinfectionMethod) }}</span>
                    <br/>
                    <span style="margin-left: 18px;">
                      消毒时间
                      <span class="filled-value" style="margin-left: 14px;">{{ formatHm(item.disinfectionStartTime) }}</span>
                      至
                      <span class="filled-value">{{ formatHm(item.disinfectionEndTime) }}</span>
                      ，共 <span class="filled-value">{{ item.disinfectionCost || '' }}</span> 分钟
                    </span>
                    <div style="margin-left: 0px;">
                      3）内包装是否完整：
                      <span class="filled-value">{{ item.innerPackagingIntactFlag === 'Y' ? '是' : (item.innerPackagingIntactFlag === 'N' ? '否' : '') }}</span>
                      <span v-if="item.noInnerPackagingIntactFlag === 'Y'" style="margin-left: 8px;" class="filled-value">（无此项）</span>
                    </div>
                  </div>
                  <div>
                    4）是否干净，干燥、完好、外观无变色：
                    <span class="filled-value">{{ item.waiguanFlag === 'Y' ? '是' : (item.waiguanFlag === 'N' ? '否' : '') }}</span>
                  </div>
                  <div>
                    5）是否装入洁净袋：
                    <span class="filled-value">{{ item.cleanBagFlag === 'Y' ? '是' : (item.cleanBagFlag === 'N' ? '否' : '') }}</span>
                  </div>
                </template>

                <!-- 未选工艺 -->
                <template v-else>
                  <span style="color: #909399;">请先选择工艺</span>
                </template>
              </template>

            </div>
          </td>

          <!-- 第4列：签名（仅第一行渲染，跨 4 行） -->
          <td v-if="idx === 0" class="td-sign" :rowspan="paddedStep2List.length">
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

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBizDisinfectionPackaging1Detail,
  syncMaterialFromReceiving
} from '@/api/bizdata/bizDisinfectionPackaging1'
import { getBatch_record } from '@/api/batch/batch_record'
import { listBatchRecordMenuButtonsByCMenuId } from '@/api/batch/batch_record_menu'
import BaseCategorySelect from '@/components/BaseCategorySelect/index.vue'
import request from '@/utils/request'
import { parseTime } from '@/utils/ruoyi'

defineOptions({ name: 'DisinfectionPackaging1Form' })

/** 物料选择的分类码（本表单为包装材料相关） */
const MATERIAL_CATEGORY_CODE = 'PACKAGING_MATERIAL'

/** 本表单为消毒车间专属表单，从消毒车间（D）的领料单同步物料 */
const SYNC_WORKSHOP = 'D'

/** 临时设备数据源（后续可切换为真实设备表查询） */
const DEVICE_OPTIONS = [
  { code: '1', name: '臭氧机1号' },
  { code: '2', name: '洗瓶机1号' },
  { code: '3', name: '吹瓶机1号' },
  { code: '4', name: '洗烘一体机1号' },
  { code: '5', name: '风淋室1号' },
  { code: '6', name: '气枪1号' },
  { code: '7', name: '消毒柜1号' }
]

/**
 * 组件 Props 定义
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

/** 主表业务字段 + Step2 子表 List */
const record = reactive({
  recordId: null,
  orderId: null, orderNum: '', workshop: '',
  startTime: null, endTime: null, processDate: null,
  // Step1
  s1StepName: '', s1StartTime: null, s1EndTime: null,
  s1NormalAreaTemperature: '', s1NormalAreaHumidity: '',
  s1CleanAreaTemperature: '', s1CleanAreaHumidity: '',
  s1QualifiedFlag: '', s1Remark: '',
  // 公共
  remark: '',
  step2List: []
})

const isEditMode = computed(() => props.actionType === 'EDIT')
const isPreviewMode = computed(() => props.actionType === 'PREVIEW')
const isApproveMode = computed(() => !isEditMode.value && !isPreviewMode.value)

// ==================== Step1 时间范围（datetimerange 双向绑定） ====================
/**
 * Step1 时间范围：将 s1StartTime / s1EndTime 两个独立字段映射为 [start, end] 数组
 * 供 el-date-picker type="datetimerange" 使用，落库仍写入独立字段
 */
const s1TimeRange = computed({
  get: () => {
    if (!record.s1StartTime && !record.s1EndTime) return null
    return [record.s1StartTime || '', record.s1EndTime || '']
  },
  set: (val) => {
    if (Array.isArray(val) && val.length === 2) {
      record.s1StartTime = val[0] || null
      record.s1EndTime = val[1] || null
    } else {
      record.s1StartTime = null
      record.s1EndTime = null
    }
  }
})

// ==================== Step2 工艺时间范围（datetimerange 双向绑定） ====================
/**
 * 获取当前行的工艺时间范围（用于 datetimerange 组件的 :model-value）
 * @param {Object} item Step2 行数据
 * @returns {Array|null} [start, end] 或 null
 */
function getStepTimeRange(item) {
  if (!item.stepStartTime && !item.stepEndTime) return null
  return [item.stepStartTime || '', item.stepEndTime || '']
}

/**
 * 设置当前行的工艺时间范围（用于 datetimerange 组件的 @update:model-value）
 * @param {Object} item Step2 行数据
 * @param {Array|null} val 选中的范围数组或 null
 */
function setStepTimeRange(item, val) {
  if (Array.isArray(val) && val.length === 2) {
    item.stepStartTime = val[0] || null
    item.stepEndTime = val[1] || null
  } else {
    item.stepStartTime = null
    item.stepEndTime = null
  }
}

// ==================== Step2 消毒时间范围（time is-range 双向绑定） ====================
/**
 * 获取当前行的消毒时间范围（用于 is-range time-picker 的 :model-value）
 * @param {Object} item Step2 行数据
 * @returns {Array|null} [start, end] 或 null
 */
function getDisinfectionTimeRange(item) {
  if (!item.disinfectionStartTime && !item.disinfectionEndTime) return null
  return [item.disinfectionStartTime || '', item.disinfectionEndTime || '']
}

/**
 * 设置当前行的消毒时间范围（用于 is-range time-picker 的 @update:model-value）
 * 落库字段仍为 disinfectionStartTime / disinfectionEndTime（不变）
 * 注意：时长自动计算由 watch(record.step2List) 触发，此处赋值后自动联动
 * @param {Object} item Step2 行数据
 * @param {Array|null} val 选中的范围数组或 null
 */
function setDisinfectionTimeRange(item, val) {
  if (Array.isArray(val) && val.length === 2) {
    item.disinfectionStartTime = val[0] || null
    item.disinfectionEndTime = val[1] || null
  } else {
    item.disinfectionStartTime = null
    item.disinfectionEndTime = null
  }
}
// ==================== 滚动条显隐控制 ====================
const isScrolling = ref(false)
let scrollHideTimer = null

function handlePreviewScroll() {
  isScrolling.value = true
  if (scrollHideTimer) clearTimeout(scrollHideTimer)
  scrollHideTimer = setTimeout(() => { isScrolling.value = false }, 800)
}

// ==================== 签名行计算属性 ====================
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

// ==================== Step2 子表补齐 4 行 ====================
const paddedStep2List = computed(() => {
  const list = record.step2List || []
  if (list.length >= 4) return list
  const result = [...list]
  while (result.length < 4) result.push(createEmptyStep2Row())
  return result
})

function createEmptyStep2Row() {
  return {
    stepId: null, recordId: null, seqNo: null,
    materialCode: '', materialName: '', batchNumber: '',
    spec: '', unit: '',
    stepStartTime: null, stepEndTime: null,
    disinfectionProcess: '', disinfectionMethod: '', disinfectionParam: '',
    disinfectionStartTime: null, disinfectionEndTime: null, disinfectionCost: '',
    // 设备/编码（v1.3 新增：固定 2 组）
    deviceCode1: '', deviceName1: '',
    deviceCode2: '', deviceName2: '',
    waiguanFlag: '', purifiedWaterFlag: '', noPurifiedWaterFlag: '', cleanBagFlag: '',
    innerPackagingIntactFlag: '', noInnerPackagingIntactFlag: '',
    remark: ''
  }
}

// ==================== 时间格式化辅助 ====================
/** HH:mm:ss → HH:mm */
function formatHm(timeStr) {
  if (!timeStr) return ''
  const s = String(timeStr)
  return s.length >= 5 ? s.substring(0, 5) : s
}

/** HH:mm:ss / HH:mm 转当天累计分钟 */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0
  const parts = String(timeStr).split(':').map(Number)
  const h = parts[0]
  const m = parts[1]
  if (isNaN(h) || isNaN(m)) return 0
  return h * 60 + m
}

/** 两时间点分钟差（跨天自动 +1440） */
function diffMinutes(startTime, endTime) {
  if (!startTime || !endTime) return ''
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  if (isNaN(start) || isNaN(end)) return ''
  let diff = end - start
  if (diff < 0) diff += 24 * 60
  return diff
}

// ==================== 消毒时长自动计算（深度 watch Step2 列表） ====================
watch(
  () => record.step2List,
  (list) => {
    if (!Array.isArray(list)) return
    list.forEach(item => {
      const cost = diffMinutes(item.disinfectionStartTime, item.disinfectionEndTime)
      if (item.disinfectionCost !== cost) {
        item.disinfectionCost = cost
      }
    })
  },
  { deep: true, immediate: true }
)

// ==================== 工艺单选（视觉复选框，行为互斥） ====================
/**
 * 切换工艺：4 个复选框中只能选中 1 个
 * - 已选中该工艺 → 取消（清空工艺相关字段）
 * - 切换其他工艺 → 清空原工艺字段，写入新工艺
 * - 臭氧1 / 臭氧2 → 自动填充 method_OZONE
 * - 高温 / 风淋 → 消毒方式留空，等用户下拉选择
 *
 * 注意：切换工艺时保留 materialCode / materialName（物料不变）
 */
function toggleProcess(item, process, checked) {
  if (checked) {
    if (item.disinfectionProcess === process) return
    // 切换工艺：清空消毒方式相关字段 + 设备字段
    item.disinfectionProcess = process
    item.disinfectionMethod = ''
    item.disinfectionParam = ''
    item.disinfectionStartTime = null
    item.disinfectionEndTime = null
    item.disinfectionCost = ''
    // 清空设备（避免工艺切换后残留旧工艺的设备）
    item.deviceCode1 = ''
    item.deviceName1 = ''
    item.deviceCode2 = ''
    item.deviceName2 = ''
    // 臭氧1 / 臭氧2 自动填充
    if (process === 'process_OZONE1' || process === 'process_OZONE2') {
      item.disinfectionMethod = 'method_OZONE'
    }
  } else {
    if (item.disinfectionProcess === process) {
      item.disinfectionProcess = ''
      item.disinfectionMethod = ''
      item.disinfectionParam = ''
      item.disinfectionStartTime = null
      item.disinfectionEndTime = null
      item.disinfectionCost = ''
      item.deviceCode1 = ''
      item.deviceName1 = ''
      item.deviceCode2 = ''
      item.deviceName2 = ''
    }
  }
}

// ==================== 消毒方式选项（按工艺联动） ====================
/**
 * 按工艺返回可选的消毒方式列表
 * - 臭氧1 / 臭氧2 → 不显示下拉（自动填充 method_OZONE）
 * - 高温 → method_HIGH_TEMP / method_WASHER_DRYER
 * - 风淋 → method_ALCOHOL / method_UV
 */
function getMethodOptions(process) {
  if (process === 'process_HIGH_TEMP') {
    return [
      { label: '高温', value: 'method_HIGH_TEMP' },
      { label: '洗烘一体机', value: 'method_WASHER_DRYER' }
    ]
  }
  if (process === 'process_AIR_SHOWER') {
    return [
      { label: '风淋', value: 'method_AIR_SHOWER' },
      { label: '75%酒精消毒', value: 'method_ALCOHOL' },
      { label: '紫外线消毒', value: 'method_UV' }
    ]
  }
  return []
}

/** 是否显示设备参数（臭氧浓度 / 消毒温度） */
function isParamVisible(method) {
  return method === 'method_OZONE'
    || method === 'method_HIGH_TEMP'
    || method === 'method_WASHER_DRYER'
}

/** 设备参数标签 */
function getParamLabel(method) {
  if (method === 'method_OZONE') return '臭氧浓度'
  if (method === 'method_HIGH_TEMP' || method === 'method_WASHER_DRYER') return '消毒温度'
  return ''
}

/** 设备参数单位 */
function getParamUnit(method) {
  if (method === 'method_OZONE') return 'ppm'
  if (method === 'method_HIGH_TEMP' || method === 'method_WASHER_DRYER') return '℃'
  return ''
}

/** 获取消毒方式的中文标签（用于非编辑态纯文本展示） */
function getMethodLabel(method) {
  if (method === 'method_OZONE') return '臭氧'
  if (method === 'method_HIGH_TEMP') return '高温'
  if (method === 'method_WASHER_DRYER') return '洗烘一体机'
  if (method === 'method_AIR_SHOWER') return '风淋'
  if (method === 'method_ALCOHOL') return '75%酒精消毒'
  if (method === 'method_UV') return '紫外线消毒'
  return ''
}
// ==================== 数据加载 ====================
onMounted(async () => {
  await loadFNodes()
  if (isPreviewMode.value && !props.businessRecordId) {
    initEmptyTemplate()
  } else {
    await loadData()
  }
})

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

/** 预览空模板：仅本地初始化 4 行 step2，不调任何后端接口 */
function initEmptyTemplate() {
  record.step2List = [
    createEmptyStep2Row(),
    createEmptyStep2Row(),
    createEmptyStep2Row(),
    createEmptyStep2Row()
  ]
}

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

    // 补齐 step2 至 4 行
    const step2 = Array.isArray(record.step2List) ? record.step2List : []
    while (step2.length < 4) step2.push(createEmptyStep2Row())
    record.step2List = step2
  } catch (error) {
    ElMessage.error('加载灌装包材处理记录1数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 选择器回填 ====================
function handleSelectChange(row, type, code, name) {
  if (type === 'material') row.materialName = name || ''
  else if (type === 'spec') row.spec = name || ''
  else if (type === 'unit') row.unit = name || ''
}

/**
 * 设备下拉切换：自动回填设备名称快照
 *
 * @param {Object} item  当前行对象
 * @param {Number} index 设备序号（1 或 2）
 * @param {String} code  选中的设备编码（空字符串表示清空）
 */
function handleDeviceChange(item, index, code) {
  const matched = code ? DEVICE_OPTIONS.find(opt => opt.code === code) : null
  if (index === 1) {
    item.deviceName1 = matched ? matched.name : ''
  } else {
    item.deviceName2 = matched ? matched.name : ''
  }
}
// ==================== 通用动态请求 ====================
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
function beforeSubmitCheck() {
  // 宽松校验：允许部分行留空（业务上可能只需 2 个物料）
  // 若某行选了工艺，则要求填写物料名称（工艺与物料必须对应）
  for (let i = 0; i < record.step2List.length; i++) {
    const item = record.step2List[i]
    if (item.disinfectionProcess && !item.materialName) {
      ElMessage.error(`第 ${i + 1} 行已选择工艺，请先选择物料`)
      return false
    }
  }
  return true
}

// ==================== 编辑保存 ====================
async function handleEditSubmit() {
  if (!beforeSubmitCheck()) return
  try {
    await ElMessageBox.confirm('确认保存当前编辑内容吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
  } catch (error) { return }

  const payload = { ...record }
  // 过滤：保留有 stepId（已存在需 clear/update）或有业务字段（需 insert）的行
  payload.step2List = paddedStep2List.value.filter(item =>
    item.stepId || item.materialCode || item.materialName || item.disinfectionProcess
  )

  try {
    const routeTemplate = props.backendRoute ||
      '/bizdata/bizDisinfectionPackaging1/edit/{businessRecordId}?menuId={menuId}'
    const urlParams = {
      businessRecordId: props.businessRecordId,
      menuId: props.menuId
    }
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

// ==================== 从领料单同步物料 ====================
/**
 * 从领料单同步物料到 Step2 子表
 *
 * 交互流程：
 * 1. 二次确认（提示 Step2 物料明细将被覆盖）
 * 2. 调后端同步接口，前端传 workshop='D'
 * 3. 后端返回完整对象（含 step2List），前端一次刷新 record
 * 4. 不关闭对话框，用户可继续编辑
 * 5. 允许重复点击：每次以后端最新领料单数据覆盖
 */
async function handleSyncMaterialFromReceiving() {
  try {
    await ElMessageBox.confirm(
      '确认从领料单同步物料？当前 Step2 的物料明细将被覆盖（工艺、设备、消毒信息保留）。',
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch (error) {
    return
  }

  try {
    const res = await syncMaterialFromReceiving(props.businessRecordId, SYNC_WORKSHOP)
    // 后端返回完整对象（含 step2List）
    const data = res.data || {}

    // 关键：同步仅覆盖物料五件套，保留当前行的工艺/设备/消毒信息（避免用户输入被覆盖）
    const remoteStep2 = Array.isArray(data.step2List) ? data.step2List : []
    const localStep2 = record.step2List || []

    // 按 seq_no 合并：物料字段用远端，其他字段用本地
    const mergedStep2 = []
    for (let seq = 1; seq <= 4; seq++) {
      const remote = remoteStep2.find(it => it.seqNo === seq)
      const local = localStep2.find(it => it.seqNo === seq) || createEmptyStep2Row()
      if (remote) {
        // 物料五件套用远端
        local.stepId = remote.stepId || local.stepId
        local.recordId = remote.recordId || local.recordId
        local.seqNo = remote.seqNo
        local.materialCode = remote.materialCode || ''
        local.materialName = remote.materialName || ''
        local.batchNumber = remote.batchNumber || ''
        local.spec = remote.spec || ''
        local.unit = remote.unit || ''
        // 保留本地的工艺/设备/消毒信息（不变）
      } else {
        // 远端无对应行：清空物料信息，保留本地的工艺/设备/消毒信息
        local.materialCode = ''
        local.materialName = ''
        local.batchNumber = ''
        local.spec = ''
        local.unit = ''
      }
      mergedStep2.push(local)
    }
    record.step2List = mergedStep2

    // 补齐至 4 行
    while (record.step2List.length < 4) record.step2List.push(createEmptyStep2Row())

    // 判断是否有数据
    const hasAnyItem = record.step2List.some(it => it.materialCode || it.materialName)
    if (!hasAnyItem) {
      ElMessage.warning('未找到关联的领料单，物料明细已清空')
    } else {
      ElMessage.success('同步成功')
    }
  } catch (error) {
    ElMessage.error('同步失败')
  }
}

// ==================== 审批提交 ====================
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

/* 关闭 Step1/Step2 表格的上下边框，视觉上连成一张表 */
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

/* Step1 / Step2 外层单元格通用样式 */
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

/* ============================================================
   Step1 / Step2 通用列样式
   ============================================================ */
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
  padding: 4px 6px !important;
}

/* ============================================================
   el-checkbox 紧凑样式
   ============================================================ */
.view-container :deep(.el-checkbox) {
  height: auto;
  margin-right: 8px;
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
  font-size: 13px;
  text-align: center;
  vertical-align: middle;
}
.edit-input-short:focus {
  background-color: #e6f7ff;
  outline: none;
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
.edit-textarea:focus {
  background-color: #e6f7ff;
  outline: none;
}

/* ============================================================
   步骤文字通用
   ============================================================ */
.step-text {
  font-size: 12px;
  line-height: 1.0;
}

/* 非编辑态：操作记录区文本（与工艺要求列统一：字号/行高/颜色一致） */
.record-view-text {
  font-size: 12px;
  line-height: 1.5;
  color: #303133;
  white-space: normal;
  word-break: break-word;
}

/* 动态回填值突出显示（区别于固定文本） */
.record-view-text .filled-value {
  color: #4046ff;
  /* font-weight: bold; */
}
/* ============================================================
   Step2 设备/编码行（v1.3 新增）
   ============================================================ */
.device-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.device-row-label {
  flex-shrink: 0;
  white-space: nowrap;
}
.device-select {
  width: 110px;
}
.edit-input-device-code {
  width: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 0px;
  font-size: 13px;
  text-align: center;
  background-color: #f5f7fa;
  color: #606266;
  vertical-align: middle;
}
.edit-input-device-code:focus {
  outline: none;
}
/* ============================================================
   滚动条：滚动显示，停止 800ms 后隐藏
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

/* Step1 时间行 */
/* .s1-time-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1px;
  font-size: 13px;
} */

/* Step2 工艺要求列 */
.td-process-cell {
  vertical-align: top !important;
  padding: 6px 8px;
  font-size: 13px;
  line-height: 1.1;
}

/* 时间字段行（并排） */
.process-time-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1px;
  font-size: 13px;
}

/* 工艺固定文本（Step1 / Step2 共用，统一风格） */
.process-fixed-text1 {
  font-size: 12px;
  line-height: 1.5;
  color: #303133;
  white-space: normal;
  word-break: break-word;
}
/* ============================================================
   Step2 第1列（v1.4 改造：每行独立，2.n + 下拉框 + 回显）
   ============================================================ */
.td-step-label-row {
  text-align: left;
  padding: 4px 4px !important;
  vertical-align: middle !important;
  font-size: 12px;
  line-height: 1.4;
}

/* 编辑态顶部：2.n + 下拉框（flex-wrap 自动换行） */
.step-row-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}
.step-no {
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 12px;
}
.step-material-wrap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
/* BaseCategorySelect 内部 el-select / el-input 宽度撑满 */
.step-material-wrap :deep(.el-select),
.step-material-wrap :deep(.el-input) {
  width: 100%;
  min-width: 0;
}

/* 编辑态回显：物料名 + 处理（自动换行） */
.step-row-echo {
  font-size: 11px;
  color: #606266;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 1.4;
}

/* 非编辑态：2.n 物料名处理（自动换行） */
.step-row-view {
  font-size: 12px;
  color: #303133;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 1.4;
}
</style>
