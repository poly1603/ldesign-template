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

const validators = {
  required: (value, rule) => {
    const isEmpty = value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
    if (typeof rule.required === "function") {
      return rule.required(value) ? !isEmpty : true;
    }
    return rule.required ? !isEmpty : true;
  },
  min: (value, rule) => {
    if (rule.min === void 0) return true;
    const num = Number(value);
    return !Number.isNaN(num) && num >= rule.min;
  },
  max: (value, rule) => {
    if (rule.max === void 0) return true;
    const num = Number(value);
    return !Number.isNaN(num) && num <= rule.max;
  },
  minLength: (value, rule) => {
    if (rule.minLength === void 0) return true;
    const len = String(value).length;
    return len >= rule.minLength;
  },
  maxLength: (value, rule) => {
    if (rule.maxLength === void 0) return true;
    const len = String(value).length;
    return len <= rule.maxLength;
  },
  pattern: (value, rule) => {
    if (!rule.pattern) return true;
    return rule.pattern.test(String(value));
  },
  email: (value, rule) => {
    if (!rule.email) return true;
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    return emailRegex.test(String(value));
  },
  url: (value, rule) => {
    if (!rule.url) return true;
    try {
      const _url = new URL(String(value));
      return !!_url;
    } catch {
      return false;
    }
  }
};
async function validateField(field, value, rules, data) {
  if (!rules) return null;
  const ruleArray = Array.isArray(rules) ? rules : [rules];
  for (const rule of ruleArray) {
    if (rule.custom) {
      const result = await rule.custom(value, data);
      if (result !== true) {
        return typeof result === "string" ? result : rule.message || "\u9A8C\u8BC1\u5931\u8D25";
      }
    }
    for (const [key, validator] of Object.entries(validators)) {
      if (key in rule) {
        const result = validator(value, rule);
        if (result !== true) {
          return rule.message || getDefaultMessage(key, rule);
        }
      }
    }
  }
  return null;
}
function getDefaultMessage(type, rule) {
  switch (type) {
    case "required":
      return "\u6B64\u5B57\u6BB5\u4E3A\u5FC5\u586B\u9879";
    case "min":
      return `\u503C\u5FC5\u987B\u5927\u4E8E\u6216\u7B49\u4E8E ${rule.min}`;
    case "max":
      return `\u503C\u5FC5\u987B\u5C0F\u4E8E\u6216\u7B49\u4E8E ${rule.max}`;
    case "minLength":
      return `\u957F\u5EA6\u81F3\u5C11\u4E3A ${rule.minLength} \u4E2A\u5B57\u7B26`;
    case "maxLength":
      return `\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7 ${rule.maxLength} \u4E2A\u5B57\u7B26`;
    case "pattern":
      return "\u683C\u5F0F\u4E0D\u6B63\u786E";
    case "email":
      return "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740";
    case "url":
      return "\u8BF7\u8F93\u5165\u6709\u6548\u7684URL";
    default:
      return "\u9A8C\u8BC1\u5931\u8D25";
  }
}
function useTemplateForm(options = {}) {
  const formData = vue.reactive(options.initialValues || {});
  const errors = vue.reactive(/* @__PURE__ */ new Map());
  const touched = vue.reactive(/* @__PURE__ */ new Set());
  const dirty = vue.ref(false);
  const validating = vue.ref(false);
  const submitting = vue.ref(false);
  let autoSaveTimer = null;
  const saveForm = async () => {
    if (!dirty.value) return;
    try {
      await options.onSave?.(formData);
      dirty.value = false;
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };
  const scheduleAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    autoSaveTimer = setTimeout(() => {
      saveForm();
    }, options.autoSaveDelay || 1e3);
  };
  const validateSingleField = async (field) => {
    const value = formData[field];
    const rules = options.rules?.[field];
    if (!rules) {
      errors.delete(field);
      return true;
    }
    validating.value = true;
    try {
      const error = await validateField(field, value, rules, formData);
      if (error) {
        errors.set(field, error);
        return false;
      } else {
        errors.delete(field);
        return true;
      }
    } finally {
      validating.value = false;
    }
  };
  const setFieldValue = (field, value) => {
    formData[field] = value;
    dirty.value = true;
    touched.add(field);
    if (options.validateOnChange) {
      validateSingleField(field);
    }
    if (options.autoSave) {
      scheduleAutoSave();
    }
  };
  const setValues = (values) => {
    Object.assign(formData, values);
    dirty.value = true;
    if (options.validateOnChange) {
      Object.keys(values).forEach((field) => {
        validateSingleField(field);
      });
    }
    if (options.autoSave) {
      scheduleAutoSave();
    }
  };
  const getFieldValue = (field) => {
    return formData[field];
  };
  const validate = async () => {
    if (!options.rules) return true;
    validating.value = true;
    errors.clear();
    try {
      const validationResults = await Promise.all(Object.entries(options.rules).map(async ([field, rules]) => {
        const value = formData[field];
        const error = await validateField(field, value, rules, formData);
        if (error) {
          errors.set(field, error);
          return false;
        }
        return true;
      }));
      const isValid2 = validationResults.every((result) => result);
      if (!isValid2 && options.onError) {
        const errorList = Array.from(errors.entries()).map(([field, message]) => ({
          field: String(field),
          message
        }));
        options.onError(errorList);
      }
      return isValid2;
    } finally {
      validating.value = false;
    }
  };
  const reset = () => {
    Object.assign(formData, options.initialValues || {});
    errors.clear();
    touched.clear();
    dirty.value = false;
    validating.value = false;
    submitting.value = false;
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
  };
  const submit = async () => {
    if (submitting.value) return;
    Object.keys(formData).forEach((field) => {
      touched.add(field);
    });
    const isValid2 = await validate();
    if (!isValid2) return;
    submitting.value = true;
    try {
      await options.onSubmit?.(formData);
      dirty.value = false;
    } finally {
      submitting.value = false;
    }
  };
  const createFieldHandlers = (field) => ({
    value: vue.computed({
      get: () => formData[field],
      set: (value) => setFieldValue(field, value)
    }),
    error: vue.computed(() => errors.get(field)),
    touched: vue.computed(() => touched.has(field)),
    onBlur: () => {
      touched.add(field);
      if (options.validateOnBlur) {
        validateSingleField(field);
      }
    },
    onChange: (value) => {
      setFieldValue(field, value);
    }
  });
  const isValid = vue.computed(() => errors.size === 0);
  const isDirty = vue.computed(() => dirty.value);
  const isValidating = vue.computed(() => validating.value);
  const isSubmitting = vue.computed(() => submitting.value);
  const errorMessages = vue.computed(() => Array.from(errors.values()));
  const hasErrors = vue.computed(() => errors.size > 0);
  const stopWatching = vue.watch(() => formData, () => {
    dirty.value = true;
  }, {
    deep: true
  });
  const cleanup = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
    stopWatching();
  };
  vue.onUnmounted(cleanup);
  return {
    // 数据
    values: vue.readonly(formData),
    errors: vue.readonly(errors),
    touched: vue.readonly(touched),
    // 状态
    isValid,
    isDirty,
    isValidating,
    isSubmitting,
    hasErrors,
    errorMessages,
    // 方法
    setFieldValue,
    setValues,
    getFieldValue,
    validate,
    validateField: validateSingleField,
    reset,
    submit,
    saveForm,
    // 字段处理器工厂
    createFieldHandlers,
    // 便捷的字段绑定
    register: (field) => ({
      modelValue: formData[field],
      "onUpdate:modelValue": (value) => setFieldValue(field, value),
      error: errors.get(field),
      onBlur: () => {
        touched.add(field);
        if (options.validateOnBlur) {
          validateSingleField(field);
        }
      }
    })
  };
}
function useTemplateModel(initialValue, options) {
  const model = vue.ref(initialValue);
  const original = vue.ref({
    ...initialValue
  });
  const dirty = vue.computed(() => JSON.stringify(model.value) !== JSON.stringify(original.value));
  let autoSaveTimer = null;
  const stopWatching = vue.watch(model, (newValue) => {
    options?.onChange?.(newValue);
    if (options?.autoSave) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      autoSaveTimer = setTimeout(async () => {
        await options.onSave?.(newValue);
        original.value = {
          ...newValue
        };
      }, options.autoSaveDelay || 1e3);
    }
  }, {
    deep: true
  });
  vue.onUnmounted(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
    stopWatching();
  });
  const reset = () => {
    model.value = {
      ...original.value
    };
  };
  const save = async () => {
    await options?.onSave?.(model.value);
    original.value = {
      ...model.value
    };
  };
  return {
    model,
    dirty,
    reset,
    save
  };
}

exports.useTemplateForm = useTemplateForm;
exports.useTemplateModel = useTemplateModel;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateForm.cjs.map
