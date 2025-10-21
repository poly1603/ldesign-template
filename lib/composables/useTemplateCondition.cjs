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

var vue = require('vue');

function useTemplateCondition(conditions = [], context = {}) {
  const contextRef = vue.ref(context);
  const selectedTemplate = vue.ref(null);
  const evaluating = vue.ref(false);
  const lastEvaluation = vue.ref(null);
  const evaluateConditions = async () => {
    evaluating.value = true;
    try {
      const enabledConditions = conditions.filter((c) => c.enabled !== false);
      const sortedConditions = [...enabledConditions].sort((a, b) => (b.priority || 0) - (a.priority || 0));
      for (const condition of sortedConditions) {
        try {
          const result = await condition.test(contextRef.value);
          if (result) {
            lastEvaluation.value = /* @__PURE__ */ new Date();
            return condition.template;
          }
        } catch (error) {
          console.error(`Error evaluating condition ${condition.id}:`, error);
        }
      }
      return null;
    } finally {
      evaluating.value = false;
    }
  };
  const selectTemplate = async () => {
    const template = await evaluateConditions();
    selectedTemplate.value = template;
    return template;
  };
  const reevaluate = () => {
    return selectTemplate();
  };
  vue.watch(contextRef, () => {
    selectTemplate();
  }, {
    deep: true
  });
  vue.onMounted(() => {
    selectTemplate();
  });
  return {
    selectedTemplate: vue.computed(() => selectedTemplate.value),
    evaluating: vue.computed(() => evaluating.value),
    lastEvaluation: vue.computed(() => lastEvaluation.value),
    context: contextRef,
    selectTemplate,
    reevaluate
  };
}
function useTemplateABTest(config, userId) {
  const currentVariant = vue.ref(null);
  const testResult = vue.ref(null);
  const isActive = vue.ref(false);
  const checkActive = () => {
    if (!config.enabled) return false;
    const now = /* @__PURE__ */ new Date();
    if (config.startDate && now < config.startDate) return false;
    if (config.endDate && now > config.endDate) return false;
    return true;
  };
  const assignByHash = () => {
    const seed = config.seed || config.id;
    const hash = hashCode(`${seed}-${userId || Math.random()}`);
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0);
    let threshold = 0;
    const normalizedHash = Math.abs(hash % totalWeight);
    for (const variant of config.variants) {
      threshold += variant.weight;
      if (normalizedHash < threshold) {
        return variant;
      }
    }
    return config.variants[0];
  };
  const assignByWeight = () => {
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0);
    const random = Math.random() * totalWeight;
    let threshold = 0;
    for (const variant of config.variants) {
      threshold += variant.weight;
      if (random < threshold) {
        return variant;
      }
    }
    return config.variants[0];
  };
  const assignRandomly = () => {
    const index = Math.floor(Math.random() * config.variants.length);
    return config.variants[index];
  };
  const assignVariant = () => {
    const strategy = config.strategy || "random";
    switch (strategy) {
      case "hash":
        return assignByHash();
      case "weighted":
        return assignByWeight();
      case "random":
      default:
        return assignRandomly();
    }
  };
  const runTest = () => {
    isActive.value = checkActive();
    if (!isActive.value) return null;
    const variant = assignVariant();
    currentVariant.value = variant;
    const result = {
      variant,
      testId: config.id,
      reason: `Assigned by ${config.strategy || "random"} strategy`,
      timestamp: Date.now()
    };
    testResult.value = result;
    if (userId) {
      try {
        const key = `ab-test-${config.id}-${userId}`;
        localStorage.setItem(key, JSON.stringify(result));
      } catch (error) {
        console.error("Failed to save A/B test result:", error);
      }
    }
    return result;
  };
  const getSavedResult = () => {
    if (!userId) return null;
    try {
      const key = `ab-test-${config.id}-${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load saved A/B test result:", error);
    }
    return null;
  };
  const trackMetric = (metric, value) => {
    if (!currentVariant.value) return;
    const event = {
      testId: config.id,
      variantId: currentVariant.value.id,
      metric,
      value,
      timestamp: Date.now(),
      userId
    };
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ab-test-metric", {
        detail: event
      }));
    }
  };
  vue.onMounted(() => {
    const saved = getSavedResult();
    if (saved && checkActive()) {
      const variant = config.variants.find((v) => v.id === saved.variant.id);
      if (variant) {
        currentVariant.value = variant;
        testResult.value = saved;
        isActive.value = true;
        return;
      }
    }
    runTest();
  });
  return {
    variant: vue.computed(() => currentVariant.value),
    template: vue.computed(() => currentVariant.value?.template || null),
    isActive: vue.computed(() => isActive.value),
    result: vue.computed(() => testResult.value),
    runTest,
    trackMetric
  };
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}
const TEMPLATE_CONDITIONS = {
  /** 新用户条件 */
  isNewUser: (template) => ({
    id: "new-user",
    test: (ctx) => ctx.user?.isNewUser === true,
    template,
    description: "\u65B0\u7528\u6237",
    priority: 10
  }),
  /** VIP用户条件 */
  isVipUser: (template) => ({
    id: "vip-user",
    test: (ctx) => ctx.user?.isVip === true,
    template,
    description: "VIP\u7528\u6237",
    priority: 20
  }),
  /** 设备条件 */
  isDevice: (device, template) => ({
    id: `device-${device}`,
    test: (ctx) => ctx.device?.type === device,
    template,
    description: `\u8BBE\u5907\u7C7B\u578B: ${device}`,
    priority: 5
  }),
  /** 时间段条件 */
  timeRange: (startHour, endHour, template) => ({
    id: `time-${startHour}-${endHour}`,
    test: (ctx) => {
      const hour = ctx.time?.hour ?? (/* @__PURE__ */ new Date()).getHours();
      return hour >= startHour && hour < endHour;
    },
    template,
    description: `\u65F6\u95F4\u6BB5: ${startHour}:00 - ${endHour}:00`,
    priority: 3
  }),
  /** 功能标记条件 */
  hasFeature: (feature, template) => ({
    id: `feature-${feature}`,
    test: (ctx) => ctx.features?.[feature] === true,
    template,
    description: `\u529F\u80FD: ${feature}`,
    priority: 15
  }),
  /** 语言条件 */
  isLanguage: (language, template) => ({
    id: `language-${language}`,
    test: (ctx) => ctx.geo?.language === language,
    template,
    description: `\u8BED\u8A00: ${language}`,
    priority: 8
  }),
  /** 自定义条件 */
  custom: (test, template, options) => ({
    id: options?.id || "custom",
    test,
    template,
    description: options?.description,
    priority: options?.priority || 0
  })
};
function createABTest(id, variants, options) {
  return {
    id,
    variants: variants.map((v, index) => ({
      id: `variant-${index}`,
      template: v.template,
      weight: v.weight || 1
    })),
    enabled: true,
    strategy: "weighted",
    ...options
  };
}

exports.TEMPLATE_CONDITIONS = TEMPLATE_CONDITIONS;
exports.createABTest = createABTest;
exports.useTemplateABTest = useTemplateABTest;
exports.useTemplateCondition = useTemplateCondition;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateCondition.cjs.map
