<script setup lang="ts">
/**
 * 模板选择器组件
 *
 * 支持多语言实时切换，通过监听 i18n 的 localeChanged 事件实现响应式更新
 */
import { computed, getCurrentInstance, inject, onUnmounted, ref } from 'vue'
import type { DeviceType } from '@ldesign/template-core'
import { useTemplateList } from '../composables/useTemplateList'
import { useAutoDevice } from '../composables/useAutoDevice'
import { getTemplateLocaleManager } from '../plugins/engine-plugin'

/** i18n Symbol key (需要与 @ldesign/i18n-vue 保持一致) */
const I18N_SYMBOL = Symbol.for('i18n')

/** 获取 locale manager 实例 */
const localeManager = getTemplateLocaleManager()

/** 当前语言 ref，用于触发响应式更新 */
const localeRef = ref<string>(localeManager.getLocale())

/** 事件清理函数 */
let cleanupFn: (() => void) | null = null

// 尝试获取 i18n 实例并监听语言变化
try {
  // 1. 尝试从 Symbol inject 获取（优先）
  let i18nInstance: any = inject(I18N_SYMBOL, null)

  // 2. 尝试从字符串 key inject 获取
  if (!i18nInstance) {
    i18nInstance = inject('i18n', null)
  }

  // 3. 尝试从 globalProperties 获取
  if (!i18nInstance) {
    const instance = getCurrentInstance()
    const globalProperties = instance?.appContext?.config?.globalProperties
    i18nInstance = globalProperties?.$i18n
  }

  // 如果找到 i18n 实例，监听 locale 变化
  if (i18nInstance) {
    // 初始化 locale
    const initialLocale = i18nInstance.getLocale?.() || i18nInstance.locale || 'zh-CN'
    localeRef.value = initialLocale
    localeManager.setLocale(initialLocale)

    // 监听 locale 变化事件
    if (i18nInstance.on) {
      const handler = ({ locale }: { locale: string }) => {
        localeRef.value = locale
        localeManager.setLocale(locale)
      }
      i18nInstance.on('localeChanged', handler)
      // 保存清理函数
      cleanupFn = () => {
        if (i18nInstance.off) {
          i18nInstance.off('localeChanged', handler)
        }
      }
    }
  }
}
catch (e) {
  // 忽略错误，使用 fallback
  console.warn('[TemplateSelector] Failed to get i18n instance:', e)
}

// 组件卸载时清理事件监听
onUnmounted(() => {
  cleanupFn?.()
})

/**
 * 响应式翻译函数
 * 依赖 localeRef 以触发重新计算
 */
function t(key: string): string {
  // 强制依赖 localeRef 以触发重新计算
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _currentLocale = localeRef.value
  return localeManager.t(key)
}

/**
 * 获取模板的翻译显示名称
 * @param templateName - 模板名称
 * @param fallback - 备用显示名称
 */
function getTemplateDisplayName(templateName: string, fallback?: string): string {
  // 强制依赖 localeRef 以触发重新计算
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _currentLocale = localeRef.value
  return localeManager.getTemplateDisplayName(templateName, fallback)
}

/**
 * 获取模板的翻译描述
 * @param templateName - 模板名称
 * @param fallback - 备用描述
 */
function getTemplateDescription(templateName: string, fallback?: string): string {
  // 强制依赖 localeRef 以触发重新计算
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _currentLocale = localeRef.value
  return localeManager.getTemplateDescription(templateName, fallback)
}

interface Props {
  /**
   * 功能分类
   */
  category: string

  /**
   * 设备类型
   * - 如果不传递，将自动检测当前设备类型
   * - 如果传递了具体值，将使用指定的设备类型
   */
  device?: DeviceType

  /**
   * 当前选中的模板ID
   */
  modelValue?: string

  /**
   * 是否显示预览图
   */
  showPreview?: boolean

  /**
   * 是否显示描述
   */
  showDescription?: boolean

  /**
   * 要排除的模板名称列表
   * 例如: ['blank'] 会排除空白布局
   */
  exclude?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  showPreview: true,
  showDescription: true,
  exclude: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

// 自动设备检测（当 device prop 未传递时使用）
const { deviceType: autoDeviceType } = useAutoDevice()

// 计算实际使用的设备类型：优先使用 prop，其次使用自动检测
const effectiveDevice = computed(() => props.device ?? autoDeviceType.value)

const { templates: allTemplates, loading } = useTemplateList(
  computed(() => props.category),
  effectiveDevice,
)

/**
 * 过滤后的模板列表
 * 排除 exclude 数组中指定的模板名称
 */
const templates = computed(() => {
  if (props.exclude.length === 0) {
    return allTemplates.value
  }
  return allTemplates.value.filter(
    template => !props.exclude.includes(template.name),
  )
})

function selectTemplate(id: string) {
  emit('update:modelValue', id)
  emit('change', id)
}
</script>

<template>
  <div class="template-selector">
    <!-- 加载状态 -->
    <div v-if="loading" class="template-selector__loading">
      <slot name="loading">{{ t('selector.loading') }}</slot>
    </div>

    <!-- 模板列表 -->
    <div v-else-if="templates.length > 0" class="template-selector__list">
      <div v-for="template in templates" :key="template.id" class="template-selector__item"
        :class="{ 'is-active': modelValue === template.id }" @click="selectTemplate(template.id)">
        <!-- 预览图 -->
        <div v-if="showPreview && template.preview" class="template-selector__preview">
          <img :src="template.preview" :alt="getTemplateDisplayName(template.name, template.displayName)" />
        </div>

        <!-- 信息 -->
        <div class="template-selector__info">
          <div class="template-selector__name">
            {{ getTemplateDisplayName(template.name, template.displayName) }}
          </div>

          <div v-if="showDescription" class="template-selector__description">
            {{ getTemplateDescription(template.name, template.description) }}
          </div>

          <!-- 标签 -->
          <div v-if="template.tags && template.tags.length > 0" class="template-selector__tags">
            <span v-for="tag in template.tags" :key="tag" class="template-selector__tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 选中标识 -->
        <div v-if="modelValue === template.id" class="template-selector__check">
          ✓
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="template-selector__empty">
      <slot name="empty">{{ t('selector.empty') }}</slot>
    </div>
  </div>
</template>

<style scoped>
.template-selector {
  width: 100%;
}

.template-selector__loading,
.template-selector__empty {
  padding: var(--size-size-5) var(--size-space-lg);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--size-font-md);
}

.template-selector__list {
  display: flex;
  flex-direction: column;
  gap: var(--size-2, 8px);
}

.template-selector__item {
  position: relative;
  border: 1px solid var(--color-border, #e8e8e8);
  border-radius: var(--size-2, 8px);
  padding: var(--size-4, 16px);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-bg-container, #ffffff);
}

.template-selector__item:hover {
  border-color: var(--color-primary-default, #1890ff);
  background: var(--color-bg-component-hover, #f5f5f5);
}

.template-selector__item.is-active {
  border-color: var(--color-primary-default, #1890ff);
  background: var(--color-primary-lighter, #e6f7ff);
  box-shadow: 0 0 0 2px var(--color-primary-default, #1890ff) inset;
}

.template-selector__preview {
  width: 100%;
  height: 160px;
  margin-bottom: var(--size-space-sm);
  border-radius: var(--size-radius-xs);
  overflow: hidden;
  background: var(--color-bg-component);
}

.template-selector__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-selector__info {
  flex: 1;
}

.template-selector__name {
  font-size: var(--size-font-base, 14px);
  font-weight: 600;
  color: var(--color-text-primary, #333);
  margin-bottom: var(--size-1, 4px);
}

.template-selector__item.is-active .template-selector__name {
  color: var(--color-primary-default, #1890ff);
}

.template-selector__description {
  font-size: var(--size-font-sm, 13px);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--size-2, 8px);
  line-height: 1.5;
}

.template-selector__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-xs);
}

.template-selector__tag {
  display: inline-block;
  padding: var(--size-space-xxs) var(--size-space-xs);
  font-size: var(--size-font-sm);
  color: var(--color-text-tertiary);
  background: var(--color-bg-component);
  border-radius: var(--size-radius-xs);
}

.template-selector__check {
  position: absolute;
  top: var(--size-3, 12px);
  right: var(--size-3, 12px);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-default, #1890ff);
  color: #ffffff;
  border-radius: 50%;
  font-size: var(--size-font-base, 14px);
  font-weight: 600;
}
</style>