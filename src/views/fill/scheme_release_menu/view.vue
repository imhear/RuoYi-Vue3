<template>
  <el-drawer title="菜单权限发布态详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">关联发布版本ID：</label>
            <span class="info-value plaintext">
              {{ info.releaseId }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">所属方案ID：</label>
            <span class="info-value plaintext">
              {{ info.schemeId }}
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
              <dict-tag :options="sys_show_hide" :value="info.visible" />
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">菜单状态：</label>
            <span class="info-value plaintext">
              <dict-tag :options="sys_normal_disable" :value="info.status" />
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
            <label class="info-label">目录类型编码：</label>
            <span class="info-value plaintext">
              {{ info.typeCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">物理表名：</label>
            <span class="info-value plaintext">
              {{ info.tableName }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">自定义字段预赋值：</label>
            <span class="info-value plaintext">
              {{ info.customParams }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前置发布态菜单ID：</label>
            <span class="info-value plaintext">
              {{ info.predecessorDetailId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">操作码：</label>
            <span class="info-value plaintext">
              {{ info.operationCode }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">是否在聚合入口卡片显示：</label>
            <span class="info-value plaintext">
              <dict-tag :options="sys_show_hide" :value="info.operationVisible" />
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup name="Scheme_release_menuViewDrawer">
import { getScheme_release_menu } from '@/api/fill/scheme_release_menu'

const { sys_normal_disable, sys_show_hide } = useDict('sys_normal_disable', 'sys_show_hide')

const visible = ref(false)
const loading = ref(false)
const info = reactive({})

const open = async (menuId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getScheme_release_menu(menuId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取菜单权限发布态信息失败:', error)
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
