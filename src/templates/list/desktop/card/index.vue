<template>
  <div class="ldesign-list-card">
    <div v-if="title || $slots.header" class="list-header">
      <slot name="header">
        <h2 v-if="title" class="list-title">{{ title }}</h2>
        <p v-if="description" class="list-description">{{ description }}</p>
      </slot>
      
      <div v-if="showSearch || showFilters" class="list-toolbar">
        <input
          v-if="showSearch"
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="searchPlaceholder || '搜索...'"
        >
        <slot name="filters" />
      </div>
    </div>

    <div
      v-if="filteredItems.length > 0"
      :class="['list-grid', `columns-${columns}`]"
      :style="gridStyle"
    >
      <div
        v-for="(item, index) in paginatedItems"
        :key="getItemKey(item, index)"
        class="list-item"
      >
        <slot name="item" :item="item" :index="index">
          <div class="card">
            <div v-if="item.image" class="card-image">
              <img :src="item.image" :alt="item.title || ''" loading="lazy">
            </div>
            <div class="card-content">
              <h3 v-if="item.title" class="card-title">{{ item.title }}</h3>
              <p v-if="item.description" class="card-description">{{ item.description }}</p>
              <div v-if="item.meta" class="card-meta">
                <span v-for="(value, key) in item.meta" :key="key" class="meta-item">
                  {{ value }}
                </span>
              </div>
            </div>
            <div v-if="item.actions || $slots['item-actions']" class="card-actions">
              <slot name="item-actions" :item="item" :index="index">
                <button
                  v-for="action in item.actions"
                  :key="action.label"
                  class="action-btn"
                  @click="() => handleAction(action, item)"
                >
                  {{ action.label }}
                </button>
              </slot>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <div v-else class="list-empty">
      <slot name="empty">
        <p>{{ emptyText || '暂无数据' }}</p>
      </slot>
    </div>

    <div v-if="showPagination && totalPages > 1" class="list-pagination">
      <slot name="pagination" :page="currentPage" :total="totalPages" :go-to-page="goToPage">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          上一页
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          下一页
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface ListItem {
  id?: string | number
  title?: string
  description?: string
  image?: string
  meta?: Record<string, any>
  actions?: Array<{ label: string; handler?: () => void }>
  [key: string]: any
}

interface Props {
  title?: string
  description?: string
  items?: ListItem[]
  columns?: number
  gap?: number
  showSearch?: boolean
  searchPlaceholder?: string
  showFilters?: boolean
  showPagination?: boolean
  pageSize?: number
  emptyText?: string
  itemKey?: string | ((item: ListItem) => string | number)
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  columns: 3,
  gap: 16,
  showSearch: false,
  showFilters: false,
  showPagination: true,
  pageSize: 12,
})

const emit = defineEmits<{
  action: [action: any, item: ListItem]
  search: [query: string]
  pageChange: [page: number]
}>()

const searchQuery = ref('')
const currentPage = ref(1)

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  
  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item =>
    item.title?.toLowerCase().includes(query) ||
    item.description?.toLowerCase().includes(query)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredItems.value.length / props.pageSize)
)

const paginatedItems = computed(() => {
  if (!props.showPagination) return filteredItems.value
  
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredItems.value.slice(start, end)
})

const gridStyle = computed(() => ({
  gap: `${props.gap}px`,
}))

const getItemKey = (item: ListItem, index: number): string | number => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  if (props.itemKey && item[props.itemKey]) {
    return item[props.itemKey]
  }
  return item.id || index
}

const handleAction = (action: any, item: ListItem) => {
  emit('action', action, item)
  action.handler?.()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('pageChange', page)
  }
}
</script>

<style scoped>
.ldesign-list-card {
  width: 100%;
  padding: var(--template-spacing-2xl);
}

.list-header {
  margin-bottom: var(--template-spacing-2xl);
}

.list-title {
  font-size: var(--template-font-2xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
  margin: 0 0 var(--template-spacing-md) 0;
}

.list-description {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  margin: 0 0 var(--template-spacing-xl) 0;
}

.list-toolbar {
  display: flex;
  gap: var(--template-spacing-lg);
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: var(--template-spacing-md) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  border-radius: var(--template-form-input-radius);
  font-size: var(--template-font-base);
  color: var(--template-text-primary);
  background: var(--template-bg-container);
  transition: var(--template-transition-border);
}

.search-input::placeholder {
  color: var(--template-text-placeholder);
}

.search-input:focus {
  outline: none;
  border-color: var(--template-border-input-focus);
}

.list-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns, 3), 1fr);
}

.list-grid.columns-1 { --columns: 1; }
.list-grid.columns-2 { --columns: 2; }
.list-grid.columns-3 { --columns: 3; }
.list-grid.columns-4 { --columns: 4; }

.card {
  background: var(--template-bg-container);
  border-radius: var(--template-radius-lg);
  overflow: hidden;
  box-shadow: var(--template-shadow-sm);
  transition: var(--template-transition-transform), var(--template-transition-all);
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--template-shadow-md);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--template-bg-component);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: var(--template-spacing-xl);
  flex: 1;
}

.card-title {
  font-size: var(--template-font-md);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
  margin: 0 0 var(--template-spacing-md) 0;
}

.card-description {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  margin: 0 0 var(--template-spacing-lg) 0;
  line-height: var(--template-line-normal);
}

.card-meta {
  display: flex;
  gap: var(--template-spacing-lg);
  flex-wrap: wrap;
}

.meta-item {
  font-size: var(--template-font-sm);
  color: var(--template-text-tertiary);
}

.card-actions {
  padding: var(--template-spacing-lg) var(--template-spacing-xl);
  border-top: var(--template-border-width-thin) solid var(--template-border-lighter);
  display: flex;
  gap: var(--template-spacing-md);
  justify-content: flex-end;
}

.action-btn {
  padding: var(--template-spacing-sm) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-sm);
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  font-size: var(--template-font-sm);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.action-btn:hover {
  background: var(--template-bg-component-hover);
  border-color: var(--template-border-dark);
}

.list-empty {
  text-align: center;
  padding: var(--template-spacing-4xl) var(--template-spacing-2xl);
  color: var(--template-text-tertiary);
}

.list-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--template-spacing-lg);
  margin-top: var(--template-spacing-2xl);
}

.list-pagination button {
  padding: var(--template-spacing-md) var(--template-spacing-xl);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-form-input-radius);
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.list-pagination button:hover:not(:disabled) {
  background: var(--template-bg-component-hover);
  border-color: var(--template-border-dark);
}

.list-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .list-grid.columns-4,
  .list-grid.columns-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .list-grid {
    grid-template-columns: 1fr;
  }
  
  .ldesign-list-card {
    padding: var(--template-spacing-xl);
  }
}
</style>



