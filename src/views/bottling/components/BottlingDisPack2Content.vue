<!--
  灌装包材处理记录2 纯内容组件（原生 table + 原生 checkbox）
  完全被动模式，通过 open(data) 接收数据，reset() 清空
  结构：
  - 公司名称 + 编号 + 标题
  - 产品信息（产品名称、规格、产品批号）
  - 表头（操作项目 / 操作记录 / /）
  - Step5 物料储存/周转（4 行）
  - Step6 生产过程不合格物料处理（3 行物料，每行 3 行子行：破损/色差/其他 + 处理方式，签名列独立）
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
        <col style="width: 102px;">
        <col style="width: 252px;">
        <col style="width: 80px;">
        <col>
        <col style="width: 125px;">
        <col style="width: 170px;">
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
        <col style="width: 102px;">
        <col>
        <col style="width: 170px;">
      </colgroup>
      <tr>
        <td class="header-value">操作项目</td>
        <td class="header-value">操作记录</td>
        <td class="header-value">/</td>
      </tr>
    </table>

    <!-- ===== Step5 物料储存/周转 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 102px;">
        <col>
        <col style="width: 170px;">
      </colgroup>
      <tr style="height: 100px;">
        <td class="td-step-label">5.物料<br>储存/周转</td>
        <td class="td-no-padding">
          <table class="inner-fill-table step5-inner" style="border-collapse: collapse; font-size: 14px; width: 100%; height: 100%;">
            <tr style="height: 25px;">
              <td class="split-td">
                <span class="str-left">1）{{ record.s5MaterialName1 || '' }}</span>
                <span class="str-right">数量：{{ record.s5MaterialQty1 || '' }} ；</span>
              </td>
            </tr>
            <tr style="height: 25px;">
              <td class="split-td">
                <span class="str-left">2）{{ record.s5MaterialName2 || '' }}</span>
                <span class="str-right">数量：{{ record.s5MaterialQty2 || '' }} ；</span>
              </td>
            </tr>
            <tr style="height: 25px;">
              <td class="split-td">
                <span class="str-left">3）{{ record.s5MaterialName3 || '' }}</span>
                <span class="str-right">数量：{{ record.s5MaterialQty3 || '' }} ；</span>
              </td>
            </tr>
            <tr style="height: 25px;">
              <td class="split-td">
                <span class="str-left">4）{{ record.s5MaterialName4 || '' }}</span>
                <span class="str-right">数量：{{ record.s5MaterialQty4 || '' }} ；</span>
              </td>
            </tr>
          </table>
        </td>
        <td class="td-sign">
          <div v-if="record.s5OperateShowHide !== '1'">操作人：{{ record.s5Operator || '' }}</div>
          <div v-if="record.s5ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s5Reviewer || '' }}</div>
          <div v-if="record.s5InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s5Inspector || '' }}</div>
        </td>
      </tr>
    </table>

    <!-- ===== Step6 生产过程不合格物料处理 ===== -->
    <table class="row-table step-table-native" cellspacing="0" cellpadding="0">
      <colgroup>
        <col style="width: 102px;">
        <col style="width: 125px;">
        <col style="width: 70px;">
        <col style="width: 100px;">
        <col>
        <col style="width: 125px;">
        <col style="width: 170px;">
      </colgroup>
      <tr style="height: 28px;">
        <td class="td-step-label" rowspan="10">6.生产过程不合格物料处理</td>
        <td class="header-value">不合格物料名称</td>
        <td class="header-value">单位</td>
        <td class="header-value">总数量</td>
        <td class="header-value">不合格原因及对应数量</td>
        <td class="header-value">处理方式</td>
        <td class="td-sign" rowspan="10">
          <div v-if="record.s6OperateShowHide !== '1'">操作人：{{ record.s6Operator || '' }}</div>
          <div v-if="record.s6ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ record.s6Reviewer || '' }}</div>
          <div v-if="record.s6InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ record.s6Inspector || '' }}</div>
        </td>
      </tr>
      <template v-for="(item, idx) in paddedStep6List" :key="idx">
        <!-- 破损行 -->
        <tr style="height: 28px;">
          <td :rowspan="3">{{ item.materialName || '' }}</td>
          <td :rowspan="3" class="td-record-cell td-record-center">{{ item.unit || '' }}</td>
          <td :rowspan="3" class="td-record-cell td-record-center">{{ item.s6NonConformingQty || '' }}</td>
          <td>
            <!-- 复选框：文字在前，复选框在后，与处理记录1完全一致 -->
            <label class="native-checkbox-after">
              <span>破损</span>
              <input type="checkbox" :checked="item.s6DamageFlag === 'Y'" disabled />
            </label>
            ，&nbsp;&nbsp;&nbsp;&nbsp;数量 {{ item.s6DamageQty || '' }} 个
          </td>
          <td :rowspan="3">
            <label class="native-checkbox-after">
              <span>销毁</span>
              <input type="checkbox" :checked="item.s6DestroyFlag === 'Y'" disabled />
            </label>
            <br/><br/>
            <label class="native-checkbox-after">
              <span>剪毁</span>
              <input type="checkbox" :checked="item.s6ShearFailureFlag === 'Y'" disabled />
            </label>
          </td>
        </tr>
        <!-- 色差行 -->
        <tr style="height: 28px;">
          <td>
            <label class="native-checkbox-after">
              <span>色差</span>
              <input type="checkbox" :checked="item.s6ColorDifferenceFlag === 'Y'" disabled />
            </label>
            ，&nbsp;&nbsp;&nbsp;&nbsp;数量 {{ item.s6ColorDifferenceQty || '' }} 个
          </td>
        </tr>
        <!-- 其他行 -->
        <tr style="height: 28px;">
          <td>
            <label class="native-checkbox-after">
              <span>其他</span>
              <input type="checkbox" :checked="item.s6OtherFlag === 'Y'" disabled />
            </label>
            ，{{ item.s6OtherReason || '' }}&nbsp;&nbsp;&nbsp;&nbsp;数量 {{ item.s6OtherQty || '' }} 个
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const record = ref(null)

/** 确保 Step6 至少有 3 行 */
const paddedStep6List = computed(() => {
  const list = record.value?.step6List || []
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
   容器：固定最大高度，隐藏滚动条，底部留 2px 内边距
   防止最后一行表格边框被 overflow 裁剪
   ============================================================ */
.view-container {
  max-height: 75vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px;
  padding-bottom: 2px;       /* 关键：让底部边框完全可见 */
  box-sizing: border-box;
  color: #000;
  transform: translateZ(0);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.view-container::-webkit-scrollbar {
  display: none;
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

/* ============================================================
   表头表格
   ============================================================ */
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
  vertical-align: middle !important;
}

/* ============================================================
   Step5单元格样式
   ============================================================ */
  /* 1. 让 td 成为 flex 容器 */
  .split-td {
    display: flex;
    width: 100%; /* 确保占满单元格宽度 */
    padding: 0;  /* 可选：去除默认内边距以精确控制 */
  }

  /* 2. 左侧字符串占 30% */
  .str-left {
    flex: 0 0 20%; /* 不放大、不缩小、基准宽度 30% */
    width: 20%;    /* 兼容性备份 */
    overflow: hidden; /* 防止内容溢出破坏布局 */
    text-overflow: ellipsis; /* 超出显示省略号 */
    white-space: nowrap; /* 不换行 */
  }

  /* 3. 右侧字符串占 70% */
  .str-right {
    flex: 0 0 80%; /* 不放大、不缩小、基准宽度 70% */
    width: 80%;    /* 兼容性备份 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

/* ============================================================
   Step5~Step6 外层单元格通用样式
   ============================================================ */
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 1px 1px;
  vertical-align: top;
  box-sizing: border-box;
  vertical-align: middle !important;
}

.td-no-padding { padding: 0 !important; }
.inner-fill-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}
.inner-fill-table td, .inner-fill-table th { border: none; }

/* Step5 内部表格下边框 */
.step5-inner td {
  border-bottom: 1px solid #dcdfe6;
  padding: 4px 8px;
  vertical-align: middle;
}
.step5-inner tr:last-child td { border-bottom: none; }

/* ============================================================
   操作项目列、签名列
   ============================================================ */
.td-step-label {
  font-weight: normal;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}
.td-sign {
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  vertical-align: middle !important;
}

/* Step6 操作记录列垂直居中 */
.td-record-cell {
  vertical-align: middle !important;
  text-align: left;
}

/* Step6 操作记录列水平居中 */
.td-record-center {
  text-align: center;
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
</style>
