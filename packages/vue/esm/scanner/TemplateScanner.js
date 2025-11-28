/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { parsePath, generateTemplateId } from '@ldesign/template-core';

class TemplateScanner {
  constructor() {
    this.lazyComponents = import.meta.glob("../templates/**/{desktop,mobile,tablet}/*/index.vue", {
      eager: false
    });
    this.eagerConfigs = import.meta.glob("../templates/**/{desktop,mobile,tablet}/*/template.config.ts", {
      eager: true,
      import: "default"
    });
  }
  /**
   * 扫描并生成模板元数据列表
   */
  scan() {
    const templates = [];
    for (const [componentPath, loader] of Object.entries(this.lazyComponents)) {
      const parsed = parsePath(componentPath);
      if (!parsed) {
        console.warn(`\u65E0\u6CD5\u89E3\u6790\u6A21\u677F\u8DEF\u5F84: ${componentPath}`);
        continue;
      }
      const {
        category,
        device,
        name
      } = parsed;
      const id = generateTemplateId(category, device, name);
      const configPath = componentPath.replace("index.vue", "template.config.ts");
      const config = this.eagerConfigs[configPath] || {};
      templates.push({
        id,
        category,
        device,
        name,
        path: componentPath,
        loader,
        // 合并配置信息
        displayName: config.displayName,
        description: config.description,
        author: config.author,
        version: config.version,
        preview: config.preview,
        tags: config.tags,
        props: config.props,
        dependencies: config.dependencies
      });
    }
    return templates;
  }
  /**
   * 获取所有组件路径
   */
  getComponentPaths() {
    return Object.keys(this.lazyComponents);
  }
  /**
   * 获取所有配置路径
   */
  getConfigPaths() {
    return Object.keys(this.eagerConfigs);
  }
  /**
   * 获取扫描统计信息
   */
  getStats() {
    const componentCount = Object.keys(this.lazyComponents).length;
    const configCount = Object.keys(this.eagerConfigs).length;
    return {
      componentCount,
      configCount,
      matchRate: componentCount > 0 ? configCount / componentCount * 100 : 0
    };
  }
}
function createTemplateScanner() {
  return new TemplateScanner();
}

export { TemplateScanner, createTemplateScanner };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateScanner.js.map
