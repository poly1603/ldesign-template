/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, computed } from 'vue';
import { getTemplateManager } from '../plugin/context.js';

function useTemplateList(category, device) {
  const templates = ref([]);
  const loading = ref(false);
  const count = computed(() => templates.value.length);
  function refresh() {
    loading.value = true;
    try {
      const manager = getTemplateManager();
      const cat = typeof category === "string" ? category : category.value;
      const dev = device ? typeof device === "string" ? device : device.value : void 0;
      if (dev) {
        templates.value = manager.getTemplatesByCategoryAndDevice(cat, dev);
      } else {
        templates.value = manager.getTemplatesByCategory(cat);
      }
    } catch (error) {
      console.error("\u83B7\u53D6\u6A21\u677F\u5217\u8868\u5931\u8D25:", error);
      templates.value = [];
    } finally {
      loading.value = false;
    }
  }
  function filterByTag(tag) {
    return templates.value.filter((template) => template.tags?.includes(tag));
  }
  function search(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return templates.value.filter((template) => template.name.toLowerCase().includes(lowerKeyword) || template.displayName?.toLowerCase().includes(lowerKeyword) || template.description?.toLowerCase().includes(lowerKeyword) || template.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword)));
  }
  refresh();
  return {
    templates,
    loading,
    count,
    refresh,
    filterByTag,
    search
  };
}

export { useTemplateList };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateList.js.map
