<script setup lang="ts">
/**
 * 设备不支持提示组件
 *
 * 当模板不支持当前设备类型时显示此组件
 */
import type { DeviceType } from '../types/config'

/** 组件属性 */
interface Props {
  /** 模板分类 */
  category: string
  /** 设备类型 */
  device: DeviceType
  /** 提示消息 */
  message?: string
  /** 图标（emoji 或 icon class） */
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  icon: '🚫',
})

/** 设备类型显示名称 */
const deviceNames: Record<DeviceType, string> = {
  desktop: '桌面端',
  tablet: '平板端',
  mobile: '移动端',
}

/** 默认提示消息 */
const defaultMessage = `当前 ${props.category} 模板不支持在${deviceNames[props.device]}中使用`
</script>

<template>
  <div class="template-not-supported">
    <div class="not-supported-content">
      <div class="not-supported-icon">
        {{ icon }}
      </div>
      <h2 class="not-supported-title">
        设备不支持
      </h2>
      <p class="not-supported-message">
        {{ message || defaultMessage }}
      </p>
      <div class="not-supported-device">
        <span class="device-label">当前设备:</span>
        <span class="device-value">{{ deviceNames[device] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-not-supported {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding: 20px;
  box-sizing: border-box;
}

.not-supported-content {
  text-align: center;
  padding: 48px 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  max-width: 420px;
  width: 100%;
}

.not-supported-icon {
  font-size: 64px;
  margin-bottom: 24px;
  line-height: 1;
}

.not-supported-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
}

.not-supported-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.6;
}

.not-supported-device {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
}

.device-label {
  color: #999;
}

.device-value {
  color: #333;
  font-weight: 500;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .not-supported-content {
    padding: 32px 24px;
  }

  .not-supported-icon {
    font-size: 48px;
  }

  .not-supported-title {
    font-size: 20px;
  }

  .not-supported-message {
    font-size: 14px;
  }
}
</style>

