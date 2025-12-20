<!-- src/components/UserExperience/Surveys.vue -->
<template>
    <div class="surveys">
      <h2 class="text-2xl font-bold mb-4">调查问卷</h2>
      <div class="survey-controls mb-4">
        <button @click="createNewSurvey" class="btn btn-primary">
          创建新调查
        </button>
        <select v-model="filterStatus">
          <option value="all">全部调查</option>
          <option value="active">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      <div class="survey-list">
        <div v-for="survey in filteredSurveys" :key="survey.id" class="survey-card">
          <h3 class="text-lg font-semibold">{{ survey.title }}</h3>
          <p class="text-gray-600">{{ survey.description }}</p>
          <div class="survey-stats flex justify-between mt-4">
            <span>响应数: {{ survey.responses }}</span>
            <span>状态: {{ survey.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Surveys',
    data() {
      return {
        filterStatus: 'all',
        surveys: []
      }
    },
    computed: {
      // 计算过滤后的调查问卷列表
      filteredSurveys() {
        if (this.filterStatus === 'all') return this.surveys
        return this.surveys.filter(survey => survey.status === this.filterStatus)
      }
    },
    methods: {
      // 创建新的调查问卷
      createNewSurvey() {
        // 实现创建新调查问卷的逻辑
        alert('创建新调查问卷功能尚未实现。')
      }
    },
    created() {
      // 模拟数据 - 在实际项目中请替换为API调用
      this.surveys = [
        {
          id: 1,
          title: '系统可用性调查',
          description: '关于系统可用性和功能的反馈',
          responses: 45,
          status: 'active'
        },
        {
          id: 2,
          title: '性能满意度调查',
          description: '用户对系统性能的满意度',
          responses: 120,
          status: 'completed'
        },
        {
          id: 3,
          title: '界面设计反馈',
          description: '关于用户界面设计的建议和意见',
          responses: 60,
          status: 'active'
        },
        {
          id: 4,
          title: '功能需求调查',
          description: '用户希望添加的新功能',
          responses: 30,
          status: 'completed'
        }
      ]
    }
  }
  </script>
  
  <style scoped>
  .surveys {
    background-color: var(--background-color);
    color: var(--text-color);
  }
  
  .surveys h2 {
    margin-bottom: 1.5rem;
  }
  
  .survey-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .survey-controls select {
    max-width: 240px;
  }
  
  .survey-list {
    margin-top: 1.5rem;
  }
  
  .survey-card {
    padding: 1rem;
    background-color: rgba(148, 163, 184, 0.08);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
  }
  
  .survey-card h3 {
    margin-bottom: 0.5rem;
  }
  
  .survey-card p {
    color: var(--text-2);
  }
  
  .survey-stats {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--text-3);
  }
  
  .flex {
    display: flex;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .bg-green-600 {
    background-color: #38a169;
  }
  
  .hover\:bg-green-700:hover {
    background-color: #2f855a;
  }
  
  .text-gray-600 {
    color: var(--text-2);
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .font-semibold {
    font-weight: 600;
  }
  
  .bg-white {
    background-color: transparent;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .shadow {
    box-shadow: none;
  }
  </style>
  
