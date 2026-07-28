<!-- PulseBadge.vue -->
<template>
  <div
    class="pulse-badge"
    :style="containerStyle"
  >
    <!-- 外部空心菱形：正方形旋转45度 + 边框 -->
    <span class="outer-diamond" :style="outerStyle" />
    <!-- 内部实心菱形：正方形旋转45度 + 背景色 -->
    <span class="inner-diamond" :style="innerStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 26,
  },
  color: {
    type: String,
    default: '#f96a00',
  },
  outerWidth: {
    type: Number,
    default: 3,
  },
})

function hexToRgba(hex, alpha = 0.25) {
  let cleaned = hex.replace('#', '')
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2]
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16)
    const g = parseInt(cleaned.substring(2, 4), 16)
    const b = parseInt(cleaned.substring(4, 6), 16)
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }
  return `rgba(0, 0, 0, ${alpha * 0.6})`
}

const shadowColor = computed(() => hexToRgba(props.color, 0.25))

// 改动点：边框宽度增加 1px，实现加粗效果
const borderPx = computed(() => (props.outerWidth / 40) * props.size + 1)

const outerSquareSize = computed(() => props.size * 0.5)
const innerSquareSize = computed(() => props.size * 0.285)

const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size * 1.25}px`,
  filter: `drop-shadow(0 0 2px ${shadowColor.value})`,
}))

const outerStyle = computed(() => ({
  width: `${outerSquareSize.value}px`,
  height: `${outerSquareSize.value}px`,
  borderWidth: `${borderPx.value}px`,
  borderColor: props.color,
}))

const innerStyle = computed(() => ({
  width: `${innerSquareSize.value}px`,
  height: `${innerSquareSize.value}px`,
  backgroundColor: props.color,
}))
</script>

<style scoped>
.pulse-badge {
  position: relative;
  display: block;
  animation: badge-breathe 2.4s ease-in-out infinite;
}

.outer-diamond {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  box-sizing: content-box;
  border-style: solid;
  background: transparent;
  animation: pulse-opacity 2s linear infinite;
  pointer-events: none;
}

.inner-diamond {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  box-sizing: content-box;
  border: none;
  pointer-events: none;
}

@keyframes pulse-opacity {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes badge-breathe {
  0% { transform: scale(0.92); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.92); }
}
</style>