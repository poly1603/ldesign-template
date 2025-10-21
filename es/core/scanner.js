/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
function parseTemplatePath(path) {
  const match = path.match(/templates\/([^/]+)\/([^/]+)\/([^/]+)\/config\.(ts|js)$/);
  if (!match) {
    return null;
  }
  const [, category, device, name] = match;
  return {
    category,
    device,
    name,
    fullPath: path
  };
}
function getComponentPath(configPath) {
  return configPath.replace(/config\.(ts|js)$/, "index.vue");
}
function getBuiltComponentPath(configPath) {
  return configPath.replace(/config\.(ts|js)$/, "index.vue.js");
}
class TemplateScanner {
  constructor() {
    this.configModules = null;
    this.componentModules = null;
    this.registry = /* @__PURE__ */ new Map();
    this.scanCache = /* @__PURE__ */ new WeakMap();
  }
  /**
   * 扫描所有模板
   *
   * 关键点：
   * 1. 使用 import.meta.glob 的 eager 模式同步加载所有配置
   * 2. 使用普通模式（懒加载）加载组件
   * 3. 支持 .ts 和 .js 配置文件（开发和生产环境）
   * 4. 支持 .vue 文件（开发环境）和 .vue.js 文件（打包后）
   */
  async scan() {
    const startTime = performance.now();
    const cacheKey = {
      _scanner: true
    };
    const cached = this.scanCache.get(cacheKey);
    if (cached) return cached;
    this.configModules = import.meta.glob("../templates/**/config.{ts,js}", {
      eager: true
    });
    this.componentModules = {
      ...import.meta.glob("../templates/**/index.vue"),
      ...import.meta.glob("../templates/**/index.vue.js")
    };
    const moduleEntries = Object.entries(this.configModules);
    const templates = Array.from({
      length: moduleEntries.length
    });
    let templateIndex = 0;
    const byCategory = /* @__PURE__ */ Object.create(null);
    const byDevice = /* @__PURE__ */ Object.create(null);
    for (const [path, module] of moduleEntries) {
      const pathInfo = parseTemplatePath(path);
      if (!pathInfo) {
        console.warn(`[TemplateScanner] \u65E0\u6CD5\u89E3\u6790\u8DEF\u5F84: ${path}`);
        continue;
      }
      const mod = module;
      const config = mod && typeof mod === "object" && "default" in mod ? mod.default : mod;
      const metadata = {
        ...config,
        category: pathInfo.category,
        device: pathInfo.device,
        name: config.name || pathInfo.name
      };
      const componentPath = getComponentPath(path);
      const builtComponentPath = getBuiltComponentPath(path);
      const componentLoader = this.componentModules[componentPath] || this.componentModules[builtComponentPath];
      const actualComponentPath = this.componentModules[componentPath] ? componentPath : builtComponentPath;
      if (!componentLoader) {
        console.warn(`[TemplateScanner] \u672A\u627E\u5230\u7EC4\u4EF6: ${componentPath} \u6216 ${builtComponentPath} (\u914D\u7F6E: ${path})`);
        continue;
      }
      const registryItem = {
        metadata,
        loader: async () => {
          const mod2 = await componentLoader();
          const m = mod2;
          return m.default ?? mod2;
        },
        configPath: path,
        componentPath: actualComponentPath
      };
      const key = `${metadata.category}/${metadata.device}/${metadata.name}`;
      this.registry.set(key, registryItem);
      templates[templateIndex++] = metadata;
      byCategory[metadata.category] = (byCategory[metadata.category] || 0) + 1;
      byDevice[metadata.device] = (byDevice[metadata.device] || 0) + 1;
    }
    templates.length = templateIndex;
    const scanTime = performance.now() - startTime;
    const result = {
      total: templates.length,
      byCategory,
      byDevice,
      scanTime,
      templates
    };
    this.scanCache.set(cacheKey, result);
    this.configModules = null;
    this.componentModules = null;
    return result;
  }
  /**
   * 获取注册表
   */
  getRegistry() {
    return this.registry;
  }
  /**
   * 根据键获取模板
   */
  getTemplate(category, device, name) {
    const key = `${category}/${device}/${name}`;
    return this.registry.get(key);
  }
  /**
   * 获取所有模板元数据
   */
  getAllMetadata() {
    return Array.from(this.registry.values()).map((item) => item.metadata);
  }
}
TemplateScanner.PATH_REGEX = /templates\/([^/]+)\/([^/]+)\/([^/]+)\/config\.(ts|js)$/;
TemplateScanner.CONFIG_REPLACE_REGEX = /config\.(ts|js)$/;
let globalScanner = null;
function getScanner() {
  if (!globalScanner) {
    globalScanner = new TemplateScanner();
  }
  return globalScanner;
}
async function scanTemplates() {
  const scanner = getScanner();
  return scanner.scan();
}

export { TemplateScanner, getScanner, scanTemplates };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=scanner.js.map
