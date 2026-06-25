<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入工单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排产单号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入排产单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入产品批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['bottling:disinfectionPackaging1:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:disinfectionPackaging1:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:disinfectionPackaging1:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:disinfectionPackaging1:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="disinfectionPackaging1List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" icon="" @click="handleHandle(scope.row)">处理</el-button>
          <el-button link type="primary" icon="" @click="handleReview(scope.row)">复核</el-button>
          <el-button link type="primary" icon="" @click="handleInspect(scope.row)">检查</el-button>
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:disinfectionPackaging1:edit']">修改</el-button> -->
          <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:disinfectionPackaging1:remove']">删除</el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="记录主键" align="center" prop="recordId" /> -->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="disinfection_packaging_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="排产单号" align="center" prop="planCode" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="产品批号" align="center" prop="batchNumber" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看对话框组件 -->
    <BottlingDisPack1View ref="disPack1ViewRef" />
    <!-- 处理对话框 -->
    <BottlingDisPack1Handle ref="disPack1HandleRef"
      @step1Submit="handleStep1Submit"
      @step2Submit="handleStep2Submit"
      @step3Submit="handleStep3Submit"
      @step4Submit="handleStep4Submit"
      @submit="getList" />
    <!-- 复核对话框 -->
     <BottlingDisPack1Review ref="disPack1ReviewRef"
      @step1Review="handleStep1Review"
      @step2Review="handleStep2Review"
      @step3Review="handleStep3Review"
      @step4Review="handleStep4Review"
      @submit="getList" />
    <!-- <BottlingDisPack1Review ref="disPack1ReviewRef" @step1Review="handleStep1Review" @submit="getList" /> -->
    <!-- 检查对话框 -->
    <BottlingDisPack1Inspect ref="disPack1InspectRef"
      @step1Inspect="handleStep1Inspect"
      @step2Inspect="handleStep2Inspect"
      @step3Inspect="handleStep3Inspect"
      @submit="getList" />

    <!-- 添加或修改灌装包材处理记录1对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="disinfectionPackaging1Ref" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联排产计划" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in disinfection_packaging_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排产单号" prop="planCode">
              <el-input v-model="form.planCode" placeholder="请输入排产单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品批号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="请输入产品批号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable
                v-model="form.startTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable
                v-model="form.endTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理日期" prop="processDate">
              <el-date-picker clearable
                v-model="form.processDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择处理日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人" prop="reviewer">
              <el-input v-model="form.reviewer" placeholder="请输入复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人" prop="inspector">
              <el-input v-model="form.inspector" placeholder="请输入检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤序号" prop="s1StepNumber">
              <el-input v-model="form.s1StepNumber" placeholder="请输入步骤序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤名称" prop="s1StepName">
              <el-input v-model="form.s1StepName" placeholder="请输入步骤名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="s1StartTime">
              <el-date-picker clearable
                v-model="form.s1StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="s1EndTime">
              <el-date-picker clearable
                v-model="form.s1EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="一般区温度" prop="s1NormalAreaTemperature">
              <el-input v-model="form.s1NormalAreaTemperature" placeholder="请输入一般区温度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="一般区湿度" prop="s1NormalAreaHumidity">
              <el-input v-model="form.s1NormalAreaHumidity" placeholder="请输入一般区湿度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="洁净区温度" prop="s1CleanAreaTemperature">
              <el-input v-model="form.s1CleanAreaTemperature" placeholder="请输入洁净区温度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="洁净区湿度" prop="s1CleanAreaHumidity">
              <el-input v-model="form.s1CleanAreaHumidity" placeholder="请输入洁净区湿度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查是否合格" prop="s1QualifiedFlag">
              <el-checkbox-group v-model="form.s1QualifiedFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不合格情况说明" prop="s1Remark">
              <el-input v-model="form.s1Remark" placeholder="请输入不合格情况说明" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤序号" prop="s2StepNumber">
              <el-input v-model="form.s2StepNumber" placeholder="请输入步骤序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤名称" prop="s2StepName">
              <el-input v-model="form.s2StepName" placeholder="请输入步骤名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="s2StartTime">
              <el-date-picker clearable
                v-model="form.s2StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="s2EndTime">
              <el-date-picker clearable
                v-model="form.s2EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧机编号" prop="s2OzoneGeneratorNumber">
              <el-input v-model="form.s2OzoneGeneratorNumber" placeholder="请输入臭氧机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="洗瓶机编号" prop="s2BottleWashingMachineNumber">
              <el-input v-model="form.s2BottleWashingMachineNumber" placeholder="请输入洗瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="吹瓶机编号" prop="s2BottleBlowingMachineNumber">
              <el-input v-model="form.s2BottleBlowingMachineNumber" placeholder="请输入吹瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否手动洗" prop="s2ManualWashingFlag">
              <el-input v-model="form.s2ManualWashingFlag" placeholder="请输入是否手动洗" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="烘洗一体机编号" prop="s2WasherDryerComboNumber">
              <el-input v-model="form.s2WasherDryerComboNumber" placeholder="请输入烘洗一体机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="消毒臭氧浓度" prop="s2OzoneConcentration">
              <el-input v-model="form.s2OzoneConcentration" placeholder="请输入消毒臭氧浓度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧消毒开始时间" prop="s2OzoneDesinfectionStartTime">
              <el-date-picker clearable
                v-model="form.s2OzoneDesinfectionStartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择臭氧消毒开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧消毒结束时间" prop="s2OzoneDesinfectionEndTime">
              <el-date-picker clearable
                v-model="form.s2OzoneDesinfectionEndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择臭氧消毒结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧消毒时间" prop="s2OzoneDesinfectionCost">
              <el-input v-model="form.s2OzoneDesinfectionCost" placeholder="请输入臭氧消毒时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="烘干消毒温度" prop="s2DryingDesinfectionTemperature">
              <el-input v-model="form.s2DryingDesinfectionTemperature" placeholder="请输入烘干消毒温度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="烘干消毒开始时间" prop="s2DryingDesinfectionStartTime">
              <el-date-picker clearable
                v-model="form.s2DryingDesinfectionStartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择烘干消毒开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="烘干消毒结束时间" prop="s2DryingDesinfectionEndTime">
              <el-date-picker clearable
                v-model="form.s2DryingDesinfectionEndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择烘干消毒结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="烘干消毒时间" prop="s2DryingDesinfectionCost">
              <el-input v-model="form.s2DryingDesinfectionCost" placeholder="请输入烘干消毒时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="高温烘干消毒温度" prop="s2HighDryingDesinfectionTemperature">
              <el-input v-model="form.s2HighDryingDesinfectionTemperature" placeholder="请输入高温烘干消毒温度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="高温烘干消毒开始时间" prop="s2HighDryingDesinfectionStartTime">
              <el-date-picker clearable
                v-model="form.s2HighDryingDesinfectionStartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择高温烘干消毒开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="高温烘干消毒结束时间" prop="s2HighDryingDesinfectionEndTime">
              <el-date-picker clearable
                v-model="form.s2HighDryingDesinfectionEndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择高温烘干消毒结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="高温烘干消毒时间" prop="s2HighDryingDesinfectionCost">
              <el-input v-model="form.s2HighDryingDesinfectionCost" placeholder="请输入高温烘干消毒时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="干净干燥完好" prop="s2WaiguanFlag">
              <el-checkbox-group v-model="form.s2WaiguanFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="洗瓶用水是否纯化水" prop="s2PurifiedWaterFlag">
              <el-checkbox-group v-model="form.s2PurifiedWaterFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否装入洁净袋" prop="s2CleanBagFlag">
              <el-checkbox-group v-model="form.s2CleanBagFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤序号" prop="s3StepNumber">
              <el-input v-model="form.s3StepNumber" placeholder="请输入步骤序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤名称" prop="s3StepName">
              <el-input v-model="form.s3StepName" placeholder="请输入步骤名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="s3StartTime">
              <el-date-picker clearable
                v-model="form.s3StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="s3EndTime">
              <el-date-picker clearable
                v-model="form.s3EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧机编号" prop="s3OzoneGeneratorNumber">
              <el-input v-model="form.s3OzoneGeneratorNumber" placeholder="请输入臭氧机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="洗瓶机编号" prop="s3BottleWashingMachineNumber">
              <el-input v-model="form.s3BottleWashingMachineNumber" placeholder="请输入洗瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="吹瓶机编号" prop="s3BottleBlowingMachineNumber">
              <el-input v-model="form.s3BottleBlowingMachineNumber" placeholder="请输入吹瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="风淋室编号" prop="s3AirShowerMachineNumber">
              <el-input v-model="form.s3AirShowerMachineNumber" placeholder="请输入风淋室编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="消毒臭氧浓度" prop="s3OzoneConcentration">
              <el-input v-model="form.s3OzoneConcentration" placeholder="请输入消毒臭氧浓度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧消毒开始时间" prop="s3OzoneDesinfectionStartTime">
              <el-date-picker clearable
                v-model="form.s3OzoneDesinfectionStartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择臭氧消毒开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧消毒结束时间" prop="s3OzoneDesinfectionEndTime">
              <el-date-picker clearable
                v-model="form.s3OzoneDesinfectionEndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择臭氧消毒结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="臭氧消毒时间" prop="s3OzoneDesinfectionCost">
              <el-input v-model="form.s3OzoneDesinfectionCost" placeholder="请输入臭氧消毒时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内包装是否完整" prop="s3AirShowerInnerPackagingFlag">
              <el-checkbox-group v-model="form.s3AirShowerInnerPackagingFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="干净干燥完好" prop="s3WaiguanFlag">
              <el-checkbox-group v-model="form.s3WaiguanFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否装入洁净袋" prop="s3CleanBagFlag">
              <el-checkbox-group v-model="form.s3CleanBagFlag">
                <el-checkbox
                  v-for="dict in sys_yes_no"
                  :key="dict.value"
                  :label="dict.value">
                  {{dict.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤序号" prop="s4StepNumber">
              <el-input v-model="form.s4StepNumber" placeholder="请输入步骤序号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤名称" prop="s4StepName">
              <el-input v-model="form.s4StepName" placeholder="请输入步骤名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DisinfectionPackaging1">
import { listDisinfectionPackaging1, getDisinfectionPackaging1, delDisinfectionPackaging1, addDisinfectionPackaging1, updateDisinfectionPackaging1 } from "@/api/bottling/disinfectionPackaging1"
// 新增导入
import { handleStep1, handleStep2, handleStep3, handleStep4, reviewStep1, reviewStep2, reviewStep3, reviewStep4, inspectStep1, inspectStep2, inspectStep3 } from "@/api/bottling/disinfectionPackaging1"

// 引入查看对话框组件
import BottlingDisPack1View from '@/views/bottling/components/BottlingDisPack1View.vue'

// 引入处理对话框组件
import BottlingDisPack1Handle from '@/views/bottling/components/BottlingDisPack1Handle.vue'

// 引入复核对话框组件
import BottlingDisPack1Review from '@/views/bottling/components/BottlingDisPack1Review.vue'

// 引入检查对话框组件
import BottlingDisPack1Inspect from '@/views/bottling/components/BottlingDisPack1Inspect.vue'

const { proxy } = getCurrentInstance()
const { sys_yes_no, disinfection_packaging_status } = proxy.useDict('sys_yes_no', 'disinfection_packaging_status')

// 查看对话框组件引用
const disPack1ViewRef = ref(null)
// 处理对话框组件引用
const disPack1HandleRef = ref(null)
// 复核对话框组件引用
const disPack1ReviewRef = ref(null)
// 检查对话框组件引用
const disPack1InspectRef = ref(null)

const disinfectionPackaging1List = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    planCode: undefined,
    batchNumber: undefined,
  },
  rules: {
    s1StepNumber: [
      { required: true, message: "步骤序号不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录1列表 */
function getList() {
  loading.value = true
  listDisinfectionPackaging1(queryParams.value).then(response => {
    disinfectionPackaging1List.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    recordId: null,
    planId: null,
    status: null,
    orderNum: null,
    planCode: null,
    productName: null,
    spec: null,
    batchNumber: null,
    startTime: null,
    endTime: null,
    processDate: null,
    operator: null,
    reviewer: null,
    inspector: null,
    s1StepNumber: null,
    s1StepName: null,
    s1StepNormalDisable: [],
    s1OperateShowHide: [],
    s1ReviewShowHide: [],
    s1InspectShowHide: [],
    s1StartTime: null,
    s1EndTime: null,
    s1NormalAreaTemperature: null,
    s1NormalAreaHumidity: null,
    s1CleanAreaTemperature: null,
    s1CleanAreaHumidity: null,
    s1QualifiedFlag: [],
    s1Remark: null,
    s2StepNumber: null,
    s2StepName: null,
    s2StepNormalDisable: [],
    s2OperateShowHide: [],
    s2ReviewShowHide: [],
    s2InspectShowHide: [],
    s2StartTime: null,
    s2EndTime: null,
    s2OzoneDesinfectionFlag: [],
    s2HighDesinfectionTemperatureFlag: [],
    s2OzoneGeneratorFlag: [],
    s2OzoneGeneratorNumber: null,
    s2BottleWashingMachineFlag: [],
    s2BottleWashingMachineNumber: null,
    s2BottleBlowingMachineFlag: [],
    s2BottleBlowingMachineNumber: null,
    s2AirGunFlag: [],
    s2ManualWashingFlag: null,
    s2WasherDryerComboFlag: [],
    s2WasherDryerComboNumber: null,
    s2OzoneConcentration: null,
    s2OzoneDesinfectionStartTime: null,
    s2OzoneDesinfectionEndTime: null,
    s2OzoneDesinfectionCost: null,
    s2DryingDesinfectionTemperature: null,
    s2DryingDesinfectionStartTime: null,
    s2DryingDesinfectionEndTime: null,
    s2DryingDesinfectionCost: null,
    s2HighDryingDesinfectionTemperature: null,
    s2HighDryingDesinfectionStartTime: null,
    s2HighDryingDesinfectionEndTime: null,
    s2HighDryingDesinfectionCost: null,
    s2WaiguanFlag: [],
    s2PurifiedWaterFlag: [],
    s2NoPurifiedWaterFlag: [],
    s2CleanBagFlag: [],
    s3StepNumber: null,
    s3StepName: null,
    s3StepNormalDisable: [],
    s3OperateShowHide: [],
    s3ReviewShowHide: [],
    s3InspectShowHide: [],
    s3StartTime: null,
    s3EndTime: null,
    s3OzoneDesinfectionFlag: [],
    s3AirShowerFlag: [],
    s3OzoneGeneratorFlag: [],
    s3OzoneGeneratorNumber: null,
    s3BottleWashingMachineFlag: [],
    s3BottleWashingMachineNumber: null,
    s3BottleBlowingMachineFlag: [],
    s3BottleBlowingMachineNumber: null,
    s3AirShowerMachineFlag: [],
    s3AirShowerMachineNumber: null,
    s3OzoneConcentration: null,
    s3OzoneDesinfectionStartTime: null,
    s3OzoneDesinfectionEndTime: null,
    s3OzoneDesinfectionCost: null,
    s3AlcoholDesinfectionFlag: [],
    s3UvDesinfectionFlag: [],
    s3AirShowerInnerPackagingFlag: [],
    s3WaiguanFlag: [],
    s3CleanBagFlag: [],
    s4StepNumber: null,
    s4StepName: null,
    s4StepNormalDisable: [],
    s4OperateShowHide: [],
    s4ReviewShowHide: [],
    s4InspectShowHide: [],
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("disinfectionPackaging1Ref")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加灌装包材处理记录1"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getDisinfectionPackaging1(_recordId).then(response => {
    form.value = response.data
    form.value.s1StepNormalDisable = form.value.s1StepNormalDisable.split(",")
    form.value.s1OperateShowHide = form.value.s1OperateShowHide.split(",")
    form.value.s1ReviewShowHide = form.value.s1ReviewShowHide.split(",")
    form.value.s1InspectShowHide = form.value.s1InspectShowHide.split(",")
    form.value.s1QualifiedFlag = form.value.s1QualifiedFlag.split(",")
    form.value.s2StepNormalDisable = form.value.s2StepNormalDisable.split(",")
    form.value.s2OperateShowHide = form.value.s2OperateShowHide.split(",")
    form.value.s2ReviewShowHide = form.value.s2ReviewShowHide.split(",")
    form.value.s2InspectShowHide = form.value.s2InspectShowHide.split(",")
    form.value.s2OzoneDesinfectionFlag = form.value.s2OzoneDesinfectionFlag.split(",")
    form.value.s2HighDesinfectionTemperatureFlag = form.value.s2HighDesinfectionTemperatureFlag.split(",")
    form.value.s2OzoneGeneratorFlag = form.value.s2OzoneGeneratorFlag.split(",")
    form.value.s2BottleWashingMachineFlag = form.value.s2BottleWashingMachineFlag.split(",")
    form.value.s2BottleBlowingMachineFlag = form.value.s2BottleBlowingMachineFlag.split(",")
    form.value.s2AirGunFlag = form.value.s2AirGunFlag.split(",")
    form.value.s2WasherDryerComboFlag = form.value.s2WasherDryerComboFlag.split(",")
    form.value.s2WaiguanFlag = form.value.s2WaiguanFlag.split(",")
    form.value.s2PurifiedWaterFlag = form.value.s2PurifiedWaterFlag.split(",")
    form.value.s2NoPurifiedWaterFlag = form.value.s2NoPurifiedWaterFlag.split(",")
    form.value.s2CleanBagFlag = form.value.s2CleanBagFlag.split(",")
    form.value.s3StepNormalDisable = form.value.s3StepNormalDisable.split(",")
    form.value.s3OperateShowHide = form.value.s3OperateShowHide.split(",")
    form.value.s3ReviewShowHide = form.value.s3ReviewShowHide.split(",")
    form.value.s3InspectShowHide = form.value.s3InspectShowHide.split(",")
    form.value.s3OzoneDesinfectionFlag = form.value.s3OzoneDesinfectionFlag.split(",")
    form.value.s3AirShowerFlag = form.value.s3AirShowerFlag.split(",")
    form.value.s3OzoneGeneratorFlag = form.value.s3OzoneGeneratorFlag.split(",")
    form.value.s3BottleWashingMachineFlag = form.value.s3BottleWashingMachineFlag.split(",")
    form.value.s3BottleBlowingMachineFlag = form.value.s3BottleBlowingMachineFlag.split(",")
    form.value.s3AirShowerMachineFlag = form.value.s3AirShowerMachineFlag.split(",")
    form.value.s3AlcoholDesinfectionFlag = form.value.s3AlcoholDesinfectionFlag.split(",")
    form.value.s3UvDesinfectionFlag = form.value.s3UvDesinfectionFlag.split(",")
    form.value.s3AirShowerInnerPackagingFlag = form.value.s3AirShowerInnerPackagingFlag.split(",")
    form.value.s3WaiguanFlag = form.value.s3WaiguanFlag.split(",")
    form.value.s3CleanBagFlag = form.value.s3CleanBagFlag.split(",")
    form.value.s4StepNormalDisable = form.value.s4StepNormalDisable.split(",")
    form.value.s4OperateShowHide = form.value.s4OperateShowHide.split(",")
    form.value.s4ReviewShowHide = form.value.s4ReviewShowHide.split(",")
    form.value.s4InspectShowHide = form.value.s4InspectShowHide.split(",")
    open.value = true
    title.value = "修改灌装包材处理记录1"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["disinfectionPackaging1Ref"].validate(valid => {
    if (valid) {
      form.value.s1StepNormalDisable = form.value.s1StepNormalDisable.join(",")
      form.value.s1OperateShowHide = form.value.s1OperateShowHide.join(",")
      form.value.s1ReviewShowHide = form.value.s1ReviewShowHide.join(",")
      form.value.s1InspectShowHide = form.value.s1InspectShowHide.join(",")
      form.value.s1QualifiedFlag = form.value.s1QualifiedFlag.join(",")
      form.value.s2StepNormalDisable = form.value.s2StepNormalDisable.join(",")
      form.value.s2OperateShowHide = form.value.s2OperateShowHide.join(",")
      form.value.s2ReviewShowHide = form.value.s2ReviewShowHide.join(",")
      form.value.s2InspectShowHide = form.value.s2InspectShowHide.join(",")
      form.value.s2OzoneDesinfectionFlag = form.value.s2OzoneDesinfectionFlag.join(",")
      form.value.s2HighDesinfectionTemperatureFlag = form.value.s2HighDesinfectionTemperatureFlag.join(",")
      form.value.s2OzoneGeneratorFlag = form.value.s2OzoneGeneratorFlag.join(",")
      form.value.s2BottleWashingMachineFlag = form.value.s2BottleWashingMachineFlag.join(",")
      form.value.s2BottleBlowingMachineFlag = form.value.s2BottleBlowingMachineFlag.join(",")
      form.value.s2AirGunFlag = form.value.s2AirGunFlag.join(",")
      form.value.s2WasherDryerComboFlag = form.value.s2WasherDryerComboFlag.join(",")
      form.value.s2WaiguanFlag = form.value.s2WaiguanFlag.join(",")
      form.value.s2PurifiedWaterFlag = form.value.s2PurifiedWaterFlag.join(",")
      form.value.s2NoPurifiedWaterFlag = form.value.s2NoPurifiedWaterFlag.join(",")
      form.value.s2CleanBagFlag = form.value.s2CleanBagFlag.join(",")
      form.value.s3StepNormalDisable = form.value.s3StepNormalDisable.join(",")
      form.value.s3OperateShowHide = form.value.s3OperateShowHide.join(",")
      form.value.s3ReviewShowHide = form.value.s3ReviewShowHide.join(",")
      form.value.s3InspectShowHide = form.value.s3InspectShowHide.join(",")
      form.value.s3OzoneDesinfectionFlag = form.value.s3OzoneDesinfectionFlag.join(",")
      form.value.s3AirShowerFlag = form.value.s3AirShowerFlag.join(",")
      form.value.s3OzoneGeneratorFlag = form.value.s3OzoneGeneratorFlag.join(",")
      form.value.s3BottleWashingMachineFlag = form.value.s3BottleWashingMachineFlag.join(",")
      form.value.s3BottleBlowingMachineFlag = form.value.s3BottleBlowingMachineFlag.join(",")
      form.value.s3AirShowerMachineFlag = form.value.s3AirShowerMachineFlag.join(",")
      form.value.s3AlcoholDesinfectionFlag = form.value.s3AlcoholDesinfectionFlag.join(",")
      form.value.s3UvDesinfectionFlag = form.value.s3UvDesinfectionFlag.join(",")
      form.value.s3AirShowerInnerPackagingFlag = form.value.s3AirShowerInnerPackagingFlag.join(",")
      form.value.s3WaiguanFlag = form.value.s3WaiguanFlag.join(",")
      form.value.s3CleanBagFlag = form.value.s3CleanBagFlag.join(",")
      form.value.s4StepNormalDisable = form.value.s4StepNormalDisable.join(",")
      form.value.s4OperateShowHide = form.value.s4OperateShowHide.join(",")
      form.value.s4ReviewShowHide = form.value.s4ReviewShowHide.join(",")
      form.value.s4InspectShowHide = form.value.s4InspectShowHide.join(",")
      if (form.value.recordId != null) {
        updateDisinfectionPackaging1(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDisinfectionPackaging1(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _recordIds = row.recordId || ids.value
  proxy.$modal.confirm('是否确认删除灌装包材处理记录1编号为"' + _recordIds + '"的数据项？').then(function() {
    return delDisinfectionPackaging1(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/disinfectionPackaging1/export', {
    ...queryParams.value
  }, `disinfectionPackaging1_${new Date().getTime()}.xlsx`)
}

/** 查看详情 */
function handleView(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1ViewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开处理对话框 */
function handleHandle(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1HandleRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开复核对话框 */
function handleReview(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1ReviewRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 打开检查对话框 */
function handleInspect(row) {
  getDisinfectionPackaging1(row.recordId).then(res => {
    disPack1InspectRef.value?.open(res.data)
  }).catch(() => {
    proxy.$modal.msgError('获取详情失败')
  })
}

/** Step1 提交处理 */
async function handleStep1Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step1 操作记录？')
    await handleStep1(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step1 提交成功')
    disPack1HandleRef.value?.close()  // 关闭处理对话框
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 提交失败')
  }
}

/** Step2 提交处理 */
async function handleStep2Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step2 操作记录？')
    await handleStep2(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step2 提交成功')
    disPack1HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step2 提交失败')
  }
}

/** Step3 提交处理 */
async function handleStep3Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step3 操作记录？')
    await handleStep3(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step3 提交成功')
    disPack1HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 提交失败')
  }
}

/** Step4 提交处理 */
async function handleStep4Submit(formData) {
  try {
    await proxy.$modal.confirm('是否确认提交 Step4 操作记录？')
    await handleStep4(formData.recordId, formData)
    proxy.$modal.msgSuccess('Step4 提交成功')
    disPack1HandleRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step4 提交失败')
  }
}

/** Step1 复核处理 */
async function handleStep1Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step1？')
    await reviewStep1(recordId)
    proxy.$modal.msgSuccess('Step1 复核成功')
    disPack1ReviewRef.value?.close()  // 关闭复核对话框
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 复核失败')
  }
}

/** Step2 复核处理 */
async function handleStep2Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step2？')
    await reviewStep2(recordId)
    proxy.$modal.msgSuccess('Step2 复核成功')
    disPack1ReviewRef.value?.close()  // 关闭复核对话框
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 复核失败')
  }
}

/** Step3 复核处理 */
async function handleStep3Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step3？')
    await reviewStep3(recordId)
    proxy.$modal.msgSuccess('Step3 复核成功')
    disPack1ReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 复核失败')
  }
}

/** Step4 复核处理 */
async function handleStep4Review({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认复核 Step4？')
    await reviewStep4(recordId)
    proxy.$modal.msgSuccess('Step4 复核成功')
    disPack1ReviewRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step4 复核失败')
  }
}

/** Step1 检查处理 */
async function handleStep1Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step1？')
    await inspectStep1(recordId)
    proxy.$modal.msgSuccess('Step1 检查成功')
    disPack1InspectRef.value?.close()  // 关闭检查对话框
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step1 检查失败')
  }
}

/** Step2 检查处理 */
async function handleStep2Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step2？')
    await inspectStep2(recordId)
    proxy.$modal.msgSuccess('Step2 检查成功')
    disPack1InspectRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step2 检查失败')
  }
}

/** Step3 检查处理 */
async function handleStep3Inspect({ recordId }) {
  try {
    await proxy.$modal.confirm('是否确认检查 Step3？')
    await inspectStep3(recordId)
    proxy.$modal.msgSuccess('Step3 检查成功')
    disPack1InspectRef.value?.close()
    getList()
  } catch (e) {
    if (e !== 'cancel') proxy.$modal.msgError('Step3 检查失败')
  }
}

getList()
</script>
