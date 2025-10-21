/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var helpers = require('../utils/helpers.cjs');

class TemplateVersionManager {
  constructor() {
    this.versions = /* @__PURE__ */ new Map();
    this.migrations = /* @__PURE__ */ new Map();
    this.currentVersions = /* @__PURE__ */ new Map();
    this.backups = /* @__PURE__ */ new Map();
  }
  /**
   * 注册版本
   */
  registerVersion(templateId, version, template, versionInfo) {
    if (!this.versions.has(templateId)) {
      this.versions.set(templateId, /* @__PURE__ */ new Map());
    }
    const versionedTemplate = {
      ...template,
      version: {
        version,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...versionInfo
      }
    };
    this.versions.get(templateId).set(version, versionedTemplate);
    if (!this.currentVersions.has(templateId) || versionInfo?.published) {
      this.currentVersions.set(templateId, version);
    }
  }
  /**
   * 获取版本
   */
  getVersion(templateId, version) {
    const versions = this.versions.get(templateId);
    if (!versions) return void 0;
    if (version) {
      return versions.get(version);
    }
    const currentVersion = this.currentVersions.get(templateId);
    return currentVersion ? versions.get(currentVersion) : void 0;
  }
  /**
   * 获取所有版本
   */
  getAllVersions(templateId) {
    const versions = this.versions.get(templateId);
    if (!versions) return [];
    return Array.from(versions.values()).sort((a, b) => this.compareVersions(b.version.version, a.version.version).newer ? 1 : -1);
  }
  /**
   * 比较版本
   */
  compareVersions(v1, v2) {
    const parse = (v) => {
      const [major = 0, minor = 0, patch = 0] = v.split(".").map(Number);
      return {
        major,
        minor,
        patch
      };
    };
    const ver1 = parse(v1);
    const ver2 = parse(v2);
    const majorDiff = ver1.major - ver2.major;
    const minorDiff = ver1.minor - ver2.minor;
    const patchDiff = ver1.patch - ver2.patch;
    return {
      equal: majorDiff === 0 && minorDiff === 0 && patchDiff === 0,
      newer: majorDiff > 0 || majorDiff === 0 && minorDiff > 0 || majorDiff === 0 && minorDiff === 0 && patchDiff > 0,
      older: majorDiff < 0 || majorDiff === 0 && minorDiff < 0 || majorDiff === 0 && minorDiff === 0 && patchDiff < 0,
      majorDiff,
      minorDiff,
      patchDiff
    };
  }
  /**
   * 注册迁移
   */
  registerMigration(templateId, migration) {
    if (!this.migrations.has(templateId)) {
      this.migrations.set(templateId, []);
    }
    this.migrations.get(templateId).push(migration);
  }
  /**
   * 执行迁移
   */
  async migrate(templateId, fromVersion, toVersion, options) {
    const migrations = this.findMigrationPath(templateId, fromVersion, toVersion);
    if (!migrations.length) {
      throw new Error(`No migration path found from ${fromVersion} to ${toVersion}`);
    }
    let currentTemplate = this.getVersion(templateId, fromVersion);
    if (!currentTemplate) {
      throw new Error(`Version ${fromVersion} not found for template ${templateId}`);
    }
    if (options?.backup) {
      this.backup(templateId, currentTemplate);
    }
    for (const migration of migrations) {
      try {
        const result = await migration.migrate(currentTemplate, options);
        currentTemplate = {
          ...result,
          version: {
            ...currentTemplate.version,
            version: migration.to,
            updatedAt: /* @__PURE__ */ new Date()
          }
        };
        if (options?.validate) {
          this.validateTemplate(currentTemplate);
        }
      } catch (error) {
        console.error(`Migration failed from ${migration.from} to ${migration.to}:`, error);
        if (migration.rollback) {
          await migration.rollback(currentTemplate, options);
        }
        throw error;
      }
    }
    this.registerVersion(templateId, toVersion, currentTemplate, currentTemplate.version);
    return currentTemplate;
  }
  /**
   * 查找迁移路径
   */
  findMigrationPath(templateId, fromVersion, toVersion) {
    const migrations = this.migrations.get(templateId) || [];
    const path = [];
    let currentVersion = fromVersion;
    while (currentVersion !== toVersion) {
      const migration = migrations.find((m) => m.from === currentVersion);
      if (!migration) break;
      path.push(migration);
      currentVersion = migration.to;
    }
    return currentVersion === toVersion ? path : [];
  }
  /**
   * 备份模板
   */
  backup(templateId, template) {
    if (!this.backups.has(templateId)) {
      this.backups.set(templateId, []);
    }
    this.backups.get(templateId).push(helpers.deepClone(template));
    const backups = this.backups.get(templateId);
    if (backups.length > 10) {
      backups.shift();
    }
  }
  /**
   * 恢复备份
   */
  restoreBackup(templateId, index = -1) {
    const backups = this.backups.get(templateId);
    if (!backups || !backups.length) return void 0;
    const backup = index === -1 ? backups[backups.length - 1] : backups[index];
    if (!backup) return void 0;
    this.registerVersion(templateId, backup.version.version, backup, backup.version);
    return backup;
  }
  /**
   * 验证模板
   */
  validateTemplate(template) {
    if (!template.id) {
      throw new Error("Template must have an id");
    }
    if (!template.version?.version) {
      throw new Error("Template must have a version");
    }
    if (!/^\d+\.\d+\.\d+/.test(template.version.version)) {
      throw new Error("Version must be in semver format (x.y.z)");
    }
  }
  /**
   * 创建新版本
   */
  createVersion(templateId, newVersion, changes, versionInfo) {
    const currentTemplate = this.getVersion(templateId);
    if (!currentTemplate) {
      throw new Error(`Template ${templateId} not found`);
    }
    const newTemplate = {
      ...currentTemplate,
      ...changes,
      version: {
        version: newVersion,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...versionInfo
      }
    };
    this.registerVersion(templateId, newVersion, newTemplate, versionInfo);
    return newTemplate;
  }
  /**
   * 发布版本
   */
  publishVersion(templateId, version) {
    const template = this.getVersion(templateId, version);
    if (!template) {
      throw new Error(`Version ${version} not found for template ${templateId}`);
    }
    template.version.published = true;
    template.version.updatedAt = /* @__PURE__ */ new Date();
    this.currentVersions.set(templateId, version);
  }
  /**
   * 废弃版本
   */
  deprecateVersion(templateId, version, reason, alternative) {
    const template = this.getVersion(templateId, version);
    if (!template) {
      throw new Error(`Version ${version} not found for template ${templateId}`);
    }
    template.version.deprecated = true;
    template.version.deprecationInfo = {
      reason,
      alternative
    };
    template.version.updatedAt = /* @__PURE__ */ new Date();
  }
  /**
   * 获取变更日志
   */
  getChangelog(templateId) {
    const versions = this.getAllVersions(templateId);
    const changelog = [];
    versions.forEach((version) => {
      if (version.changelog) {
        changelog.push(...version.changelog);
      }
    });
    return changelog.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  /**
   * 清理旧版本
   */
  cleanupOldVersions(templateId, keepCount = 5) {
    const versions = this.getAllVersions(templateId);
    if (versions.length <= keepCount) return;
    const toRemove = versions.slice(keepCount);
    const versionMap = this.versions.get(templateId);
    toRemove.forEach((version) => {
      if (!version.version.published) {
        versionMap?.delete(version.version.version);
      }
    });
  }
}
const versionManager = new TemplateVersionManager();
function createVersionedTemplate(template, version, versionInfo) {
  return {
    ...template,
    version: {
      version,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      ...versionInfo
    }
  };
}
function createMigration(from, to, migrate, options) {
  return {
    from,
    to,
    migrate,
    ...options
  };
}

exports.TemplateVersionManager = TemplateVersionManager;
exports.createMigration = createMigration;
exports.createVersionedTemplate = createVersionedTemplate;
exports.versionManager = versionManager;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=version.cjs.map
