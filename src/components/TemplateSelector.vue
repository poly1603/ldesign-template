<script setup lang="ts">
/**
 * TemplateSelector - 基于无头逻辑层重构
 * 使用 @ldesign/shared 的协议和逻辑层
 */
import type { DeviceType } from '../types'
import { computed, inject, ref, type Ref, watch } from 'vue'
import type { SelectorConfig, SelectorOption } from '@ldesign/shared/protocols'
import { useHeadlessSelector, useResponsivePopup } from '@ldesign/shared/composables'
import { renderIcon } from '@ldesign/shared/icons'
import { useTemplateList } from '../composables'
import { getLocale } from '../locales'
import { useTemplatePlugin } from '../plugin/useTemplatePlugin'

interface Props {
  category: string
  device: DeviceType
  currentTemplate: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [templateName: string]
}>()

// 获取语言配置
const plugin = useTemplatePlugin()
const locale = plugin?.currentLocale || inject<Ref<string>>('locale', ref('zh-CN'))
const messages = computed(() => {
  const localeValue = typeof locale.value === 'string' ? locale.value : 'zh-CN'
  return getLocale(localeValue)
})

// 获取当前分类和设备下的所有模板
const { templates: allTemplates } = useTemplateList()

const templates = computed(() => {
  return allTemplates.value.filter(
    t => t.category === props.category && t.device === props.device
  )
})

const deviceLabel = computed(() => {
  return messages.value.device[props.device] || props.device
})

// 选择器配置（遵循协议）
const config: SelectorConfig = {
  icon: 'LayoutTemplate',
  popupMode: 'auto',
  listStyle: 'card',
  searchable: false,
  breakpoint: 768
}

// 转换为 SelectorOption 格式
const options = computed<SelectorOption[]>(() => {
  return templates.value.map(template => ({
    value: template.name,
    label: template.displayName,
    description: template.description || '',
    badge: template.isDefault 
      ? (messages.value.device.desktop === '桌面端' ? '默认' : 'Default') 
      : undefined,
    metadata: {
      isDefault: template.isDefault,
      category: template.category,
      device: template.device
    }
  }))
})

// 处理选择
const handleSelect = (value: string) => {
  emit('select', value)
}

// 使用无头选择器
const { state, actions, triggerRef, panelRef } = useHeadlessSelector({
  options,
  modelValue: computed(() => props.currentTemplate),
  searchable: config.searchable,
  onSelect: handleSelect
})

// 使用响应式弹出
const { currentMode, popupStyle } = useResponsivePopup({
  mode: config.popupMode,
  triggerRef,
  panelRef,
  placement: 'bottom-end',
  breakpoint: config.breakpoint,
  isOpen: computed(() => state.value.isOpen)
})

// 设备切换时自动关闭
watch(() => props.device, () => {
  actions.close()
})
</script>

<template>
  <div class="template-selector">
    <!-- 触发按钮 -->
    <button 
      ref="triggerRef"
      class="toggle-btn" 
      :title="state.isOpen ? messages.actions.clearCache : messages.actions.selectTemplate"
      @click="actions.toggle"
    >
      <svg v-if="!state.isOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="7" rx="1" stroke-width="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2" />
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>

    <!-- 选择器面板 -->
    <Teleport to="body">
      <Transition name="selector-panel">
        <div 
          v-if="state.isOpen" 
          ref="panelRef"
          class="selector-panel"
          :class="{ 'selector-panel-dialog': currentMode === 'dialog' }"
          :style="popupStyle"
          @click.stop
        >
          <div class="panel-header">
            <h3>{{ messages.actions.selectTemplate }}</h3>
            <div class="current-info">
              <span class="badge">{{ deviceLabel }}</span>
              <span class="badge">{{ messages.category[category] || category }}</span>
            </div>
          </div>

          <div class="template-list">
            <div 
              v-for="(option, index) in state.filteredOptions" 
              :key="option.value" 
              class="template-item"
              :class="{ 
                'active': state.selectedValue === option.value,
                'hover': state.activeIndex === index
              }" 
              @click="actions.select(option.value)"
              @mouseenter="state.activeIndex = index"
            >
              <div class="template-name">
                {{ option.label }}
                <span v-if="option.badge" class="default-badge">{{ option.badge }}</span>
              </div>
              <div v-if="option.description" class="template-desc">
                {{ option.description }}
              </div>
            </div>

            <div v-if="state.filteredOptions.length === 0" class="empty-state">
              {{ messages.messages.noTemplates }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.template-selector {
  position: relative;
  display: inline-block;
}

.toggle-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.95);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.toggle-btn:hover {
  background: rgba(102, 126, 234, 1);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.selector-panel {
  width: 320px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.selector-panel-dialog {
  max-width: 90vw;
  max-height: 80vh;
}

/* 面板动画 */
.selector-panel-enter-active,
.selector-panel-leave-active {
  transition: all 0.3s ease;
}

.selector-panel-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.selector-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.panel-header {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-header h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.current-info {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
}

.template-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.template-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.template-item:hover,
.template-item.hover {
  border-color: #667eea;
  background: #f5f7ff;
  transform: translateX(4px);
}

.template-item.active {
  border-color: #667eea;
  background: #e8ecff;
}

.template-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.default-badge {
  padding: 2px 6px;
  background: #67c23a;
  color: white;
  border-radius: 10px;
  font-size: 11px;
}

.template-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 滚动条样式 */
.template-list::-webkit-scrollbar {
  width: 6px;
}

.template-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.template-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.template-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
