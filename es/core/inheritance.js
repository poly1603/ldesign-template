/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, h } from 'vue';
import '../utils/errorHandler.js';
import { deepMerge } from '../utils/helpers.js';
import '../utils/templateAnalytics.js';
import '../utils/typeGenerator.js';

class TemplateInheritanceManager {
  constructor() {
    this.templates = /* @__PURE__ */ new Map();
    this.inheritanceCache = /* @__PURE__ */ new WeakMap();
    this.mixinCache = /* @__PURE__ */ new Map();
    this.cacheKeyMap = /* @__PURE__ */ new Map();
    this.MAX_TEMPLATES = 500;
    this.MAX_MIXINS = 100;
    this.MAX_CACHE_KEYS = 1e3;
    this.cleanupTimer = null;
  }
  /**
   * 注册模板
   */
  registerTemplate(id, template) {
    this.templates.set(id, template);
    this.clearCache(id);
    if (this.templates.size > this.MAX_TEMPLATES) {
      const oldestKeys = Array.from(this.templates.keys()).slice(0, this.templates.size - this.MAX_TEMPLATES);
      oldestKeys.forEach((key) => {
        this.templates.delete(key);
        this.clearCache(key);
      });
    }
  }
  /**
   * 获取模板
   */
  getTemplate(id) {
    return this.templates.get(id);
  }
  /**
   * 扩展模板
   */
  extendTemplate(child, config) {
    const cacheKeyStr = this.getCacheKey(child, config);
    let cacheKeyObj = this.cacheKeyMap.get(cacheKeyStr);
    if (cacheKeyObj && this.inheritanceCache.has(cacheKeyObj)) {
      const cached = this.inheritanceCache.get(cacheKeyObj);
      if (cached) return cached;
    }
    if (!cacheKeyObj) {
      cacheKeyObj = {
        key: cacheKeyStr
      };
      this.cacheKeyMap.set(cacheKeyStr, cacheKeyObj);
      if (this.cacheKeyMap.size > this.MAX_CACHE_KEYS) {
        const oldestKeys = Array.from(this.cacheKeyMap.keys()).slice(0, this.cacheKeyMap.size - this.MAX_CACHE_KEYS);
        oldestKeys.forEach((key) => {
          const obj = this.cacheKeyMap.get(key);
          if (obj) this.inheritanceCache.delete(obj);
          this.cacheKeyMap.delete(key);
        });
      }
    }
    let result = {
      ...child
    };
    if (config.extends) {
      const parent = this.resolveTemplate(config.extends);
      if (parent) {
        result = this.mergeTemplates(parent, result, config.mergeStrategy, 1, config.maxDepth);
      }
    }
    if (config.mixins?.length) {
      for (const mixin of config.mixins) {
        const mixinTemplate = this.resolveTemplate(mixin);
        if (mixinTemplate) {
          result = this.mergeTemplates(mixinTemplate, result, config.mergeStrategy);
        }
      }
    }
    this.inheritanceCache.set(cacheKeyObj, result);
    return result;
  }
  /**
   * 创建混入
   */
  createMixin(id, mixin) {
    this.mixinCache.set(id, mixin);
    if (this.mixinCache.size > this.MAX_MIXINS) {
      const oldestKeys = Array.from(this.mixinCache.keys()).slice(0, this.mixinCache.size - this.MAX_MIXINS);
      oldestKeys.forEach((key) => this.mixinCache.delete(key));
    }
  }
  /**
   * 获取混入
   */
  getMixin(id) {
    return this.mixinCache.get(id);
  }
  /**
   * 合并模板
   */
  mergeTemplates(parent, child, strategy, depth = 1, maxDepth = 10) {
    if (depth > maxDepth) {
      console.warn(`Template inheritance depth exceeded (${maxDepth})`);
      return child;
    }
    const mergedTemplate = {
      ...child
    };
    if (parent.config || child.config) {
      mergedTemplate.config = this.mergeConfig(parent.config || {}, child.config || {}, strategy);
    }
    if (parent.component || child.component) {
      mergedTemplate.component = this.mergeComponents(parent.component, child.component, strategy?.components);
    }
    if (parent.styles || child.styles) {
      mergedTemplate.styles = this.mergeStyles(parent.styles, child.styles, strategy?.styles);
    }
    if (parent.data || child.data) {
      mergedTemplate.data = this.mergeData(parent.data, child.data, strategy?.data);
    }
    return mergedTemplate;
  }
  /**
   * 合并配置
   */
  mergeConfig(parentConfig, childConfig, strategy) {
    if (strategy?.props === "replace") {
      return childConfig;
    }
    if (typeof strategy?.props === "function") {
      return strategy.props(parentConfig, childConfig);
    }
    return deepMerge(parentConfig, childConfig);
  }
  /**
   * 合并组件
   */
  mergeComponents(parentComponent, childComponent, strategy) {
    if (!parentComponent) return childComponent;
    if (!childComponent) return parentComponent;
    if (strategy === "replace") {
      return childComponent;
    }
    if (typeof strategy === "function") {
      return strategy(parentComponent, childComponent);
    }
    return defineComponent({
      name: "MergedComponent",
      setup(props, ctx) {
        return () => h(childComponent, props, ctx.slots);
      }
    });
  }
  /**
   * 合并样式
   */
  mergeStyles(parentStyles, childStyles, strategy) {
    if (!parentStyles) return childStyles;
    if (!childStyles) return parentStyles;
    if (strategy === "replace") {
      return childStyles;
    }
    if (strategy === "append") {
      return `${parentStyles}
${childStyles}`;
    }
    if (typeof strategy === "function") {
      return strategy(parentStyles, childStyles);
    }
    if (typeof parentStyles === "object" && typeof childStyles === "object") {
      return {
        ...parentStyles,
        ...childStyles
      };
    }
    return childStyles;
  }
  /**
   * 合并数据
   */
  mergeData(parentData, childData, strategy) {
    if (!parentData) return childData;
    if (!childData) return parentData;
    if (strategy === "replace") {
      return childData;
    }
    if (strategy === "concat" && Array.isArray(parentData) && Array.isArray(childData)) {
      return [...parentData, ...childData];
    }
    if (typeof strategy === "function") {
      return strategy(parentData, childData);
    }
    return deepMerge(parentData, childData);
  }
  /**
   * 解析模板
   */
  resolveTemplate(templateOrId) {
    if (typeof templateOrId === "string") {
      const mixin = this.getMixin(templateOrId);
      if (mixin) {
        return mixin;
      }
      return this.templates.get(templateOrId);
    }
    return templateOrId;
  }
  /**
   * 获取缓存键
   */
  getCacheKey(template, config) {
    const parts = [template.id || "anonymous", config.extends ? typeof config.extends === "string" ? config.extends : config.extends.id : "", ...(config.mixins || []).map((m) => typeof m === "string" ? m : m.id)];
    return parts.filter(Boolean).join(":");
  }
  /**
   * 清除缓存
   */
  clearCache(templateId) {
    if (templateId) {
      const keysToDelete = [];
      for (const [key, obj] of this.cacheKeyMap) {
        if (key.includes(templateId)) {
          this.inheritanceCache.delete(obj);
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach((key) => this.cacheKeyMap.delete(key));
    } else {
      this.cacheKeyMap.clear();
    }
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  /**
   * 清理所有数据
   */
  dispose() {
    this.templates.clear();
    this.mixinCache.clear();
    this.cacheKeyMap.clear();
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}
class TemplateBlockManager {
  constructor() {
    this.blocks = /* @__PURE__ */ new Map();
  }
  /**
   * 定义块
   */
  defineBlock(templateId, block) {
    const blocks = this.blocks.get(templateId) || [];
    const index = blocks.findIndex((b) => (b.priority || 0) < (block.priority || 0));
    if (index === -1) {
      blocks.push(block);
    } else {
      blocks.splice(index, 0, block);
    }
    this.blocks.set(templateId, blocks);
  }
  /**
   * 获取块
   */
  getBlock(templateId, blockName) {
    const blocks = this.blocks.get(templateId);
    return blocks?.find((b) => b.name === blockName);
  }
  /**
   * 覆盖块
   */
  overrideBlock(templateId, blockName, content) {
    const block = this.getBlock(templateId, blockName);
    if (block && block.overridable !== false) {
      block.content = content;
      return true;
    }
    return false;
  }
  /**
   * 渲染块
   */
  renderBlock(templateId, blockName) {
    const block = this.getBlock(templateId, blockName);
    if (!block) return null;
    if (typeof block.content === "string") {
      return h("div", {
        innerHTML: block.content
      });
    }
    if (block.content && typeof block.content === "object" && "render" in block.content) {
      return h(block.content);
    }
    return block.content;
  }
  /**
   * 获取所有块
   */
  getBlocks(templateId) {
    return this.blocks.get(templateId) || [];
  }
  /**
   * 清除块
   */
  clearBlocks(templateId) {
    if (templateId) {
      this.blocks.delete(templateId);
    } else {
      this.blocks.clear();
    }
  }
}
const inheritanceManager = new TemplateInheritanceManager();
const blockManager = new TemplateBlockManager();
function createInheritableTemplate(template, config) {
  if (!config?.extends && !config?.mixins?.length) {
    return template;
  }
  return inheritanceManager.extendTemplate(template, config);
}
function createTemplateMixin(id, mixin) {
  inheritanceManager.createMixin(id, mixin);
}
function registerBaseTemplate(id, template) {
  inheritanceManager.registerTemplate(id, template);
}

export { TemplateBlockManager, TemplateInheritanceManager, blockManager, createInheritableTemplate, createTemplateMixin, inheritanceManager, registerBaseTemplate };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=inheritance.js.map
