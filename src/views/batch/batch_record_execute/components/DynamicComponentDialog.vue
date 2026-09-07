<template>
  <el-dialog
    v-model="visible"
    :title="currentTitle"
    width="80%"
    top="5vh"
    append-to-body
    :fullscreen="isFullscreen"
    :before-close="handleBeforeClose"
    @closed="handleClosed"
  >
    <template #header>
      <div style="display: flex; align-items: center; width: 300mm;">
        <span style="flex: 1; font-size: 18px; font-weight: bold;">{{ currentTitle }}</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon style="cursor: pointer; font-size: 18px;" @click="isFullscreen = !isFullscreen">
            <FullScreen v-if="!isFullscreen" /><Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <!--
      使用 v-loading 手动控制加载遮罩。
      当 componentLoading 为 true 时显示遮罩，并显示加载文字。
      遮罩完全由我们控制，不受 Vue 异步组件内部优化影响，
      因此每次打开都会显示，直到组件加载完成。
    -->
    <div
      v-loading="componentLoading"
      element-loading-text="组件加载中，请稍候..."
      element-loading-background="rgba(255, 255, 255, 0.85)"
      class="dynamic-component-container"
    >
      <!--
        当前组件只有在 componentLoading 为 false 时才渲染，
        避免加载过程中出现内容闪动。
      -->
      <component
        v-if="currentComponent && !componentLoading"
        :is="currentComponent"
        v-bind="componentProps"
        @closed="visible = false"
        @refresh="handleRefresh"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FullScreen, Aim } from '@element-plus/icons-vue'

defineOptions({ name: 'DynamicComponentDialog' })

const emit = defineEmits(['refresh'])

const modules = import.meta.glob('/src/views/**/*.vue')

const visible = ref(false)
const isFullscreen = ref(false)
const componentLoading = ref(false)
const currentComponent = shallowRef(null)
const currentTitle = ref('操作')
const componentProps = ref({})

/**
 * 打开动态组件弹窗
 *
 * @param {Object} params 参数对象
 * @param {String} params.component      组件相对路径
 * @param {Number} params.recordId       批记录ID
 * @param {Number} params.menuId         按钮节点ID（F节点）
 * @param {Number} params.businessRecordId 业务记录ID
 * @param {String} params.operationCode  操作码
 * @param {String} params.backendRoute   后端接口路径
 * @param {String} params.tableName      物理表名
 * @param {String} params.menuName       菜单名称（按钮节点名称）
 * @param {String} params.buttonLabel    按钮标签
 * @param {String} params.actionType     操作类型（大写：PREVIEW/EDIT/SUBMIT等）
 */
async function open(params) {
  const componentPath = params.component.replace(/^\/+/, '')
  const fullPath = '/src/views/' + componentPath
  const loader = modules[fullPath]

  if (!loader) {
    ElMessage.warning('前端组件未找到：' + componentPath)
    return
  }

  componentProps.value = {
    actionType: params.actionType || 'APPROVE',   // 默认为 APPROVE，兼容旧逻辑（实际应传大写）
    recordId: params.recordId,
    menuId: params.menuId,
    businessRecordId: params.businessRecordId,
    operationCode: params.operationCode,
    backendRoute: params.backendRoute,
    tableName: params.tableName,
    menuName: params.menuName || '',
    buttonLabel: params.buttonLabel || ''
  }

  currentTitle.value = `操作 - ${params.buttonLabel || params.operationCode}`
  componentLoading.value = true
  visible.value = true

  try {
    const module = await loader()
    currentComponent.value = module.default || module
    componentLoading.value = false
  } catch (error) {
    componentLoading.value = false
    ElMessage.error('组件加载失败，请重试')
    console.error('动态组件加载失败:', error)
  }
}

/**
 * 关闭前拦截：二次确认
 */
function handleBeforeClose(done) {
  ElMessageBox.confirm('确定要关闭吗？未保存的修改将丢失。', '提示', {
    confirmButtonText: '确定关闭',
    cancelButtonText: '继续编辑',
    type: 'warning',
    distinguishCancelAndClose: true,
    closeOnClickModal: false,
    closeOnPressEscape: false
  })
    .then(() => done())
    .catch(() => {})
}

/**
 * 子组件触发刷新事件
 */
function handleRefresh() {
  emit('refresh')
}

/**
 * 对话框关闭回调
 */
function handleClosed() {
  currentComponent.value = null
  componentProps.value = {}
  componentLoading.value = false
}

defineExpose({ open })
</script>

<style scoped>
/*
 * 动态组件容器：
 * 设置最小高度，并相对定位以便 v-loading 遮罩覆盖整个区域。
 */
.dynamic-component-container {
  min-height: 400px;
  position: relative;
}
</style>