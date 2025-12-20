<!-- src/views/LoginPage.vue -->
<template>
    <div class="login-page">
      <Login />
    </div>
  </template>
  
  <script>
  import Login from '../components/Login.vue'
  
  export default {
    name: 'LoginPage',
    components: {
      Login
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
  }
  </style>
  
