<template>
  <svg
    class="app-icon"
    :class="className"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :role="decorative ? 'presentation' : 'img'"
    :aria-hidden="decorative ? 'true' : 'false'"
    :aria-label="decorative ? undefined : ariaLabel"
  >
    <title v-if="!decorative && ariaLabel">{{ ariaLabel }}</title>

    <!-- dashboard -->
    <g v-if="name === 'dashboard'">
      <rect x="3" y="3" width="8" height="8" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <rect x="3" y="13" width="8" height="8" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
    </g>

    <!-- server -->
    <g v-else-if="name === 'server'">
      <rect x="4" y="4" width="16" height="6" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <rect x="4" y="14" width="16" height="6" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <circle cx="8" cy="7" r="1" fill="currentColor" />
      <circle cx="8" cy="17" r="1" fill="currentColor" />
    </g>

    <!-- users -->
    <g v-else-if="name === 'users'">
      <path
        d="M16 18c0-2-1.8-3.5-4-3.5S8 16 8 18"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <circle cx="12" cy="10" r="3" :stroke-width="strokeWidth" stroke="currentColor" />
      <path
        d="M19 18c0-1.4-1-2.6-2.5-3.1"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <path
        d="M7.5 14.9C6 15.4 5 16.6 5 18"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
    </g>

    <!-- user -->
    <g v-else-if="name === 'user'">
      <circle cx="12" cy="8.5" r="3.2" :stroke-width="strokeWidth" stroke="currentColor" />
      <path
        d="M5 20c1.6-3.3 4.1-5 7-5s5.4 1.7 7 5"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
    </g>

    <!-- lock -->
    <g v-else-if="name === 'lock'">
      <rect x="6" y="11" width="12" height="10" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <path
        d="M8 11V8.5C8 6 9.8 4 12 4s4 2 4 4.5V11"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
    </g>

    <!-- shield -->
    <g v-else-if="name === 'shield'">
      <path
        d="M12 3l8 4v6c0 5-3.4 8-8 8s-8-3-8-8V7l8-4z"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- alert -->
    <g v-else-if="name === 'alert'">
      <path
        d="M12 3l10 18H2L12 3z"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linejoin="round"
      />
      <path d="M12 9v5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <circle cx="12" cy="17.2" r="1" fill="currentColor" />
    </g>

    <!-- bell -->
    <g v-else-if="name === 'bell'">
      <path
        d="M18 16H6c1.2-1.3 2-3.2 2-5.5C8 7.5 9.8 5 12 5s4 2.5 4 5.5c0 2.3.8 4.2 2 5.5z"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linejoin="round"
      />
      <path
        d="M10 18c.5 1.2 1.2 2 2 2s1.5-.8 2-2"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
    </g>

    <!-- history -->
    <g v-else-if="name === 'history'">
      <path
        d="M4 12a8 8 0 1 0 2.3-5.7"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <path d="M4 4v4h4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 8v4l3 2" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- refresh -->
    <g v-else-if="name === 'refresh'">
      <path
        d="M20 12a8 8 0 0 1-14 4.9"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <path
        d="M4 12a8 8 0 0 1 14-4.9"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <path d="M20 7v4h-4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4 17v-4h4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- export -->
    <g v-else-if="name === 'export'">
      <path d="M12 3v12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M8 11l4 4 4-4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4 21h16" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <!-- terminal -->
    <g v-else-if="name === 'terminal'">
      <rect x="3" y="5" width="18" height="14" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M7 10l3 3-3 3" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 16h5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <!-- moon -->
    <g v-else-if="name === 'moon'">
      <path
        d="M21 13.5A7.5 7.5 0 0 1 10.5 3 6.5 6.5 0 1 0 21 13.5z"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linejoin="round"
      />
    </g>

    <!-- sun -->
    <g v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="3.2" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M12 2v2.5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M12 19.5V22" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M2 12h2.5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M19.5 12H22" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M4.4 4.4l1.8 1.8" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M17.8 17.8l1.8 1.8" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M19.6 4.4l-1.8 1.8" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M6.2 17.8l-1.8 1.8" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <!-- chevrons -->
    <g v-else-if="name === 'chevron-down'">
      <path d="M6 9l6 6 6-6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="name === 'chevron-right'">
      <path d="M9 6l6 6-6 6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="name === 'sort'">
      <path d="M8 9l4-4 4 4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 15l4 4 4-4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- actions -->
    <g v-else-if="name === 'logout'">
      <path d="M10 7V6a2 2 0 0 1 2-2h7v16h-7a2 2 0 0 1-2-2v-1" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M3 12h11" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M10 8l4 4-4 4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <g v-else-if="name === 'arrow-left'">
      <path d="M10 6l-6 6 6 6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4 12h16" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <g v-else-if="name === 'plus'">
      <path d="M12 5v14" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M5 12h14" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <g v-else-if="name === 'check'">
      <path d="M5 13l4 4L19 7" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <g v-else-if="name === 'x'">
      <path d="M6 6l12 12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M18 6L6 18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <g v-else-if="name === 'stop'">
      <rect x="7" y="7" width="10" height="10" rx="2" :stroke-width="strokeWidth" stroke="currentColor" />
    </g>

    <g v-else-if="name === 'edit'">
      <path
        d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4a2 2 0 0 0-3 0L3 14.5V20z"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linejoin="round"
      />
      <path d="M12.5 5.5l6 6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <g v-else-if="name === 'trash'">
      <path d="M4 7h16" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M7 7l1 14h8l1-14" :stroke-width="strokeWidth" stroke="currentColor" stroke-linejoin="round" />
      <path d="M10 11v6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M14 11v6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <!-- chart -->
    <g v-else-if="name === 'chart'">
      <path d="M4 19h16" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M6 16l4-5 4 3 4-6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="6" cy="16" r="1" fill="currentColor" />
      <circle cx="10" cy="11" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
      <circle cx="18" cy="8" r="1" fill="currentColor" />
    </g>

    <!-- file -->
    <g v-else-if="name === 'file'">
      <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linejoin="round" />
      <path d="M14 3v4h4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linejoin="round" />
      <path d="M8 12h8" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M8 16h6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </g>

    <!-- smile -->
    <g v-else-if="name === 'smile'">
      <circle cx="12" cy="12" r="9" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M8.5 14.2c.9 1 2.1 1.6 3.5 1.6s2.6-.6 3.5-1.6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </g>

    <!-- fallback -->
    <g v-else>
      <circle cx="12" cy="12" r="9" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M12 8v5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 18
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  label: {
    type: String,
    default: ''
  },
  decorative: {
    type: Boolean,
    default: true
  },
  className: {
    type: [String, Array, Object],
    default: ''
  }
})

const ariaLabel = computed(() => props.label || props.name)
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: -0.125em;
  flex-shrink: 0;
  shape-rendering: geometricPrecision;
}
</style>
