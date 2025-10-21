import { type Ref } from 'vue';
/**
 * 快照数据结构
 */
export interface TemplateSnapshot<T = any> {
    id: string;
    timestamp: number;
    data: T;
    metadata?: Record<string, any>;
    description?: string;
    tags?: string[];
}
/**
 * 快照配置
 */
export interface SnapshotOptions {
    maxSnapshots?: number;
    autoSave?: boolean;
    autoSaveInterval?: number;
    compressOldSnapshots?: boolean;
    storageKey?: string;
    enablePersistence?: boolean;
}
/**
 * 时间旅行操作
 */
export interface TimeTravel {
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    goto: (snapshotId: string) => void;
    reset: () => void;
}
/**
 * 使用模板快照
 */
export declare function useTemplateSnapshot<T = any>(initialData: T | Ref<T>, options?: SnapshotOptions): {
    currentData: Ref<T, T>;
    snapshots: import("vue").ComputedRef<{
        id: string;
        timestamp: number;
        data: import("vue").UnwrapRef<T>;
        metadata?: Record<string, any> | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
    }[]>;
    currentSnapshot: import("vue").ComputedRef<{
        id: string;
        timestamp: number;
        data: import("vue").UnwrapRef<T>;
        metadata?: Record<string, any> | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
    }>;
    currentSnapshotIndex: import("vue").ComputedRef<number>;
    snapshotCount: import("vue").ComputedRef<number>;
    canUndo: import("vue").ComputedRef<boolean>;
    canRedo: import("vue").ComputedRef<boolean>;
    undo: () => void;
    redo: () => void;
    goto: (snapshotId: string) => void;
    gotoIndex: (index: number) => void;
    reset: () => void;
    takeSnapshot: (description?: string, metadata?: Record<string, any>, tags?: string[]) => TemplateSnapshot<T> | undefined;
    clearSnapshots: () => void;
    deleteSnapshot: (snapshotId: string) => void;
    getSnapshots: () => {
        id: string;
        timestamp: number;
        description: string | undefined;
        tags: string[] | undefined;
        isCurrent: boolean;
    }[];
    searchSnapshots: (query: {
        tags?: string[];
        startTime?: number;
        endTime?: number;
        description?: string;
    }) => {
        id: string;
        timestamp: number;
        data: import("vue").UnwrapRef<T>;
        metadata?: Record<string, any> | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
    }[];
    compareSnapshots: (snapshotId1: string, snapshotId2: string) => {
        snapshot1: {
            id: string;
            timestamp: number;
        };
        snapshot2: {
            id: string;
            timestamp: number;
        };
        differences: any[];
    } | null;
    exportSnapshots: (format?: "json" | "csv") => string;
    importSnapshots: (data: string) => boolean;
    cleanup: () => void;
};
/**
 * 使用时间旅行（简化版）
 */
export declare function useTimeTravel<T = any>(initialData: T | Ref<T>, options?: SnapshotOptions): {
    data: Ref<T, T>;
    canUndo: import("vue").ComputedRef<boolean>;
    canRedo: import("vue").ComputedRef<boolean>;
    undo: () => void;
    redo: () => void;
    goto: (snapshotId: string) => void;
    reset: () => void;
    takeSnapshot: (description?: string, metadata?: Record<string, any>, tags?: string[]) => TemplateSnapshot<T> | undefined;
};
