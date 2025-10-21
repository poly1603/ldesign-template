/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, watch, onMounted, nextTick, onUnmounted, computed } from 'vue';

class FocusManager {
  constructor() {
    this.focusableElements = [];
    this.currentIndex = -1;
    this.container = null;
    this.originalFocus = null;
  }
  /**
   * 初始化
   */
  init(container) {
    this.container = container;
    this.originalFocus = document.activeElement;
    this.updateFocusableElements();
  }
  /**
   * 更新可聚焦元素列表
   */
  updateFocusableElements() {
    if (!this.container) return;
    const selector = ["a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", '[tabindex]:not([tabindex="-1"])', "[contenteditable]"].join(", ");
    this.focusableElements = Array.from(this.container.querySelectorAll(selector));
  }
  /**
   * 聚焦第一个元素
   */
  focusFirst() {
    if (this.focusableElements.length > 0) {
      this.currentIndex = 0;
      this.focusableElements[0].focus();
    }
  }
  /**
   * 聚焦最后一个元素
   */
  focusLast() {
    if (this.focusableElements.length > 0) {
      this.currentIndex = this.focusableElements.length - 1;
      this.focusableElements[this.currentIndex].focus();
    }
  }
  /**
   * 聚焦下一个元素
   */
  focusNext() {
    if (this.focusableElements.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentIndex].focus();
  }
  /**
   * 聚焦上一个元素
   */
  focusPrevious() {
    if (this.focusableElements.length === 0) return;
    this.currentIndex = this.currentIndex <= 0 ? this.focusableElements.length - 1 : this.currentIndex - 1;
    this.focusableElements[this.currentIndex].focus();
  }
  /**
   * 捕获焦点
   */
  trapFocus() {
    if (!this.container) return;
    const handleKeydown = (e) => {
      if (e.key !== "Tab") return;
      const isShift = e.shiftKey;
      const activeElement = document.activeElement;
      if (!this.container?.contains(activeElement)) {
        e.preventDefault();
        if (isShift) {
          this.focusLast();
        } else {
          this.focusFirst();
        }
        return;
      }
      const currentIndex = this.focusableElements.indexOf(activeElement);
      if (isShift && currentIndex === 0) {
        e.preventDefault();
        this.focusLast();
      } else if (!isShift && currentIndex === this.focusableElements.length - 1) {
        e.preventDefault();
        this.focusFirst();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }
  /**
   * 恢复原始焦点
   */
  restoreFocus() {
    if (this.originalFocus && this.originalFocus.focus) {
      this.originalFocus.focus();
    }
  }
  /**
   * 清理
   */
  cleanup() {
    this.restoreFocus();
    this.focusableElements = [];
    this.currentIndex = -1;
    this.container = null;
    this.originalFocus = null;
  }
}
class ScreenReaderAnnouncer {
  constructor() {
    this.liveRegion = null;
    this.announceTimer = null;
  }
  /**
   * 初始化
   */
  init(mode = "polite") {
    if (mode === "off") return;
    this.liveRegion = document.createElement("div");
    this.liveRegion.setAttribute("aria-live", mode);
    this.liveRegion.setAttribute("aria-atomic", "true");
    this.liveRegion.style.position = "absolute";
    this.liveRegion.style.left = "-10000px";
    this.liveRegion.style.width = "1px";
    this.liveRegion.style.height = "1px";
    this.liveRegion.style.overflow = "hidden";
    document.body.appendChild(this.liveRegion);
  }
  /**
   * 发布公告
   */
  announce(message, delay = 100) {
    if (!this.liveRegion) return;
    if (this.announceTimer) {
      clearTimeout(this.announceTimer);
      this.announceTimer = null;
    }
    this.liveRegion.textContent = "";
    this.announceTimer = setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
      this.announceTimer = null;
    }, delay);
  }
  /**
   * 清理
   */
  cleanup() {
    if (this.announceTimer) {
      clearTimeout(this.announceTimer);
      this.announceTimer = null;
    }
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
    this.liveRegion = null;
  }
}
function useTemplateA11y(config = {}) {
  const focusManager = new FocusManager();
  const announcer = new ScreenReaderAnnouncer();
  const containerRef = ref(null);
  const isHighContrast = ref(config.highContrast || false);
  const isReducedMotion = ref(config.reducedMotion || false);
  const isScreenReaderMode = ref(config.screenReaderMode || false);
  let cleanupFunctions = [];
  const setContainer = (element) => {
    containerRef.value = element;
    if (config.keyboardNavigation) {
      focusManager.init(element);
      if (config.trapFocus) {
        const cleanup = focusManager.trapFocus();
        if (cleanup) cleanupFunctions.push(cleanup);
      }
    }
    if (config.ariaLabels) {
      Object.entries(config.ariaLabels).forEach(([key, value]) => {
        const el = element.querySelector(`[data-a11y="${key}"]`);
        if (el) el.setAttribute("aria-label", value);
      });
    }
    if (config.ariaDescriptions) {
      Object.entries(config.ariaDescriptions).forEach(([key, value]) => {
        const el = element.querySelector(`[data-a11y="${key}"]`);
        if (el) el.setAttribute("aria-describedby", value);
      });
    }
    if (config.landmark) {
      element.setAttribute("role", config.landmark);
    }
    if (config.headingLevel) {
      const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings.forEach((heading) => {
        heading.setAttribute("aria-level", String(config.headingLevel));
      });
    }
  };
  const registerShortcuts = () => {
    if (!config.shortcuts) return;
    const handleKeydown = (e) => {
      const key = [e.ctrlKey && "ctrl", e.altKey && "alt", e.shiftKey && "shift", e.metaKey && "meta", e.key.toLowerCase()].filter(Boolean).join("+");
      const handler = config.shortcuts[key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    cleanupFunctions.push(() => {
      document.removeEventListener("keydown", handleKeydown);
    });
  };
  const detectUserPreferences = () => {
    if (window.matchMedia) {
      const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
      isHighContrast.value = highContrastQuery.matches;
      const handleHighContrastChange = (e) => {
        isHighContrast.value = e.matches;
      };
      highContrastQuery.addEventListener("change", handleHighContrastChange);
      cleanupFunctions.push(() => {
        highContrastQuery.removeEventListener("change", handleHighContrastChange);
      });
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      isReducedMotion.value = reducedMotionQuery.matches;
      const handleReducedMotionChange = (e) => {
        isReducedMotion.value = e.matches;
      };
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
      cleanupFunctions.push(() => {
        reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      });
    }
  };
  const announce = (message) => {
    if (config.announceChanges) {
      announcer.announce(message);
    }
  };
  const focus = {
    first: () => focusManager.focusFirst(),
    last: () => focusManager.focusLast(),
    next: () => focusManager.focusNext(),
    previous: () => focusManager.focusPrevious(),
    restore: () => focusManager.restoreFocus(),
    update: () => focusManager.updateFocusableElements()
  };
  const applyA11yStyles = () => {
    if (!containerRef.value) return;
    const element = containerRef.value;
    if (isHighContrast.value) {
      element.classList.add("high-contrast");
    } else {
      element.classList.remove("high-contrast");
    }
    if (isReducedMotion.value) {
      element.classList.add("reduced-motion");
    } else {
      element.classList.remove("reduced-motion");
    }
    if (config.focusIndicator) {
      element.classList.add("focus-visible");
    }
    if (isScreenReaderMode.value) {
      element.classList.add("screen-reader-mode");
    } else {
      element.classList.remove("screen-reader-mode");
    }
  };
  watch([isHighContrast, isReducedMotion, isScreenReaderMode], () => {
    applyA11yStyles();
  });
  onMounted(() => {
    if (config.announceChanges) {
      announcer.init(config.liveRegion || "polite");
    }
    detectUserPreferences();
    registerShortcuts();
    nextTick(() => {
      applyA11yStyles();
    });
  });
  onUnmounted(() => {
    focusManager.cleanup();
    announcer.cleanup();
    cleanupFunctions.forEach((fn) => fn());
    cleanupFunctions = [];
  });
  return {
    setContainer,
    announce,
    focus,
    isHighContrast: computed(() => isHighContrast.value),
    isReducedMotion: computed(() => isReducedMotion.value),
    isScreenReaderMode: computed(() => isScreenReaderMode.value),
    toggleHighContrast: () => {
      isHighContrast.value = !isHighContrast.value;
    },
    toggleReducedMotion: () => {
      isReducedMotion.value = !isReducedMotion.value;
    },
    toggleScreenReaderMode: () => {
      isScreenReaderMode.value = !isScreenReaderMode.value;
    }
  };
}
function createA11yStyles() {
  return `
    /* \u9AD8\u5BF9\u6BD4\u5EA6\u6A21\u5F0F */
    .high-contrast {
      filter: contrast(1.5);
    }
    
    .high-contrast * {
      border-width: 2px !important;
    }
    
    .high-contrast button,
    .high-contrast a,
    .high-contrast input,
    .high-contrast select,
    .high-contrast textarea {
      outline: 2px solid currentColor !important;
      outline-offset: 2px !important;
    }
    
    /* \u51CF\u5C11\u52A8\u753B\u6A21\u5F0F */
    .reduced-motion *,
    .reduced-motion *::before,
    .reduced-motion *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    /* \u7126\u70B9\u6307\u793A\u5668 */
    .focus-visible :focus {
      outline: 3px solid #4A90E2 !important;
      outline-offset: 2px !important;
    }
    
    .focus-visible :focus:not(:focus-visible) {
      outline: none !important;
    }
    
    /* \u5C4F\u5E55\u9605\u8BFB\u5668\u6A21\u5F0F */
    .screen-reader-mode .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .screen-reader-mode .sr-only-focusable:focus {
      position: static;
      width: auto;
      height: auto;
      padding: inherit;
      margin: inherit;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
    
    /* \u8DF3\u8F6C\u94FE\u63A5 */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    }
    
    .skip-link:focus {
      top: 0;
    }
  `;
}

export { createA11yStyles, useTemplateA11y };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateA11y.js.map
