<template>
  <el-dialog
    v-model="visible"
    :title="currentTitle"
    width="80%"
    top="5vh"
    append-to-body
    :fullscreen="isFullscreen"
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
import { ElMessage } from 'element-plus'
import { FullScreen, Aim } from '@element-plus/icons-vue'

defineOptions({ name: 'DynamicComponentDialog' })

// 定义对外事件
const emit = defineEmits(['refresh'])

/**
 * 使用 import.meta.glob 扫描 src/views 下所有 .vue 文件，
 * 生成一个以文件路径为键、加载函数为值的对象。
 * 加载函数返回 Promise，resolve 后得到模块对象（通常包含 default 导出）。
 */
const modules = import.meta.glob('/src/views/**/*.vue')

/**
 * 对话框可见性
 */
const visible = ref(false)

/**
 * 对话框是否全屏
 */
const isFullscreen = ref(false)

/**
 * 组件加载状态：
 * true 表示正在异步加载组件，显示遮罩；
 * false 表示加载完成或失败，隐藏遮罩。
 */
const componentLoading = ref(false)

/**
 * 当前需要动态渲染的组件定义。
 * 使用 shallowRef 避免对组件定义进行深度响应式包装，提升性能。
 */
const currentComponent = shallowRef(null)

/**
 * 对话框标题文字
 */
const currentTitle = ref('操作')

/**
 * 传递给动态组件的 props 对象
 */
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
 * @param {String} params.buttonLabel    按钮标签（用于确认框和按钮文字）
 */
async function open(params) {
  // 兼容处理：去除传入 component 路径可能存在的多余前导斜杠
  const componentPath = params.component.replace(/^\/+/, '')
  const fullPath = '/src/views/' + componentPath

  // 从模块映射中获取对应的加载函数
  const loader = modules[fullPath]

  // 如果找不到对应模块，给出警告并终止
  if (!loader) {
    ElMessage.warning('前端组件未找到：' + componentPath)
    return
  }

  // 准备传给动态组件的 props
  componentProps.value = {
    recordId: params.recordId,
    menuId: params.menuId,
    businessRecordId: params.businessRecordId,
    operationCode: params.operationCode,
    backendRoute: params.backendRoute,
    tableName: params.tableName,
    menuName: params.menuName || '',       // 新增
    buttonLabel: params.buttonLabel || ''  // 新增
  }

  // 设置标题
  currentTitle.value = `操作 - ${params.buttonLabel || params.operationCode}`

  // 开启加载遮罩
  componentLoading.value = true

  // 显示对话框
  visible.value = true

  try {
    // 异步加载组件模块
    const module = await loader()

    // 兼容模块导出格式：优先取 default，否则取模块本身
    currentComponent.value = module.default || module

    // 加载成功，关闭遮罩
    componentLoading.value = false
  } catch (error) {
    // 加载失败，关闭遮罩并提示
    componentLoading.value = false
    ElMessage.error('组件加载失败，请重试')
    console.error('动态组件加载失败:', error)
  }
}

/**
 * 子组件触发刷新事件时，向外继续触发
 */
function handleRefresh() {
  // console.log('[Dynamic] 收到子组件 refresh，转发给父组件')
  emit('refresh')
}

/**
 * 对话框关闭回调，清理所有状态
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