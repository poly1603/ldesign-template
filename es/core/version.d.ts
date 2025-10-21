/**
 * 模板版本控制系统
 */
import type { Template } from '../types';
/**
 * 版本信息
 */
export interface TemplateVersion {
    /**
     * 版本号
     */
    version: string;
    /**
     * 创建时间
     */
    createdAt: Date;
    /**
     * 更新时间
     */
    updatedAt: Date;
    /**
     * 作者
     */
    author?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 标签
     */
    tags?: string[];
    /**
     * 是否已发布
     */
    published?: boolean;
    /**
     * 是否已废弃
     */
    deprecated?: boolean;
    /**
     * 废弃信息
     */
    deprecationInfo?: {
        reason: string;
        alternative?: string;
        removeIn?: string;
    };
}
/**
 * 版本化模板
 */
export interface VersionedTemplate extends Template {
    /**
     * 版本信息
     */
    version: TemplateVersion;
    /**
     * 变更历史
     */
    changelog?: ChangeLog[];
    /**
     * 迁移配置
     */
    migrations?: Migration[];
}
/**
 * 变更日志
 */
export interface ChangeLog {
    /**
     * 版本号
     */
    version: string;
    /**
     * 日期
     */
    date: Date;
    /**
     * 类型
     */
    type: 'major' | 'minor' | 'patch' | 'hotfix';
    /**
     * 变更内容
     */
    changes: ChangeEntry[];
    /**
     * 破坏性变更
     */
    breaking?: string[];
}
/**
 * 变更条目
 */
export interface ChangeEntry {
    /**
     * 类型
     */
    type: 'added' | 'changed' | 'fixed' | 'removed' | 'security' | 'deprecated';
    /**
     * 描述
     */
    description: string;
    /**
     * 相关issue
     */
    issues?: string[];
}
/**
 * 迁移配置
 */
export interface Migration {
    /**
     * 源版本
     */
    from: string;
    /**
     * 目标版本
     */
    to: string;
    /**
     * 迁移函数
     */
    migrate: MigrationFunction;
    /**
     * 回滚函数
     */
    rollback?: MigrationFunction;
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否自动执行
     */
    auto?: boolean;
}
/**
 * 迁移函数
 */
export type MigrationFunction = (template: Template, options?: MigrationOptions) => Promise<Template> | Template;
/**
 * 迁移选项
 */
export interface MigrationOptions {
    /**
     * 是否备份
     */
    backup?: boolean;
    /**
     * 是否验证
     */
    validate?: boolean;
    /**
     * 自定义数据
     */
    data?: Record<string, any>;
}
/**
 * 版本比较结果
 */
export interface VersionComparison {
    /**
     * 是否相同
     */
    equal: boolean;
    /**
     * 是否更新
     */
    newer: boolean;
    /**
     * 是否更旧
     */
    older: boolean;
    /**
     * 主版本差异
     */
    majorDiff: number;
    /**
     * 次版本差异
     */
    minorDiff: number;
    /**
     * 补丁版本差异
     */
    patchDiff: number;
}
/**
 * 版本管理器
 */
export declare class TemplateVersionManager {
    private versions;
    private migrations;
    private currentVersions;
    private backups;
    /**
     * 注册版本
     */
    registerVersion(templateId: string, version: string, template: Template, versionInfo?: Partial<TemplateVersion>): void;
    /**
     * 获取版本
     */
    getVersion(templateId: string, version?: string): VersionedTemplate | undefined;
    /**
     * 获取所有版本
     */
    getAllVersions(templateId: string): VersionedTemplate[];
    /**
     * 比较版本
     */
    compareVersions(v1: string, v2: string): VersionComparison;
    /**
     * 注册迁移
     */
    registerMigration(templateId: string, migration: Migration): void;
    /**
     * 执行迁移
     */
    migrate(templateId: string, fromVersion: string, toVersion: string, options?: MigrationOptions): Promise<VersionedTemplate>;
    /**
     * 查找迁移路径
     */
    private findMigrationPath;
    /**
     * 备份模板
     */
    private backup;
    /**
     * 恢复备份
     */
    restoreBackup(templateId: string, index?: number): VersionedTemplate | undefined;
    /**
     * 验证模板
     */
    private validateTemplate;
    /**
     * 创建新版本
     */
    createVersion(templateId: string, newVersion: string, changes: Partial<Template>, versionInfo?: Partial<TemplateVersion>): VersionedTemplate;
    /**
     * 发布版本
     */
    publishVersion(templateId: string, version: string): void;
    /**
     * 废弃版本
     */
    deprecateVersion(templateId: string, version: string, reason: string, alternative?: string): void;
    /**
     * 获取变更日志
     */
    getChangelog(templateId: string): ChangeLog[];
    /**
     * 清理旧版本
     */
    cleanupOldVersions(templateId: string, keepCount?: number): void;
}
export declare const versionManager: TemplateVersionManager;
/**
 * 创建版本化模板
 */
export declare function createVersionedTemplate(template: Template, version: string, versionInfo?: Partial<TemplateVersion>): VersionedTemplate;
/**
 * 创建迁移
 */
export declare function createMigration(from: string, to: string, migrate: MigrationFunction, options?: {
    rollback?: MigrationFunction;
    description?: string;
    auto?: boolean;
}): Migration;
