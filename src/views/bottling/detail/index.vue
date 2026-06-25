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
      <el-form-item label="产品编码" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="生产批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入生产批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['bottling:detail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bottling:detail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bottling:detail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['bottling:detail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="40">
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleSchedule(scope.row)" v-if="scope.row.planQty == 0 && scope.row.status === '0'" v-hasPermi="['bottling:detail:schedule']">排产</el-button>
          <!-- <el-button link type="primary" icon="" @click="handleUpdate(scope.row)" v-hasPermi="['bottling:detail:edit']">修改</el-button> -->
          <!-- <el-button link type="primary" icon="" @click="handleDelete(scope.row)" v-hasPermi="['bottling:detail:remove']">删除</el-button> -->
        </template>
      </el-table-column>
      <!-- 工单号改为超链接，点击触发查看 -->
      <el-table-column label="工单号" align="center" min-width="131">
        <template #default="scope">
          <el-button link type="primary" @click="handleOrderView(scope.row)">{{ scope.row.orderNum }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="工单号" align="center" prop="orderNum" min-width="131"/> -->
      <el-table-column label="产品编码" align="center" prop="productCode" min-width="131"/>
      <!-- <el-table-column label="产品名称" align="center" prop="productName" /> -->
      <el-table-column label="生产批号" align="center" prop="batchNumber" />
      <el-table-column label="要求数" align="center" prop="requireNum" />
      <el-table-column label="已排数" align="center" prop="planQty" />
      <el-table-column label="已完成" align="center" prop="finishQty" />
      <el-table-column label="单位" align="center" prop="unit">
        <template #default="scope">
          <dict-tag :options="pro_unit" :value="scope.row.unit"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="bottling_order_detail_status" :value="scope.row.status"/>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 排产对话框组件 -->
    <BottlingOrderSchedule ref="scheduleRef" @submit="handleConfirmSchedule" />

    <!-- 查看工单对话框组件 -->
    <BottlingOrderView ref="orderViewRef" />

    <!-- 添加或修改罐包装生产指令单明细对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="detailRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="关联工单主键" prop="orderId">
              <el-input v-model="form.orderId" placeholder="请输入关联工单主键" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="form.brand" placeholder="请选择品牌">
                <el-option
                  v-for="dict in pro_product_brand"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格/型号" prop="spec">
              <el-select v-model="form.spec" placeholder="请选择规格/型号">
                <el-option
                  v-for="dict in pro_product_spec"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择单位">
                <el-option
                  v-for="dict in pro_unit"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产批号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划生产数量" prop="requireNum">
              <el-input v-model="form.requireNum" placeholder="请输入计划生产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已排产数量" prop="planQty">
              <el-input v-model="form.planQty" placeholder="请输入已排产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已生产完成数量" prop="finishQty">
              <el-input v-model="form.finishQty" placeholder="请输入已生产完成数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in bottling_order_detail_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

<script setup name="Detail">
import { listDetail, getDetail, delDetail, addDetail, updateDetail, scheduleDetail } from "@/api/bottling/detail"
import { getOrderDetailByNum } from "@/api/bottling/order"

// 引入排产组件
import BottlingOrderSchedule from '@/views/bottling/components/BottlingOrderSchedule.vue'
// 引入工单查看组件
import BottlingOrderView from '@/views/bottling/components/BottlingOrderView.vue'

const scheduleRef = ref(null)  // 排产组件引用
const orderViewRef = ref(null) // 查看工单组件引用

const { proxy } = getCurrentInstance()
const { pro_unit, pro_product_spec, pro_product_brand, bottling_order_detail_status } = proxy.useDict('pro_unit', 'pro_product_spec', 'pro_product_brand', 'bottling_order_detail_status')

const detailList = ref([])
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
    productCode: undefined,
    productName: undefined,
    batchNumber: undefined,
    delFlag: '0',   // 默认查询未删除的任务
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    orderId: [
      { required: true, message: "关联工单主键不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询罐包装生产指令单明细列表 */
function getList() {
  loading.value = true
  listDetail(queryParams.value).then(response => {
    detailList.value = response.rows
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
    detailId: null,
    orderId: null,
    orderNum: null,
    productCode: null,
    productName: null,
    brand: null,
    spec: null,
    unit: null,
    batchNumber: null,
    requireNum: null,
    planQty: null,
    finishQty: null,
    status: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("detailRef")
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
  ids.value = selection.map(item => item.detailId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加罐包装生产指令单明细"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _detailId = row.detailId || ids.value
  getDetail(_detailId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改罐包装生产指令单明细"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["detailRef"].validate(valid => {
    if (valid) {
      if (form.value.detailId != null) {
        updateDetail(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDetail(form.value).then(() => {
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
  const _detailIds = row.detailId || ids.value
  proxy.$modal.confirm('是否确认删除罐包装生产指令单明细编号为"' + _detailIds + '"的数据项？').then(function() {
    return delDetail(_detailIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bottling/detail/export', {
    ...queryParams.value
  }, `detail_${new Date().getTime()}.xlsx`)
}

/** 打开排产对话框 */
async function handleSchedule(row) {
  try {
    // 获取完整工单详情（含明细和BOM）
    const res = await getOrderDetailByNum(row.orderNum)
    scheduleRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

/** 排产确认：二次确认后调用后端接口 */
function handleConfirmSchedule({ detailId, batchNumber, planQty, planStart, planEnd, remark, workshopDisinfection, workshopFilling, workshopPacking }) {
  proxy.$modal.confirm('是否确认排产？本次排产数量：' + planQty).then(() => {
    return scheduleDetail(detailId, {
      batchNumber, planQty, planStart, planEnd, remark,
      workshopDisinfection, workshopFilling, workshopPacking
    })
  }).then(() => {
    proxy.$modal.msgSuccess('排产成功')
    scheduleRef.value?.close()
    getList()
  }).catch(() => {})
}

/** 查看工单详情 */
async function handleOrderView(row) {
  try {
    const res = await getOrderDetailByNum(row.orderNum)
    // viewOpen.value = true
    await nextTick()
    orderViewRef.value?.open(res.data)
  } catch (e) {
    proxy.$modal.msgError('获取工单详情失败')
  }
}

getList()
</script>
