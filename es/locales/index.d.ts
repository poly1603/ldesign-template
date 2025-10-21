/**
 * Template System 内置国际化
 */
export interface TemplateLocale {
    title: string;
    category: {
        login: string;
        dashboard: string;
        error: string;
        profile: string;
        settings: string;
        [key: string]: string;
    };
    device: {
        desktop: string;
        tablet: string;
        mobile: string;
    };
    actions: {
        selectTemplate: string;
        previewTemplate: string;
        applyTemplate: string;
        loadMore: string;
        clearCache: string;
        savePreference: string;
    };
    messages: {
        loading: string;
        noTemplates: string;
        loadError: string;
        applySuccess: string;
        preferenceSaved: string;
    };
}
export declare const zhCN: TemplateLocale;
export declare const enUS: TemplateLocale;
export declare const jaJP: TemplateLocale;
export declare const locales: Record<string, TemplateLocale>;
export declare function getLocale(locale: string): TemplateLocale;
export declare const supportedLocales: string[];
export type LocaleKey = keyof typeof locales;
