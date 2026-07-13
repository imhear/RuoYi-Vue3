<!--
  清场记录 纯内容组件（原生 table + 原生 checkbox + 车间指示）
  完全被动模式，通过 open(data) 接收数据，reset() 清空
  结构：产品信息 + 清场日期 + 清场检查项列表 + 签名列合并
  说明：清场记录无分步骤，操作记录表头右侧无“/”表头，由合并上下单元格的签名列替代。
-->
<template>
  <div v-if="record" class="view-container">

    <!-- ===== 公司名称 + 编号 ===== -->
    <div style="display: flex; align-items: flex-end; margin-bottom: 4px;">
      <h4 style="flex: 1; text-align: center; margin: 0; font-size: 16px;">兰树化妆品股份有限公司</h4>
      <span style="flex-shrink: 0; font-size: 12px;">编号：R-(LS-SMP-S-08)-01</span>
    </div>
    <!-- 标题：清场记录 + 车间复选框（原生 checkbox，与处理记录1-2选中效果一致） -->
    <div style="text-align: center; margin-bottom: 4px; font-size: 15px;">
      清场记录（
      <label class="native-checkbox-after"><span>消毒</span><input type="checkbox" :checked="record.workshop === 'D'" disabled /></label>
      <label class="native-checkbox-after"><span>灌装</span><input type="checkbox" :checked="record.workshop === 'F'" disabled /></label>
      <label class="native-checkbox-after"><span>包装</span><input type="checkbox" :checked="record.workshop === 'P'" disabled /></label>
      <label class="native-checkbox-after"><span>组套</span><input type="checkbox" :checked="record.workshop === 'G'" disabled /></label>
      ）
    </div>

    <!-- ===== 产品信息 ===== -->
    <table class="row-table info-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 170px;">   <!-- 产品名称标签列：对齐下方第一列 -->
        <col>
        <col style="width: 100px;">   <!-- 规格标签列：原80px + 20px -->
        <col style="width: 150px;">   <!-- 规格内容列：减少100px -->
        <col style="width: 120px;">   <!-- 产品批号标签列：与操作记录列相同 -->
        <col style="width: 210px;">   <!-- 产品批号值列：原110px + 100px，与签名列相同 -->
      </colgroup>
      <tr>
        <td class="info-label">产品名称</td>
        <td class="info-value">{{ record.productName || '' }}</td>
        <td class="info-label">规格</td>
        <td class="info-value">{{ record.spec || '' }}</td>
        <td class="info-label">产品批号</td>
        <td class="info-value">{{ record.batchNumber || '' }}</td>
      </tr>
    </table>

    <!-- ===== 清场日期 ===== -->
    <table class="row-table info-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 170px;">   <!-- 清场日期标签列：对齐下方第一列 -->
        <col>
      </colgroup>
      <tr>
        <td class="info-label">清场日期</td>
        <td class="info-value">{{ record.cleaningDate || '' }}</td>
      </tr>
    </table>

    <!-- ===== 表头（签名列占位列） ===== -->
    <table class="row-table header-table" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 170px;">
        <col>
        <col style="width: 120px;">
        <col style="width: 210px;">   <!-- 签名列：与产品批号值列相同 -->
      </colgroup>
      <tr>
        <td class="header-value">清场项目</td>
        <td class="header-value">清场要求</td>
        <td class="header-value">操作记录</td>
        <td class="header-value" style="border-bottom-color: #fff;"></td>
      </tr>
    </table>

    <!-- ===== 清场检查项（13 行，签名列 rowspan=13） ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 170px;">
        <col>
        <col style="width: 120px;">
        <col style="width: 210px;">   <!-- 签名列：与产品批号值列相同 -->
      </colgroup>

      <!-- 1. 更换状态标识 -->
      <tr style="height: 28px;">
        <td class="td-step-label">更换状态标识</td>
        <td class="td-require">更换设备状态标识</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.statusLabelReplaceFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.statusLabelReplaceFlag === 'N'" disabled /></label>
        </td>
        <!-- 签名列：固定文本始终显示，名字仅当对应时间非空时显示 -->
        <td class="td-sign" rowspan="13" style="border-top-color: #fff;">
          <div v-if="record.operateShowHide !== '1'">操作人：{{ record.operator && record.operatorTime ? record.operator : '' }}</div>
          <br/>
          <div v-if="record.reviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.reviewer && record.reviewerTime ? record.reviewer : '' }}</div>
          <br/>
          <div v-if="record.inspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.inspector && record.inspectorTime ? record.inspector : '' }}</div>
        </td>
      </tr>

      <!-- 2-4. 物料清除（3 行） -->
      <tr style="height: 28px;">
        <td class="td-step-label" rowspan="3">物料清除</td>
        <td class="td-require">移出工序产品</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.materialRemoveProductFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.materialRemoveProductFlag === 'N'" disabled /></label>
        </td>
      </tr>
      <tr style="height: 28px;">
        <td class="td-require">移出剩余物料及不合格物料</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.materialRemoveResidualFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.materialRemoveResidualFlag === 'N'" disabled /></label>
        </td>
      </tr>
      <tr style="height: 28px;">
        <td class="td-require">无本批残留物</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.materialRemoveBatchResidueFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.materialRemoveBatchResidueFlag === 'N'" disabled /></label>
        </td>
      </tr>

      <!-- 5-6. 场所清洁（2 行） -->
      <tr style="height: 28px;">
        <td class="td-step-label" rowspan="2">场所清洁</td>
        <td class="td-require">地面无积水、无粉尘、无污物</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.siteCleanFloorFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.siteCleanFloorFlag === 'N'" disabled /></label>
        </td>
      </tr>
      <tr style="height: 28px;">
        <td class="td-require">门窗、内墙、顶棚、灯具、管道、线路等清洁干净</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.siteCleanStructureFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.siteCleanStructureFlag === 'N'" disabled /></label>
        </td>
      </tr>

      <!-- 7-8. 设备清洁（2 行） -->
      <tr style="height: 28px;">
        <td class="td-step-label" rowspan="2">设备清洁</td>
        <td class="td-require">无粉尘、无油污</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.equipCleanDustOilFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.equipCleanDustOilFlag === 'N'" disabled /></label>
        </td>
      </tr>
      <tr style="height: 28px;">
        <td class="td-require">设备见本色、光亮、洁净</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.equipCleanOriginalColorFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.equipCleanOriginalColorFlag === 'N'" disabled /></label>
        </td>
      </tr>

      <!-- 9. 工器具清洁 -->
      <tr style="height: 28px;">
        <td class="td-step-label">工器具清洁</td>
        <td class="td-require">无粉尘、无污物，洁净见本色</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.toolCleanDustDirtFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.toolCleanDustDirtFlag === 'N'" disabled /></label>
        </td>
      </tr>

      <!-- 10-11. 设施清洁（2 行） -->
      <tr style="height: 28px;">
        <td class="td-step-label" rowspan="2">设施清洁</td>
        <td class="td-require">无粉尘、无污物、干净见本色</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.facilityCleanDustDirtFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.facilityCleanDustDirtFlag === 'N'" disabled /></label>
        </td>
      </tr>
      <tr style="height: 28px;">
        <td class="td-require">摆放整齐</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.facilityCleanArrangementFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.facilityCleanArrangementFlag === 'N'" disabled /></label>
        </td>
      </tr>

      <!-- 12. 其它 -->
      <tr style="height: 28px;">
        <td class="td-step-label">其 它</td>
        <td class="td-require">洁 净</td>
        <td class="td-record">
          <label class="native-checkbox-after"><span>是</span><input type="checkbox" :checked="record.otherCleanStatusFlag === 'Y'" disabled /></label>
          <label class="native-checkbox-after"><span>否</span><input type="checkbox" :checked="record.otherCleanStatusFlag === 'N'" disabled /></label>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const record = ref(null)

/**
 * 打开查看对话框，接收父组件传入的完整数据
 * @param {Object} data - 清场记录详情数据
 */
function open(data) {
  record.value = data
}

/** 重置数据，关闭对话框时调用 */
function reset() {
  record.value = null
}

defineExpose({ open, reset })
</script>

<style scoped>
/* ============================================================
   容器：固定最大高度，隐藏滚动条
   ============================================================ */
.view-container {
  max-height: 75vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px;
  padding-bottom: 2px;
  box-sizing: border-box;
  color: #000;
  transform: translateZ(0);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.view-container::-webkit-scrollbar { display: none; }

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
   产品信息表格 / 清场日期表格
   ============================================================ */
.info-table td {
  border: 1px solid #dcdfe6;
  padding: 4px 6px;
  vertical-align: middle;
  box-sizing: border-box;
}
.info-label {
  font-weight: normal;
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
  vertical-align: middle;
  box-sizing: border-box;
}
.header-value {
  font-weight: normal;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
  vertical-align: middle !important;
}

/* ============================================================
   清场检查项表格外层样式
   ============================================================ */
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 1px 1px;
  vertical-align: top;
  box-sizing: border-box;
}

/* ============================================================
   第一列：清场项目列 170px，水平居中、垂直居中
   ============================================================ */
.td-step-label {
  font-weight: normal;
  text-align: center;
  vertical-align: middle !important;
  font-size: 14px;
}
/* 清场要求列 */
.td-require {
  font-size: 14px;
  text-align: left;
  vertical-align: middle !important;
  padding: 4px 8px;
}
/* 操作记录列：水平居中、垂直居中 */
.td-record {
  font-size: 13px;
  text-align: center;
  vertical-align: middle !important;
  padding: 4px 8px;
}
/* 签名列：垂直居中 */
.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
}

/* ============================================================
   原生复选框样式（文字在前、复选框在后）
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
  margin-left: 20px;
}
</style>