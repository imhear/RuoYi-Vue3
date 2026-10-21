<template>
  <el-dialog
    v-model="visible"
    width="80%"
    top="5vh"
    append-to-body
    :fullscreen="isFullscreen"
    :before-close="handleBeforeClose"
    @closed="handleClosed"
    class="dynamic-component-dialog"
  >
    <!--
      【v1.6 改造】删除自定义 #header 插槽，改用 Element Plus 默认 header：
      - 保留默认 X 按钮（作为关闭通道）
      - 标题文本置空（不显示 title），减少视觉干扰
      - 全屏按钮移除（改由 Form.vue 内的 form-action-bar 承载，
        通过 provide/inject 调用父组件的 toggleFullscreen 接口）
    -->
    <div
      v-loading="componentLoading"
      element-loading-text="组件加载中，请稍候..."
      element-loading-background="rgba(255, 255, 255, 0.85)"
      class="dynamic-component-container"
    >
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
import { ref, shallowRef, provide } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 全屏图标改用 svg-icon（fullscreen / exit-fullscreen），
// 本组件未使用 @element-plus/icons-vue 的其他图标，故整行 import 移除

defineOptions({ name: 'DynamicComponentDialog' })

const emit = defineEmits(['refresh'])

const modules = import.meta.glob('/src/views/**/*.vue')

const visible = ref(false)
const isFullscreen = ref(false)
const componentLoading = ref(false)
const currentComponent = shallowRef(null)
const componentProps = ref({})

/**
 * 【v1.6 新增】全屏切换接口
 *
 * 语义：将 isFullscreen 取反，控制 el-dialog 的 :fullscreen 属性
 * 调用来源：Form.vue 内 form-action-bar 中的全屏按钮（通过 inject 获取上下文后调用）
 */
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

/**
 * 【v1.6 新增】通过 provide 将全屏上下文暴露给子组件
 *
 * 子组件（如 packaging_1 Form.vue）通过：
 *   const dialogCtx = inject('dynamicDialogCtx', null)
 * 获取上下文后，可：
 *   - dialogCtx.isFullscreen.value  读取当前全屏状态（响应式，需 .value）
 *   - dialogCtx.toggleFullscreen()  切换全屏
 *
 * 若子组件在非对话框场景使用（如独立打印），inject 返回 null，
 * 子组件需判空后降级（不显示全屏按钮）。
 */
provide('dynamicDialogCtx', {
  isFullscreen,
  toggleFullscreen
})

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
 * @param {String} params.cMenuId        当前表单对应的 C 节点 ID
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
    buttonLabel: params.buttonLabel || '',
    cMenuId: params.cMenuId || null   // 新增：C 节点 ID
  }

  // 【v1.6】不再设置 currentTitle（不显示对话框标题），
  // 由 Form.vue 自身标题承载（如"灌装包材处理记录"）

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
  // 【v1.6】关闭时重置全屏状态，避免下次打开残留
  isFullscreen.value = false
}

defineExpose({ open })
</script>

<style scoped>
/*
 * 动态组件容器：
 * 【v1.5 改造】改用 flex: 1 + min-height: 0，由 dialog body 的 flex 布局驱动高度。
 * 移除原有 min-height: 400px（会破坏 flex 收缩），改由 dialog 整体控制高度。
 * 组件内部的 Form.vue 根容器使用 height: 100% 撑满此容器。
 */
.dynamic-component-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}
</style>

<!--
  【v1.5 新增】非 scoped 样式块：覆盖 append-to-body 到 body 的 dialog 全局样式。
  因 el-dialog 使用 append-to-body，实际 DOM 不在组件树内，scoped 样式无法命中；
  同时使用本组件独有的 class（dynamic-component-dialog）做前置限定，
  保证只影响本组件的对话框，不污染其他文件的 .el-dialog。
-->
<style>
/* dialog 整体改为 flex 列布局，使 body 能够占满剩余空间 */
.dynamic-component-dialog.el-dialog {
  height: 90vh;
  display: flex;
  flex-direction: column;
}
.dynamic-component-dialog.el-dialog.is-fullscreen {
  height: 100vh;
}
/* dialog body 改为 flex 列布局，让子容器可以 flex: 1 撑满 */
.dynamic-component-dialog.el-dialog .el-dialog__body {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}
/* 【v1.6】默认 header 压缩：标题为空时不显示，header 高度由 X 按钮决定 */
.dynamic-component-dialog.el-dialog .el-dialog__header {
  padding: 8px 16px;
  border-bottom: none;
}
/* 【v1.6】标题文本隐藏（X 按钮由 Element Plus 自动渲染，无需自定义） */
.dynamic-component-dialog.el-dialog .el-dialog__title {
  display: none;
}
</style>