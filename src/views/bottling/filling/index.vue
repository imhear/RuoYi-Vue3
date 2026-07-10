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

     <!-- 不使用，待统一删除 -->
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['bottling:filling:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:filling:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:filling:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:filling:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="fillingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 加页按钮：仅生产中状态显示 -->
          <el-button link type="primary" icon="" @click="handleAddPage(scope.row)"   v-hasPermi="['bottling:filling:add']" >加页</el-button>
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:filling:edit']">修改</el-button> -->
          <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bottling:filling:remove']">删除</el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="记录主键" align="center" prop="recordId" /> -->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="disinfection_packaging_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!-- 任务单号改为超链接，点击触发查看 -->
      <el-table-column label="任务单号" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.planCode }}</el-button>
        </template>
      </el-table-column>
      <!-- 工单号改为超链接，点击触发查看 -->
      <el-table-column label="工单号" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleOrderView(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" /> -->
      <!-- <el-table-column label="排产单号" align="center" prop="planCode" /> -->
      <el-table-column label="产品编码" align="center" prop="productCode" />
      <!-- <el-table-column label="产品名称" align="center" prop="productName" /> -->
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="产品批号" align="center" prop="batchNumber" />
      <el-table-column label="生产日期" align="center" prop="recordDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.recordDate, '{y}-{m}-{d}') }}</span>
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

    <!-- 查看灌装生产记录对话框 -->
    <BottlingFillingView ref="fillingViewRef" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 加页对话框 -->
    <BottlingFillingAddPage ref="addPageRef" @submit="handleConfirmAddPage" />

    <!-- 添加或修改灌装生产记录1对话框 ，不使用，待统一删除 -->
    <!-- <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fillingRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联工单" prop="orderId">
              <el-input v-model="form.orderId" placeholder="请输入关联工单" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联排产计划" prop="planId">
              <el-input v-model="form.planId" placeholder="请输入关联排产计划" />
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
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编码" />
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
            <el-form-item label="生产日期" prop="recordDate">
              <el-date-picker clearable
                v-model="form.recordDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择生产日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="灌装开始时间" prop="fillingStartTime">
              <el-date-picker clearable
                v-model="form.fillingStartTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择灌装开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="灌装结束时间" prop="fillingEndTime">
              <el-date-picker clearable
                v-model="form.fillingEndTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择灌装结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="灌装首件确认(是否合格,Y=是,N=否）" prop="firstQualifiedFlag">
              <el-input v-model="form.firstQualifiedFlag" placeholder="请输入灌装首件确认(是否合格,Y=是,N=否）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人" prop="firstQualifiedInspector">
              <el-input v-model="form.firstQualifiedInspector" placeholder="请输入检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人提交时间" prop="firstQualifiedInspectorTime">
              <el-date-picker clearable
                v-model="form.firstQualifiedInspectorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择检查人提交时间">
              </el-date-picker>
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
            <el-form-item label="步骤启用开关" prop="s1StepNormalDisable">
              <el-input v-model="form.s1StepNormalDisable" placeholder="请输入步骤启用开关" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人前端显示" prop="s1OperateShowHide">
              <el-input v-model="form.s1OperateShowHide" placeholder="请输入操作人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人前端显示" prop="s1ReviewShowHide">
              <el-input v-model="form.s1ReviewShowHide" placeholder="请输入复核人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人前端显示" prop="s1InspectShowHide">
              <el-input v-model="form.s1InspectShowHide" placeholder="请输入检查人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s1操作人" prop="s1Operator">
              <el-input v-model="form.s1Operator" placeholder="请输入s1操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s1复核人" prop="s1Reviewer">
              <el-input v-model="form.s1Reviewer" placeholder="请输入s1复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s1检查人" prop="s1Inspector">
              <el-input v-model="form.s1Inspector" placeholder="请输入s1检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s1操作人提交时间" prop="s1OperatorTime">
              <el-date-picker clearable
                v-model="form.s1OperatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s1操作人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s1复核人提交时间" prop="s1ReviewerTime">
              <el-date-picker clearable
                v-model="form.s1ReviewerTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s1复核人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s1检查人提交时间" prop="s1InspectorTime">
              <el-date-picker clearable
                v-model="form.s1InspectorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s1检查人提交时间">
              </el-date-picker>
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
              <el-input v-model="form.s1QualifiedFlag" placeholder="请输入检查是否合格" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查不合格情况说明及处理方式" prop="s1Remark">
              <el-input v-model="form.s1Remark" placeholder="请输入检查不合格情况说明及处理方式" />
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
            <el-form-item label="步骤启用开关" prop="s2StepNormalDisable">
              <el-input v-model="form.s2StepNormalDisable" placeholder="请输入步骤启用开关" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人前端显示" prop="s2OperateShowHide">
              <el-input v-model="form.s2OperateShowHide" placeholder="请输入操作人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人前端显示" prop="s2ReviewShowHide">
              <el-input v-model="form.s2ReviewShowHide" placeholder="请输入复核人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人前端显示" prop="s2InspectShowHide">
              <el-input v-model="form.s2InspectShowHide" placeholder="请输入检查人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s2操作人" prop="s2Operator">
              <el-input v-model="form.s2Operator" placeholder="请输入s2操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s2复核人" prop="s2Reviewer">
              <el-input v-model="form.s2Reviewer" placeholder="请输入s2复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s2检查人" prop="s2Inspector">
              <el-input v-model="form.s2Inspector" placeholder="请输入s2检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s2操作人提交时间" prop="s2OperatorTime">
              <el-date-picker clearable
                v-model="form.s2OperatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s2操作人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s2复核人提交时间" prop="s2ReviewerTime">
              <el-date-picker clearable
                v-model="form.s2ReviewerTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s2复核人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s2检查人提交时间" prop="s2InspectorTime">
              <el-date-picker clearable
                v-model="form.s2InspectorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s2检查人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主要设备名称" prop="s2MainEquipName">
              <el-input v-model="form.s2MainEquipName" placeholder="请输入主要设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主要设备编码" prop="s2MainEquipNo">
              <el-input v-model="form.s2MainEquipNo" placeholder="请输入主要设备编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="在清洁效期内：使用纯化水清洗" prop="s2PurifiedWaterFlag">
              <el-input v-model="form.s2PurifiedWaterFlag" placeholder="请输入在清洁效期内：使用纯化水清洗" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="超过清洁效期：重新清洁消毒" prop="s2ReCleanDisinfectFlag">
              <el-input v-model="form.s2ReCleanDisinfectFlag" placeholder="请输入超过清洁效期：重新清洁消毒" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="清洁方式" prop="s2CleaningMethod">
              <el-input v-model="form.s2CleaningMethod" placeholder="请输入清洁方式" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="消毒方式" prop="s2DesinfectionMethod">
              <el-input v-model="form.s2DesinfectionMethod" placeholder="请输入消毒方式" />
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
            <el-form-item label="步骤启用开关" prop="s3StepNormalDisable">
              <el-input v-model="form.s3StepNormalDisable" placeholder="请输入步骤启用开关" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作人前端显示" prop="s3OperateShowHide">
              <el-input v-model="form.s3OperateShowHide" placeholder="请输入操作人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复核人前端显示" prop="s3ReviewShowHide">
              <el-input v-model="form.s3ReviewShowHide" placeholder="请输入复核人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人前端显示" prop="s3InspectShowHide">
              <el-input v-model="form.s3InspectShowHide" placeholder="请输入检查人前端显示" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s3操作人" prop="s3Operator">
              <el-input v-model="form.s3Operator" placeholder="请输入s3操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s3复核人" prop="s3Reviewer">
              <el-input v-model="form.s3Reviewer" placeholder="请输入s3复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s3检查人" prop="s3Inspector">
              <el-input v-model="form.s3Inspector" placeholder="请输入s3检查人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s3操作人提交时间" prop="s3OperatorTime">
              <el-date-picker clearable
                v-model="form.s3OperatorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s3操作人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s3复核人提交时间" prop="s3ReviewerTime">
              <el-date-picker clearable
                v-model="form.s3ReviewerTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s3复核人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="s3检查人提交时间" prop="s3InspectorTime">
              <el-date-picker clearable
                v-model="form.s3InspectorTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择s3检查人提交时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否用料液冲洗" prop="s3UseMaterialLiquidRinseFlag">
              <el-input v-model="form.s3UseMaterialLiquidRinseFlag" placeholder="请输入是否用料液冲洗" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="净含量范围下" prop="s3NetContentRangeLower">
              <el-input v-model="form.s3NetContentRangeLower" placeholder="请输入净含量范围下" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="净含量范围上" prop="s3NetContentRangeUpper">
              <el-input v-model="form.s3NetContentRangeUpper" placeholder="请输入净含量范围上" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="净含量单位" prop="s3NetContentUnit">
              <el-input v-model="form.s3NetContentUnit" placeholder="请输入净含量单位" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否油墨码" prop="s3InkPrintCodeFlag">
              <el-input v-model="form.s3InkPrintCodeFlag" placeholder="请输入是否油墨码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否激光码" prop="s3LaserPrintCodeFlag">
              <el-input v-model="form.s3LaserPrintCodeFlag" placeholder="请输入是否激光码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否钢印码" prop="s3StampPrintCodeFlag">
              <el-input v-model="form.s3StampPrintCodeFlag" placeholder="请输入是否钢印码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="打码信息" prop="s3CodingInfo">
              <el-input v-model="form.s3CodingInfo" placeholder="请输入打码信息" />
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
    </el-dialog> -->
  </div>
</template>

<script setup name="Filling">
import { listFilling, getFilling, delFilling, addFilling, updateFilling } from "@/api/bottling/filling"
import { getPlan } from "@/api/bottling/plan"
import { getOrderDetail } from "@/api/bottling/order"
import { addPage } from "@/api/bottling/filling"
// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'
// 引入加页对话框组件
import BottlingFillingAddPage from '@/views/bottling/components/BottlingFillingAddPage.vue'
// 引入查看对话框组件
import BottlingFillingView from '@/views/bottling/components/BottlingFillingView.vue'

// 加页对话框组件引用
const addPageRef = ref(null)
// 查看工单组件引用
const orderViewRef = ref(null)
// 查看灌装生产记录组件引用
const fillingViewRef = ref(null)

const { proxy } = getCurrentInstance()
const { sys_yes_no, disinfection_packaging_status } = useDict('sys_yes_no', 'disinfection_packaging_status')

const fillingList = ref([])
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
    status: '0,1,2', // 默认排除已取消
    delFlag: '0',   // 默认查询未删除的工单
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询灌装生产记录1列表 */
function getList() {
  loading.value = true
  listFilling(queryParams.value).then(response => {
    fillingList.value = response.rows
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
    planId: null,
    status: null,
    orderNum: null,
    planCode: null,
    productCode: null,
    productName: null,
    spec: null,
    batchNumber: null,
    recordDate: null,
    fillingStartTime: null,
    fillingEndTime: null,
    firstQualifiedFlag: null,
    firstQualifiedInspector: null,
    firstQualifiedInspectorTime: null,
    s1StepNumber: null,
    s1StepName: null,
    s1StepNormalDisable: null,
    s1OperateShowHide: null,
    s1ReviewShowHide: null,
    s1InspectShowHide: null,
    s1Operator: null,
    s1Reviewer: null,
    s1Inspector: null,
    s1OperatorTime: null,
    s1ReviewerTime: null,
    s1InspectorTime: null,
    s1CleanAreaTemperature: null,
    s1CleanAreaHumidity: null,
    s1QualifiedFlag: null,
    s1Remark: null,
    s2StepNumber: null,
    s2StepName: null,
    s2StepNormalDisable: null,
    s2OperateShowHide: null,
    s2ReviewShowHide: null,
    s2InspectShowHide: null,
    s2Operator: null,
    s2Reviewer: null,
    s2Inspector: null,
    s2OperatorTime: null,
    s2ReviewerTime: null,
    s2InspectorTime: null,
    s2MainEquipName: null,
    s2MainEquipNo: null,
    s2PurifiedWaterFlag: null,
    s2ReCleanDisinfectFlag: null,
    s2CleaningMethod: null,
    s2DesinfectionMethod: null,
    s3StepNumber: null,
    s3StepName: null,
    s3StepNormalDisable: null,
    s3OperateShowHide: null,
    s3ReviewShowHide: null,
    s3InspectShowHide: null,
    s3Operator: null,
    s3Reviewer: null,
    s3Inspector: null,
    s3OperatorTime: null,
    s3ReviewerTime: null,
    s3InspectorTime: null,
    s3UseMaterialLiquidRinseFlag: null,
    s3NetContentRangeLower: null,
    s3NetContentRangeUpper: null,
    s3NetContentUnit: null,
    s3InkPrintCodeFlag: null,
    s3LaserPrintCodeFlag: null,
    s3StampPrintCodeFlag: null,
    s3CodingInfo: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("fillingRef")
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
  title.value = "添加灌装生产记录1"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getFilling(_recordId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改灌装生产记录1"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fillingRef"].validate(valid => {
    if (valid) {
      if (form.value.recordId != null) {
        updateFilling(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFilling(form.value).then(() => {
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
  proxy.$modal.confirm('是否确认删除灌装生产记录1编号为"' + _recordIds + '"的数据项？').then(function() {
    return delFilling(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/filling/export', {
    ...queryParams.value
  }, `filling_${new Date().getTime()}.xlsx`)
}

/** 打开加页对话框（改造后） */
async function handleAddPage(row) {
  try {
    // 1. 根据行数据中的 planId 获取排产计划
    const planRes = await getPlan(row.planId)
    const plan = planRes.data
    // 2. 通过排产计划里的 orderNum 获取工单详情
    const orderRes = await getOrderDetail(plan.orderId)
    const orderDetail = orderRes.data
    // 3. 将 plan 附加到工单详情中，与“开始”对话框一致
    // ✅ 显式添加 planId（BottlingOrderContent 会用到）
    orderDetail.planId = row.planId
    orderDetail.plan = plan
    // 4. 传递给子组件打开
    addPageRef.value?.open(orderDetail)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 确认加页：二次确认后调用后端接口 */
function handleConfirmAddPage({ planId, recordDate }) {
  proxy.$modal.confirm('是否确认新增生产日期为 ' + recordDate + ' 的灌装记录？').then(() => {
    return addPage(planId, { recordDate })
  }).then(() => {
    proxy.$modal.msgSuccess('加页成功')
    addPageRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 查看灌装生产记录详情（任务单号点击事件） */
async function handleView(row) {
  try {
    const res = await getFilling(row.recordId)
    fillingViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取灌装生产记录详情失败')
  }
}

/** 查看工单详情 */
async function handleOrderView(row) {
  try {
    const res = await getOrderDetail(row.orderId)
    // viewOpen.value = true
    await nextTick()
    orderViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}


getList()
</script>
