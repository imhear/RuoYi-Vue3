<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="设备编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入设备编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="工作单元" prop="workUnitId">
        <el-select v-model="queryParams.workUnitId" placeholder="请选择工作单元" clearable style="width: 200px">
          <el-option v-for="wu in workUnitOptions" :key="wu.id" :label="wu.name" :value="wu.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型" clearable style="width: 160px">
          <el-option v-for="d in biz_device_type" :key="d.value" :label="d.label" :value="d.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
          <el-option v-for="d in sys_normal_disable" :key="d.value" :label="d.label" :value="d.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['basic:device:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['basic:device:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['basic:device:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['basic:device:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编码" align="center" prop="code" width="140" />
      <el-table-column label="设备名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="工作单元" align="center" width="160">
        <template #default="scope">
          {{ getWorkUnitName(scope.row.workUnitId) }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" width="120">
        <template #default="scope">
          <dict-tag :options="biz_device_type" :value="scope.row.deviceType" />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum" width="80" />
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['basic:device:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['basic:device:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增或修改设备对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="deviceRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入设备编码（沿用线下真实编码）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作单元" prop="workUnitId">
              <el-select v-model="form.workUnitId" placeholder="请选择工作单元" style="width: 100%" clearable>
                <el-option v-for="wu in workUnitOptions" :key="wu.id" :label="wu.name" :value="wu.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width: 100%" clearable>
                <el-option v-for="d in biz_device_type" :key="d.value" :label="d.label" :value="d.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="d in sys_normal_disable" :key="d.value" :value="d.value">{{ d.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BasicDevice">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from '@/api/basic/device'
import { listWork_unit } from '@/api/basic/work_unit'
import { useBizDict } from '@/utils/bizDict'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = useDict('sys_normal_disable')
const { biz_device_type } = useBizDict('biz_device_type')

const deviceList = ref([])
const workUnitOptions = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: undefined,
    name: undefined,
    workUnitId: undefined,
    deviceType: undefined,
    status: undefined
  },
  rules: {
    code: [{ required: true, message: '设备编码不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listDevice(queryParams.value).then(response => {
    deviceList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function getWorkUnitOptions() {
  listWork_unit({ pageNum: 1, pageSize: 100 }).then(response => {
    workUnitOptions.value = response.rows || []
  })
}

function getWorkUnitName(workUnitId) {
  if (!workUnitId) return ''
  const wu = workUnitOptions.value.find(o => o.id === workUnitId)
  return wu ? wu.name : ''
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    id: null,
    code: null,
    name: null,
    workUnitId: null,
    deviceType: null,
    orderNum: 0,
    status: '0',
    remark: null
  }
  proxy.resetForm('deviceRef')
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '添加设备'
}

function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getDevice(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改设备'
  })
}

function submitForm() {
  proxy.$refs['deviceRef'].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDevice(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addDevice(form.value).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除设备编号为"' + _ids + '"的数据项？').then(() => {
    return delDevice(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

function handleExport() {
  proxy.download('basic/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getWorkUnitOptions()
  getList()
})
</script>