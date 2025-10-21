/**
 * 模板版本控制组合式函数
 */
import type { Ref } from 'vue';
import type { ChangeLog, Migration, MigrationOptions, TemplateVersion, VersionComparison, VersionedTemplate } from '../core/version';
import type { Template } from '../types';
/**
 * 版本控制选项
 */
export interface UseTemplateVersionOptions {
    /**
     * 初始版本
     */
    initialVersion?: string;
    /**
     * 是否自动注册
     */
    autoRegister?: boolean;
    /**
     * 是否自动迁移
     */
    autoMigrate?: boolean;
    /**
     * 是否启用备份
     */
    enableBackup?: boolean;
    /**
     * 保留版本数量
     */
    keepVersions?: number;
    /**
     * 版本信息
     */
    versionInfo?: Partial<TemplateVersion>;
}
/**
 * 版本状态
 */
export interface VersionState {
    /**
     * 当前版本
     */
    current: string;
    /**
     * 可用版本列表
     */
    available: string[];
    /**
     * 是否有新版本
     */
    hasUpdate: boolean;
    /**
     * 是否已废弃
     */
    isDeprecated: boolean;
    /**
     * 迁移进度
     */
    migrationProgress?: {
        from: string;
        to: string;
        step: number;
        total: number;
    };
}
/**
 * 使用模板版本控制
 */
export declare function useTemplateVersion(template: Ref<Template> | Template, options?: UseTemplateVersionOptions): {
    versionState: {
        current: string;
        available: string[];
        hasUpdate: boolean;
        isDeprecated: boolean;
        migrationProgress?: {
            from: string;
            to: string;
            step: number;
            total: number;
        } | undefined;
    };
    versionedTemplate: Ref<{
        version: {
            version: string;
            createdAt: Date;
            updatedAt: Date;
            author?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            published?: boolean | undefined;
            deprecated?: boolean | undefined;
            deprecationInfo?: {
                reason: string;
                alternative?: string | undefined;
                removeIn?: string | undefined;
            } | undefined;
        };
        changelog?: {
            version: string;
            date: Date;
            type: "major" | "minor" | "patch" | "hotfix";
            changes: {
                type: "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
                description: string;
                issues?: string[] | undefined;
            }[];
            breaking?: string[] | undefined;
        }[] | undefined;
        migrations?: {
            from: string;
            to: string;
            migrate: import("../core/version").MigrationFunction;
            rollback?: import("../core/version").MigrationFunction | undefined;
            description?: string | undefined;
            auto?: boolean | undefined;
        }[] | undefined;
        id: string;
        name: string;
        category?: string | undefined;
        component?: import("vue").Component | any;
        content?: string | undefined;
        metadata?: {
            name: string;
            displayName: string;
            description?: string | undefined;
            category: import("../types").TemplateCategory;
            device: import("../types").DeviceType;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        config?: {
            [x: string]: any;
            slots?: {
                [key: string]: {
                    name: string;
                    description?: string;
                    example?: string;
                    props?: Record<string, any>;
                    required?: boolean;
                };
            } | {
                name: string;
                description?: string | undefined;
                example?: string | undefined;
                props?: (string[] | Record<string, any>) | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            name: string;
            displayName: string;
            description?: string | undefined;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
    } | null, VersionedTemplate | {
        version: {
            version: string;
            createdAt: Date;
            updatedAt: Date;
            author?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            published?: boolean | undefined;
            deprecated?: boolean | undefined;
            deprecationInfo?: {
                reason: string;
                alternative?: string | undefined;
                removeIn?: string | undefined;
            } | undefined;
        };
        changelog?: {
            version: string;
            date: Date;
            type: "major" | "minor" | "patch" | "hotfix";
            changes: {
                type: "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
                description: string;
                issues?: string[] | undefined;
            }[];
            breaking?: string[] | undefined;
        }[] | undefined;
        migrations?: {
            from: string;
            to: string;
            migrate: import("../core/version").MigrationFunction;
            rollback?: import("../core/version").MigrationFunction | undefined;
            description?: string | undefined;
            auto?: boolean | undefined;
        }[] | undefined;
        id: string;
        name: string;
        category?: string | undefined;
        component?: import("vue").Component | any;
        content?: string | undefined;
        metadata?: {
            name: string;
            displayName: string;
            description?: string | undefined;
            category: import("../types").TemplateCategory;
            device: import("../types").DeviceType;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        config?: {
            [x: string]: any;
            slots?: {
                [key: string]: {
                    name: string;
                    description?: string;
                    example?: string;
                    props?: Record<string, any>;
                    required?: boolean;
                };
            } | {
                name: string;
                description?: string | undefined;
                example?: string | undefined;
                props?: (string[] | Record<string, any>) | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            name: string;
            displayName: string;
            description?: string | undefined;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
    } | null>;
    changelog: Ref<{
        version: string;
        date: Date;
        type: "major" | "minor" | "patch" | "hotfix";
        changes: {
            type: "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
            description: string;
            issues?: string[] | undefined;
        }[];
        breaking?: string[] | undefined;
    }[], ChangeLog[] | {
        version: string;
        date: Date;
        type: "major" | "minor" | "patch" | "hotfix";
        changes: {
            type: "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
            description: string;
            issues?: string[] | undefined;
        }[];
        breaking?: string[] | undefined;
    }[]>;
    migrationQueue: Ref<{
        from: string;
        to: string;
        migrate: import("../core/version").MigrationFunction;
        rollback?: import("../core/version").MigrationFunction | undefined;
        description?: string | undefined;
        auto?: boolean | undefined;
    }[], Migration[] | {
        from: string;
        to: string;
        migrate: import("../core/version").MigrationFunction;
        rollback?: import("../core/version").MigrationFunction | undefined;
        description?: string | undefined;
        auto?: boolean | undefined;
    }[]>;
    isMigrating: Ref<boolean, boolean>;
    createVersion: (version: string, changes: Partial<Template>, info?: Partial<TemplateVersion>) => VersionedTemplate | undefined;
    switchVersion: (version: string) => Promise<boolean>;
    migrate: (from: string, to: string, migrationOptions?: MigrationOptions) => Promise<VersionedTemplate | null>;
    registerMigration: (migration: Migration) => void;
    addMigration: (from: string, to: string, migrateFn: Migration["migrate"], rollbackFn?: Migration["rollback"]) => void;
    publish: (version?: string) => void;
    deprecate: (version: string, reason: string, alternative?: string) => void;
    compareVersions: (v1: string, v2: string) => VersionComparison;
    restoreBackup: (index?: number) => VersionedTemplate | undefined;
    getVersionDetails: (version?: string) => VersionedTemplate | undefined;
    getVersionHistory: () => VersionedTemplate[];
    updateVersionState: () => void;
};
/**
 * 使用版本比较
 */
export declare function useVersionComparison(v1: Ref<string>, v2: Ref<string>): {
    comparison: import("vue").ComputedRef<VersionComparison>;
    isNewer: import("vue").ComputedRef<boolean>;
    isOlder: import("vue").ComputedRef<boolean>;
    isEqual: import("vue").ComputedRef<boolean>;
    majorDiff: import("vue").ComputedRef<number>;
    minorDiff: import("vue").ComputedRef<number>;
    patchDiff: import("vue").ComputedRef<number>;
    needsMajorUpdate: import("vue").ComputedRef<boolean>;
    needsMinorUpdate: import("vue").ComputedRef<boolean>;
    needsPatchUpdate: import("vue").ComputedRef<boolean>;
};
/**
 * 使用自动迁移
 */
export declare function useAutoMigration(templateId: string, targetVersion: string, options?: MigrationOptions): {
    run: () => Promise<VersionedTemplate | null>;
    isRunning: Ref<boolean, boolean>;
    progress: Ref<number, number>;
    error: Ref<Error | null, Error | null>;
    result: Ref<{
        version: {
            version: string;
            createdAt: Date;
            updatedAt: Date;
            author?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            published?: boolean | undefined;
            deprecated?: boolean | undefined;
            deprecationInfo?: {
                reason: string;
                alternative?: string | undefined;
                removeIn?: string | undefined;
            } | undefined;
        };
        changelog?: {
            version: string;
            date: Date;
            type: "major" | "minor" | "patch" | "hotfix";
            changes: {
                type: "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
                description: string;
                issues?: string[] | undefined;
            }[];
            breaking?: string[] | undefined;
        }[] | undefined;
        migrations?: {
            from: string;
            to: string;
            migrate: import("../core/version").MigrationFunction;
            rollback?: import("../core/version").MigrationFunction | undefined;
            description?: string | undefined;
            auto?: boolean | undefined;
        }[] | undefined;
        id: string;
        name: string;
        category?: string | undefined;
        component?: import("vue").Component | any;
        content?: string | undefined;
        metadata?: {
            name: string;
            displayName: string;
            description?: string | undefined;
            category: import("../types").TemplateCategory;
            device: import("../types").DeviceType;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        config?: {
            [x: string]: any;
            slots?: {
                [key: string]: {
                    name: string;
                    description?: string;
                    example?: string;
                    props?: Record<string, any>;
                    required?: boolean;
                };
            } | {
                name: string;
                description?: string | undefined;
                example?: string | undefined;
                props?: (string[] | Record<string, any>) | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            name: string;
            displayName: string;
            description?: string | undefined;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
    } | null, VersionedTemplate | {
        version: {
            version: string;
            createdAt: Date;
            updatedAt: Date;
            author?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            published?: boolean | undefined;
            deprecated?: boolean | undefined;
            deprecationInfo?: {
                reason: string;
                alternative?: string | undefined;
                removeIn?: string | undefined;
            } | undefined;
        };
        changelog?: {
            version: string;
            date: Date;
            type: "major" | "minor" | "patch" | "hotfix";
            changes: {
                type: "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
                description: string;
                issues?: string[] | undefined;
            }[];
            breaking?: string[] | undefined;
        }[] | undefined;
        migrations?: {
            from: string;
            to: string;
            migrate: import("../core/version").MigrationFunction;
            rollback?: import("../core/version").MigrationFunction | undefined;
            description?: string | undefined;
            auto?: boolean | undefined;
        }[] | undefined;
        id: string;
        name: string;
        category?: string | undefined;
        component?: import("vue").Component | any;
        content?: string | undefined;
        metadata?: {
            name: string;
            displayName: string;
            description?: string | undefined;
            category: import("../types").TemplateCategory;
            device: import("../types").DeviceType;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        config?: {
            [x: string]: any;
            slots?: {
                [key: string]: {
                    name: string;
                    description?: string;
                    example?: string;
                    props?: Record<string, any>;
                    required?: boolean;
                };
            } | {
                name: string;
                description?: string | undefined;
                example?: string | undefined;
                props?: (string[] | Record<string, any>) | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            name: string;
            displayName: string;
            description?: string | undefined;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        } | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
    } | null>;
};
