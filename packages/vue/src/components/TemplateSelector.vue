<script setup lang="ts">
import { computed } from 'vue'
import type { DeviceType } from '@ldesign/template-core'
import { useTemplateList } from '../composables/useTemplateList'
import { useAutoDevice } from '../composables/useAutoDevice'

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
      <slot name="loading">加载中...</slot>
    </div>

    <!-- 模板列表 -->
    <div v-else-if="templates.length > 0" class="template-selector__list">
      <div v-for="template in templates" :key="template.id" class="template-selector__item"
        :class="{ 'is-active': modelValue === template.id }" @click="selectTemplate(template.id)">
        <!-- 预览图 -->
        <div v-if="showPreview && template.preview" class="template-selector__preview">
          <img :src="template.preview" :alt="template.displayName || template.name" />
        </div>

        <!-- 信息 -->
        <div class="template-selector__info">
          <div class="template-selector__name">
            {{ template.displayName || template.name }}
          </div>

          <div v-if="showDescription && template.description" class="template-selector__description">
            {{ template.description }}
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
      <slot name="empty">暂无模板</slot>
    </div>
  </div>
</template>

<style scoped>
.template-selector {
  width: 100%;
}

.template-selector__loading,
.template-selector__empty {
  padding: 40px 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.template-selector__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-selector__item {
  position: relative;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.template-selector__item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.template-selector__item.is-active {
  border-color: #409eff;
  background: #ecf5ff;
}

.template-selector__preview {
  width: 100%;
  height: 160px;
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
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
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.template-selector__description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.5;
}

.template-selector__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-selector__tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  color: #909399;
  background: #f4f4f5;
  border-radius: 4px;
}

.template-selector__check {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}
</style>