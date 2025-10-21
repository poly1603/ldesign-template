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
  class: "dashboard-tablet-default"
};
const _hoisted_2 = {
  class: "container"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u5E73\u677F\u4EEA\u8868\u677F"
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createElementVNode("div", _hoisted_2, [vue.createElementVNode(
        "h1",
        null,
        vue.toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), _cache[0] || (_cache[0] = vue.createElementVNode(
        "p",
        {
          class: "subtitle"
        },
        " \u5E73\u677F\u4EEA\u8868\u677F ",
        -1
        /* CACHED */
      )), vue.renderSlot(_ctx.$slots, "default")])]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.cjs.map
