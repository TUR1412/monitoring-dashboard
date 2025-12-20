<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="app-shell">
    <Header class="app-header" @open-command="openPalette" />
    <TabBar />
    <CommandPalette
      :open="paletteOpen"
      :initial-query="paletteQuery"
      @close="closePalette"
    />
    <div class="app-content">
      <Sidebar />
      <main class="app-main">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import TabBar from '@/components/TabBar.vue'
import CommandPalette from '@/components/CommandPalette.vue'

const paletteOpen = ref(false)
const paletteQuery = ref('')

const openPalette = (initialQuery = '') => {
  paletteQuery.value = initialQuery || ''
  paletteOpen.value = true
}

const closePalette = () => {
  paletteOpen.value = false
  paletteQuery.value = ''
}

const handleGlobalShortcut = (event) => {
  const key = event.key?.toLowerCase()
  if ((event.ctrlKey || event.metaKey) && key === 'k') {
    event.preventDefault()
    openPalette()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalShortcut)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 90;
}
</style>
