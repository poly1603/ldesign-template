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
var useTemplate = require('../composables/useTemplate.cjs');
var useTemplateTheme = require('../composables/useTemplateTheme.cjs');
require('../core/loader.cjs');
var manager = require('../core/manager.cjs');
require('../core/scanner.cjs');
var index = require('../locales/index.cjs');
var useTemplatePlugin = require('../plugin/useTemplatePlugin.cjs');
require('./TemplateSelector.vue.cjs');
require('./TemplateSkeleton.vue.cjs');
var TemplateSkeleton_vue_vue_type_script_setup_true_lang = require('./TemplateSkeleton.vue2.cjs');
var TemplateSelector_vue_vue_type_script_setup_true_lang = require('./TemplateSelector.vue2.cjs');

const _hoisted_1 = ["data-theme"];
const _hoisted_2 = {
  key: 0,
  class: "template-skeleton-wrapper"
};
const _hoisted_3 = {
  class: "template-loading"
};
const _hoisted_4 = {
  class: "loading-spinner"
};
const _hoisted_5 = {
  class: "template-error"
};
const _hoisted_6 = {
  class: "error-message"
};
const _hoisted_7 = {
  class: "error-detail"
};
const _hoisted_8 = {
  key: 0,
  class: "retry-info"
};
const _hoisted_9 = ["disabled"];
const _hoisted_10 = {
  class: "template-empty"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "TemplateRenderer",
  props: {
    category: {
      type: String,
      required: true
    },
    device: {
      type: String,
      required: false,
      default: void 0
    },
    name: {
      type: String,
      required: false,
      default: void 0
    },
    autoDetect: {
      type: Boolean,
      required: false,
      default: void 0
    },
    autoLoadDefault: {
      type: Boolean,
      required: false,
      default: void 0
    },
    componentProps: {
      type: Object,
      required: false,
      default: () => ({})
    },
    loadOptions: {
      type: Object,
      required: false,
      default: void 0
    },
    showSelector: {
      type: Boolean,
      required: false,
      default: true
    },
    slots: {
      type: Object,
      required: false,
      default: void 0
    },
    modelValue: {
      type: null,
      required: false,
      default: void 0
    },
    skeleton: {
      type: [Boolean, String],
      required: false,
      default: "auto"
    },
    skeletonType: {
      type: String,
      required: false,
      default: "default"
    },
    autoSave: {
      type: Boolean,
      required: false,
      default: false
    },
    autoSaveDelay: {
      type: Number,
      required: false,
      default: 1e3
    },
    retryTimes: {
      type: Number,
      required: false,
      default: 3
    },
    retryDelay: {
      type: Number,
      required: false,
      default: 1e3
    },
    fallback: {
      type: null,
      required: false,
      default: void 0
    },
    theme: {
      type: String,
      required: false,
      default: void 0
    }
  },
  emits: ["load", "error", "reload", "templateChange", "deviceChange", "update:modelValue", "save", "mounted"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const manager$1 = manager.getManager();
    const plugin = useTemplatePlugin.useTemplatePlugin();
    const locale = plugin?.currentLocale || vue.inject("locale", vue.ref("zh-CN"));
    const messages = vue.computed(() => {
      const localeValue = typeof locale.value === "string" ? locale.value : "zh-CN";
      return index.getLocale(localeValue);
    });
    const abortController = vue.ref(null);
    let autoSaveTimer = null;
    const modelData = vue.ref(props.modelValue);
    const modelWatcher = vue.watch(() => props.modelValue, (newVal) => {
      modelData.value = newVal;
    });
    const scheduleAutoSave = () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        if (!abortController.value?.signal.aborted) {
          emit("save", modelData.value);
        }
      }, props.autoSaveDelay);
    };
    const dataWatcher = vue.watch(modelData, (newVal) => {
      emit("update:modelValue", newVal);
      if (props.autoSave) {
        scheduleAutoSave();
      }
    }, {
      deep: true
    });
    const {
      setTheme,
      currentTheme
    } = props.theme ? useTemplateTheme.useTemplateTheme() : {
      setTheme: () => {
      },
      currentTheme: vue.ref(null)
    };
    if (props.theme) {
      vue.watch(() => props.theme, (newTheme) => {
        if (newTheme) setTheme(newTheme);
      }, {
        immediate: true
      });
    }
    const retryCount = vue.ref(0);
    const shouldAutoDetect = vue.computed(() => props.autoDetect ?? !props.device);
    const shouldAutoLoadDefault = vue.computed(() => props.autoLoadDefault ?? !props.name);
    const currentDevice = vue.ref(props.device || "desktop");
    const currentName = vue.ref(props.name || "default");
    const detectDevice = () => {
      if (typeof window === "undefined") return "desktop";
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    };
    const loadDefaultTemplate = async (dev) => {
      if (!shouldAutoLoadDefault.value) return;
      try {
        let templatePlugin = plugin;
        if (!templatePlugin && typeof window !== "undefined") {
          templatePlugin = window.__TEMPLATE_PLUGIN__ || null;
        }
        if (templatePlugin?.getPreferredTemplate) {
          const preferred = await templatePlugin.getPreferredTemplate(props.category, dev);
          if (preferred?.name) {
            currentName.value = preferred.name;
            emit("templateChange", preferred.name);
            return;
          }
        }
        const defaultTemplate = await manager$1.getDefaultTemplate(props.category, dev);
        if (defaultTemplate?.name) {
          currentName.value = defaultTemplate.name;
          emit("templateChange", defaultTemplate.name);
        }
      } catch (e) {
        console.error(messages.value.messages.loadError, e);
      }
    };
    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (shouldAutoDetect.value) {
          const newDevice = detectDevice();
          if (currentDevice.value !== newDevice) {
            currentDevice.value = newDevice;
            emit("deviceChange", newDevice);
            loadDefaultTemplate(newDevice);
          }
        }
      }, 150);
    };
    vue.watch(() => props.device, (newDevice) => {
      if (newDevice && newDevice !== currentDevice.value) {
        currentDevice.value = newDevice;
        if (shouldAutoLoadDefault.value) {
          loadDefaultTemplate(newDevice);
        }
      }
    });
    vue.watch(() => props.name, (newName) => {
      if (newName && newName !== currentName.value) {
        currentName.value = newName;
      }
    });
    const isInitialized = vue.ref(false);
    vue.onMounted(async () => {
      if (!isInitialized.value) {
        abortController.value = new AbortController();
        try {
          await manager$1.initialize();
          if (abortController.value.signal.aborted) return;
          if (shouldAutoDetect.value) {
            currentDevice.value = detectDevice();
            emit("deviceChange", currentDevice.value);
          }
          if (shouldAutoLoadDefault.value) {
            await loadDefaultTemplate(currentDevice.value);
          }
          isInitialized.value = true;
          if (shouldAutoDetect.value) {
            window.addEventListener("resize", handleResize, {
              passive: true
            });
          }
        } catch (error2) {
          if (!abortController.value.signal.aborted) {
            console.error("Initialization failed:", error2);
          }
        }
      }
    });
    vue.onUnmounted(() => {
      abortController.value?.abort();
      if (shouldAutoDetect.value) {
        window.removeEventListener("resize", handleResize);
      }
      if (resizeTimer) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
      }
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = null;
      }
      modelWatcher();
      dataWatcher();
    });
    const {
      category
    } = vue.toRefs(props);
    const {
      component,
      loading,
      error,
      reload: originalReload
    } = useTemplate.useTemplate(category, currentDevice, currentName, props.loadOptions);
    const shouldShowSkeleton = vue.computed(() => {
      if (props.skeleton === true) return true;
      if (props.skeleton === "auto") return loading.value;
      return false;
    });
    const reload = async () => {
      if (retryCount.value >= props.retryTimes) {
        retryCount.value = 0;
      }
      try {
        await originalReload();
        retryCount.value = 0;
      } catch (err) {
        if (retryCount.value < props.retryTimes) {
          retryCount.value++;
          setTimeout(() => reload(), props.retryDelay * 2 ** (retryCount.value - 1));
        } else {
          throw err;
        }
      }
    };
    const handleReload = async () => {
      emit("reload");
      await reload();
    };
    vue.watch(component, (newComponent) => {
      if (newComponent) {
        vue.nextTick(() => {
          emit("mounted", newComponent);
        });
      }
    });
    if (props.modelValue !== void 0) {
      vue.provide("templateModel", modelData);
    }
    const combinedProps = vue.computed(() => {
      const baseProps = {
        ...props.componentProps
      };
      if (props.modelValue !== void 0) {
        baseProps.modelValue = modelData.value;
        baseProps["onUpdate:modelValue"] = (val) => {
          modelData.value = val;
        };
      }
      return baseProps;
    });
    const handleTemplateSelect = (templateName) => {
      currentName.value = templateName;
      emit("templateChange", templateName);
      let templatePlugin = plugin;
      if (!templatePlugin && typeof window !== "undefined") {
        templatePlugin = window.__TEMPLATE_PLUGIN__ || null;
      }
      if (templatePlugin?.savePreference) {
        templatePlugin.savePreference(props.category, currentDevice.value, templateName);
      }
    };
    const slots = vue.useSlots();
    const availableSlots = vue.computed(() => {
      const reserved = ["loading", "error", "empty"];
      const result = {};
      for (const slotName in slots) {
        if (!reserved.includes(slotName)) {
          const s = slots[slotName];
          if (s) result[slotName] = s;
        }
      }
      return result;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: "ldesign-template-renderer",
        "data-theme": vue.unref(currentTheme)
      }, [vue.createCommentVNode(" \u9AA8\u67B6\u5C4F "), shouldShowSkeleton.value && !vue.unref(component) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [vue.renderSlot(_ctx.$slots, "skeleton", {}, () => [vue.createVNode(TemplateSkeleton_vue_vue_type_script_setup_true_lang.default, {
        type: _ctx.skeletonType,
        animation: "wave"
      }, null, 8, ["type"])])])) : vue.unref(loading) && !shouldShowSkeleton.value ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 1
        },
        [vue.createCommentVNode(" \u52A0\u8F7D\u4E2D\uFF08\u4E0D\u4F7F\u7528\u9AA8\u67B6\u5C4F\u65F6\uFF09 "), vue.createElementVNode("div", _hoisted_3, [vue.renderSlot(_ctx.$slots, "loading", {}, () => [vue.createElementVNode(
          "div",
          _hoisted_4,
          vue.toDisplayString(messages.value.messages.loading),
          1
          /* TEXT */
        )])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : vue.unref(error) && !_ctx.fallback ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 2
        },
        [vue.createCommentVNode(" \u9519\u8BEF "), vue.createElementVNode("div", _hoisted_5, [vue.renderSlot(_ctx.$slots, "error", {
          error: vue.unref(error),
          retry: handleReload,
          retryCount: retryCount.value
        }, () => [vue.createElementVNode("div", _hoisted_6, [vue.createElementVNode(
          "p",
          null,
          vue.toDisplayString(messages.value.messages.loadError),
          1
          /* TEXT */
        ), vue.createElementVNode(
          "p",
          _hoisted_7,
          vue.toDisplayString(vue.unref(error).message),
          1
          /* TEXT */
        ), retryCount.value > 0 ? (vue.openBlock(), vue.createElementBlock(
          "p",
          _hoisted_8,
          " \u91CD\u8BD5\u6B21\u6570: " + vue.toDisplayString(retryCount.value) + "/" + vue.toDisplayString(_ctx.retryTimes),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true), vue.createElementVNode("button", {
          disabled: retryCount.value >= _ctx.retryTimes,
          onClick: handleReload
        }, vue.toDisplayString(retryCount.value >= _ctx.retryTimes ? "\u4E0D\u80FD\u91CD\u8BD5" : messages.value.actions.loadMore), 9, _hoisted_9)])])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : vue.unref(error) && _ctx.fallback ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 3
        },
        [vue.createCommentVNode(" \u964D\u7EA7\u7EC4\u4EF6 "), (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.fallback), {
          error: vue.unref(error),
          onRetry: handleReload
        }, null, 40, ["error"]))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : vue.unref(component) ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 4
        },
        [vue.createCommentVNode(" \u6A21\u677F\u7EC4\u4EF6 "), (vue.openBlock(), vue.createBlock(
          vue.resolveDynamicComponent(vue.unref(component)),
          vue.mergeProps(combinedProps.value, vue.toHandlers(_ctx.$attrs)),
          vue.createSlots({
            _: 2
            /* DYNAMIC */
          }, [vue.renderList(availableSlots.value, (slot, slotName) => {
            return {
              name: slotName,
              fn: vue.withCtx((slotProps) => [vue.renderSlot(_ctx.$slots, slotName, vue.normalizeProps(vue.guardReactiveProps(slotProps)))])
            };
          })]),
          1040
          /* FULL_PROPS, DYNAMIC_SLOTS */
        ))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 5
        },
        [vue.createCommentVNode(" \u7A7A\u72B6\u6001 "), vue.createElementVNode("div", _hoisted_10, [vue.renderSlot(_ctx.$slots, "empty", {}, () => [vue.createElementVNode(
          "p",
          null,
          vue.toDisplayString(messages.value.messages.noTemplates),
          1
          /* TEXT */
        )])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )), vue.createCommentVNode(" \u6A21\u677F\u9009\u62E9\u5668 "), _ctx.showSelector && vue.unref(component) ? (vue.openBlock(), vue.createBlock(TemplateSelector_vue_vue_type_script_setup_true_lang.default, {
        key: 6,
        category: vue.unref(category),
        device: currentDevice.value,
        "current-template": currentName.value,
        onSelect: handleTemplateSelect
      }, null, 8, ["category", "device", "current-template"])) : vue.createCommentVNode("v-if", true)], 8, _hoisted_1);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateRenderer.vue2.cjs.map
