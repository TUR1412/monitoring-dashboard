<!-- src/components/SidebarItem.vue -->
<template>
  <div>
    <router-link 
      :to="to" 
      :exact="exact" 
      class="sidebar-item" 
      active-class="active"
      @click.native="toggleSubmenu"
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
  padding: 10px 20px;
  color: var(--text-color); /* 使用 CSS 变量管理文本颜色 */
  text-decoration: none;
  position: relative;
  transition: background-color 0.3s, color 0.3s;
  border-left: 4px solid transparent; /* 左侧边框用于高亮 */
  box-shadow: 0 0 5px var(--neon-pink), 0 0 10px var(--neon-blue); /* 添加霓虹阴影效果 */
}

.sidebar-item:hover {
  background-color: var(--light-background); /* 使用 CSS 变量管理背景颜色 */
  color: var(--neon-blue); /* 悬停时字体颜色变化 */
  border-left: 4px solid var(--neon-blue); /* 悬停时左侧边框颜色变化 */
  text-shadow: 0 0 5px var(--neon-blue), 0 0 10px var(--neon-pink); /* 添加文字发光效果 */
}

.sidebar-item.active {
  background-color: var(--neon-blue); /* 激活状态背景颜色 */
  color: var(--text-color); /* 激活状态字体颜色，保持一致 */
  border-left: 4px solid var(--neon-pink); /* 激活状态左侧边框颜色 */
  text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-blue); /* 添加文字发光效果 */
}

.sidebar-icon {
  margin-right: 10px;
  color: var(--neon-pink); /* 图标颜色使用 CSS 变量 */
  text-shadow: 0 0 5px var(--neon-pink), 0 0 10px var(--neon-blue); /* 添加图标发光效果 */
}

.submenu-arrow {
  position: absolute;
  right: 20px;
  transition: transform 0.3s, color 0.3s;
  color: var(--neon-blue); /* 箭头颜色使用 CSS 变量 */
}

.sidebar-item:hover .submenu-arrow {
  color: var(--neon-pink); /* 悬停时箭头颜色变化 */
}

.active .submenu-arrow {
  color: var(--neon-pink); /* 激活状态箭头颜色 */
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

/* 响应式设计：调整子菜单缩进 */
@media (max-width: 768px) {
  .sidebar-children {
    padding-left: 15px;
  }
}
</style>
