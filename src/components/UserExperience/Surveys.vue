<!-- src/components/UserExperience/Surveys.vue -->
<template>
    <div class="surveys">
      <h2 class="section-title">调查问卷</h2>
    <div class="survey-controls">
        <BaseButton type="primary" @click="createNewSurvey">
          创建新调查
        </BaseButton>
        <select v-model="filterStatus" class="filter-select">
          <option value="all">全部调查</option>
          <option value="active">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      <div class="survey-list">
        <div v-for="survey in filteredSurveys" :key="survey.id" class="card survey-card">
          <h3>{{ survey.title }}</h3>
          <p class="survey-desc">{{ survey.description }}</p>
          <div class="survey-stats">
            <span>响应数: {{ survey.responses }}</span>
            <span>状态: {{ survey.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import BaseButton from '@/components/base/BaseButton.vue'
  export default {
    name: 'Surveys',
    components: {
      BaseButton
    },
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
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 1.3rem;
    margin: 0;
  }
  
  .survey-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .filter-select {
    min-width: 180px;
  }
  
  .survey-list {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  .survey-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .survey-card h3 {
    margin-bottom: 0.5rem;
  }
  
  .survey-desc {
    color: var(--text-muted);
  }
  
  .survey-stats {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  </style>
  
