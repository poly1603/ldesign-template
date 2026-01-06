/**
 * @ldesign/template-core - Data Validation
 * 数据验证模块，包含Schema验证、XSS防护和输入清洁化
 */

import type { TemplateMetadata, TemplateConfig, DeviceType, ValidationResult } from '../types'
import { ValidationError } from '../errors/TemplateError'

/**
 * 验证规则类型
 */
export type ValidationRuleType = 
  | 'required'
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'email'
  | 'url'
  | 'pattern'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'enum'
  | 'custom'

/**
 * 验证规则定义
 */
export interface ValidationRule {
  type: ValidationRuleType
  message?: string
  value?: any
  validator?: (value: any) => boolean | Promise<boolean>
}

/**
 * Schema定义
 */
export interface Schema {
  [field: string]: ValidationRule | ValidationRule[]
}

/**
 * XSS危险模式
 */
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:\s*text\/html/gi,
  /<iframe/gi,
  /<embed/gi,
  /<object/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
]

/**
 * 危险HTML标签
 */
const DANGEROUS_TAGS = [
  'script', 'iframe', 'embed', 'object', 'form', 'input', 
  'button', 'textarea', 'select', 'style', 'link', 'meta'
]

/**
 * 数据验证器
 */
export class Validator {
  private schemas: Map<string, Schema> = new Map()
  private sanitizerEnabled: boolean = true
  private xssProtectionEnabled: boolean = true
  
  constructor(options: {
    sanitizerEnabled?: boolean
    xssProtectionEnabled?: boolean
  } = {}) {
    this.sanitizerEnabled = options.sanitizerEnabled ?? true
    this.xssProtectionEnabled = options.xssProtectionEnabled ?? true
    
    // 注册内置Schema
    this.registerBuiltinSchemas()
  }
  
  /**
   * 注册内置Schema
   */
  private registerBuiltinSchemas(): void {
    // 模板元数据Schema
    this.registerSchema('templateMetadata', {
      id: [
        { type: 'required', message: 'ID不能为空' },
        { type: 'string', message: 'ID必须是字符串' },
        { type: 'pattern', value: /^[a-z0-9-]+:[a-z]+:[a-z0-9-]+$/, message: 'ID格式无效' },
      ],
      category: [
        { type: 'required', message: '分类不能为空' },
        { type: 'string', message: '分类必须是字符串' },
      ],
      device: [
        { type: 'required', message: '设备类型不能为空' },
        { type: 'enum', value: ['desktop', 'mobile', 'tablet'], message: '无效的设备类型' },
      ],
      name: [
        { type: 'required', message: '名称不能为空' },
        { type: 'string', message: '名称必须是字符串' },
      ],
      path: [
        { type: 'required', message: '路径不能为空' },
        { type: 'string', message: '路径必须是字符串' },
      ],
    })
    
    // 模板配置Schema
    this.registerSchema('templateConfig', {
      name: [
        { type: 'required', message: '名称不能为空' },
        { type: 'string', message: '名称必须是字符串' },
        { type: 'maxLength', value: 50, message: '名称不能超过50个字符' },
      ],
      displayName: { type: 'string', message: '显示名称必须是字符串' },
      description: { type: 'string', message: '描述必须是字符串' },
      version: { 
        type: 'pattern', 
        value: /^\d+\.\d+\.\d+$/, 
        message: '版本号格式无效（应为 x.x.x）' 
      },
      tags: { type: 'array', message: '标签必须是数组' },
    })
  }
  
  /**
   * 注册Schema
   */
  registerSchema(name: string, schema: Schema): void {
    this.schemas.set(name, schema)
  }
  
  /**
   * 获取Schema
   */
  getSchema(name: string): Schema | undefined {
    return this.schemas.get(name)
  }
  
  /**
   * 验证数据
   */
  async validate(data: any, schema: Schema | string): Promise<ValidationResult> {
    const schemaObj = typeof schema === 'string' ? this.schemas.get(schema) : schema
    
    if (!schemaObj) {
      return {
        valid: false,
        errors: [`Schema "${schema}" 未找到`],
      }
    }
    
    const errors: string[] = []
    const warnings: string[] = []
    
    for (const [field, rules] of Object.entries(schemaObj)) {
      const value = data?.[field]
      const ruleArray = Array.isArray(rules) ? rules : [rules]
      
      for (const rule of ruleArray) {
        const result = await this.validateRule(value, rule, field)
        if (!result.valid) {
          errors.push(result.message || `字段 ${field} 验证失败`)
        }
        if (result.warning) {
          warnings.push(result.warning)
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }
  
  /**
   * 验证单个规则
   */
  private async validateRule(
    value: any,
    rule: ValidationRule,
    field: string
  ): Promise<{ valid: boolean; message?: string; warning?: string }> {
    const getMessage = (defaultMsg: string) => rule.message || defaultMsg
    
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return { valid: false, message: getMessage(`${field} 是必填项`) }
        }
        break
        
      case 'string':
        if (value !== undefined && typeof value !== 'string') {
          return { valid: false, message: getMessage(`${field} 必须是字符串`) }
        }
        break
        
      case 'number':
        if (value !== undefined && typeof value !== 'number') {
          return { valid: false, message: getMessage(`${field} 必须是数字`) }
        }
        break
        
      case 'boolean':
        if (value !== undefined && typeof value !== 'boolean') {
          return { valid: false, message: getMessage(`${field} 必须是布尔值`) }
        }
        break
        
      case 'array':
        if (value !== undefined && !Array.isArray(value)) {
          return { valid: false, message: getMessage(`${field} 必须是数组`) }
        }
        break
        
      case 'object':
        if (value !== undefined && (typeof value !== 'object' || value === null || Array.isArray(value))) {
          return { valid: false, message: getMessage(`${field} 必须是对象`) }
        }
        break
        
      case 'email':
        if (value !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { valid: false, message: getMessage(`${field} 必须是有效的邮箱地址`) }
        }
        break
        
      case 'url':
        if (value !== undefined) {
          try {
            new URL(value)
          } catch {
            return { valid: false, message: getMessage(`${field} 必须是有效的URL`) }
          }
        }
        break
        
      case 'pattern':
        if (value !== undefined && rule.value instanceof RegExp && !rule.value.test(value)) {
          return { valid: false, message: getMessage(`${field} 格式无效`) }
        }
        break
        
      case 'min':
        if (value !== undefined && typeof value === 'number' && value < rule.value) {
          return { valid: false, message: getMessage(`${field} 不能小于 ${rule.value}`) }
        }
        break
        
      case 'max':
        if (value !== undefined && typeof value === 'number' && value > rule.value) {
          return { valid: false, message: getMessage(`${field} 不能大于 ${rule.value}`) }
        }
        break
        
      case 'minLength':
        if (value !== undefined && typeof value === 'string' && value.length < rule.value) {
          return { valid: false, message: getMessage(`${field} 长度不能小于 ${rule.value}`) }
        }
        break
        
      case 'maxLength':
        if (value !== undefined && typeof value === 'string' && value.length > rule.value) {
          return { valid: false, message: getMessage(`${field} 长度不能大于 ${rule.value}`) }
        }
        break
        
      case 'enum':
        if (value !== undefined && Array.isArray(rule.value) && !rule.value.includes(value)) {
          return { valid: false, message: getMessage(`${field} 必须是以下值之一: ${rule.value.join(', ')}`) }
        }
        break
        
      case 'custom':
        if (rule.validator) {
          const result = await rule.validator(value)
          if (!result) {
            return { valid: false, message: getMessage(`${field} 自定义验证失败`) }
          }
        }
        break
    }
    
    return { valid: true }
  }
  
  /**
   * 验证模板元数据
   */
  async validateMetadata(metadata: Partial<TemplateMetadata>): Promise<ValidationResult> {
    return this.validate(metadata, 'templateMetadata')
  }
  
  /**
   * 验证模板配置
   */
  async validateConfig(config: Partial<TemplateConfig>): Promise<ValidationResult> {
    return this.validate(config, 'templateConfig')
  }
  
  /**
   * XSS检测
   */
  detectXSS(input: string): boolean {
    if (!this.xssProtectionEnabled) return false
    
    for (const pattern of XSS_PATTERNS) {
      if (pattern.test(input)) {
        return true
      }
    }
    
    return false
  }
  
  /**
   * 清洁化字符串（XSS防护）
   */
  sanitize(input: string): string {
    if (!this.sanitizerEnabled || typeof input !== 'string') {
      return input
    }
    
    // 检测XSS
    if (this.detectXSS(input)) {
      console.warn('[Validator] XSS attack detected and blocked')
    }
    
    let result = input
    
    // 转义HTML实体
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
    
    return result
  }
  
  /**
   * 深度清洁化对象
   */
  sanitizeObject<T extends Record<string, any>>(obj: T): T {
    if (!this.sanitizerEnabled) return obj
    
    const sanitized: any = Array.isArray(obj) ? [] : {}
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitize(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitize(item) : 
          typeof item === 'object' && item !== null ? this.sanitizeObject(item) : item
        )
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }
  
  /**
   * 验证并清洁化
   */
  async validateAndSanitize<T extends Record<string, any>>(
    data: T,
    schema: Schema | string
  ): Promise<{ valid: boolean; data: T; result: ValidationResult }> {
    // 先清洁化
    const sanitizedData = this.sanitizeObject(data)
    
    // 再验证
    const result = await this.validate(sanitizedData, schema)
    
    return {
      valid: result.valid,
      data: sanitizedData,
      result,
    }
  }
  
  /**
   * 断言验证通过
   */
  async assertValid(data: any, schema: Schema | string): Promise<void> {
    const result = await this.validate(data, schema)
    if (!result.valid) {
      throw new ValidationError(
        '数据验证失败',
        result.errors || [],
        { metadata: { data, schema: typeof schema === 'string' ? schema : 'custom' } }
      )
    }
  }
  
  /**
   * 创建验证中间件
   */
  createMiddleware(schema: Schema | string) {
    return async (data: any) => {
      const result = await this.validate(data, schema)
      if (!result.valid) {
        throw new ValidationError('验证失败', result.errors || [])
      }
      return this.sanitizeObject(data)
    }
  }
}

/**
 * 创建验证器实例
 */
export function createValidator(options?: {
  sanitizerEnabled?: boolean
  xssProtectionEnabled?: boolean
}): Validator {
  return new Validator(options)
}

/**
 * 默认验证器实例
 */
export const validator = new Validator()

/**
 * 快捷验证函数
 */
export async function validate(data: any, schema: Schema | string): Promise<ValidationResult> {
  return validator.validate(data, schema)
}

/**
 * 快捷清洁化函数
 */
export function sanitize(input: string): string {
  return validator.sanitize(input)
}

/**
 * 快捷XSS检测函数
 */
export function detectXSS(input: string): boolean {
  return validator.detectXSS(input)
}