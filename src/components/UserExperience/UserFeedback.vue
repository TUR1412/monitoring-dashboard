<!-- src/components/UserExperience/UserFeedback.vue -->
<template>
    <div class="user-feedback">
      <h2 class="text-2xl font-bold mb-4">用户反馈</h2>
      <div class="feedback-container">
        <!-- 反馈统计信息 -->
        <div class="feedback-stats grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="stat-card bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">总反馈数</h3>
            <p class="text-3xl">{{ totalFeedback }}</p>
          </div>
          <div class="stat-card bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">平均评分</h3>
            <p class="text-3xl">{{ averageRating }}/5</p>
          </div>
        </div>
  
        <!-- 最近的用户反馈列表 -->
        <div class="feedback-list">
          <h3 class="text-xl font-semibold mb-4">最近反馈</h3>
          <ul>
            <li v-for="feedback in recentFeedback" :key="feedback.id" class="feedback-item mb-4 p-4 bg-white rounded-lg shadow">
              <span class="rating font-semibold">{{ feedback.rating }}/5</span>
              <p class="comment mt-2">{{ feedback.comment }}</p>
              <small class="date text-gray-500">{{ feedback.date }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserFeedback',
    data() {
      return {
        totalFeedback: 0,
        averageRating: 0,
        recentFeedback: []
      }
    },
    created() {
      // 模拟数据 - 在实际项目中请替换为API调用
      this.totalFeedback = 150
      this.averageRating = 4.2
      this.recentFeedback = [
        { id: 1, rating: 5, comment: '系统性能非常出色！', date: '2024-03-20' },
        { id: 2, rating: 4, comment: '用户界面非常直观。', date: '2024-03-19' },
        { id: 3, rating: 3, comment: '偶尔会遇到小问题。', date: '2024-03-18' },
        { id: 4, rating: 5, comment: '非常满意的使用体验！', date: '2024-03-17' }
      ]
    }
  }
  </script>
  
  <style scoped>
  .user-feedback {
    background-color: var(--background-color);
    color: var(--text-color);
  }
  
  .user-feedback h2 {
    margin-bottom: 1.5rem;
  }
  
  .feedback-container {
    background-color: var(--surface-1);
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
  }
  
  .feedback-stats {
    display: grid;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
    background-color: rgba(148, 163, 184, 0.08);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
  }
  
  .stat-card h3 {
    margin-bottom: 0.5rem;
  }
  
  .text-3xl {
    font-size: 2rem;
  }
  
  .feedback-list h3 {
    margin-bottom: 1rem;
  }
  
  .feedback-item {
    padding: 1rem;
    background-color: rgba(148, 163, 184, 0.08);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
  }
  
  .feedback-item .rating {
    font-size: 1.25rem;
    color: var(--accent-0);
  }
  
  .feedback-item .comment {
    margin-top: 0.5rem;
    color: var(--text-1);
  }
  
  .feedback-item .date {
    display: block;
    margin-top: 0.5rem;
    color: var(--text-3);
  }
  </style>
  
