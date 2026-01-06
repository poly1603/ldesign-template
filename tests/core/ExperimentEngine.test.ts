/**
 * @ldesign/template-core - ExperimentEngine Tests
 * A/B测试引擎单元测试
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ExperimentEngine, createExperimentEngine } from '@ldesign/template-core/experiment'

describe('ExperimentEngine', () => {
  let engine: ExperimentEngine
  
  beforeEach(() => {
    engine = new ExperimentEngine()
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  describe('实验创建', () => {
    it('应该创建实验', () => {
      const experiment = engine.createExperiment({
        id: 'exp-1',
        name: '按钮颜色测试',
        variants: [
          { id: 'control', name: '蓝色按钮', weight: 50 },
          { id: 'treatment', name: '绿色按钮', weight: 50 },
        ],
      })
      
      expect(experiment.id).toBe('exp-1')
      expect(experiment.name).toBe('按钮颜色测试')
      expect(experiment.variants.length).toBe(2)
      expect(experiment.status).toBe('draft')
    })
    
    it('应该自动生成实验ID', () => {
      const experiment = engine.createExperiment({
        name: '自动ID测试',
        variants: [
          { id: 'a', name: 'A', weight: 50 },
          { id: 'b', name: 'B', weight: 50 },
        ],
      })
      
      expect(experiment.id).toBeDefined()
      expect(experiment.id.length).toBeGreaterThan(0)
    })
    
    it('应该设置创建时间', () => {
      const now = Date.now()
      vi.setSystemTime(now)
      
      const experiment = engine.createExperiment({
        name: '时间测试',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      
      expect(experiment.createdAt).toBe(now)
    })
    
    it('应该拒绝权重总和不为100的变体', () => {
      expect(() => {
        engine.createExperiment({
          name: '无效权重',
          variants: [
            { id: 'a', name: 'A', weight: 30 },
            { id: 'b', name: 'B', weight: 30 },
          ],
        })
      }).toThrow()
    })
  })
  
  describe('实验管理', () => {
    beforeEach(() => {
      engine.createExperiment({
        id: 'exp-1',
        name: '测试实验',
        variants: [
          { id: 'control', name: '对照组', weight: 50 },
          { id: 'treatment', name: '实验组', weight: 50 },
        ],
      })
    })
    
    it('应该获取实验', () => {
      const experiment = engine.getExperiment('exp-1')
      expect(experiment).toBeDefined()
      expect(experiment?.name).toBe('测试实验')
    })
    
    it('应该获取所有实验', () => {
      engine.createExperiment({
        id: 'exp-2',
        name: '第二个实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      
      const experiments = engine.getAllExperiments()
      expect(experiments.length).toBe(2)
    })
    
    it('应该启动实验', () => {
      const result = engine.startExperiment('exp-1')
      
      expect(result.success).toBe(true)
      expect(engine.getExperiment('exp-1')?.status).toBe('running')
    })
    
    it('应该暂停实验', () => {
      engine.startExperiment('exp-1')
      const result = engine.pauseExperiment('exp-1')
      
      expect(result.success).toBe(true)
      expect(engine.getExperiment('exp-1')?.status).toBe('paused')
    })
    
    it('应该完成实验', () => {
      engine.startExperiment('exp-1')
      const result = engine.completeExperiment('exp-1', 'treatment')
      
      expect(result.success).toBe(true)
      expect(engine.getExperiment('exp-1')?.status).toBe('completed')
      expect(engine.getExperiment('exp-1')?.winner).toBe('treatment')
    })
    
    it('应该删除实验', () => {
      const result = engine.deleteExperiment('exp-1')
      
      expect(result.success).toBe(true)
      expect(engine.getExperiment('exp-1')).toBeUndefined()
    })
    
    it('不应该删除运行中的实验', () => {
      engine.startExperiment('exp-1')
      const result = engine.deleteExperiment('exp-1')
      
      expect(result.success).toBe(false)
      expect(engine.getExperiment('exp-1')).toBeDefined()
    })
  })
  
  describe('用户分配', () => {
    beforeEach(() => {
      engine.createExperiment({
        id: 'exp-1',
        name: '分配测试',
        variants: [
          { id: 'control', name: '对照组', weight: 50 },
          { id: 'treatment', name: '实验组', weight: 50 },
        ],
      })
      engine.startExperiment('exp-1')
    })
    
    it('应该为用户分配变体', () => {
      const variant = engine.assignVariant('exp-1', 'user-123')
      
      expect(variant).toBeDefined()
      expect(['control', 'treatment']).toContain(variant?.id)
    })
    
    it('应该为相同用户返回相同变体', () => {
      const variant1 = engine.assignVariant('exp-1', 'user-123')
      const variant2 = engine.assignVariant('exp-1', 'user-123')
      
      expect(variant1?.id).toBe(variant2?.id)
    })
    
    it('应该根据权重分配用户', () => {
      const engine2 = new ExperimentEngine()
      engine2.createExperiment({
        id: 'weighted',
        name: '权重测试',
        variants: [
          { id: 'a', name: 'A', weight: 90 },
          { id: 'b', name: 'B', weight: 10 },
        ],
      })
      engine2.startExperiment('weighted')
      
      const counts = { a: 0, b: 0 }
      for (let i = 0; i < 1000; i++) {
        const variant = engine2.assignVariant('weighted', `user-${i}`)
        if (variant) {
          counts[variant.id as 'a' | 'b']++
        }
      }
      
      // 允许一定误差
      expect(counts.a).toBeGreaterThan(800)
      expect(counts.b).toBeLessThan(200)
    })
    
    it('应该返回null对于未运行的实验', () => {
      const engine2 = new ExperimentEngine()
      engine2.createExperiment({
        id: 'draft',
        name: '草稿实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      
      const variant = engine2.assignVariant('draft', 'user-123')
      expect(variant).toBeNull()
    })
    
    it('应该获取用户的所有实验分配', () => {
      engine.createExperiment({
        id: 'exp-2',
        name: '第二实验',
        variants: [{ id: 'x', name: 'X', weight: 100 }],
      })
      engine.startExperiment('exp-2')
      
      engine.assignVariant('exp-1', 'user-456')
      engine.assignVariant('exp-2', 'user-456')
      
      const assignments = engine.getUserAssignments('user-456')
      expect(Object.keys(assignments).length).toBe(2)
    })
  })
  
  describe('事件追踪', () => {
    beforeEach(() => {
      engine.createExperiment({
        id: 'exp-1',
        name: '追踪测试',
        variants: [
          { id: 'control', name: '对照组', weight: 50 },
          { id: 'treatment', name: '实验组', weight: 50 },
        ],
      })
      engine.startExperiment('exp-1')
    })
    
    it('应该追踪曝光事件', () => {
      engine.assignVariant('exp-1', 'user-123')
      engine.trackImpression('exp-1', 'user-123')
      
      const metrics = engine.getMetrics('exp-1')
      expect(metrics.totalImpressions).toBe(1)
    })
    
    it('应该追踪转化事件', () => {
      engine.assignVariant('exp-1', 'user-123')
      engine.trackConversion('exp-1', 'user-123', 'purchase')
      
      const metrics = engine.getMetrics('exp-1')
      expect(metrics.totalConversions).toBe(1)
    })
    
    it('应该追踪带值的转化', () => {
      engine.assignVariant('exp-1', 'user-123')
      engine.trackConversion('exp-1', 'user-123', 'purchase', { value: 99.99 })
      
      const metrics = engine.getMetrics('exp-1')
      expect(metrics.totalValue).toBe(99.99)
    })
    
    it('应该追踪自定义事件', () => {
      engine.assignVariant('exp-1', 'user-123')
      engine.trackEvent('exp-1', 'user-123', 'button_click', { buttonId: 'cta' })
      
      const events = engine.getEvents('exp-1')
      expect(events.length).toBe(1)
      expect(events[0].type).toBe('button_click')
    })
  })
  
  describe('指标计算', () => {
    beforeEach(() => {
      engine.createExperiment({
        id: 'exp-1',
        name: '指标测试',
        variants: [
          { id: 'control', name: '对照组', weight: 50 },
          { id: 'treatment', name: '实验组', weight: 50 },
        ],
      })
      engine.startExperiment('exp-1')
    })
    
    it('应该计算总体指标', () => {
      // 模拟用户行为
      for (let i = 0; i < 100; i++) {
        engine.assignVariant('exp-1', `user-${i}`)
        engine.trackImpression('exp-1', `user-${i}`)
        
        // 假设50%的用户转化
        if (i % 2 === 0) {
          engine.trackConversion('exp-1', `user-${i}`, 'signup')
        }
      }
      
      const metrics = engine.getMetrics('exp-1')
      
      expect(metrics.totalImpressions).toBe(100)
      expect(metrics.totalConversions).toBe(50)
      expect(metrics.conversionRate).toBeCloseTo(0.5, 1)
    })
    
    it('应该计算各变体指标', () => {
      // 分配用户
      for (let i = 0; i < 100; i++) {
        engine.assignVariant('exp-1', `user-${i}`)
        engine.trackImpression('exp-1', `user-${i}`)
      }
      
      const metrics = engine.getMetrics('exp-1')
      
      expect(metrics.byVariant).toBeDefined()
      expect(metrics.byVariant.control).toBeDefined()
      expect(metrics.byVariant.treatment).toBeDefined()
    })
  })
  
  describe('统计置信度', () => {
    it('应该计算统计显著性', () => {
      engine.createExperiment({
        id: 'sig-test',
        name: '显著性测试',
        variants: [
          { id: 'control', name: '对照组', weight: 50 },
          { id: 'treatment', name: '实验组', weight: 50 },
        ],
      })
      engine.startExperiment('sig-test')
      
      // 模拟大量数据
      for (let i = 0; i < 1000; i++) {
        engine.assignVariant('sig-test', `user-${i}`)
        engine.trackImpression('sig-test', `user-${i}`)
        
        // 不同的转化率
        if (i < 500) {
          // 对照组 10% 转化
          if (i < 50) {
            engine.trackConversion('sig-test', `user-${i}`, 'convert')
          }
        } else {
          // 实验组 15% 转化
          if (i < 575) {
            engine.trackConversion('sig-test', `user-${i}`, 'convert')
          }
        }
      }
      
      const confidence = engine.calculateConfidence('sig-test')
      
      expect(confidence).toBeDefined()
      expect(confidence).toBeGreaterThanOrEqual(0)
      expect(confidence).toBeLessThanOrEqual(1)
    })
  })
  
  describe('实验过滤', () => {
    beforeEach(() => {
      engine.createExperiment({
        id: 'exp-running',
        name: '运行中',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      engine.startExperiment('exp-running')
      
      engine.createExperiment({
        id: 'exp-draft',
        name: '草稿',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      
      engine.createExperiment({
        id: 'exp-completed',
        name: '已完成',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      engine.startExperiment('exp-completed')
      engine.completeExperiment('exp-completed', 'a')
    })
    
    it('应该过滤运行中的实验', () => {
      const running = engine.getExperimentsByStatus('running')
      expect(running.length).toBe(1)
      expect(running[0].id).toBe('exp-running')
    })
    
    it('应该过滤草稿实验', () => {
      const drafts = engine.getExperimentsByStatus('draft')
      expect(drafts.length).toBe(1)
      expect(drafts[0].id).toBe('exp-draft')
    })
    
    it('应该过滤已完成的实验', () => {
      const completed = engine.getExperimentsByStatus('completed')
      expect(completed.length).toBe(1)
      expect(completed[0].id).toBe('exp-completed')
    })
  })
  
  describe('工厂函数', () => {
    it('createExperimentEngine应该创建实例', () => {
      const eng = createExperimentEngine()
      expect(eng).toBeInstanceOf(ExperimentEngine)
    })
    
    it('应该支持自定义配置', () => {
      const eng = createExperimentEngine({
        reportingInterval: 5000,
        maxEventsPerBatch: 100,
      })
      
      expect(eng).toBeInstanceOf(ExperimentEngine)
    })
  })
  
  describe('事件监听', () => {
    it('应该在实验创建时触发事件', () => {
      const callback = vi.fn()
      engine.on('experiment:created', callback)
      
      engine.createExperiment({
        id: 'new-exp',
        name: '新实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'new-exp' })
      )
    })
    
    it('应该在实验状态变化时触发事件', () => {
      engine.createExperiment({
        id: 'status-exp',
        name: '状态实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      
      const callback = vi.fn()
      engine.on('experiment:statusChanged', callback)
      
      engine.startExperiment('status-exp')
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          experimentId: 'status-exp',
          fromStatus: 'draft',
          toStatus: 'running',
        })
      )
    })
    
    it('应该在用户分配时触发事件', () => {
      engine.createExperiment({
        id: 'assign-exp',
        name: '分配实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
      })
      engine.startExperiment('assign-exp')
      
      const callback = vi.fn()
      engine.on('user:assigned', callback)
      
      engine.assignVariant('assign-exp', 'user-789')
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          experimentId: 'assign-exp',
          userId: 'user-789',
          variantId: 'a',
        })
      )
    })
  })
  
  describe('目标设置', () => {
    it('应该设置实验目标', () => {
      engine.createExperiment({
        id: 'goal-exp',
        name: '目标实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
        goals: [
          { id: 'signup', name: '注册', type: 'conversion' },
          { id: 'revenue', name: '收入', type: 'value' },
        ],
      })
      
      const exp = engine.getExperiment('goal-exp')
      expect(exp?.goals?.length).toBe(2)
    })
    
    it('应该按目标追踪转化', () => {
      engine.createExperiment({
        id: 'multi-goal',
        name: '多目标实验',
        variants: [{ id: 'a', name: 'A', weight: 100 }],
        goals: [
          { id: 'signup', name: '注册', type: 'conversion' },
          { id: 'purchase', name: '购买', type: 'conversion' },
        ],
      })
      engine.startExperiment('multi-goal')
      
      engine.assignVariant('multi-goal', 'user-1')
      engine.trackConversion('multi-goal', 'user-1', 'signup')
      engine.trackConversion('multi-goal', 'user-1', 'purchase')
      
      const metrics = engine.getMetrics('multi-goal')
      expect(metrics.byGoal?.signup).toBe(1)
      expect(metrics.byGoal?.purchase).toBe(1)
    })
  })
})