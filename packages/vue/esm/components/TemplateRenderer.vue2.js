/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, computed, watch, onMounted, createElementBlock, openBlock, createCommentVNode, unref, renderSlot, createElementVNode, Fragment, toDisplayString, createBlock, resolveDynamicComponent, normalizeProps, guardReactiveProps, createSlots, renderList, withCtx } from 'vue';
import { useTemplate } from '../composables/useTemplate.js';

const _hoisted_1 = {
  class: "template-renderer"
};
const _hoisted_2 = {
  key: 0,
  class: "template-renderer__loading"
};
const _hoisted_3 = {
  class: "template-renderer__error"
};
const _hoisted_4 = {
  class: "template-renderer__error-message"
};
const _hoisted_5 = {
  class: "template-renderer__error-detail"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "TemplateRenderer",
  props: {
    templateId: {
      type: String,
      required: true
    },
    props: {
      type: Object,
      required: false,
      default: () => ({})
    },
    fallback: {
      type: null,
      required: false
    },
    onLoad: {
      type: Function,
      required: false
    },
    onError: {
      type: Function,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const {
      component,
      loading,
      error,
      load
    } = useTemplate(computed(() => props.templateId), {
      immediate: false,
      onLoad: props.onLoad,
      onError: props.onError
    });
    watch(() => props.templateId, (newId) => {
      if (newId) {
        load(newId);
      }
    }, {
      immediate: true
    });
    onMounted(() => {
      if (props.templateId) {
        load(props.templateId);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [createCommentVNode(" \u52A0\u8F7D\u4E2D\u72B6\u6001 "), unref(loading) ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "loading", {}, () => [_cache[0] || (_cache[0] = createElementVNode(
        "div",
        {
          class: "template-renderer__spinner"
        },
        "\u52A0\u8F7D\u4E2D...",
        -1
        /* HOISTED */
      ))])])) : unref(error) ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 1
        },
        [createCommentVNode(" \u9519\u8BEF\u72B6\u6001 "), createElementVNode("div", _hoisted_3, [renderSlot(_ctx.$slots, "error", {
          error: unref(error)
        }, () => [createElementVNode("div", _hoisted_4, [_cache[1] || (_cache[1] = createElementVNode(
          "p",
          null,
          "\u6A21\u677F\u52A0\u8F7D\u5931\u8D25",
          -1
          /* HOISTED */
        )), createElementVNode(
          "p",
          _hoisted_5,
          toDisplayString(unref(error).message),
          1
          /* TEXT */
        )])])])],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : unref(component) ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 2
        },
        [createCommentVNode(" \u6E32\u67D3\u6A21\u677F\u7EC4\u4EF6 "), (openBlock(), createBlock(
          resolveDynamicComponent(unref(component)),
          normalizeProps(guardReactiveProps(props.props)),
          createSlots({
            _: 2
            /* DYNAMIC */
          }, [renderList(_ctx.$slots, (_, name) => {
            return {
              name,
              fn: withCtx((slotProps) => [renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps)))])
            };
          })]),
          1040
          /* FULL_PROPS, DYNAMIC_SLOTS */
        ))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : _ctx.fallback ? (openBlock(), createElementBlock(
        Fragment,
        {
          key: 3
        },
        [createCommentVNode(" \u540E\u5907\u5185\u5BB9 "), (openBlock(), createBlock(resolveDynamicComponent(_ctx.fallback)))],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : createCommentVNode("v-if", true)]);
    };
  }
});

export { script as default };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateRenderer.vue2.js.map
