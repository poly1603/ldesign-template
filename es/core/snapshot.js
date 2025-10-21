/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class SnapshotManager {
  constructor(config = {}) {
    this.snapshots = /* @__PURE__ */ new Map();
    this.history = [];
    this.currentIndex = -1;
    this.autoSnapshotTimer = null;
    this.config = {
      maxSnapshots: 50,
      autoSnapshotInterval: 0,
      compress: false,
      persist: true,
      storageKey: "template-snapshots",
      ...config
    };
    if (this.config.persist) {
      this.loadFromStorage();
    }
    if (this.config.autoSnapshotInterval && this.config.autoSnapshotInterval > 0) {
      this.startAutoSnapshot();
    }
  }
  /**
   * 创建快照
   */
  createSnapshot(state, options = {}) {
    if (this.config.beforeSnapshot) {
      const processed = this.config.beforeSnapshot(state);
      if (processed === false) return null;
      if (processed) state = processed;
    }
    const snapshot = {
      id: this.generateId(),
      timestamp: /* @__PURE__ */ new Date(),
      state: this.cloneState(state),
      ...options
    };
    this.snapshots.set(snapshot.id, snapshot);
    this.history.push(snapshot.id);
    this.currentIndex = this.history.length - 1;
    if (this.config.maxSnapshots && this.history.length > this.config.maxSnapshots) {
      const removed = this.history.shift();
      if (removed) {
        this.snapshots.delete(removed);
        this.currentIndex--;
      }
    }
    if (this.config.persist) {
      this.saveToStorage();
    }
    if (this.config.afterSnapshot) {
      this.config.afterSnapshot(snapshot);
    }
    return snapshot;
  }
  /**
   * 恢复快照
   */
  restoreSnapshot(snapshotId) {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) return null;
    if (this.config.beforeRestore) {
      const shouldRestore = this.config.beforeRestore(snapshot);
      if (!shouldRestore) return null;
    }
    const index = this.history.indexOf(snapshotId);
    if (index !== -1) {
      this.currentIndex = index;
    }
    if (this.config.afterRestore) {
      this.config.afterRestore(snapshot);
    }
    return this.cloneState(snapshot.state);
  }
  /**
   * 获取快照
   */
  getSnapshot(snapshotId) {
    return this.snapshots.get(snapshotId);
  }
  /**
   * 获取所有快照
   */
  getAllSnapshots() {
    return this.history.map((id) => this.snapshots.get(id)).filter(Boolean);
  }
  /**
   * 删除快照
   */
  deleteSnapshot(snapshotId) {
    const deleted = this.snapshots.delete(snapshotId);
    if (deleted) {
      const index = this.history.indexOf(snapshotId);
      if (index !== -1) {
        this.history.splice(index, 1);
        if (this.currentIndex >= index) {
          this.currentIndex--;
        }
      }
      if (this.config.persist) {
        this.saveToStorage();
      }
    }
    return deleted;
  }
  /**
   * 清空快照
   */
  clearSnapshots() {
    this.snapshots.clear();
    this.history = [];
    this.currentIndex = -1;
    if (this.config.persist) {
      this.clearStorage();
    }
  }
  /**
   * 撤销
   */
  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const snapshotId = this.history[this.currentIndex];
      return this.restoreSnapshot(snapshotId);
    }
    return null;
  }
  /**
   * 重做
   */
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const snapshotId = this.history[this.currentIndex];
      return this.restoreSnapshot(snapshotId);
    }
    return null;
  }
  /**
   * 是否可以撤销
   */
  canUndo() {
    return this.currentIndex > 0;
  }
  /**
   * 是否可以重做
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
  /**
   * 开始自动快照
   */
  startAutoSnapshot() {
    if (this.autoSnapshotTimer) {
      this.stopAutoSnapshot();
    }
    this.autoSnapshotTimer = setInterval(() => {
    }, this.config.autoSnapshotInterval);
  }
  /**
   * 停止自动快照
   */
  stopAutoSnapshot() {
    if (this.autoSnapshotTimer) {
      clearInterval(this.autoSnapshotTimer);
      this.autoSnapshotTimer = null;
    }
  }
  /**
   * 生成ID
   */
  generateId() {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * 克隆状态
   */
  cloneState(state) {
    if (this.config.compress) {
      return JSON.parse(JSON.stringify(state));
    }
    return JSON.parse(JSON.stringify(state));
  }
  /**
   * 保存到存储
   */
  saveToStorage() {
    if (!this.config.persist || !this.config.storageKey) return;
    try {
      const data = {
        snapshots: Array.from(this.snapshots.entries()),
        history: this.history,
        currentIndex: this.currentIndex
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save snapshots:", error);
    }
  }
  /**
   * 从存储加载
   */
  loadFromStorage() {
    if (!this.config.persist || !this.config.storageKey) return;
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.snapshots = new Map(data.snapshots);
        this.history = data.history || [];
        this.currentIndex = data.currentIndex ?? -1;
      }
    } catch (error) {
      console.error("Failed to load snapshots:", error);
    }
  }
  /**
   * 清空存储
   */
  clearStorage() {
    if (!this.config.persist || !this.config.storageKey) return;
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.stopAutoSnapshot();
    this.clearSnapshots();
  }
}
class TimeTravelController {
  constructor(config = {}) {
    this.history = [];
    this.currentIndex = -1;
    this.observers = [];
    this.config = {
      enabled: true,
      maxHistory: 100,
      recordDOM: false,
      ignoreProperties: [],
      diffAlgorithm: "deep",
      ...config
    };
  }
  /**
   * 记录状态
   */
  record(state) {
    if (!this.config.enabled) return;
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    this.history.push(this.cloneState(state));
    this.currentIndex++;
    if (this.config.maxHistory && this.history.length > this.config.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }
  /**
   * 后退
   */
  backward() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.cloneState(this.history[this.currentIndex]);
    }
    return null;
  }
  /**
   * 前进
   */
  forward() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.cloneState(this.history[this.currentIndex]);
    }
    return null;
  }
  /**
   * 跳转到指定位置
   */
  goto(index) {
    if (index >= 0 && index < this.history.length) {
      this.currentIndex = index;
      return this.cloneState(this.history[this.currentIndex]);
    }
    return null;
  }
  /**
   * 获取历史记录
   */
  getHistory() {
    return this.history.map((state) => this.cloneState(state));
  }
  /**
   * 获取当前索引
   */
  getCurrentIndex() {
    return this.currentIndex;
  }
  /**
   * 是否可以后退
   */
  canBackward() {
    return this.currentIndex > 0;
  }
  /**
   * 是否可以前进
   */
  canForward() {
    return this.currentIndex < this.history.length - 1;
  }
  /**
   * 清空历史
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
  /**
   * 开始观察DOM变化
   */
  observeDOM(element, callback) {
    if (!this.config.recordDOM) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (callback) {
          callback(mutation);
        }
        this.recordDOMSnapshot(element);
      });
    });
    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
    this.observers.push(observer);
  }
  /**
   * 停止观察
   */
  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
  /**
   * 记录DOM快照
   */
  recordDOMSnapshot(_element) {
  }
  /**
   * 克隆状态
   */
  cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }
  /**
   * 计算差异
   */
  diff(prev, next) {
    if (this.config.customDiff) {
      return this.config.customDiff(prev, next);
    }
    switch (this.config.diffAlgorithm) {
      case "shallow":
        return this.shallowDiff(prev, next);
      case "deep":
      default:
        return this.deepDiff(prev, next);
    }
  }
  /**
   * 浅比较
   */
  shallowDiff(prev, next) {
    const diff = {};
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    for (let i = 0; i < prevKeys.length; i++) {
      const key = prevKeys[i];
      if (!(key in next)) {
        diff[key] = {
          type: "deleted",
          value: prev[key]
        };
      }
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (!(key in prev)) {
        diff[key] = {
          type: "added",
          value: next[key]
        };
      } else if (prev[key] !== next[key]) {
        diff[key] = {
          type: "modified",
          prev: prev[key],
          next: next[key]
        };
      }
    }
    return diff;
  }
  /**
   * 深比较
   */
  deepDiff(prev, next, path = "") {
    const diff = {};
    if (this.isPrimitive(prev) || this.isPrimitive(next)) {
      if (prev !== next) {
        return {
          type: "modified",
          prev,
          next
        };
      }
      return null;
    }
    const allKeys = /* @__PURE__ */ new Set([...Object.keys(prev || {}), ...Object.keys(next || {})]);
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (this.config.ignoreProperties?.includes(currentPath)) {
        continue;
      }
      if (!(key in next)) {
        diff[key] = {
          type: "deleted",
          value: prev[key]
        };
      } else if (!(key in prev)) {
        diff[key] = {
          type: "added",
          value: next[key]
        };
      } else {
        const childDiff = this.deepDiff(prev[key], next[key], currentPath);
        if (childDiff) {
          diff[key] = childDiff;
        }
      }
    }
    return Object.keys(diff).length > 0 ? diff : null;
  }
  /**
   * 判断是否为原始类型
   */
  isPrimitive(value) {
    return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
  }
  /**
   * 销毁
   */
  destroy() {
    this.disconnect();
    this.clear();
  }
}
const snapshotManager = new SnapshotManager();
const timeTravelController = new TimeTravelController();

export { SnapshotManager, TimeTravelController, snapshotManager, timeTravelController };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=snapshot.js.map
