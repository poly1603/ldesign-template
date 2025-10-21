/**
 * 模板无障碍支持系统
 *
 * 提供键盘导航、屏幕阅读器支持、焦点管理等功能
 */
/**
 * 无障碍配置
 */
export interface A11yConfig {
    ariaLabels?: Record<string, string>;
    ariaDescriptions?: Record<string, string>;
    keyboardNavigation?: boolean;
    trapFocus?: boolean;
    escapeDeactivates?: boolean;
    screenReaderMode?: boolean;
    announceChanges?: boolean;
    liveRegion?: 'polite' | 'assertive' | 'off';
    highContrast?: boolean;
    focusIndicator?: boolean;
    reducedMotion?: boolean;
    headingLevel?: number;
    landmark?: 'main' | 'navigation' | 'complementary' | 'contentinfo';
    shortcuts?: Record<string, () => void>;
}
/**
 * 使用模板无障碍支持
 */
export declare function useTemplateA11y(config?: A11yConfig): {
    setContainer: (element: HTMLElement) => void;
    announce: (message: string) => void;
    focus: {
        first: () => void;
        last: () => void;
        next: () => void;
        previous: () => void;
        restore: () => void;
        update: () => void;
    };
    isHighContrast: import("vue").ComputedRef<boolean>;
    isReducedMotion: import("vue").ComputedRef<boolean>;
    isScreenReaderMode: import("vue").ComputedRef<boolean>;
    toggleHighContrast: () => void;
    toggleReducedMotion: () => void;
    toggleScreenReaderMode: () => void;
};
/**
 * 创建无障碍样式
 */
export declare function createA11yStyles(): string;
