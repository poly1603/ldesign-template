// 模板入口文件
// 自动导出所有模板配置

// Desktop 登录模板
export * from './login/desktop/default'
export * from './login/desktop/modern'

// Mobile 登录模板
export * from './login/mobile/card'
export * from './login/mobile/default'

// Tablet 登录模板
export * from './login/tablet/default'
export * from './login/tablet/split'

// 模板配置汇总
export const templateConfigs = [
  // Desktop
  () => import('./login/desktop/default').then(m => m.config),
  () => import('./login/desktop/modern').then(m => m.config),

  // Mobile
  () => import('./login/mobile/default').then(m => m.config),
  () => import('./login/mobile/card').then(m => m.config),

  // Tablet
  () => import('./login/tablet/default').then(m => m.config),
  () => import('./login/tablet/split').then(m => m.config),
]

// 模板分类
export const templateCategories = {
  login: {
    name: '登录模板',
    description: '用户登录相关的模板',
    icon: 'fas fa-sign-in-alt'
  },
  register: {
    name: '注册模板',
    description: '用户注册相关的模板',
    icon: 'fas fa-user-plus'
  },
  dashboard: {
    name: '仪表板模板',
    description: '数据展示和管理界面模板',
    icon: 'fas fa-tachometer-alt'
  }
}

// 设备类型配置
export const deviceTypes = {
  desktop: {
    name: '桌面端',
    description: '适用于桌面浏览器',
    icon: 'fas fa-desktop',
    breakpoint: '1024px'
  },
  tablet: {
    name: '平板端',
    description: '适用于平板设备',
    icon: 'fas fa-tablet-alt',
    breakpoint: '768px'
  },
  mobile: {
    name: '移动端',
    description: '适用于手机设备',
    icon: 'fas fa-mobile-alt',
    breakpoint: '480px'
  }
}

// 默认配置
export const defaultConfig = {
  autoDetectDevice: true,
  fallbackTemplate: 'default',
  enableCache: true,
  cacheExpiry: 3600000, // 1小时
  preloadTemplates: true
}

// 工具函数
export const getTemplatesByDevice = (device: string) => {
  return templateConfigs.filter(async (configLoader) => {
    const config = await configLoader()
    return config.device === device
  })
}

export const getTemplatesByCategory = (category: string) => {
  return templateConfigs.filter(async (configLoader) => {
    const config = await configLoader()
    return config.category === category
  })
}

export const getDefaultTemplate = (category: string, device: string) => {
  return templateConfigs.find(async (configLoader) => {
    const config = await configLoader()
    return config.category === category &&
      config.device === device &&
      config.templateName === 'default'
  })
}
