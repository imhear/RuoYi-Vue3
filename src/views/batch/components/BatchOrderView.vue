<template>
  <el-dialog v-model="visible" title="生产任务单" width="210mm" append-to-body @closed="handleClosed">
    <div v-loading="loading" class="order-view-body">
      <template v-if="order">
        <!-- ===== 顶部标题栏：居中标题 + 右侧编号 ===== -->
        <div style="display: flex; align-items: flex-end; width: 100%; margin-bottom: 14px;">
          <h3 style="flex: 1; text-align: center; margin: 0;">灌包生产指令单</h3>
          <span style="flex-shrink: 0; font-size: 12px;">编号：{{ order.fileTemplateCode }}</span>
        </div>

        <!-- ===== 主表字段 ===== -->
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>指令单类别：</label><span>{{ order.orderType }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>生产订单号：</label><span>{{ order.customerOrderNum }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="24">
            <div class="field-item"><label>指令单说明：</label><span>{{ order.orderDesc }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>成品/半制品编码：</label><span>{{ order.productCode }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>品牌：</label><span>{{ order.brand }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>产品名称：</label><span>{{ order.productName }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>生产批号：</label><span>{{ order.batchNumber }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>规格/型号：</label><span>{{ order.spec }}</span></div>
          </el-col>
          <el-col :span="6">
            <div class="field-item"><label>计划生产数量：</label><span>{{ order.requireNum }}</span></div>
          </el-col>
          <el-col :span="6">
            <div class="field-item"><label>单位：</label><span>{{ order.unit }}</span></div>
          </el-col>
        </el-row>

        <!-- ===== 子表（BOM） ===== -->
        <el-table :data="materials" border size="small" class="bom-table"
                  :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column label="序号" prop="seqNo" min-width="38" align="center"/>
          <el-table-column label="物料二维码" min-width="78" align="left">
            <template #default="scope">
              <img v-if="scope.row.qrCodeImage" :src="scope.row.qrCodeImage" style="width: 58px; height: 58px; display: block; margin: 0 auto;" />
              <span v-else>{{ scope.row.qrCode || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料代码" prop="materialCode" min-width="88" align="left" show-overflow-tooltip/>
          <el-table-column label="名称/部件" prop="materialName" min-width="139" align="left" class-name="wrap-column"/>
          <el-table-column label="规格" prop="spec" min-width="60" align="left" class-name="wrap-column"/>
          <el-table-column label="单位" prop="unit" width="50" align="center"/>
          <el-table-column label="定额数量" width="90" align="right">
            <template #default="scope">
              {{ scope.row.quotaQty != null ? Number(scope.row.quotaQty).toFixed(6) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="总计划数量" width="90" align="right">
            <template #default="scope">
              {{ scope.row.totalQty != null ? Number(scope.row.totalQty).toFixed(2) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="80" align="left" show-overflow-tooltip/>
        </el-table>

        <!-- ===== 固定文本 ===== -->
        <div class="el-table el-table--fit el-table--border el-table--small bom-table" style="margin-top: 8px;">
          <div class="el-table__inner-wrapper">
            <table class="el-table__body" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
              <tbody>
                <tr class="el-table__row">
                  <td class="el-table__cell" style="width: 16.66%; text-align: center; vertical-align: middle;">
                    <div class="cell" style="font-size: 14px;">通用工艺要求<br/>及注意事项</div>
                  </td>
                  <td class="el-table__cell" style="width: 83.34%; vertical-align: middle; padding: 0 0 0px 4px;">
                    <div class="cell" style="font-size: 11px; padding: 0 8px 0 1px; white-space: normal; line-height: 1.8;">
                      1）内包材需要经过消毒处理才能使用；<br/>
                      2）灌装和彩盒喷码需要首件确认(灌装量、外观、位置、内容、字体、清晰度等)；<br/>
                      3）灌装温湿度要符合要求；<br/>
                      4）瓶底打码，需要首件确认(位置、内容、字体、清晰度等)；<br/>
                      5）油墨喷码，将码喷在包装记录背面，激光打码手工填写打码内容；<br/>
                      按照包装形式进行包装，过程随时检查外观、数量等。
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ===== 尾部主表字段 ===== -->
        <el-row :gutter="16" style="margin-top: 8px; margin-bottom: 7px;">
          <el-col :span="12">
            <div class="field-item"><label>制单人：</label><span>{{ order.preparedBy }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>制单日期：</label><span>{{ order.preparedTime ? parseTime(order.preparedTime, '{y}-{m}-{d}') : '' }}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-bottom: 8px;">
          <el-col :span="12">
            <div class="field-item"><label>计划生产日期：</label><span>{{ order.planStart ? parseTime(order.planStart, '{y}-{m}-{d}') : '' }} - {{ order.planEnd ? parseTime(order.planEnd, '{y}-{m}-{d}') : '' }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="field-item"><label>批准/日期：</label><span>{{ order.approvedBy || '' }} {{ order.approvedTime ? parseTime(order.approvedTime, '{y}-{m}-{d}') : '' }}</span></div>
          </el-col>
        </el-row>
      </template>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'
import { getBatchOrderDetail } from '@/api/batch/batch_order'

defineOptions({ name: 'BatchOrderView' })

const visible = ref(false)
const loading = ref(false)
const order = ref(null)
const materials = ref([])

/**
 * 打开工单详情，根据 orderId 自治加载数据
 * @param {Number} orderId 工单ID
 */
function open(orderId) {
  visible.value = true
  loading.value = true
  getBatchOrderDetail(orderId).then(async res => {
    order.value = res.data.order
    materials.value = res.data.materials || []

    // 为有 qrCode 的物料行生成二维码
    for (const item of materials.value) {
      if (item.qrCode) {
        try {
          item.qrCodeImage = await QRCode.toDataURL(item.qrCode, { width: 100, margin: 1 })
        } catch (e) {
          item.qrCodeImage = null
        }
      } else {
        item.qrCodeImage = null
      }
    }
  }).finally(() => {
    loading.value = false
  })
}

/**
 * 对话框关闭回调：清空数据
 */
function handleClosed() {
  order.value = null
  materials.value = []
}

defineExpose({ open })
</script>

<style scoped>
/* ===== 查看容器滚动：高度为父容器高度的95% ===== */
.order-view-body {
  height: 95%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 2px;
  box-sizing: border-box;
}
.order-view-body::-webkit-scrollbar {
  width: 0px;
}

/* 主表字段样式 */
.field-item {
  line-height: 1.6;
}
.field-item label {
  font-weight: bold;
  margin-right: 4px;
}

/* ===== 子表样式 ===== */
.bom-table {
  font-size: 11px;
}
.bom-table .el-table__header th .cell {
  font-size: 10px;
  text-align: center;
}
.bom-table .el-table__cell .cell {
  padding-left: 0px;
  padding-right: 0px;
}

/* 保持 scoped 隔离，不影响其他页面的表格 */
.bom-table :deep(.el-table__body tr) {
  height: 60px;
}
.bom-table :deep(.el-table__body tr td) {
  height: 60px;
  padding-top: 0;
  padding-bottom: 0;
  vertical-align: middle;
}
.wrap-column .cell {
  white-space: normal;
  word-break: break-all;
  line-height: 1.6;
}
</style>