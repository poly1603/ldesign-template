/**
 * 模板动画系统
 */
/**
 * 动画类型
 */
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'bounce' | 'shake' | 'pulse' | 'parallax' | 'morph' | 'reveal' | 'typewriter' | 'gradient' | 'blur' | 'custom';
/**
 * 动画方向
 */
export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'in' | 'out';
/**
 * 缓动函数
 */
export type EasingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier' | 'spring' | 'elastic' | 'bounce';
/**
 * 动画配置
 */
export interface AnimationConfig {
    /**
     * 动画类型
     */
    type: AnimationType;
    /**
     * 动画时长（毫秒）
     */
    duration?: number;
    /**
     * 延迟时间（毫秒）
     */
    delay?: number;
    /**
     * 缓动函数
     */
    easing?: EasingFunction | string;
    /**
     * 动画方向
     */
    direction?: AnimationDirection;
    /**
     * 迭代次数
     */
    iterations?: number | 'infinite';
    /**
     * 是否自动播放
     */
    autoPlay?: boolean;
    /**
     * 填充模式
     */
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
    /**
     * 自定义属性
     */
    properties?: Record<string, any>;
}
/**
 * 手势配置
 */
export interface GestureConfig {
    /**
     * 是否启用拖拽
     */
    drag?: boolean;
    /**
     * 是否启用旋转
     */
    rotate?: boolean;
    /**
     * 是否启用缩放
     */
    scale?: boolean;
    /**
     * 是否启用滑动
     */
    swipe?: boolean;
    /**
     * 拖拽约束
     */
    dragConstraints?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    /**
     * 弹性系数
     */
    dragElastic?: number;
    /**
     * 动量
     */
    dragMomentum?: boolean;
    /**
     * 滑动阈值
     */
    swipeThreshold?: number;
    /**
     * 滑动速度
     */
    swipeVelocity?: number;
}
/**
 * 视差配置
 */
export interface ParallaxConfig {
    /**
     * 速度系数
     */
    speed?: number;
    /**
     * 偏移量
     */
    offset?: number;
    /**
     * 是否启用水平视差
     */
    horizontal?: boolean;
    /**
     * 是否启用垂直视差
     */
    vertical?: boolean;
    /**
     * 是否启用旋转
     */
    rotate?: boolean;
    /**
     * 是否启用缩放
     */
    scale?: boolean;
    /**
     * 最大偏移量
     */
    maxOffset?: number;
    /**
     * 触发元素
     */
    trigger?: string | HTMLElement;
    /**
     * 是否平滑过渡
     */
    smooth?: boolean;
}
/**
 * 滚动动画配置
 */
export interface ScrollAnimationConfig {
    /**
     * 触发位置
     */
    trigger?: 'top' | 'center' | 'bottom';
    /**
     * 触发偏移
     */
    offset?: number;
    /**
     * 是否只触发一次
     */
    once?: boolean;
    /**
     * 滚动方向
     */
    direction?: 'up' | 'down' | 'both';
    /**
     * 进入动画
     */
    enter?: AnimationConfig;
    /**
     * 离开动画
     */
    leave?: AnimationConfig;
    /**
     * 进度回调
     */
    onProgress?: (progress: number) => void;
}
/**
 * 动画状态
 */
export interface AnimationState {
    /**
     * 是否正在播放
     */
    playing: boolean;
    /**
     * 是否暂停
     */
    paused: boolean;
    /**
     * 当前进度 (0-1)
     */
    progress: number;
    /**
     * 当前迭代次数
     */
    iteration: number;
    /**
     * 是否完成
     */
    finished: boolean;
}
/**
 * 动画控制器
 */
export declare class AnimationController {
    private animations;
    private rafId;
    private startTime;
    private disposed;
    constructor();
    /**
     * 创建动画
     */
    create(id: string, element: HTMLElement, config: AnimationConfig): Animation;
    /**
     * 播放动画
     */
    play(id: string): void;
    /**
     * 暂停动画
     */
    pause(id: string): void;
    /**
     * 停止动画
     */
    stop(id: string): void;
    /**
     * 重置动画
     */
    reset(id: string): void;
    /**
     * 销毁动画
     */
    destroy(id: string): void;
    /**
     * 销毁所有动画
     */
    destroyAll(): void;
}
/**
 * 单个动画实例
 */
export declare class Animation {
    private element;
    private config;
    private state;
    private animation;
    private initialStyles;
    constructor(element: HTMLElement, config: AnimationConfig);
    /**
     * 保存初始样式
     */
    private saveInitialStyles;
    /**
     * 获取关键帧
     */
    private getKeyframes;
    /**
     * 获取动画选项
     */
    private getAnimationOptions;
    /**
     * 获取缓动函数
     */
    private getEasing;
    /**
     * 播放动画
     */
    play(): void;
    /**
     * 暂停动画
     */
    pause(): void;
    /**
     * 停止动画
     */
    stop(): void;
    /**
     * 重置动画
     */
    reset(): void;
    /**
     * 反转动画
     */
    reverse(): void;
    /**
     * 设置播放速率
     */
    setPlaybackRate(rate: number): void;
    /**
     * 跳转到指定时间
     */
    seek(time: number): void;
    /**
     * 销毁动画
     */
    destroy(): void;
    /**
     * 获取状态
     */
    getState(): AnimationState;
}
/**
 * 视差控制器
 */
export declare class ParallaxController {
    private elements;
    private observer;
    private rafId;
    private scrollY;
    private scrollX;
    constructor();
    private init;
    /**
     * 添加视差元素
     */
    add(element: HTMLElement, config?: ParallaxConfig): void;
    /**
     * 移除视差元素
     */
    remove(element: HTMLElement): void;
    /**
     * 处理滚动
     */
    private handleScroll;
    /**
     * 开始视差效果
     */
    private startParallax;
    /**
     * 停止视差效果
     */
    private stopParallax;
    /**
     * 更新视差效果
     */
    private updateParallax;
    /**
     * 销毁
     */
    destroy(): void;
}
/**
 * 手势控制器
 */
export declare class GestureController {
    private element;
    private config;
    private isDragging;
    private startX;
    private startY;
    private currentX;
    private currentY;
    private velocityX;
    private velocityY;
    private rafId;
    constructor(element: HTMLElement, config?: GestureConfig);
    private init;
    /**
     * 初始化拖拽
     */
    private initDrag;
    /**
     * 初始化滑动
     */
    private initSwipe;
    /**
     * 初始化触摸手势
     */
    private initTouch;
    /**
     * 更新变换
     */
    private updateTransform;
    /**
     * 应用动量
     */
    private applyMomentum;
    /**
     * 滑动回调
     */
    private onSwipe;
    /**
     * 销毁
     */
    destroy(): void;
}
export declare const animationController: AnimationController;
export declare const parallaxController: ParallaxController;
