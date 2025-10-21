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
  class: "login-mobile-default"
};
const _hoisted_2 = {
  key: 0,
  class: "logo-section"
};
const _hoisted_3 = {
  class: "login-header"
};
const _hoisted_4 = {
  key: 0,
  class: "subtitle"
};
const _hoisted_5 = {
  class: "form-group"
};
const _hoisted_6 = {
  class: "form-group"
};
const _hoisted_7 = ["disabled"];
const _hoisted_8 = {
  key: 1,
  class: "social-section"
};
const _hoisted_9 = {
  class: "social-buttons"
};
const _hoisted_10 = ["onClick"];
const _hoisted_11 = {
  class: "login-footer"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u767B\u5F55"
    },
    subtitle: {
      type: String,
      required: false,
      default: ""
    },
    showLogo: {
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
  emits: ["submit", "register", "forgot", "socialLogin"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const form = vue.reactive({
      username: "",
      password: ""
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
    const handleForgot = () => {
      emit("forgot");
    };
    const handleSocialLogin = (provider) => {
      emit("socialLogin", provider);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createCommentVNode(" Logo \u63D2\u69FD "), _ctx.$slots.logo || _ctx.showLogo ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [vue.renderSlot(_ctx.$slots, "logo", {}, () => [_cache[2] || (_cache[2] = vue.createElementVNode(
        "div",
        {
          class: "default-logo"
        },
        [vue.createElementVNode("svg", {
          width: "60",
          height: "60",
          viewBox: "0 0 60 60",
          fill: "white"
        }, [vue.createElementVNode("circle", {
          cx: "30",
          cy: "30",
          r: "25",
          opacity: "0.2"
        }), vue.createElementVNode("path", {
          d: "M30 15 L40 30 L30 45 L20 30 Z",
          fill: "white"
        })])],
        -1
        /* CACHED */
      ))])])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u5934\u90E8\u63D2\u69FD "), vue.createElementVNode("div", _hoisted_3, [vue.renderSlot(_ctx.$slots, "header", {
        title: _ctx.title
      }, () => [vue.createElementVNode(
        "h1",
        null,
        vue.toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), _ctx.subtitle ? (vue.openBlock(), vue.createElementBlock(
        "p",
        _hoisted_4,
        vue.toDisplayString(_ctx.subtitle),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true)])]), vue.createCommentVNode(" \u767B\u5F55\u9762\u677F\u63D2\u69FD "), vue.renderSlot(_ctx.$slots, "loginPanel", {
        form,
        loading: loading.value,
        error: error.value,
        handleSubmit
      }, () => [vue.createElementVNode(
        "form",
        {
          class: "login-form",
          onSubmit: vue.withModifiers(handleSubmit, ["prevent"])
        },
        [vue.createElementVNode("div", _hoisted_5, [vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.username = $event),
            type: "text",
            placeholder: "\u624B\u673A\u53F7/\u7528\u6237\u540D",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelText, form.username]])]), vue.createElementVNode("div", _hoisted_6, [vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.password = $event),
            type: "password",
            placeholder: "\u5BC6\u7801",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelText, form.password]])]), vue.createElementVNode("button", {
          type: "submit",
          class: "btn-login",
          disabled: loading.value
        }, vue.toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_7)],
        32
        /* NEED_HYDRATION */
      )]), vue.createCommentVNode(" \u793E\u4EA4\u767B\u5F55\u63D2\u69FD "), _ctx.$slots.socialLogin || _ctx.showSocialLogin ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [vue.renderSlot(_ctx.$slots, "socialLogin", {
        providers: _ctx.socialProviders
      }, () => [_cache[3] || (_cache[3] = vue.createElementVNode(
        "div",
        {
          class: "social-divider"
        },
        [vue.createElementVNode("span", null, "\u5176\u4ED6\u767B\u5F55\u65B9\u5F0F")],
        -1
        /* CACHED */
      )), vue.createElementVNode("div", _hoisted_9, [(vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(_ctx.socialProviders, (provider) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: provider.name,
            class: "social-btn",
            onClick: ($event) => handleSocialLogin(provider)
          }, vue.toDisplayString(provider.label), 9, _hoisted_10);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u5E95\u90E8\u63D2\u69FD "), vue.createElementVNode("div", _hoisted_11, [vue.renderSlot(_ctx.$slots, "footer", {}, () => [vue.createElementVNode("a", {
        href: "#",
        onClick: vue.withModifiers(handleRegister, ["prevent"])
      }, "\u6CE8\u518C\u8D26\u53F7"), _cache[4] || (_cache[4] = vue.createElementVNode(
        "span",
        {
          class: "divider"
        },
        "|",
        -1
        /* CACHED */
      )), vue.createElementVNode("a", {
        href: "#",
        onClick: vue.withModifiers(handleForgot, ["prevent"])
      }, "\u5FD8\u8BB0\u5BC6\u7801")])]), vue.createCommentVNode(" \u989D\u5916\u5185\u5BB9\u63D2\u69FD "), vue.renderSlot(_ctx.$slots, "extra")]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.cjs.map
