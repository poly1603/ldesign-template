/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, inject, ref, computed, watch, onMounted, onUnmounted, toRefs, nextTick, provide, useSlots, createElementBlock, openBlock, unref, createCommentVNode, createBlock, renderSlot, createVNode, Fragment, createElementVNode, toDisplayString, resolveDynamicComponent, mergeProps, toHandlers, createSlots, renderList, withCtx, normalizeProps, guardReactiveProps } from 'vue';
import { useTemplate } from '../composables/useTemplate.js';
import { useTemplateTheme } from '../composables/useTemplateTheme.js';
import '../core/loader.js';
import { getManager } from '../core/manager.js';
import '../core/scanner.js';
import { getLocale } from '../locales/index.js';
import { useTemplatePlugin } from '../plugin/useTemplatePlugin.js';
import './TemplateSelector.vue.js';
import './TemplateSkeleton.vue.js';
import script$1 from './TemplateSkeleton.vue2.js';
import script$2 from './TemplateSelector.vue2.js';

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
var script = /* @__PURE__ */ defineComponent({
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
    const manager = getManager();
    const plugin = useTemplatePlugin();
    const locale = plugin?.currentLocale || inject("locale", ref("zh-CN"));
    const messages = computed(() => {
      const localeValue = typeof locale.value === "string" ? locale.value : "zh-CN";
      return getLocale(localeValue);
    });
    const abortController = ref(null);
    let autoSaveTimer = null;
    const modelData = ref(props.modelValue);
    const modelWatcher = watch(() => props.modelValue, (newVal) => {
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
    const dataWatcher = watch(modelData, (newVal) => {
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
    } = props.theme ? useTemplateTheme() : {
      setTheme: () => {
      },
      currentTheme: ref(null)
    };
    if (props.theme) {
      watch(() => props.theme, (newTheme) => {
        if (newTheme) setTheme(newTheme);
      }, {
        immediate: true
      });
    }
    const retryCount = ref(0);
    const shouldAutoDetect = computed(() => props.autoDetect ?? !props.device);
    const shouldAutoLoadDefault = computed(() => props.autoLoadDefault ?? !props.name);
    const currentDevice = ref(props.device || "desktop");
    const currentName = ref(props.name || "default");
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
        const defaultTemplate = await manager.getDefaultTemplate(props.category, dev);
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
    watch(() => props.device, (newDevice) => {
      if (newDevice && newDevice !== currentDevice.value) {
        currentDevice.value = newDevice;
        if (shouldAutoLoadDefault.value) {
          loadDefaultTemplate(newDevice);
        }
      }
    });
    watch(() => props.name, (newName) => {
      if (newName && newName !== currentName.value) {
        currentName.value = newName;
      }
    });
    const isInitialized = ref(false);
    onMounted(async () => {
      if (!isInitialized.value) {
        abortController.value = new AbortController();
        try {
          await manager.initialize();
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
    onUnmounted(() => {
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
    } = toRefs(props);
    const {
      component,
      loading,
      error,
      reload: originalReload
    } = useTemplate(category, currentDevice, currentName, props.loadOptions);
    const shouldShowSkeleton = computed(() => {
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
    watch(component, (newComponent) => {
      if (newComponent) {
        nextTick(() => {
          emit("mounted", newComponent);
        });
      }
    });
    if (props.modelValue !== void 0) {
      provide("templateModel", modelData);
    }
    const combinedProps = computed(() => {
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
    const slots = useSlots();
    const availableSlots = computed(() => {
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
      return openBlock(), createElementBlock("div", {
        class: "ldesign-template-renderer",
        "data-theme": unref(currentTheme)
      }, [createCommentVNode(" \u9AA8\u67B6\u5C4F "), shouldShowSkeleton.value && !unref(component) ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "skeleton", {}, () => [createVNode(script$1, {
        type: _ctx.skeletonType,
        animation: "wave"
      }, null, 8, ["type"])])])) : unref(loading) && !shouldShowSkeleton.value ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 1
        },
        [createCommentVNode(" \u52A0\u8F7D\u4E2D\uFF08\u4E0D\u4F7F\u7528\u9AA8\u67B6\u5C4F\u65F6\uFF09 "), createElementVNode("div", _hoisted_3, [renderSlot(_ctx.$slots, "loading", {}, () => [createElementVNode(
          "div",
          _hoisted_4,
          toDisplayString(messages.value.messages.loading),
          1
          /* TEXT */
        )])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : unref(error) && !_ctx.fallback ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 2
        },
        [createCommentVNode(" \u9519\u8BEF "), createElementVNode("div", _hoisted_5, [renderSlot(_ctx.$slots, "error", {
          error: unref(error),
          retry: handleReload,
          retryCount: retryCount.value
        }, () => [createElementVNode("div", _hoisted_6, [createElementVNode(
          "p",
          null,
          toDisplayString(messages.value.messages.loadError),
          1
          /* TEXT */
        ), createElementVNode(
          "p",
          _hoisted_7,
          toDisplayString(unref(error).message),
          1
          /* TEXT */
        ), retryCount.value > 0 ? (openBlock(), createElementBlock(
          "p",
          _hoisted_8,
          " \u91CD\u8BD5\u6B21\u6570: " + toDisplayString(retryCount.value) + "/" + toDisplayString(_ctx.retryTimes),
          1
          /* TEXT */
        )) : createCommentVNode("v-if", true), createElementVNode("button", {
          disabled: retryCount.value >= _ctx.retryTimes,
          onClick: handleReload
        }, toDisplayString(retryCount.value >= _ctx.retryTimes ? "\u4E0D\u80FD\u91CD\u8BD5" : messages.value.actions.loadMore), 9, _hoisted_9)])])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : unref(error) && _ctx.fallback ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 3
        },
        [createCommentVNode(" \u964D\u7EA7\u7EC4\u4EF6 "), (openBlock(), createBlock(resolveDynamicComponent(_ctx.fallback), {
          error: unref(error),
          onRetry: handleReload
        }, null, 40, ["error"]))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : unref(component) ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 4
        },
        [createCommentVNode(" \u6A21\u677F\u7EC4\u4EF6 "), (openBlock(), createBlock(
          resolveDynamicComponent(unref(component)),
          mergeProps(combinedProps.value, toHandlers(_ctx.$attrs)),
          createSlots({
            _: 2
            /* DYNAMIC */
          }, [renderList(availableSlots.value, (slot, slotName) => {
            return {
              name: slotName,
              fn: withCtx((slotProps) => [renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps)))])
            };
          })]),
          1040
          /* FULL_PROPS, DYNAMIC_SLOTS */
        ))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (openBlock(), createElementBlock(
        Fragment,
        {
          key: 5
        },
        [createCommentVNode(" \u7A7A\u72B6\u6001 "), createElementVNode("div", _hoisted_10, [renderSlot(_ctx.$slots, "empty", {}, () => [createElementVNode(
          "p",
          null,
          toDisplayString(messages.value.messages.noTemplates),
          1
          /* TEXT */
        )])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )), createCommentVNode(" \u6A21\u677F\u9009\u62E9\u5668 "), _ctx.showSelector && unref(component) ? (openBlock(), createBlock(script$2, {
        key: 6,
        category: unref(category),
        device: currentDevice.value,
        "current-template": currentName.value,
        onSelect: handleTemplateSelect
      }, null, 8, ["category", "device", "current-template"])) : createCommentVNode("v-if", true)], 8, _hoisted_1);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateRenderer.vue2.js.map
