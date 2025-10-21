/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, watch, onMounted, onUnmounted, markRaw, computed } from 'vue';
import { getManager } from '../core/manager.js';

function useTemplate(category, device, name, options) {
  const categoryRef = typeof category === "string" ? ref(category) : category;
  const deviceRef = typeof device === "string" ? ref(device) : device;
  const nameRef = typeof name === "string" ? ref(name) : name;
  const component = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const metadata = ref(null);
  let manager = null;
  const getManagerLazy = () => {
    if (!manager) manager = getManager();
    return manager;
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
      component.value = markRaw(loaded);
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
  watch([categoryRef, deviceRef, nameRef], () => {
    if (loadTimer) clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      load();
      loadTimer = null;
    }, 100);
  });
  onMounted(() => {
    load();
  });
  onUnmounted(() => {
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
  const filterRef = typeof filter === "object" && "value" in filter ? filter : ref(filter || {});
  const templates = ref([]);
  const loading = ref(false);
  const error = ref(null);
  let manager = null;
  const getManagerLazy = () => {
    if (!manager) manager = getManager();
    return manager;
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
  watch(filterRef, () => {
    if (queryTimer) clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      query();
      queryTimer = null;
    }, 200);
  }, {
    deep: true
  });
  onMounted(() => {
    query();
  });
  onUnmounted(() => {
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
  const categoryRef = ref(category);
  const deviceRef = ref(device);
  const template = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const manager = getManager();
  const getDefault = async () => {
    if (!categoryRef.value || !deviceRef.value) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      template.value = await manager.getDefaultTemplate(categoryRef.value, deviceRef.value);
    } catch (e) {
      error.value = e;
      template.value = null;
    } finally {
      loading.value = false;
    }
  };
  watch([categoryRef, deviceRef], () => {
    getDefault();
  });
  onMounted(() => {
    getDefault();
  });
  return {
    template: computed(() => template.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getDefault
  };
}
function useTemplateManager() {
  const manager = getManager();
  const initialized = ref(false);
  const scanResult = ref(manager.getScanResult());
  const initialize = async () => {
    if (initialized.value) {
      return scanResult.value ?? await manager.initialize();
    }
    const result = await manager.initialize();
    scanResult.value = result;
    initialized.value = true;
    return result;
  };
  const rescan = async () => {
    const result = await manager.rescan();
    scanResult.value = result;
    return result;
  };
  return {
    manager,
    initialized: computed(() => initialized.value),
    scanResult: computed(() => scanResult.value),
    initialize,
    rescan,
    loadTemplate: manager.loadTemplate.bind(manager),
    preloadTemplate: manager.preloadTemplate.bind(manager),
    clearCache: manager.clearCache.bind(manager),
    getAllTemplates: manager.getAllTemplates.bind(manager),
    queryTemplates: manager.queryTemplates.bind(manager),
    getTemplatesByCategory: manager.getTemplatesByCategory.bind(manager),
    getTemplatesByDevice: manager.getTemplatesByDevice.bind(manager),
    getDefaultTemplate: manager.getDefaultTemplate.bind(manager)
  };
}

export { useDefaultTemplate, useTemplate, useTemplateList, useTemplateManager };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplate.js.map
