/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getScanner } from './scanner.js';
import { loadComponentStyle } from './style-loader.js';

class TemplateLoader {
  constructor() {
    this.loadedComponents = /* @__PURE__ */ new Map();
    this.loadingPromises = /* @__PURE__ */ new Map();
    this.componentRegistry = new FinalizationRegistry((key) => {
      this.loadedComponents.delete(key);
    });
  }
  /**
   * 加载模板组件
   */
  async load(category, device, name, options) {
    const key = TemplateLoader.createKey(category, device, name);
    const weakRef = this.loadedComponents.get(key);
    if (weakRef) {
      const cached = weakRef.deref();
      if (cached) {
        options?.onLoad?.(cached);
        return cached;
      }
      this.loadedComponents.delete(key);
    }
    const pending = this.loadingPromises.get(key);
    if (pending) return pending;
    const scanner = getScanner();
    const template = scanner.getTemplate(category, device, name);
    if (!template) {
      const error = new Error(`\u6A21\u677F\u672A\u627E\u5230: ${key}`);
      options?.onError?.(error);
      throw error;
    }
    loadComponentStyle(category, device, name, template.componentPath);
    const loadPromise = this._loadWithOptions(template.loader, key, options);
    this.loadingPromises.set(key, loadPromise);
    try {
      const component = await loadPromise;
      const weakRef2 = new WeakRef(component);
      this.loadedComponents.set(key, weakRef2);
      this.componentRegistry.register(component, key);
      this.loadingPromises.delete(key);
      options?.onLoad?.(component);
      return component;
    } catch (error) {
      this.loadingPromises.delete(key);
      options?.onError?.(error);
      throw error;
    }
  }
  /**
   * 带选项的加载
   */
  async _loadWithOptions(loader, key, options) {
    if (options?.timeout) {
      return Promise.race([loader(), new Promise((_, reject) => setTimeout(() => reject(new Error(`\u52A0\u8F7D\u8D85\u65F6: ${key}`)), options.timeout))]);
    }
    return loader();
  }
  /**
   * 预加载模板
   */
  async preload(category, device, name) {
    try {
      await this.load(category, device, name, {
        preload: true
      });
    } catch (error) {
      console.warn(`[TemplateLoader] \u9884\u52A0\u8F7D\u5931\u8D25: ${category}/${device}/${name}`, error);
    }
  }
  /**
   * 批量预加载模板
   */
  async preloadBatch(templates) {
    await Promise.allSettled(templates.map((t) => this.preload(t.category, t.device, t.name)));
  }
  /**
   * 根据过滤条件预加载模板
   */
  async preloadByFilter(filter) {
    const scanner = getScanner();
    const allMetadata = scanner.getAllMetadata();
    const filtered = this.filterTemplates(allMetadata, filter);
    await this.preloadBatch(filtered);
  }
  /**
   * 过滤模板 - 内存优化版本
   */
  filterTemplates(templates, filter) {
    const categorySet = filter.category ? new Set(Array.isArray(filter.category) ? filter.category : [filter.category]) : null;
    const deviceSet = filter.device ? new Set(Array.isArray(filter.device) ? filter.device : [filter.device]) : null;
    const nameSet = filter.name ? new Set(Array.isArray(filter.name) ? filter.name : [filter.name]) : null;
    const tagsArray = filter.tags ? Array.isArray(filter.tags) ? filter.tags : [filter.tags] : null;
    return templates.filter((t) => {
      if (categorySet && !categorySet.has(t.category)) return false;
      if (deviceSet && !deviceSet.has(t.device)) return false;
      if (nameSet && !nameSet.has(t.name)) return false;
      if (tagsArray && (!t.tags || !tagsArray.some((tag) => t.tags.includes(tag)))) return false;
      if (filter.defaultOnly && !t.isDefault) return false;
      return true;
    });
  }
  /**
   * 清除缓存 - 优化版本
   */
  clearCache(category, device, name) {
    if (category && device && name) {
      const key = TemplateLoader.createKey(category, device, name);
      this.loadedComponents.delete(key);
      this.loadingPromises.delete(key);
    } else {
      this.loadedComponents.clear();
      this.loadingPromises.clear();
    }
  }
  /**
   * 获取已加载的组件数量
   */
  getLoadedCount() {
    return this.loadedComponents.size;
  }
  /**
   * 获取正在加载的组件数量
   */
  getLoadingCount() {
    return this.loadingPromises.size;
  }
}
TemplateLoader.createKey = (category, device, name) => `${category}/${device}/${name}`;
let globalLoader = null;
function getLoader() {
  if (!globalLoader) {
    globalLoader = new TemplateLoader();
  }
  return globalLoader;
}
async function loadTemplate(category, device, name, options) {
  const loader = getLoader();
  return loader.load(category, device, name, options);
}
async function preloadTemplate(category, device, name) {
  const loader = getLoader();
  return loader.preload(category, device, name);
}

export { TemplateLoader, getLoader, loadTemplate, preloadTemplate };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=loader.js.map
