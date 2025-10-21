/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, ref, inject, computed, watch, createElementBlock, openBlock, normalizeClass, createCommentVNode, createElementVNode, toDisplayString, Fragment, renderList, createTextVNode } from 'vue';
import { useTemplateList } from '../composables/useTemplate.js';
import '../composables/useTemplateDebugger.js';
import '../core/loader.js';
import '../core/scanner.js';
import { getLocale } from '../locales/index.js';
import { useTemplatePlugin } from '../plugin/useTemplatePlugin.js';

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
var script = /* @__PURE__ */ defineComponent({
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
    const expanded = ref(false);
    const plugin = useTemplatePlugin();
    const locale = plugin?.currentLocale || inject("locale", ref("zh-CN"));
    const messages = computed(() => {
      const localeValue = typeof locale.value === "string" ? locale.value : "zh-CN";
      return getLocale(localeValue);
    });
    const {
      templates: allTemplates
    } = useTemplateList();
    const templates = computed(() => {
      return allTemplates.value.filter((t) => t.category === props.category && t.device === props.device);
    });
    const deviceLabel = computed(() => {
      return messages.value.device[props.device] || props.device;
    });
    const toggleExpanded = () => {
      expanded.value = !expanded.value;
    };
    const selectTemplate = (templateName) => {
      emit("select", templateName);
      expanded.value = false;
    };
    watch(() => props.device, () => {
      expanded.value = false;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          class: normalizeClass(["template-selector", {
            expanded: expanded.value
          }])
        },
        [createCommentVNode(" \u5207\u6362\u6309\u94AE "), createElementVNode("button", {
          class: "toggle-btn",
          title: expanded.value ? messages.value.actions.clearCache : messages.value.actions.selectTemplate,
          onClick: toggleExpanded
        }, [!expanded.value ? (openBlock(), createElementBlock("svg", _hoisted_2, [..._cache[0] || (_cache[0] = [createElementVNode(
          "path",
          {
            d: "M4 6h16M4 12h16M4 18h16",
            "stroke-width": "2",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )])])) : (openBlock(), createElementBlock("svg", _hoisted_3, [..._cache[1] || (_cache[1] = [createElementVNode(
          "path",
          {
            d: "M6 18L18 6M6 6l12 12",
            "stroke-width": "2",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )])]))], 8, _hoisted_1), createCommentVNode(" \u9009\u62E9\u5668\u9762\u677F "), expanded.value ? (openBlock(), createElementBlock("div", _hoisted_4, [createElementVNode("div", _hoisted_5, [createElementVNode(
          "h3",
          null,
          toDisplayString(messages.value.actions.selectTemplate),
          1
          /* TEXT */
        ), createElementVNode("div", _hoisted_6, [createElementVNode(
          "span",
          _hoisted_7,
          toDisplayString(deviceLabel.value),
          1
          /* TEXT */
        ), createElementVNode(
          "span",
          _hoisted_8,
          toDisplayString(messages.value.category[_ctx.category] || _ctx.category),
          1
          /* TEXT */
        )])]), createElementVNode("div", _hoisted_9, [(openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList(templates.value, (template) => {
            return openBlock(), createElementBlock("div", {
              key: template.name,
              class: normalizeClass(["template-item", {
                active: template.name === _ctx.currentTemplate
              }]),
              onClick: ($event) => selectTemplate(template.name)
            }, [createElementVNode("div", _hoisted_11, [createTextVNode(
              toDisplayString(template.displayName) + " ",
              1
              /* TEXT */
            ), template.isDefault ? (openBlock(), createElementBlock(
              "span",
              _hoisted_12,
              toDisplayString(messages.value.device.desktop === "\u684C\u9762\u7AEF" ? "\u9ED8\u8BA4" : "Default"),
              1
              /* TEXT */
            )) : createCommentVNode("v-if", true)]), template.description ? (openBlock(), createElementBlock(
              "div",
              _hoisted_13,
              toDisplayString(template.description),
              1
              /* TEXT */
            )) : createCommentVNode("v-if", true)], 10, _hoisted_10);
          }),
          128
          /* KEYED_FRAGMENT */
        )), templates.value.length === 0 ? (openBlock(), createElementBlock(
          "div",
          _hoisted_14,
          toDisplayString(messages.value.messages.noTemplates),
          1
          /* TEXT */
        )) : createCommentVNode("v-if", true)])])) : createCommentVNode("v-if", true)],
        2
        /* CLASS */
      );
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateSelector.vue2.js.map
