/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, defineComponent, watchEffect, onUnmounted, h, createApp } from 'vue';
import { getManager } from '../core/manager.js';

const instances = /* @__PURE__ */ new Map();
function parseBinding(binding) {
  const options = {};
  if (binding.arg) {
    options.category = binding.arg;
  }
  const modifiers = Object.keys(binding.modifiers);
  if (modifiers.length > 0) {
    if (modifiers[0]) options.device = modifiers[0];
    if (modifiers[1]) options.name = modifiers[1];
  }
  if (typeof binding.value === "object" && binding.value !== null) {
    Object.assign(options, binding.value);
  } else if (typeof binding.value === "string") {
    const parts = binding.value.split("/");
    if (parts[0]) options.category = parts[0];
    if (parts[1]) options.device = parts[1];
    if (parts[2]) options.name = parts[2];
  }
  if (!options.device) options.device = detectDevice();
  if (!options.name) options.name = "default";
  return options;
}
function detectDevice() {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
function createLoadingComponent(loading) {
  if (loading) {
    return typeof loading === "string" ? defineComponent({
      render() {
        return h("div", {
          class: "v-template-loading"
        }, loading);
      }
    }) : loading;
  }
  return defineComponent({
    render() {
      return h("div", {
        class: "v-template-loading"
      }, [h("span", {
        class: "v-template-spinner"
      }, "\u52A0\u8F7D\u4E2D...")]);
    }
  });
}
function createErrorComponent(error, errorHandler) {
  if (errorHandler) {
    if (typeof errorHandler === "function") {
      const result = errorHandler(error);
      return typeof result === "string" ? defineComponent({
        render() {
          return h("div", {
            class: "v-template-error"
          }, result);
        }
      }) : result;
    }
    return errorHandler;
  }
  return defineComponent({
    render() {
      return h("div", {
        class: "v-template-error"
      }, [h("p", `\u52A0\u8F7D\u6A21\u677F\u5931\u8D25: ${error.message}`), h("button", {
        class: "v-template-retry",
        onClick: () => window.location.reload()
      }, "\u91CD\u8BD5")]);
    }
  });
}
async function mountTemplate(el, options) {
  const manager = getManager();
  unmountTemplate(el);
  const abortController = new AbortController();
  const container = document.createElement("div");
  container.className = "v-template-container";
  const isLoading = ref(true);
  const loadError = ref(null);
  const templateComponent = ref(null);
  const WrapperComponent = defineComponent({
    setup() {
      let stopWatcher = null;
      stopWatcher = watchEffect(async (onInvalidate) => {
        onInvalidate(() => {
          if (abortController) {
            abortController.abort();
          }
        });
        try {
          if (abortController?.signal.aborted) return;
          isLoading.value = true;
          loadError.value = null;
          const component = await manager.loadTemplate(options.category, options.device, options.name, {
            onLoad: options.onLoad,
            onError: options.onError
          });
          if (abortController?.signal.aborted) return;
          templateComponent.value = component;
          isLoading.value = false;
        } catch (error) {
          loadError.value = error;
          isLoading.value = false;
          options.onError?.(error);
        }
      });
      onUnmounted(() => {
        if (stopWatcher) {
          stopWatcher();
          stopWatcher = null;
        }
        if (abortController) {
          abortController.abort();
        }
      });
      return () => {
        if (isLoading.value) {
          const LoadingComp = createLoadingComponent(options.loading);
          return h(LoadingComp);
        }
        if (loadError.value) {
          const ErrorComp = createErrorComponent(loadError.value, options.error);
          return h(ErrorComp);
        }
        if (templateComponent.value) {
          const content = h(templateComponent.value, options.props, options.slots);
          if (options.transition) {
            const transitionName = typeof options.transition === "string" ? options.transition : "v-template-fade";
            return h("transition", {
              name: transitionName
            }, () => content);
          }
          return content;
        }
        return null;
      };
    }
  });
  const app = createApp(WrapperComponent);
  el.innerHTML = "";
  el.appendChild(container);
  app.mount(container);
  instances.set(el, {
    app,
    component: WrapperComponent,
    abortController,
    cleanup: () => {
      if (abortController) {
        abortController.abort();
      }
      app.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  });
}
function unmountTemplate(el) {
  const instance = instances.get(el);
  if (instance) {
    instance.cleanup();
    instances.delete(el);
  }
}
const vTemplate = {
  mounted(el, binding, _vnode) {
    const options = parseBinding(binding);
    if (!options.category) {
      console.error("[v-template] Category is required");
      return;
    }
    mountTemplate(el, options);
  },
  updated(el, binding) {
    const oldOptions = parseBinding(binding.oldValue ? {
      ...binding,
      value: binding.oldValue
    } : binding);
    const newOptions = parseBinding(binding);
    if (oldOptions.category !== newOptions.category || oldOptions.device !== newOptions.device || oldOptions.name !== newOptions.name || JSON.stringify(oldOptions.props) !== JSON.stringify(newOptions.props)) {
      mountTemplate(el, newOptions);
    }
  },
  unmounted(el) {
    unmountTemplate(el);
  }
};
let stylesInstalled = false;
function installTemplateDirective(app) {
  app.directive("template", vTemplate);
  if (typeof document !== "undefined" && !stylesInstalled && !document.getElementById("v-template-styles")) {
    stylesInstalled = true;
    const style = document.createElement("style");
    style.id = "v-template-styles";
    style.textContent = `
      .v-template-container {
        width: 100%;
        height: 100%;
      }
      
      .v-template-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        color: #666;
      }
      
      .v-template-spinner {
        display: inline-block;
        animation: v-template-spin 1s linear infinite;
      }
      
      @keyframes v-template-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .v-template-error {
        padding: 20px;
        text-align: center;
        color: #f56c6c;
      }
      
      .v-template-retry {
        margin-top: 10px;
        padding: 8px 16px;
        background: #409eff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .v-template-retry:hover {
        background: #66b1ff;
      }
      
      /* Transition effects */
      .v-template-fade-enter-active,
      .v-template-fade-leave-active {
        transition: opacity 0.3s ease;
      }
      
      .v-template-fade-enter-from,
      .v-template-fade-leave-to {
        opacity: 0;
      }
      
      .v-template-slide-enter-active,
      .v-template-slide-leave-active {
        transition: transform 0.3s ease;
      }
      
      .v-template-slide-enter-from {
        transform: translateX(-100%);
      }
      
      .v-template-slide-leave-to {
        transform: translateX(100%);
      }
    `;
    document.head.appendChild(style);
    window.addEventListener("beforeunload", () => {
      instances.forEach((instance, el) => {
        unmountTemplate(el);
      });
    }, {
      once: true
    });
  }
}

export { vTemplate as default, installTemplateDirective, vTemplate };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=templateDirective.js.map
