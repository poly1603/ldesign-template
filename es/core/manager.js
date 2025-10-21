/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createSetPool } from '../utils/objectPool.js';
import { getLoader } from './loader.js';
import { getScanner } from './scanner.js';

class TemplateManager {
  /**
   * 构造函数
   */
  constructor(options = {}) {
    this.initialized = false;
    this.scanResult = null;
    this.filterCache = /* @__PURE__ */ new WeakMap();
    this.setPool = createSetPool(20);
    this.options = options;
  }
  /**
   * 初始化（扫描所有模板）
   */
  async initialize() {
    if (this.initialized && this.scanResult) {
      return this.scanResult;
    }
    const scanner = getScanner();
    this.scanResult = await scanner.scan();
    this.initialized = true;
    return this.scanResult;
  }
  /**
   * 确保已初始化
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }
  /**
   * 加载模板组件
   */
  async loadTemplate(category, device, name, options) {
    await this.ensureInitialized();
    const loader = getLoader();
    return loader.load(category, device, name, options);
  }
  /**
   * 获取所有模板元数据
   */
  async getAllTemplates() {
    await this.ensureInitialized();
    const scanner = getScanner();
    return scanner.getAllMetadata();
  }
  /**
   * 根据过滤条件查询模板
   */
  async queryTemplates(filter) {
    await this.ensureInitialized();
    const allTemplates = await this.getAllTemplates();
    return this.filterTemplates(allTemplates, filter);
  }
  /**
   * 获取指定分类的所有模板
   */
  async getTemplatesByCategory(category) {
    return this.queryTemplates({
      category
    });
  }
  /**
   * 获取指定设备的所有模板
   */
  async getTemplatesByDevice(device) {
    return this.queryTemplates({
      device
    });
  }
  /**
   * 获取默认模板
   */
  async getDefaultTemplate(category, device) {
    const templates = await this.queryTemplates({
      category,
      device,
      defaultOnly: true
    });
    return templates[0] || null;
  }
  /**
   * 获取扫描结果
   */
  getScanResult() {
    return this.scanResult;
  }
  /**
   * 预加载模板
   */
  async preloadTemplate(category, device, name) {
    await this.ensureInitialized();
    const loader = getLoader();
    return loader.preload(category, device, name);
  }
  /**
   * 根据过滤条件预加载模板
   */
  async preloadByFilter(filter) {
    await this.ensureInitialized();
    const loader = getLoader();
    return loader.preloadByFilter(filter);
  }
  /**
   * 清除缓存
   */
  clearCache(category, device, name) {
    const loader = getLoader();
    loader.clearCache(category, device, name);
  }
  /**
   * 扫描模板（别名方法）
   */
  async scanTemplates() {
    await this.initialize();
    const scanner = getScanner();
    return scanner.getRegistry();
  }
  /**
   * 重新扫描模板
   */
  async rescan() {
    this.initialized = false;
    return this.initialize();
  }
  /**
   * 过滤模板 - 优化性能版本
   */
  filterTemplates(templates, filter) {
    const cacheKey = {
      ...filter
    };
    const cached = this.filterCache.get(cacheKey);
    if (cached) return cached;
    const categorySet = this.createFilterSet(filter.category);
    const deviceSet = this.createFilterSet(filter.device);
    const nameSet = this.createFilterSet(filter.name);
    const tagsArray = filter.tags ? Array.isArray(filter.tags) ? filter.tags : [filter.tags] : null;
    const result = templates.filter((t) => {
      if (categorySet && !categorySet.has(t.category)) return false;
      if (deviceSet && !deviceSet.has(t.device)) return false;
      if (nameSet && !nameSet.has(t.name)) return false;
      if (tagsArray && (!t.tags || !tagsArray.some((tag) => t.tags.includes(tag)))) return false;
      if (filter.defaultOnly && !t.isDefault) return false;
      return true;
    });
    if (categorySet) this.setPool.release(categorySet);
    if (deviceSet) this.setPool.release(deviceSet);
    if (nameSet) this.setPool.release(nameSet);
    this.filterCache.set(cacheKey, result);
    return result;
  }
  /**
   * 创建过滤用的 Set
   */
  createFilterSet(value) {
    if (!value) return null;
    const set = this.setPool.acquire();
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      set.add(v);
    }
    return set;
  }
}
let globalManager = null;
function getManager() {
  if (!globalManager) {
    globalManager = new TemplateManager();
  }
  return globalManager;
}
function createTemplateManager() {
  return new TemplateManager();
}

export { TemplateManager, createTemplateManager, getManager };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=manager.js.map
