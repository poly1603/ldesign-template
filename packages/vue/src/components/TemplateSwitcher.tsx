/**
 * TemplateSwitcher 组件
 * 模板切换器,提供图标按钮和下拉面板用于切换模板
 *
 * @example
 * ```tsx
 * <TemplateSwitcher category="layout" />
 * ```
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异,禁用类型检查以避免误报
import { computed, defineComponent, h, onMounted, onUnmounted, ref, Transition } from 'vue'
import type { PropType } from 'vue'
import { Layout } from 'lucide-vue-next'
import { useTemplate } from '../composables/useTemplate'
import { useTemplateList } from '../composables/useTemplateList'
import TemplateSelector from './TemplateSelector.vue'
import './TemplateSwitcher.css'

export const TemplateSwitcher = defineComponent({
  name: 'TemplateSwitcher',

  props: {
    /**
     * 模板分类
     */
    category: {
      type: String as PropType<string>,
      default: 'layout'
    },

    /**
     * 翻译函数
     */
    translate: {
      type: Function as PropType<(key: string) => string>,
      default: undefined
    }
  },

  setup(props) {
    // 使用模板管理
    const { template, load: loadTemplate } = useTemplate(props.category, { immediate: true })
    const { templates } = useTemplateList(props.category)

    // 下拉菜单状态
    const isOpen = ref(false)

    /**
     * 当前模板 ID
     */
    const currentTemplateId = computed(() => template.value?.id || '')

    /**
     * 当前模板信息
     */
    const currentTemplate = computed(() => {
      return templates.value.find(t => t.id === currentTemplateId.value)
    })

    /**
     * 切换下拉菜单
     */
    const toggleDropdown = (e: MouseEvent) => {
      e.stopPropagation() // 阻止事件冒泡
      isOpen.value = !isOpen.value
    }

    /**
     * 选择模板
     */
    const selectTemplate = (templateId: string) => {
      loadTemplate(templateId, 'user')
      isOpen.value = false
    }

    /**
     * 点击外部关闭下拉菜单
     */
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.ld-template-switcher')) {
        isOpen.value = false
      }
    }

    // 挂载时添加事件监听(延迟添加,避免与按钮点击冲突)
    onMounted(() => {
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.addEventListener('click', handleClickOutside)
        }, 0)
      }
    })

    // 卸载时移除事件监听
    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickOutside)
      }
    })

    return () => (
      <div class="ld-template-switcher">
        <button
          class="template-button"
          title={props.translate?.('template.selectLayout') || '选择布局'}
          onClick={toggleDropdown}
        >
          <Layout size={18} strokeWidth={2} />
        </button>

        <Transition name="dropdown">
          {isOpen.value && (
            <div class="template-dropdown" onClick={(e: MouseEvent) => e.stopPropagation()}>
              <div class="dropdown-header">
                <span class="dropdown-title">{props.translate?.('template.selectLayout') || '选择布局'}</span>
              </div>
              <div class="dropdown-content">
                {h(TemplateSelector, {
                  category: props.category,
                  modelValue: currentTemplateId.value,
                  showPreview: false,
                  showDescription: true,
                  'onUpdate:modelValue': selectTemplate
                })}
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  }
})

export default TemplateSwitcher
