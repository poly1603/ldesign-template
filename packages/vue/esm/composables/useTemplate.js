/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, shallowRef, watch } from 'vue';
import { getTemplateManager } from '../plugin/context.js';

function useTemplate(templateId, options = {}) {
  const {
    immediate = false,
    onLoad,
    onError
  } = options;
  const template = ref();
  const component = shallowRef();
  const loading = ref(false);
  const error = ref();
  async function load(id) {
    const targetId = id || (typeof templateId === "string" ? templateId : templateId.value);
    if (!targetId) {
      const err = new Error("\u6A21\u677FID\u4E0D\u80FD\u4E3A\u7A7A");
      error.value = err;
      onError?.(err);
      return;
    }
    loading.value = true;
    error.value = void 0;
    try {
      const manager = getTemplateManager();
      const meta = manager.resolveTemplate(targetId);
      if (!meta) {
        throw new Error(`\u6A21\u677F\u672A\u627E\u5230: ${targetId}`);
      }
      template.value = meta;
      if (meta.loader) {
        const module = await meta.loader();
        component.value = module.default;
        onLoad?.(meta);
      } else {
        throw new Error(`\u6A21\u677F\u7F3A\u5C11\u52A0\u8F7D\u5668: ${targetId}`);
      }
    } catch (e) {
      const err = e;
      error.value = err;
      console.error("\u52A0\u8F7D\u6A21\u677F\u5931\u8D25:", err);
      onError?.(err);
    } finally {
      loading.value = false;
    }
  }
  function unload() {
    component.value = void 0;
    template.value = void 0;
    error.value = void 0;
  }
  if (typeof templateId !== "string") {
    watch(templateId, (newId) => {
      if (newId) {
        load(newId);
      } else {
        unload();
      }
    }, {
      immediate
    });
  } else if (immediate) {
    load(templateId);
  }
  return {
    template,
    component,
    loading,
    error,
    load,
    unload
  };
}

export { useTemplate };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplate.js.map
