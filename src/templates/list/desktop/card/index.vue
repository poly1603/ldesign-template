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
  padding: 24px;
}

.list-header {
  margin-bottom: 24px;
}

.list-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.list-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.list-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
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
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f3f4f6;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #9ca3af;
}

.card-actions {
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.list-empty {
  text-align: center;
  padding: 48px 24px;
  color: #9ca3af;
}

.list-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.list-pagination button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.list-pagination button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
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
    padding: 16px;
  }
}
</style>



