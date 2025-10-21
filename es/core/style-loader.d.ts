/**
 * 样式加载助手 - 自动加载组件样式
 */
/**
 * 加载组件样式
 */
export declare function loadComponentStyle(category: string, device: string, name: string, componentPath?: string): void;
/**
 * 批量加载样式
 */
export declare function loadStyles(paths: string[]): void;
/**
 * 加载全局样式
 */
export declare function loadGlobalStyles(): void;
/**
 * 移除单个样式
 */
export declare function removeStyle(id: string): void;
/**
 * 清除已加载的样式
 */
export declare function clearLoadedStyles(): void;
/**
 * 清除未使用的样式
 */
export declare function cleanupUnusedStyles(): void;
