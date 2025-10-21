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

var vue = require('vue');
var version = require('../core/version.cjs');

function useTemplateVersion(template, options = {}) {
  const {
    initialVersion = "1.0.0",
    autoRegister = true,
    autoMigrate = false,
    enableBackup = true,
    keepVersions = 10,
    versionInfo = {}
  } = options;
  const templateRef = vue.ref(template);
  const currentTemplate = vue.computed(() => "value" in templateRef.value ? templateRef.value.value : templateRef.value);
  const versionState = vue.reactive({
    current: initialVersion,
    available: [],
    hasUpdate: false,
    isDeprecated: false
  });
  const versionedTemplate = vue.ref(null);
  const changelog = vue.ref([]);
  const migrationQueue = vue.ref([]);
  const isMigrating = vue.ref(false);
  const initialize = () => {
    const templateId = currentTemplate.value.id;
    if (!templateId) {
      console.warn("Template must have an id for version control");
      return;
    }
    const versioned = version.createVersionedTemplate(currentTemplate.value, initialVersion, versionInfo);
    if (autoRegister) {
      version.versionManager.registerVersion(templateId, initialVersion, currentTemplate.value, versionInfo);
    }
    versionedTemplate.value = versioned;
    updateVersionState();
  };
  function updateVersionState() {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    const allVersions = version.versionManager.getAllVersions(templateId);
    versionState.available = allVersions.map((v) => v.version.version);
    const current = version.versionManager.getVersion(templateId);
    if (current) {
      versionState.current = current.version.version;
      versionState.isDeprecated = current.version.deprecated || false;
      const latest = allVersions[0];
      if (latest) {
        const comparison = version.versionManager.compareVersions(latest.version.version, versionState.current);
        versionState.hasUpdate = comparison.newer;
      }
    }
    changelog.value = version.versionManager.getChangelog(templateId);
  }
  const createVersion = (version$1, changes, info) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return void 0;
    const newVersion = version.versionManager.createVersion(templateId, version$1, changes, info);
    versionedTemplate.value = newVersion;
    updateVersionState();
    if (keepVersions > 0) {
      version.versionManager.cleanupOldVersions(templateId, keepVersions);
    }
    return newVersion;
  };
  const switchVersion = async (version$1) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return false;
    const targetVersion = version.versionManager.getVersion(templateId, version$1);
    if (!targetVersion) {
      console.error(`Version ${version$1} not found`);
      return false;
    }
    if (autoMigrate && versionState.current !== version$1) {
      const migrated = await migrate(versionState.current, version$1);
      if (migrated) {
        versionedTemplate.value = migrated;
        updateVersionState();
        return true;
      }
      return false;
    }
    versionedTemplate.value = targetVersion;
    versionState.current = version$1;
    updateVersionState();
    return true;
  };
  async function migrate(from, to, migrationOptions) {
    const templateId = currentTemplate.value.id;
    if (!templateId) return null;
    isMigrating.value = true;
    try {
      const options2 = {
        backup: enableBackup,
        validate: true,
        ...migrationOptions
      };
      const result = await version.versionManager.migrate(templateId, from, to, options2);
      versionedTemplate.value = result;
      updateVersionState();
      return result;
    } catch (error) {
      console.error("Migration failed:", error);
      return null;
    } finally {
      isMigrating.value = false;
    }
  }
  const registerMigration = (migration) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    version.versionManager.registerMigration(templateId, migration);
    migrationQueue.value.push(migration);
  };
  const addMigration = (from, to, migrateFn, rollbackFn) => {
    const migration = version.createMigration(from, to, migrateFn, {
      rollback: rollbackFn,
      auto: autoMigrate
    });
    registerMigration(migration);
  };
  const publish = (version$1) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    const targetVersion = version$1 || versionState.current;
    version.versionManager.publishVersion(templateId, targetVersion);
    updateVersionState();
  };
  const deprecate = (version$1, reason, alternative) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    version.versionManager.deprecateVersion(templateId, version$1, reason, alternative);
    updateVersionState();
  };
  const compareVersions = (v1, v2) => {
    return version.versionManager.compareVersions(v1, v2);
  };
  const restoreBackup = (index) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return void 0;
    const restored = version.versionManager.restoreBackup(templateId, index);
    if (restored) {
      versionedTemplate.value = restored;
      updateVersionState();
    }
    return restored;
  };
  const getVersionDetails = (version$1) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return void 0;
    return version.versionManager.getVersion(templateId, version$1);
  };
  const getVersionHistory = () => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return [];
    return version.versionManager.getAllVersions(templateId);
  };
  vue.watch(currentTemplate, () => {
    initialize();
  }, {
    immediate: true
  });
  return {
    // 状态
    versionState,
    versionedTemplate,
    changelog,
    migrationQueue,
    isMigrating,
    // 方法
    createVersion,
    switchVersion,
    migrate,
    registerMigration,
    addMigration,
    publish,
    deprecate,
    compareVersions,
    restoreBackup,
    getVersionDetails,
    getVersionHistory,
    updateVersionState
  };
}
function useVersionComparison(v1, v2) {
  const comparison = vue.computed(() => {
    return version.versionManager.compareVersions(v1.value, v2.value);
  });
  const isNewer = vue.computed(() => comparison.value.newer);
  const isOlder = vue.computed(() => comparison.value.older);
  const isEqual = vue.computed(() => comparison.value.equal);
  const majorDiff = vue.computed(() => comparison.value.majorDiff);
  const minorDiff = vue.computed(() => comparison.value.minorDiff);
  const patchDiff = vue.computed(() => comparison.value.patchDiff);
  const needsMajorUpdate = vue.computed(() => majorDiff.value > 0);
  const needsMinorUpdate = vue.computed(() => minorDiff.value > 0);
  const needsPatchUpdate = vue.computed(() => patchDiff.value > 0);
  return {
    comparison,
    isNewer,
    isOlder,
    isEqual,
    majorDiff,
    minorDiff,
    patchDiff,
    needsMajorUpdate,
    needsMinorUpdate,
    needsPatchUpdate
  };
}
function useAutoMigration(templateId, targetVersion, options) {
  const isRunning = vue.ref(false);
  const progress = vue.ref(0);
  const error = vue.ref(null);
  const result = vue.ref(null);
  const run = async () => {
    isRunning.value = true;
    error.value = null;
    progress.value = 0;
    try {
      const current = version.versionManager.getVersion(templateId);
      if (!current) {
        throw new Error(`Template ${templateId} not found`);
      }
      const migrated = await version.versionManager.migrate(templateId, current.version.version, targetVersion, {
        ...options,
        data: {
          ...options?.data,
          onProgress: (p) => {
            progress.value = p;
          }
        }
      });
      result.value = migrated;
      progress.value = 100;
      return migrated;
    } catch (err) {
      error.value = err;
      return null;
    } finally {
      isRunning.value = false;
    }
  };
  return {
    run,
    isRunning,
    progress,
    error,
    result
  };
}

exports.useAutoMigration = useAutoMigration;
exports.useTemplateVersion = useTemplateVersion;
exports.useVersionComparison = useVersionComparison;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateVersion.cjs.map
