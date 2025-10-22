<template>
  <div class="ldesign-list-table">
    <div v-if="title || $slots.header" class="table-header">
      <slot name="header">
        <h2 v-if="title" class="table-title">{{ title }}</h2>
      </slot>
      
      <div v-if="showSearch" class="table-toolbar">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="searchPlaceholder || '搜索...'"
        >
        <slot name="toolbar" />
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width }"
              :class="{ sortable: column.sortable }"
              @click="column.sortable ? handleSort(column.key) : undefined"
            >
              {{ column.label }}
              <span v-if="column.sortable && sortKey === column.key" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columns.length">
              <slot name="loading">
                <div class="loading-text">加载中...</div>
              </slot>
            </td>
          </tr>
          
          <template v-else-if="paginatedItems.length > 0">
            <tr
              v-for="(item, index) in paginatedItems"
              :key="getItemKey(item, index)"
              class="data-row"
              @click="handleRowClick(item, index)"
            >
              <td v-for="column in columns" :key="column.key">
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  {{ formatCell(item[column.key], column) }}
                </slot>
              </td>
            </tr>
          </template>
          
          <tr v-else class="empty-row">
            <td :colspan="columns.length">
              <slot name="empty">
                <div class="empty-text">{{ emptyText || '暂无数据' }}</div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination && totalPages > 1" class="table-pagination">
      <slot name="pagination" :page="currentPage" :total="totalPages" :go-to-page="goToPage">
        <div class="pagination-info">
          显示 {{ startIndex + 1 }}-{{ endIndex }} / 共 {{ filteredItems.length }} 条
        </div>
        <div class="pagination-controls">
          <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            上一页
          </button>
          <span class="page-numbers">
            <button
              v-for="page in pageNumbers"
              :key="page"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </span>
          <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
            下一页
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Column {
  key: string
  label: string
  width?: string
  sortable?: boolean
  formatter?: (value: any) => string
}

interface ListItem {
  id?: string | number
  [key: string]: any
}

interface Props {
  title?: string
  items?: ListItem[]
  columns?: Column[]
  showSearch?: boolean
  searchPlaceholder?: string
  showPagination?: boolean
  pageSize?: number
  emptyText?: string
  loading?: boolean
  itemKey?: string | ((item: ListItem) => string | number)
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  columns: () => [],
  showSearch: false,
  showPagination: true,
  pageSize: 10,
  loading: false,
})

const emit = defineEmits<{
  rowClick: [item: ListItem, index: number]
  sort: [key: string, order: 'asc' | 'desc']
  pageChange: [page: number]
}>()

const searchQuery = ref('')
const currentPage = ref(1)
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const filteredItems = computed(() => {
  let result = props.items
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      props.columns.some(col =>
        String(item[col.key] || '').toLowerCase().includes(query)
      )
    )
  }
  
  // 排序
  if (sortKey.value) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      if (aVal === bVal) return 0
      
      const comparison = aVal > bVal ? 1 : -1
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }
  
  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredItems.value.length / props.pageSize)
)

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() =>
  Math.min(startIndex.value + props.pageSize, filteredItems.value.length)
)

const paginatedItems = computed(() =>
  filteredItems.value.slice(startIndex.value, endIndex.value)
)

const pageNumbers = computed(() => {
  const pages: number[] = []
  const maxPages = 7
  
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (currentPage.value > 3) {
      pages.push(-1) // 省略号
    }
    
    for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(totalPages.value - 1, currentPage.value + 1); i++) {
      pages.push(i)
    }
    
    if (currentPage.value < totalPages.value - 2) {
      pages.push(-1) // 省略号
    }
    
    pages.push(totalPages.value)
  }
  
  return pages
})

const getItemKey = (item: ListItem, index: number): string | number => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  if (props.itemKey && item[props.itemKey]) {
    return item[props.itemKey]
  }
  return item.id || index
}

const formatCell = (value: any, column: Column): string => {
  if (column.formatter) {
    return column.formatter(value)
  }
  return String(value ?? '')
}

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  
  emit('sort', key, sortOrder.value)
}

const handleRowClick = (item: ListItem, index: number) => {
  emit('rowClick', item, index)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('pageChange', page)
  }
}
</script>

<style scoped>
.ldesign-list-table {
  width: 100%;
  padding: 24px;
}

.table-header {
  margin-bottom: 24px;
}

.table-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.table-toolbar {
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

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table thead {
  background: #f9fafb;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: #f3f4f6;
}

.sort-icon {
  margin-left: 4px;
  color: #3b82f6;
}

.data-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}

.data-row {
  transition: background 0.2s;
}

.data-row:hover {
  background: #f9fafb;
  cursor: pointer;
}

.loading-row,
.empty-row {
  text-align: center;
}

.loading-text,
.empty-text {
  padding: 48px 24px;
  color: #9ca3af;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-controls button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-controls button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-numbers {
  display: flex;
  gap: 4px;
}
</style>



