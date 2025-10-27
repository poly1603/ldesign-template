<template>
  <div
    ref="containerRef"
    class="virtual-scroll-container"
    :style="containerStyle"
    @scroll="handleScroll"
  >
    <!-- 占位高度 -->
    <div :style="{ height: `${totalHeight}px` }" />
    
    <!-- 渲染区域 -->
    <div
      class="virtual-scroll-content"
      :style="contentStyle"
    >
      <div
        v-for="item in visibleItems"
        :key="item[keyProp]"
        :data-index="item.__index"
        :style="getItemStyle(item.__index)"
      >
        <slot :item="item" :index="item.__index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce, throttle } from '../utils/performance'

interface Props {
  /** 数据源 */
  items: any[]
  /** 每项高度（固定高度模式） */
  itemHeight?: number
  /** 动态高度函数 */
  getItemHeight?: (index: number) => number
  /** 容器高度 */
  height?: number | string
  /** 缓冲区大小（渲染额外的项） */
  buffer?: number
  /** key属性名 */
  keyProp?: string
  /** 预加载阈值 */
  preloadThreshold?: number
  /** 是否启用对象池 */
  usePool?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 50,
  height: '100%',
  buffer: 3,
  keyProp: 'id',
  preloadThreshold: 200,
  usePool: true
})

const emit = defineEmits<{
  scrollEnd: []
  scrollStart: []
  reachBottom: []
}>()

// DOM引用
const containerRef = ref<HTMLElement>()

// 状态
const scrollTop = ref(0)
const containerHeight = ref(0)
const startIndex = ref(0)
const endIndex = ref(0)
const itemHeightCache = new Map<number, number>()

// 对象池（复用DOM节点）
const nodePool: HTMLElement[] = []
const maxPoolSize = 50

/**
 * 获取项目高度（支持缓存）
 */
function getCachedItemHeight(index: number): number {
  if (props.getItemHeight) {
    if (!itemHeightCache.has(index)) {
      itemHeightCache.set(index, props.getItemHeight(index))
    }
    return itemHeightCache.get(index)!
  }
  return props.itemHeight
}

/**
 * 计算总高度
 */
const totalHeight = computed(() => {
  if (props.getItemHeight) {
    let height = 0
    for (let i = 0; i < props.items.length; i++) {
      height += getCachedItemHeight(i)
    }
    return height
  }
  return props.items.length * props.itemHeight
})

/**
 * 计算可见项
 */
const visibleItems = computed(() => {
  const items = []
  for (let i = startIndex.value; i <= endIndex.value && i < props.items.length; i++) {
    items.push({
      ...props.items[i],
      __index: i
    })
  }
  return items
})

/**
 * 容器样式
 */
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  overflow: 'auto',
  position: 'relative' as const
}))

/**
 * 内容样式
 */
const contentStyle = computed(() => {
  let offsetY = 0
  
  if (props.getItemHeight) {
    for (let i = 0; i < startIndex.value; i++) {
      offsetY += getCachedItemHeight(i)
    }
  } else {
    offsetY = startIndex.value * props.itemHeight
  }
  
  return {
    transform: `translateY(${offsetY}px)`,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0
  }
})

/**
 * 获取单项样式
 */
function getItemStyle(index: number) {
  if (props.getItemHeight) {
    return {
      height: `${getCachedItemHeight(index)}px`
    }
  }
  return undefined
}

/**
 * 计算可见范围
 */
function calculateRange() {
  if (!containerRef.value) return
  
  const container = containerRef.value
  scrollTop.value = container.scrollTop
  containerHeight.value = container.clientHeight
  
  // 固定高度模式
  if (!props.getItemHeight) {
    startIndex.value = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
    endIndex.value = Math.min(
      props.items.length - 1,
      Math.ceil((scrollTop.value + containerHeight.value) / props.itemHeight) + props.buffer
    )
    return
  }
  
  // 动态高度模式
  let accumulatedHeight = 0
  let start = 0
  let end = props.items.length - 1
  
  // 查找起始索引
  for (let i = 0; i < props.items.length; i++) {
    const height = getCachedItemHeight(i)
    if (accumulatedHeight + height > scrollTop.value - props.buffer * height) {
      start = i
      break
    }
    accumulatedHeight += height
  }
  
  // 查找结束索引
  accumulatedHeight = 0
  for (let i = start; i < props.items.length; i++) {
    if (accumulatedHeight > containerHeight.value + props.buffer * getCachedItemHeight(i)) {
      end = i
      break
    }
    accumulatedHeight += getCachedItemHeight(i)
  }
  
  startIndex.value = start
  endIndex.value = end
}

/**
 * 处理滚动（节流）
 */
const handleScroll = throttle(() => {
  calculateRange()
  
  // 检查是否到达底部
  if (containerRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.value
    
    if (scrollTop === 0) {
      emit('scrollStart')
    }
    
    if (scrollHeight - scrollTop - clientHeight < props.preloadThreshold) {
      emit('reachBottom')
    }
    
    if (scrollTop + clientHeight >= scrollHeight) {
      emit('scrollEnd')
    }
  }
}, 16) // 约60fps

/**
 * 滚动到指定索引
 */
function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
  if (!containerRef.value) return
  
  let offset = 0
  
  if (props.getItemHeight) {
    for (let i = 0; i < index; i++) {
      offset += getCachedItemHeight(i)
    }
  } else {
    offset = index * props.itemHeight
  }
  
  containerRef.value.scrollTo({
    top: offset,
    behavior
  })
}

/**
 * 滚动到顶部
 */
function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  containerRef.value?.scrollTo({
    top: 0,
    behavior
  })
}

/**
 * 滚动到底部
 */
function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  containerRef.value?.scrollTo({
    top: totalHeight.value,
    behavior
  })
}

/**
 * 刷新高度缓存
 */
function refreshHeightCache() {
  itemHeightCache.clear()
  calculateRange()
}

// 监听数据变化
watch(() => props.items, () => {
  calculateRange()
}, { deep: false })

// 监听容器尺寸变化
const resizeObserver = new ResizeObserver(
  debounce(() => {
    calculateRange()
  }, 100)
)

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
    calculateRange()
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
  resizeObserver.disconnect()
  
  // 清理对象池
  nodePool.length = 0
  itemHeightCache.clear()
})

// 暴露方法
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  refreshHeightCache,
  getScrollTop: () => scrollTop.value,
  getVisibleRange: () => ({ start: startIndex.value, end: endIndex.value })
})
</script>

<style scoped>
.virtual-scroll-container {
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.virtual-scroll-content {
  will-change: transform;
}

/* 优化滚动性能 */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>

