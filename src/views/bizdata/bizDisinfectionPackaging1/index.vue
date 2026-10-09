<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联工单ID" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入关联工单ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入工单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入车间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处理日期" prop="processDate">
        <el-date-picker clearable
          v-model="queryParams.processDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择处理日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="步骤1名称" prop="s1StepName">
        <el-input
          v-model="queryParams.s1StepName"
          placeholder="请输入步骤1名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="步骤1开始时间" prop="s1StartTime">
        <el-date-picker clearable
          v-model="queryParams.s1StartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择步骤1开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="步骤1结束时间" prop="s1EndTime">
        <el-date-picker clearable
          v-model="queryParams.s1EndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择步骤1结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="一般区温度" prop="s1NormalAreaTemperature">
        <el-input
          v-model="queryParams.s1NormalAreaTemperature"
          placeholder="请输入一般区温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="一般区湿度" prop="s1NormalAreaHumidity">
        <el-input
          v-model="queryParams.s1NormalAreaHumidity"
          placeholder="请输入一般区湿度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="洁净区温度" prop="s1CleanAreaTemperature">
        <el-input
          v-model="queryParams.s1CleanAreaTemperature"
          placeholder="请输入洁净区温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="洁净区湿度" prop="s1CleanAreaHumidity">
        <el-input
          v-model="queryParams.s1CleanAreaHumidity"
          placeholder="请输入洁净区湿度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="不合格情况说明" prop="s1Remark">
        <el-input
          v-model="queryParams.s1Remark"
          placeholder="请输入不合格情况说明"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="步骤2名称" prop="s2StepName">
        <el-input
          v-model="queryParams.s2StepName"
          placeholder="请输入步骤2名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="步骤2开始时间" prop="s2StartTime">
        <el-date-picker clearable
          v-model="queryParams.s2StartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择步骤2开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="步骤2结束时间" prop="s2EndTime">
        <el-date-picker clearable
          v-model="queryParams.s2EndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择步骤2结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="臭氧机编号" prop="s2OzoneGeneratorNumber">
        <el-input
          v-model="queryParams.s2OzoneGeneratorNumber"
          placeholder="请输入臭氧机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="洗瓶机编号" prop="s2BottleWashingMachineNumber">
        <el-input
          v-model="queryParams.s2BottleWashingMachineNumber"
          placeholder="请输入洗瓶机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吹瓶机编号" prop="s2BottleBlowingMachineNumber">
        <el-input
          v-model="queryParams.s2BottleBlowingMachineNumber"
          placeholder="请输入吹瓶机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="烘洗一体机编号" prop="s2WasherDryerComboNumber">
        <el-input
          v-model="queryParams.s2WasherDryerComboNumber"
          placeholder="请输入烘洗一体机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消毒臭氧浓度" prop="s2OzoneConcentration">
        <el-input
          v-model="queryParams.s2OzoneConcentration"
          placeholder="请输入消毒臭氧浓度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="臭氧消毒开始时间" prop="s2OzoneDesinfectionStartTime">
        <el-date-picker clearable
          v-model="queryParams.s2OzoneDesinfectionStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择臭氧消毒开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="臭氧消毒结束时间" prop="s2OzoneDesinfectionEndTime">
        <el-date-picker clearable
          v-model="queryParams.s2OzoneDesinfectionEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择臭氧消毒结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="臭氧消毒时间" prop="s2OzoneDesinfectionCost">
        <el-input
          v-model="queryParams.s2OzoneDesinfectionCost"
          placeholder="请输入臭氧消毒时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="烘干消毒温度" prop="s2DryingDesinfectionTemperature">
        <el-input
          v-model="queryParams.s2DryingDesinfectionTemperature"
          placeholder="请输入烘干消毒温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="烘干消毒开始时间" prop="s2DryingDesinfectionStartTime">
        <el-date-picker clearable
          v-model="queryParams.s2DryingDesinfectionStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择烘干消毒开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="烘干消毒结束时间" prop="s2DryingDesinfectionEndTime">
        <el-date-picker clearable
          v-model="queryParams.s2DryingDesinfectionEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择烘干消毒结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="烘干消毒时间" prop="s2DryingDesinfectionCost">
        <el-input
          v-model="queryParams.s2DryingDesinfectionCost"
          placeholder="请输入烘干消毒时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="高温烘干消毒温度" prop="s2HighDryingDesinfectionTemperature">
        <el-input
          v-model="queryParams.s2HighDryingDesinfectionTemperature"
          placeholder="请输入高温烘干消毒温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="高温烘干消毒开始时间" prop="s2HighDryingDesinfectionStartTime">
        <el-date-picker clearable
          v-model="queryParams.s2HighDryingDesinfectionStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择高温烘干消毒开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="高温烘干消毒结束时间" prop="s2HighDryingDesinfectionEndTime">
        <el-date-picker clearable
          v-model="queryParams.s2HighDryingDesinfectionEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择高温烘干消毒结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="高温烘干消毒时间" prop="s2HighDryingDesinfectionCost">
        <el-input
          v-model="queryParams.s2HighDryingDesinfectionCost"
          placeholder="请输入高温烘干消毒时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="步骤3名称" prop="s3StepName">
        <el-input
          v-model="queryParams.s3StepName"
          placeholder="请输入步骤3名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="步骤3开始时间" prop="s3StartTime">
        <el-date-picker clearable
          v-model="queryParams.s3StartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择步骤3开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="步骤3结束时间" prop="s3EndTime">
        <el-date-picker clearable
          v-model="queryParams.s3EndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择步骤3结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="臭氧机编号" prop="s3OzoneGeneratorNumber">
        <el-input
          v-model="queryParams.s3OzoneGeneratorNumber"
          placeholder="请输入臭氧机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="洗瓶机编号" prop="s3BottleWashingMachineNumber">
        <el-input
          v-model="queryParams.s3BottleWashingMachineNumber"
          placeholder="请输入洗瓶机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吹瓶机编号" prop="s3BottleBlowingMachineNumber">
        <el-input
          v-model="queryParams.s3BottleBlowingMachineNumber"
          placeholder="请输入吹瓶机编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="风淋室编号" prop="s3AirShowerMachineNumber">
        <el-input
          v-model="queryParams.s3AirShowerMachineNumber"
          placeholder="请输入风淋室编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消毒臭氧浓度" prop="s3OzoneConcentration">
        <el-input
          v-model="queryParams.s3OzoneConcentration"
          placeholder="请输入消毒臭氧浓度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="臭氧消毒开始时间" prop="s3OzoneDesinfectionStartTime">
        <el-date-picker clearable
          v-model="queryParams.s3OzoneDesinfectionStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择臭氧消毒开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="臭氧消毒结束时间" prop="s3OzoneDesinfectionEndTime">
        <el-date-picker clearable
          v-model="queryParams.s3OzoneDesinfectionEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择臭氧消毒结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="臭氧消毒时间" prop="s3OzoneDesinfectionCost">
        <el-input
          v-model="queryParams.s3OzoneDesinfectionCost"
          placeholder="请输入臭氧消毒时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="步骤4名称" prop="s4StepName">
        <el-input
          v-model="queryParams.s4StepName"
          placeholder="请输入步骤4名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单版本号" prop="versionCode">
        <el-input
          v-model="queryParams.versionCode"
          placeholder="请输入表单版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="填报实例ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入填报实例ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乐观锁版本号" prop="revision">
        <el-input
          v-model="queryParams.revision"
          placeholder="请输入乐观锁版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统版本号" prop="sysVersion">
        <el-input
          v-model="queryParams.sysVersion"
          placeholder="请输入系统版本号"
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
          v-hasPermi="['bizdata:bizDisinfectionPackaging1:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bizdata:bizDisinfectionPackaging1:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bizdata:bizDisinfectionPackaging1:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bizdata:bizDisinfectionPackaging1:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bizDisinfectionPackaging1List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录主键" align="center" prop="recordId" />
      <el-table-column label="关联工单ID" align="center" prop="orderId" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="车间" align="center" prop="workshop" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理日期" align="center" prop="processDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.processDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤1名称" align="center" prop="s1StepName" />
      <el-table-column label="步骤1开始时间" align="center" prop="s1StartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s1StartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤1结束时间" align="center" prop="s1EndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s1EndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一般区温度" align="center" prop="s1NormalAreaTemperature" />
      <el-table-column label="一般区湿度" align="center" prop="s1NormalAreaHumidity" />
      <el-table-column label="洁净区温度" align="center" prop="s1CleanAreaTemperature" />
      <el-table-column label="洁净区湿度" align="center" prop="s1CleanAreaHumidity" />
      <el-table-column label="检查是否合格" align="center" prop="s1QualifiedFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s1QualifiedFlag ? scope.row.s1QualifiedFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="不合格情况说明" align="center" prop="s1Remark" />
      <el-table-column label="步骤2名称" align="center" prop="s2StepName" />
      <el-table-column label="步骤2开始时间" align="center" prop="s2StartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2StartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤2结束时间" align="center" prop="s2EndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2EndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否臭氧消毒" align="center" prop="s2OzoneDesinfectionFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2OzoneDesinfectionFlag ? scope.row.s2OzoneDesinfectionFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否高温消毒" align="center" prop="s2HighDesinfectionTemperatureFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2HighDesinfectionTemperatureFlag ? scope.row.s2HighDesinfectionTemperatureFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否使用臭氧机" align="center" prop="s2OzoneGeneratorFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2OzoneGeneratorFlag ? scope.row.s2OzoneGeneratorFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="臭氧机编号" align="center" prop="s2OzoneGeneratorNumber" />
      <el-table-column label="是否使用洗瓶机" align="center" prop="s2BottleWashingMachineFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2BottleWashingMachineFlag ? scope.row.s2BottleWashingMachineFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="洗瓶机编号" align="center" prop="s2BottleWashingMachineNumber" />
      <el-table-column label="是否使用吹瓶机" align="center" prop="s2BottleBlowingMachineFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2BottleBlowingMachineFlag ? scope.row.s2BottleBlowingMachineFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="吹瓶机编号" align="center" prop="s2BottleBlowingMachineNumber" />
      <el-table-column label="是否使用气枪" align="center" prop="s2AirGunFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2AirGunFlag ? scope.row.s2AirGunFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否手动洗" align="center" prop="s2ManualWashingFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2ManualWashingFlag ? scope.row.s2ManualWashingFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否使用烘洗一体机" align="center" prop="s2WasherDryerComboFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2WasherDryerComboFlag ? scope.row.s2WasherDryerComboFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="烘洗一体机编号" align="center" prop="s2WasherDryerComboNumber" />
      <el-table-column label="消毒臭氧浓度" align="center" prop="s2OzoneConcentration" />
      <el-table-column label="臭氧消毒开始时间" align="center" prop="s2OzoneDesinfectionStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2OzoneDesinfectionStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="臭氧消毒结束时间" align="center" prop="s2OzoneDesinfectionEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2OzoneDesinfectionEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="臭氧消毒时间" align="center" prop="s2OzoneDesinfectionCost" />
      <el-table-column label="烘干消毒温度" align="center" prop="s2DryingDesinfectionTemperature" />
      <el-table-column label="烘干消毒开始时间" align="center" prop="s2DryingDesinfectionStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2DryingDesinfectionStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="烘干消毒结束时间" align="center" prop="s2DryingDesinfectionEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2DryingDesinfectionEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="烘干消毒时间" align="center" prop="s2DryingDesinfectionCost" />
      <el-table-column label="高温烘干消毒温度" align="center" prop="s2HighDryingDesinfectionTemperature" />
      <el-table-column label="高温烘干消毒开始时间" align="center" prop="s2HighDryingDesinfectionStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2HighDryingDesinfectionStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高温烘干消毒结束时间" align="center" prop="s2HighDryingDesinfectionEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s2HighDryingDesinfectionEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高温烘干消毒时间" align="center" prop="s2HighDryingDesinfectionCost" />
      <el-table-column label="干净干燥完好" align="center" prop="s2WaiguanFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2WaiguanFlag ? scope.row.s2WaiguanFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="洗瓶用水是否纯化水" align="center" prop="s2PurifiedWaterFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2PurifiedWaterFlag ? scope.row.s2PurifiedWaterFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="无此项" align="center" prop="s2NoPurifiedWaterFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2NoPurifiedWaterFlag ? scope.row.s2NoPurifiedWaterFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否装入洁净袋" align="center" prop="s2CleanBagFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s2CleanBagFlag ? scope.row.s2CleanBagFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="步骤3名称" align="center" prop="s3StepName" />
      <el-table-column label="步骤3开始时间" align="center" prop="s3StartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s3StartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤3结束时间" align="center" prop="s3EndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s3EndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否臭氧消毒" align="center" prop="s3OzoneDesinfectionFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3OzoneDesinfectionFlag ? scope.row.s3OzoneDesinfectionFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否风淋消毒" align="center" prop="s3AirShowerFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3AirShowerFlag ? scope.row.s3AirShowerFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否使用臭氧机" align="center" prop="s3OzoneGeneratorFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3OzoneGeneratorFlag ? scope.row.s3OzoneGeneratorFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="臭氧机编号" align="center" prop="s3OzoneGeneratorNumber" />
      <el-table-column label="是否使用洗瓶机" align="center" prop="s3BottleWashingMachineFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3BottleWashingMachineFlag ? scope.row.s3BottleWashingMachineFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="洗瓶机编号" align="center" prop="s3BottleWashingMachineNumber" />
      <el-table-column label="是否使用吹瓶机" align="center" prop="s3BottleBlowingMachineFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3BottleBlowingMachineFlag ? scope.row.s3BottleBlowingMachineFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="吹瓶机编号" align="center" prop="s3BottleBlowingMachineNumber" />
      <el-table-column label="是否使用风淋室" align="center" prop="s3AirShowerMachineFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3AirShowerMachineFlag ? scope.row.s3AirShowerMachineFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="风淋室编号" align="center" prop="s3AirShowerMachineNumber" />
      <el-table-column label="消毒臭氧浓度" align="center" prop="s3OzoneConcentration" />
      <el-table-column label="臭氧消毒开始时间" align="center" prop="s3OzoneDesinfectionStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s3OzoneDesinfectionStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="臭氧消毒结束时间" align="center" prop="s3OzoneDesinfectionEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.s3OzoneDesinfectionEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="臭氧消毒时间" align="center" prop="s3OzoneDesinfectionCost" />
      <el-table-column label="是否75%酒精消毒" align="center" prop="s3AlcoholDesinfectionFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3AlcoholDesinfectionFlag ? scope.row.s3AlcoholDesinfectionFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否紫外线消毒" align="center" prop="s3UvDesinfectionFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3UvDesinfectionFlag ? scope.row.s3UvDesinfectionFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="内包装是否完整" align="center" prop="s3AirShowerInnerPackagingFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3AirShowerInnerPackagingFlag ? scope.row.s3AirShowerInnerPackagingFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="干净干燥完好" align="center" prop="s3WaiguanFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3WaiguanFlag ? scope.row.s3WaiguanFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="是否装入洁净袋" align="center" prop="s3CleanBagFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.s3CleanBagFlag ? scope.row.s3CleanBagFlag.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="步骤4名称" align="center" prop="s4StepName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="表单版本号" align="center" prop="versionCode" />
      <el-table-column label="填报实例ID" align="center" prop="instanceId" />
      <el-table-column label="乐观锁版本号" align="center" prop="revision" />
      <el-table-column label="系统版本号" align="center" prop="sysVersion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bizdata:bizDisinfectionPackaging1:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bizdata:bizDisinfectionPackaging1:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改灌装包材处理记录1对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizDisinfectionPackaging1Ref" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联工单ID" prop="orderId">
              <el-input v-model="form.orderId" placeholder="请输入关联工单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车间" prop="workshop">
              <el-input v-model="form.workshop" placeholder="请输入车间" />
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
            <el-form-item label="步骤1名称" prop="s1StepName">
              <el-input v-model="form.s1StepName" placeholder="请输入步骤1名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤1开始时间" prop="s1StartTime">
              <el-date-picker clearable
                v-model="form.s1StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择步骤1开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤1结束时间" prop="s1EndTime">
              <el-date-picker clearable
                v-model="form.s1EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择步骤1结束时间">
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
            <el-form-item label="步骤2名称" prop="s2StepName">
              <el-input v-model="form.s2StepName" placeholder="请输入步骤2名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤2开始时间" prop="s2StartTime">
              <el-date-picker clearable
                v-model="form.s2StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择步骤2开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤2结束时间" prop="s2EndTime">
              <el-date-picker clearable
                v-model="form.s2EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择步骤2结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否臭氧消毒" prop="s2OzoneDesinfectionFlag">
              <el-checkbox-group v-model="form.s2OzoneDesinfectionFlag">
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
            <el-form-item label="是否高温消毒" prop="s2HighDesinfectionTemperatureFlag">
              <el-checkbox-group v-model="form.s2HighDesinfectionTemperatureFlag">
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
            <el-form-item label="是否使用臭氧机" prop="s2OzoneGeneratorFlag">
              <el-checkbox-group v-model="form.s2OzoneGeneratorFlag">
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
            <el-form-item label="臭氧机编号" prop="s2OzoneGeneratorNumber">
              <el-input v-model="form.s2OzoneGeneratorNumber" placeholder="请输入臭氧机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否使用洗瓶机" prop="s2BottleWashingMachineFlag">
              <el-checkbox-group v-model="form.s2BottleWashingMachineFlag">
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
            <el-form-item label="洗瓶机编号" prop="s2BottleWashingMachineNumber">
              <el-input v-model="form.s2BottleWashingMachineNumber" placeholder="请输入洗瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否使用吹瓶机" prop="s2BottleBlowingMachineFlag">
              <el-checkbox-group v-model="form.s2BottleBlowingMachineFlag">
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
            <el-form-item label="吹瓶机编号" prop="s2BottleBlowingMachineNumber">
              <el-input v-model="form.s2BottleBlowingMachineNumber" placeholder="请输入吹瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否使用气枪" prop="s2AirGunFlag">
              <el-checkbox-group v-model="form.s2AirGunFlag">
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
            <el-form-item label="是否手动洗" prop="s2ManualWashingFlag">
              <el-checkbox-group v-model="form.s2ManualWashingFlag">
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
            <el-form-item label="是否使用烘洗一体机" prop="s2WasherDryerComboFlag">
              <el-checkbox-group v-model="form.s2WasherDryerComboFlag">
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
            <el-form-item label="无此项" prop="s2NoPurifiedWaterFlag">
              <el-checkbox-group v-model="form.s2NoPurifiedWaterFlag">
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
            <el-form-item label="步骤3名称" prop="s3StepName">
              <el-input v-model="form.s3StepName" placeholder="请输入步骤3名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤3开始时间" prop="s3StartTime">
              <el-date-picker clearable
                v-model="form.s3StartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择步骤3开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤3结束时间" prop="s3EndTime">
              <el-date-picker clearable
                v-model="form.s3EndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择步骤3结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否臭氧消毒" prop="s3OzoneDesinfectionFlag">
              <el-checkbox-group v-model="form.s3OzoneDesinfectionFlag">
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
            <el-form-item label="是否风淋消毒" prop="s3AirShowerFlag">
              <el-checkbox-group v-model="form.s3AirShowerFlag">
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
            <el-form-item label="是否使用臭氧机" prop="s3OzoneGeneratorFlag">
              <el-checkbox-group v-model="form.s3OzoneGeneratorFlag">
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
            <el-form-item label="臭氧机编号" prop="s3OzoneGeneratorNumber">
              <el-input v-model="form.s3OzoneGeneratorNumber" placeholder="请输入臭氧机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否使用洗瓶机" prop="s3BottleWashingMachineFlag">
              <el-checkbox-group v-model="form.s3BottleWashingMachineFlag">
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
            <el-form-item label="洗瓶机编号" prop="s3BottleWashingMachineNumber">
              <el-input v-model="form.s3BottleWashingMachineNumber" placeholder="请输入洗瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否使用吹瓶机" prop="s3BottleBlowingMachineFlag">
              <el-checkbox-group v-model="form.s3BottleBlowingMachineFlag">
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
            <el-form-item label="吹瓶机编号" prop="s3BottleBlowingMachineNumber">
              <el-input v-model="form.s3BottleBlowingMachineNumber" placeholder="请输入吹瓶机编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否使用风淋室" prop="s3AirShowerMachineFlag">
              <el-checkbox-group v-model="form.s3AirShowerMachineFlag">
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
            <el-form-item label="是否75%酒精消毒" prop="s3AlcoholDesinfectionFlag">
              <el-checkbox-group v-model="form.s3AlcoholDesinfectionFlag">
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
            <el-form-item label="是否紫外线消毒" prop="s3UvDesinfectionFlag">
              <el-checkbox-group v-model="form.s3UvDesinfectionFlag">
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
            <el-form-item label="步骤4名称" prop="s4StepName">
              <el-input v-model="form.s4StepName" placeholder="请输入步骤4名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表单版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入表单版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="填报实例ID" prop="instanceId">
              <el-input v-model="form.instanceId" placeholder="请输入填报实例ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="乐观锁版本号" prop="revision">
              <el-input v-model="form.revision" placeholder="请输入乐观锁版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统版本号" prop="sysVersion">
              <el-input v-model="form.sysVersion" placeholder="请输入系统版本号" />
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

<script setup name="BizDisinfectionPackaging1">
import { listBizDisinfectionPackaging1, getBizDisinfectionPackaging1, delBizDisinfectionPackaging1, addBizDisinfectionPackaging1, updateBizDisinfectionPackaging1 } from "@/api/bizdata/bizDisinfectionPackaging1"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = useDict('sys_yes_no')

const bizDisinfectionPackaging1List = ref([])
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
    orderId: undefined,
    orderNum: undefined,
    workshop: undefined,
    startTime: undefined,
    endTime: undefined,
    processDate: undefined,
    s1StepName: undefined,
    s1StartTime: undefined,
    s1EndTime: undefined,
    s1NormalAreaTemperature: undefined,
    s1NormalAreaHumidity: undefined,
    s1CleanAreaTemperature: undefined,
    s1CleanAreaHumidity: undefined,
    s1QualifiedFlag: undefined,
    s1Remark: undefined,
    s2StepName: undefined,
    s2StartTime: undefined,
    s2EndTime: undefined,
    s2OzoneDesinfectionFlag: undefined,
    s2HighDesinfectionTemperatureFlag: undefined,
    s2OzoneGeneratorFlag: undefined,
    s2OzoneGeneratorNumber: undefined,
    s2BottleWashingMachineFlag: undefined,
    s2BottleWashingMachineNumber: undefined,
    s2BottleBlowingMachineFlag: undefined,
    s2BottleBlowingMachineNumber: undefined,
    s2AirGunFlag: undefined,
    s2ManualWashingFlag: undefined,
    s2WasherDryerComboFlag: undefined,
    s2WasherDryerComboNumber: undefined,
    s2OzoneConcentration: undefined,
    s2OzoneDesinfectionStartTime: undefined,
    s2OzoneDesinfectionEndTime: undefined,
    s2OzoneDesinfectionCost: undefined,
    s2DryingDesinfectionTemperature: undefined,
    s2DryingDesinfectionStartTime: undefined,
    s2DryingDesinfectionEndTime: undefined,
    s2DryingDesinfectionCost: undefined,
    s2HighDryingDesinfectionTemperature: undefined,
    s2HighDryingDesinfectionStartTime: undefined,
    s2HighDryingDesinfectionEndTime: undefined,
    s2HighDryingDesinfectionCost: undefined,
    s2WaiguanFlag: undefined,
    s2PurifiedWaterFlag: undefined,
    s2NoPurifiedWaterFlag: undefined,
    s2CleanBagFlag: undefined,
    s3StepName: undefined,
    s3StartTime: undefined,
    s3EndTime: undefined,
    s3OzoneDesinfectionFlag: undefined,
    s3AirShowerFlag: undefined,
    s3OzoneGeneratorFlag: undefined,
    s3OzoneGeneratorNumber: undefined,
    s3BottleWashingMachineFlag: undefined,
    s3BottleWashingMachineNumber: undefined,
    s3BottleBlowingMachineFlag: undefined,
    s3BottleBlowingMachineNumber: undefined,
    s3AirShowerMachineFlag: undefined,
    s3AirShowerMachineNumber: undefined,
    s3OzoneConcentration: undefined,
    s3OzoneDesinfectionStartTime: undefined,
    s3OzoneDesinfectionEndTime: undefined,
    s3OzoneDesinfectionCost: undefined,
    s3AlcoholDesinfectionFlag: undefined,
    s3UvDesinfectionFlag: undefined,
    s3AirShowerInnerPackagingFlag: undefined,
    s3WaiguanFlag: undefined,
    s3CleanBagFlag: undefined,
    s4StepName: undefined,
    versionCode: undefined,
    instanceId: undefined,
    revision: undefined,
    sysVersion: undefined
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装包材处理记录1列表 */
function getList() {
  loading.value = true
  listBizDisinfectionPackaging1(queryParams.value).then(response => {
    bizDisinfectionPackaging1List.value = response.rows
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
    orderId: null,
    orderNum: null,
    workshop: null,
    startTime: null,
    endTime: null,
    processDate: null,
    s1StepName: null,
    s1StartTime: null,
    s1EndTime: null,
    s1NormalAreaTemperature: null,
    s1NormalAreaHumidity: null,
    s1CleanAreaTemperature: null,
    s1CleanAreaHumidity: null,
    s1QualifiedFlag: [],
    s1Remark: null,
    s2StepName: null,
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
    s2ManualWashingFlag: [],
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
    s3StepName: null,
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
    s4StepName: null,
    remark: null,
    versionCode: null,
    instanceId: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    revision: null,
    sysVersion: null
  }
  proxy.resetForm("bizDisinfectionPackaging1Ref")
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
  getBizDisinfectionPackaging1(_recordId).then(response => {
    form.value = response.data
    form.value.s1QualifiedFlag = form.value.s1QualifiedFlag.split(",")
    form.value.s2OzoneDesinfectionFlag = form.value.s2OzoneDesinfectionFlag.split(",")
    form.value.s2HighDesinfectionTemperatureFlag = form.value.s2HighDesinfectionTemperatureFlag.split(",")
    form.value.s2OzoneGeneratorFlag = form.value.s2OzoneGeneratorFlag.split(",")
    form.value.s2BottleWashingMachineFlag = form.value.s2BottleWashingMachineFlag.split(",")
    form.value.s2BottleBlowingMachineFlag = form.value.s2BottleBlowingMachineFlag.split(",")
    form.value.s2AirGunFlag = form.value.s2AirGunFlag.split(",")
    form.value.s2ManualWashingFlag = form.value.s2ManualWashingFlag.split(",")
    form.value.s2WasherDryerComboFlag = form.value.s2WasherDryerComboFlag.split(",")
    form.value.s2WaiguanFlag = form.value.s2WaiguanFlag.split(",")
    form.value.s2PurifiedWaterFlag = form.value.s2PurifiedWaterFlag.split(",")
    form.value.s2NoPurifiedWaterFlag = form.value.s2NoPurifiedWaterFlag.split(",")
    form.value.s2CleanBagFlag = form.value.s2CleanBagFlag.split(",")
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
    open.value = true
    title.value = "修改灌装包材处理记录1"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bizDisinfectionPackaging1Ref"].validate(valid => {
    if (valid) {
      form.value.s1QualifiedFlag = form.value.s1QualifiedFlag.join(",")
      form.value.s2OzoneDesinfectionFlag = form.value.s2OzoneDesinfectionFlag.join(",")
      form.value.s2HighDesinfectionTemperatureFlag = form.value.s2HighDesinfectionTemperatureFlag.join(",")
      form.value.s2OzoneGeneratorFlag = form.value.s2OzoneGeneratorFlag.join(",")
      form.value.s2BottleWashingMachineFlag = form.value.s2BottleWashingMachineFlag.join(",")
      form.value.s2BottleBlowingMachineFlag = form.value.s2BottleBlowingMachineFlag.join(",")
      form.value.s2AirGunFlag = form.value.s2AirGunFlag.join(",")
      form.value.s2ManualWashingFlag = form.value.s2ManualWashingFlag.join(",")
      form.value.s2WasherDryerComboFlag = form.value.s2WasherDryerComboFlag.join(",")
      form.value.s2WaiguanFlag = form.value.s2WaiguanFlag.join(",")
      form.value.s2PurifiedWaterFlag = form.value.s2PurifiedWaterFlag.join(",")
      form.value.s2NoPurifiedWaterFlag = form.value.s2NoPurifiedWaterFlag.join(",")
      form.value.s2CleanBagFlag = form.value.s2CleanBagFlag.join(",")
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
      if (form.value.recordId != null) {
        updateBizDisinfectionPackaging1(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBizDisinfectionPackaging1(form.value).then(() => {
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
    return delBizDisinfectionPackaging1(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bizdata/bizDisinfectionPackaging1/export', {
    ...queryParams.value
  }, `bizDisinfectionPackaging1_${new Date().getTime()}.xlsx`)
}

getList()
</script>
