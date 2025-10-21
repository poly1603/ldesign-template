/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const loadedStyles = /* @__PURE__ */ new Set();
const styleElements = /* @__PURE__ */ new WeakMap();
const styleKeyMap = /* @__PURE__ */ new Map();
const MAX_STYLES = 100;
let cleanupTimer = null;
function loadComponentStyle(category, device, name, componentPath) {
  if (typeof document === "undefined") {
    return;
  }
  const styleId = `template-style-${category}-${device}-${name}`;
  if (loadedStyles.has(styleId) || document.getElementById(styleId)) {
    return;
  }
  if (componentPath && componentPath.endsWith(".vue.js")) {
    const stylePath = componentPath.replace(".vue.js", ".vue.css");
    try {
      const link = document.createElement("link");
      link.id = styleId;
      link.rel = "stylesheet";
      if (stylePath.startsWith("../")) {
        const baseUrl = new URL(import.meta.url);
        const styleUrl = new URL(stylePath, baseUrl);
        link.href = styleUrl.href;
      } else {
        link.href = stylePath;
      }
      document.head.appendChild(link);
      loadedStyles.add(styleId);
      const keyObj = {
        id: styleId
      };
      styleKeyMap.set(styleId, keyObj);
      styleElements.set(keyObj, link);
      if (loadedStyles.size > MAX_STYLES) {
        const firstStyle = loadedStyles.values().next().value;
        if (firstStyle) {
          removeStyle(firstStyle);
        }
      }
      scheduleCleanup();
    } catch (error) {
      console.warn(`[StyleLoader] \u65E0\u6CD5\u52A0\u8F7D\u6837\u5F0F: ${stylePath}`, error);
    }
  }
}
function loadStyles(paths) {
  if (typeof document === "undefined") {
    return;
  }
  paths.forEach((path) => {
    const id = `style-${path.replace(/[^a-z0-9]/gi, "-")}`;
    if (loadedStyles.has(id) || document.getElementById(id)) {
      return;
    }
    try {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = path;
      document.head.appendChild(link);
      loadedStyles.add(id);
    } catch (error) {
      console.warn(`[StyleLoader] \u65E0\u6CD5\u52A0\u8F7D\u6837\u5F0F: ${path}`, error);
    }
  });
}
function loadGlobalStyles() {
  loadStyles(["@ldesign/template/index.css", "@ldesign/template/es/index.css"]);
}
function removeStyle(id) {
  const keyObj = styleKeyMap.get(id);
  const element = document.getElementById(id) || keyObj && styleElements.get(keyObj);
  if (element) {
    element.remove();
  }
  loadedStyles.delete(id);
  if (keyObj) {
    styleElements.delete(keyObj);
    styleKeyMap.delete(id);
  }
}
function clearLoadedStyles() {
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }
  loadedStyles.forEach((id) => {
    removeStyle(id);
  });
  loadedStyles.clear();
  styleKeyMap.clear();
}
function scheduleCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setTimeout(() => {
    cleanupUnusedStyles();
    cleanupTimer = null;
  }, 3e4);
}
function cleanupUnusedStyles() {
  const usedStyles = /* @__PURE__ */ new Set();
  document.querySelectorAll("[data-template-style]").forEach((el) => {
    const styleId = el.getAttribute("data-template-style");
    if (styleId) usedStyles.add(styleId);
  });
  loadedStyles.forEach((id) => {
    if (!usedStyles.has(id)) {
      removeStyle(id);
    }
  });
}

export { cleanupUnusedStyles, clearLoadedStyles, loadComponentStyle, loadGlobalStyles, loadStyles, removeStyle };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=style-loader.js.map
