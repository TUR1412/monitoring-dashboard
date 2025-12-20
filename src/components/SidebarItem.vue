<!-- src/components/SidebarItem.vue -->
<template>
  <div>
    <router-link 
      :to="to" 
      :exact="exact" 
      class="sidebar-item" 
      active-class="active"
      @click="toggleSubmenu"
    >
      <i :class="icon" class="sidebar-icon"></i>
      <span>{{ label }}</span>
      <i 
        v-if="children && children.length" 
        :class="['fas', isOpen ? 'fa-chevron-down' : 'fa-chevron-right']"
        class="submenu-arrow"
      ></i>
    </router-link>
    <transition name="slide">
      <div 
        v-if="children && children.length" 
        v-show="isOpen"
        class="sidebar-children"
      >
        <SidebarItem
          v-for="child in children"
          :key="child.to"
          :to="child.to"
          :label="child.label"
          :icon="child.icon"
          :exact="child.exact"
          :children="child.children"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    to: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    exact: {
      type: Boolean,
      default: false
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleSubmenu() {
      if (this.children && this.children.length) {
        this.isOpen = !this.isOpen;
      }
    }
  }
}
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  color: var(--text-1);
  text-decoration: none;
  position: relative;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  border-left: 3px solid transparent;
  border-radius: 10px;
}

.sidebar-item:hover {
  background-color: rgba(34, 211, 238, 0.12);
  color: var(--text-0);
  border-left: 3px solid rgba(34, 211, 238, 0.6);
}

.sidebar-item.active {
  background-color: rgba(34, 211, 238, 0.2);
  color: var(--text-0);
  border-left: 3px solid rgba(34, 211, 238, 0.8);
}

.sidebar-icon {
  margin-right: 10px;
  color: var(--accent-0);
}

.submenu-arrow {
  position: absolute;
  right: 20px;
  transition: transform 0.2s, color 0.2s;
  color: var(--text-2);
}

.sidebar-item:hover .submenu-arrow {
  color: var(--accent-1);
}

.active .submenu-arrow {
  color: var(--accent-1);
}

.sidebar-children {
  padding-left: 20px;
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

:deep(.sidebar.is-compact) .sidebar-item {
  justify-content: center;
}

:deep(.sidebar.is-compact) .sidebar-item span,
:deep(.sidebar.is-compact) .submenu-arrow {
  display: none;
}

:deep(.sidebar.is-compact) .sidebar-icon {
  margin-right: 0;
}

/* 响应式设计：调整子菜单缩进 */
@media (max-width: 768px) {
  .sidebar-children {
    padding-left: 15px;
  }
}
</style>
