import { type Ref, type Component } from 'vue';
import type { TemplateMetadata } from '@ldesign/template-core';
/**
 * useTemplate 返回值
 */
export interface UseTemplateReturn {
    /**
     * 模板元数据
     */
    template: Ref<TemplateMetadata | undefined>;
    /**
     * 加载的组件
     */
    component: Ref<Component | undefined>;
    /**
     * 加载状态
     */
    loading: Ref<boolean>;
    /**
     * 错误信息
     */
    error: Ref<Error | undefined>;
    /**
     * 加载模板
     */
    load: (id?: string) => Promise<void>;
    /**
     * 卸载模板
     */
    unload: () => void;
}
/**
 * 使用模板 Composable
 *
 * @param templateId - 模板ID或响应式ID
 * @param options - 选项
 * @returns 模板状态和操作方法
 *
 * @example
 * ```ts
 * const { component, loading, error, load } = useTemplate('login:desktop:default')
 *
 * onMounted(() => load())
 * ```
 */
export declare function useTemplate(templateId: string | Ref<string>, options?: {
    /**
     * 是否自动加载
     * @default false
     */
    immediate?: boolean;
    /**
     * 加载成功回调
     */
    onLoad?: (template: TemplateMetadata) => void;
    /**
     * 加载失败回调
     */
    onError?: (error: Error) => void;
}): UseTemplateReturn;
//# sourceMappingURL=useTemplate.d.ts.map