import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // Vue 编译期 flag：关闭生产 devtools（体积与运行时开销更小）。
  define: {
    __VUE_PROD_DEVTOOLS__: false
  },
  esbuild: {
    // 极限压缩：生产构建移除 console/debugger（如需保留调试输出可移除此项）。
    drop: ['console', 'debugger'],
    legalComments: 'none'
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('chart.js')) return 'vendor-charts'
          if (id.includes('vue')) return 'vendor-vue'
          return 'vendor'
        }
      }
    }
  }
})
