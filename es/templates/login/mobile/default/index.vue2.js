/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, reactive, ref, createElementBlock, openBlock, createCommentVNode, createElementVNode, renderSlot, toDisplayString, withModifiers, withDirectives, vModelText, Fragment, renderList } from 'vue';

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
var script = /* @__PURE__ */ defineComponent({
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
    const form = reactive({
      username: "",
      password: ""
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
      return openBlock(), createElementBlock("div", _hoisted_1, [createCommentVNode(" Logo \u63D2\u69FD "), _ctx.$slots.logo || _ctx.showLogo ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "logo", {}, () => [_cache[2] || (_cache[2] = createElementVNode(
        "div",
        {
          class: "default-logo"
        },
        [createElementVNode("svg", {
          width: "60",
          height: "60",
          viewBox: "0 0 60 60",
          fill: "white"
        }, [createElementVNode("circle", {
          cx: "30",
          cy: "30",
          r: "25",
          opacity: "0.2"
        }), createElementVNode("path", {
          d: "M30 15 L40 30 L30 45 L20 30 Z",
          fill: "white"
        })])],
        -1
        /* CACHED */
      ))])])) : createCommentVNode("v-if", true), createCommentVNode(" \u5934\u90E8\u63D2\u69FD "), createElementVNode("div", _hoisted_3, [renderSlot(_ctx.$slots, "header", {
        title: _ctx.title
      }, () => [createElementVNode(
        "h1",
        null,
        toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), _ctx.subtitle ? (openBlock(), createElementBlock(
        "p",
        _hoisted_4,
        toDisplayString(_ctx.subtitle),
        1
        /* TEXT */
      )) : createCommentVNode("v-if", true)])]), createCommentVNode(" \u767B\u5F55\u9762\u677F\u63D2\u69FD "), renderSlot(_ctx.$slots, "loginPanel", {
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
        [createElementVNode("div", _hoisted_5, [withDirectives(createElementVNode(
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
        ), [[vModelText, form.username]])]), createElementVNode("div", _hoisted_6, [withDirectives(createElementVNode(
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
        ), [[vModelText, form.password]])]), createElementVNode("button", {
          type: "submit",
          class: "btn-login",
          disabled: loading.value
        }, toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_7)],
        32
        /* NEED_HYDRATION */
      )]), createCommentVNode(" \u793E\u4EA4\u767B\u5F55\u63D2\u69FD "), _ctx.$slots.socialLogin || _ctx.showSocialLogin ? (openBlock(), createElementBlock("div", _hoisted_8, [renderSlot(_ctx.$slots, "socialLogin", {
        providers: _ctx.socialProviders
      }, () => [_cache[3] || (_cache[3] = createElementVNode(
        "div",
        {
          class: "social-divider"
        },
        [createElementVNode("span", null, "\u5176\u4ED6\u767B\u5F55\u65B9\u5F0F")],
        -1
        /* CACHED */
      )), createElementVNode("div", _hoisted_9, [(openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(_ctx.socialProviders, (provider) => {
          return openBlock(), createElementBlock("button", {
            key: provider.name,
            class: "social-btn",
            onClick: ($event) => handleSocialLogin(provider)
          }, toDisplayString(provider.label), 9, _hoisted_10);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])])) : createCommentVNode("v-if", true), createCommentVNode(" \u5E95\u90E8\u63D2\u69FD "), createElementVNode("div", _hoisted_11, [renderSlot(_ctx.$slots, "footer", {}, () => [createElementVNode("a", {
        href: "#",
        onClick: withModifiers(handleRegister, ["prevent"])
      }, "\u6CE8\u518C\u8D26\u53F7"), _cache[4] || (_cache[4] = createElementVNode(
        "span",
        {
          class: "divider"
        },
        "|",
        -1
        /* CACHED */
      )), createElementVNode("a", {
        href: "#",
        onClick: withModifiers(handleForgot, ["prevent"])
      }, "\u5FD8\u8BB0\u5BC6\u7801")])]), createCommentVNode(" \u989D\u5916\u5185\u5BB9\u63D2\u69FD "), renderSlot(_ctx.$slots, "extra")]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.js.map
