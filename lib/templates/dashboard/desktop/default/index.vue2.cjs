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
  class: "dashboard-desktop-default"
};
const _hoisted_2 = {
  class: "dashboard-header"
};
const _hoisted_3 = {
  class: "user-info"
};
const _hoisted_4 = {
  class: "dashboard-content"
};
const _hoisted_5 = {
  class: "main-content"
};
const _hoisted_6 = {
  class: "stats-grid"
};
const _hoisted_7 = {
  class: "stat-card"
};
const _hoisted_8 = {
  class: "stat-value"
};
const _hoisted_9 = {
  class: "stat-card"
};
const _hoisted_10 = {
  class: "stat-value"
};
const _hoisted_11 = {
  class: "stat-card"
};
const _hoisted_12 = {
  class: "stat-value"
};
const _hoisted_13 = {
  class: "stat-card"
};
const _hoisted_14 = {
  class: "stat-value"
};
const _hoisted_15 = {
  class: "content-area"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "index",
  props: {
    title: {
      type: String,
      required: false,
      default: "\u4EEA\u8868\u677F"
    },
    username: {
      type: String,
      required: false,
      default: "\u7528\u6237"
    },
    stats: {
      type: Object,
      required: false,
      default: () => ({
        visits: "12,345",
        users: "1,234",
        orders: "567",
        revenue: "89,012"
      })
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createElementVNode("header", _hoisted_2, [vue.createElementVNode(
        "h1",
        null,
        vue.toDisplayString(_ctx.title),
        1
        /* TEXT */
      ), vue.createElementVNode("div", _hoisted_3, [vue.createElementVNode(
        "span",
        null,
        vue.toDisplayString(_ctx.username),
        1
        /* TEXT */
      )])]), vue.createElementVNode("div", _hoisted_4, [_cache[5] || (_cache[5] = vue.createStaticVNode('<aside class="sidebar" data-v-911e0992><nav class="nav-menu" data-v-911e0992><a href="#" class="nav-item active" data-v-911e0992>\u6982\u89C8</a><a href="#" class="nav-item" data-v-911e0992>\u6570\u636E\u5206\u6790</a><a href="#" class="nav-item" data-v-911e0992>\u62A5\u8868</a><a href="#" class="nav-item" data-v-911e0992>\u8BBE\u7F6E</a></nav></aside>', 1)), vue.createElementVNode("main", _hoisted_5, [vue.createElementVNode("div", _hoisted_6, [vue.createElementVNode("div", _hoisted_7, [_cache[0] || (_cache[0] = vue.createElementVNode(
        "h3",
        null,
        "\u603B\u8BBF\u95EE\u91CF",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "p",
        _hoisted_8,
        vue.toDisplayString(_ctx.stats.visits),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_9, [_cache[1] || (_cache[1] = vue.createElementVNode(
        "h3",
        null,
        "\u6D3B\u8DC3\u7528\u6237",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "p",
        _hoisted_10,
        vue.toDisplayString(_ctx.stats.users),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_11, [_cache[2] || (_cache[2] = vue.createElementVNode(
        "h3",
        null,
        "\u8BA2\u5355\u6570",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "p",
        _hoisted_12,
        vue.toDisplayString(_ctx.stats.orders),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_13, [_cache[3] || (_cache[3] = vue.createElementVNode(
        "h3",
        null,
        "\u6536\u5165",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "p",
        _hoisted_14,
        " \xA5" + vue.toDisplayString(_ctx.stats.revenue),
        1
        /* TEXT */
      )])]), vue.createElementVNode("div", _hoisted_15, [vue.renderSlot(_ctx.$slots, "default", {}, () => [_cache[4] || (_cache[4] = vue.createElementVNode(
        "p",
        null,
        "\u8FD9\u91CC\u662F\u4EEA\u8868\u677F\u7684\u4E3B\u8981\u5185\u5BB9\u533A\u57DF",
        -1
        /* CACHED */
      ))])])])])]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.vue2.cjs.map
