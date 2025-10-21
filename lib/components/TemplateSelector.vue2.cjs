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
var useTemplate = require('../composables/useTemplate.cjs');
require('../composables/useTemplateDebugger.cjs');
require('../core/loader.cjs');
require('../core/scanner.cjs');
var index = require('../locales/index.cjs');
var useTemplatePlugin = require('../plugin/useTemplatePlugin.cjs');

const _hoisted_1 = ["title"];
const _hoisted_2 = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor"
};
const _hoisted_3 = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor"
};
const _hoisted_4 = {
  key: 0,
  class: "selector-panel"
};
const _hoisted_5 = {
  class: "panel-header"
};
const _hoisted_6 = {
  class: "current-info"
};
const _hoisted_7 = {
  class: "badge"
};
const _hoisted_8 = {
  class: "badge"
};
const _hoisted_9 = {
  class: "template-list"
};
const _hoisted_10 = ["onClick"];
const _hoisted_11 = {
  class: "template-name"
};
const _hoisted_12 = {
  key: 0,
  class: "default-badge"
};
const _hoisted_13 = {
  key: 0,
  class: "template-desc"
};
const _hoisted_14 = {
  key: 0,
  class: "empty-state"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "TemplateSelector",
  props: {
    category: {
      type: String,
      required: true
    },
    device: {
      type: String,
      required: true
    },
    currentTemplate: {
      type: String,
      required: true
    }
  },
  emits: ["select"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const expanded = vue.ref(false);
    const plugin = useTemplatePlugin.useTemplatePlugin();
    const locale = plugin?.currentLocale || vue.inject("locale", vue.ref("zh-CN"));
    const messages = vue.computed(() => {
      const localeValue = typeof locale.value === "string" ? locale.value : "zh-CN";
      return index.getLocale(localeValue);
    });
    const {
      templates: allTemplates
    } = useTemplate.useTemplateList();
    const templates = vue.computed(() => {
      return allTemplates.value.filter((t) => t.category === props.category && t.device === props.device);
    });
    const deviceLabel = vue.computed(() => {
      return messages.value.device[props.device] || props.device;
    });
    const toggleExpanded = () => {
      expanded.value = !expanded.value;
    };
    const selectTemplate = (templateName) => {
      emit("select", templateName);
      expanded.value = false;
    };
    vue.watch(() => props.device, () => {
      expanded.value = false;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock(
        "div",
        {
          class: vue.normalizeClass(["template-selector", {
            expanded: expanded.value
          }])
        },
        [vue.createCommentVNode(" \u5207\u6362\u6309\u94AE "), vue.createElementVNode("button", {
          class: "toggle-btn",
          title: expanded.value ? messages.value.actions.clearCache : messages.value.actions.selectTemplate,
          onClick: toggleExpanded
        }, [!expanded.value ? (vue.openBlock(), vue.createElementBlock("svg", _hoisted_2, [..._cache[0] || (_cache[0] = [vue.createElementVNode(
          "path",
          {
            d: "M4 6h16M4 12h16M4 18h16",
            "stroke-width": "2",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )])])) : (vue.openBlock(), vue.createElementBlock("svg", _hoisted_3, [..._cache[1] || (_cache[1] = [vue.createElementVNode(
          "path",
          {
            d: "M6 18L18 6M6 6l12 12",
            "stroke-width": "2",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )])]))], 8, _hoisted_1), vue.createCommentVNode(" \u9009\u62E9\u5668\u9762\u677F "), expanded.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [vue.createElementVNode("div", _hoisted_5, [vue.createElementVNode(
          "h3",
          null,
          vue.toDisplayString(messages.value.actions.selectTemplate),
          1
          /* TEXT */
        ), vue.createElementVNode("div", _hoisted_6, [vue.createElementVNode(
          "span",
          _hoisted_7,
          vue.toDisplayString(deviceLabel.value),
          1
          /* TEXT */
        ), vue.createElementVNode(
          "span",
          _hoisted_8,
          vue.toDisplayString(messages.value.category[_ctx.category] || _ctx.category),
          1
          /* TEXT */
        )])]), vue.createElementVNode("div", _hoisted_9, [(vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(templates.value, (template) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: template.name,
              class: vue.normalizeClass(["template-item", {
                active: template.name === _ctx.currentTemplate
              }]),
              onClick: ($event) => selectTemplate(template.name)
            }, [vue.createElementVNode("div", _hoisted_11, [vue.createTextVNode(
              vue.toDisplayString(template.displayName) + " ",
              1
              /* TEXT */
            ), template.isDefault ? (vue.openBlock(), vue.createElementBlock(
              "span",
              _hoisted_12,
              vue.toDisplayString(messages.value.device.desktop === "\u684C\u9762\u7AEF" ? "\u9ED8\u8BA4" : "Default"),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)]), template.description ? (vue.openBlock(), vue.createElementBlock(
              "div",
              _hoisted_13,
              vue.toDisplayString(template.description),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)], 10, _hoisted_10);
          }),
          128
          /* KEYED_FRAGMENT */
        )), templates.value.length === 0 ? (vue.openBlock(), vue.createElementBlock(
          "div",
          _hoisted_14,
          vue.toDisplayString(messages.value.messages.noTemplates),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true)])])) : vue.createCommentVNode("v-if", true)],
        2
        /* CLASS */
      );
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateSelector.vue2.cjs.map
