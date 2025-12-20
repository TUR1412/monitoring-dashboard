<!-- src/components/TabBar.vue -->
<template>
    <nav class="tab-bar">
      <div class="tab-container">
        <div
          v-for="tab in openTabs"
          :key="tab.name"
          :class="[
            'tab-item',
            { 'tab-active': activeTab === tab.name }
          ]"
          @click="switchTab(tab)"
        >
          <span class="tab-title">{{ tab.meta?.title || tab.name }}</span>
          <button
            class="tab-close"
            @click.stop="closeTab(tab)"
            aria-label="Close Tab"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useMonitorStore } from '@/stores/monitorStore';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'TabBar',
    setup() {
      const store = useMonitorStore();
      const router = useRouter();
  
      const openTabs = computed(() => store.openTabs);
      const activeTab = computed(() => store.activeTab);
  
      const switchTab = (tab) => {
        store.setActiveTab(tab.name);
        router.push(tab.path);
      };
  
      const closeTab = (tab) => {
        store.removeTab(tab.name);
        
        if (store.activeTab) {
          const active = store.openTabs.find(t => t.name === store.activeTab);
          if (active) {
            router.push(active.path);
          } else if (store.openTabs.length > 0) {
            router.push(store.openTabs[store.openTabs.length - 1].path);
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
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 2.6rem;
    margin-bottom: 0.75rem;
    background: var(--surface-0);
    backdrop-filter: blur(var(--blur));
    border-bottom: 1px solid var(--border);
    z-index: 50;
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
    background: var(--background-color);
  }
  
  .tab-container::-webkit-scrollbar-thumb {
    background-color: var(--neon-blue);
    border-radius: 3px;
  }
  
  .tab-item {
    display: inline-flex;
    align-items: center;
    height: 2rem;
    padding: 0 0.75rem;
    margin-right: 0.5rem;
    border-radius: 0.6rem;
    background-color: rgba(148, 163, 184, 0.12);
    color: var(--text-1);
    font-size: 0.85rem;
    white-space: nowrap;
    transition: all 0.2s ease;
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent;
  }
  
  .tab-item:hover {
    border-color: rgba(34, 211, 238, 0.3);
  }
  
  .tab-active {
    background-color: rgba(34, 211, 238, 0.2);
    box-shadow: 0 0 12px rgba(34, 211, 238, 0.25);
    border-color: rgba(34, 211, 238, 0.45);
  }
  
  .tab-title {
    margin-right: 0.5rem;
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
    transition: opacity 0.2s ease;
    cursor: pointer;
  }
  
  .tab-close:hover {
    opacity: 1;
    background-color: rgba(148, 163, 184, 0.2);
  }
  
  .tab-close:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.5);
  }
  
  @media (max-width: 768px) {
    .tab-bar {
      top: 3.5rem;
    }
    
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
