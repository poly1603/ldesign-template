/**
 * 动画系统 - 主入口（轻量级核心）
 * 
 * 代码分割策略：
 * - core: 基础动画类型（fade, slide, scale） < 5KB
 * - gesture: 手势控制（可选加载） ~8KB
 * - parallax: 视差效果（可选加载） ~6KB
 * - advanced: 高级动画（可选加载） ~10KB
 */

export * from './types'
export { Animation, AnimationController } from './core'

// 懒加载高级功能
export const loadGestureController = () => import('./gesture').then(m => m.GestureController)
export const loadParallaxController = () => import('./parallax').then(m => m.ParallaxController)
export const loadAdvancedAnimations = () => import('./advanced')

// 导出默认控制器实例（仅核心）
export { animationController } from './core'



