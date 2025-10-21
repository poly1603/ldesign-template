/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, computed, watch, onBeforeUnmount, createElementBlock, openBlock, normalizeClass, createCommentVNode, createBlock, createElementVNode, resolveDynamicComponent, unref, renderSlot, normalizeProps, mergeProps, Fragment, renderList, toDisplayString } from 'vue';
import { useTemplateInheritance } from '../composables/useTemplateInheritance.js';

const _hoisted_1 = {
  class: "template-content"
};
const _hoisted_2 = {
  key: 2,
  class: "inheritance-debug"
};
const _hoisted_3 = {
  class: "debug-info"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "InheritableTemplate",
  props: {
    template: {
      type: Object,
      required: true
    },
    extends: {
      type: [Object, String],
      required: false
    },
    mixins: {
      type: Array,
      required: false,
      default: () => []
    },
    mergeStrategy: {
      type: Object,
      required: false,
      default: () => ({})
    },
    blocks: {
      type: Array,
      required: false,
      default: () => []
    },
    blockOverrides: {
      type: Object,
      required: false,
      default: () => ({})
    },
    componentProps: {
      type: Object,
      required: false,
      default: () => ({})
    },
    contentProps: {
      type: Object,
      required: false,
      default: () => ({})
    },
    showDebug: {
      type: Boolean,
      required: false,
      default: false
    },
    autoRegister: {
      type: Boolean,
      required: false,
      default: true
    },
    className: {
      type: String,
      required: false
    },
    maxDepth: {
      type: Number,
      required: false,
      default: 10
    }
  },
  emits: ["inherited", "blockOverride", "depthExceeded"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    const props = __props;
    const emit = __emit;
    const {
      template: processedTemplate,
      isInherited,
      inheritanceChain,
      blocks,
      // context, // Removing unused variable
      defineBlock,
      overrideBlock,
      getBlock,
      renderBlock,
      getDepth,
      cleanup
    } = useTemplateInheritance(props.template, {
      extends: props.extends,
      mixins: props.mixins,
      mergeStrategy: props.mergeStrategy,
      allowOverride: true,
      maxDepth: props.maxDepth,
      autoRegister: props.autoRegister,
      enableBlocks: true,
      blockOverrides: props.blockOverrides,
      trackChain: props.showDebug
    });
    if (props.blocks.length > 0) {
      props.blocks.forEach((block) => {
        defineBlock(block);
      });
    }
    const cssClasses = computed(() => {
      const classes = [];
      if (props.className) {
        classes.push(props.className);
      }
      if (isInherited.value) {
        classes.push("is-inherited");
      }
      if (props.extends) {
        classes.push("has-parent");
      }
      if (props.mixins.length > 0) {
        classes.push("has-mixins");
      }
      return classes;
    });
    const inheritedContent = computed(() => {
      if (!isInherited.value) {
        return null;
      }
      return processedTemplate.value.component;
    });
    const depth = computed(() => getDepth());
    const hasBlock = (name) => {
      return blocks.has(name);
    };
    watch(() => processedTemplate.value, (newTemplate) => {
      if (isInherited.value) {
        emit("inherited", newTemplate);
      }
    });
    watch(depth, (newDepth) => {
      if (newDepth > props.maxDepth) {
        emit("depthExceeded", newDepth);
      }
    });
    __expose({
      /**
       * 覆盖块
       */
      overrideBlock: (name, content) => {
        const success = overrideBlock(name, content);
        emit("blockOverride", name, success);
        return success;
      },
      /**
       * 获取块
       */
      getBlock,
      /**
       * 获取处理后的模板
       */
      getProcessedTemplate: () => processedTemplate.value,
      /**
       * 获取继承链
       */
      getInheritanceChain: () => inheritanceChain.value,
      /**
       * 获取深度
       */
      getDepth
    });
    onBeforeUnmount(() => {
      cleanup();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          class: normalizeClass(["inheritable-template", cssClasses.value])
        },
        [createCommentVNode(" \u5934\u90E8\u5757 "), hasBlock("header") ? (openBlock(), createBlock(resolveDynamicComponent(unref(renderBlock)("header")), {
          key: 0
        })) : createCommentVNode("v-if", true), createCommentVNode(" \u4E3B\u5185\u5BB9 "), createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "before-content"), createCommentVNode(" \u7EE7\u627F\u7684\u5185\u5BB9 "), inheritedContent.value ? (openBlock(), createBlock(
          resolveDynamicComponent(inheritedContent.value),
          normalizeProps(mergeProps({
            key: 0
          }, _ctx.contentProps)),
          null,
          16
          /* FULL_PROPS */
        )) : (openBlock(), createElementBlock(
          Fragment,
          {
            key: 1
          },
          [createCommentVNode(" \u9ED8\u8BA4\u5185\u5BB9 "), renderSlot(_ctx.$slots, "default", {}, () => [_ctx.template.component ? (openBlock(), createBlock(
            resolveDynamicComponent(_ctx.template.component),
            normalizeProps(mergeProps({
              key: 0
            }, _ctx.componentProps)),
            null,
            16
            /* FULL_PROPS */
          )) : createCommentVNode("v-if", true)])],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )), renderSlot(_ctx.$slots, "after-content")]), createCommentVNode(" \u5E95\u90E8\u5757 "), hasBlock("footer") ? (openBlock(), createBlock(resolveDynamicComponent(unref(renderBlock)("footer")), {
          key: 1
        })) : createCommentVNode("v-if", true), createCommentVNode(" \u8C03\u8BD5\u4FE1\u606F "), _ctx.showDebug ? (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [_cache[0] || (_cache[0] = createElementVNode(
          "h4",
          null,
          "Inheritance Chain",
          -1
          /* CACHED */
        )), createElementVNode("ul", null, [(openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList(unref(inheritanceChain), (item, index) => {
            return openBlock(), createElementBlock(
              "li",
              {
                key: index
              },
              toDisplayString(item),
              1
              /* TEXT */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))]), createElementVNode(
          "p",
          null,
          "Depth: " + toDisplayString(depth.value),
          1
          /* TEXT */
        ), createElementVNode(
          "p",
          null,
          "Is Inherited: " + toDisplayString(unref(isInherited)),
          1
          /* TEXT */
        )])])) : createCommentVNode("v-if", true)],
        2
        /* CLASS */
      );
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=InheritableTemplate.vue2.js.map
