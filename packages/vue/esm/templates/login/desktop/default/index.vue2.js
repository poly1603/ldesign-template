/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, ref, createElementBlock, openBlock, createElementVNode, createCommentVNode, toDisplayString, withModifiers, withDirectives, vModelText } from 'vue';

const _hoisted_1 = {
  class: "login-template"
};
const _hoisted_2 = {
  class: "login-container"
};
const _hoisted_3 = {
  class: "login-header"
};
const _hoisted_4 = ["src"];
const _hoisted_5 = {
  class: "login-title"
};
const _hoisted_6 = {
  class: "form-group"
};
const _hoisted_7 = ["disabled"];
const _hoisted_8 = {
  class: "form-group"
};
const _hoisted_9 = ["disabled"];
const _hoisted_10 = ["disabled"];
var script = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u6B22\u8FCE\u767B\u5F55"
    },
    logo: {
      type: String,
      required: false
    },
    onSubmit: {
      type: Function,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const username = ref("");
    const password = ref("");
    const loading = ref(false);
    async function handleSubmit() {
      if (!username.value || !password.value) {
        alert("\u8BF7\u8F93\u5165\u7528\u6237\u540D\u548C\u5BC6\u7801");
        return;
      }
      loading.value = true;
      try {
        await props.onSubmit?.({
          username: username.value,
          password: password.value
        });
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [_ctx.logo ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: _ctx.logo,
        alt: "Logo",
        class: "login-logo"
      }, null, 8, _hoisted_4)) : createCommentVNode("v-if", true), createElementVNode(
        "h1",
        _hoisted_5,
        toDisplayString(_ctx.title),
        1
        /* TEXT */
      )]), createElementVNode(
        "form",
        {
          class: "login-form",
          onSubmit: withModifiers(handleSubmit, ["prevent"])
        },
        [createElementVNode("div", _hoisted_6, [_cache[2] || (_cache[2] = createElementVNode(
          "label",
          {
            for: "username"
          },
          "\u7528\u6237\u540D",
          -1
          /* HOISTED */
        )), withDirectives(createElementVNode("input", {
          id: "username",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => username.value = $event),
          type: "text",
          placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
          disabled: loading.value
        }, null, 8, _hoisted_7), [[vModelText, username.value]])]), createElementVNode("div", _hoisted_8, [_cache[3] || (_cache[3] = createElementVNode(
          "label",
          {
            for: "password"
          },
          "\u5BC6\u7801",
          -1
          /* HOISTED */
        )), withDirectives(createElementVNode("input", {
          id: "password",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => password.value = $event),
          type: "password",
          placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
          disabled: loading.value
        }, null, 8, _hoisted_9), [[vModelText, password.value]])]), createElementVNode("button", {
          type: "submit",
          class: "login-button",
          disabled: loading.value
        }, toDisplayString(loading.value ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"), 9, _hoisted_10)],
        32
        /* NEED_HYDRATION */
      )])]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.js.map
