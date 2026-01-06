/**
 * @ldesign/template-core - Validator Tests
 * 数据验证器单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Validator, createValidator, validate, sanitize, detectXSS } from '@ldesign/template-core/validation'

describe('Validator', () => {
  let validator: Validator
  
  beforeEach(() => {
    validator = new Validator()
  })
  
  describe('Schema验证', () => {
    it('应该验证必填字段', async () => {
      const schema = {
        name: { type: 'required' as const, message: '名称必填' },
      }
      
      const result = await validator.validate({ name: '' }, schema)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('名称必填')
    })
    
    it('应该验证字符串类型', async () => {
      const schema = {
        name: { type: 'string' as const },
      }
      
      const validResult = await validator.validate({ name: 'test' }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ name: 123 }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该验证数字类型', async () => {
      const schema = {
        age: { type: 'number' as const },
      }
      
      const validResult = await validator.validate({ age: 25 }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ age: '25' }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该验证数组类型', async () => {
      const schema = {
        tags: { type: 'array' as const },
      }
      
      const validResult = await validator.validate({ tags: ['a', 'b'] }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ tags: 'not an array' }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该验证枚举值', async () => {
      const schema = {
        device: { type: 'enum' as const, value: ['desktop', 'mobile', 'tablet'] },
      }
      
      const validResult = await validator.validate({ device: 'desktop' }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ device: 'unknown' }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该验证正则表达式', async () => {
      const schema = {
        email: { type: 'pattern' as const, value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      }
      
      const validResult = await validator.validate({ email: 'test@example.com' }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ email: 'invalid-email' }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该验证最小值', async () => {
      const schema = {
        age: { type: 'min' as const, value: 18 },
      }
      
      const validResult = await validator.validate({ age: 20 }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ age: 15 }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该验证最大长度', async () => {
      const schema = {
        name: { type: 'maxLength' as const, value: 10 },
      }
      
      const validResult = await validator.validate({ name: 'short' }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ name: 'this is too long' }, schema)
      expect(invalidResult.valid).toBe(false)
    })
    
    it('应该支持多规则验证', async () => {
      const schema = {
        name: [
          { type: 'required' as const },
          { type: 'string' as const },
          { type: 'minLength' as const, value: 3 },
          { type: 'maxLength' as const, value: 20 },
        ],
      }
      
      const validResult = await validator.validate({ name: 'valid name' }, schema)
      expect(validResult.valid).toBe(true)
      
      const tooShortResult = await validator.validate({ name: 'ab' }, schema)
      expect(tooShortResult.valid).toBe(false)
    })
    
    it('应该支持自定义验证器', async () => {
      const schema = {
        value: {
          type: 'custom' as const,
          validator: (v: number) => v % 2 === 0,
          message: '必须是偶数',
        },
      }
      
      const validResult = await validator.validate({ value: 4 }, schema)
      expect(validResult.valid).toBe(true)
      
      const invalidResult = await validator.validate({ value: 3 }, schema)
      expect(invalidResult.valid).toBe(false)
    })
  })
  
  describe('内置Schema', () => {
    it('应该验证模板元数据', async () => {
      const validMetadata = {
        id: 'login:desktop:default',
        category: 'login',
        device: 'desktop',
        name: 'default',
        path: '/templates/login',
      }
      
      const result = await validator.validateMetadata(validMetadata)
      expect(result.valid).toBe(true)
    })
    
    it('应该拒绝无效的模板ID格式', async () => {
      const invalidMetadata = {
        id: 'invalid-id-format',
        category: 'login',
        device: 'desktop',
        name: 'default',
        path: '/templates/login',
      }
      
      const result = await validator.validateMetadata(invalidMetadata)
      expect(result.valid).toBe(false)
    })
    
    it('应该验证模板配置', async () => {
      const validConfig = {
        name: 'default',
        displayName: 'Default Template',
        version: '1.0.0',
      }
      
      const result = await validator.validateConfig(validConfig)
      expect(result.valid).toBe(true)
    })
  })
  
  describe('XSS防护', () => {
    it('应该检测XSS攻击', () => {
      const xssStrings = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        '<img onerror="alert(1)">',
        '<iframe src="evil.com">',
      ]
      
      for (const str of xssStrings) {
        expect(detectXSS(str)).toBe(true)
      }
    })
    
    it('应该允许安全字符串', () => {
      const safeStrings = [
        'Hello World',
        '这是中文内容',
        'user@example.com',
        'https://example.com/page',
      ]
      
      for (const str of safeStrings) {
        expect(detectXSS(str)).toBe(false)
      }
    })
    
    it('应该清洁化HTML实体', () => {
      const input = '<div class="test">&nbsp;</div>'
      const sanitized = sanitize(input)
      
      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).toContain('&lt;')
      expect(sanitized).toContain('&gt;')
    })
    
    it('应该深度清洁化对象', () => {
      const input = {
        name: '<script>alert(1)</script>',
        nested: {
          value: '<img onerror="hack()">',
        },
        array: ['<b>bold</b>', 'safe text'],
      }
      
      const sanitized = validator.sanitizeObject(input)
      
      expect(sanitized.name).not.toContain('<script>')
      expect(sanitized.nested.value).not.toContain('<img')
      expect(sanitized.array[0]).not.toContain('<b>')
      expect(sanitized.array[1]).toBe('safe text')
    })
  })
  
  describe('验证并清洁化', () => {
    it('应该同时验证和清洁化数据', async () => {
      const schema = {
        name: [
          { type: 'required' as const },
          { type: 'string' as const },
        ],
      }
      
      const input = {
        name: '<script>alert(1)</script>Valid Name',
      }
      
      const result = await validator.validateAndSanitize(input, schema)
      
      expect(result.valid).toBe(true)
      expect(result.data.name).not.toContain('<script>')
    })
  })
  
  describe('工厂函数', () => {
    it('createValidator应该创建验证器实例', () => {
      const v = createValidator()
      expect(v).toBeInstanceOf(Validator)
    })
    
    it('应该支持禁用XSS保护', () => {
      const v = createValidator({ xssProtectionEnabled: false })
      expect(v.detectXSS('<script>')).toBe(false)
    })
    
    it('应该支持禁用清洁化', () => {
      const v = createValidator({ sanitizerEnabled: false })
      const input = '<script>test</script>'
      expect(v.sanitize(input)).toBe(input)
    })
  })
  
  describe('快捷函数', () => {
    it('validate函数应该使用默认验证器', async () => {
      const schema = { name: { type: 'required' as const } }
      const result = await validate({ name: 'test' }, schema)
      expect(result.valid).toBe(true)
    })
    
    it('sanitize函数应该使用默认验证器', () => {
      const result = sanitize('<script>')
      expect(result).not.toContain('<script>')
    })
  })
})