<template>
  <!-- 前端文件选择器（构建时扫描，支持任意目录深度） -->
  <el-dialog title="选择前端组件文件" v-model="visible" width="700px" top="5vh" append-to-body>
    <el-form :inline="true">
      <el-form-item label="组件文件">
        <el-cascader
          v-model="selectedPath"
          :options="fileTree"
          :props="{ checkStrictly: false, expandTrigger: 'hover' }"
          placeholder="请选择组件文件（支持任意层级）"
          clearable
          filterable
          style="width: 500px"
          @change="handlePathChange"
        />
      </el-form-item>
    </el-form>
    <div v-if="selectedFilePath" style="margin-top: 10px; color: #409eff;">
      已选择：{{ selectedFilePath }}
    </div>
    <div style="margin-top: 20px; color: #909399; font-size: 12px; line-height: 1.5;">
      说明：<br>
      1. 数据来自前端构建扫描（src/views 下所有 .vue 文件）<br>
      2. 自动跳过 index.vue<br>
      3. 支持任意目录深度，适配未来版本管理（如 fill/scheme/versions/v1.0.0）
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm" :disabled="!selectedFilePath">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const selectedPath = ref([])          // 级联选择器选中的路径数组，如 ['fill','scheme','Handle.vue']
const selectedFilePath = ref('')     // 完整相对路径，如 'fill/scheme/Handle.vue'
const fileTree = ref([])             // 目录树

// ========== 构建时扫描前端组件 ==========
const modules = import.meta.glob('@/views/**/*.vue')
const allComponentPaths = Object.keys(modules)
  .map(path => path.replace(/^\/src\/views\//, ''))
  .filter(path => !path.endsWith('/index.vue') && !path.endsWith('index.vue'))

/**
 * 从所有组件路径构建目录树（目录节点 + 文件叶子节点）
 * 节点 value 使用简单名称，文件节点设置 leaf: true
 */
function buildFileTree(paths) {
  const root = []
  paths.forEach(path => {
    const segments = path.split('/')
    let currentLevel = root

    segments.forEach((seg, index) => {
      const isFile = index === segments.length - 1 && seg.endsWith('.vue')
      let node = currentLevel.find(n => n.value === seg)

      if (!node) {
        node = {
          label: seg,
          value: seg,
          children: isFile ? undefined : []
        }
        if (isFile) node.leaf = true
        currentLevel.push(node)
      }

      if (!isFile) {
        currentLevel = node.children
      }
    })
  })
  return root
}

// 初始化目录树
fileTree.value = buildFileTree(allComponentPaths)

/**
 * 打开选择器
 */
function show() {
  selectedPath.value = []
  selectedFilePath.value = ''
  visible.value = true
}

/**
 * 级联选择变化时，拼接完整相对路径
 */
function handlePathChange() {
  selectedFilePath.value = ''
  if (selectedPath.value && selectedPath.value.length > 0) {
    selectedFilePath.value = selectedPath.value.join('/')
  }
}

/**
 * 确认选择，将完整路径回传
 */
function handleConfirm() {
  if (!selectedFilePath.value) {
    proxy.$modal.msgWarning('请选择组件文件')
    return
  }
  visible.value = false
  emit('ok', selectedFilePath.value)
}

const emit = defineEmits(['ok'])

defineExpose({ show })
</script>