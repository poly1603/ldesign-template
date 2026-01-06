/**
 * @ldesign/template-core - TemplateError Tests
 * 错误处理模块单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  TemplateError,
  LoadError,
  ValidationError,
  PermissionError,
  NetworkError,
  CacheError,
  TemplateErrorCode,
  ErrorManager,
  createError,
  assert,
  assertDefined,
} from '@ldesign/template-core/errors'

describe('TemplateError', () => {
  describe('基础错误类', () => {
    it('应该创建模板错误', () => {
      const error = new TemplateError('测试错误', TemplateErrorCode.UNKNOWN)
      
      expect(error.message).toBe('测试错误')
      expect(error.code).toBe(TemplateErrorCode.UNKNOWN)
      expect(error.name).toBe('TemplateError')
      expect(error.timestamp).toBeDefined()
    })
    
    it('应该支持错误上下文', () => {
      const context = { templateId: 'test:desktop:default' }
      const error = new TemplateError('测试错误', TemplateErrorCode.LOAD_FAILED, context)
      
      expect(error.context).toEqual(context)
    })
    
    it('应该支持原因链', () => {
      const cause = new Error('原始错误')
      const error = new TemplateError('包装错误', TemplateErrorCode.UNKNOWN, undefined, cause)
      
      expect(error.cause).toBe(cause)
    })
    
    it('应该正确序列化为JSON', () => {
      const error = new TemplateError('测试错误', TemplateErrorCode.LOAD_FAILED, { id: '123' })
      const json = error.toJSON()
      
      expect(json.name).toBe('TemplateError')
      expect(json.message).toBe('测试错误')
      expect(json.code).toBe(TemplateErrorCode.LOAD_FAILED)
      expect(json.context).toEqual({ id: '123' })
      expect(json.timestamp).toBeDefined()
    })
    
    it('应该正确转换为字符串', () => {
      const error = new TemplateError('测试错误', TemplateErrorCode.VALIDATION_FAILED)
      const str = error.toString()
      
      expect(str).toContain('TemplateError')
      expect(str).toContain('测试错误')
      expect(str).toContain(TemplateErrorCode.VALIDATION_FAILED)
    })
  })
  
  describe('专门错误类', () => {
    it('应该创建加载错误', () => {
      const error = new LoadError('login:desktop:default', '模板加载失败')
      
      expect(error.name).toBe('LoadError')
      expect(error.code).toBe(TemplateErrorCode.LOAD_FAILED)
      expect(error.templateId).toBe('login:desktop:default')
    })
    
    it('应该创建验证错误', () => {
      const errors = ['名称必填', '版本格式错误']
      const error = new ValidationError(errors, { field: 'config' })
      
      expect(error.name).toBe('ValidationError')
      expect(error.code).toBe(TemplateErrorCode.VALIDATION_FAILED)
      expect(error.validationErrors).toEqual(errors)
    })
    
    it('应该创建权限错误', () => {
      const error = new PermissionError('admin', '无管理员权限')
      
      expect(error.name).toBe('PermissionError')
      expect(error.code).toBe(TemplateErrorCode.PERMISSION_DENIED)
      expect(error.requiredPermission).toBe('admin')
    })
    
    it('应该创建网络错误', () => {
      const error = new NetworkError(
        'https://api.example.com/templates',
        500,
        'Internal Server Error'
      )
      
      expect(error.name).toBe('NetworkError')
      expect(error.code).toBe(TemplateErrorCode.NETWORK_ERROR)
      expect(error.url).toBe('https://api.example.com/templates')
      expect(error.statusCode).toBe(500)
    })
    
    it('应该创建缓存错误', () => {
      const error = new CacheError('get', 'template:123', '缓存读取失败')
      
      expect(error.name).toBe('CacheError')
      expect(error.code).toBe(TemplateErrorCode.CACHE_ERROR)
      expect(error.operation).toBe('get')
      expect(error.cacheKey).toBe('template:123')
    })
  })
  
  describe('createError工厂函数', () => {
    it('应该创建加载错误', () => {
      const error = createError('load', {
        templateId: 'test:mobile:v1',
        message: '加载失败',
      })
      
      expect(error).toBeInstanceOf(LoadError)
    })
    
    it('应该创建验证错误', () => {
      const error = createError('validation', {
        errors: ['无效字段'],
        context: { data: {} },
      })
      
      expect(error).toBeInstanceOf(ValidationError)
    })
    
    it('应该创建权限错误', () => {
      const error = createError('permission', {
        permission: 'write',
        message: '需要写权限',
      })
      
      expect(error).toBeInstanceOf(PermissionError)
    })
    
    it('应该创建网络错误', () => {
      const error = createError('network', {
        url: 'https://api.test.com',
        statusCode: 404,
        statusText: 'Not Found',
      })
      
      expect(error).toBeInstanceOf(NetworkError)
    })
    
    it('应该创建缓存错误', () => {
      const error = createError('cache', {
        operation: 'set',
        key: 'key1',
        message: '写入失败',
      })
      
      expect(error).toBeInstanceOf(CacheError)
    })
  })
  
  describe('断言函数', () => {
    it('assert应该在条件为真时通过', () => {
      expect(() => assert(true, '不应该抛出')).not.toThrow()
    })
    
    it('assert应该在条件为假时抛出', () => {
      expect(() => assert(false, '断言失败')).toThrow('断言失败')
    })
    
    it('assert应该使用自定义错误码', () => {
      try {
        assert(false, '验证失败', TemplateErrorCode.VALIDATION_FAILED)
      } catch (e) {
        expect((e as TemplateError).code).toBe(TemplateErrorCode.VALIDATION_FAILED)
      }
    })
    
    it('assertDefined应该在值存在时返回值', () => {
      const value = { name: 'test' }
      const result = assertDefined(value, '值不存在')
      expect(result).toBe(value)
    })
    
    it('assertDefined应该在值为null时抛出', () => {
      expect(() => assertDefined(null, '值为空')).toThrow('值为空')
    })
    
    it('assertDefined应该在值为undefined时抛出', () => {
      expect(() => assertDefined(undefined, '值未定义')).toThrow('值未定义')
    })
  })
})

describe('ErrorManager', () => {
  let errorManager: ErrorManager
  
  beforeEach(() => {
    errorManager = new ErrorManager()
  })
  
  describe('错误处理器', () => {
    it('应该注册和调用全局处理器', () => {
      const handler = vi.fn()
      errorManager.registerHandler(handler)
      
      const error = new TemplateError('测试', TemplateErrorCode.UNKNOWN)
      errorManager.handleError(error)
      
      expect(handler).toHaveBeenCalledWith(error)
    })
    
    it('应该注册和调用特定错误码处理器', () => {
      const loadHandler = vi.fn()
      const validationHandler = vi.fn()
      
      errorManager.registerHandler(loadHandler, TemplateErrorCode.LOAD_FAILED)
      errorManager.registerHandler(validationHandler, TemplateErrorCode.VALIDATION_FAILED)
      
      const loadError = new LoadError('test', '加载失败')
      errorManager.handleError(loadError)
      
      expect(loadHandler).toHaveBeenCalled()
      expect(validationHandler).not.toHaveBeenCalled()
    })
    
    it('应该移除处理器', () => {
      const handler = vi.fn()
      const unregister = errorManager.registerHandler(handler)
      
      unregister()
      
      const error = new TemplateError('测试', TemplateErrorCode.UNKNOWN)
      errorManager.handleError(error)
      
      expect(handler).not.toHaveBeenCalled()
    })
    
    it('应该支持多个处理器', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      errorManager.registerHandler(handler1)
      errorManager.registerHandler(handler2)
      
      const error = new TemplateError('测试', TemplateErrorCode.UNKNOWN)
      errorManager.handleError(error)
      
      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })
  })
  
  describe('错误日志', () => {
    it('应该记录错误', () => {
      const error = new TemplateError('测试错误', TemplateErrorCode.LOAD_FAILED)
      errorManager.handleError(error)
      
      const logs = errorManager.getErrorLogs()
      expect(logs.length).toBe(1)
      expect(logs[0]).toBe(error)
    })
    
    it('应该限制日志数量', () => {
      const manager = new ErrorManager({ maxLogs: 3 })
      
      for (let i = 0; i < 5; i++) {
        manager.handleError(new TemplateError(`错误${i}`, TemplateErrorCode.UNKNOWN))
      }
      
      const logs = manager.getErrorLogs()
      expect(logs.length).toBe(3)
      expect(logs[0].message).toBe('错误2')
      expect(logs[2].message).toBe('错误4')
    })
    
    it('应该清除日志', () => {
      errorManager.handleError(new TemplateError('测试', TemplateErrorCode.UNKNOWN))
      expect(errorManager.getErrorLogs().length).toBe(1)
      
      errorManager.clearLogs()
      expect(errorManager.getErrorLogs().length).toBe(0)
    })
    
    it('应该按错误码过滤日志', () => {
      errorManager.handleError(new LoadError('t1', '加载1'))
      errorManager.handleError(new ValidationError(['e1']))
      errorManager.handleError(new LoadError('t2', '加载2'))
      
      const loadLogs = errorManager.getErrorLogs(TemplateErrorCode.LOAD_FAILED)
      expect(loadLogs.length).toBe(2)
    })
  })
  
  describe('重试策略', () => {
    it('应该执行重试', async () => {
      let attempts = 0
      const operation = vi.fn().mockImplementation(async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('模拟失败')
        }
        return 'success'
      })
      
      const result = await errorManager.retry(operation, {
        maxAttempts: 5,
        delay: 10,
      })
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(3)
    })
    
    it('应该在达到最大重试次数后抛出', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('始终失败'))
      
      await expect(
        errorManager.retry(operation, { maxAttempts: 3, delay: 10 })
      ).rejects.toThrow('始终失败')
      
      expect(operation).toHaveBeenCalledTimes(3)
    })
    
    it('应该调用onRetry回调', async () => {
      const onRetry = vi.fn()
      let attempts = 0
      
      const operation = vi.fn().mockImplementation(async () => {
        attempts++
        if (attempts < 2) {
          throw new Error('失败')
        }
        return 'ok'
      })
      
      await errorManager.retry(operation, {
        maxAttempts: 3,
        delay: 10,
        onRetry,
      })
      
      expect(onRetry).toHaveBeenCalledTimes(1)
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1)
    })
  })
  
  describe('错误包装', () => {
    it('应该包装普通错误为TemplateError', () => {
      const originalError = new Error('原始错误')
      const wrapped = errorManager.wrapError(originalError)
      
      expect(wrapped).toBeInstanceOf(TemplateError)
      expect(wrapped.message).toBe('原始错误')
      expect(wrapped.cause).toBe(originalError)
    })
    
    it('应该保持TemplateError不变', () => {
      const templateError = new LoadError('test', '加载失败')
      const wrapped = errorManager.wrapError(templateError)
      
      expect(wrapped).toBe(templateError)
    })
    
    it('应该处理非Error对象', () => {
      const wrapped = errorManager.wrapError('字符串错误')
      
      expect(wrapped).toBeInstanceOf(TemplateError)
      expect(wrapped.message).toBe('字符串错误')
    })
  })
  
  describe('错误恢复', () => {
    it('应该执行恢复操作', async () => {
      const error = new LoadError('test:desktop:v1', '加载失败')
      const recovery = vi.fn().mockResolvedValue('recovered')
      
      errorManager.registerRecovery(TemplateErrorCode.LOAD_FAILED, recovery)
      
      const result = await errorManager.attemptRecovery(error)
      
      expect(recovery).toHaveBeenCalledWith(error)
      expect(result).toBe('recovered')
    })
    
    it('应该在无恢复策略时返回null', async () => {
      const error = new ValidationError(['无效'])
      const result = await errorManager.attemptRecovery(error)
      
      expect(result).toBeNull()
    })
  })
})