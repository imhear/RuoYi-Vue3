<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterMethod"
    :loading="loading"
    style="width: 100%"
    @change="handleChange"
  >
    <el-option
      v-for="item in filteredOptions"
      :key="item.code"
      :label="item.name"
      :value="item.code"
    />
  </el-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import request from '@/utils/request'
import pinyin from 'tiny-pinyin'
import useBaseCategoryStore from '@/store/modules/baseCategory'

defineOptions({ name: 'BaseCategorySelect' })

const props = defineProps({
  modelValue: { type: String, default: null },
  apiUrl: { type: String, required: true },
  categoryCode: { type: String, default: null },
  placeholder: { type: String, default: '请选择' },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  filterable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'change'])

/**
 * 基础数据缓存 Store
 * 
 * 使用 Pinia Store 而非组件内 Map，保证跨组件共享：
 * - 42 个 BaseCategorySelect 实例共享同一份缓存
 * - 通过 store.load() 的 pending 机制，同时并发的请求会被合并为一个
 */
const categoryStore = useBaseCategoryStore()

const allOptions = ref([])
const filteredOptions = ref([])
const selectedValue = ref(props.modelValue)
const loading = ref(false)

watch(() => props.modelValue, (val) => {
  selectedValue.value = val
})

watch(() => props.categoryCode, () => {
  loadOptions()
})

/**
 * 加载基础数据
 * 
 * 通过 Pinia Store 的 load 方法实现：
 * 1. 优先读缓存
 * 2. 缓存未命中但请求进行中，共享同一个 Promise
 * 3. 都无则发起新请求
 * 
 * 这样即使 42 个组件同时挂载，也只会有 3 个 HTTP 请求（每个 (apiUrl, categoryCode) 组合一次）。
 */
async function loadOptions() {
  if (!props.categoryCode) {
    allOptions.value = []
    filteredOptions.value = []
    return
  }

  const cacheKey = `${props.apiUrl}::${props.categoryCode}`
  loading.value = true
  try {
    const data = await categoryStore.load(cacheKey, () => {
      return request({
        url: props.apiUrl,
        method: 'get',
        params: { categoryCode: props.categoryCode }
      }).then(res => res.data || [])
    })
    allOptions.value = data
    filteredOptions.value = data
  } catch (error) {
    allOptions.value = []
    filteredOptions.value = []
    console.error('[BaseCategorySelect] 加载基础数据失败：', error)
  } finally {
    loading.value = false
  }
}

/**
 * 拼音搜索过滤方法
 * 
 * 匹配规则：中文直接匹配、code 片段匹配、拼音全拼匹配、拼音首字母匹配。
 * 详见 tiny-pinyin API：convertToPinyin(str, separator, fullPinyin)。
 */
function filterMethod(query) {
  if (!query) {
    filteredOptions.value = allOptions.value
    return
  }
  const q = query.toLowerCase().trim()
  const supported = pinyin.isSupported()

  filteredOptions.value = allOptions.value.filter(item => {
    const name = item.name || ''
    const code = item.code || ''

    if (name.toLowerCase().includes(q)) return true
    if (code.toLowerCase().includes(q)) return true

    if (supported && name) {
      const fullPy = pinyin.convertToPinyin(name, '', true).toLowerCase()
      const firstPy = pinyin.convertToPinyin(name, '', false).toLowerCase()
      if (fullPy.includes(q) || firstPy.includes(q)) return true
    }
    return false
  })
}

/**
 * 选中值变化
 * 
 * 同时 emit v-model 和 change 事件，change 携带 (code, name)，
 * 方便父组件一次回填 code 和 name 快照。
 */
function handleChange(val) {
  emit('update:modelValue', val)
  const item = val ? allOptions.value.find(i => i.code === val) : null
  emit('change', val, item ? item.name : null)
}

/**
 * 获取选中项的完整信息（供父组件通过 ref 调用）
 */
function getSelectedItem() {
  if (!selectedValue.value) return null
  return allOptions.value.find(item => item.code === selectedValue.value) || null
}

/**
 * 清空当前缓存（供父组件通过 ref 调用）
 * 
 * 注意：仅清除当前组件使用的 (apiUrl, categoryCode) 缓存。
 * 若需全局清空，请直接调用 store.clear()。
 */
function clearCache() {
  const cacheKey = `${props.apiUrl}::${props.categoryCode}`
  categoryStore.remove(cacheKey)
}

loadOptions()

defineExpose({ getSelectedItem, clearCache })
</script>