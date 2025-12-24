<!-- src/components/UserExperience.vue -->
<template>
  <div class="user-experience">
    <div>
      <h1 class="page-title">用户体验</h1>
    </div>

    <!-- 图表展示区域 -->
    <div class="card chart-card">
      <ChartComponent 
        type="bar"
        :data="experienceData" 
      />
    </div>
    
    <!-- 导航区域 -->
    <div>
      <nav class="subnav">
        <router-link 
          to="/dashboard/user-experience/feedback"
          class="subnav-link"
          :class="{ active: isActive('feedback') }"
        >
          用户反馈
        </router-link>
        <router-link 
          to="/dashboard/user-experience/surveys"
          class="subnav-link"
          :class="{ active: isActive('surveys') }"
        >
          调查问卷
        </router-link>
        <router-link 
          to="/dashboard/user-experience/metrics"
          class="subnav-link"
          :class="{ active: isActive('metrics') }"
        >
          用户指标
        </router-link>
      </nav>
    </div>

    <!-- 子路由渲染区域 -->
    <div class="card content-card">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import ChartComponent from './charts/ChartComponent.vue'

export default {
  name: 'UserExperience',
  components: {
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()
    
    const experienceData = computed(() => ({
      labels: store.userBehavior.labels,
      datasets: [
        {
          label: '用户行为',
          data: store.userBehavior.data,
          backgroundColor: 'rgba(46, 196, 182, 0.35)',
          borderColor: 'rgba(46, 196, 182, 0.9)',
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

.chart-card {
  min-height: 320px;
}

.content-card {
  min-height: 320px;
}
</style>
