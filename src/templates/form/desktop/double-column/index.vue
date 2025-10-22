<template>
  <div class="ldesign-form-double-column">
    <div v-if="title || subtitle" class="form-header">
      <h2 v-if="title" class="form-title">{{ title }}</h2>
      <p v-if="subtitle" class="form-subtitle">{{ subtitle }}</p>
    </div>

    <form class="form-body" @submit.prevent="handleSubmit">
      <div class="form-grid">
        <slot name="fields">
          <div
            v-for="field in fields"
            :key="field.name"
            :class="['form-field', { 'full-width': field.fullWidth }]"
          >
            <label v-if="field.label" :for="field.name" class="field-label">
              {{ field.label }}
              <span v-if="field.required" class="required-mark">*</span>
            </label>
            
            <component
              :is="getFieldComponent(field.type)"
              :id="field.name"
              v-model="formData[field.name]"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :class="['field-input', { error: errors[field.name] }]"
              v-bind="field.props"
            />
            
            <span v-if="errors[field.name]" class="field-error">
              {{ errors[field.name] }}
            </span>
            
            <span v-else-if="field.hint" class="field-hint">
              {{ field.hint }}
            </span>
          </div>
        </slot>
      </div>

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
import { reactive, ref } from 'vue'

interface FormField {
  name: string
  label?: string
  type?: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'select'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hint?: string
  fullWidth?: boolean
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
.ldesign-form-double-column {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.form-header {
  margin-bottom: 32px;
  text-align: center;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 24px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required-mark {
  color: #ef4444;
  margin-left: 2px;
}

.field-input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input.error {
  border-color: #ef4444;
}

.field-error {
  font-size: 12px;
  color: #ef4444;
}

.field-hint {
  font-size: 12px;
  color: #6b7280;
}

textarea.field-input {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  grid-column: 1 / -1;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-submit {
  background: #3b82f6;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #2563eb;
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-field.full-width {
    grid-column: 1;
  }
}
</style>



