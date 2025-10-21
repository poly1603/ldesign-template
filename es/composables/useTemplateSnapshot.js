/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, computed, watch, onUnmounted } from 'vue';

function useTemplateSnapshot(initialData, options = {}) {
  const {
    maxSnapshots = 50,
    autoSave = false,
    autoSaveInterval = 5e3,
    compressOldSnapshots = false,
    storageKey = "template-snapshots",
    enablePersistence = false
  } = options;
  const currentData = ref(initialData);
  const snapshots = ref([]);
  const currentSnapshotIndex = ref(-1);
  const isApplyingSnapshot = ref(false);
  const canUndo = computed(() => currentSnapshotIndex.value > 0);
  const canRedo = computed(() => currentSnapshotIndex.value < snapshots.value.length - 1);
  const currentSnapshot = computed(() => snapshots.value[currentSnapshotIndex.value] || null);
  const snapshotCount = computed(() => snapshots.value.length);
  const generateSnapshotId = () => {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data));
  };
  const compressSnapshot = (snapshot) => {
    if (!compressOldSnapshots) return snapshot;
    if (snapshots.value.length > maxSnapshots / 2) {
      const {
        metadata,
        ...compressed
      } = snapshot;
      return compressed;
    }
    return snapshot;
  };
  const persistSnapshots = () => {
    if (!enablePersistence) return;
    try {
      const data = {
        snapshots: snapshots.value,
        currentIndex: currentSnapshotIndex.value
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to persist snapshots:", error);
    }
  };
  const restoreSnapshots = () => {
    if (!enablePersistence) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        snapshots.value = data.snapshots || [];
        currentSnapshotIndex.value = data.currentIndex ?? -1;
        if (currentSnapshotIndex.value >= 0 && snapshots.value[currentSnapshotIndex.value]) {
          currentData.value = deepClone(snapshots.value[currentSnapshotIndex.value].data);
        }
      }
    } catch (error) {
      console.error("Failed to restore snapshots:", error);
    }
  };
  const takeSnapshot = (description, metadata, tags) => {
    if (isApplyingSnapshot.value) return;
    const snapshot = {
      id: generateSnapshotId(),
      timestamp: Date.now(),
      data: deepClone(currentData.value),
      description,
      metadata,
      tags
    };
    if (currentSnapshotIndex.value < snapshots.value.length - 1) {
      snapshots.value = snapshots.value.slice(0, currentSnapshotIndex.value + 1);
    }
    snapshots.value.push(compressSnapshot(snapshot));
    currentSnapshotIndex.value = snapshots.value.length - 1;
    if (snapshots.value.length > maxSnapshots) {
      const removeCount = snapshots.value.length - maxSnapshots;
      snapshots.value = snapshots.value.slice(removeCount);
      currentSnapshotIndex.value -= removeCount;
    }
    persistSnapshots();
    return snapshot;
  };
  const applySnapshot = (snapshot) => {
    isApplyingSnapshot.value = true;
    currentData.value = deepClone(snapshot.data);
    setTimeout(() => {
      isApplyingSnapshot.value = false;
    }, 0);
  };
  const undo = () => {
    if (!canUndo.value) return;
    currentSnapshotIndex.value--;
    const snapshot = snapshots.value[currentSnapshotIndex.value];
    if (snapshot) {
      applySnapshot(snapshot);
    }
  };
  const redo = () => {
    if (!canRedo.value) return;
    currentSnapshotIndex.value++;
    const snapshot = snapshots.value[currentSnapshotIndex.value];
    if (snapshot) {
      applySnapshot(snapshot);
    }
  };
  const goto = (snapshotId) => {
    const index = snapshots.value.findIndex((s) => s.id === snapshotId);
    if (index === -1) {
      console.warn(`Snapshot not found: ${snapshotId}`);
      return;
    }
    currentSnapshotIndex.value = index;
    applySnapshot(snapshots.value[index]);
  };
  const gotoIndex = (index) => {
    if (index < 0 || index >= snapshots.value.length) {
      console.warn(`Invalid snapshot index: ${index}`);
      return;
    }
    currentSnapshotIndex.value = index;
    applySnapshot(snapshots.value[index]);
  };
  const reset = () => {
    snapshots.value = [];
    currentSnapshotIndex.value = -1;
    currentData.value = deepClone(initialData) || initialData;
    persistSnapshots();
  };
  const clearSnapshots = () => {
    snapshots.value = [];
    currentSnapshotIndex.value = -1;
    persistSnapshots();
  };
  const deleteSnapshot = (snapshotId) => {
    const index = snapshots.value.findIndex((s) => s.id === snapshotId);
    if (index === -1) return;
    snapshots.value.splice(index, 1);
    if (currentSnapshotIndex.value > index) {
      currentSnapshotIndex.value--;
    } else if (currentSnapshotIndex.value === index) {
      if (currentSnapshotIndex.value > 0) {
        currentSnapshotIndex.value--;
        applySnapshot(snapshots.value[currentSnapshotIndex.value]);
      } else if (snapshots.value.length > 0) {
        applySnapshot(snapshots.value[0]);
      }
    }
    persistSnapshots();
  };
  const getSnapshots = () => {
    return snapshots.value.map((snapshot) => ({
      id: snapshot.id,
      timestamp: snapshot.timestamp,
      description: snapshot.description,
      tags: snapshot.tags,
      isCurrent: snapshot.id === currentSnapshot.value?.id
    }));
  };
  const searchSnapshots = (query) => {
    return snapshots.value.filter((snapshot) => {
      if (query.tags && query.tags.length > 0) {
        if (!snapshot.tags?.some((tag) => query.tags.includes(tag))) {
          return false;
        }
      }
      if (query.startTime && snapshot.timestamp < query.startTime) {
        return false;
      }
      if (query.endTime && snapshot.timestamp > query.endTime) {
        return false;
      }
      if (query.description && snapshot.description) {
        if (!snapshot.description.toLowerCase().includes(query.description.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  };
  const compareSnapshots = (snapshotId1, snapshotId2) => {
    const snapshot1 = snapshots.value.find((s) => s.id === snapshotId1);
    const snapshot2 = snapshots.value.find((s) => s.id === snapshotId2);
    if (!snapshot1 || !snapshot2) {
      console.warn("Snapshot not found for comparison");
      return null;
    }
    const getDiff = (obj1, obj2, path = "") => {
      const diffs = [];
      const keys = /* @__PURE__ */ new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
      keys.forEach((key) => {
        const newPath = path ? `${path}.${key}` : key;
        const val1 = obj1?.[key];
        const val2 = obj2?.[key];
        if (typeof val1 === "object" && typeof val2 === "object") {
          diffs.push(...getDiff(val1, val2, newPath));
        } else if (val1 !== val2) {
          diffs.push({
            path: newPath,
            oldValue: val1,
            newValue: val2
          });
        }
      });
      return diffs;
    };
    return {
      snapshot1: {
        id: snapshot1.id,
        timestamp: snapshot1.timestamp
      },
      snapshot2: {
        id: snapshot2.id,
        timestamp: snapshot2.timestamp
      },
      differences: getDiff(snapshot1.data, snapshot2.data)
    };
  };
  const exportSnapshots = (format = "json") => {
    if (format === "json") {
      return JSON.stringify({
        snapshots: snapshots.value,
        currentIndex: currentSnapshotIndex.value,
        exportedAt: (/* @__PURE__ */ new Date()).toISOString()
      }, null, 2);
    }
    const headers = ["ID", "Timestamp", "Description", "Tags"];
    const rows = snapshots.value.map((s) => [s.id, new Date(s.timestamp).toISOString(), s.description || "", (s.tags || []).join(";")]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };
  const importSnapshots = (data) => {
    try {
      const imported = JSON.parse(data);
      snapshots.value = imported.snapshots || [];
      currentSnapshotIndex.value = imported.currentIndex ?? -1;
      if (currentSnapshotIndex.value >= 0 && snapshots.value[currentSnapshotIndex.value]) {
        applySnapshot(snapshots.value[currentSnapshotIndex.value]);
      }
      persistSnapshots();
      return true;
    } catch (error) {
      console.error("Failed to import snapshots:", error);
      return false;
    }
  };
  if (enablePersistence) {
    restoreSnapshots();
  } else {
    takeSnapshot("Initial state", {
      isInitial: true
    });
  }
  let autoSaveTimer = null;
  if (autoSave) {
    autoSaveTimer = setInterval(() => {
      takeSnapshot("Auto save", {
        isAutoSave: true
      });
    }, autoSaveInterval);
  }
  const unwatch = watch(currentData, () => {
  }, {
    deep: true
  });
  const cleanup = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
    unwatch();
  };
  onUnmounted(cleanup);
  return {
    // 状态
    currentData,
    snapshots: computed(() => snapshots.value),
    currentSnapshot,
    currentSnapshotIndex: computed(() => currentSnapshotIndex.value),
    snapshotCount,
    // 时间旅行
    canUndo,
    canRedo,
    undo,
    redo,
    goto,
    gotoIndex,
    reset,
    // 快照管理
    takeSnapshot,
    clearSnapshots,
    deleteSnapshot,
    getSnapshots,
    searchSnapshots,
    compareSnapshots,
    // 导入导出
    exportSnapshots,
    importSnapshots,
    // 工具
    cleanup
  };
}
function useTimeTravel(initialData, options = {}) {
  const snapshot = useTemplateSnapshot(initialData, options);
  return {
    data: snapshot.currentData,
    canUndo: snapshot.canUndo,
    canRedo: snapshot.canRedo,
    undo: snapshot.undo,
    redo: snapshot.redo,
    goto: snapshot.goto,
    reset: snapshot.reset,
    takeSnapshot: snapshot.takeSnapshot
  };
}

export { useTemplateSnapshot, useTimeTravel };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateSnapshot.js.map
