<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="app-shell">
    <Header class="app-header" />
    <TabBar />
    <div class="app-content">
      <Sidebar />
      <main class="app-main">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
import TabBar from '@/components/TabBar.vue';

export default {
  name: 'MainLayout',
  components: {
    Header,
    Sidebar,
    Footer,
    TabBar
  }
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 90;
}
</style>
