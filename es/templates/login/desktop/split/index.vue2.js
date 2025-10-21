/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, reactive, ref, createElementBlock, openBlock, createCommentVNode, createElementVNode, normalizeStyle, renderSlot, toDisplayString, withModifiers, withDirectives, vModelText, vModelCheckbox, Fragment, renderList, createTextVNode } from 'vue';

const _hoisted_1 = {
  class: "login-desktop-split"
};
const _hoisted_2 = {
  class: "overlay"
};
const _hoisted_3 = {
  class: "brand"
};
const _hoisted_4 = {
  class: "slogan"
};
const _hoisted_5 = {
  class: "right-panel"
};
const _hoisted_6 = {
  class: "login-box"
};
const _hoisted_7 = {
  key: 0,
  class: "logo-area"
};
const _hoisted_8 = {
  class: "subtitle"
};
const _hoisted_9 = {
  class: "form-group"
};
const _hoisted_10 = {
  class: "form-group"
};
const _hoisted_11 = {
  class: "form-options"
};
const _hoisted_12 = {
  class: "checkbox"
};
const _hoisted_13 = ["disabled"];
const _hoisted_14 = {
  key: 1,
  class: "social-section"
};
const _hoisted_15 = {
  class: "social-buttons"
};
const _hoisted_16 = ["onClick"];
const _hoisted_17 = {
  class: "footer-text"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u6B22\u8FCE\u56DE\u6765"
    },
    subtitle: {
      type: String,
      required: false,
      default: "\u8BF7\u8F93\u5165\u60A8\u7684\u8D26\u53F7\u4FE1\u606F"
    },
    brandName: {
      type: String,
      required: false,
      default: "LDesign"
    },
    slogan: {
      type: String,
      required: false,
      default: "\u4E13\u4E1A\u7684\u6A21\u677F\u7BA1\u7406\u7CFB\u7EDF"
    },
    bgImage: {
      type: String,
      required: false,
      default: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800"
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
    const form = reactive({
      username: "",
      password: "",
      remember: false
    });
    const loading = ref(props.loading);
    const error = ref(props.error);
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
      return openBlock(), createElementBlock("div", _hoisted_1, [createCommentVNode(" \u5DE6\u4FA7\u9762\u677F "), createElementVNode(
        "div",
        {
          class: "left-panel",
          style: normalizeStyle({
            backgroundImage: `url(${_ctx.bgImage})`
          })
        },
        [renderSlot(_ctx.$slots, "leftPanel", {
          brand: _ctx.brandName,
          slogan: _ctx.slogan
        }, () => [createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "brand", {}, () => [createElementVNode(
          "h1",
          _hoisted_3,
          toDisplayString(_ctx.brandName),
          1
          /* TEXT */
        ), createElementVNode(
          "p",
          _hoisted_4,
          toDisplayString(_ctx.slogan),
          1
          /* TEXT */
        )]), createCommentVNode(" \u5DE6\u4FA7\u989D\u5916\u5185\u5BB9 "), renderSlot(_ctx.$slots, "leftExtra")])])],
        4
        /* STYLE */
      ), createCommentVNode(" \u53F3\u4FA7\u767B\u5F55\u533A\u57DF "), createElementVNode("div", _hoisted_5, [createElementVNode("div", _hoisted_6, [createCommentVNode(" Logo \u63D2\u69FD "), _ctx.$slots.logo || _ctx.showLogo ? (openBlock(), createElementBlock("div", _hoisted_7, [renderSlot(_ctx.$slots, "logo", {}, () => [_cache[3] || (_cache[3] = createElementVNode(
        "div",
        {
          class: "default-logo"
        },
        [createElementVNode("svg", {
          width: "40",
          height: "40",
          viewBox: "0 0 40 40",
          fill: "currentColor"
        }, [createElementVNode("circle", {
          cx: "20",
          cy: "20",
          r: "18",
          opacity: "0.1"
        }), createElementVNode("path", {
          d: "M20 10 L28 20 L20 30 L12 20 Z",
          fill: "currentColor"
        })])],
        -1
        /* CACHED */
      ))])])) : createCommentVNode("v-if", true), createCommentVNode(" \u6807\u9898\u533A\u57DF "), renderSlot(_ctx.$slots, "header", {
        title: _ctx.title,
        subtitle: _ctx.subtitle
      }, () => [createElementVNode(
        "h2",
        null,
        toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), createElementVNode(
        "p",
        _hoisted_8,
        toDisplayString(_ctx.subtitle),
        1
        /* TEXT */
      )]), createCommentVNode(" \u767B\u5F55\u9762\u677F\u63D2\u69FD "), renderSlot(_ctx.$slots, "loginPanel", {
        form,
        loading: loading.value,
        error: error.value,
        handleSubmit
      }, () => [createElementVNode(
        "form",
        {
          class: "login-form",
          onSubmit: withModifiers(handleSubmit, ["prevent"])
        },
        [createElementVNode("div", _hoisted_9, [withDirectives(createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.username = $event),
            type: "text",
            placeholder: "\u7528\u6237\u540D\u6216\u90AE\u7BB1",
            required: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vModelText, form.username]])]), createElementVNode("div", _hoisted_10, [withDirectives(createElementVNode(
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
        ), [[vModelText, form.password]])]), createElementVNode("div", _hoisted_11, [createElementVNode("label", _hoisted_12, [withDirectives(createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.remember = $event),
            type: "checkbox"
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vModelCheckbox, form.remember]]), _cache[4] || (_cache[4] = createElementVNode(
          "span",
          null,
          "\u8BB0\u4F4F\u6211",
          -1
          /* CACHED */
        ))]), createElementVNode("a", {
          href: "#",
          class: "forgot-link",
          onClick: withModifiers(handleForgot, ["prevent"])
        }, "\u5FD8\u8BB0\u5BC6\u7801\uFF1F")]), createElementVNode("button", {
          type: "submit",
          class: "btn-submit",
          disabled: loading.value
        }, toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_13)],
        32
        /* NEED_HYDRATION */
      )]), createCommentVNode(" \u793E\u4EA4\u767B\u5F55\u63D2\u69FD "), _ctx.$slots.socialLogin || _ctx.showSocialLogin ? (openBlock(), createElementBlock("div", _hoisted_14, [renderSlot(_ctx.$slots, "socialLogin", {
        providers: _ctx.socialProviders
      }, () => [_cache[5] || (_cache[5] = createElementVNode(
        "div",
        {
          class: "divider"
        },
        [createElementVNode("span", null, "\u6216")],
        -1
        /* CACHED */
      )), createElementVNode("div", _hoisted_15, [(openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(_ctx.socialProviders, (provider) => {
          return openBlock(), createElementBlock("button", {
            key: provider.name,
            class: "social-btn",
            onClick: ($event) => handleSocialLogin(provider)
          }, toDisplayString(provider.label), 9, _hoisted_16);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])])) : createCommentVNode("v-if", true), createCommentVNode(" \u5E95\u90E8\u63D2\u69FD "), createElementVNode("div", _hoisted_17, [renderSlot(_ctx.$slots, "footer", {}, () => [_cache[6] || (_cache[6] = createTextVNode(
        " \u8FD8\u6CA1\u6709\u8D26\u53F7\uFF1F ",
        -1
        /* CACHED */
      )), createElementVNode("a", {
        href: "#",
        onClick: withModifiers(handleRegister, ["prevent"])
      }, "\u7ACB\u5373\u6CE8\u518C")])]), createCommentVNode(" \u989D\u5916\u5185\u5BB9 "), renderSlot(_ctx.$slots, "extra")])])]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.js.map
