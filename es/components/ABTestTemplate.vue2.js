/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, ref, watch, onMounted, onUnmounted, createElementBlock, openBlock, createCommentVNode, unref, renderSlot, createBlock, Fragment, createElementVNode, toDisplayString, normalizeClass, renderList } from 'vue';
import { useTemplateABTest } from '../composables/useTemplateCondition.js';
import './TemplateRenderer.vue.js';
import './TemplateSkeleton.vue.js';
import script$1 from './TemplateSkeleton.vue2.js';
import script$2 from './TemplateRenderer.vue2.js';

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
var script = /* @__PURE__ */ defineComponent({
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
    } = useTemplateABTest(props.config, props.userId);
    const templateKey = ref(0);
    const trackedMetrics = ref([]);
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
    const configWatcher = watch(() => props.config, () => {
      handleRerun();
    }, {
      deep: true
    });
    const variantWatcher = watch(variant, (newVariant) => {
      if (newVariant) {
        emit("variant-assigned", newVariant);
      }
    });
    onMounted(() => {
      if (variant.value && props.autoTrackRender) {
        track("initial-render", {
          variant: variant.value.id
        });
      }
    });
    onUnmounted(() => {
      configWatcher?.();
      variantWatcher?.();
      trackedMetrics.value = [];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [createCommentVNode(" \u52A0\u8F7D\u72B6\u6001 "), !unref(variant) && unref(isActive) ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "loading", {}, () => [_ctx.showSkeleton ? (openBlock(), createBlock(script$1, {
        key: 0
      })) : (openBlock(), createElementBlock("div", _hoisted_3, " \u6B63\u5728\u5206\u914D\u6D4B\u8BD5\u53D8\u4F53... "))])])) : unref(template) ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 1
        },
        [createCommentVNode(" \u6E32\u67D3\u6D4B\u8BD5\u53D8\u4F53\u6A21\u677F "), (openBlock(), createBlock(script$2, {
          key: templateKey.value,
          "template-name": unref(template),
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
      )) : (openBlock(), createElementBlock(
        Fragment,
        {
          key: 2
        },
        [createCommentVNode(" \u6D4B\u8BD5\u672A\u6FC0\u6D3B\u6216\u65E0\u53D8\u4F53 "), createElementVNode("div", _hoisted_4, [renderSlot(_ctx.$slots, "inactive", {}, () => [_ctx.fallbackTemplate ? (openBlock(), createBlock(script$2, {
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
        }, null, 8, ["template-name", "data", "custom-components", "enable-skeleton", "enable-cache", "enable-retry", "enable-auto-save", "enable-v-model"])) : (openBlock(), createElementBlock("div", _hoisted_5, [renderSlot(_ctx.$slots, "no-test", {}, () => [_cache[3] || (_cache[3] = createElementVNode(
          "p",
          null,
          "A/B\u6D4B\u8BD5\u672A\u6FC0\u6D3B",
          -1
          /* CACHED */
        ))])]))])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )), createCommentVNode(" \u8C03\u8BD5\u4FE1\u606F "), _ctx.showDebug && unref(result) ? (openBlock(), createElementBlock("div", _hoisted_6, [_cache[15] || (_cache[15] = createElementVNode(
        "h4",
        null,
        "A/B\u6D4B\u8BD5\u8C03\u8BD5\u4FE1\u606F",
        -1
        /* CACHED */
      )), createElementVNode("div", _hoisted_7, [createElementVNode("div", _hoisted_8, [_cache[4] || (_cache[4] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u6D4B\u8BD5ID:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_9,
        toDisplayString(_ctx.config.id),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_10, [_cache[5] || (_cache[5] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u6D4B\u8BD5\u540D\u79F0:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_11,
        toDisplayString(_ctx.config.name || "\u672A\u547D\u540D"),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_12, [_cache[6] || (_cache[6] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u6D4B\u8BD5\u72B6\u6001:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        {
          class: normalizeClass(["value", {
            active: unref(isActive)
          }])
        },
        toDisplayString(unref(isActive) ? "\u6FC0\u6D3B" : "\u672A\u6FC0\u6D3B"),
        3
        /* TEXT, CLASS */
      )]), createElementVNode("div", _hoisted_13, [_cache[7] || (_cache[7] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5206\u914D\u7B56\u7565:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_14,
        toDisplayString(_ctx.config.strategy || "random"),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_15, [_cache[8] || (_cache[8] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5F53\u524D\u53D8\u4F53:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_16,
        toDisplayString(unref(variant)?.id || "\u65E0"),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_17, [_cache[9] || (_cache[9] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u53D8\u4F53\u6A21\u677F:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_18,
        toDisplayString(unref(variant)?.template || "\u65E0"),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_19, [_cache[10] || (_cache[10] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u53D8\u4F53\u6743\u91CD:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_20,
        toDisplayString(unref(variant)?.weight || 0),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_21, [_cache[11] || (_cache[11] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5206\u914D\u65F6\u95F4:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_22,
        toDisplayString(unref(result) ? new Date(unref(result).timestamp).toLocaleString() : "\u672A\u5206\u914D"),
        1
        /* TEXT */
      )]), createElementVNode("div", _hoisted_23, [_cache[12] || (_cache[12] = createElementVNode(
        "span",
        {
          class: "label"
        },
        "\u5206\u914D\u539F\u56E0:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_24,
        toDisplayString(unref(result)?.reason || "\u65E0"),
        1
        /* TEXT */
      )]), createCommentVNode(" \u53D8\u4F53\u5217\u8868 "), createElementVNode("div", _hoisted_25, [_cache[13] || (_cache[13] = createElementVNode(
        "h5",
        null,
        "\u6240\u6709\u53D8\u4F53",
        -1
        /* CACHED */
      )), (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(_ctx.config.variants, (v) => {
          return openBlock(), createElementBlock(
            "div",
            {
              key: v.id,
              class: normalizeClass(["variant-item", {
                current: v.id === unref(variant)?.id
              }])
            },
            [createElementVNode(
              "span",
              _hoisted_26,
              toDisplayString(v.id),
              1
              /* TEXT */
            ), createElementVNode(
              "span",
              _hoisted_27,
              toDisplayString(v.template),
              1
              /* TEXT */
            ), createElementVNode(
              "span",
              _hoisted_28,
              "\u6743\u91CD: " + toDisplayString(v.weight),
              1
              /* TEXT */
            )],
            2
            /* CLASS */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      ))]), createCommentVNode(" \u6307\u6807\u8FFD\u8E2A "), trackedMetrics.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_29, [_cache[14] || (_cache[14] = createElementVNode(
        "h5",
        null,
        "\u5DF2\u8FFD\u8E2A\u6307\u6807",
        -1
        /* CACHED */
      )), (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(trackedMetrics.value, (metric, index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            class: "metric-item"
          }, [createElementVNode(
            "span",
            _hoisted_30,
            toDisplayString(metric.name),
            1
            /* TEXT */
          ), createElementVNode(
            "span",
            _hoisted_31,
            toDisplayString(metric.value),
            1
            /* TEXT */
          ), createElementVNode(
            "span",
            _hoisted_32,
            toDisplayString(new Date(metric.timestamp).toLocaleTimeString()),
            1
            /* TEXT */
          )]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])) : createCommentVNode("v-if", true), createCommentVNode(" \u64CD\u4F5C\u6309\u94AE "), createElementVNode("div", {
        class: "debug-actions"
      }, [createElementVNode("button", {
        class: "debug-btn",
        onClick: handleRerun
      }, " \u91CD\u65B0\u8FD0\u884C\u6D4B\u8BD5 "), createElementVNode("button", {
        class: "debug-btn",
        onClick: handleClearCache
      }, " \u6E05\u9664\u7F13\u5B58 ")])])])) : createCommentVNode("v-if", true)]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=ABTestTemplate.vue2.js.map
