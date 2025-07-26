<template>
  <div class="template-selector-overlay" @click="handleOverlayClick">
    <div class="template-selector" @click.stop>
      <!-- 头部 -->
      <div class="selector-header">
        <h3 class="selector-title">
          {{ config.title || `选择${categoryDisplayName}模板` }}
        </h3>
        <button class="selector-close" @click="$emit('close')">
          ✕
        </button>
      </div>

      <!-- 搜索和过滤 -->
      <div class="selector-filters" v-if="config.showSearch || config.showFilter">
        <!-- 搜索框 -->
        <div class="search-box" v-if="config.showSearch">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索模板..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>

        <!-- 过滤器 -->
        <div class="filter-box" v-if="config.showFilter">
          <select v-model="sortBy" class="filter-select">
            <option value="name">按名称排序</option>
            <option value="createdAt">按创建时间</option>
            <option value="updatedAt">按更新时间</option>
            <option value="version">按版本</option>
          </select>
          <select v-model="sortOrder" class="filter-select">
            <option value="asc">升序</option>
            <option value="desc">降序</option>
          </select>
        </div>
      </div>

      <!-- 模板网格 -->
      <div class="selector-content">
        <div 
          class="template-grid"
          :style="{ gridTemplateColumns: `repeat(${config.itemsPerRow || 3}, 1fr)` }"
        >
          <div
            v-for="template in filteredTemplates"
            :key="template.info.id"
            class="template-item"
            :class="{
              'template-item--selected': template.info.id === currentTemplate?.info.id,
              'template-item--default': template.info.isDefault,
              'template-item--error': template.status === 'error'
            }"
            @click="selectTemplate(template)"
          >
            <!-- 模板缩略图 -->
            <div class="template-thumbnail">
              <img
                v-if="template.info.thumbnail"
                :src="template.info.thumbnail"
                :alt="template.info.name"
                class="thumbnail-image"
              />
              <div v-else class="thumbnail-placeholder">
                <span class="placeholder-icon">📄</span>
              </div>
              
              <!-- 状态标识 -->
              <div class="template-status">
                <span v-if="template.info.isDefault" class="status-badge status-default">
                  默认
                </span>
                <span v-if="template.status === 'error'" class="status-badge status-error">
                  错误
                </span>
                <span v-if="template.status === 'loading'" class="status-badge status-loading">
                  加载中
                </span>
              </div>

              <!-- 选中标识 -->
              <div 
                v-if="template.info.id === currentTemplate?.info.id"
                class="selected-indicator"
              >
                ✓
              </div>
            </div>

            <!-- 模板信息 -->
            <div class="template-info">
              <h4 class="template-name">{{ template.info.name }}</h4>
              <p class="template-description" v-if="template.info.description">
                {{ template.info.description }}
              </p>
              <div class="template-meta">
                <span class="template-version">v{{ template.info.version }}</span>
                <span class="template-author" v-if="template.info.author">
                  {{ template.info.author }}
                </span>
              </div>
              <div class="template-tags" v-if="template.info.tags?.length">
                <span
                  v-for="tag in template.info.tags.slice(0, 3)"
                  :key="tag"
                  class="template-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 预览按钮 -->
            <div class="template-actions" v-if="config.showPreview">
              <button
                class="action-button preview-button"
                @click.stop="previewTemplate(template)"
                :disabled="template.status === 'error'"
              >
                预览
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTemplates.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h4 class="empty-title">未找到匹配的模板</h4>
          <p class="empty-message">
            {{ searchQuery ? '请尝试其他搜索关键词' : '当前分类下暂无可用模板' }}
          </p>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="selector-footer">
        <div class="footer-info">
          <span class="template-count">
            共 {{ filteredTemplates.length }} 个模板
          </span>
          <span class="device-info">
            当前设备: {{ getDeviceText(device) }}
          </span>
        </div>
        <div class="footer-actions">
          <button class="action-button cancel-button" @click="$emit('close')">
            {{ config.cancelText || '取消' }}
          </button>
          <button
            class="action-button confirm-button"
            @click="confirmSelection"
            :disabled="!selectedTemplate || selectedTemplate.status === 'error'"
          >
            {{ config.confirmText || '确认' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 预览模态框 -->
    <div v-if="previewTemplate" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <h4>{{ previewTemplate.info.name }} - 预览</h4>
          <button class="preview-close" @click="closePreview">✕</button>
        </div>
        <div class="preview-body">
          <component
            v-if="previewComponent"
            :is="previewComponent"
            class="preview-component"
          />
          <div v-else class="preview-loading">
            <div class="spinner"></div>
            <p>加载预览中...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Template,
  DeviceType,
  TemplateSelectorConfig,
  TemplateStatus,
  TemplateSortOptions
} from '../types'
import { TemplateManager } from '../core/TemplateManager'
import { TemplateFilterUtils } from '../utils'

// Props定义
interface Props {
  category: string
  device: DeviceType
  templates: Template[]
  currentTemplate?: Template | null
  config?: TemplateSelectorConfig
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({})
})

// Emits定义
const emit = defineEmits<{
  select: [templateId: string]
  close: []
  preview: [template: Template]
}>()

// 本地状态
const searchQuery = ref('')
const sortBy = ref<'name' | 'createdAt' | 'updatedAt' | 'version'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedTemplate = ref<Template | null>(props.currentTemplate || null)
const previewTemplate = ref<Template | null>(null)
const previewComponent = ref<any>(null)

// 模板管理器
const templateManager = TemplateManager.getInstance()

// 计算属性
const categoryDisplayName = computed(() => {
  return props.category.charAt(0).toUpperCase() + props.category.slice(1)
})

const filteredTemplates = computed(() => {
  let result = [...props.templates]

  // 搜索过滤
  if (searchQuery.value.trim()) {
    result = TemplateFilterUtils.searchTemplates(result, searchQuery.value)
  }

  // 排序
  const sortOptions: TemplateSortOptions = {
    field: sortBy.value,
    order: sortOrder.value
  }
  result = TemplateFilterUtils.sortTemplates(result, sortOptions)

  return result
})

// 方法
const selectTemplate = (template: Template) => {
  if (template.status === TemplateStatus.ERROR) {
    return
  }
  selectedTemplate.value = template
}

const confirmSelection = () => {
  if (selectedTemplate.value && selectedTemplate.value.status !== TemplateStatus.ERROR) {
    emit('select', selectedTemplate.value.info.id)
  }
}

const handleOverlayClick = () => {
  emit('close')
}

const previewTemplate = async (template: Template) => {
  if (template.status === TemplateStatus.ERROR) {
    return
  }

  previewTemplate.value = template
  previewComponent.value = null
  emit('preview', template)

  try {
    const component = await templateManager.loadTemplateComponent(template.info.id)
    previewComponent.value = component
  } catch (error) {
    console.error('Failed to load preview component:', error)
  }
}

const closePreview = () => {
  previewTemplate.value = null
  previewComponent.value = null
}

const getDeviceText = (device: DeviceType): string => {
  const texts = {
    [DeviceType.DESKTOP]: '桌面端',
    [DeviceType.MOBILE]: '移动端',
    [DeviceType.TABLET]: '平板端'
  }
  return texts[device] || '桌面端'
}

// 监听当前模板变化
watch(
  () => props.currentTemplate,
  (newTemplate) => {
    selectedTemplate.value = newTemplate || null
  }
)

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (previewTemplate.value) {
      closePreview()
    } else {
      emit('close')
    }
  } else if (event.key === 'Enter' && selectedTemplate.value) {
    confirmSelection()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 清理
const cleanup = () => {
  document.removeEventListener('keydown', handleKeydown)
}

// 组件卸载时清理
defineExpose({
  cleanup
})
</script>

<style scoped>
.template-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.template-selector {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 900px;
  max-height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部样式 */
.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.selector-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.selector-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.selector-close:hover {
  background: #f0f0f0;
  color: #666;
}

/* 过滤器样式 */
.selector-filters {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
}

.filter-box {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

/* 内容区域样式 */
.selector-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.template-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

.template-item {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.template-item:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.template-item--selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.template-item--default {
  border-color: #52c41a;
}

.template-item--error {
  border-color: #ff4d4f;
  opacity: 0.6;
  cursor: not-allowed;
}

/* 缩略图样式 */
.template-thumbnail {
  position: relative;
  height: 120px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #ccc;
}

.placeholder-icon {
  font-size: 32px;
}

.template-status {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  color: white;
}

.status-default {
  background: #52c41a;
}

.status-error {
  background: #ff4d4f;
}

.status-loading {
  background: #faad14;
}

.selected-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* 模板信息样式 */
.template-info {
  padding: 12px;
}

.template-name {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.template-description {
  margin: 0 0 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
  color: #999;
}

.template-version {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

.template-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.template-tag {
  background: #e6f7ff;
  color: #1890ff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
}

/* 操作按钮样式 */
.template-actions {
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
}

.action-button {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button {
  background: #f0f0f0;
  color: #666;
  width: 100%;
}

.preview-button:hover:not(:disabled) {
  background: #e6e6e6;
}

.preview-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.empty-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 底部样式 */
.selector-footer {
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.cancel-button {
  background: #f0f0f0;
  color: #666;
}

.cancel-button:hover {
  background: #e6e6e6;
}

.confirm-button {
  background: #1890ff;
  color: white;
}

.confirm-button:hover:not(:disabled) {
  background: #40a9ff;
}

.confirm-button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

/* 预览模态框样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.preview-content {
  background: white;
  border-radius: 8px;
  max-width: 800px;
  max-height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.preview-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.preview-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.preview-body {
  flex: 1;
  overflow: auto;
  padding: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-component {
  width: 100%;
  max-width: 100%;
}

.preview-loading {
  text-align: center;
  color: #666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .template-selector {
    max-width: 100%;
    max-height: 90vh;
    margin: 0;
  }
  
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .selector-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .selector-header {
    padding: 16px;
  }
  
  .selector-content {
    padding: 16px;
  }
  
  .selector-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
  }
  
  .footer-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .action-button {
    flex: 1;
  }
}
</style>