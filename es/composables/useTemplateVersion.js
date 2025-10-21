/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, computed, reactive, watch } from 'vue';
import { createVersionedTemplate, versionManager, createMigration } from '../core/version.js';

function useTemplateVersion(template, options = {}) {
  const {
    initialVersion = "1.0.0",
    autoRegister = true,
    autoMigrate = false,
    enableBackup = true,
    keepVersions = 10,
    versionInfo = {}
  } = options;
  const templateRef = ref(template);
  const currentTemplate = computed(() => "value" in templateRef.value ? templateRef.value.value : templateRef.value);
  const versionState = reactive({
    current: initialVersion,
    available: [],
    hasUpdate: false,
    isDeprecated: false
  });
  const versionedTemplate = ref(null);
  const changelog = ref([]);
  const migrationQueue = ref([]);
  const isMigrating = ref(false);
  const initialize = () => {
    const templateId = currentTemplate.value.id;
    if (!templateId) {
      console.warn("Template must have an id for version control");
      return;
    }
    const versioned = createVersionedTemplate(currentTemplate.value, initialVersion, versionInfo);
    if (autoRegister) {
      versionManager.registerVersion(templateId, initialVersion, currentTemplate.value, versionInfo);
    }
    versionedTemplate.value = versioned;
    updateVersionState();
  };
  function updateVersionState() {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    const allVersions = versionManager.getAllVersions(templateId);
    versionState.available = allVersions.map((v) => v.version.version);
    const current = versionManager.getVersion(templateId);
    if (current) {
      versionState.current = current.version.version;
      versionState.isDeprecated = current.version.deprecated || false;
      const latest = allVersions[0];
      if (latest) {
        const comparison = versionManager.compareVersions(latest.version.version, versionState.current);
        versionState.hasUpdate = comparison.newer;
      }
    }
    changelog.value = versionManager.getChangelog(templateId);
  }
  const createVersion = (version, changes, info) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return void 0;
    const newVersion = versionManager.createVersion(templateId, version, changes, info);
    versionedTemplate.value = newVersion;
    updateVersionState();
    if (keepVersions > 0) {
      versionManager.cleanupOldVersions(templateId, keepVersions);
    }
    return newVersion;
  };
  const switchVersion = async (version) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return false;
    const targetVersion = versionManager.getVersion(templateId, version);
    if (!targetVersion) {
      console.error(`Version ${version} not found`);
      return false;
    }
    if (autoMigrate && versionState.current !== version) {
      const migrated = await migrate(versionState.current, version);
      if (migrated) {
        versionedTemplate.value = migrated;
        updateVersionState();
        return true;
      }
      return false;
    }
    versionedTemplate.value = targetVersion;
    versionState.current = version;
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
      const result = await versionManager.migrate(templateId, from, to, options2);
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
    versionManager.registerMigration(templateId, migration);
    migrationQueue.value.push(migration);
  };
  const addMigration = (from, to, migrateFn, rollbackFn) => {
    const migration = createMigration(from, to, migrateFn, {
      rollback: rollbackFn,
      auto: autoMigrate
    });
    registerMigration(migration);
  };
  const publish = (version) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    const targetVersion = version || versionState.current;
    versionManager.publishVersion(templateId, targetVersion);
    updateVersionState();
  };
  const deprecate = (version, reason, alternative) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return;
    versionManager.deprecateVersion(templateId, version, reason, alternative);
    updateVersionState();
  };
  const compareVersions = (v1, v2) => {
    return versionManager.compareVersions(v1, v2);
  };
  const restoreBackup = (index) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return void 0;
    const restored = versionManager.restoreBackup(templateId, index);
    if (restored) {
      versionedTemplate.value = restored;
      updateVersionState();
    }
    return restored;
  };
  const getVersionDetails = (version) => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return void 0;
    return versionManager.getVersion(templateId, version);
  };
  const getVersionHistory = () => {
    const templateId = currentTemplate.value.id;
    if (!templateId) return [];
    return versionManager.getAllVersions(templateId);
  };
  watch(currentTemplate, () => {
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
  const comparison = computed(() => {
    return versionManager.compareVersions(v1.value, v2.value);
  });
  const isNewer = computed(() => comparison.value.newer);
  const isOlder = computed(() => comparison.value.older);
  const isEqual = computed(() => comparison.value.equal);
  const majorDiff = computed(() => comparison.value.majorDiff);
  const minorDiff = computed(() => comparison.value.minorDiff);
  const patchDiff = computed(() => comparison.value.patchDiff);
  const needsMajorUpdate = computed(() => majorDiff.value > 0);
  const needsMinorUpdate = computed(() => minorDiff.value > 0);
  const needsPatchUpdate = computed(() => patchDiff.value > 0);
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
  const isRunning = ref(false);
  const progress = ref(0);
  const error = ref(null);
  const result = ref(null);
  const run = async () => {
    isRunning.value = true;
    error.value = null;
    progress.value = 0;
    try {
      const current = versionManager.getVersion(templateId);
      if (!current) {
        throw new Error(`Template ${templateId} not found`);
      }
      const migrated = await versionManager.migrate(templateId, current.version.version, targetVersion, {
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

export { useAutoMigration, useTemplateVersion, useVersionComparison };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateVersion.js.map
