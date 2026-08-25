<template>
  <el-drawer title="批记录结构详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联批记录ID：</label>
            <span class="info-value plaintext">
              {{ info.recordId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">冗余：发布版本ID：</label>
            <span class="info-value plaintext">
              {{ info.releaseId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">菜单名称：</label>
            <span class="info-value plaintext">
              {{ info.menuName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">父菜单ID：</label>
            <span class="info-value plaintext">
              {{ info.parentId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">显示顺序：</label>
            <span class="info-value plaintext">
              {{ info.orderNum }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前端路由地址：</label>
            <span class="info-value plaintext">
              {{ info.path }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前端组件路径：</label>
            <span class="info-value plaintext">
              {{ info.component }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">路由参数：</label>
            <span class="info-value plaintext">
              {{ info.query }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">路由名称：</label>
            <span class="info-value plaintext">
              {{ info.routeName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">是否为外链：</label>
            <span class="info-value plaintext">
              {{ info.isFrame }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">是否缓存：</label>
            <span class="info-value plaintext">
              {{ info.isCache }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">菜单类型：</label>
            <span class="info-value plaintext">
              {{ info.menuType }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">菜单状态：</label>
            <span class="info-value plaintext">
              {{ info.visible }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">节点状态：</label>
            <span class="info-value plaintext">
              {{ info.status }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">权限标识：</label>
            <span class="info-value plaintext">
              {{ info.perms }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">菜单图标：</label>
            <span class="info-value plaintext">
              {{ info.icon }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">备注：</label>
            <span class="info-value plaintext">
              {{ info.remark }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">后端接口路径：</label>
            <span class="info-value plaintext">
              {{ info.backendRoute }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物理表名：</label>
            <span class="info-value plaintext">
              {{ info.tableName }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">自定义字段预赋值：</label>
            <span class="info-value plaintext">
              {{ info.customParams }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前置运行态菜单ID：</label>
            <span class="info-value plaintext">
              {{ info.predecessorDetailId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">操作码：</label>
            <span class="info-value plaintext">
              {{ info.operationCode }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">是否在聚合入口卡片显示：</label>
            <span class="info-value plaintext">
              {{ info.operationVisible }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">业务表主键：</label>
            <span class="info-value plaintext">
              {{ info.businessRecordId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">实例日期：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.instanceDate, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">表单实例序号：</label>
            <span class="info-value plaintext">
              {{ info.instanceSeq }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">表单生成状态：</label>
            <span class="info-value plaintext">
              {{ info.instanceStatus }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">填报流程控制状态：</label>
            <span class="info-value plaintext">
              {{ info.instanceControlStatus }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">操作人：</label>
            <span class="info-value plaintext">
              {{ info.operator }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">工作单元名称：</label>
            <span class="info-value plaintext">
              {{ info.workUnitName }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">操作时间：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.operatorTime, '{y}-{m}-{d}') }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">乐观锁版本号：</label>
            <span class="info-value plaintext">
              {{ info.revision }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">系统版本号：</label>
            <span class="info-value plaintext">
              {{ info.sysVersion }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup name="Batch_record_menuViewDrawer">
import { getBatch_record_menu } from '@/api/batch/batch_record_menu'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (menuId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_record_menu(menuId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取批记录结构信息失败:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  visible.value = false
  Object.keys(info).forEach(key => delete info[key])
}

defineExpose({ open })
</script>
