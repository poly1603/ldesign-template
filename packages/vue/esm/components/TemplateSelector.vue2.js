/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, computed, createElementBlock, openBlock, createCommentVNode, unref, renderSlot, createTextVNode, Fragment, createElementVNode, renderList, normalizeClass, toDisplayString } from 'vue';
import { useTemplateList } from '../composables/useTemplateList.js';

const _hoisted_1 = {
  class: "template-selector"
};
const _hoisted_2 = {
  key: 0,
  class: "template-selector__loading"
};
const _hoisted_3 = {
  class: "template-selector__list"
};
const _hoisted_4 = ["onClick"];
const _hoisted_5 = {
  key: 0,
  class: "template-selector__preview"
};
const _hoisted_6 = ["src", "alt"];
const _hoisted_7 = {
  class: "template-selector__info"
};
const _hoisted_8 = {
  class: "template-selector__name"
};
const _hoisted_9 = {
  key: 0,
  class: "template-selector__description"
};
const _hoisted_10 = {
  key: 1,
  class: "template-selector__tags"
};
const _hoisted_11 = {
  key: 1,
  class: "template-selector__check"
};
const _hoisted_12 = {
  class: "template-selector__empty"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "TemplateSelector",
  props: {
    category: {
      type: String,
      required: true
    },
    device: {
      type: null,
      required: false
    },
    modelValue: {
      type: String,
      required: false
    },
    showPreview: {
      type: Boolean,
      required: false,
      default: true
    },
    showDescription: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, {
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const {
      templates,
      loading
    } = useTemplateList(computed(() => props.category), computed(() => props.device));
    function selectTemplate(id) {
      emit("update:modelValue", id);
      emit("change", id);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [createCommentVNode(" \u52A0\u8F7D\u72B6\u6001 "), unref(loading) ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "loading", {}, () => [_cache[0] || (_cache[0] = createTextVNode("\u52A0\u8F7D\u4E2D..."))])])) : unref(templates).length > 0 ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 1
        },
        [createCommentVNode(" \u6A21\u677F\u5217\u8868 "), createElementVNode("div", _hoisted_3, [(openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList(unref(templates), (template) => {
            return openBlock(), createElementBlock("div", {
              key: template.id,
              class: normalizeClass(["template-selector__item", {
                "is-active": _ctx.modelValue === template.id
              }]),
              onClick: ($event) => selectTemplate(template.id)
            }, [createCommentVNode(" \u9884\u89C8\u56FE "), _ctx.showPreview && template.preview ? (openBlock(), createElementBlock("div", _hoisted_5, [createElementVNode("img", {
              src: template.preview,
              alt: template.displayName || template.name
            }, null, 8, _hoisted_6)])) : createCommentVNode("v-if", true), createCommentVNode(" \u4FE1\u606F "), createElementVNode("div", _hoisted_7, [createElementVNode(
              "div",
              _hoisted_8,
              toDisplayString(template.displayName || template.name),
              1
              /* TEXT */
            ), _ctx.showDescription && template.description ? (openBlock(), createElementBlock(
              "div",
              _hoisted_9,
              toDisplayString(template.description),
              1
              /* TEXT */
            )) : createCommentVNode("v-if", true), createCommentVNode(" \u6807\u7B7E "), template.tags && template.tags.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_10, [(openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(template.tags, (tag) => {
                return openBlock(), createElementBlock(
                  "span",
                  {
                    key: tag,
                    class: "template-selector__tag"
                  },
                  toDisplayString(tag),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))])) : createCommentVNode("v-if", true)]), createCommentVNode(" \u9009\u4E2D\u6807\u8BC6 "), _ctx.modelValue === template.id ? (openBlock(), createElementBlock("div", _hoisted_11, " \u2713 ")) : createCommentVNode("v-if", true)], 10, _hoisted_4);
          }),
          128
          /* KEYED_FRAGMENT */
        ))])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (openBlock(), createElementBlock(
        Fragment,
        {
          key: 2
        },
        [createCommentVNode(" \u7A7A\u72B6\u6001 "), createElementVNode("div", _hoisted_12, [renderSlot(_ctx.$slots, "empty", {}, () => [_cache[1] || (_cache[1] = createTextVNode("\u6682\u65E0\u6A21\u677F"))])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      ))]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateSelector.vue2.js.map
