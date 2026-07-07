<!--
  灌装包材处理记录2 处理对话框（Step5/Step6 可编辑版）
  基线：在最新版查看对话框内容和样式基础上改造
  改造：Step5 操作记录列可编辑，签名行增加提交按钮（无开始/结束时间）
        Step6 操作记录列可编辑，签名行增加提交按钮，操作记录列垂直居中
  交互：完全被动模式，emit 数据给父组件处理
-->
<template>
  <el-dialog v-model="visible" width="280mm" append-to-body @closed="handleClosed">
    <template #header>
      <div style="display: flex; align-items: center; width: 100%;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">灌装包材处理记录2</span>
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
          <col style="width: 102px;">
          <col style="width: 252px;">
          <col style="width: 80px;">
          <col>
          <col style="width: 125px;">
          <col style="width: 170px;">
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

      <!-- ===== Step5 物料储存/周转（可编辑，无开始/结束时间） ===== -->
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
                <td>1）
                    <el-select v-model="form.s5MaterialName1" clearable placeholder="物料名称" size="small" style="width: 100px;">
                        <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                    &nbsp;&nbsp;&nbsp;&nbsp;数量：<input v-model="form.s5MaterialQty1" class="edit-input-short" style="width: 60px;" placeholder="数量" /> ；</td>
              </tr>
              <tr style="height: 25px;">
                <td>2）
                    <el-select v-model="form.s5MaterialName2" clearable placeholder="物料名称" size="small" style="width: 100px;">
                        <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                    &nbsp;&nbsp;&nbsp;&nbsp;数量：<input v-model="form.s5MaterialQty2" class="edit-input-short" style="width: 60px;" placeholder="数量" /> ；</td>
              </tr>
              <tr style="height: 25px;">
                <td>3）
                    <el-select v-model="form.s5MaterialName3" clearable placeholder="物料名称" size="small" style="width: 100px;">
                        <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                    &nbsp;&nbsp;&nbsp;&nbsp;数量：<input v-model="form.s5MaterialQty3" class="edit-input-short" style="width: 60px;" placeholder="数量" /> ；</td>
              </tr>
              <tr style="height: 25px;">
                <td>4）
                    <el-select v-model="form.s5MaterialName4" clearable placeholder="物料名称" size="small" style="width: 100px;">
                        <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                    &nbsp;&nbsp;&nbsp;&nbsp;数量：<input v-model="form.s5MaterialQty4" class="edit-input-short" style="width: 60px;" placeholder="数量" /> .</td>
              </tr>
            </table>
          </td>
          <td class="td-sign">
            <div v-if="form.s5OperateShowHide !== '1'">操作人：{{ form.s5Operator || '' }}</div>
            <div v-if="form.s5OperatorTime" style="color: gray; font-size: 12px;">{{ form.s5OperatorTime ? form.s5OperatorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s5ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.s5Reviewer || '' }}</div>
            <div v-if="form.s5ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s5ReviewerTime ? form.s5ReviewerTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s5InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s5Inspector || '' }}</div>
            <div v-if="form.s5InspectorTime" style="color: gray; font-size: 12px;">{{ form.s5InspectorTime ? form.s5InspectorTime.substring(0, 16) : '' }}</div>
            <!-- 操作人未提交且显示，或检查按钮显示且检查人未提交时，显示处理按钮 -->
            <div v-if="(form.s5OperateShowHide === '0' && !form.s5OperatorTime) || (form.s5OperateShowHide === '0' && form.s5InspectShowHide === '0' && !form.s5InspectorTime)" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmitStep5">提交</el-button>
            </div>
          </td>
        </tr>
      </table>

      <!-- ===== Step6 生产过程不合格物料处理（可编辑，操作记录列垂直居中） ===== -->
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
            <div v-if="form.s6OperateShowHide !== '1'">操作人：{{ form.s6Operator || '' }}</div>
            <div v-if="form.s6OperatorTime" style="color: gray; font-size: 12px;">{{ form.s6OperatorTime ? form.s6OperatorTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s6ReviewShowHide !== '1'" style="margin-top: 8px;">复核人：{{ form.s6Reviewer || '' }}</div>
            <div v-if="form.s6ReviewerTime" style="color: gray; font-size: 12px;">{{ form.s6ReviewerTime ? form.s6ReviewerTime.substring(0, 16) : '' }}</div>
            <div v-if="form.s6InspectShowHide !== '1'" style="margin-top: 8px;">检查人：{{ form.s6Inspector || '' }}</div>
            <div v-if="form.s6InspectorTime" style="color: gray; font-size: 12px;">{{ form.s6InspectorTime ? form.s6InspectorTime.substring(0, 16) : '' }}</div>
            <!-- 操作人未提交且显示，或检查按钮显示且检查人未提交时，显示处理按钮 -->
            <div v-if="(form.s6OperateShowHide === '0' && !form.s6OperatorTime) || (form.s6OperateShowHide === '0' && form.s6InspectShowHide === '0' && !form.s6InspectorTime)" style="margin-top: 8px;">
              <el-button type="primary" size="small" @click="handleSubmitStep6">提交</el-button>
            </div>
          </td>
        </tr>
        <template v-for="(item, idx) in paddedStep6List" :key="idx">
          <!-- 破损行 -->
          <tr style="height: 28px;">
            <td :rowspan="3" class="td-record-cell">
                <el-select v-model="item.materialName" clearable placeholder="物料名称" size="small" style="width: 100px;">
                    <el-option v-for="dict in receiving_material" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </td>
            <td :rowspan="3" class="td-record-cell td-record-center">
                <el-select v-model="item.unit" clearable placeholder="单位" size="small" style="width: 60px;">
                <el-option v-for="dict in pro_unit" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </td>
            <td :rowspan="3" class="td-record-cell td-record-center"><input v-model="item.s6NonConformingQty" class="edit-input-short" style="width: 60px;" placeholder="总数量" /></td>
            <td class="td-record-cell">
              <label class="native-checkbox-after">
                <span>破损</span>
                <input type="checkbox" v-model="item.s6DamageFlag" true-value="Y" false-value="N" />
              </label>
              ，&nbsp;&nbsp;&nbsp;&nbsp;数量 <input v-model="item.s6DamageQty" class="edit-input-short" style="width: 60px;" placeholder="数量" /> 个
            </td>
            <td :rowspan="3" class="td-record-cell">
              <label class="native-checkbox-after">
                <span>销毁</span>
                <input type="checkbox" v-model="item.s6DestroyFlag" true-value="Y" false-value="N" />
              </label>
              <br/><br/>
              <label class="native-checkbox-after">
                <span>剪毁</span>
                <input type="checkbox" v-model="item.s6ShearFailureFlag" true-value="Y" false-value="N" />
              </label>
            </td>
          </tr>
          <!-- 色差行 -->
          <tr style="height: 28px;">
            <td class="td-record-cell">
              <label class="native-checkbox-after">
                <span>色差</span>
                <input type="checkbox" v-model="item.s6ColorDifferenceFlag" true-value="Y" false-value="N" />
              </label>
              ，&nbsp;&nbsp;&nbsp;&nbsp;数量 <input v-model="item.s6ColorDifferenceQty" class="edit-input-short" style="width: 60px;" placeholder="数量" /> 个
            </td>
          </tr>
          <!-- 其他行 -->
          <tr style="height: 28px;">
            <td class="td-record-cell">
              <label class="native-checkbox-after">
                <span>其他</span>
                <input type="checkbox" v-model="item.s6OtherFlag" true-value="Y" false-value="N" />
              </label>
              ，<input v-model="item.s6OtherReason" class="edit-input-short" style="width: 60px;" placeholder="其他原因" />&nbsp;&nbsp;&nbsp;&nbsp;数量 <input v-model="item.s6OtherQty" class="edit-input-short" style="width: 60px;" placeholder="数量" /> 个
            </td>
          </tr>
        </template>
      </table>

    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const { proxy } = getCurrentInstance()
// 获取数据字典
const { receiving_material, pro_unit } = proxy.useDict('receiving_material', 'pro_unit')

const visible = ref(false)
const currentRecordId = ref(null)

/** 表单数据（由父组件 open(data) 传入） */
const form = reactive({
  recordId: null,
  orderNum: '', planCode: '', productName: '', spec: '', batchNumber: '',
  // Step5 签名及时间
  s5Operator: '', s5Reviewer: '', s5Inspector: '',
  s5OperatorTime: null, s5ReviewerTime: null, s5InspectorTime: null,
  s5OperateShowHide: '', s5ReviewShowHide: '', s5InspectShowHide: '',
  // Step5 业务字段（无开始/结束时间）
  s5MaterialName1: '', s5MaterialQty1: null,
  s5MaterialName2: '', s5MaterialQty2: null,
  s5MaterialName3: '', s5MaterialQty3: null,
  s5MaterialName4: '', s5MaterialQty4: null,
  // Step6 签名及时间
  s6Operator: '', s6Reviewer: '', s6Inspector: '',
  s6OperatorTime: null, s6ReviewerTime: null, s6InspectorTime: null,
  s6OperateShowHide: '', s6ReviewShowHide: '', s6InspectShowHide: '',
  // Step6 子表
  step6List: []
})

/** 确保 Step6 至少有 3 行 */
const paddedStep6List = computed(() => {
  const list = form.step6List || []
  if (list.length >= 3) return list
  const result = [...list]
  while (result.length < 3) result.push({})
  return result
})

/**
 * 打开对话框，接收父组件传入的完整数据
 * @param {Object} data - 详情数据（含 step6List）
 */
function open(data) {
  currentRecordId.value = data.recordId
  // 清空旧数据
  Object.keys(form).forEach(key => {
    if (key !== 'step6List') form[key] = null
  })
  // 赋值新数据
  Object.assign(form, data)
  // 确保子表至少有 3 行
  if (!form.step6List || form.step6List.length === 0) {
    form.step6List = []
    for (let i = 0; i < 3; i++) {
      form.step6List.push({
        materialName: '', unit: '', s6NonConformingQty: null,
        s6DamageFlag: '', s6DamageQty: null,
        s6ColorDifferenceFlag: '', s6ColorDifferenceQty: null,
        s6OtherFlag: '', s6OtherReason: '', s6OtherQty: null,
        s6DestroyFlag: '', s6ShearFailureFlag: ''
      })
    }
  }
  visible.value = true
}

/** Step5 提交：校验 + emit 数据给父组件处理 */
function handleSubmitStep5() {
  // 去空格
  form.s5MaterialName1 = String(form.s5MaterialName1 ?? '').replace(/\s/g, '')
  form.s5MaterialName2 = String(form.s5MaterialName2 ?? '').replace(/\s/g, '')
  form.s5MaterialName3 = String(form.s5MaterialName3 ?? '').replace(/\s/g, '')
  form.s5MaterialName4 = String(form.s5MaterialName4 ?? '').replace(/\s/g, '')
  // 物料1 名称必填（以物料1为连续填写判断依据）
  if (!form.s5MaterialName1) { proxy.$modal.msgError('物料1名称不能为空'); return }

  emit('step5Submit', {
    recordId: currentRecordId.value,
    s5MaterialName1: form.s5MaterialName1,
    s5MaterialQty1: form.s5MaterialQty1,
    s5MaterialName2: form.s5MaterialName2,
    s5MaterialQty2: form.s5MaterialQty2,
    s5MaterialName3: form.s5MaterialName3,
    s5MaterialQty3: form.s5MaterialQty3,
    s5MaterialName4: form.s5MaterialName4,
    s5MaterialQty4: form.s5MaterialQty4
  })
}

/** Step6 提交：校验 + emit 数据给父组件处理 */
function handleSubmitStep6() {
  // 子表至少一条有效记录（以 materialName 判断）
  const validItems = (form.step6List || []).filter(item => item.materialName && item.materialName.trim())
  if (validItems.length === 0) {
    proxy.$modal.msgError('请至少填写一条不合格物料记录')
    return
  }
  emit('step6Submit', {
    recordId: currentRecordId.value,
    step6List: form.step6List
  })
}

function handleClosed() {
  currentRecordId.value = null
}

function close() { visible.value = false }

const emit = defineEmits(['step5Submit', 'step6Submit', 'submit'])
defineExpose({ open, close })
</script>

<style scoped>
/* ============================================================
   容器
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
   Step5~Step6 外层单元格通用样式
   ============================================================ */
.step-table-native td {
  border: 1px solid #dcdfe6;
  padding: 1px 1px;
  vertical-align: top;
  box-sizing: border-box;
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
  cursor: pointer;
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

/* ===== 新增：可编辑组件样式 ===== */
.edit-input-short {
  width: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 2px 1px;
  font-size: 14px;
  text-align: center;
}
.edit-input-short:focus {
  background-color: #e6f7ff;
  outline: none;
}
</style>