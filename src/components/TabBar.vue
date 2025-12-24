<!-- src/components/TabBar.vue -->
<template>
  <nav class="tab-bar" aria-label="快捷标签">
    <div class="tab-container" role="tablist" aria-label="打开的页面标签">
      <div
        v-for="tab in openTabs"
        :key="tab.name"
        :class="[
          'tab-item',
          { 'tab-active': activeTab === tab.name }
        ]"
        @click="switchTab(tab)"
        role="tab"
        :tabindex="activeTab === tab.name ? 0 : -1"
        :aria-selected="activeTab === tab.name ? 'true' : 'false'"
        :title="tab.meta?.title || tab.name"
        @keydown.enter.prevent="switchTab(tab)"
        @keydown.space.prevent="switchTab(tab)"
        @keydown.delete.prevent="closeTab(tab)"
      >
        <span class="tab-title truncate-fade">{{ tab.meta?.title || tab.name }}</span>
        <button
          class="tab-close"
          @click.stop="closeTab(tab)"
          aria-label="关闭标签"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </nav>
</template>
  
  <script>
  import { computed } from 'vue';
  import { useTabsStore } from '@/stores/tabs';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'TabBar',
    setup() {
      const tabsStore = useTabsStore();
      const router = useRouter();
  
      const openTabs = computed(() => tabsStore.openTabs);
      const activeTab = computed(() => tabsStore.activeTab);
  
      const switchTab = (tab) => {
        tabsStore.setActiveTab(tab.name);
        router.push(tab.path);
      };
  
      const closeTab = (tab) => {
        tabsStore.removeTab(tab.name);
        
        if (tabsStore.activeTab) {
          const active = tabsStore.openTabs.find(t => t.name === tabsStore.activeTab);
          if (active) {
            router.push(active.path);
          } else if (tabsStore.openTabs.length > 0) {
            router.push(tabsStore.openTabs[tabsStore.openTabs.length - 1].path);
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/dashboard');
        }
      };
  
      return {
        openTabs,
        activeTab,
        switchTab,
        closeTab
      };
    }
  };
  </script>
  
<style scoped>
.tab-bar {
  height: var(--tabbar-height);
  background-color: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(46, 196, 182, 0.15);
  backdrop-filter: blur(16px);
  z-index: 50;
}

:global(.light) .tab-bar {
  background-color: rgba(255, 255, 255, 0.7);
}

.tab-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1.25rem;
  overflow-x: auto;
  scrollbar-width: thin;
}

.tab-container::-webkit-scrollbar {
  height: 3px;
}

.tab-container::-webkit-scrollbar-track {
  background: transparent;
}

.tab-container::-webkit-scrollbar-thumb {
  background-color: rgba(46, 196, 182, 0.4);
  border-radius: 3px;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  height: 2rem;
  padding: 0 0.85rem;
  margin-right: 0.5rem;
  border-radius: 999px;
  background-color: rgba(15, 23, 34, 0.65);
  color: var(--text-color);
  font-size: 0.85rem;
  white-space: nowrap;
  transition:
    background-color var(--dur-normal) var(--ease-out),
    color var(--dur-normal) var(--ease-out),
    box-shadow var(--dur-normal) var(--ease-out),
    transform var(--dur-normal) var(--ease-out);
  cursor: pointer;
  user-select: none;
  outline: none;
  --fade-mask-to-color: rgba(15, 23, 34, 0.65);
}

.tab-item:hover {
  background-color: rgba(46, 196, 182, 0.18);
  transform: translateY(-1px);
}

.tab-active {
  background-color: rgba(46, 196, 182, 0.32);
  color: var(--text-strong);
  box-shadow: 0 0 12px rgba(46, 196, 182, 0.35);
  --fade-mask-to-color: rgba(46, 196, 182, 0.32);
}

.tab-title {
  margin-right: 0.5rem;
  max-width: 220px;
}

.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity var(--dur-normal) var(--ease-out), background-color var(--dur-normal) var(--ease-out), transform var(--dur-normal) var(--ease-out);
  cursor: pointer;
}

.tab-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.tab-close:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(244, 162, 97, 0.4);
}

@media (max-width: 768px) {
  .tab-item {
    padding: 0 0.5rem;
  }

  .tab-title {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
