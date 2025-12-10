/**
 * TemplateSwitcher 组件
 * 模板切换器，参考 ThemeColorPicker 设计风格
 * 
 * 功能：
 * - 根据当前设备类型过滤模板列表
 * - 选中后持久化保存（自动通过 useTemplate 的 cache 机制）
 * - 显示选中状态
 *
 * @example
 * ```tsx
 * <TemplateSwitcher category="layout" />
 * <TemplateSwitcher category="layout" :translate="t" :locale="locale" />
 * ```
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异,禁用类型检查以避免误报
import { computed, defineComponent, onMounted, onUnmounted, ref, watch, Transition } from 'vue'
import type { PropType, Ref } from 'vue'
import { Layout, Check, LayoutGrid, Columns2, PanelTop, Menu, TabletSmartphone } from 'lucide-vue-next'
import { useTemplate } from '../composables/useTemplate'
import { useTemplateList } from '../composables/useTemplateList'
import { getTemplateLocale } from '@ldesign/template-core'
import './TemplateSwitcher.css'

/** 模板图标映射 */
const TEMPLATE_ICONS: Record<string, any> = {
  'sidebar': Layout,
  'mix': LayoutGrid,
  'dual-column': Columns2,
  'top-menu': PanelTop,
  'drawer': Menu,
  'tab-bar': TabletSmartphone,
}

/** 设备类型显示名称 */
const DEVICE_LABELS: Record<string, { zh: string, en: string }> = {
  desktop: { zh: '桌面端', en: 'Desktop' },
  tablet: { zh: '平板端', en: 'Tablet' },
  mobile: { zh: '移动端', en: 'Mobile' },
}

export const TemplateSwitcher = defineComponent({
  name: 'TemplateSwitcher',

  props: {
    /** 模板分类 */
    category: {
      type: String as PropType<string>,
      default: 'layout'
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false
    },
    /** 按钮大小 */
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium'
    },
    /** 自定义标题 */
    title: {
      type: String,
      default: undefined
    },
    /** 翻译函数 */
    translate: {
      type: Function as PropType<(key: string) => string>,
      default: undefined
    },
    /** 当前语言 */
    locale: {
      type: [String, Object] as PropType<string | Ref<string>>,
      default: undefined
    }
  },

  setup(props) {
    const containerRef = ref<HTMLElement | null>(null)
    const isOpen = ref(false)

    // 使用模板管理，获取当前设备类型
    const { template, load: loadTemplate, deviceType } = useTemplate(props.category, {
      immediate: true,
      autoDevice: true // 启用自动设备检测
    })

    // 使用当前设备类型获取模板列表
    const { templates, refresh: refreshTemplates } = useTemplateList(props.category, deviceType)

    // 响应式当前模板名称（用于匹配）
    const currentTemplateName = ref<string>('')

    // 当 template 变化时更新 currentTemplateName
    watch(() => template.value, (newTemplate) => {
      if (newTemplate) {
        // 从完整 ID 中提取 name 部分（格式：category:device:name）
        const parts = newTemplate.id.split(':')
        currentTemplateName.value = parts[2] || parts[0] || ''
      }
    }, { immediate: true })

    // 当设备类型变化时刷新模板列表
    watch(deviceType, () => {
      refreshTemplates()
    })

    // 获取当前语言
    const getCurrentLocale = (): string => {
      if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
        return (props.locale as Ref<string>).value
      } else if (typeof props.locale === 'string') {
        return props.locale
      }
      return 'zh-CN'
    }

    // 判断是否中文
    const isZh = computed(() => {
      const locale = getCurrentLocale()
      return locale.toLowerCase().startsWith('zh') || locale.includes('cn')
    })

    // 获取语言包
    const localeData = computed(() => getTemplateLocale(getCurrentLocale()))

    // 设备类型显示
    const deviceLabel = computed(() => {
      const device = deviceType.value || 'desktop'
      return isZh.value ? DEVICE_LABELS[device]?.zh : DEVICE_LABELS[device]?.en
    })

    // 标题文本（包含设备类型）
    const titleText = computed(() => {
      if (props.title) return props.title
      if (props.translate) {
        const translated = props.translate('template.title')
        if (translated && !translated.startsWith('template.')) return translated
      }
      const base = isZh.value ? '布局管理' : 'Layout Management'
      return `${base} (${deviceLabel.value})`
    })

    // 提示文本
    const tooltip = computed(() => {
      if (props.translate) {
        const translated = props.translate('template.switchTemplate')
        if (translated && !translated.startsWith('template.')) return translated
      }
      return localeData.value.selector.switchTemplate
    })

    // 容器类
    const containerClass = computed(() => {
      const classes = ['ldesign-template-switcher']
      if (props.disabled) classes.push('ldesign-template-switcher--disabled')
      return classes.join(' ')
    })

    // 触发器类
    const triggerClass = computed(() => {
      const classes = ['ldesign-template-switcher__trigger']
      if (props.size === 'small') classes.push('ldesign-template-switcher__trigger--small')
      if (props.size === 'large') classes.push('ldesign-template-switcher__trigger--large')
      return classes.join(' ')
    })

    // 获取模板标签
    const getTemplateLabel = (tpl: any): string => {
      // 提取模板名称
      const name = tpl.name || tpl.id.split(':').pop() || tpl.id

      if (props.translate) {
        const translated = props.translate(`template.templates.${name}`)
        if (translated && !translated.startsWith('template.templates.')) return translated
      }
      // 尝试从语言包获取
      const localeTemplate = localeData.value.templates[name]
      if (localeTemplate?.displayName) return localeTemplate.displayName
      return tpl.displayName || name
    }

    // 获取模板描述
    const getTemplateDesc = (tpl: any): string => {
      const name = tpl.name || tpl.id.split(':').pop() || tpl.id

      if (props.translate) {
        const translated = props.translate(`template.templates.${name}.description`)
        if (translated && !translated.startsWith('template.templates.')) return translated
      }
      // 尝试从语言包获取
      const localeTemplate = localeData.value.templates[name]
      if (localeTemplate?.description) return localeTemplate.description
      return tpl.description || ''
    }

    // 获取模板图标
    const getTemplateIcon = (tpl: any) => {
      const name = tpl.name || tpl.id.split(':').pop() || tpl.id
      return TEMPLATE_ICONS[name] || Layout
    }

    // 判断是否为当前选中的模板
    const isActiveTemplate = (tpl: any): boolean => {
      const tplName = tpl.name || tpl.id.split(':').pop() || tpl.id
      return tplName === currentTemplateName.value
    }

    // 选择模板
    const selectTemplate = (tpl: any) => {
      const name = tpl.name || tpl.id.split(':').pop() || tpl.id
      // 构建完整的模板 ID
      const fullId = `${props.category}:${deviceType.value}:${name}`

      console.log('[TemplateSwitcher] selectTemplate:', { name, fullId, deviceType: deviceType.value })

      // 加载模板（source 为 'user' 会自动缓存）
      loadTemplate(fullId, 'user')

      // 更新本地状态
      currentTemplateName.value = name
      isOpen.value = false
    }

    // 点击外部关闭
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return () => (
      <div ref={containerRef} class={containerClass.value}>
        <button
          type="button"
          class={triggerClass.value}
          disabled={props.disabled}
          title={tooltip.value}
          onClick={() => isOpen.value = !isOpen.value}
        >
          <Layout size={18} strokeWidth={2} />
        </button>

        <Transition name="ldesign-dropdown">
          {isOpen.value && (
            <div class="ldesign-template-switcher__dropdown">
              <div class="ldesign-template-switcher__arrow" />
              <div class="ldesign-template-switcher__header">
                <h4 class="ldesign-template-switcher__title">{titleText.value}</h4>
              </div>
              <div class="ldesign-template-switcher__list">
                {templates.value.length === 0 ? (
                  <div class="ldesign-template-switcher__empty">
                    {isZh.value ? '当前设备类型暂无可用布局' : 'No layouts available for current device'}
                  </div>
                ) : (
                  templates.value.map(tpl => {
                    const IconComponent = getTemplateIcon(tpl)
                    const isActive = isActiveTemplate(tpl)
                    return (
                      <div
                        key={tpl.id}
                        class={['ldesign-template-switcher__item', isActive && 'ldesign-template-switcher__item--active']}
                        onClick={() => selectTemplate(tpl)}
                      >
                        <span class="ldesign-template-switcher__item-icon">
                          <IconComponent size={20} strokeWidth={1.5} />
                        </span>
                        <div class="ldesign-template-switcher__item-info">
                          <span class="ldesign-template-switcher__item-label">{getTemplateLabel(tpl)}</span>
                          <span class="ldesign-template-switcher__item-desc">{getTemplateDesc(tpl)}</span>
                        </div>
                        {isActive && (
                          <Check size={16} strokeWidth={3} class="ldesign-template-switcher__check" />
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  }
})

export default TemplateSwitcher
