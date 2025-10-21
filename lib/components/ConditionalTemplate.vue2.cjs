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
var useTemplateCondition = require('../composables/useTemplateCondition.cjs');
require('./TemplateRenderer.vue.cjs');
require('./TemplateSkeleton.vue.cjs');
var TemplateSkeleton_vue_vue_type_script_setup_true_lang = require('./TemplateSkeleton.vue2.cjs');
var TemplateRenderer_vue_vue_type_script_setup_true_lang = require('./TemplateRenderer.vue2.cjs');

const _hoisted_1 = {
  class: "conditional-template"
};
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "evaluating-message"
};
const _hoisted_4 = {
  class: "default-content"
};
const _hoisted_5 = {
  key: 1,
  class: "no-template"
};
const _hoisted_6 = {
  key: 3,
  class: "debug-info"
};
const _hoisted_7 = {
  class: "debug-content"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "ConditionalTemplate",
  props: {
    conditions: {
      type: Array,
      required: false,
      default: () => []
    },
    context: {
      type: Object,
      required: false,
      default: () => ({})
    },
    defaultTemplate: {
      type: String,
      required: false
    },
    data: {
      type: null,
      required: false
    },
    customComponents: {
      type: Object,
      required: false
    },
    showSkeleton: {
      type: Boolean,
      required: false,
      default: true
    },
    showDebug: {
      type: Boolean,
      required: false,
      default: false
    },
    enableSkeleton: {
      type: Boolean,
      required: false,
      default: true
    },
    enableCache: {
      type: Boolean,
      required: false,
      default: true
    },
    enableRetry: {
      type: Boolean,
      required: false,
      default: true
    },
    enableAutoSave: {
      type: Boolean,
      required: false,
      default: false
    },
    enableVModel: {
      type: Boolean,
      required: false,
      default: false
    },
    forceRefreshKey: {
      type: Number,
      required: false,
      default: 0
    }
  },
  emits: ["templateSelected", "rendered", "error", "save", "evaluationComplete"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const {
      selectedTemplate,
      evaluating,
      lastEvaluation,
      context,
      // selectTemplate, // Removing unused variable
      reevaluate
    } = useTemplateCondition.useTemplateCondition(props.conditions, props.context);
    const templateKey = vue.ref(0);
    const handleReevaluate = async () => {
      const template = await reevaluate();
      templateKey.value++;
      emit("evaluationComplete", template);
    };
    const handleRendered = (data) => {
      emit("rendered", data);
    };
    const handleError = (error) => {
      emit("error", error);
    };
    const handleSave = (data) => {
      emit("save", data);
    };
    const watchers = [];
    watchers.push(vue.watch(() => props.conditions, async (_newConditions) => {
      await handleReevaluate();
    }, {
      deep: true
    }));
    watchers.push(vue.watch(() => props.context, (newContext) => {
      context.value = newContext;
    }, {
      deep: true
    }));
    watchers.push(vue.watch(() => props.forceRefreshKey, () => {
      templateKey.value++;
    }));
    watchers.push(vue.watch(selectedTemplate, (template) => {
      emit("templateSelected", template);
    }));
    vue.onMounted(() => {
      if (props.context && Object.keys(props.context).length > 0) {
        context.value = props.context;
      }
    });
    vue.onUnmounted(() => {
      watchers.forEach((unwatch) => unwatch());
      watchers.length = 0;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createCommentVNode(" \u52A0\u8F7D\u72B6\u6001 "), vue.unref(evaluating) && !vue.unref(selectedTemplate) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [vue.renderSlot(_ctx.$slots, "loading", {}, () => [_ctx.showSkeleton ? (vue.openBlock(), vue.createBlock(TemplateSkeleton_vue_vue_type_script_setup_true_lang.default, {
        key: 0
      })) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, " \u6B63\u5728\u9009\u62E9\u6700\u4F73\u6A21\u677F... "))])])) : vue.unref(selectedTemplate) ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 1
        },
        [vue.createCommentVNode(" \u6E32\u67D3\u9009\u4E2D\u7684\u6A21\u677F "), (vue.openBlock(), vue.createBlock(TemplateRenderer_vue_vue_type_script_setup_true_lang.default, {
          key: templateKey.value,
          "template-name": vue.unref(selectedTemplate),
          category: "dashboard",
          data: _ctx.data,
          "custom-components": _ctx.customComponents,
          "enable-skeleton": _ctx.enableSkeleton,
          "enable-cache": _ctx.enableCache,
          "enable-retry": _ctx.enableRetry,
          "enable-auto-save": _ctx.enableAutoSave,
          "enable-v-model": _ctx.enableVModel,
          onRendered: handleRendered,
          onError: handleError,
          onSave: handleSave
        }, null, 8, ["template-name", "data", "custom-components", "enable-skeleton", "enable-cache", "enable-retry", "enable-auto-save", "enable-v-model"]))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 2
        },
        [vue.createCommentVNode(" \u9ED8\u8BA4\u5185\u5BB9\uFF08\u65E0\u5339\u914D\u6A21\u677F\uFF09 "), vue.createElementVNode("div", _hoisted_4, [vue.renderSlot(_ctx.$slots, "default", {}, () => [_ctx.defaultTemplate ? (vue.openBlock(), vue.createBlock(TemplateRenderer_vue_vue_type_script_setup_true_lang.default, {
          key: 0,
          "template-name": _ctx.defaultTemplate,
          category: "dashboard",
          data: _ctx.data,
          "custom-components": _ctx.customComponents,
          "enable-skeleton": _ctx.enableSkeleton,
          "enable-cache": _ctx.enableCache,
          "enable-retry": _ctx.enableRetry,
          "enable-auto-save": _ctx.enableAutoSave,
          "enable-v-model": _ctx.enableVModel,
          onRendered: handleRendered,
          onError: handleError,
          onSave: handleSave
        }, null, 8, ["template-name", "data", "custom-components", "enable-skeleton", "enable-cache", "enable-retry", "enable-auto-save", "enable-v-model"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [vue.renderSlot(_ctx.$slots, "no-template", {}, () => [_cache[0] || (_cache[0] = vue.createElementVNode(
          "p",
          null,
          "\u6CA1\u6709\u5339\u914D\u7684\u6A21\u677F",
          -1
          /* CACHED */
        ))])]))])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )), vue.createCommentVNode(" \u8C03\u8BD5\u4FE1\u606F "), _ctx.showDebug ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [_cache[3] || (_cache[3] = vue.createElementVNode(
        "h4",
        null,
        "\u6761\u4EF6\u6E32\u67D3\u8C03\u8BD5\u4FE1\u606F",
        -1
        /* CACHED */
      )), vue.createElementVNode("div", _hoisted_7, [vue.createElementVNode(
        "div",
        null,
        "\u9009\u4E2D\u6A21\u677F: " + vue.toDisplayString(vue.unref(selectedTemplate) || "\u65E0"),
        1
        /* TEXT */
      ), vue.createElementVNode(
        "div",
        null,
        "\u8BC4\u4F30\u65F6\u95F4: " + vue.toDisplayString(vue.unref(lastEvaluation)?.toLocaleString() || "\u672A\u8BC4\u4F30"),
        1
        /* TEXT */
      ), _cache[1] || (_cache[1] = vue.createElementVNode(
        "div",
        null,
        "\u5F53\u524D\u4E0A\u4E0B\u6587:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "pre",
        null,
        vue.toDisplayString(JSON.stringify(vue.unref(context), null, 2)),
        1
        /* TEXT */
      ), _cache[2] || (_cache[2] = vue.createElementVNode(
        "div",
        null,
        "\u6761\u4EF6\u5217\u8868:",
        -1
        /* CACHED */
      )), vue.createElementVNode("ul", null, [(vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(_ctx.conditions, (condition, index) => {
          return vue.openBlock(), vue.createElementBlock(
            "li",
            {
              key: index
            },
            vue.toDisplayString(condition.description || condition.id || `\u6761\u4EF6 ${index + 1}`) + " - \u6A21\u677F: " + vue.toDisplayString(condition.template) + " - \u4F18\u5148\u7EA7: " + vue.toDisplayString(condition.priority || 0) + " - \u72B6\u6001: " + vue.toDisplayString(condition.enabled !== false ? "\u542F\u7528" : "\u7981\u7528"),
            1
            /* TEXT */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      ))])]), vue.createElementVNode("button", {
        class: "reevaluate-btn",
        onClick: handleReevaluate
      }, " \u91CD\u65B0\u8BC4\u4F30\u6761\u4EF6 ")])) : vue.createCommentVNode("v-if", true)]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=ConditionalTemplate.vue2.cjs.map
