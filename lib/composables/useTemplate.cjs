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
var manager = require('../core/manager.cjs');

function useTemplate(category, device, name, options) {
  const categoryRef = typeof category === "string" ? vue.ref(category) : category;
  const deviceRef = typeof device === "string" ? vue.ref(device) : device;
  const nameRef = typeof name === "string" ? vue.ref(name) : name;
  const component = vue.ref(null);
  const loading = vue.ref(false);
  const error = vue.ref(null);
  const metadata = vue.ref(null);
  let manager$1 = null;
  const getManagerLazy = () => {
    if (!manager$1) manager$1 = manager.getManager();
    return manager$1;
  };
  const load = async () => {
    const cat = categoryRef.value;
    const dev = deviceRef.value;
    const nm = nameRef.value;
    if (!cat || !dev || !nm) return;
    loading.value = true;
    error.value = null;
    try {
      const mgr = getManagerLazy();
      const loaded = await mgr.loadTemplate(cat, dev, nm, options);
      component.value = vue.markRaw(loaded);
      if (!metadata.value || metadata.value.name !== nm) {
        const templates = await mgr.queryTemplates({
          category: cat,
          device: dev,
          name: nm
        });
        metadata.value = templates[0] || null;
      }
    } catch (e) {
      error.value = e;
      component.value = null;
      metadata.value = null;
    } finally {
      loading.value = false;
    }
  };
  const reload = () => {
    const mgr = getManagerLazy();
    mgr.clearCache(categoryRef.value, deviceRef.value, nameRef.value);
    metadata.value = null;
    return load();
  };
  let loadTimer = null;
  vue.watch([categoryRef, deviceRef, nameRef], () => {
    if (loadTimer) clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      load();
      loadTimer = null;
    }, 100);
  });
  vue.onMounted(() => {
    load();
  });
  vue.onUnmounted(() => {
    if (loadTimer) {
      clearTimeout(loadTimer);
      loadTimer = null;
    }
  });
  return {
    // 直接返回 ref，避免不必要的 computed 包装
    component,
    loading,
    error,
    metadata,
    load,
    reload
  };
}
function useTemplateList(filter) {
  const filterRef = typeof filter === "object" && "value" in filter ? filter : vue.ref(filter || {});
  const templates = vue.ref([]);
  const loading = vue.ref(false);
  const error = vue.ref(null);
  let manager$1 = null;
  const getManagerLazy = () => {
    if (!manager$1) manager$1 = manager.getManager();
    return manager$1;
  };
  const query = async () => {
    loading.value = true;
    error.value = null;
    try {
      const mgr = getManagerLazy();
      templates.value = await mgr.queryTemplates(filterRef.value);
    } catch (e) {
      error.value = e;
      templates.value = [];
    } finally {
      loading.value = false;
    }
  };
  const refresh = async () => {
    const mgr = getManagerLazy();
    await mgr.rescan();
    return query();
  };
  let queryTimer = null;
  vue.watch(filterRef, () => {
    if (queryTimer) clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      query();
      queryTimer = null;
    }, 200);
  }, {
    deep: true
  });
  vue.onMounted(() => {
    query();
  });
  vue.onUnmounted(() => {
    if (queryTimer) {
      clearTimeout(queryTimer);
      queryTimer = null;
    }
  });
  return {
    // 直接返回 ref，避免 computed 开销
    templates,
    loading,
    error,
    query,
    refresh
  };
}
function useDefaultTemplate(category, device) {
  const categoryRef = vue.ref(category);
  const deviceRef = vue.ref(device);
  const template = vue.ref(null);
  const loading = vue.ref(false);
  const error = vue.ref(null);
  const manager$1 = manager.getManager();
  const getDefault = async () => {
    if (!categoryRef.value || !deviceRef.value) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      template.value = await manager$1.getDefaultTemplate(categoryRef.value, deviceRef.value);
    } catch (e) {
      error.value = e;
      template.value = null;
    } finally {
      loading.value = false;
    }
  };
  vue.watch([categoryRef, deviceRef], () => {
    getDefault();
  });
  vue.onMounted(() => {
    getDefault();
  });
  return {
    template: vue.computed(() => template.value),
    loading: vue.computed(() => loading.value),
    error: vue.computed(() => error.value),
    getDefault
  };
}
function useTemplateManager() {
  const manager$1 = manager.getManager();
  const initialized = vue.ref(false);
  const scanResult = vue.ref(manager$1.getScanResult());
  const initialize = async () => {
    if (initialized.value) {
      return scanResult.value ?? await manager$1.initialize();
    }
    const result = await manager$1.initialize();
    scanResult.value = result;
    initialized.value = true;
    return result;
  };
  const rescan = async () => {
    const result = await manager$1.rescan();
    scanResult.value = result;
    return result;
  };
  return {
    manager: manager$1,
    initialized: vue.computed(() => initialized.value),
    scanResult: vue.computed(() => scanResult.value),
    initialize,
    rescan,
    loadTemplate: manager$1.loadTemplate.bind(manager$1),
    preloadTemplate: manager$1.preloadTemplate.bind(manager$1),
    clearCache: manager$1.clearCache.bind(manager$1),
    getAllTemplates: manager$1.getAllTemplates.bind(manager$1),
    queryTemplates: manager$1.queryTemplates.bind(manager$1),
    getTemplatesByCategory: manager$1.getTemplatesByCategory.bind(manager$1),
    getTemplatesByDevice: manager$1.getTemplatesByDevice.bind(manager$1),
    getDefaultTemplate: manager$1.getDefaultTemplate.bind(manager$1)
  };
}

exports.useDefaultTemplate = useDefaultTemplate;
exports.useTemplate = useTemplate;
exports.useTemplateList = useTemplateList;
exports.useTemplateManager = useTemplateManager;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplate.cjs.map
