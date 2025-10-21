/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, computed } from 'vue';

class TypeValidator {
  constructor() {
    this.validators = /* @__PURE__ */ new Map();
  }
  /**
   * 注册验证器
   */
  register(type, validator) {
    this.validators.set(type, validator);
  }
  /**
   * 验证值
   */
  validate(value, type) {
    if (typeof type === "string") {
      const validator = this.validators.get(type);
      return validator ? validator(value) : true;
    }
    if (Array.isArray(type)) {
      return type.some((t) => this.validateConstructor(value, t));
    }
    return this.validateConstructor(value, type);
  }
  /**
   * 验证构造函数类型
   */
  validateConstructor(value, constructor) {
    if (constructor === String) return typeof value === "string";
    if (constructor === Number) return typeof value === "number";
    if (constructor === Boolean) return typeof value === "boolean";
    if (constructor === Array) return Array.isArray(value);
    if (constructor === Object) return typeof value === "object" && value !== null;
    if (constructor === Date) return value instanceof Date;
    if (constructor === Function) return typeof value === "function";
    if (constructor === Symbol) return typeof value === "symbol";
    return value instanceof constructor;
  }
}
class TypeGenerator {
  /**
   * 从模板生成类型定义
   */
  generateFromTemplate(template) {
    const lines = [];
    const interfaceName = `${this.toPascalCase(template.name)}Template`;
    lines.push(`export interface ${interfaceName} {`);
    if (template.props) {
      lines.push("  props: {");
      for (const [key, prop] of Object.entries(template.props)) {
        const type = this.inferType(prop);
        lines.push(`    ${key}: ${type};`);
      }
      lines.push("  };");
    }
    if (template.events) {
      lines.push("  events: {");
      for (const [key, event] of Object.entries(template.events)) {
        const type = this.inferEventType(event);
        lines.push(`    ${key}: ${type};`);
      }
      lines.push("  };");
    }
    if (template.slots) {
      lines.push("  slots: {");
      for (const key of Object.keys(template.slots)) {
        lines.push(`    ${key}: any;`);
      }
      lines.push("  };");
    }
    lines.push("}");
    return lines.join("\n");
  }
  /**
   * 批量生成类型定义
   */
  generateTypes(templates) {
    const types = templates.map((t) => this.generateFromTemplate(t));
    const imports = ["import type { Template } from './types'", ""];
    const indexType = ["", "export interface TemplateMap {", ...templates.map((t) => `  '${t.name}': ${this.toPascalCase(t.name)}Template;`), "}"];
    return [...imports, ...types, ...indexType].join("\n");
  }
  /**
   * 推断类型
   */
  inferType(value) {
    if (value === null) return "null";
    if (value === void 0) return "undefined";
    const type = typeof value;
    switch (type) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "function":
        return this.inferFunctionType(value);
      case "object":
        if (Array.isArray(value)) {
          return this.inferArrayType(value);
        }
        return this.inferObjectType(value);
      default:
        return "any";
    }
  }
  /**
   * 推断函数类型
   */
  inferFunctionType(fn) {
    const params = fn.length;
    const paramTypes = Array.from({
      length: params
    }, () => "any").join(", ");
    return `(${paramTypes}) => any`;
  }
  /**
   * 推断数组类型
   */
  inferArrayType(arr) {
    if (arr.length === 0) return "any[]";
    const types = new Set(arr.map((item) => this.inferType(item)));
    if (types.size === 1) {
      return `${Array.from(types)[0]}[]`;
    }
    return `(${Array.from(types).join(" | ")})[]`;
  }
  /**
   * 推断对象类型
   */
  inferObjectType(obj) {
    const props = Object.entries(obj).map(([key, value]) => `${key}: ${this.inferType(value)}`).join("; ");
    return `{ ${props} }`;
  }
  /**
   * 推断事件类型
   */
  inferEventType(event) {
    if (typeof event === "function") {
      return this.inferFunctionType(event);
    }
    return "(...args: any[]) => void";
  }
  /**
   * 转换为帕斯卡命名
   */
  toPascalCase(str) {
    return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase());
  }
}
class TypeGuard {
  /**
   * 是否为特定模板类型
   */
  static isTemplate(template, type) {
    return template instanceof type;
  }
  /**
   * 是否有必需属性
   */
  static hasRequiredProps(obj, props) {
    return props.every((prop) => prop in obj);
  }
  /**
   * 是否为有效的模板属性
   */
  static isValidTemplateProps(props, schema) {
    const validator = new TypeValidator();
    for (const [key, config] of Object.entries(schema)) {
      if (config.required && !(key in props)) {
        return false;
      }
      if (key in props) {
        const value = props[key];
        if (!validator.validate(value, config.type)) {
          return false;
        }
        if (config.validator && !config.validator(value)) {
          return false;
        }
      }
    }
    return true;
  }
}
function createTypedTemplate(config) {
  const template = {
    id: `typed-${config.name}`,
    name: config.name,
    category: "typed",
    props: config.props,
    events: config.events,
    slots: config.slots
  };
  if (config.setup) {
    const originalSetup = config.setup;
    template.setup = (props) => {
      if (config.props && !TypeGuard.isValidTemplateProps(props, config.props)) {
        console.error(`Invalid props for template ${config.name}`);
      }
      return originalSetup(props);
    };
  }
  return template;
}
function useTypedTemplate(template) {
  const templateRef = ref(template);
  const computedTemplate = computed(() => "value" in templateRef.value ? templateRef.value.value : templateRef.value);
  const props = computed(() => computedTemplate.value.props);
  const events = computed(() => computedTemplate.value.events);
  const slots = computed(() => computedTemplate.value.slots);
  const validate = (inputProps) => {
    const schema = computedTemplate.value.props;
    if (!schema) return true;
    return TypeGuard.isValidTemplateProps(inputProps, schema);
  };
  return {
    template: computedTemplate,
    props,
    events,
    slots,
    validate
  };
}
class TypeMapper {
  constructor() {
    this.mappings = /* @__PURE__ */ new Map([["String", "string"], ["Number", "number"], ["Boolean", "boolean"], ["Array", "any[]"], ["Object", "Record<string, any>"], ["Date", "Date"], ["Function", "Function"], ["Symbol", "symbol"]]);
  }
  /**
   * 添加自定义映射
   */
  addMapping(from, to) {
    this.mappings.set(from, to);
  }
  /**
   * 映射类型
   */
  map(type) {
    return this.mappings.get(type) || "any";
  }
  /**
   * 批量映射
   */
  mapBatch(types) {
    const result = {};
    for (const [key, value] of Object.entries(types)) {
      result[key] = this.map(value);
    }
    return result;
  }
}
class TemplateTypeRegistry {
  constructor() {
    this.registry = /* @__PURE__ */ new Map();
    this.schemas = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new TemplateTypeRegistry();
    }
    return this.instance;
  }
  /**
   * 注册模板类型
   */
  register(template, schema) {
    this.registry.set(template.name, template);
    if (schema) {
      this.schemas.set(template.name, schema);
    }
  }
  /**
   * 获取模板类型
   */
  get(name) {
    return this.registry.get(name);
  }
  /**
   * 获取模板schema
   */
  getSchema(name) {
    return this.schemas.get(name);
  }
  /**
   * 获取所有模板类型
   */
  getAll() {
    return Array.from(this.registry.values());
  }
  /**
   * 生成类型定义文件
   */
  generateTypeDefinitions() {
    const generator = new TypeGenerator();
    const templates = this.getAll();
    return generator.generateTypes(templates);
  }
}
const typeValidator = new TypeValidator();
const typeGenerator = new TypeGenerator();
const typeMapper = new TypeMapper();
const typeRegistry = TemplateTypeRegistry.getInstance();

export { TemplateTypeRegistry, TypeGenerator, TypeGuard, TypeMapper, TypeValidator, createTypedTemplate, typeGenerator, typeMapper, typeRegistry, typeValidator, useTypedTemplate };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=typeSafety.js.map
