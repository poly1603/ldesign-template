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

const PRESET_THEMES = {
  light: {
    name: "light",
    displayName: "Light",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      success: "#48bb78",
      warning: "#f6ad55",
      error: "#f56565",
      info: "#4299e1",
      background: "#ffffff",
      surface: "#f7fafc",
      text: "#1a202c",
      textSecondary: "#718096",
      border: "#e2e8f0"
    },
    fonts: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem"
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.5rem",
      full: "9999px"
    },
    shadows: {
      none: "none",
      sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
    },
    transitions: {
      fast: "150ms ease-in-out",
      normal: "250ms ease-in-out",
      slow: "350ms ease-in-out"
    }
  },
  dark: {
    name: "dark",
    displayName: "Dark",
    extends: "light",
    colors: {
      primary: "#9f7aea",
      secondary: "#975ba5",
      success: "#68d391",
      warning: "#fbb040",
      error: "#fc8181",
      info: "#63b3ed",
      background: "#1a202c",
      surface: "#2d3748",
      text: "#f7fafc",
      textSecondary: "#cbd5e0",
      border: "#4a5568"
    }
  },
  blue: {
    name: "blue",
    displayName: "Blue Ocean",
    extends: "light",
    colors: {
      primary: "#3182ce",
      secondary: "#2c5282",
      success: "#38a169",
      warning: "#d69e2e",
      error: "#e53e3e",
      info: "#3182ce",
      background: "#f0f4f8",
      surface: "#ffffff",
      text: "#2d3748",
      textSecondary: "#4a5568",
      border: "#cbd5e0"
    }
  },
  green: {
    name: "green",
    displayName: "Forest Green",
    extends: "light",
    colors: {
      primary: "#48bb78",
      secondary: "#38a169",
      success: "#48bb78",
      warning: "#ed8936",
      error: "#f56565",
      info: "#4299e1",
      background: "#f0fff4",
      surface: "#ffffff",
      text: "#1a202c",
      textSecondary: "#2d3748",
      border: "#9ae6b4"
    }
  }
};
const ThemeContextKey = Symbol("TemplateThemeContext");
function createThemeManager(defaultTheme = "light") {
  const themes = /* @__PURE__ */ new Map();
  const currentTheme = vue.ref(defaultTheme);
  const appliedTheme = vue.ref(null);
  Object.values(PRESET_THEMES).forEach((theme) => {
    themes.set(theme.name, theme);
  });
  const resolveTheme = (theme) => {
    if (!theme.extends) return theme;
    const parentTheme = themes.get(theme.extends);
    if (!parentTheme) return theme;
    const resolvedParent = resolveTheme(parentTheme);
    return {
      ...resolvedParent,
      ...theme,
      colors: {
        ...resolvedParent.colors,
        ...theme.colors
      },
      fonts: {
        ...resolvedParent.fonts,
        ...theme.fonts
      },
      spacing: {
        ...resolvedParent.spacing,
        ...theme.spacing
      },
      borderRadius: {
        ...resolvedParent.borderRadius,
        ...theme.borderRadius
      },
      shadows: {
        ...resolvedParent.shadows,
        ...theme.shadows
      },
      breakpoints: {
        ...resolvedParent.breakpoints,
        ...theme.breakpoints
      },
      transitions: {
        ...resolvedParent.transitions,
        ...theme.transitions
      },
      cssVars: {
        ...resolvedParent.cssVars,
        ...theme.cssVars
      }
    };
  };
  const applyTheme = (theme) => {
    const resolved = resolveTheme(theme);
    appliedTheme.value = resolved;
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    Object.entries(resolved.colors).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--template-color-${key}`, value);
    });
    Object.entries(resolved.fonts || {}).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--template-font-${key}`, value);
    });
    Object.entries(resolved.spacing || {}).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--template-spacing-${key}`, value);
    });
    Object.entries(resolved.borderRadius || {}).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--template-radius-${key}`, value);
    });
    Object.entries(resolved.shadows || {}).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--template-shadow-${key}`, value);
    });
    Object.entries(resolved.transitions || {}).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--template-transition-${key}`, value);
    });
    Object.entries(resolved.cssVars || {}).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute("data-template-theme", resolved.name);
  };
  const setTheme = (themeName) => {
    const theme = themes.get(themeName);
    if (!theme) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }
    currentTheme.value = themeName;
    applyTheme(theme);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("template-theme", themeName);
    }
  };
  const registerTheme = (theme) => {
    themes.set(theme.name, theme);
  };
  const createCustomTheme = (name, overrides) => {
    const baseTheme = themes.get(overrides.extends || "light") || PRESET_THEMES.light;
    const customTheme = {
      ...baseTheme,
      ...overrides,
      name,
      colors: {
        ...baseTheme.colors,
        ...overrides.colors
      },
      fonts: {
        ...baseTheme.fonts,
        ...overrides.fonts
      },
      spacing: {
        ...baseTheme.spacing,
        ...overrides.spacing
      },
      borderRadius: {
        ...baseTheme.borderRadius,
        ...overrides.borderRadius
      },
      shadows: {
        ...baseTheme.shadows,
        ...overrides.shadows
      },
      breakpoints: {
        ...baseTheme.breakpoints,
        ...overrides.breakpoints
      },
      transitions: {
        ...baseTheme.transitions,
        ...overrides.transitions
      },
      cssVars: {
        ...baseTheme.cssVars,
        ...overrides.cssVars
      }
    };
    registerTheme(customTheme);
    return customTheme;
  };
  const getTheme = (name) => {
    return themes.get(name);
  };
  const removeTheme = (name) => {
    if (PRESET_THEMES[name]) {
      console.warn(`Cannot remove preset theme "${name}"`);
      return false;
    }
    return themes.delete(name);
  };
  if (typeof localStorage !== "undefined") {
    const savedTheme = localStorage.getItem("template-theme");
    if (savedTheme && themes.has(savedTheme)) {
      setTheme(savedTheme);
    } else {
      setTheme(defaultTheme);
    }
  } else {
    setTheme(defaultTheme);
  }
  let darkModeQuery = null;
  let handleSystemThemeChange = null;
  if (typeof window !== "undefined" && window.matchMedia) {
    darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    handleSystemThemeChange = (e) => {
      if (currentTheme.value === "auto") {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    darkModeQuery.addEventListener("change", handleSystemThemeChange);
  }
  const cleanup = () => {
    if (darkModeQuery && handleSystemThemeChange) {
      darkModeQuery.removeEventListener("change", handleSystemThemeChange);
    }
  };
  return {
    currentTheme: vue.readonly(currentTheme),
    themes,
    setTheme,
    registerTheme,
    createCustomTheme,
    applyTheme,
    getTheme,
    removeTheme,
    appliedTheme: vue.readonly(appliedTheme),
    cleanup
  };
}
function useTemplateTheme() {
  let context = vue.inject(ThemeContextKey, void 0);
  if (!context) {
    const manager = createThemeManager();
    context = {
      currentTheme: manager.currentTheme,
      themes: manager.themes,
      setTheme: manager.setTheme,
      registerTheme: manager.registerTheme,
      createCustomTheme: manager.createCustomTheme,
      applyTheme: manager.applyTheme,
      getTheme: manager.getTheme,
      removeTheme: manager.removeTheme
    };
  }
  const isDark = vue.computed(() => context.currentTheme.value === "dark");
  const isLight = vue.computed(() => context.currentTheme.value === "light");
  const toggleTheme = () => {
    context.setTheme(isDark.value ? "light" : "dark");
  };
  const currentThemeConfig = vue.computed(() => {
    return context.getTheme(context.currentTheme.value);
  });
  return {
    ...context,
    isDark,
    isLight,
    toggleTheme,
    currentThemeConfig
  };
}
function provideTemplateTheme(defaultTheme) {
  const manager = createThemeManager(defaultTheme);
  const context = {
    currentTheme: manager.currentTheme,
    themes: manager.themes,
    setTheme: manager.setTheme,
    registerTheme: manager.registerTheme,
    createCustomTheme: manager.createCustomTheme,
    applyTheme: manager.applyTheme,
    getTheme: manager.getTheme,
    removeTheme: manager.removeTheme
  };
  vue.provide(ThemeContextKey, context);
  return context;
}

exports.PRESET_THEMES = PRESET_THEMES;
exports.createThemeManager = createThemeManager;
exports.provideTemplateTheme = provideTemplateTheme;
exports.useTemplateTheme = useTemplateTheme;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateTheme.cjs.map
