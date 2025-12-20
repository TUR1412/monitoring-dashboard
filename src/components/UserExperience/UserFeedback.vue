<!-- src/components/UserExperience/UserFeedback.vue -->
<template>
    <div class="user-feedback">
      <h2 class="section-title">用户反馈</h2>
      <div class="card feedback-container">
        <!-- 反馈统计信息 -->
        <div class="feedback-stats">
          <div class="card stat-card">
            <h3>总反馈数</h3>
            <p class="stat-value">{{ totalFeedback }}</p>
          </div>
          <div class="card stat-card">
            <h3>平均评分</h3>
            <p class="stat-value">{{ averageRating }}/5</p>
          </div>
        </div>
  
        <!-- 最近的用户反馈列表 -->
        <div class="feedback-list">
          <h3 class="section-subtitle">最近反馈</h3>
          <ul>
            <li v-for="feedback in recentFeedback" :key="feedback.id" class="card feedback-item">
              <span class="rating font-semibold">{{ feedback.rating }}/5</span>
              <p class="comment mt-2">{{ feedback.comment }}</p>
              <small class="date">{{ feedback.date }}</small>
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
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .feedback-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .feedback-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .stat-card h3 {
    margin-bottom: 0.5rem;
    color: var(--text-muted);
  }
  
  .stat-value {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-strong);
  }
  
  .feedback-list h3 {
    margin-bottom: 1rem;
  }
  
  .feedback-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1rem;
  }
  
  .feedback-item .rating {
    font-size: 1.25rem;
    color: var(--neon-blue);
  }
  
  .feedback-item .comment {
    color: var(--text-color);
  }
  
  .feedback-item .date {
    display: block;
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .section-title {
    font-size: 1.3rem;
    margin: 0;
  }

  .section-subtitle {
    font-size: 1rem;
    margin: 0 0 0.5rem;
  }
  </style>
  
