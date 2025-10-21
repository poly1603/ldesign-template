/**
 * 模板快照与时间旅行系统
 */
import type { Template } from '../types';
/**
 * 快照类型
 */
export interface Snapshot {
    /**
     * 快照ID
     */
    id: string;
    /**
     * 快照名称
     */
    name?: string;
    /**
     * 快照描述
     */
    description?: string;
    /**
     * 创建时间
     */
    timestamp: Date;
    /**
     * 模板状态
     */
    state: TemplateState;
    /**
     * 快照元数据
     */
    metadata?: Record<string, any>;
    /**
     * 快照标签
     */
    tags?: string[];
    /**
     * 是否为自动快照
     */
    auto?: boolean;
}
/**
 * 模板状态
 */
export interface TemplateState {
    /**
     * 模板数据
     */
    template: Template;
    /**
     * 表单数据
     */
    formData?: Record<string, any>;
    /**
     * 用户偏好
     */
    preferences?: Record<string, any>;
    /**
     * 运行时状态
     */
    runtime?: Record<string, any>;
    /**
     * DOM快照
     */
    domSnapshot?: string;
}
/**
 * 快照配置
 */
export interface SnapshotConfig {
    /**
     * 最大快照数量
     */
    maxSnapshots?: number;
    /**
     * 自动快照间隔（毫秒）
     */
    autoSnapshotInterval?: number;
    /**
     * 是否压缩存储
     */
    compress?: boolean;
    /**
     * 是否持久化存储
     */
    persist?: boolean;
    /**
     * 存储键名
     */
    storageKey?: string;
    /**
     * 快照前钩子
     */
    beforeSnapshot?: (state: TemplateState) => TemplateState | false;
    /**
     * 快照后钩子
     */
    afterSnapshot?: (snapshot: Snapshot) => void;
    /**
     * 恢复前钩子
     */
    beforeRestore?: (snapshot: Snapshot) => boolean;
    /**
     * 恢复后钩子
     */
    afterRestore?: (snapshot: Snapshot) => void;
}
/**
 * 时间旅行配置
 */
export interface TimeTravelConfig {
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 最大历史记录
     */
    maxHistory?: number;
    /**
     * 是否记录DOM变化
     */
    recordDOM?: boolean;
    /**
     * 忽略的属性
     */
    ignoreProperties?: string[];
    /**
     * 差异算法
     */
    diffAlgorithm?: 'deep' | 'shallow' | 'custom';
    /**
     * 自定义差异函数
     */
    customDiff?: (prev: any, next: any) => any;
}
/**
 * 快照管理器
 */
export declare class SnapshotManager {
    private snapshots;
    private history;
    private currentIndex;
    private config;
    private autoSnapshotTimer;
    constructor(config?: SnapshotConfig);
    /**
     * 创建快照
     */
    createSnapshot(state: TemplateState, options?: Partial<Snapshot>): Snapshot | null;
    /**
     * 恢复快照
     */
    restoreSnapshot(snapshotId: string): TemplateState | null;
    /**
     * 获取快照
     */
    getSnapshot(snapshotId: string): Snapshot | undefined;
    /**
     * 获取所有快照
     */
    getAllSnapshots(): Snapshot[];
    /**
     * 删除快照
     */
    deleteSnapshot(snapshotId: string): boolean;
    /**
     * 清空快照
     */
    clearSnapshots(): void;
    /**
     * 撤销
     */
    undo(): TemplateState | null;
    /**
     * 重做
     */
    redo(): TemplateState | null;
    /**
     * 是否可以撤销
     */
    canUndo(): boolean;
    /**
     * 是否可以重做
     */
    canRedo(): boolean;
    /**
     * 开始自动快照
     */
    private startAutoSnapshot;
    /**
     * 停止自动快照
     */
    private stopAutoSnapshot;
    /**
     * 生成ID
     */
    private generateId;
    /**
     * 克隆状态
     */
    private cloneState;
    /**
     * 保存到存储
     */
    private saveToStorage;
    /**
     * 从存储加载
     */
    private loadFromStorage;
    /**
     * 清空存储
     */
    private clearStorage;
    /**
     * 销毁
     */
    destroy(): void;
}
/**
 * 时间旅行控制器
 */
export declare class TimeTravelController {
    private history;
    private currentIndex;
    private config;
    private observers;
    constructor(config?: TimeTravelConfig);
    /**
     * 记录状态
     */
    record(state: TemplateState): void;
    /**
     * 后退
     */
    backward(): TemplateState | null;
    /**
     * 前进
     */
    forward(): TemplateState | null;
    /**
     * 跳转到指定位置
     */
    goto(index: number): TemplateState | null;
    /**
     * 获取历史记录
     */
    getHistory(): TemplateState[];
    /**
     * 获取当前索引
     */
    getCurrentIndex(): number;
    /**
     * 是否可以后退
     */
    canBackward(): boolean;
    /**
     * 是否可以前进
     */
    canForward(): boolean;
    /**
     * 清空历史
     */
    clear(): void;
    /**
     * 开始观察DOM变化
     */
    observeDOM(element: HTMLElement, callback?: (mutation: MutationRecord) => void): void;
    /**
     * 停止观察
     */
    disconnect(): void;
    /**
     * 记录DOM快照
     */
    private recordDOMSnapshot;
    /**
     * 克隆状态
     */
    private cloneState;
    /**
     * 计算差异
     */
    diff(prev: TemplateState, next: TemplateState): any;
    /**
     * 浅比较
     */
    private shallowDiff;
    /**
     * 深比较
     */
    private deepDiff;
    /**
     * 判断是否为原始类型
     */
    private isPrimitive;
    /**
     * 销毁
     */
    destroy(): void;
}
export declare const snapshotManager: SnapshotManager;
export declare const timeTravelController: TimeTravelController;
