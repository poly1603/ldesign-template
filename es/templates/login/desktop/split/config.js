/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
var config = {
  name: "split",
  displayName: "\u5206\u5272\u5F0F\u767B\u5F55\u9875",
  description: "\u5DE6\u53F3\u5206\u5272\u5F0F\u5E03\u5C40\u7684\u767B\u5F55\u9875\u9762\uFF0C\u652F\u6301\u63D2\u69FD\u5B9A\u5236",
  version: "1.1.0",
  author: "LDesign Team",
  tags: ["login", "desktop", "split", "modern", "slots"],
  isDefault: false,
  preview: "/previews/login-desktop-split.png",
  lastModified: Date.now(),
  // 支持的插槽
  slots: {
    leftPanel: {
      name: "leftPanel",
      description: "\u5DE6\u4FA7\u9762\u677F\u5185\u5BB9",
      props: {
        brand: "\u54C1\u724C\u540D\u79F0",
        slogan: "\u5BA3\u4F20\u6807\u8BED"
      }
    },
    brand: {
      name: "brand",
      description: "\u54C1\u724C\u4FE1\u606F\u533A\u57DF",
      required: false
    },
    leftExtra: {
      name: "leftExtra",
      description: "\u5DE6\u4FA7\u989D\u5916\u5185\u5BB9",
      required: false
    },
    logo: {
      name: "logo",
      description: "\u53F3\u4FA7 Logo \u533A\u57DF",
      required: false
    },
    header: {
      name: "header",
      description: "\u6807\u9898\u533A\u57DF",
      props: {
        title: "\u6807\u9898",
        subtitle: "\u526F\u6807\u9898"
      }
    },
    loginPanel: {
      name: "loginPanel",
      description: "\u6838\u5FC3\u63D2\u69FD - \u81EA\u5B9A\u4E49\u767B\u5F55\u9762\u677F",
      props: {
        form: "\u8868\u5355\u6570\u636E",
        loading: "\u52A0\u8F7D\u72B6\u6001",
        error: "\u9519\u8BEF\u4FE1\u606F",
        handleSubmit: "\u63D0\u4EA4\u51FD\u6570"
      }
    },
    socialLogin: {
      name: "socialLogin",
      description: "\u793E\u4EA4\u767B\u5F55\u533A\u57DF",
      props: {
        providers: "\u793E\u4EA4\u767B\u5F55\u63D0\u4F9B\u5546\u5217\u8868"
      }
    },
    footer: {
      name: "footer",
      description: "\u5E95\u90E8\u94FE\u63A5\u533A\u57DF",
      required: false
    },
    extra: {
      name: "extra",
      description: "\u989D\u5916\u5185\u5BB9",
      required: false
    }
  }
};

export { config as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=config.js.map
