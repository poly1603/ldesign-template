import { type Ref } from 'vue';
/**
 * 动画缓动函数类型
 */
export type EasingFunction = (t: number) => number;
/**
 * 预设缓动函数
 */
export declare const EASING_FUNCTIONS: Record<string, EasingFunction>;
/**
 * 动画配置
 */
export interface AnimationConfig {
    duration?: number;
    delay?: number;
    easing?: string | EasingFunction;
    loop?: boolean | number;
    yoyo?: boolean;
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
}
/**
 * 视差滚动配置
 */
export interface ParallaxConfig {
    speed?: number;
    direction?: 'vertical' | 'horizontal' | 'both';
    reverse?: boolean;
    offset?: number;
    threshold?: [number, number];
}
/**
 * 手势动画配置
 */
export interface GestureConfig {
    type?: 'drag' | 'swipe' | 'pinch' | 'rotate';
    threshold?: number;
    onGestureStart?: (event: TouchEvent | MouseEvent) => void;
    onGestureMove?: (delta: {
        x: number;
        y: number;
    }, event: TouchEvent | MouseEvent) => void;
    onGestureEnd?: (velocity: {
        x: number;
        y: number;
    }, event: TouchEvent | MouseEvent) => void;
}
/**
 * 序列动画步骤
 */
export interface SequenceStep {
    target: string | HTMLElement;
    properties: Record<string, any>;
    config?: AnimationConfig;
}
/**
 * 使用模板动画
 */
export declare function useTemplateAnimation(options?: AnimationConfig): {
    isPlaying: Ref<boolean, boolean>;
    isPaused: Ref<boolean, boolean>;
    progress: Ref<number, number>;
    currentLoop: Ref<number, number>;
    play: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    reset: () => void;
};
/**
 * 使用视差滚动效果
 */
export declare function useParallax(elementRef: Ref<HTMLElement | null>, config?: ParallaxConfig): {
    scrollY: Ref<number, number>;
    scrollX: Ref<number, number>;
    transform: import("vue").ComputedRef<string>;
};
/**
 * 使用手势动画
 */
export declare function useGesture(elementRef: Ref<HTMLElement | null>, config?: GestureConfig): {
    isGesturing: Ref<boolean, boolean>;
    delta: import("vue").ComputedRef<{
        x: number;
        y: number;
    }>;
    startPos: Ref<{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    } | {
        x: number;
        y: number;
    }>;
    currentPos: Ref<{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    } | {
        x: number;
        y: number;
    }>;
};
/**
 * 使用序列动画
 */
export declare function useSequenceAnimation(steps: SequenceStep[]): {
    currentStep: Ref<number, number>;
    isPlaying: Ref<boolean, boolean>;
    completedSteps: Ref<number[], number[]>;
    play: () => Promise<void>;
    playFrom: (stepIndex: number) => Promise<void>;
    stop: () => void;
};
/**
 * 使用滚动触发动画
 */
export declare function useScrollAnimation(elementRef: Ref<HTMLElement | null>, animationConfig?: AnimationConfig & {
    triggerOffset?: number;
    once?: boolean;
}): {
    hasTriggered: Ref<boolean, boolean>;
    isPlaying: Ref<boolean, boolean>;
    isPaused: Ref<boolean, boolean>;
    progress: Ref<number, number>;
    currentLoop: Ref<number, number>;
    play: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    reset: () => void;
};
