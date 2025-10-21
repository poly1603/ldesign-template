/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class ObjectPool {
  constructor(options) {
    this.pool = [];
    this.totalCreated = 0;
    this.totalAcquired = 0;
    this.totalReleased = 0;
    this.maxSize = options.maxSize ?? 100;
    this.factory = options.factory;
    this.reset = options.reset;
    this.validate = options.validate;
    const preAllocate = Math.min(options.preAllocate ?? 0, this.maxSize);
    for (let i = 0; i < preAllocate; i++) {
      this.pool.push(this.factory());
      this.totalCreated++;
    }
  }
  /**
   * 获取对象
   */
  acquire() {
    this.totalAcquired++;
    while (this.pool.length > 0) {
      const obj = this.pool.pop();
      if (!this.validate || this.validate(obj)) {
        return obj;
      }
    }
    this.totalCreated++;
    return this.factory();
  }
  /**
   * 释放对象
   */
  release(obj) {
    if (!obj) return;
    this.totalReleased++;
    if (this.validate && !this.validate(obj)) {
      return;
    }
    if (this.pool.length >= this.maxSize) {
      return;
    }
    this.reset?.(obj);
    this.pool.push(obj);
  }
  /**
   * 批量释放对象
   */
  releaseMany(objects) {
    for (const obj of objects) {
      this.release(obj);
    }
  }
  /**
   * 清空池
   */
  clear() {
    this.pool.length = 0;
  }
  /**
   * 获取统计信息
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      maxSize: this.maxSize,
      totalCreated: this.totalCreated,
      totalAcquired: this.totalAcquired,
      totalReleased: this.totalReleased,
      reuseRate: this.totalAcquired > 0 ? `${((this.totalAcquired - this.totalCreated) / this.totalAcquired * 100).toFixed(2)}%` : "0%"
    };
  }
  /**
   * 缩减池大小
   */
  shrink(targetSize = Math.floor(this.maxSize / 2)) {
    while (this.pool.length > targetSize) {
      this.pool.pop();
    }
  }
}
function createArrayPool(maxSize = 50) {
  return new ObjectPool({
    maxSize,
    factory: () => [],
    reset: (arr) => {
      arr.length = 0;
    },
    validate: (arr) => Array.isArray(arr)
  });
}
function createObjectPool(factory, maxSize = 50) {
  return new ObjectPool({
    maxSize,
    factory,
    reset: (obj) => {
      for (const key in obj) {
        delete obj[key];
      }
    }
  });
}
function createMapPool(maxSize = 50) {
  return new ObjectPool({
    maxSize,
    factory: () => /* @__PURE__ */ new Map(),
    reset: (map) => map.clear(),
    validate: (map) => map instanceof Map
  });
}
function createSetPool(maxSize = 50) {
  return new ObjectPool({
    maxSize,
    factory: () => /* @__PURE__ */ new Set(),
    reset: (set) => set.clear(),
    validate: (set) => set instanceof Set
  });
}
class PoolManager {
  constructor() {
    this.pools = /* @__PURE__ */ new Map();
  }
  register(name, pool) {
    this.pools.set(name, pool);
  }
  get(name) {
    return this.pools.get(name);
  }
  clearAll() {
    for (const pool of this.pools.values()) {
      pool.clear();
    }
  }
  getStats() {
    const stats = {};
    for (const [name, pool] of this.pools.entries()) {
      stats[name] = pool.getStats();
    }
    return stats;
  }
}
const poolManager = new PoolManager();

export { ObjectPool, createArrayPool, createMapPool, createObjectPool, createSetPool, poolManager };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=objectPool.js.map
