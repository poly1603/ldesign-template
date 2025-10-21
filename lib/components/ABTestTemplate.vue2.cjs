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
  class: "ab-test-template"
};
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "loading-message"
};
const _hoisted_4 = {
  class: "inactive-test"
};
const _hoisted_5 = {
  key: 1,
  class: "no-test"
};
const _hoisted_6 = {
  key: 3,
  class: "debug-info"
};
const _hoisted_7 = {
  class: "debug-content"
};
const _hoisted_8 = {
  class: "test-info"
};
const _hoisted_9 = {
  class: "value"
};
const _hoisted_10 = {
  class: "test-info"
};
const _hoisted_11 = {
  class: "value"
};
const _hoisted_12 = {
  class: "test-info"
};
const _hoisted_13 = {
  class: "test-info"
};
const _hoisted_14 = {
  class: "value"
};
const _hoisted_15 = {
  class: "test-info"
};
const _hoisted_16 = {
  class: "value variant"
};
const _hoisted_17 = {
  class: "test-info"
};
const _hoisted_18 = {
  class: "value"
};
const _hoisted_19 = {
  class: "test-info"
};
const _hoisted_20 = {
  class: "value"
};
const _hoisted_21 = {
  class: "test-info"
};
const _hoisted_22 = {
  class: "value"
};
const _hoisted_23 = {
  class: "test-info"
};
const _hoisted_24 = {
  class: "value"
};
const _hoisted_25 = {
  class: "variants-list"
};
const _hoisted_26 = {
  class: "variant-id"
};
const _hoisted_27 = {
  class: "variant-template"
};
const _hoisted_28 = {
  class: "variant-weight"
};
const _hoisted_29 = {
  key: 0,
  class: "metrics-list"
};
const _hoisted_30 = {
  class: "metric-name"
};
const _hoisted_31 = {
  class: "metric-value"
};
const _hoisted_32 = {
  class: "metric-time"
};
const MAX_TRACKED_METRICS = 100;
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "ABTestTemplate",
  props: {
    config: {
      type: Object,
      required: true
    },
    userId: {
      type: String,
      required: false
    },
    fallbackTemplate: {
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
    autoTrackClicks: {
      type: Boolean,
      required: false,
      default: true
    },
    autoTrackRender: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["variant-assigned", "metric", "rendered", "error", "save"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const {
      variant,
      template,
      isActive,
      result,
      runTest,
      trackMetric
    } = useTemplateCondition.useTemplateABTest(props.config, props.userId);
    const templateKey = vue.ref(0);
    const trackedMetrics = vue.ref([]);
    const track = (metric, value) => {
      trackMetric(metric, value);
      trackedMetrics.value.push({
        name: metric,
        value,
        timestamp: Date.now()
      });
      if (trackedMetrics.value.length > MAX_TRACKED_METRICS) {
        trackedMetrics.value.shift();
      }
      emit("metric", {
        metric,
        value
      });
    };
    const handleRendered = (data) => {
      if (props.autoTrackRender) {
        track("render", {
          variant: variant.value?.id
        });
      }
      emit("rendered", data);
    };
    const handleError = (error) => {
      track("error", {
        variant: variant.value?.id,
        error: error.message
      });
      emit("error", error);
    };
    const handleSave = (data) => {
      track("save", {
        variant: variant.value?.id
      });
      emit("save", data);
    };
    const handleClick = (event) => {
      if (props.autoTrackClicks) {
        const target = event.target;
        const clickData = {
          variant: variant.value?.id,
          element: target.tagName,
          text: target.textContent?.slice(0, 50)
        };
        track("click", clickData);
      }
    };
    const handleRerun = () => {
      const newResult = runTest();
      if (newResult) {
        templateKey.value++;
        emit("variant-assigned", newResult.variant);
      }
    };
    const handleClearCache = () => {
      if (props.userId) {
        const key = `ab-test-${props.config.id}-${props.userId}`;
        localStorage.removeItem(key);
      }
      trackedMetrics.value = [];
      handleRerun();
    };
    const configWatcher = vue.watch(() => props.config, () => {
      handleRerun();
    }, {
      deep: true
    });
    const variantWatcher = vue.watch(variant, (newVariant) => {
      if (newVariant) {
        emit("variant-assigned", newVariant);
      }
    });
    vue.onMounted(() => {
      if (variant.value && props.autoTrackRender) {
        track("initial-render", {
          variant: variant.value.id
        });
      }
    });
    vue.onUnmounted(() => {
      configWatcher?.();
      variantWatcher?.();
      trackedMetrics.value = [];
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.createCommentVNode(" \u52A0\u8F7D\u72B6\u6001 "), !vue.unref(variant) && vue.unref(isActive) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [vue.renderSlot(_ctx.$slots, "loading", {}, () => [_ctx.showSkeleton ? (vue.openBlock(), vue.createBlock(TemplateSkeleton_vue_vue_type_script_setup_true_lang.default, {
        key: 0
      })) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, " \u6B63\u5728\u5206\u914D\u6D4B\u8BD5\u53D8\u4F53... "))])])) : vue.unref(template) ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 1
        },
        [vue.createCommentVNode(" \u6E32\u67D3\u6D4B\u8BD5\u53D8\u4F53\u6A21\u677F "), (vue.openBlock(), vue.createBlock(TemplateRenderer_vue_vue_type_script_setup_true_lang.default, {
          key: templateKey.value,
          "template-name": vue.unref(template),
          category: "dashboard",
          data: _ctx.data,
          "custom-components": _ctx.customComponents,
          "enable-skeleton": _ctx.enableSkeleton,
          "enable-cache": _ctx.enableCache,
          "enable-retry": _ctx.enableRetry,
          "enable-auto-save": _ctx.enableAutoSave,
          "enable-v-model": _ctx.enableVModel,
          onRendered: handleRendered,
          onError: _cache[0] || (_cache[0] = (...args) => handleError(args[0])),
          onSave: handleSave,
          onClick: _cache[1] || (_cache[1] = (...args) => handleClick(args[0]))
        }, null, 8, ["template-name", "data", "custom-components", "enable-skeleton", "enable-cache", "enable-retry", "enable-auto-save", "enable-v-model"]))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        {
          key: 2
        },
        [vue.createCommentVNode(" \u6D4B\u8BD5\u672A\u6FC0\u6D3B\u6216\u65E0\u53D8\u4F53 "), vue.createElementVNode("div", _hoisted_4, [vue.renderSlot(_ctx.$slots, "inactive", {}, () => [_ctx.fallbackTemplate ? (vue.openBlock(), vue.createBlock(TemplateRenderer_vue_vue_type_script_setup_true_lang.default, {
          key: 0,
          "template-name": _ctx.fallbackTemplate,
          category: "dashboard",
          data: _ctx.data,
          "custom-components": _ctx.customComponents,
          "enable-skeleton": _ctx.enableSkeleton,
          "enable-cache": _ctx.enableCache,
          "enable-retry": _ctx.enableRetry,
          "enable-auto-save": _ctx.enableAutoSave,
          "enable-v-model": _ctx.enableVModel,
          onRendered: handleRendered,
          onError: _cache[2] || (_cache[2] = (...args) => handleError(args[0])),
          onSave: handleSave
        }, null, 8, ["template-name", "data", "custom-components", "enable-skeleton", "enable-cache", "enable-retry", "enable-auto-save", "enable-v-model"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [vue.renderSlot(_ctx.$slots, "no-test", {}, () => [_cache[3] || (_cache[3] = vue.createElementVNode(
          "p",
          null,
          "A/B\u6D4B\u8BD5\u672A\u6FC0\u6D3B",
          -1
          /* CACHED */
        ))])]))])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )), vue.createCommentVNode(" \u8C03\u8BD5\u4FE1\u606F "), _ctx.showDebug && vue.unref(result) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [_cache[15] || (_cache[15] = vue.createElementVNode(
        "h4",
        null,
        "A/B\u6D4B\u8BD5\u8C03\u8BD5\u4FE1\u606F",
        -1
        /* CACHED */
      )), vue.createElementVNode("div", _hoisted_7, [vue.createElementVNode("div", _hoisted_8, [_cache[4] || (_cache[4] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u6D4B\u8BD5ID:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_9,
        vue.toDisplayString(_ctx.config.id),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_10, [_cache[5] || (_cache[5] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u6D4B\u8BD5\u540D\u79F0:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_11,
        vue.toDisplayString(_ctx.config.name || "\u672A\u547D\u540D"),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_12, [_cache[6] || (_cache[6] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u6D4B\u8BD5\u72B6\u6001:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        {
          class: vue.normalizeClass(["value", {
            active: vue.unref(isActive)
          }])
        },
        vue.toDisplayString(vue.unref(isActive) ? "\u6FC0\u6D3B" : "\u672A\u6FC0\u6D3B"),
        3
        /* TEXT, CLASS */
      )]), vue.createElementVNode("div", _hoisted_13, [_cache[7] || (_cache[7] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5206\u914D\u7B56\u7565:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_14,
        vue.toDisplayString(_ctx.config.strategy || "random"),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_15, [_cache[8] || (_cache[8] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5F53\u524D\u53D8\u4F53:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_16,
        vue.toDisplayString(vue.unref(variant)?.id || "\u65E0"),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_17, [_cache[9] || (_cache[9] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u53D8\u4F53\u6A21\u677F:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_18,
        vue.toDisplayString(vue.unref(variant)?.template || "\u65E0"),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_19, [_cache[10] || (_cache[10] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u53D8\u4F53\u6743\u91CD:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_20,
        vue.toDisplayString(vue.unref(variant)?.weight || 0),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_21, [_cache[11] || (_cache[11] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5206\u914D\u65F6\u95F4:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_22,
        vue.toDisplayString(vue.unref(result) ? new Date(vue.unref(result).timestamp).toLocaleString() : "\u672A\u5206\u914D"),
        1
        /* TEXT */
      )]), vue.createElementVNode("div", _hoisted_23, [_cache[12] || (_cache[12] = vue.createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5206\u914D\u539F\u56E0:",
        -1
        /* CACHED */
      )), vue.createElementVNode(
        "span",
        _hoisted_24,
        vue.toDisplayString(vue.unref(result)?.reason || "\u65E0"),
        1
        /* TEXT */
      )]), vue.createCommentVNode(" \u53D8\u4F53\u5217\u8868 "), vue.createElementVNode("div", _hoisted_25, [_cache[13] || (_cache[13] = vue.createElementVNode(
        "h5",
        null,
        "\u6240\u6709\u53D8\u4F53",
        -1
        /* CACHED */
      )), (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(_ctx.config.variants, (v) => {
          return vue.openBlock(), vue.createElementBlock(
            "div",
            {
              key: v.id,
              class: vue.normalizeClass(["variant-item", {
                current: v.id === vue.unref(variant)?.id
              }])
            },
            [vue.createElementVNode(
              "span",
              _hoisted_26,
              vue.toDisplayString(v.id),
              1
              /* TEXT */
            ), vue.createElementVNode(
              "span",
              _hoisted_27,
              vue.toDisplayString(v.template),
              1
              /* TEXT */
            ), vue.createElementVNode(
              "span",
              _hoisted_28,
              "\u6743\u91CD: " + vue.toDisplayString(v.weight),
              1
              /* TEXT */
            )],
            2
            /* CLASS */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      ))]), vue.createCommentVNode(" \u6307\u6807\u8FFD\u8E2A "), trackedMetrics.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_29, [_cache[14] || (_cache[14] = vue.createElementVNode(
        "h5",
        null,
        "\u5DF2\u8FFD\u8E2A\u6307\u6807",
        -1
        /* CACHED */
      )), (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(trackedMetrics.value, (metric, index) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: index,
            class: "metric-item"
          }, [vue.createElementVNode(
            "span",
            _hoisted_30,
            vue.toDisplayString(metric.name),
            1
            /* TEXT */
          ), vue.createElementVNode(
            "span",
            _hoisted_31,
            vue.toDisplayString(metric.value),
            1
            /* TEXT */
          ), vue.createElementVNode(
            "span",
            _hoisted_32,
            vue.toDisplayString(new Date(metric.timestamp).toLocaleTimeString()),
            1
            /* TEXT */
          )]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])) : vue.createCommentVNode("v-if", true), vue.createCommentVNode(" \u64CD\u4F5C\u6309\u94AE "), vue.createElementVNode("div", {
        class: "debug-actions"
      }, [vue.createElementVNode("button", {
        class: "debug-btn",
        onClick: handleRerun
      }, " \u91CD\u65B0\u8FD0\u884C\u6D4B\u8BD5 "), vue.createElementVNode("button", {
        class: "debug-btn",
        onClick: handleClearCache
      }, " \u6E05\u9664\u7F13\u5B58 ")])])])) : vue.createCommentVNode("v-if", true)]);
    };
  }
});

exports.default = script;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=ABTestTemplate.vue2.cjs.map
