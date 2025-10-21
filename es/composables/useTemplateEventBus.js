/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { provide, ref, onUnmounted, inject } from 'vue';

class GlobalEventBus {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
    this.eventHistory = /* @__PURE__ */ new Map();
    this.maxHistorySize = 100;
    this.idCounter = 0;
    this.componentSubscriptions = /* @__PURE__ */ new WeakMap();
  }
  /**
   * 发送事件
   */
  async emit(event, payload) {
    this.recordHistory(event, payload);
    const subscribers = this.events.get(event);
    if (!subscribers || subscribers.length === 0) return;
    const sortedSubscribers = [...subscribers].sort((a, b) => (b.options.priority || 0) - (a.options.priority || 0));
    const toRemove = [];
    for (const subscriber of sortedSubscribers) {
      if (subscriber.options.filter && !subscriber.options.filter(payload)) {
        continue;
      }
      try {
        await subscriber.handler(payload);
      } catch (error) {
        console.error(`Event handler error for "${event}":`, error);
      }
      if (subscriber.options.once) {
        toRemove.push(subscriber.id);
      }
    }
    if (toRemove.length > 0) {
      const remaining = subscribers.filter((s) => !toRemove.includes(s.id));
      if (remaining.length > 0) {
        this.events.set(event, remaining);
      } else {
        this.events.delete(event);
      }
    }
  }
  /**
   * 监听事件
   */
  on(event, handler, options = {}) {
    const subscribers = this.events.get(event) || [];
    const id = `sub_${++this.idCounter}`;
    const subscriber = {
      handler,
      options,
      id
    };
    subscribers.push(subscriber);
    this.events.set(event, subscribers);
    return () => {
      this.off(event, handler);
    };
  }
  /**
   * 取消监听
   */
  off(event, handler) {
    const subscribers = this.events.get(event);
    if (!subscribers) return;
    if (!handler) {
      this.events.delete(event);
    } else {
      const remaining = subscribers.filter((s) => s.handler !== handler);
      if (remaining.length > 0) {
        this.events.set(event, remaining);
      } else {
        this.events.delete(event);
      }
    }
  }
  /**
   * 监听一次
   */
  once(event, handler) {
    return this.on(event, handler, {
      once: true
    });
  }
  /**
   * 清空事件
   */
  clear(event) {
    if (event) {
      this.events.delete(event);
      this.eventHistory.delete(event);
    } else {
      this.events.clear();
      this.eventHistory.clear();
    }
  }
  /**
   * 检查是否有监听器
   */
  hasListeners(event) {
    const subscribers = this.events.get(event);
    return !!subscribers && subscribers.length > 0;
  }
  /**
   * 获取所有事件名
   */
  getEvents() {
    return Array.from(this.events.keys());
  }
  /**
   * 记录事件历史
   */
  recordHistory(event, payload) {
    let history = this.eventHistory.get(event);
    if (!history) {
      history = [];
      this.eventHistory.set(event, history);
    }
    if (history.length >= this.maxHistorySize) {
      const index = history.length % this.maxHistorySize;
      history[index] = {
        payload,
        timestamp: Date.now()
      };
    } else {
      history.push({
        payload,
        timestamp: Date.now()
      });
    }
  }
  /**
   * 获取事件历史
   */
  getHistory(event) {
    return this.eventHistory.get(event) || [];
  }
}
const globalBus = new GlobalEventBus();
const EventBusKey = Symbol("TemplateEventBus");
function useTemplateEventBus(isolated = false) {
  const injectedBus = inject(EventBusKey, null);
  if (!isolated && injectedBus) {
    return injectedBus;
  }
  if (!isolated) {
    return globalBus;
  }
  const localBus = new GlobalEventBus();
  onUnmounted(() => {
    localBus.clear();
    if ("componentSubscriptions" in localBus) {
      localBus.componentSubscriptions = /* @__PURE__ */ new WeakMap();
    }
  });
  return localBus;
}
function provideTemplateEventBus() {
  const bus = new GlobalEventBus();
  provide(EventBusKey, bus);
  return bus;
}
const TEMPLATE_EVENTS = {
  // 模板生命周期
  TEMPLATE_LOAD: "template:load",
  TEMPLATE_LOADED: "template:loaded",
  TEMPLATE_ERROR: "template:error",
  TEMPLATE_UNLOAD: "template:unload",
  // 模板切换
  TEMPLATE_CHANGE: "template:change",
  TEMPLATE_SWITCH: "template:switch",
  // 设备变化
  DEVICE_CHANGE: "device:change",
  // 主题变化
  THEME_CHANGE: "theme:change",
  // 表单事件
  FORM_SUBMIT: "form:submit",
  FORM_RESET: "form:reset",
  FORM_VALIDATE: "form:validate",
  FORM_SAVE: "form:save",
  // 导航事件
  NAVIGATE_TO: "navigate:to",
  NAVIGATE_BACK: "navigate:back",
  NAVIGATE_FORWARD: "navigate:forward",
  // 用户操作
  USER_LOGIN: "user:login",
  USER_LOGOUT: "user:logout",
  USER_ACTION: "user:action",
  // 数据变化
  DATA_UPDATE: "data:update",
  DATA_DELETE: "data:delete",
  DATA_CREATE: "data:create"
};
function useTemplateEvent(event, handler, options) {
  const bus = useTemplateEventBus();
  const unsubscribe = ref(null);
  if (handler) {
    unsubscribe.value = bus.on(event, handler, options);
  }
  onUnmounted(() => {
    unsubscribe.value?.();
  });
  return {
    emit: (payload) => bus.emit(event, payload),
    on: (h, opts) => {
      return bus.on(event, h, opts);
    },
    once: (h) => bus.once(event, h),
    off: (h) => bus.off(event, h),
    hasListeners: () => bus.hasListeners(event)
  };
}
function useTemplateEvents(events) {
  const bus = useTemplateEventBus();
  const unsubscribers = [];
  Object.entries(events).forEach(([event, handler]) => {
    const unsub = bus.on(event, handler);
    unsubscribers.push(unsub);
  });
  onUnmounted(() => {
    unsubscribers.forEach((unsub) => unsub());
  });
  return bus;
}
class MiddlewareEventBus extends GlobalEventBus {
  constructor() {
    super(...arguments);
    this.middlewares = [];
  }
  /**
   * 添加中间件
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }
  /**
   * 发送事件（通过中间件）
   */
  async emit(event, payload) {
    let index = 0;
    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(event, payload, next);
      } else {
        await super.emit(event, payload);
      }
    };
    await next();
  }
}
function createMiddlewareEventBus() {
  return new MiddlewareEventBus();
}
const templateEventBus = globalBus;

export { MiddlewareEventBus, TEMPLATE_EVENTS, createMiddlewareEventBus, provideTemplateEventBus, templateEventBus, useTemplateEvent, useTemplateEventBus, useTemplateEvents };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateEventBus.js.map
