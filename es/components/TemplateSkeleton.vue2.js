/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, computed, createElementBlock, openBlock, normalizeClass, createCommentVNode, createElementVNode, Fragment, renderList, normalizeStyle, createStaticVNode, renderSlot } from 'vue';

const _hoisted_1 = {
  key: 0,
  class: "skeleton-default"
};
const _hoisted_2 = {
  key: 0,
  class: "skeleton-header"
};
const _hoisted_3 = {
  class: "skeleton-content"
};
const _hoisted_4 = {
  class: "skeleton-list"
};
const _hoisted_5 = {
  key: 0,
  class: "skeleton-avatar"
};
const _hoisted_6 = {
  class: "skeleton-article"
};
const _hoisted_7 = {
  class: "skeleton-paragraph"
};
const _hoisted_8 = {
  class: "skeleton-paragraph"
};
const _hoisted_9 = {
  class: "skeleton-form"
};
const _hoisted_10 = {
  class: "skeleton-custom"
};
var script = /* @__PURE__ */ defineComponent({
  __name: "TemplateSkeleton",
  props: {
    type: {
      type: String,
      required: false,
      default: "default"
    },
    animation: {
      type: String,
      required: false,
      default: "pulse"
    },
    rows: {
      type: Number,
      required: false,
      default: 3
    },
    avatar: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: Boolean,
      required: false,
      default: true
    },
    class: {
      type: String,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const skeletonClass = computed(() => {
      const classes = ["template-skeleton"];
      if (props.animation !== "none") {
        classes.push(`skeleton-${props.animation}`);
      }
      if (props.class) {
        classes.push(props.class);
      }
      return classes.join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          class: normalizeClass(skeletonClass.value)
        },
        [createCommentVNode(" Default skeleton "), _ctx.type === "default" ? (openBlock(), createElementBlock("div", _hoisted_1, [_ctx.title ? (openBlock(), createElementBlock("div", _hoisted_2, [..._cache[0] || (_cache[0] = [createElementVNode(
          "div",
          {
            class: "skeleton-line skeleton-title"
          },
          null,
          -1
          /* CACHED */
        )])])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_3, [(openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList(_ctx.rows, (i) => {
            return openBlock(), createElementBlock(
              "div",
              {
                key: i,
                class: "skeleton-line",
                style: normalizeStyle({
                  width: `${100 - i * 10}%`
                })
              },
              null,
              4
              /* STYLE */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))])])) : _ctx.type === "card" ? (openBlock(), createElementBlock(
          Fragment,
          {
            key: 1
          },
          [createCommentVNode(" Card skeleton "), _cache[1] || (_cache[1] = createStaticVNode('<div class="skeleton-card" data-v-00604b97><div class="skeleton-card-image" data-v-00604b97></div><div class="skeleton-card-body" data-v-00604b97><div class="skeleton-line skeleton-title" data-v-00604b97></div><div class="skeleton-line skeleton-subtitle" data-v-00604b97></div><div class="skeleton-line skeleton-text" data-v-00604b97></div><div class="skeleton-line skeleton-text" style="width:60%;" data-v-00604b97></div></div></div>', 1))],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )) : _ctx.type === "list" ? (openBlock(), createElementBlock(
          Fragment,
          {
            key: 2
          },
          [createCommentVNode(" List skeleton "), createElementVNode("div", _hoisted_4, [(openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList(_ctx.rows, (i) => {
              return openBlock(), createElementBlock("div", {
                key: i,
                class: "skeleton-list-item"
              }, [_ctx.avatar ? (openBlock(), createElementBlock("div", _hoisted_5)) : createCommentVNode("v-if", true), _cache[2] || (_cache[2] = createElementVNode(
                "div",
                {
                  class: "skeleton-list-content"
                },
                [createElementVNode("div", {
                  class: "skeleton-line skeleton-title"
                }), createElementVNode("div", {
                  class: "skeleton-line skeleton-text"
                })],
                -1
                /* CACHED */
              ))]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))])],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )) : _ctx.type === "article" ? (openBlock(), createElementBlock(
          Fragment,
          {
            key: 3
          },
          [createCommentVNode(" Article skeleton "), createElementVNode("div", _hoisted_6, [_cache[3] || (_cache[3] = createElementVNode(
            "div",
            {
              class: "skeleton-line skeleton-h1"
            },
            null,
            -1
            /* CACHED */
          )), _cache[4] || (_cache[4] = createElementVNode(
            "div",
            {
              class: "skeleton-line skeleton-meta"
            },
            null,
            -1
            /* CACHED */
          )), createElementVNode("div", _hoisted_7, [(openBlock(), createElementBlock(
            Fragment,
            null,
            renderList(5, (i) => {
              return createElementVNode("div", {
                key: `p1-${i}`,
                class: "skeleton-line"
              });
            }),
            64
            /* STABLE_FRAGMENT */
          ))]), createElementVNode("div", _hoisted_8, [(openBlock(), createElementBlock(
            Fragment,
            null,
            renderList(4, (i) => {
              return createElementVNode("div", {
                key: `p2-${i}`,
                class: "skeleton-line"
              });
            }),
            64
            /* STABLE_FRAGMENT */
          ))])])],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )) : _ctx.type === "form" ? (openBlock(), createElementBlock(
          Fragment,
          {
            key: 4
          },
          [createCommentVNode(" Form skeleton "), createElementVNode("div", _hoisted_9, [(openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList(_ctx.rows, (i) => {
              return openBlock(), createElementBlock("div", {
                key: i,
                class: "skeleton-form-group"
              }, [..._cache[5] || (_cache[5] = [createElementVNode(
                "div",
                {
                  class: "skeleton-line skeleton-label"
                },
                null,
                -1
                /* CACHED */
              ), createElementVNode(
                "div",
                {
                  class: "skeleton-line skeleton-input"
                },
                null,
                -1
                /* CACHED */
              )])]);
            }),
            128
            /* KEYED_FRAGMENT */
          )), _cache[6] || (_cache[6] = createElementVNode(
            "div",
            {
              class: "skeleton-form-actions"
            },
            [createElementVNode("div", {
              class: "skeleton-button"
            }), createElementVNode("div", {
              class: "skeleton-button skeleton-button-secondary"
            })],
            -1
            /* CACHED */
          ))])],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )) : _ctx.type === "custom" ? (openBlock(), createElementBlock(
          Fragment,
          {
            key: 5
          },
          [createCommentVNode(" Custom skeleton "), createElementVNode("div", _hoisted_10, [renderSlot(_ctx.$slots, "default")])],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )) : createCommentVNode("v-if", true)],
        2
        /* CLASS */
      );
    };
  }
});

export { script as default };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateSkeleton.vue2.js.map
