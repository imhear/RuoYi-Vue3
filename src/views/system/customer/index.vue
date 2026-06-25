<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户姓名" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户生日" prop="birthday">
        <el-date-picker clearable
          v-model="queryParams.birthday"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择客户生日">
        </el-date-picker>
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
          v-hasPermi="['system:customer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:customer:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:customer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:customer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户id" align="center" prop="customerId" />
      <el-table-column label="客户姓名" align="center" prop="customerName" />
      <el-table-column label="手机号码" align="center" prop="phonenumber" />
      <el-table-column label="客户性别" align="center" prop="sex" />
      <el-table-column label="客户生日" align="center" prop="birthday" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:customer:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:customer:remove']">删除</el-button>
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

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="customerRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户生日" prop="birthday">
              <el-date-picker clearable
                v-model="form.birthday"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择客户生日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批记录类型" prop="batchType">
              <el-select v-model="form.batchType" placeholder="请选择批记录类型" :disabled="title === '修改客户'">
                <el-option label="水" value="a" />
                <el-option label="乳" value="b" />
                <el-option label="霜" value="c" />
                <el-option label="面膜" value="d" />
                <el-option label="精华液" value="e" />
                <el-option label="冻干粉" value="f" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户描述" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 编辑模式下才显示子表 -->
        <template v-if="title === '修改客户'">
          <!-- 子表1：商品信息（只读展示） -->
          <el-divider content-position="center">灌装生产记录</el-divider>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="Plus" @click="handleAddSysGoods">添加</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" icon="Delete" @click="handleDeleteSysGoods">删除</el-button>
            </el-col>
          </el-row>
          <el-table :data="sysGoodsList" @selection-change="handleSysGoodsSelectionChange" ref="sysGoods">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name" width="150" />
            <el-table-column label="灌装开始时间" prop="fillingStartTime" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.fillingStartTime, '{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="灌装结束时间" prop="fillingEndTime" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.fillingEndTime, '{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="商品时间" prop="date" width="240">
              <template #default="scope">
                <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品种类" prop="type" width="150" /> -->
            <el-table-column label="操作" align="center" width="150" fixed="right">
              <template #default="scope">
                <div style="white-space: nowrap;">
                  <el-button link type="primary" icon="Edit" @click="handleEditSysGoods(scope.row)">修改</el-button>
                  <el-button link type="primary" icon="Delete" @click="handleDeleteSysGoodsRow(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 子表2：商品信息2 -->
          <el-divider content-position="center">商品信息2</el-divider>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="Plus" @click="handleAddSysGoods2">添加</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" icon="Delete" @click="handleDeleteSysGoods2">删除</el-button>
            </el-col>
          </el-row>
          <el-table :data="sysGoods2List" @selection-change="handleSysGoods2SelectionChange" ref="sysGoods2">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.name" placeholder="请输入商品名称" />
              </template>
            </el-table-column>
            <el-table-column label="商品重量" prop="weight" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.weight" placeholder="请输入商品重量" />
              </template>
            </el-table-column>
            <el-table-column label="商品价格" prop="price" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.price" placeholder="请输入商品价格" />
              </template>
            </el-table-column>
            <el-table-column label="商品时间" prop="date" width="240">
              <template #default="scope">
                <el-date-picker clearable
                  v-model="scope.row.date"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择商品时间">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="商品种类" prop="type" width="150">
              <template #default="scope">
                <el-select v-model="scope.row.type" placeholder="请选择商品种类">
                  <el-option label="请选择字典生成" value="" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="编辑" align="center" width="80" fixed="right">
              <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="handleEditSysGoods2(scope.row, scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form>

      <!-- 子表2编辑对话框 -->
      <el-dialog
        :title="'编辑商品2 - ' + (editingGoods2.name || '')"
        v-model="goods2EditOpen"
        width="500px"
        append-to-body
      >
        <el-form ref="goods2EditRef" :model="editingGoods2" label-width="100px">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="editingGoods2.name" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="商品重量" prop="weight">
            <el-input v-model="editingGoods2.weight" placeholder="请输入商品重量" />
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model="editingGoods2.price" placeholder="请输入商品价格" />
          </el-form-item>
          <el-form-item label="商品时间" prop="date">
            <el-date-picker
              v-model="editingGoods2.date"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择商品时间"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="商品种类" prop="type">
            <el-select v-model="editingGoods2.type" placeholder="请选择商品种类" style="width: 100%">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="goods2EditOpen = false">取 消</el-button>
          <el-button type="primary" @click="submitEditGoods2">确 定</el-button>
        </template>
      </el-dialog>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 子表1编辑侧边抽屉 -->
    <el-drawer
      :title="'编辑商品 - ' + (currentGoods.name || '')"
      v-model="goodsDrawerVisible"
      direction="rtl"
      size="1100px"
      :close-on-press-escape="false"
      :wrapperClosable="false"
    >
      <el-form ref="goodsFormRef" :model="currentGoods" label-width="100px">
        <el-form-item label="灌装开始时间" prop="fillingStartTime">
          <el-date-picker
            v-model="currentGoods.fillingStartTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择灌装开始时间"
            style="width: 100%"
            disabled
          />
        </el-form-item>
        <el-form-item label="灌装结束时间" prop="fillingEndTime">
          <el-date-picker
            v-model="currentGoods.fillingEndTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择灌装结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="currentGoods.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品重量" prop="weight">
          <el-input v-model="currentGoods.weight" placeholder="请输入商品重量" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="currentGoods.price" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="商品时间" prop="date">
          <el-date-picker
            v-model="currentGoods.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择商品时间"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item label="商品种类" prop="type">
          <el-select v-model="currentGoods.type" placeholder="请选择商品种类" style="width: 100%">
            <el-option label="类型1" value="1" />
            <el-option label="类型2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="currentGoods.createTime" disabled />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="currentGoods.updateTime" disabled />
        </el-form-item>

        <!-- 移动到此处：子表字段的保存/取消按钮 -->
        <div style="text-align: center; margin-bottom: 15px;">
          <el-button @click="goodsDrawerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitGoodsDetail">保 存</el-button>
        </div>
      </el-form>



<!-- 设置灌装开始时间对话框 -->
<el-dialog
  v-model="showFillingStartTimeDialog"
  title="设置灌装开始时间"
  width="400px"
  append-to-body
  :close-on-click-modal="false"
  @closed="handleFillingDialogClosed"
>
  <el-form label-width="100px">
    <el-form-item label="灌装开始时间">
      <el-date-picker
        v-model="tempFillingStartTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择灌装开始时间"
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button @click="cancelFillingStartTime">取 消</el-button>
    <el-button type="primary" @click="confirmFillingStartTime">确 定</el-button>
  </template>
</el-dialog>


      <!-- 灌装量记录（孙表+曾孙表） -->
      <template v-if="currentGoods.fillingMainList && currentGoods.fillingMainList.length > 0">
        <el-divider content-position="left">灌装量记录</el-divider>
        <table class="filling-table">
          <thead>
            <tr>
              <td rowspan="2" style="width:90px;">项目</td>
              <td colspan="13" style="text-align:center;">（灌装量记录）灌装头编号</td>
              <td rowspan="2" style="width:200px;">审计</td>   <!-- 新增审计列表头 -->
              <td rowspan="2" style="width:70px;">操作</td>   <!-- 新增操作列表头 -->
            </tr>
            <tr>
              <td style="width:100px;">时间</td>
              <td v-for="n in 12" :key="n" style="width:80px;">{{ n }}</td>
            </tr>
          </thead>
          <tbody>
            <template v-for="(main, mIndex) in currentGoods.fillingMainList" :key="main.mainId || mIndex">
              <!-- 判断该行是否已检查通过 -->
              <tr>
                <td rowspan="1">装量</td>
                <td rowspan="2" style="width:100px;">
                  <!-- 已检查：纯文本；未检查：日期选择器 -->
                  <template v-if="main.inspector && main.inspectTime">
                    {{ main.sampleTime.substring(0, 5) }}
                  </template>
                  <!-- 未检查：可编辑 -->
                  <template v-else>
                    <el-time-picker
                      v-model="main.sampleTime"
                      value-format="HH:mm:ss"
                      placeholder="取样时间"
                      size="small"
                      style="width:100%"
                    />
                  </template>
                </td>
                <td v-for="n in 12" :key="'w'+n">
                  <!-- 已检查：纯文本；未检查：输入框 -->
                  <template v-if="main.inspector && main.inspectTime">
                    {{ main.subList && main.subList[n-1] ? main.subList[n-1].fillingWeight : '' }}
                  </template>
                  <el-input
                    v-else
                    v-if="main.subList && main.subList[n-1]"
                    v-model="main.subList[n-1].fillingWeight"
                    size="small"
                    placeholder="装量"
                  />
                </td>
                <!-- 审计列（始终显示，纯文本） -->
                <td rowspan="2" style="vertical-align: middle; white-space: pre-wrap; font-size: 12px;">
                  <template v-if="main.updateBy || main.reviewer || main.inspector">
                    操作人：{{ main.updateBy }}<br/>
                    复核人：{{ main.reviewer }}<br/>
                    检查人：{{ main.inspector }}
                  </template>
                </td>
                <!-- 操作列 -->
                <td rowspan="2" style="vertical-align: middle; white-space: nowrap;">
                  <!-- 已检查：操作按钮全部隐藏；未检查：显示按钮 -->
                  <template v-if="main.inspector && main.inspectTime">
                    <span style="color: #67c23a;">已检查通过</span>
                  </template>
                  <template v-else>
                    <el-button type="primary" size="small" @click="handleSaveFilling(main)">保存</el-button>
                    <el-button type="success" size="small" @click="handleReviewFilling(main)">复核</el-button>
                    <el-button type="warning" size="small" @click="handleInspectFilling(main)">检查</el-button>
                  </template>
                </td>
              </tr>
              <tr>
                <td rowspan="1">外观</td>
                <td v-for="n in 12" :key="'a'+n">
                  <!-- 已检查：纯文本；未检查：输入框 -->
                  <template v-if="main.inspector && main.inspectTime">
                    {{ main.subList && main.subList[n-1] ? main.subList[n-1].appearance : '' }}
                  </template>
                  <el-input
                    v-else
                    v-if="main.subList && main.subList[n-1]"
                    v-model="main.subList[n-1].appearance"
                    size="small"
                    placeholder="外观"
                  />
                </td>
              </tr>
            </template>
          </tbody>

 
        </table>
      </template>

      <!-- <div class="drawer-footer">
        <el-button @click="goodsDrawerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGoodsDetail">保 存</el-button>
      </div> -->
    </el-drawer>
  </div>
</template>

<script setup name="Customer">
import {
  listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer,
  updateSysGoods2, getSysGoods, updateSysGoodsDetail, createEmptyGoods, delSysGoods,
  getFillingRecords, updateFillingRecords
} from "@/api/system/customer"

const { proxy } = getCurrentInstance()

const customerList = ref([])
const sysGoodsList = ref([])
const sysGoods2List = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const checkedSysGoods = ref([])
const checkedSysGoods2 = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 子表2编辑对话框状态
const goods2EditOpen = ref(false)
const editingGoods2Index = ref(-1)
const editingGoods2 = reactive({
  goodsId: null,
  name: '',
  weight: '',
  price: '',
  date: '',
  type: ''
})
const goods2EditRef = ref(null)

// 子表1侧边抽屉状态
const goodsDrawerVisible = ref(false)
const currentGoods = reactive({
  goodsId: null,
  name: '',
  weight: '',
  price: '',
  date: '',
  type: '',
  createTime: '',
  updateTime: '',
  fillingStartTime: null,  // 新增
  fillingEndTime: null,    // 新增
  sysGoodsSonList: [],
  fillingMainList: []
})
const goodsFormRef = ref(null)
const checkedSons = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerName: undefined,
    phonenumber: undefined,
    sex: undefined,
    birthday: undefined,
  },
  rules: {
    batchType: [
      { required: true, message: '批记录类型不能为空', trigger: 'change' }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listCustomer(queryParams.value).then(response => {
    customerList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    customerId: null,
    customerName: null,
    phonenumber: null,
    sex: null,
    birthday: null,
    remark: null
  }
  sysGoodsList.value = []
  sysGoods2List.value = []
  proxy.resetForm("customerRef")
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.customerId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = "添加客户"
}

function handleUpdate(row) {
  reset()
  const _customerId = row.customerId || ids.value
  getCustomer(_customerId).then(response => {
    form.value = response.data
    sysGoodsList.value = response.data.sysGoodsList
    sysGoods2List.value = response.data.sysGoods2List
    open.value = true
    title.value = "修改客户"
  })
}

function submitForm() {
  proxy.$refs["customerRef"].validate(valid => {
    if (valid) {
      form.value.sysGoodsList = []
      form.value.sysGoods2List = []
      if (form.value.customerId != null) {
        updateCustomer(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCustomer(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

function handleDelete(row) {
  const _customerIds = row.customerId || ids.value
  proxy.$modal.confirm('是否确认删除客户编号为"' + _customerIds + '"的数据项？').then(function() {
    return delCustomer(_customerIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

async function handleAddSysGoods() {
  if (!form.value.customerId) {
    proxy.$modal.msgError("请先保存主表后再添加商品")
    return
  }
  proxy.$modal.confirm('是否确认新增一条商品信息？').then(async () => {
    try {
      const res = await createEmptyGoods(form.value.customerId)
      sysGoodsList.value.push(res.data)
      proxy.$modal.msgSuccess("新增商品行成功")
    } catch (e) {
      proxy.$modal.msgError("新增商品失败")
    }
  }).catch(() => {})
}

function handleDeleteSysGoodsRow(row) {
  proxy.$modal.confirm('是否确认删除商品编号为"' + row.goodsId + '"的数据项？').then(() => {
    return delSysGoods(row.goodsId)
  }).then(() => {
    const index = sysGoodsList.value.findIndex(item => item.goodsId === row.goodsId)
    if (index > -1) {
      sysGoodsList.value.splice(index, 1)
    }
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

function handleDeleteSysGoods() {
  if (checkedSysGoods.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的商品数据")
  } else {
    const sysGoodss = sysGoodsList.value
    const checkedSysGoodss = checkedSysGoods.value
    sysGoodsList.value = sysGoodss.filter(function(item) {
      return checkedSysGoodss.indexOf(item.index) == -1
    })
  }
}

function handleSysGoodsSelectionChange(selection) {
  checkedSysGoods.value = selection.map(item => item.index)
}

// 获取模拟灌装数据（后端接口尚未实现时的临时方案）
function getMockFillingData(goodsId) {
  const mainList = []
  for (let i = 0; i < 4; i++) {
    const main = {
      mainId: null,
      goodsId: goodsId,
      sampleTime: null,
      nozzleNo: null,
      reviewer: '',
      reviewTime: null,
      inspector: '',
      inspectTime: null,
      subList: []
    }
    for (let j = 1; j <= 12; j++) {
      main.subList.push({
        subId: null,
        parentId: null,
        sampleNo: j,
        fillingWeight: null,
        appearance: ''
      })
    }
    mainList.push(main)
  }
  return mainList
}

async function handleEditSysGoods(row) {
  if (row.goodsId) {
    try {
      const res = await getSysGoods(row.goodsId)
      const goodsData = res.data
      Object.assign(currentGoods, {
        goodsId: goodsData.goodsId,
        name: goodsData.name,
        weight: goodsData.weight,
        price: goodsData.price,
        date: goodsData.date,
        type: goodsData.type,
        createTime: goodsData.createTime,
        updateTime: goodsData.updateTime,
        fillingStartTime: goodsData.fillingStartTime, // 新增
        fillingEndTime: goodsData.fillingEndTime,     // 新增
        sysGoodsSonList: goodsData.sysGoodsSonList || [],
        fillingMainList: []
      })
      // 尝试加载真实灌装记录，若接口不存在则用模拟数据
      try {
        const fillingRes = await getFillingRecords(row.goodsId)
        currentGoods.fillingMainList = fillingRes.data || []
      } catch (e) {
        currentGoods.fillingMainList = getMockFillingData(row.goodsId)
      }
    } catch (e) {
      proxy.$modal.msgError('获取商品详情失败')
      return
    }
  } else {
    proxy.$modal.msgWarning('请先保存客户主表生成商品记录后再编辑')
    return
  }
  goodsDrawerVisible.value = true

  // 如果灌装开始时间为空，自动弹出设置对话框
  if (!currentGoods.fillingStartTime) {
    showFillingStartTimeDialog.value = true
  }
}

function addSonRow() { /* 废弃 */ }
function deleteSonRows() { /* 废弃 */ }
function handleSonSelectionChange() { /* 废弃 */ }

async function submitGoodsDetail() {
  if (!currentGoods.name) {
    proxy.$modal.msgError('请输入商品名称')
    return
  }
  try {
    // 1. 始终先保存商品基本字段
    await updateSysGoodsDetail(currentGoods)
    
    // 2. 如果存在灌装记录，再单独保存灌装记录
    if (currentGoods.fillingMainList && currentGoods.fillingMainList.length > 0) {
      await updateFillingRecords({
        goodsId: currentGoods.goodsId,
        fillingMainList: currentGoods.fillingMainList
      })
    }
    
    proxy.$modal.msgSuccess('保存成功')
    goodsDrawerVisible.value = false
    
    // 刷新主表商品列表
    if (open.value && form.value.customerId) {
      const res = await getCustomer(form.value.customerId)
      form.value = res.data
      sysGoodsList.value = res.data.sysGoodsList
      sysGoods2List.value = res.data.sysGoods2List
    }
  } catch (e) {
    proxy.$modal.msgError('保存失败')
  }
}

// async function submitGoodsDetail() {
//   if (!currentGoods.name) {
//     proxy.$modal.msgError('请输入商品名称')
//     return
//   }
//   try {
//     // 存在灌装记录则走灌装保存
//     if (currentGoods.fillingMainList && currentGoods.fillingMainList.length > 0) {
//       await updateFillingRecords({
//         goodsId: currentGoods.goodsId,
//         fillingMainList: currentGoods.fillingMainList
//       })
//       proxy.$modal.msgSuccess('灌装记录保存成功')
//     } else {
//       await updateSysGoodsDetail(currentGoods)
//       proxy.$modal.msgSuccess('商品信息保存成功')
//     }
//     goodsDrawerVisible.value = false
//     if (open.value && form.value.customerId) {
//       const res = await getCustomer(form.value.customerId)
//       form.value = res.data
//       sysGoodsList.value = res.data.sysGoodsList
//       sysGoods2List.value = res.data.sysGoods2List
//     }
//   } catch (e) {
//     proxy.$modal.msgError('保存失败')
//   }
// }

function handleAddSysGoods2() {
  let obj = {}
  obj.name = undefined
  obj.weight = undefined
  obj.price = undefined
  obj.date = undefined
  obj.type = undefined
  sysGoods2List.value.push(obj)
}

function handleDeleteSysGoods2() {
  if (checkedSysGoods2.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的商品2数据")
  } else {
    const sysGoods2s = sysGoods2List.value
    const checkedSysGoods2s = checkedSysGoods2.value
    sysGoods2List.value = sysGoods2s.filter(function(item) {
      return checkedSysGoods2s.indexOf(item.index) == -1
    })
  }
}

function handleSysGoods2SelectionChange(selection) {
  checkedSysGoods2.value = selection.map(item => item.index)
}

function handleEditSysGoods2(row, index) {
  editingGoods2Index.value = index
  Object.assign(editingGoods2, {
    goodsId: row.goodsId,
    name: row.name,
    weight: row.weight,
    price: row.price,
    date: row.date,
    type: row.type
  })
  goods2EditOpen.value = true
}

function submitEditGoods2() {
  const index = editingGoods2Index.value
  if (index < 0 || index >= sysGoods2List.value.length) {
    goods2EditOpen.value = false
    return
  }
  if (editingGoods2.goodsId) {
    updateSysGoods2(editingGoods2).then(() => {
      Object.assign(sysGoods2List.value[index], editingGoods2)
      proxy.$modal.msgSuccess('商品2信息已更新')
      goods2EditOpen.value = false
    }).catch(() => {
      proxy.$modal.msgError('更新失败，请重试')
    })
  } else {
    Object.assign(sysGoods2List.value[index], editingGoods2)
    proxy.$modal.msgSuccess('商品2信息已暂存（保存客户时一并提交）')
    goods2EditOpen.value = false
  }
}

function handleExport() {
  proxy.download('system/customer/export', {
    ...queryParams.value
  }, `customer_${new Date().getTime()}.xlsx`)
}

// 导入新增的 API 方法
import { saveFillingMain, reviewFillingMain, inspectFillingMain } from "@/api/system/customer"

/**
 * 保存单个时间点的灌装记录
 */
function handleSaveFilling(main) {
  proxy.$modal.confirm('是否确认保存当前时点灌装量记录？').then(() => {
    return saveFillingMain(main.mainId, main)
  }).then(() => {
    proxy.$modal.msgSuccess("保存成功")
    // 保存成功后刷新当前商品灌装记录，保证前端显示与数据库一致
    refreshFillingRecords()
  }).catch(() => {})
}

/**
 * 复核当前时间点的灌装记录
 */
function handleReviewFilling(main) {
  proxy.$modal.confirm('是否确认“复核”通过当前时点灌装量记录？').then(() => {
    return reviewFillingMain(main.mainId)
  }).then(() => {
    proxy.$modal.msgSuccess("复核成功")
    // 复核成功后刷新当前商品灌装记录，保证前端显示与数据库一致
    refreshFillingRecords()
  }).catch(() => {})
}

/**
 * 检查当前时间点的灌装记录
 */
function handleInspectFilling(main) {
  proxy.$modal.confirm('是否确认“检查”通过当前时点灌装量记录？').then(() => {
    return inspectFillingMain(main.mainId)
  }).then(() => {
    proxy.$modal.msgSuccess("复核成功")
    // 复核成功后刷新当前商品灌装记录，保证前端显示与数据库一致
    refreshFillingRecords()
  }).catch(() => {})
}

/**
 * 刷新灌装记录（从后端重新加载当前商品的全部灌装数据）
 */
async function refreshFillingRecords() {
  if (!currentGoods.goodsId) return
  try {
    const res = await getFillingRecords(currentGoods.goodsId)
    currentGoods.fillingMainList = res.data || []
  } catch (e) {
    // 非关键错误，静默处理
  }
}


// 导入新增 API
import { setFillingStartTime } from "@/api/system/customer"

// 新增状态
const showFillingStartTimeDialog = ref(false)
const tempFillingStartTime = ref(null)

/**
 * 确认设置灌装开始时间
 */
async function confirmFillingStartTime() {
  if (!tempFillingStartTime.value) {
    proxy.$modal.msgError('请选择灌装开始时间')
    return
  }
  try {
    const res = await setFillingStartTime(currentGoods.goodsId, {
      fillingStartTime: tempFillingStartTime.value
    })
    // 更新 currentGoods 的灌装开始时间（回显只读）
    currentGoods.fillingStartTime = res.data?.fillingStartTime || tempFillingStartTime.value
    // 联动刷新灌装量记录（取样日期已更新）
    await refreshFillingRecords()
    proxy.$modal.msgSuccess('灌装开始时间设置成功')
    showFillingStartTimeDialog.value = false
  } catch (e) {
    proxy.$modal.msgError('设置失败，可能已存在灌装开始时间')
  }
}

/**
 * 取消设置灌装开始时间，关闭对话框和抽屉
 */
function cancelFillingStartTime() {
  showFillingStartTimeDialog.value = false
  goodsDrawerVisible.value = false  // 直接关闭抽屉
}

/**
 * 对话框关闭后的回调（适用于点击右上角X、ESC等方式）
 * 如果灌装开始时间仍未设置，则关闭抽屉
 */
function handleFillingDialogClosed() {
  if (!currentGoods.fillingStartTime) {
    goodsDrawerVisible.value = false
  }
}

/**
 * 监听抽屉关闭事件，刷新主表编辑界面数据
 * 确保在抽屉中设置灌装开始时间后，主表子表表格能同步更新
 */
watch(goodsDrawerVisible, (newVal) => {
  if (!newVal && open.value && form.value.customerId) {
    // 抽屉关闭且主表编辑对话框打开时，重新加载客户详情以刷新子表数据
    getCustomer(form.value.customerId).then(response => {
      form.value = response.data
      sysGoodsList.value = response.data.sysGoodsList
      sysGoods2List.value = response.data.sysGoods2List
    })
  }
})

getList()
</script>

<style scoped>
/* .drawer-footer {
  padding: 10px;
  text-align: right;
  background: #fff;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
} */
.filling-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.filling-table td, .filling-table th {
  border: 1px solid #dcdfe6;
  padding: 4px 2px;
  text-align: center;
  font-size: 13px;
}
.filling-table .label-cell {
  font-weight: bold;
  background-color: #f5f7fa;
}
</style>