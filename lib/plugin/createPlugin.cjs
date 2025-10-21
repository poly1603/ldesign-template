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

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var manager = require('../core/manager.cjs');
var styleLoader = require('../core/style-loader.cjs');
var index = require('../locales/index.cjs');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const TemplatePluginSymbol = Symbol("TemplatePlugin");
const isRef = (v) => {
  return v && typeof v === "object" && "value" in v && "_rawValue" in v;
};
function useSmartLocale(options) {
  let eventListener = null;
  if (options.locale) {
    return {
      locale: isRef(options.locale) ? options.locale : vue.ref(options.locale),
      cleanup: () => {
      }
      // No cleanup needed for provided locale
    };
  }
  try {
    const injected = vue.inject("app-locale", null);
    if (injected && injected.value) {
      return {
        locale: injected,
        cleanup: () => {
        }
      };
    }
  } catch {
  }
  const locale = vue.ref(options.defaultLocale || "zh-CN");
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("app-locale");
    if (stored) {
      locale.value = stored;
    }
    eventListener = (e) => {
      const customEvent = e;
      if (customEvent.detail?.locale) {
        locale.value = customEvent.detail.locale;
      }
    };
    window.addEventListener("app:locale-changed", eventListener);
  }
  return {
    locale,
    cleanup: () => {
      if (eventListener && typeof window !== "undefined") {
        window.removeEventListener("app:locale-changed", eventListener);
        eventListener = null;
      }
    }
  };
}
const defaultDetectDevice = () => {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};
function createTemplatePlugin(options = {}) {
  const {
    locale: currentLocale,
    cleanup: localeCleanup
  } = useSmartLocale(options);
  let disposed = false;
  const cleanupHandlers = [localeCleanup];
  let initializeTimeout = null;
  let localeCache = null;
  const getLocaleData = () => {
    if (disposed) return null;
    if (!localeCache || localeCache.key !== currentLocale.value) {
      localeCache = {
        key: currentLocale.value,
        data: index.getLocale(currentLocale.value)
      };
    }
    return localeCache.data;
  };
  const localeMessages = {
    get value() {
      return getLocaleData();
    }
  };
  const mergedOptions = {
    pattern: options.pattern || "**/*.vue",
    basePath: options.basePath || "/src/templates",
    autoInit: options.autoInit !== false,
    preload: options.preload || false,
    preloadStrategy: options.preloadStrategy || "lazy",
    cache: {
      enabled: options.cache?.enabled !== false,
      ttl: options.cache?.ttl || 3e5,
      // 5 minutes
      maxSize: options.cache?.maxSize || 50
    },
    performance: options.performance || false,
    defaultDevice: options.defaultDevice || "desktop",
    autoDetect: options.autoDetect !== false,
    detectDevice: options.detectDevice || defaultDetectDevice,
    rememberPreferences: options.rememberPreferences || false,
    preferencesKey: options.preferencesKey || "ldesign-template-prefs",
    locale: options.locale,
    defaultLocale: options.defaultLocale || "zh-CN",
    hooks: options.hooks || {}
  };
  const managerOptions = {
    scanOptions: {
      pattern: mergedOptions.pattern,
      basePath: mergedOptions.basePath
    },
    loaderOptions: {
      cache: mergedOptions.cache?.enabled,
      cacheTtl: mergedOptions.cache?.ttl,
      cacheMaxSize: mergedOptions.cache?.maxSize,
      performance: mergedOptions.performance
    },
    defaultStrategy: "smart",
    preload: mergedOptions.preload,
    preloadStrategy: mergedOptions.preloadStrategy
  };
  const manager$1 = new manager.TemplateManager(managerOptions);
  const initialize = async () => {
    if (disposed) {
      throw new Error("Plugin has been disposed");
    }
    try {
      await manager$1.initialize();
      if (mergedOptions.preload) {
      }
    } catch (error) {
      mergedOptions.hooks?.onError?.(error);
      throw error;
    }
  };
  const loadTemplate = async (category, device, name) => {
    if (disposed) {
      throw new Error("Plugin has been disposed");
    }
    const templatePath = `${category}/${device}/${name}`;
    try {
      await mergedOptions.hooks?.beforeLoad?.(templatePath);
      const component = await manager$1.loadTemplate(category, device, name);
      await mergedOptions.hooks?.afterLoad?.(templatePath, component);
      return component;
    } catch (error) {
      mergedOptions.hooks?.onError?.(error);
      throw error;
    }
  };
  const getDefaultTemplate = async (category, device) => {
    try {
      const template = await manager$1.getDefaultTemplate(category, device);
      return template;
    } catch (error) {
      mergedOptions.hooks?.onError?.(error);
      throw error;
    }
  };
  let preferences = {};
  const MAX_PREFERENCES = 100;
  const loadPreferences = () => {
    if (!mergedOptions.rememberPreferences) return {};
    try {
      const stored = localStorage.getItem(mergedOptions.preferencesKey);
      if (stored) {
        preferences = JSON.parse(stored);
        return preferences;
      }
    } catch (error) {
      console.error("[Template Plugin] Failed to load preferences:", error);
    }
    return {};
  };
  const savePreferencesToStorage = () => {
    if (!mergedOptions.rememberPreferences) return;
    try {
      localStorage.setItem(mergedOptions.preferencesKey, JSON.stringify(preferences));
    } catch (error) {
      console.error("[Template Plugin] Failed to save preferences:", error);
    }
  };
  const savePreference = (category, device, templateName) => {
    if (!mergedOptions.rememberPreferences) return;
    const keys = Object.keys(preferences);
    if (keys.length >= MAX_PREFERENCES && !preferences[category]) {
      delete preferences[keys[0]];
    }
    if (!preferences[category]) {
      preferences[category] = {};
    }
    preferences[category][device] = templateName;
    savePreferencesToStorage();
  };
  const getPreferences = () => {
    return {
      ...preferences
    };
  };
  const clearPreferences = () => {
    preferences = {};
    if (mergedOptions.rememberPreferences) {
      try {
        localStorage.removeItem(mergedOptions.preferencesKey);
      } catch (error) {
        console.error("Failed to clear template preferences:", error);
      }
    }
  };
  const getPreferredTemplate = async (category, device) => {
    if (mergedOptions.rememberPreferences && Object.keys(preferences).length === 0) {
      loadPreferences();
    }
    if (mergedOptions.rememberPreferences) {
      const userPref = preferences[category]?.[device];
      if (userPref) {
        try {
          const templates = await manager$1.scanTemplates();
          const templateKey = `${category}/${device}/${userPref}`;
          if (templates.has(templateKey)) {
            return {
              name: userPref
            };
          } else {
            if (undefined.DEV) {
              console.warn(`[Template Plugin] Preferred template ${userPref} not found, falling back to default`);
            }
          }
        } catch (error) {
          if (undefined.DEV) {
            console.warn(`[Template Plugin] Failed to verify preferred template ${userPref}, falling back to default`, error);
          }
        }
      }
    }
    const defaultTemplate = await getDefaultTemplate(category, device);
    if (defaultTemplate?.name) {
      return {
        name: defaultTemplate.name
      };
    }
    return null;
  };
  if (mergedOptions.rememberPreferences && typeof window !== "undefined") {
    loadPreferences();
  }
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (initializeTimeout) {
      clearTimeout(initializeTimeout);
      initializeTimeout = null;
    }
    cleanupHandlers.forEach((handler) => {
      try {
        handler();
      } catch (error) {
        console.error("[Template Plugin] Cleanup error:", error);
      }
    });
    cleanupHandlers.length = 0;
    localeCache = null;
    preferences = {};
    if ("dispose" in manager$1 && typeof manager$1.dispose === "function") {
      manager$1.dispose();
    }
    if (typeof window !== "undefined") {
      delete window.__TEMPLATE_PLUGIN__;
    }
  };
  const plugin = {
    manager: manager$1,
    options: mergedOptions,
    currentLocale,
    localeMessages,
    initialize,
    loadTemplate,
    getDefaultTemplate,
    getPreferredTemplate,
    savePreference,
    getPreferences,
    clearPreferences,
    scanTemplates: () => disposed ? Promise.reject(new Error("Plugin disposed")) : manager$1.scanTemplates(),
    clearCache: () => disposed ? void 0 : manager$1.clearCache(),
    detectDevice: mergedOptions.detectDevice,
    dispose,
    install(app) {
      if (!isRef(options.locale)) {
        const sharedLocale = app._context?.provides?.["app-locale"];
        if (sharedLocale && sharedLocale.value !== void 0) {
          currentLocale.value = sharedLocale.value;
          plugin.currentLocale = sharedLocale;
          localeCache = null;
        } else {
          app.provide("app-locale", currentLocale);
        }
      }
      app.provide(TemplatePluginSymbol, plugin);
      app.config.globalProperties.$template = plugin;
      if (typeof window !== "undefined") {
        window.__TEMPLATE_PLUGIN__ = plugin;
        try {
          const baseUrl = new URL((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('plugin/createPlugin.cjs', document.baseURI).href)));
          const indexCssPath = new URL("../index.css", baseUrl);
          styleLoader.loadStyles([indexCssPath.href]);
        } catch (error) {
          console.warn("[Template Plugin] \u65E0\u6CD5\u81EA\u52A8\u52A0\u8F7D\u6837\u5F0F\uFF0C\u8BF7\u624B\u52A8\u5BFC\u5165 @ldesign/template/index.css", error);
        }
      }
      app.component("TemplateRenderer", async () => {
        const module = await Promise.resolve().then(function () { return require('../components/TemplateRenderer.vue.cjs'); });
        return module.default;
      });
      app.component("TemplateSelector", async () => {
        const module = await Promise.resolve().then(function () { return require('../components/TemplateSelector.vue.cjs'); });
        return module.default;
      });
      Promise.resolve().then(function () { return require('../directives/index.cjs'); }).then(({
        installTemplateDirective
      }) => {
        if (!disposed) {
          installTemplateDirective(app);
        }
      }).catch((err) => {
        console.warn("[Template Plugin] Failed to load directives:", err);
      });
      if (mergedOptions.autoInit) {
        if (typeof window !== "undefined") {
          initializeTimeout = setTimeout(() => {
            if (!disposed) {
              initialize().catch((error) => {
                console.error("[Template Plugin] Initialization failed:", error);
                mergedOptions.hooks?.onError?.(error);
              });
            }
          }, 0);
        }
      }
    }
  };
  return plugin;
}

exports.TemplatePluginSymbol = TemplatePluginSymbol;
exports.createTemplatePlugin = createTemplatePlugin;
exports.default = createTemplatePlugin;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=createPlugin.cjs.map
