<template>
  <div class="ldesign-form-single-column">
    <div v-if="title || subtitle" class="form-header">
      <h2 v-if="title" class="form-title">{{ title }}</h2>
      <p v-if="subtitle" class="form-subtitle">{{ subtitle }}</p>
    </div>

    <form class="form-body" @submit.prevent="handleSubmit">
      <slot name="fields">
        <!-- 默认字段插槽 -->
        <div v-for="field in fields" :key="field.name" class="form-field">
          <label v-if="field.label" :for="field.name" class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
          </label>

          <component :is="getFieldComponent(field.type)" :id="field.name" v-model="formData[field.name]"
            :placeholder="field.placeholder" :disabled="field.disabled"
            :class="['field-input', { error: errors[field.name] }]" v-bind="field.props" />

          <span v-if="errors[field.name]" class="field-error">
            {{ errors[field.name] }}
          </span>

          <span v-else-if="field.hint" class="field-hint">
            {{ field.hint }}
          </span>
        </div>
      </slot>

      <div class="form-actions">
        <slot name="actions">
          <button type="button" class="btn-cancel" :disabled="submitting" @click="handleCancel">
            {{ cancelText || '取消' }}
          </button>
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? (submittingText || '提交中...') : (submitText || '提交') }}
          </button>
        </slot>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface FormField {
  name: string
  label?: string
  type?: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hint?: string
  props?: Record<string, any>
}

interface Props {
  title?: string
  subtitle?: string
  fields?: FormField[]
  modelValue?: Record<string, any>
  submitText?: string
  cancelText?: string
  submittingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  modelValue: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  submit: [data: Record<string, any>]
  cancel: []
}>()

const formData = reactive({ ...props.modelValue })
const errors = reactive<Record<string, string>>({})
const submitting = ref(false)

const getFieldComponent = (type?: string) => {
  switch (type) {
    case 'textarea': return 'textarea'
    case 'select': return 'select'
    default: return 'input'
  }
}

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true
  props.fields.forEach(field => {
    if (field.required && !formData[field.name]) {
      errors[field.name] = `${field.label || field.name} 是必填项`
      isValid = false
    }
  })

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  try {
    emit('update:modelValue', formData)
    emit('submit', formData)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.ldesign-form-single-column {
  max-width: var(--template-form-max-width);
  margin: 0 auto;
  padding: var(--template-spacing-2xl);
}

.form-header {
  margin-bottom: var(--template-spacing-3xl);
  text-align: center;
}

.form-title {
  font-size: var(--template-font-2xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
  margin: 0 0 var(--template-spacing-md) 0;
}

.form-subtitle {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  margin: 0;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: var(--template-form-gap);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-md);
}

.field-label {
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-primary);
}

.required-mark {
  color: var(--template-error);
  margin-left: var(--template-spacing-2xs);
}

.field-input {
  padding: var(--template-spacing-md) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-form-input-border);
  border-radius: var(--template-form-input-radius);
  font-size: var(--template-font-base);
  transition: var(--template-transition-all);
  color: var(--template-text-primary);
  background: var(--template-bg-container);
}

.field-input::placeholder {
  color: var(--template-text-placeholder);
}

.field-input:focus {
  outline: none;
  border-color: var(--template-form-input-border-focus);
  box-shadow: 0 0 0 3px var(--template-primary-lighter);
}

.field-input.error {
  border-color: var(--template-border-input-error);
}

.field-error {
  font-size: var(--template-font-sm);
  color: var(--template-text-error);
}

.field-hint {
  font-size: var(--template-font-sm);
  color: var(--template-text-tertiary);
}

textarea.field-input {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: var(--template-form-button-gap);
  justify-content: flex-end;
  margin-top: var(--template-spacing-md);
}

.btn-cancel,
.btn-submit {
  padding: var(--template-spacing-md) var(--template-spacing-xl);
  border-radius: var(--template-form-input-radius);
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  cursor: pointer;
  transition: var(--template-transition-all);
  border: none;
}

.btn-cancel {
  background: var(--template-bg-component);
  color: var(--template-text-primary);
}

.btn-cancel:hover:not(:disabled) {
  background: var(--template-bg-component-hover);
}

.btn-submit {
  background: var(--template-primary);
  color: var(--template-text-inverse);
}

.btn-submit:hover:not(:disabled) {
  background: var(--template-primary-hover);
}

.btn-submit:active:not(:disabled) {
  background: var(--template-primary-active);
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
