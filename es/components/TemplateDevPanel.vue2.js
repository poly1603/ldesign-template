/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, createBlock, openBlock, Teleport, createElementBlock, createCommentVNode, normalizeClass, createElementVNode, withDirectives, toDisplayString, Fragment, renderList, vModelSelect, vModelText, vShow } from 'vue';
import { useTemplateDebugger } from '../composables/useTemplateDebugger.js';
import { useTemplatePerformance } from '../composables/useTemplatePerformance.js';
import { useTemplateSnapshot } from '../composables/useTemplateSnapshot.js';

const _hoisted_1 = {
  class: "dev-panel-header"
};
const _hoisted_2 = {
  class: "header-left"
};
const _hoisted_3 = {
  class: "template-name"
};
const _hoisted_4 = {
  class: "header-actions"
};
const _hoisted_5 = {
  class: "dev-panel-content"
};
const _hoisted_6 = {
  class: "tab-nav"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = {
  class: "tab-content"
};
const _hoisted_9 = {
  class: "toolbar"
};
const _hoisted_10 = {
  class: "logs-container"
};
const _hoisted_11 = {
  class: "log-time"
};
const _hoisted_12 = {
  class: "log-level"
};
const _hoisted_13 = {
  class: "log-message"
};
const _hoisted_14 = {
  key: 0,
  class: "log-data"
};
const _hoisted_15 = {
  class: "tab-content"
};
const _hoisted_16 = {
  class: "state-inspector"
};
const _hoisted_17 = {
  class: "state-section"
};
const _hoisted_18 = {
  class: "code-block"
};
const _hoisted_19 = {
  class: "state-section"
};
const _hoisted_20 = {
  class: "code-block"
};
const _hoisted_21 = {
  class: "state-section"
};
const _hoisted_22 = {
  class: "snapshot-list"
};
const _hoisted_23 = ["onClick"];
const _hoisted_24 = {
  class: "snapshot-time"
};
const _hoisted_25 = {
  class: "snapshot-desc"
};
const _hoisted_26 = {
  class: "tab-content"
};
const _hoisted_27 = {
  class: "perf-metrics"
};
const _hoisted_28 = {
  class: "metric-card"
};
const _hoisted_29 = {
  class: "metric-value"
};
const _hoisted_30 = {
  class: "metric-card"
};
const _hoisted_31 = {
  class: "metric-value"
};
const _hoisted_32 = {
  class: "metric-card"
};
const _hoisted_33 = {
  class: "metric-value"
};
const _hoisted_34 = {
  class: "metric-card"
};
const _hoisted_35 = {
  class: "metric-value"
};
const _hoisted_36 = {
  class: "perf-chart"
};
const _hoisted_37 = {
  class: "tab-content"
};
const _hoisted_38 = {
  class: "events-container"
};
const _hoisted_39 = {
  class: "event-time"
};
const _hoisted_40 = {
  class: "event-type"
};
const _hoisted_41 = {
  class: "event-payload"
};
const _hoisted_42 = {
  class: "tab-content"
};
const _hoisted_43 = {
  class: "analytics-summary"
};
const _hoisted_44 = {
  class: "stats-grid"
};
const _hoisted_45 = {
  class: "stat-item"
};
const _hoisted_46 = {
  class: "stat-value"
};
const _hoisted_47 = {
  class: "stat-item"
};
const _hoisted_48 = {
  class: "stat-value error"
};
const _hoisted_49 = {
  class: "stat-item"
};
const _hoisted_50 = {
  class: "stat-value"
};
const _hoisted_51 = {
  class: "stat-item"
};
const _hoisted_52 = {
  class: "stat-value"
};
const _hoisted_53 = {
  class: "recommendations"
};
const _hoisted_54 = {
  class: "recommendation-list"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "TemplateDevPanel",
  props: {
    templateId: {
      type: String,
      required: false
    },
    modelValue: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(props.modelValue ?? true);
    const minimized = ref(false);
    const activeTab = ref("logs");
    const chartCanvas = ref(null);
    const templateDebugger = props.templateId ? useTemplateDebugger(props.templateId) : null;
    const snapshot = props.templateId ? useTemplateSnapshot(props.templateId, {
      maxSnapshots: 20,
      autoSave: true
    }) : null;
    const performance = props.templateId ? useTemplatePerformance(props.templateId) : null;
    const logFilter = ref("all");
    const logSearch = ref("");
    const logs = ref([]);
    const templateState = ref({});
    const templateProps = ref({});
    const currentTemplate = ref(props.templateId);
    const snapshotHistory = computed(() => {
      return snapshot?.snapshots.value || [];
    });
    const performanceData = ref({
      renderTime: 0,
      loadTime: 0,
      memory: 0,
      componentCount: 0
    });
    const eventHistory = ref([]);
    const analyticsData = ref({
      totalRenders: 0,
      errorCount: 0,
      avgResponseTime: 0,
      interactions: 0,
      recommendations: []
    });
    const tabs = [{
      id: "logs",
      label: "Logs",
      icon: "\u{1F4CB}"
    }, {
      id: "state",
      label: "State",
      icon: "\u{1F50D}"
    }, {
      id: "performance",
      label: "Performance",
      icon: "\u26A1"
    }, {
      id: "events",
      label: "Events",
      icon: "\u{1F4E1}"
    }, {
      id: "analytics",
      label: "Analytics",
      icon: "\u{1F4CA}"
    }];
    const filteredLogs = computed(() => {
      let result = logs.value;
      if (logFilter.value !== "all") {
        result = result.filter((log) => log.level === logFilter.value);
      }
      if (logSearch.value) {
        const search = logSearch.value.toLowerCase();
        result = result.filter((log) => log.message.toLowerCase().includes(search) || JSON.stringify(log.data).toLowerCase().includes(search));
      }
      return result.slice(-100);
    });
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("zh-CN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3
      });
    };
    const formatData = (data) => {
      if (data === void 0) return "";
      if (typeof data === "string") return data;
      return JSON.stringify(data, null, 2);
    };
    const formatJSON = (obj) => {
      try {
        return JSON.stringify(obj, null, 2);
      } catch {
        return String(obj);
      }
    };
    const clearLogs = () => {
      logs.value = [];
      templateDebugger?.clearLogs();
    };
    const clearEvents = () => {
      eventHistory.value = [];
    };
    const restoreSnapshot = (index) => {
      if (snapshot) {
        snapshot.gotoIndex(index);
        templateDebugger?.info(`Restored to snapshot #${index}`);
      }
    };
    const collectLogs = () => {
      if (templateDebugger) {
        logs.value = templateDebugger.getLogs();
      }
    };
    const collectPerformance = () => {
      if (performance) {
        const metrics = performance.getMetrics();
        performanceData.value = {
          renderTime: Math.round(metrics.renderTime || 0),
          loadTime: Math.round(metrics.loadTime || 0),
          memory: Math.round((performance.memory.value || 0) / 1024 / 1024),
          componentCount: metrics.componentCount || 0
        };
      }
    };
    const collectState = () => {
      if (templateDebugger) {
        const snapshots = templateDebugger.stateSnapshots.value;
        if (snapshots.length > 0) {
          const latestSnapshot = snapshots[snapshots.length - 1];
          templateState.value = latestSnapshot.state || {};
          templateProps.value = latestSnapshot.props || {};
        }
      }
    };
    let refreshTimer = null;
    const startRefresh = () => {
      refreshTimer = window.setInterval(() => {
        collectLogs();
        collectPerformance();
        collectState();
      }, 1e3);
    };
    const stopRefresh = () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
    };
    watch(visible, (val) => {
      emit("update:modelValue", val);
      if (val) {
        startRefresh();
      } else {
        stopRefresh();
      }
    });
    watch(() => props.modelValue, (val) => {
      visible.value = val ?? true;
    });
    onMounted(() => {
      if (visible.value) {
        startRefresh();
      }
      if (chartCanvas.value) {
        chartCanvas.value.getContext("2d");
      }
    });
    onUnmounted(() => {
      stopRefresh();
    });
    __expose({
      show: () => visible.value = true,
      hide: () => visible.value = false,
      toggle: () => visible.value = !visible.value,
      minimize: () => minimized.value = true,
      maximize: () => minimized.value = false
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: "body"
      }, [visible.value ? (openBlock(), createElementBlock(
        "div",
        {
          key: 0,
          class: normalizeClass(["template-dev-panel", {
            minimized: minimized.value
          }])
        },
        [createCommentVNode(" \u9762\u677F\u5934\u90E8 "), createElementVNode("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [_cache[4] || (_cache[4] = createElementVNode(
          "h3",
          null,
          "\u{1F6E0}\uFE0F Template Dev Panel",
          -1
          /* CACHED */
        )), createElementVNode(
          "span",
          _hoisted_3,
          toDisplayString(currentTemplate.value || "No Template"),
          1
          /* TEXT */
        )]), createElementVNode("div", _hoisted_4, [createElementVNode(
          "button",
          {
            class: "btn-icon",
            title: "\u6700\u5C0F\u5316/\u8FD8\u539F",
            onClick: _cache[0] || (_cache[0] = ($event) => minimized.value = !minimized.value)
          },
          toDisplayString(minimized.value ? "\u25A1" : "\u2212"),
          1
          /* TEXT */
        ), createElementVNode("button", {
          class: "btn-icon",
          title: "\u5173\u95ED",
          onClick: _cache[1] || (_cache[1] = ($event) => visible.value = false)
        }, " \u2715 ")])]), createCommentVNode(" \u9762\u677F\u5185\u5BB9 "), withDirectives(createElementVNode(
          "div",
          _hoisted_5,
          [createCommentVNode(" \u6807\u7B7E\u9875\u5BFC\u822A "), createElementVNode("div", _hoisted_6, [(openBlock(), createElementBlock(
            Fragment,
            null,
            renderList(tabs, (tab) => {
              return createElementVNode("button", {
                key: tab.id,
                class: normalizeClass(["tab-btn", [{
                  active: activeTab.value === tab.id
                }]]),
                onClick: ($event) => activeTab.value = tab.id
              }, toDisplayString(tab.icon) + " " + toDisplayString(tab.label), 11, _hoisted_7);
            }),
            64
            /* STABLE_FRAGMENT */
          ))]), createCommentVNode(" \u8C03\u8BD5\u65E5\u5FD7 "), withDirectives(createElementVNode(
            "div",
            _hoisted_8,
            [createElementVNode("div", _hoisted_9, [withDirectives(createElementVNode(
              "select",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => logFilter.value = $event),
                class: "filter-select"
              },
              [..._cache[5] || (_cache[5] = [createElementVNode(
                "option",
                {
                  value: "all"
                },
                " All Levels ",
                -1
                /* CACHED */
              ), createElementVNode(
                "option",
                {
                  value: "error"
                },
                " Errors ",
                -1
                /* CACHED */
              ), createElementVNode(
                "option",
                {
                  value: "warn"
                },
                " Warnings ",
                -1
                /* CACHED */
              ), createElementVNode(
                "option",
                {
                  value: "info"
                },
                " Info ",
                -1
                /* CACHED */
              ), createElementVNode(
                "option",
                {
                  value: "debug"
                },
                " Debug ",
                -1
                /* CACHED */
              )])],
              512
              /* NEED_PATCH */
            ), [[vModelSelect, logFilter.value]]), withDirectives(createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => logSearch.value = $event),
                type: "text",
                placeholder: "\u641C\u7D22\u65E5\u5FD7...",
                class: "search-input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [[vModelText, logSearch.value]]), createElementVNode("button", {
              class: "btn-clear",
              onClick: clearLogs
            }, " \u6E05\u7A7A ")]), createElementVNode("div", _hoisted_10, [(openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(filteredLogs.value, (log, index) => {
                return openBlock(), createElementBlock(
                  "div",
                  {
                    key: index,
                    class: normalizeClass(["log-item", [`log-${log.level}`]])
                  },
                  [createElementVNode(
                    "span",
                    _hoisted_11,
                    toDisplayString(formatTime(log.timestamp)),
                    1
                    /* TEXT */
                  ), createElementVNode(
                    "span",
                    _hoisted_12,
                    toDisplayString(log.level.toUpperCase()),
                    1
                    /* TEXT */
                  ), createElementVNode(
                    "span",
                    _hoisted_13,
                    toDisplayString(log.message),
                    1
                    /* TEXT */
                  ), log.data ? (openBlock(), createElementBlock(
                    "span",
                    _hoisted_14,
                    toDisplayString(formatData(log.data)),
                    1
                    /* TEXT */
                  )) : createCommentVNode("v-if", true)],
                  2
                  /* CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))])],
            512
            /* NEED_PATCH */
          ), [[vShow, activeTab.value === "logs"]]), createCommentVNode(" \u72B6\u6001\u68C0\u67E5\u5668 "), withDirectives(createElementVNode(
            "div",
            _hoisted_15,
            [createElementVNode("div", _hoisted_16, [createElementVNode("div", _hoisted_17, [_cache[6] || (_cache[6] = createElementVNode(
              "h4",
              null,
              "Template State",
              -1
              /* CACHED */
            )), createElementVNode(
              "pre",
              _hoisted_18,
              toDisplayString(formatJSON(templateState.value)),
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_19, [_cache[7] || (_cache[7] = createElementVNode(
              "h4",
              null,
              "Props",
              -1
              /* CACHED */
            )), createElementVNode(
              "pre",
              _hoisted_20,
              toDisplayString(formatJSON(templateProps.value)),
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_21, [_cache[8] || (_cache[8] = createElementVNode(
              "h4",
              null,
              "Snapshot History",
              -1
              /* CACHED */
            )), createElementVNode("div", _hoisted_22, [(openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(snapshotHistory.value, (snap, idx) => {
                return openBlock(), createElementBlock("div", {
                  key: idx,
                  class: "snapshot-item",
                  onClick: ($event) => restoreSnapshot(idx)
                }, [createElementVNode(
                  "span",
                  _hoisted_24,
                  toDisplayString(formatTime(snap.timestamp)),
                  1
                  /* TEXT */
                ), createElementVNode(
                  "span",
                  _hoisted_25,
                  toDisplayString(snap.description || "Snapshot"),
                  1
                  /* TEXT */
                )], 8, _hoisted_23);
              }),
              128
              /* KEYED_FRAGMENT */
            ))])])])],
            512
            /* NEED_PATCH */
          ), [[vShow, activeTab.value === "state"]]), createCommentVNode(" \u6027\u80FD\u76D1\u63A7 "), withDirectives(createElementVNode(
            "div",
            _hoisted_26,
            [createElementVNode("div", _hoisted_27, [createElementVNode("div", _hoisted_28, [_cache[9] || (_cache[9] = createElementVNode(
              "div",
              {
                class: "metric-label"
              },
              " \u6E32\u67D3\u65F6\u95F4 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_29,
              toDisplayString(performanceData.value.renderTime) + "ms ",
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_30, [_cache[10] || (_cache[10] = createElementVNode(
              "div",
              {
                class: "metric-label"
              },
              " \u52A0\u8F7D\u65F6\u95F4 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_31,
              toDisplayString(performanceData.value.loadTime) + "ms ",
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_32, [_cache[11] || (_cache[11] = createElementVNode(
              "div",
              {
                class: "metric-label"
              },
              " \u5185\u5B58\u4F7F\u7528 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_33,
              toDisplayString(performanceData.value.memory) + "MB ",
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_34, [_cache[12] || (_cache[12] = createElementVNode(
              "div",
              {
                class: "metric-label"
              },
              " \u7EC4\u4EF6\u6570\u91CF ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_35,
              toDisplayString(performanceData.value.componentCount),
              1
              /* TEXT */
            )])]), createElementVNode("div", _hoisted_36, [_cache[13] || (_cache[13] = createElementVNode(
              "h4",
              null,
              "\u6027\u80FD\u8D8B\u52BF",
              -1
              /* CACHED */
            )), createElementVNode(
              "canvas",
              {
                ref_key: "chartCanvas",
                ref: chartCanvas,
                width: "600",
                height: "200"
              },
              null,
              512
              /* NEED_PATCH */
            )])],
            512
            /* NEED_PATCH */
          ), [[vShow, activeTab.value === "performance"]]), createCommentVNode(" \u4E8B\u4EF6\u76D1\u542C\u5668 "), withDirectives(createElementVNode(
            "div",
            _hoisted_37,
            [createElementVNode("div", {
              class: "toolbar"
            }, [createElementVNode("button", {
              class: "btn-clear",
              onClick: clearEvents
            }, " \u6E05\u7A7A\u4E8B\u4EF6 ")]), createElementVNode("div", _hoisted_38, [(openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(eventHistory.value, (event, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: "event-item"
                }, [createElementVNode(
                  "span",
                  _hoisted_39,
                  toDisplayString(formatTime(event.timestamp)),
                  1
                  /* TEXT */
                ), createElementVNode(
                  "span",
                  _hoisted_40,
                  toDisplayString(event.type),
                  1
                  /* TEXT */
                ), createElementVNode(
                  "span",
                  _hoisted_41,
                  toDisplayString(formatData(event.payload)),
                  1
                  /* TEXT */
                )]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))])],
            512
            /* NEED_PATCH */
          ), [[vShow, activeTab.value === "events"]]), createCommentVNode(" \u5206\u6790\u62A5\u544A "), withDirectives(createElementVNode(
            "div",
            _hoisted_42,
            [createElementVNode("div", _hoisted_43, [_cache[18] || (_cache[18] = createElementVNode(
              "h4",
              null,
              "\u4F7F\u7528\u7EDF\u8BA1",
              -1
              /* CACHED */
            )), createElementVNode("div", _hoisted_44, [createElementVNode("div", _hoisted_45, [_cache[14] || (_cache[14] = createElementVNode(
              "div",
              {
                class: "stat-label"
              },
              " \u603B\u6E32\u67D3\u6B21\u6570 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_46,
              toDisplayString(analyticsData.value.totalRenders),
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_47, [_cache[15] || (_cache[15] = createElementVNode(
              "div",
              {
                class: "stat-label"
              },
              " \u9519\u8BEF\u6B21\u6570 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_48,
              toDisplayString(analyticsData.value.errorCount),
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_49, [_cache[16] || (_cache[16] = createElementVNode(
              "div",
              {
                class: "stat-label"
              },
              " \u5E73\u5747\u54CD\u5E94\u65F6\u95F4 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_50,
              toDisplayString(analyticsData.value.avgResponseTime) + "ms ",
              1
              /* TEXT */
            )]), createElementVNode("div", _hoisted_51, [_cache[17] || (_cache[17] = createElementVNode(
              "div",
              {
                class: "stat-label"
              },
              " \u7528\u6237\u4EA4\u4E92 ",
              -1
              /* CACHED */
            )), createElementVNode(
              "div",
              _hoisted_52,
              toDisplayString(analyticsData.value.interactions),
              1
              /* TEXT */
            )])])]), createElementVNode("div", _hoisted_53, [_cache[19] || (_cache[19] = createElementVNode(
              "h4",
              null,
              "\u4F18\u5316\u5EFA\u8BAE",
              -1
              /* CACHED */
            )), createElementVNode("ul", _hoisted_54, [(openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(analyticsData.value.recommendations, (rec, idx) => {
                return openBlock(), createElementBlock(
                  "li",
                  {
                    key: idx,
                    class: normalizeClass(["recommendation-item", [`priority-${rec.priority}`]])
                  },
                  toDisplayString(rec.message),
                  3
                  /* TEXT, CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))])])],
            512
            /* NEED_PATCH */
          ), [[vShow, activeTab.value === "analytics"]])],
          512
          /* NEED_PATCH */
        ), [[vShow, !minimized.value]])],
        2
        /* CLASS */
      )) : createCommentVNode("v-if", true)]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateDevPanel.vue2.js.map
