/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const config = {
  name: "simple",
  displayName: "\u7B80\u6D01\u5E73\u677F\u767B\u5F55",
  description: "\u7B80\u6D01\u5E73\u677F\u767B\u5F55\u6A21\u677F",
  version: "1.0.0",
  author: "LDesign Team",
  tags: ["login", "tablet", "simple"],
  isDefault: false,
  preview: "/previews/login-tablet-simple.png",
  lastModified: Date.now(),
  slots: [{
    name: "logo",
    description: "\u54C1\u724Clogo\u533A\u57DF",
    props: ["showLogo"]
  }, {
    name: "header",
    description: "\u5934\u90E8\u4FE1\u606F\u533A\u57DF",
    props: ["title", "subtitle"]
  }, {
    name: "loginPanel",
    description: "\u767B\u5F55\u9762\u677F\u4E3B\u4F53\u5185\u5BB9",
    props: ["onSubmit", "loading", "error"]
  }, {
    name: "socialLogin",
    description: "\u793E\u4EA4\u767B\u5F55\u533A\u57DF",
    props: ["providers"]
  }, {
    name: "footer",
    description: "\u5E95\u90E8\u4FE1\u606F\u533A\u57DF",
    props: ["copyrightYear", "companyName"]
  }, {
    name: "extra",
    description: "\u989D\u5916\u81EA\u5B9A\u4E49\u533A\u57DF"
  }]
};

export { config as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=config.js.map
