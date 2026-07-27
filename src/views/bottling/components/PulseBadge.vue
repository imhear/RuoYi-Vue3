<!-- PulseBadge.vue -->
<template>
  <svg
    class="pulse-badge-svg"
    viewBox="0 0 40 50"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size * 1.25"
  >
    <!-- 外部空心菱形 -->
    <polygon
      points="20,2 34,20 20,38 6,20"
      fill="none"
      :stroke="color"
      :stroke-width="outerWidth"
      stroke-linejoin="round"
    >
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="2s"
        repeatCount="indefinite"
      />
    </polygon>

    <!-- 内部实心菱形 -->
    <polygon
      points="20,10 28,20 20,30 12,20"
      :fill="color"
      stroke="none"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 26, // 从 20 增大到 26
  },
  color: {
    type: String,
    default: '#f96a00',
  },
  outerWidth: {
    type: Number,
    default: 3,
  },
});
</script>

<style scoped>
.pulse-badge-svg {
  display: block;
  filter: drop-shadow(0 0 2px rgba(249, 106, 0, 0.25));
  animation: badge-breathe 2.4s ease-in-out infinite;
}
@keyframes badge-breathe {
  0% { transform: scale(0.92); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.92); }
}
</style>