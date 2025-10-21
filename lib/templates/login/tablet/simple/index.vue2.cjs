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
  class: "login-tablet-simple"
};
const _hoisted_2 = {
  class: "simple-container"
};
const _hoisted_3 = {
  key: 0,
  class: "logo-area"
};
const _hoisted_4 = {
  class: "simple-title"
};
const _hoisted_5 = ["disabled"];
const _hoisted_6 = {
  key: 1,
  class: "simple-social"
};
const _hoisted_7 = {
  class: "social-row"
};
const _hoisted_8 = ["title", "onClick"];
const _hoisted_9 = {
  class: "simple-footer"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u767B\u5F55"
    },
    showLogo: {
      type: Boolean,
      required: false,
      default: false
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
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createElementVNode("div", _hoisted_2, [vue.createCommentVNode(" Logo \u63D2\u69FD\uFF08\u7B80\u5355\u7248\u672C\uFF09 "), _ctx.$slots.logo || _ctx.showLogo ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [vue.renderSlot(_ctx.$slots, "logo", {}, () => [_cache[2] || (_cache[2] = vue.createElementVNode(
        "div",
        {
          class: "simple-logo"
        },
        [vue.createElementVNode("svg", {
          width: "48",
          height: "48",
          viewBox: "0 0 48 48",
          fill: "#667eea"
        }, [vue.createElementVNode("rect", {
          x: "8",
          y: "8",
          width: "32",
          height: "32",
          rx: "8",
          opacity: "0.1"
        }), vue.createElementVNode("rect", {
          x: "16",
          y: "16",
          width: "16",
          height: "16",
          rx: "4",
          fill: "#667eea"
        })])],
        -1
        /* CACHED */
      ))])])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u5934\u90E8\u63D2\u69FD\uFF08\u7B80\u5316\u7248\uFF09 "), vue.renderSlot(_ctx.$slots, "header", {
        title: _ctx.title
      }, () => [vue.createElementVNode(
        "h1",
        _hoisted_4,
        vue.toDisplayString(_ctx.title),
        1
        /* TEXT */
      )]), vue.createCommentVNode(" \u767B\u5F55\u9762\u677F\u63D2\u69FD\uFF08\u6700\u7B80\u5316\uFF09 "), vue.renderSlot(_ctx.$slots, "loginPanel", {
        form,
        loading: loading.value,
        error: error.value,
        handleSubmit
      }, () => [vue.createElementVNode(
        "form",
        {
          class: "simple-form",
          onSubmit: vue.withModifiers(handleSubmit, ["prevent"])
        },
        [vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.username = $event),
            type: "text",
            placeholder: "\u7528\u6237\u540D",
            class: "simple-input",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelText, form.username]]), vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.password = $event),
            type: "password",
            placeholder: "\u5BC6\u7801",
            class: "simple-input",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vue.vModelText, form.password]]), vue.createElementVNode("button", {
          type: "submit",
          class: "simple-btn",
          disabled: loading.value
        }, vue.toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_5)],
        32
        /* NEED_HYDRATION */
      )]), vue.createCommentVNode(" \u793E\u4EA4\u767B\u5F55\u63D2\u69FD\uFF08\u7B80\u5316\u7248\uFF09 "), _ctx.$slots.socialLogin || _ctx.showSocialLogin ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [vue.renderSlot(_ctx.$slots, "socialLogin", {
        providers: _ctx.socialProviders
      }, () => [vue.createElementVNode("div", _hoisted_7, [(vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(_ctx.socialProviders, (provider) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: provider.name,
            class: "social-icon-btn",
            title: provider.label,
            onClick: ($event) => handleSocialLogin(provider)
          }, vue.toDisplayString(provider.label[0]), 9, _hoisted_8);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u5E95\u90E8\u63D2\u69FD\uFF08\u7B80\u5355\u94FE\u63A5\uFF09 "), vue.createElementVNode("div", _hoisted_9, [vue.renderSlot(_ctx.$slots, "footer", {}, () => [vue.createElementVNode("a", {
        href: "#",
        onClick: vue.withModifiers(handleForgot, ["prevent"])
      }, "\u5FD8\u8BB0\u5BC6\u7801"), _cache[3] || (_cache[3] = vue.createElementVNode(
        "span",
        {
          class: "separator"
        },
        "\xB7",
        -1
        /* CACHED */
      )), vue.createElementVNode("a", {
        href: "#",
        onClick: vue.withModifiers(handleRegister, ["prevent"])
      }, "\u6CE8\u518C")])]), vue.createCommentVNode(" \u989D\u5916\u5185\u5BB9\u63D2\u69FD "), vue.renderSlot(_ctx.$slots, "extra")])]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.cjs.map
