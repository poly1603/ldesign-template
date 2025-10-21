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

var vue = require('vue');

const _hoisted_1 = {
  class: "login-desktop-default"
};
const _hoisted_2 = {
  class: "login-container"
};
const _hoisted_3 = {
  key: 0,
  class: "login-logo"
};
const _hoisted_4 = {
  class: "login-header"
};
const _hoisted_5 = {
  class: "subtitle"
};
const _hoisted_6 = {
  class: "form-group"
};
const _hoisted_7 = {
  class: "form-group"
};
const _hoisted_8 = {
  key: 0,
  class: "form-group"
};
const _hoisted_9 = {
  class: "checkbox-label"
};
const _hoisted_10 = {
  class: "form-actions"
};
const _hoisted_11 = ["disabled"];
const _hoisted_12 = {
  key: 1,
  class: "social-section"
};
const _hoisted_13 = {
  class: "social-buttons"
};
const _hoisted_14 = ["onClick"];
const _hoisted_15 = {
  class: "login-footer"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u6B22\u8FCE\u767B\u5F55"
    },
    subtitle: {
      type: String,
      required: false,
      default: "LDesign \u6A21\u677F\u7CFB\u7EDF"
    },
    showLogo: {
      type: Boolean,
      required: false,
      default: true
    },
    showRememberMe: {
      type: Boolean,
      required: false,
      default: true
    },
    showSocialLogin: {
      type: Boolean,
      required: false,
      default: false
    },
    socialProviders: {
      type: Array,
      required: false,
      default: () => []
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    error: {
      type: [String, null],
      required: false,
      default: null
    }
  },
  emits: ["submit", "register", "forgotPassword", "socialLogin"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const form = vue.reactive({
      username: "",
      password: "",
      rememberMe: false
    });
    const loading = vue.ref(props.loading);
    const error = vue.ref(props.error);
    const handleSubmit = () => {
      emit("submit", {
        ...form
      });
    };
    const handleRegister = () => {
      emit("register");
    };
    const handleForgotPassword = () => {
      emit("forgotPassword");
    };
    const handleSocialLogin = (provider) => {
      emit("socialLogin", provider);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createElementVNode("div", _hoisted_2, [vue.createCommentVNode(" Logo \u63D2\u69FD "), _ctx.$slots.logo || _ctx.showLogo ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [vue.renderSlot(_ctx.$slots, "logo", {}, () => [_cache[3] || (_cache[3] = vue.createElementVNode(
        "div",
        {
          class: "default-logo"
        },
        [vue.createElementVNode("svg", {
          width: "48",
          height: "48",
          viewBox: "0 0 48 48",
          fill: "currentColor"
        }, [vue.createElementVNode("circle", {
          cx: "24",
          cy: "24",
          r: "20",
          opacity: "0.1"
        }), vue.createElementVNode("path", {
          d: "M24 12 L32 24 L24 36 L16 24 Z",
          fill: "currentColor"
        })])],
        -1
        /* CACHED */
      ))])])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u5934\u90E8\u63D2\u69FD "), vue.createElementVNode("div", _hoisted_4, [vue.renderSlot(_ctx.$slots, "header", {
        title: _ctx.title,
        subtitle: _ctx.subtitle
      }, () => [vue.createElementVNode(
        "h1",
        null,
        vue.toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), vue.createElementVNode(
        "p",
        _hoisted_5,
        vue.toDisplayString(_ctx.subtitle),
        1
        /* TEXT */
      )])]), vue.createCommentVNode(" \u767B\u5F55\u9762\u677F\u63D2\u69FD - \u6838\u5FC3\u63D2\u69FD "), vue.renderSlot(_ctx.$slots, "loginPanel", {
        form,
        loading: loading.value,
        error: error.value,
        handleSubmit
      }, () => [vue.createCommentVNode(" \u9ED8\u8BA4\u8868\u5355 "), vue.createElementVNode(
        "form",
        {
          class: "login-form",
          onSubmit: vue.withModifiers(handleSubmit, ["prevent"])
        },
        [vue.createElementVNode("div", _hoisted_6, [_cache[4] || (_cache[4] = vue.createElementVNode(
          "label",
          {
            for: "username"
          },
          "\u7528\u6237\u540D",
          -1
          /* CACHED */
        )), vue.withDirectives(vue.createElementVNode(
          "input",
          {
            id: "username",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.username = $event),
            type: "text",
            placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelText, form.username]])]), vue.createElementVNode("div", _hoisted_7, [_cache[5] || (_cache[5] = vue.createElementVNode(
          "label",
          {
            for: "password"
          },
          "\u5BC6\u7801",
          -1
          /* CACHED */
        )), vue.withDirectives(vue.createElementVNode(
          "input",
          {
            id: "password",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.password = $event),
            type: "password",
            placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelText, form.password]])]), _ctx.showRememberMe ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [vue.createElementVNode("label", _hoisted_9, [vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.rememberMe = $event),
            type: "checkbox"
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelCheckbox, form.rememberMe]]), _cache[6] || (_cache[6] = vue.createElementVNode(
          "span",
          null,
          "\u8BB0\u4F4F\u6211",
          -1
          /* CACHED */
        ))])])) : vue.createCommentVNode("v-if", true), vue.createElementVNode("div", _hoisted_10, [vue.createElementVNode("button", {
          type: "submit",
          class: "btn-primary",
          disabled: loading.value
        }, vue.toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_11)])],
        32
        /* NEED_HYDRATION */
      )]), vue.createCommentVNode(" \u793E\u4EA4\u767B\u5F55\u63D2\u69FD "), _ctx.$slots.socialLogin || _ctx.showSocialLogin ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [vue.renderSlot(_ctx.$slots, "socialLogin", {}, () => [_cache[7] || (_cache[7] = vue.createElementVNode(
        "div",
        {
          class: "social-divider"
        },
        [vue.createElementVNode("span", null, "\u6216")],
        -1
        /* CACHED */
      )), vue.createElementVNode("div", _hoisted_13, [(vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(_ctx.socialProviders, (provider) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: provider.name,
            class: "social-btn",
            onClick: ($event) => handleSocialLogin(provider)
          }, vue.toDisplayString(provider.label), 9, _hoisted_14);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u5E95\u90E8\u63D2\u69FD "), vue.createElementVNode("div", _hoisted_15, [vue.renderSlot(_ctx.$slots, "footer", {}, () => [vue.createElementVNode("p", null, [_cache[8] || (_cache[8] = vue.createTextVNode(
        "\u8FD8\u6CA1\u6709\u8D26\u53F7\uFF1F ",
        -1
        /* CACHED */
      )), vue.createElementVNode("a", {
        href: "#",
        onClick: vue.withModifiers(handleRegister, ["prevent"])
      }, "\u7ACB\u5373\u6CE8\u518C")]), vue.createElementVNode("p", null, [vue.createElementVNode("a", {
        href: "#",
        onClick: vue.withModifiers(handleForgotPassword, ["prevent"])
      }, "\u5FD8\u8BB0\u5BC6\u7801\uFF1F")])])]), vue.createCommentVNode(" \u989D\u5916\u5185\u5BB9\u63D2\u69FD "), vue.renderSlot(_ctx.$slots, "extra")])]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.cjs.map
