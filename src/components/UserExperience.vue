<!-- src/components/UserExperience.vue -->
<template>
  <div class="user-experience p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">用户体验</h1>
    </div>

    <!-- 图表展示区域 -->
    <div class="mb-8">
      <ChartComponent 
        type="bar"
        :data="experienceData" 
      />
    </div>
    
    <!-- 导航区域 -->
    <div class="mb-6">
      <nav class="flex space-x-4">
        <router-link 
          to="/dashboard/user-experience/feedback"
          class="px-4 py-2 rounded-lg hover:bg-blue-50"
          :class="{ 'bg-blue-50 text-blue-600': isActive('feedback') }"
        >
          用户反馈
        </router-link>
        <router-link 
          to="/dashboard/user-experience/surveys"
          class="px-4 py-2 rounded-lg hover:bg-blue-50"
          :class="{ 'bg-blue-50 text-blue-600': isActive('surveys') }"
        >
          调查问卷
        </router-link>
        <router-link 
          to="/dashboard/user-experience/metrics"
          class="px-4 py-2 rounded-lg hover:bg-blue-50"
          :class="{ 'bg-blue-50 text-blue-600': isActive('metrics') }"
        >
          用户指标
        </router-link>
      </nav>
    </div>

    <!-- 子路由渲染区域 -->
    <div class="bg-white rounded-lg shadow p-6">
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
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
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
  padding: 20px;
}

.user-experience nav a {
  transition: background-color 0.3s, color 0.3s;
}

.user-experience nav a.active-link {
  background-color: #bfdbfe;
  color: #1e3a8a;
}
</style>
