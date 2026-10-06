<template>
  <el-drawer title="批记录操作日志详情" v-model="visible" direction="rtl" size="60%" append-to-body :before-close="handleClose" class="detail-drawer">
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
            <label class="info-label">关联批记录菜单节点ID：</label>
            <span class="info-value plaintext">
              {{ info.menuId }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="12">
          <div class="info-item">
            <label class="info-label">前端路由地址：</label>
            <span class="info-value plaintext">
              {{ info.path }}
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <!-- 标签补充"（模板）"，与下方"完整调用路径"形成对照，语义更明确 -->
            <label class="info-label">后端接口路径（模板）：</label>
            <span class="info-value plaintext">
              {{ info.backendRoute }}
            </span>
          </div>
        </el-col>
      </el-row>
      <!--
        完整调用路径：由前端根据 backendRoute 模板 + 当前日志记录的实参拼接得到。
        - 目的：便于运维/审计直接复制到 Postman 等工具复现请求
        - 不落库：仅在展示时按需计算，不新增数据库字段，不产生冗余
        - 空值字段会自动从 query 中剔除，避免出现 "?remark=" 这种残留
        - 特殊字符（中文、空格、& 等）通过 encodeURIComponent 编码，保证 URL 合法
      -->
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">完整调用路径：</label>
            <span class="info-value plaintext break-all">
              {{ resolvedBackendRoute || '-' }}
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
            <label class="info-label">操作类型：</label>
            <span class="info-value plaintext">
              {{ info.actionType }}
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
            <label class="info-label">操作时间：</label>
            <span class="info-value plaintext">
              {{ parseTime(info.actionTime, '{y}-{m}-{d}') }}
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

<script setup name="Batch_record_logViewDrawer">
import { getBatch_record_log } from '@/api/batch/batch_record_log'


const visible = ref(false)
const loading = ref(false)
const info = reactive({})

/**
 * 完整调用路径（前端按需拼接，不落库）
 *
 * 根据日志记录中已有的字段，把 backendRoute 模板中的占位符替换为实际值：
 * - {menuId} → info.menuId
 * - {cMenuId} → info.cMenuId
 * - {recordId} → info.recordId
 * - {businessRecordId} → info.businessRecordId
 * - {operationCode} → info.operationCode
 * - {tableName} → info.tableName
 * - {remark} → info.remark
 *
 * 拼接规则（四步）：
 * 1. 【空值剔除】若字段值为空，则从 query 中整体剔除对应参数
 *    例如：URL=/approve/{menuId}?remark={remark}，remark 为空时
 *    结果应为 /approve/6，而非 /approve/6?remark=
 * 2. 【有值替换】若字段值非空，使用 encodeURIComponent 编码后替换
 *    例如：remark="客户取消订单" → remark=%E5%AE%A2%E6%88%B7%E5%8F%96%E6%B6%88%E8%AE%A2%E5%8D%95
 *    编码原因：URL 中不能直接包含中文、空格、& 等特殊字符，需编码后才能被正确解析
 * 3. 【未识别占位符兜底】清理模板中未被识别的占位符（防止配置模板出现笔误）
 * 4. 【尾部收尾】清理替换后可能残留的尾部 ? 或 &
 *
 * 设计意图（对齐"方案 1"）：
 * - backend_route 字段在数据库中仍存储"模板"语义，不替换、不落库
 * - 完整 URL 仅在详情展示时按需计算，零后端改动、零表结构改动
 * - 避免三重冗余（menuId / remark 已在独立字段中存在）
 * - 避免 URL 编码问题（前端展示时按需编码，兼顾可读性与合法性）
 *
 * @returns {String} 拼接后的完整调用路径；若模板为空则返回空字符串
 */
const resolvedBackendRoute = computed(() => {
  // 模板为空，直接返回空（避免下游正则处理空值报错）
  if (!info.backendRoute) return ''

  // 从当前日志记录中提取所有可能的参数值，键名与模板中的占位符名称一一对应
  const params = {
    menuId: info.menuId,
    cMenuId: info.cMenuId,
    recordId: info.recordId,
    businessRecordId: info.businessRecordId,
    operationCode: info.operationCode,
    tableName: info.tableName,
    remark: info.remark
  }

  let url = info.backendRoute

  // 第一步：处理"空值"的占位符 —— 从 query 中剔除整个空参数
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      // 正则说明：
      //   [?&]      匹配 ? 或 &（query 参数起始符）
      //   [^=]*     匹配参数名（不含 = 的任意字符）
      //   =\{key\}  匹配 ={key} 结构
      // 整体替换为空，达到"剔除该 query 参数"的效果
      const regex = new RegExp(`[?&][^=]*=\\{${key}\\}`, 'g')
      url = url.replace(regex, '')
    }
  })

  // 第二步：替换有值占位符（路径段和 query 中的所有出现都替换）
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      url = url.replace(new RegExp(`\\{${key}\\}`, 'g'), encodeURIComponent(value))
    }
  })

  // 第三步：兜底清理未识别的占位符
  // 3.1 剔除 query 中的未识别占位符（如 "?xxx={unknown}"）
  url = url.replace(/[?&][^=]*=\{[^}]*\}/g, '')
  // 3.2 路径中的未识别占位符替换为空
  url = url.replace(/\{[^}]*\}/g, '')

  // 第四步：清理尾部残留的 ? 或 &
  url = url.replace(/[?&]$/, '')

  return url
})

const open = async (logId) => {
  visible.value = true
  loading.value = true
  try {
    const res = await getBatch_record_log(logId)
    Object.assign(info, res.data || {})
  } catch (error) {
    console.error('获取批记录操作日志信息失败:', error)
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

<style scoped>
/* 长 URL 允许在任意字符处断行，避免撑破抽屉宽度
 * 用于"完整调用路径"字段展示（路径 + query 参数可能很长）
 */
.break-all {
  word-break: break-all;
}
</style>