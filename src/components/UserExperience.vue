<!-- src/components/UserExperience.vue -->
<template>
  <div class="user-experience">
    <div class="section-header">
      <div>
        <div class="section-title">用户体验</div>
        <div class="section-subtitle">满意度、使用路径与体验反馈</div>
      </div>
    </div>

    <!-- 图表展示区域 -->
    <div class="surface-card chart-block">
      <ChartComponent 
        type="bar"
        :data="experienceData" 
      />
    </div>
    
    <!-- 导航区域 -->
    <div class="nav-block surface-glass">
      <nav class="nav-links">
        <router-link 
          to="/dashboard/user-experience/feedback"
          class="nav-link"
          :class="{ 'nav-active': isActive('feedback') }"
        >
          用户反馈
        </router-link>
        <router-link 
          to="/dashboard/user-experience/surveys"
          class="nav-link"
          :class="{ 'nav-active': isActive('surveys') }"
        >
          调查问卷
        </router-link>
        <router-link 
          to="/dashboard/user-experience/metrics"
          class="nav-link"
          :class="{ 'nav-active': isActive('metrics') }"
        >
          用户指标
        </router-link>
      </nav>
    </div>

    <!-- 子路由渲染区域 -->
    <div class="surface-card content-block">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import ChartComponent from './charts/ChartComponent.vue'

export default {
  name: 'UserExperience',
  components: {
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()
    
    const experienceData = computed(() => ({
      labels: store.userBehavior.labels,
      datasets: [
        {
          label: '用户行为',
          data: store.userBehavior.data,
          backgroundColor: 'rgba(34, 211, 238, 0.35)',
          borderColor: 'rgb(34, 211, 238)',
          borderWidth: 1
        }
      ]
    }))

    return {
      experienceData
    }
  },
  methods: {
    isActive(routeName) {
      return this.$route.path.includes(routeName)
    }
  }
}
</script>

<style scoped>
.user-experience {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-block {
  padding: 1.5rem;
}

.nav-block {
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.nav-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  color: var(--text-2);
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(34, 211, 238, 0.12);
  color: var(--text-0);
}

.nav-active {
  background: rgba(34, 211, 238, 0.18);
  color: var(--text-0);
}

.content-block {
  padding: 1.5rem;
}
</style>
