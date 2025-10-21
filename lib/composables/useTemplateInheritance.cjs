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
var inheritance = require('../core/inheritance.cjs');

const InheritanceContextKey = Symbol("TemplateInheritance");
function useTemplateInheritance(template, options = {}) {
  const isInherited = vue.ref(false);
  const inheritanceChain = vue.ref([]);
  const activeBlocks = vue.reactive(/* @__PURE__ */ new Map());
  const parentContext = vue.inject(InheritanceContextKey, null);
  const context = vue.reactive({
    parent: options.extends,
    mixins: options.mixins || [],
    mergeStrategy: options.mergeStrategy || {},
    blocks: activeBlocks,
    depth: (parentContext?.depth || 0) + 1
  });
  vue.provide(InheritanceContextKey, context);
  const processedTemplate = vue.computed(() => {
    if (!options.extends && !options.mixins?.length) {
      return template;
    }
    return inheritance.createInheritableTemplate(template, options);
  });
  if (options.autoRegister && template.id) {
    inheritance.inheritanceManager.registerTemplate(template.id, template);
  }
  if (options.enableBlocks && template.id) {
    if (options.blockOverrides) {
      Object.entries(options.blockOverrides).forEach(([name, content]) => {
        inheritance.blockManager.overrideBlock(template.id, name, content);
      });
    }
  }
  if (options.trackChain) {
    const chain = [];
    if (template.id) {
      chain.push(template.id);
    }
    if (options.extends) {
      const parentId = typeof options.extends === "string" ? options.extends : options.extends.id;
      if (parentId) {
        chain.unshift(parentId);
      }
    }
    if (options.mixins) {
      options.mixins.forEach((mixin2) => {
        const mixinId = typeof mixin2 === "string" ? mixin2 : mixin2.id;
        if (mixinId) {
          chain.push(`mixin:${mixinId}`);
        }
      });
    }
    inheritanceChain.value = chain;
  }
  vue.watch(() => processedTemplate.value, (newTemplate) => {
    isInherited.value = newTemplate !== template;
  }, {
    immediate: true
  });
  const extend = (config) => {
    return inheritance.inheritanceManager.extendTemplate(processedTemplate.value, config);
  };
  const mixin = (id, mixinTemplate) => {
    inheritance.inheritanceManager.createMixin(id, mixinTemplate);
  };
  const defineBlock = (block) => {
    if (!template.id) {
      console.warn("Template must have an id to define blocks");
      return;
    }
    inheritance.blockManager.defineBlock(template.id, block);
    activeBlocks.set(block.name, block);
  };
  const overrideBlock = (name, content) => {
    if (!template.id) {
      console.warn("Template must have an id to override blocks");
      return false;
    }
    const success = inheritance.blockManager.overrideBlock(template.id, name, content);
    if (success) {
      const block = inheritance.blockManager.getBlock(template.id, name);
      if (block) {
        activeBlocks.set(name, block);
      }
    }
    return success;
  };
  const getBlock = (name) => {
    if (!template.id) return void 0;
    return inheritance.blockManager.getBlock(template.id, name);
  };
  const renderBlock = (name) => {
    if (!template.id) return null;
    return inheritance.blockManager.renderBlock(template.id, name);
  };
  const getParent = () => {
    return context.parent;
  };
  const getMixins = () => {
    return context.mixins;
  };
  const getDepth = () => {
    return context.depth;
  };
  const cleanup = () => {
    if (template.id) {
      inheritance.blockManager.clearBlocks(template.id);
    }
    activeBlocks.clear();
  };
  return {
    // 状态
    template: processedTemplate,
    isInherited,
    inheritanceChain,
    blocks: activeBlocks,
    context,
    // 方法
    extend,
    mixin,
    defineBlock,
    overrideBlock,
    getBlock,
    renderBlock,
    getParent,
    getMixins,
    getDepth,
    cleanup
  };
}
function useTemplateBlocks(templateId) {
  const blocks = vue.ref([]);
  const blockMap = vue.reactive(/* @__PURE__ */ new Map());
  const loadBlocks = () => {
    const loadedBlocks = inheritance.blockManager.getBlocks(templateId);
    blocks.value = loadedBlocks;
    blockMap.clear();
    loadedBlocks.forEach((block) => {
      blockMap.set(block.name, block);
    });
  };
  loadBlocks();
  const define = (block) => {
    inheritance.blockManager.defineBlock(templateId, block);
    loadBlocks();
  };
  const override = (name, content) => {
    const success = inheritance.blockManager.overrideBlock(templateId, name, content);
    if (success) {
      loadBlocks();
    }
    return success;
  };
  const get = (name) => {
    return blockMap.get(name);
  };
  const render = (name) => {
    return inheritance.blockManager.renderBlock(templateId, name);
  };
  const has = (name) => {
    return blockMap.has(name);
  };
  const clear = () => {
    inheritance.blockManager.clearBlocks(templateId);
    blocks.value = [];
    blockMap.clear();
  };
  return {
    blocks,
    blockMap,
    define,
    override,
    get,
    render,
    has,
    clear,
    refresh: loadBlocks
  };
}
function useTemplateMixins() {
  const mixins = vue.reactive(/* @__PURE__ */ new Map());
  const register = (id, mixin) => {
    inheritance.inheritanceManager.createMixin(id, mixin);
    mixins.set(id, mixin);
  };
  const get = (id) => {
    return inheritance.inheritanceManager.getMixin(id);
  };
  const apply = (template, mixinIds, strategy) => {
    return inheritance.inheritanceManager.extendTemplate(template, {
      mixins: mixinIds,
      mergeStrategy: strategy
    });
  };
  const compose = (id, mixinIds, additional) => {
    const composedMixin = {};
    mixinIds.forEach((mixinId) => {
      const mixin = get(mixinId);
      if (mixin) {
        Object.assign(composedMixin, mixin);
      }
    });
    if (additional) {
      Object.assign(composedMixin, additional);
    }
    register(id, composedMixin);
  };
  const has = (id) => {
    return mixins.has(id);
  };
  const getAll = () => {
    return mixins;
  };
  return {
    mixins,
    register,
    get,
    apply,
    compose,
    has,
    getAll
  };
}

exports.useTemplateBlocks = useTemplateBlocks;
exports.useTemplateInheritance = useTemplateInheritance;
exports.useTemplateMixins = useTemplateMixins;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateInheritance.cjs.map
