<template>
  <div class="ldesign-list-table">
    <div v-if="title || $slots.header" class="table-header">
      <slot name="header">
        <h2 v-if="title" class="table-title">{{ title }}</h2>
      </slot>

      <div v-if="showSearch" class="table-toolbar">
        <input v-model="searchQuery" type="text" class="search-input" :placeholder="searchPlaceholder || '搜索...'">
        <slot name="toolbar" />
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :style="{ width: column.width }"
              :class="{ sortable: column.sortable }" @click="column.sortable ? handleSort(column.key) : undefined">
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
            <tr v-for="(item, index) in paginatedItems" :key="getItemKey(item, index)" class="data-row"
              @click="handleRowClick(item, index)">
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
            <button v-for="page in pageNumbers" :key="page" :class="{ active: page === currentPage }"
              @click="goToPage(page)">
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
  padding: var(--template-spacing-2xl);
}

.table-header {
  margin-bottom: var(--template-spacing-2xl);
}

.table-title {
  font-size: var(--template-font-2xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
  margin: 0 0 var(--template-spacing-xl) 0;
}

.table-toolbar {
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

.table-container {
  overflow-x: auto;
  border-radius: var(--template-radius-lg);
  border: var(--template-border-width-thin) solid var(--template-list-border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--template-bg-container);
}

.data-table thead {
  background: var(--template-list-header-bg);
}

.data-table th {
  padding: var(--template-list-cell-padding);
  text-align: left;
  font-weight: var(--template-font-weight-semibold);
  font-size: var(--template-font-sm);
  color: var(--template-text-primary);
  border-bottom: var(--template-border-width-medium) solid var(--template-list-border);
  white-space: nowrap;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: var(--template-bg-component-hover);
}

.sort-icon {
  margin-left: var(--template-spacing-xs);
  color: var(--template-primary);
}

.data-table td {
  padding: var(--template-list-cell-padding);
  font-size: var(--template-font-base);
  color: var(--template-text-primary);
  border-bottom: var(--template-border-width-thin) solid var(--template-list-border);
}

.data-row {
  transition: var(--template-transition-bg);
}

.data-row:hover {
  background: var(--template-list-row-hover-bg);
  cursor: pointer;
}

.loading-row,
.empty-row {
  text-align: center;
}

.loading-text,
.empty-text {
  padding: var(--template-spacing-4xl) var(--template-spacing-2xl);
  color: var(--template-text-tertiary);
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--template-spacing-2xl);
}

.pagination-info {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.pagination-controls {
  display: flex;
  gap: var(--template-spacing-md);
  align-items: center;
}

.pagination-controls button {
  padding: var(--template-spacing-sm) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-sm);
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  font-size: var(--template-font-sm);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.pagination-controls button:hover:not(:disabled) {
  background: var(--template-bg-component-hover);
  border-color: var(--template-border-dark);
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button.active {
  background: var(--template-primary);
  color: var(--template-text-inverse);
  border-color: var(--template-primary);
}

.page-numbers {
  display: flex;
  gap: var(--template-spacing-xs);
}
</style>
