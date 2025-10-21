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

const zhCN = {
  title: "\u6A21\u677F\u7BA1\u7406",
  category: {
    login: "\u767B\u5F55",
    dashboard: "\u4EEA\u8868\u76D8",
    error: "\u9519\u8BEF\u9875",
    profile: "\u4E2A\u4EBA\u4E2D\u5FC3",
    settings: "\u8BBE\u7F6E"
  },
  device: {
    desktop: "\u684C\u9762\u7AEF",
    tablet: "\u5E73\u677F\u7AEF",
    mobile: "\u79FB\u52A8\u7AEF"
  },
  actions: {
    selectTemplate: "\u9009\u62E9\u6A21\u677F",
    previewTemplate: "\u9884\u89C8\u6A21\u677F",
    applyTemplate: "\u5E94\u7528\u6A21\u677F",
    loadMore: "\u52A0\u8F7D\u66F4\u591A",
    clearCache: "\u6E05\u9664\u7F13\u5B58",
    savePreference: "\u4FDD\u5B58\u504F\u597D"
  },
  messages: {
    loading: "\u6B63\u5728\u52A0\u8F7D\u6A21\u677F...",
    noTemplates: "\u6682\u65E0\u53EF\u7528\u6A21\u677F",
    loadError: "\u6A21\u677F\u52A0\u8F7D\u5931\u8D25",
    applySuccess: "\u6A21\u677F\u5E94\u7528\u6210\u529F",
    preferenceSaved: "\u504F\u597D\u8BBE\u7F6E\u5DF2\u4FDD\u5B58"
  }
};
const enUS = {
  title: "Template Management",
  category: {
    login: "Login",
    dashboard: "Dashboard",
    error: "Error",
    profile: "Profile",
    settings: "Settings"
  },
  device: {
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile"
  },
  actions: {
    selectTemplate: "Select Template",
    previewTemplate: "Preview Template",
    applyTemplate: "Apply Template",
    loadMore: "Load More",
    clearCache: "Clear Cache",
    savePreference: "Save Preference"
  },
  messages: {
    loading: "Loading templates...",
    noTemplates: "No templates available",
    loadError: "Failed to load template",
    applySuccess: "Template applied successfully",
    preferenceSaved: "Preference saved"
  }
};
const jaJP = {
  title: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u7BA1\u7406",
  category: {
    login: "\u30ED\u30B0\u30A4\u30F3",
    dashboard: "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9",
    error: "\u30A8\u30E9\u30FC",
    profile: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB",
    settings: "\u8A2D\u5B9A"
  },
  device: {
    desktop: "\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7",
    tablet: "\u30BF\u30D6\u30EC\u30C3\u30C8",
    mobile: "\u30E2\u30D0\u30A4\u30EB"
  },
  actions: {
    selectTemplate: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u9078\u629E",
    previewTemplate: "\u30D7\u30EC\u30D3\u30E5\u30FC",
    applyTemplate: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u9069\u7528",
    loadMore: "\u3082\u3063\u3068\u8AAD\u307F\u8FBC\u3080",
    clearCache: "\u30AD\u30E3\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30A2",
    savePreference: "\u8A2D\u5B9A\u3092\u4FDD\u5B58"
  },
  messages: {
    loading: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",
    noTemplates: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u304C\u3042\u308A\u307E\u305B\u3093",
    loadError: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F",
    applySuccess: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u304C\u6B63\u5E38\u306B\u9069\u7528\u3055\u308C\u307E\u3057\u305F",
    preferenceSaved: "\u8A2D\u5B9A\u304C\u4FDD\u5B58\u3055\u308C\u307E\u3057\u305F"
  }
};
const locales = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": jaJP
};
function getLocale(locale) {
  return locales[locale] || enUS;
}
const supportedLocales = Object.keys(locales);

exports.enUS = enUS;
exports.getLocale = getLocale;
exports.jaJP = jaJP;
exports.locales = locales;
exports.supportedLocales = supportedLocales;
exports.zhCN = zhCN;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
