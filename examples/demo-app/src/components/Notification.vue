<template>
  <Transition name="notification" appear>
    <div class="notification" :class="type">
      <div class="notification-icon">
        <i :class="getIcon()"></i>
      </div>
      
      <div class="notification-content">
        <div class="notification-message">{{ message }}</div>
      </div>
      
      <button @click="$emit('close')" class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const props = defineProps<Props>()

defineEmits<{
  close: []
}>()

const getIcon = () => {
  switch (props.type) {
    case 'success':
      return 'fas fa-check-circle'
    case 'error':
      return 'fas fa-exclamation-circle'
    case 'warning':
      return 'fas fa-exclamation-triangle'
    case 'info':
      return 'fas fa-info-circle'
    default:
      return 'fas fa-info-circle'
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-weight: 500;
}

.notification.success {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.notification.error {
  background: linear-gradient(135deg, #dc3545, #e74c3c);
}

.notification.warning {
  background: linear-gradient(135deg, #ffc107, #f39c12);
  color: #212529;
}

.notification.info {
  background: linear-gradient(135deg, #17a2b8, #3498db);
}

.notification-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-message {
  margin: 0;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

/* 动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式 */
@media (max-width: 768px) {
  .notification {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
