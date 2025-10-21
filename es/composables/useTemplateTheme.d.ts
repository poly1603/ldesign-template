/**
 * 模板主题系统
 *
 * 支持多主题切换、自定义主题、主题继承等功能
 */
import type { Ref } from 'vue';
/**
 * 主题配置
 */
export interface TemplateTheme {
    name: string;
    displayName?: string;
    colors: {
        primary: string;
        secondary?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
        background?: string;
        surface?: string;
        text?: string;
        textSecondary?: string;
        border?: string;
        [key: string]: string | undefined;
    };
    fonts?: {
        primary?: string;
        secondary?: string;
        mono?: string;
        [key: string]: string | undefined;
    };
    spacing?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
        [key: string]: string | undefined;
    };
    borderRadius?: {
        none?: string;
        sm?: string;
        md?: string;
        lg?: string;
        full?: string;
        [key: string]: string | undefined;
    };
    shadows?: {
        none?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
        [key: string]: string | undefined;
    };
    breakpoints?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
        [key: string]: string | undefined;
    };
    transitions?: {
        fast?: string;
        normal?: string;
        slow?: string;
        [key: string]: string | undefined;
    };
    extends?: string;
    cssVars?: Record<string, string>;
}
/**
 * 预设主题
 */
export declare const PRESET_THEMES: Record<string, TemplateTheme>;
/**
 * 主题上下文
 */
export interface ThemeContext {
    currentTheme: Ref<string>;
    themes: Map<string, TemplateTheme>;
    setTheme: (themeName: string) => void;
    registerTheme: (theme: TemplateTheme) => void;
    createCustomTheme: (name: string, overrides: Partial<TemplateTheme>) => TemplateTheme;
    applyTheme: (theme: TemplateTheme) => void;
    getTheme: (name: string) => TemplateTheme | undefined;
    removeTheme: (name: string) => boolean;
}
/**
 * 创建主题管理器
 */
export declare function createThemeManager(defaultTheme?: string): {
    currentTheme: Readonly<Ref<string, string>>;
    themes: Map<string, TemplateTheme>;
    setTheme: (themeName: string) => void;
    registerTheme: (theme: TemplateTheme) => void;
    createCustomTheme: (name: string, overrides: Partial<TemplateTheme>) => TemplateTheme;
    applyTheme: (theme: TemplateTheme) => void;
    getTheme: (name: string) => TemplateTheme | undefined;
    removeTheme: (name: string) => boolean;
    appliedTheme: Readonly<Ref<{
        readonly name: string;
        readonly displayName?: string | undefined;
        readonly colors: {
            readonly [x: string]: string | undefined;
            readonly primary: string;
            readonly secondary?: string | undefined;
            readonly success?: string | undefined;
            readonly warning?: string | undefined;
            readonly error?: string | undefined;
            readonly info?: string | undefined;
            readonly background?: string | undefined;
            readonly surface?: string | undefined;
            readonly text?: string | undefined;
            readonly textSecondary?: string | undefined;
            readonly border?: string | undefined;
        };
        readonly fonts?: {
            readonly [x: string]: string | undefined;
            readonly primary?: string | undefined;
            readonly secondary?: string | undefined;
            readonly mono?: string | undefined;
        } | undefined;
        readonly spacing?: {
            readonly [x: string]: string | undefined;
            readonly xs?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly xl?: string | undefined;
        } | undefined;
        readonly borderRadius?: {
            readonly [x: string]: string | undefined;
            readonly none?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly full?: string | undefined;
        } | undefined;
        readonly shadows?: {
            readonly [x: string]: string | undefined;
            readonly none?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly xl?: string | undefined;
        } | undefined;
        readonly breakpoints?: {
            readonly [x: string]: string | undefined;
            readonly xs?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly xl?: string | undefined;
        } | undefined;
        readonly transitions?: {
            readonly [x: string]: string | undefined;
            readonly fast?: string | undefined;
            readonly normal?: string | undefined;
            readonly slow?: string | undefined;
        } | undefined;
        readonly extends?: string | undefined;
        readonly cssVars?: {
            readonly [x: string]: string;
        } | undefined;
    } | null, {
        readonly name: string;
        readonly displayName?: string | undefined;
        readonly colors: {
            readonly [x: string]: string | undefined;
            readonly primary: string;
            readonly secondary?: string | undefined;
            readonly success?: string | undefined;
            readonly warning?: string | undefined;
            readonly error?: string | undefined;
            readonly info?: string | undefined;
            readonly background?: string | undefined;
            readonly surface?: string | undefined;
            readonly text?: string | undefined;
            readonly textSecondary?: string | undefined;
            readonly border?: string | undefined;
        };
        readonly fonts?: {
            readonly [x: string]: string | undefined;
            readonly primary?: string | undefined;
            readonly secondary?: string | undefined;
            readonly mono?: string | undefined;
        } | undefined;
        readonly spacing?: {
            readonly [x: string]: string | undefined;
            readonly xs?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly xl?: string | undefined;
        } | undefined;
        readonly borderRadius?: {
            readonly [x: string]: string | undefined;
            readonly none?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly full?: string | undefined;
        } | undefined;
        readonly shadows?: {
            readonly [x: string]: string | undefined;
            readonly none?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly xl?: string | undefined;
        } | undefined;
        readonly breakpoints?: {
            readonly [x: string]: string | undefined;
            readonly xs?: string | undefined;
            readonly sm?: string | undefined;
            readonly md?: string | undefined;
            readonly lg?: string | undefined;
            readonly xl?: string | undefined;
        } | undefined;
        readonly transitions?: {
            readonly [x: string]: string | undefined;
            readonly fast?: string | undefined;
            readonly normal?: string | undefined;
            readonly slow?: string | undefined;
        } | undefined;
        readonly extends?: string | undefined;
        readonly cssVars?: {
            readonly [x: string]: string;
        } | undefined;
    } | null>>;
    cleanup: () => void;
};
/**
 * 使用模板主题
 */
export declare function useTemplateTheme(): {
    isDark: import("vue").ComputedRef<boolean>;
    isLight: import("vue").ComputedRef<boolean>;
    toggleTheme: () => void;
    currentThemeConfig: import("vue").ComputedRef<TemplateTheme | undefined>;
    currentTheme: Ref<string>;
    themes: Map<string, TemplateTheme>;
    setTheme: (themeName: string) => void;
    registerTheme: (theme: TemplateTheme) => void;
    createCustomTheme: (name: string, overrides: Partial<TemplateTheme>) => TemplateTheme;
    applyTheme: (theme: TemplateTheme) => void;
    getTheme: (name: string) => TemplateTheme | undefined;
    removeTheme: (name: string) => boolean;
};
/**
 * 提供主题上下文
 */
export declare function provideTemplateTheme(defaultTheme?: string): ThemeContext;
