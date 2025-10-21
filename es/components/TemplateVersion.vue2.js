/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, ref, watch, createElementBlock, openBlock, createCommentVNode, createElementVNode, createVNode, toDisplayString, unref, Transition, withCtx, Fragment, renderList, normalizeClass, withModifiers, withDirectives, vModelText, vModelSelect, createTextVNode, vModelCheckbox, normalizeStyle } from 'vue';
import { useTemplateVersion } from '../composables/useTemplateVersion.js';

const _hoisted_1 = {
  class: "template-version"
};
const _hoisted_2 = {
  class: "version-header"
};
const _hoisted_3 = {
  class: "version-info"
};
const _hoisted_4 = {
  class: "version-number"
};
const _hoisted_5 = {
  key: 0,
  class: "deprecated-badge"
};
const _hoisted_6 = {
  key: 1,
  class: "update-badge"
};
const _hoisted_7 = {
  class: "version-actions"
};
const _hoisted_8 = {
  key: 0,
  class: "version-history"
};
const _hoisted_9 = {
  class: "version-list"
};
const _hoisted_10 = {
  class: "version-item-header"
};
const _hoisted_11 = {
  class: "version-num"
};
const _hoisted_12 = {
  class: "version-date"
};
const _hoisted_13 = {
  key: 0,
  class: "version-desc"
};
const _hoisted_14 = {
  class: "version-item-actions"
};
const _hoisted_15 = ["disabled", "onClick"];
const _hoisted_16 = ["onClick"];
const _hoisted_17 = ["onClick"];
const _hoisted_18 = {
  class: "version-dialog"
};
const _hoisted_19 = {
  class: "form-group"
};
const _hoisted_20 = {
  key: 0,
  class: "error"
};
const _hoisted_21 = {
  class: "form-group"
};
const _hoisted_22 = {
  class: "form-group"
};
const _hoisted_23 = {
  class: "form-group"
};
const _hoisted_24 = {
  key: 0,
  class: "form-group"
};
const _hoisted_25 = {
  class: "dialog-actions"
};
const _hoisted_26 = ["disabled"];
const _hoisted_27 = {
  class: "version-dialog version-details"
};
const _hoisted_28 = {
  class: "detail-section"
};
const _hoisted_29 = {
  key: 0,
  class: "status-published"
};
const _hoisted_30 = {
  key: 1,
  class: "status-deprecated"
};
const _hoisted_31 = {
  key: 2,
  class: "status-draft"
};
const _hoisted_32 = {
  key: 0,
  class: "detail-section"
};
const _hoisted_33 = {
  key: 1,
  class: "detail-section"
};
const _hoisted_34 = {
  class: "dialog-actions"
};
const _hoisted_35 = {
  key: 0,
  class: "migration-progress"
};
const _hoisted_36 = {
  class: "progress-content"
};
const _hoisted_37 = {
  class: "progress-bar"
};
const _hoisted_38 = {
  key: 0,
  class: "changelog"
};
const _hoisted_39 = {
  class: "changelog-list"
};
const _hoisted_40 = {
  class: "changelog-header"
};
const _hoisted_41 = {
  class: "changelog-version"
};
const _hoisted_42 = {
  class: "changelog-date"
};
const _hoisted_43 = {
  class: "changelog-content"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "TemplateVersion",
  props: {
    template: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    showChangelog: {
      type: Boolean,
      required: false,
      default: true
    },
    autoMigrate: {
      type: Boolean,
      required: false,
      default: false
    },
    enableBackup: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["versionCreated", "versionSwitched", "versionMigrated", "versionDeprecated"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const {
      versionState,
      // versionedTemplate, // Removing unused variable
      isMigrating,
      createVersion,
      switchVersion,
      deprecate,
      getVersionHistory,
      restoreBackup
    } = useTemplateVersion(props.template, {
      autoMigrate: props.autoMigrate,
      enableBackup: props.enableBackup
    });
    const showVersionHistory = ref(false);
    const showCreateVersion = ref(false);
    const selectedVersion = ref(null);
    const versionHistory = ref([]);
    const migrationProgress = ref(0);
    const migrationMessage = ref("");
    const changelog = ref([]);
    const newVersion = ref({
      version: "",
      description: "",
      changeType: "minor",
      autoMigrate: false,
      migrationNotes: ""
    });
    const versionError = ref("");
    const loadVersionHistory = () => {
      versionHistory.value = getVersionHistory();
    };
    const validateVersion = () => {
      const pattern = /^\d+\.\d+\.\d+$/;
      if (!pattern.test(newVersion.value.version)) {
        versionError.value = "\u7248\u672C\u53F7\u683C\u5F0F\u9519\u8BEF\uFF0C\u5E94\u4E3A x.y.z";
      } else if (versionHistory.value.some((v) => v.version.version === newVersion.value.version)) {
        versionError.value = "\u7248\u672C\u53F7\u5DF2\u5B58\u5728";
      } else {
        versionError.value = "";
      }
    };
    const handleCreateVersion = () => {
      if (versionError.value || !newVersion.value.version) return;
      const changes = {
        // 这里可以根据实际需求收集变更内容
        ...props.template
      };
      const versionInfo = {
        description: newVersion.value.description,
        author: "Current User",
        // 实际应该从用户系统获取
        changes: {
          type: newVersion.value.changeType,
          notes: newVersion.value.migrationNotes
        }
      };
      const created = createVersion(newVersion.value.version, changes, versionInfo);
      if (created) {
        emit("versionCreated", created);
        showCreateVersion.value = false;
        loadVersionHistory();
        newVersion.value = {
          version: "",
          description: "",
          changeType: "minor",
          autoMigrate: false,
          migrationNotes: ""
        };
      }
    };
    const handleSwitchVersion = async (version) => {
      const success = await switchVersion(version);
      if (success) {
        emit("versionSwitched", version);
        loadVersionHistory();
      }
    };
    const handleDeprecateVersion = (version) => {
      const reason = window.prompt("\u8BF7\u8F93\u5165\u5E9F\u5F03\u539F\u56E0:");
      if (!reason) return;
      const alternative = window.prompt("\u63A8\u8350\u7684\u66FF\u4EE3\u7248\u672C (\u53EF\u9009):");
      deprecate(version, reason, alternative || void 0);
      emit("versionDeprecated", version);
      loadVersionHistory();
    };
    const handleRestoreVersion = (_version) => {
      const restored = restoreBackup();
      if (restored) {
        loadVersionHistory();
      }
    };
    const showVersionDetails = (version) => {
      selectedVersion.value = version;
    };
    const canRestoreVersion = (version) => {
      return !props.readonly && version.version.version !== versionState.current && !version.version.deprecated;
    };
    const formatDate = (date) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    watch(isMigrating, (migrating) => {
      if (migrating) {
        migrationProgress.value = 0;
        migrationMessage.value = "\u51C6\u5907\u8FC1\u79FB...";
        const interval = setInterval(() => {
          migrationProgress.value += 10;
          if (migrationProgress.value >= 90) {
            migrationMessage.value = "\u5B8C\u6210\u8FC1\u79FB...";
            clearInterval(interval);
          } else if (migrationProgress.value >= 60) {
            migrationMessage.value = "\u5E94\u7528\u53D8\u66F4...";
          } else if (migrationProgress.value >= 30) {
            migrationMessage.value = "\u9A8C\u8BC1\u6570\u636E...";
          }
        }, 200);
      }
    });
    loadVersionHistory();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [createCommentVNode(" \u7248\u672C\u4FE1\u606F\u5934\u90E8 "), createElementVNode("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [_cache[12] || (_cache[12] = createElementVNode(
        "span",
        {
          class: "version-label"
        },
        "\u5F53\u524D\u7248\u672C:",
        -1
        /* CACHED */
      )), createElementVNode(
        "span",
        _hoisted_4,
        toDisplayString(unref(versionState).current),
        1
        /* TEXT */
      ), unref(versionState).isDeprecated ? (openBlock(), createElementBlock("span", _hoisted_5, "\u5DF2\u5E9F\u5F03")) : createCommentVNode("v-if", true), unref(versionState).hasUpdate ? (openBlock(), createElementBlock("span", _hoisted_6, "\u6709\u65B0\u7248\u672C")) : createCommentVNode("v-if", true)]), createElementVNode("div", _hoisted_7, [createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = ($event) => showVersionHistory.value = !showVersionHistory.value)
      }, " \u7248\u672C\u5386\u53F2 "), !_ctx.readonly ? (openBlock(), createElementBlock("button", {
        key: 0,
        onClick: _cache[1] || (_cache[1] = ($event) => showCreateVersion.value = true)
      }, " \u521B\u5EFA\u65B0\u7248\u672C ")) : createCommentVNode("v-if", true)])]), createCommentVNode(" \u7248\u672C\u5386\u53F2\u9762\u677F "), createVNode(Transition, {
        name: "slide"
      }, {
        default: withCtx(() => [showVersionHistory.value ? (openBlock(), createElementBlock("div", _hoisted_8, [_cache[13] || (_cache[13] = createElementVNode(
          "h3",
          null,
          "\u7248\u672C\u5386\u53F2",
          -1
          /* CACHED */
        )), createElementVNode("div", _hoisted_9, [(openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList(versionHistory.value, (version) => {
            return openBlock(), createElementBlock(
              "div",
              {
                key: version.version.version,
                class: normalizeClass(["version-item", {
                  active: version.version.version === unref(versionState).current,
                  deprecated: version.version.deprecated
                }])
              },
              [createElementVNode("div", _hoisted_10, [createElementVNode(
                "span",
                _hoisted_11,
                toDisplayString(version.version.version),
                1
                /* TEXT */
              ), createElementVNode(
                "span",
                _hoisted_12,
                toDisplayString(formatDate(version.version.createdAt)),
                1
                /* TEXT */
              )]), version.version.description ? (openBlock(), createElementBlock(
                "div",
                _hoisted_13,
                toDisplayString(version.version.description),
                1
                /* TEXT */
              )) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_14, [createElementVNode("button", {
                disabled: version.version.version === unref(versionState).current,
                onClick: ($event) => handleSwitchVersion(version.version.version)
              }, " \u5207\u6362\u5230\u6B64\u7248\u672C ", 8, _hoisted_15), !_ctx.readonly && !version.version.deprecated ? (openBlock(), createElementBlock("button", {
                key: 0,
                onClick: ($event) => handleDeprecateVersion(version.version.version)
              }, " \u5E9F\u5F03 ", 8, _hoisted_16)) : createCommentVNode("v-if", true), createElementVNode("button", {
                onClick: ($event) => showVersionDetails(version)
              }, " \u8BE6\u60C5 ", 8, _hoisted_17)])],
              2
              /* CLASS */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))])])) : createCommentVNode("v-if", true)]),
        _: 1
        /* STABLE */
      }), createCommentVNode(" \u521B\u5EFA\u65B0\u7248\u672C\u5BF9\u8BDD\u6846 "), createVNode(Transition, {
        name: "fade"
      }, {
        default: withCtx(() => [showCreateVersion.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "version-dialog-overlay",
          onClick: _cache[8] || (_cache[8] = withModifiers(($event) => showCreateVersion.value = false, ["self"]))
        }, [createElementVNode("div", _hoisted_18, [_cache[20] || (_cache[20] = createElementVNode(
          "h3",
          null,
          "\u521B\u5EFA\u65B0\u7248\u672C",
          -1
          /* CACHED */
        )), createElementVNode("div", _hoisted_19, [_cache[14] || (_cache[14] = createElementVNode(
          "label",
          null,
          "\u7248\u672C\u53F7:",
          -1
          /* CACHED */
        )), withDirectives(createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => newVersion.value.version = $event),
            placeholder: "\u4F8B\u5982: 1.1.0",
            onInput: validateVersion
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [[vModelText, newVersion.value.version]]), versionError.value ? (openBlock(), createElementBlock(
          "span",
          _hoisted_20,
          toDisplayString(versionError.value),
          1
          /* TEXT */
        )) : createCommentVNode("v-if", true)]), createElementVNode("div", _hoisted_21, [_cache[15] || (_cache[15] = createElementVNode(
          "label",
          null,
          "\u63CF\u8FF0:",
          -1
          /* CACHED */
        )), withDirectives(createElementVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => newVersion.value.description = $event),
            placeholder: "\u7248\u672C\u66F4\u65B0\u8BF4\u660E...",
            rows: "4"
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vModelText, newVersion.value.description]])]), createElementVNode("div", _hoisted_22, [_cache[17] || (_cache[17] = createElementVNode(
          "label",
          null,
          "\u53D8\u66F4\u7C7B\u578B:",
          -1
          /* CACHED */
        )), withDirectives(createElementVNode(
          "select",
          {
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => newVersion.value.changeType = $event)
          },
          [..._cache[16] || (_cache[16] = [createElementVNode(
            "option",
            {
              value: "major"
            },
            " \u4E3B\u8981\u7248\u672C (\u4E0D\u517C\u5BB9\u7684\u53D8\u66F4) ",
            -1
            /* CACHED */
          ), createElementVNode(
            "option",
            {
              value: "minor"
            },
            " \u6B21\u8981\u7248\u672C (\u65B0\u529F\u80FD) ",
            -1
            /* CACHED */
          ), createElementVNode(
            "option",
            {
              value: "patch"
            },
            " \u8865\u4E01\u7248\u672C (Bug\u4FEE\u590D) ",
            -1
            /* CACHED */
          )])],
          512
          /* NEED_PATCH */
        ), [[vModelSelect, newVersion.value.changeType]])]), createElementVNode("div", _hoisted_23, [createElementVNode("label", null, [withDirectives(createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => newVersion.value.autoMigrate = $event),
            type: "checkbox"
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vModelCheckbox, newVersion.value.autoMigrate]]), _cache[18] || (_cache[18] = createTextVNode(
          " \u542F\u7528\u81EA\u52A8\u8FC1\u79FB ",
          -1
          /* CACHED */
        ))])]), newVersion.value.autoMigrate ? (openBlock(), createElementBlock("div", _hoisted_24, [_cache[19] || (_cache[19] = createElementVNode(
          "label",
          null,
          "\u8FC1\u79FB\u8BF4\u660E:",
          -1
          /* CACHED */
        )), withDirectives(createElementVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => newVersion.value.migrationNotes = $event),
            placeholder: "\u8FC1\u79FB\u6CE8\u610F\u4E8B\u9879...",
            rows: "3"
          },
          null,
          512
          /* NEED_PATCH */
        ), [[vModelText, newVersion.value.migrationNotes]])])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_25, [createElementVNode("button", {
          onClick: _cache[7] || (_cache[7] = ($event) => showCreateVersion.value = false)
        }, " \u53D6\u6D88 "), createElementVNode("button", {
          disabled: !!versionError.value || !newVersion.value.version,
          class: "primary",
          onClick: handleCreateVersion
        }, " \u521B\u5EFA\u7248\u672C ", 8, _hoisted_26)])])])) : createCommentVNode("v-if", true)]),
        _: 1
        /* STABLE */
      }), createCommentVNode(" \u7248\u672C\u8BE6\u60C5\u5BF9\u8BDD\u6846 "), createVNode(Transition, {
        name: "fade"
      }, {
        default: withCtx(() => [selectedVersion.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "version-dialog-overlay",
          onClick: _cache[11] || (_cache[11] = withModifiers(($event) => selectedVersion.value = null, ["self"]))
        }, [createElementVNode("div", _hoisted_27, [createElementVNode(
          "h3",
          null,
          "\u7248\u672C\u8BE6\u60C5 - " + toDisplayString(selectedVersion.value.version.version),
          1
          /* TEXT */
        ), createElementVNode("div", _hoisted_28, [_cache[25] || (_cache[25] = createElementVNode(
          "h4",
          null,
          "\u57FA\u672C\u4FE1\u606F",
          -1
          /* CACHED */
        )), createElementVNode("dl", null, [_cache[21] || (_cache[21] = createElementVNode(
          "dt",
          null,
          "\u7248\u672C\u53F7:",
          -1
          /* CACHED */
        )), createElementVNode(
          "dd",
          null,
          toDisplayString(selectedVersion.value.version.version),
          1
          /* TEXT */
        ), _cache[22] || (_cache[22] = createElementVNode(
          "dt",
          null,
          "\u521B\u5EFA\u65F6\u95F4:",
          -1
          /* CACHED */
        )), createElementVNode(
          "dd",
          null,
          toDisplayString(formatDate(selectedVersion.value.version.createdAt)),
          1
          /* TEXT */
        ), _cache[23] || (_cache[23] = createElementVNode(
          "dt",
          null,
          "\u4F5C\u8005:",
          -1
          /* CACHED */
        )), createElementVNode(
          "dd",
          null,
          toDisplayString(selectedVersion.value.version.author || "\u672A\u77E5"),
          1
          /* TEXT */
        ), _cache[24] || (_cache[24] = createElementVNode(
          "dt",
          null,
          "\u72B6\u6001:",
          -1
          /* CACHED */
        )), createElementVNode("dd", null, [selectedVersion.value.version.published ? (openBlock(), createElementBlock("span", _hoisted_29, "\u5DF2\u53D1\u5E03")) : selectedVersion.value.version.deprecated ? (openBlock(), createElementBlock("span", _hoisted_30, "\u5DF2\u5E9F\u5F03")) : (openBlock(), createElementBlock("span", _hoisted_31, "\u8349\u7A3F"))])])]), selectedVersion.value.version.description ? (openBlock(), createElementBlock("div", _hoisted_32, [_cache[26] || (_cache[26] = createElementVNode(
          "h4",
          null,
          "\u63CF\u8FF0",
          -1
          /* CACHED */
        )), createElementVNode(
          "p",
          null,
          toDisplayString(selectedVersion.value.version.description),
          1
          /* TEXT */
        )])) : createCommentVNode("v-if", true), selectedVersion.value.changelog && selectedVersion.value.changelog.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_33, [_cache[27] || (_cache[27] = createElementVNode(
          "h4",
          null,
          "\u53D8\u66F4\u5185\u5BB9",
          -1
          /* CACHED */
        )), createElementVNode(
          "pre",
          null,
          toDisplayString(JSON.stringify(selectedVersion.value.changelog[0].changes, null, 2)),
          1
          /* TEXT */
        )])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_34, [createElementVNode("button", {
          onClick: _cache[9] || (_cache[9] = ($event) => selectedVersion.value = null)
        }, " \u5173\u95ED "), canRestoreVersion(selectedVersion.value) ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "primary",
          onClick: _cache[10] || (_cache[10] = ($event) => handleRestoreVersion(selectedVersion.value))
        }, " \u6062\u590D\u6B64\u7248\u672C ")) : createCommentVNode("v-if", true)])])])) : createCommentVNode("v-if", true)]),
        _: 1
        /* STABLE */
      }), createCommentVNode(" \u8FC1\u79FB\u8FDB\u5EA6 "), createVNode(Transition, {
        name: "fade"
      }, {
        default: withCtx(() => [unref(isMigrating) ? (openBlock(), createElementBlock("div", _hoisted_35, [createElementVNode("div", _hoisted_36, [_cache[28] || (_cache[28] = createElementVNode(
          "h4",
          null,
          "\u6B63\u5728\u8FC1\u79FB\u7248\u672C...",
          -1
          /* CACHED */
        )), createElementVNode("div", _hoisted_37, [createElementVNode(
          "div",
          {
            class: "progress-fill",
            style: normalizeStyle({
              width: `${migrationProgress.value}%`
            })
          },
          null,
          4
          /* STYLE */
        )]), createElementVNode(
          "p",
          null,
          toDisplayString(migrationMessage.value),
          1
          /* TEXT */
        )])])) : createCommentVNode("v-if", true)]),
        _: 1
        /* STABLE */
      }), createCommentVNode(" \u53D8\u66F4\u65E5\u5FD7 "), _ctx.showChangelog && changelog.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_38, [_cache[29] || (_cache[29] = createElementVNode(
        "h3",
        null,
        "\u53D8\u66F4\u65E5\u5FD7",
        -1
        /* CACHED */
      )), createElementVNode("div", _hoisted_39, [(openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(changelog.value, (log) => {
          return openBlock(), createElementBlock("div", {
            key: log.id,
            class: "changelog-item"
          }, [createElementVNode("div", _hoisted_40, [createElementVNode(
            "span",
            _hoisted_41,
            toDisplayString(log.version),
            1
            /* TEXT */
          ), createElementVNode(
            "span",
            _hoisted_42,
            toDisplayString(formatDate(log.date)),
            1
            /* TEXT */
          )]), createElementVNode(
            "div",
            _hoisted_43,
            toDisplayString(log.content),
            1
            /* TEXT */
          )]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))])])) : createCommentVNode("v-if", true)]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateVersion.vue2.js.map
