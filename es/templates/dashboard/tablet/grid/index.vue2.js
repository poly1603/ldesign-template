/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, createElementBlock, openBlock, createElementVNode, renderSlot, toDisplayString } from 'vue';

const _hoisted_1 = {
  class: "dashboard-tablet-grid"
};
const _hoisted_2 = {
  class: "container"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u7F51\u683C\u5E73\u677F\u4EEA\u8868\u677F"
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [createElementVNode(
        "h1",
        null,
        toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), _cache[0] || (_cache[0] = createElementVNode(
        "p",
        {
          class: "subtitle"
        },
        " \u7F51\u683C\u5E73\u677F\u4EEA\u8868\u677F ",
        -1
        /* CACHED */
      )), renderSlot(_ctx.$slots, "default")])]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.js.map
