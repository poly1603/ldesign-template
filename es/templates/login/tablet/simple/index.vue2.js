/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, reactive, ref, createElementBlock, openBlock, createElementVNode, createCommentVNode, renderSlot, toDisplayString, withModifiers, withDirectives, vModelText, Fragment, renderList } from 'vue';

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
var script = /* @__PURE__ */ defineComponent({
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
      return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [createCommentVNode(" Logo \u63D2\u69FD\uFF08\u7B80\u5355\u7248\u672C\uFF09 "), _ctx.$slots.logo || _ctx.showLogo ? (openBlock(), createElementBlock("div", _hoisted_3, [renderSlot(_ctx.$slots, "logo", {}, () => [_cache[2] || (_cache[2] = createElementVNode(
        "div",
        {
          class: "simple-logo"
        },
        [createElementVNode("svg", {
          width: "48",
          height: "48",
          viewBox: "0 0 48 48",
          fill: "#667eea"
        }, [createElementVNode("rect", {
          x: "8",
          y: "8",
          width: "32",
          height: "32",
          rx: "8",
          opacity: "0.1"
        }), createElementVNode("rect", {
          x: "16",
          y: "16",
          width: "16",
          height: "16",
          rx: "4",
          fill: "#667eea"
        })])],
        -1
        /* CACHED */
      ))])])) : createCommentVNode("v-if", true), createCommentVNode(" \u5934\u90E8\u63D2\u69FD\uFF08\u7B80\u5316\u7248\uFF09 "), renderSlot(_ctx.$slots, "header", {
        title: _ctx.title
      }, () => [createElementVNode(
        "h1",
        _hoisted_4,
        toDisplayString(_ctx.title),
        1
        /* TEXT */
      )]), createCommentVNode(" \u767B\u5F55\u9762\u677F\u63D2\u69FD\uFF08\u6700\u7B80\u5316\uFF09 "), renderSlot(_ctx.$slots, "loginPanel", {
        form,
        loading: loading.value,
        error: error.value,
        handleSubmit
      }, () => [createElementVNode(
        "form",
        {
          class: "simple-form",
          onSubmit: withModifiers(handleSubmit, ["prevent"])
        },
        [withDirectives(createElementVNode(
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
        ), [[vModelText, form.username]]), withDirectives(createElementVNode(
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
        ), [[vModelText, form.password]]), createElementVNode("button", {
          type: "submit",
          class: "simple-btn",
          disabled: loading.value
        }, toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_5)],
        32
        /* NEED_HYDRATION */
      )]), createCommentVNode(" \u793E\u4EA4\u767B\u5F55\u63D2\u69FD\uFF08\u7B80\u5316\u7248\uFF09 "), _ctx.$slots.socialLogin || _ctx.showSocialLogin ? (openBlock(), createElementBlock("div", _hoisted_6, [renderSlot(_ctx.$slots, "socialLogin", {
        providers: _ctx.socialProviders
      }, () => [createElementVNode("div", _hoisted_7, [(openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(_ctx.socialProviders, (provider) => {
          return openBlock(), createElementBlock("button", {
            key: provider.name,
            class: "social-icon-btn",
            title: provider.label,
            onClick: ($event) => handleSocialLogin(provider)
          }, toDisplayString(provider.label[0]), 9, _hoisted_8);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])])) : createCommentVNode("v-if", true), createCommentVNode(" \u5E95\u90E8\u63D2\u69FD\uFF08\u7B80\u5355\u94FE\u63A5\uFF09 "), createElementVNode("div", _hoisted_9, [renderSlot(_ctx.$slots, "footer", {}, () => [createElementVNode("a", {
        href: "#",
        onClick: withModifiers(handleForgot, ["prevent"])
      }, "\u5FD8\u8BB0\u5BC6\u7801"), _cache[3] || (_cache[3] = createElementVNode(
        "span",
        {
          class: "separator"
        },
        "\xB7",
        -1
        /* CACHED */
      )), createElementVNode("a", {
        href: "#",
        onClick: withModifiers(handleRegister, ["prevent"])
      }, "\u6CE8\u518C")])]), createCommentVNode(" \u989D\u5916\u5185\u5BB9\u63D2\u69FD "), renderSlot(_ctx.$slots, "extra")])]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.js.map
