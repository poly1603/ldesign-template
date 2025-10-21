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

Object.defineProperty(exports, '__esModule', { value: true });

var config = {
  name: "default",
  displayName: "\u9ED8\u8BA4\u767B\u5F55\u9875",
  description: "\u7B80\u6D01\u5927\u65B9\u7684\u684C\u9762\u7AEF\u767B\u5F55\u9875\u9762\uFF0C\u652F\u6301\u63D2\u69FD\u5B9A\u5236",
  version: "1.1.0",
  author: "LDesign Team",
  tags: ["login", "desktop", "default", "simple", "slots"],
  isDefault: true,
  preview: "/previews/login-desktop-default.png",
  lastModified: Date.now(),
  // 支持的插槽
  slots: {
    logo: {
      name: "logo",
      description: "\u81EA\u5B9A\u4E49 Logo \u533A\u57DF",
      required: false
    },
    header: {
      name: "header",
      description: "\u81EA\u5B9A\u4E49\u6807\u9898\u533A\u57DF",
      props: {
        title: "\u4F20\u5165\u7684\u6807\u9898",
        subtitle: "\u4F20\u5165\u7684\u526F\u6807\u9898"
      }
    },
    loginPanel: {
      name: "loginPanel",
      description: "\u6838\u5FC3\u63D2\u69FD - \u5B8C\u5168\u81EA\u5B9A\u4E49\u767B\u5F55\u9762\u677F",
      props: {
        form: "\u8868\u5355\u6570\u636E\u5BF9\u8C61",
        loading: "\u52A0\u8F7D\u72B6\u6001",
        error: "\u9519\u8BEF\u4FE1\u606F",
        handleSubmit: "\u63D0\u4EA4\u51FD\u6570"
      }
    },
    socialLogin: {
      name: "socialLogin",
      description: "\u793E\u4EA4\u767B\u5F55\u533A\u57DF",
      required: false
    },
    footer: {
      name: "footer",
      description: "\u5E95\u90E8\u94FE\u63A5\u533A\u57DF",
      required: false
    },
    extra: {
      name: "extra",
      description: "\u989D\u5916\u5185\u5BB9\u533A\u57DF",
      required: false
    }
  }
};

exports.default = config;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=config.cjs.map
