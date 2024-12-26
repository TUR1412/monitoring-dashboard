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
    height: 2.5rem;
    margin-bottom: 1rem;
    background-color: var(--card-background-color);
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
    border-radius: 0.375rem;
    background-color: var(--dark-purple);
    color: var(--text-color);
    font-size: 0.875rem;
    white-space: nowrap;
    transition: all 0.2s ease;
    cursor: pointer;
    user-select: none;
  }
  
  .tab-item:hover {
    background-color: var(--gray-700);
  }
  
  .tab-active {
    background-color: var(--neon-blue);
    box-shadow: 0 0 10px var(--neon-blue);
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
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .tab-close:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--neon-pink);
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