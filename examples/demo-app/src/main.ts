import { createApp } from 'vue'
import App from './App.vue'
import LDesignTemplate from '@ldesign/template'

// 导入样式
import './style.css'

const app = createApp(App)

// 安装 LDesign Template 插件
app.use(LDesignTemplate, {
  autoScan: true,              // 自动扫描模板
  enableDeviceDetection: true, // 启用设备检测
  enableCache: true,           // 启用缓存
  enableStorage: true,         // 启用本地存储
  storageKey: 'ldesign-template-demo',
  deviceBreakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  }
})

app.mount('#app')
