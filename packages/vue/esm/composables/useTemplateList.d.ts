import { type Ref, type ComputedRef } from 'vue';
import type { TemplateMetadata, DeviceType } from '@ldesign/template-core';
/**
 * useTemplateList 返回值
 */
export interface UseTemplateListReturn {
    /**
     * 模板列表
     */
    templates: Ref<TemplateMetadata[]>;
    /**
     * 加载状态
     */
    loading: Ref<boolean>;
    /**
     * 模板数量
     */
    count: ComputedRef<number>;
    /**
     * 刷新列表
     */
    refresh: () => void;
    /**
     * 按标签过滤
     */
    filterByTag: (tag: string) => TemplateMetadata[];
    /**
     * 搜索模板
     */
    search: (keyword: string) => TemplateMetadata[];
}
/**
 * 使用模板列表 Composable
 *
 * @param category - 功能分类
 * @param device - 设备类型(可选)
 * @returns 模板列表和操作方法
 *
 * @example
 * ```ts
 * const { templates, count, refresh } = useTemplateList('login', 'desktop')
 * ```
 */
export declare function useTemplateList(category: string | Ref<string>, device?: DeviceType | Ref<DeviceType | undefined>): UseTemplateListReturn;
//# sourceMappingURL=useTemplateList.d.ts.map