import {
  computed,
  customRef,
  getCurrentInstance,
  getCurrentScope,
  onMounted,
  onScopeDispose,
  readonly,
  ref,
  toRef,
  watchEffect
} from "./chunk-NQEDJL6T.js";

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/index.js
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/fonts.css";

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/without-fonts.js
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/vars.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/base.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/utils.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/components/custom-block.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/styles/components/vp-sponsor.css";
import VPBadge from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue";
import Layout from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/Layout.vue";
import { default as default2 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue";
import { default as default3 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue";
import { default as default4 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue";
import { default as default5 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue";
import { default as default6 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue";
import { default as default7 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue";
import { default as default8 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue";
import { default as default9 } from "/Users/chengxinhan/Learn/web-tracing/node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue";

// ../node_modules/.pnpm/@vueuse+shared@10.2.1_vue@3.3.4/node_modules/@vueuse/shared/index.mjs
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
var isClient = typeof window !== "undefined";
var noop = () => {
};
var isIOS = getIsIOS();
function getIsIOS() {
  var _a;
  return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
}
function identity(arg) {
  return arg;
}
function toRef2(...args) {
  if (args.length !== 1)
    return toRef(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop }))) : ref(r);
}

// ../node_modules/.pnpm/@vueuse+core@10.2.1_vue@3.3.4/node_modules/@vueuse/core/index.mjs
var defaultWindow = isClient ? window : void 0;
var defaultDocument = isClient ? window.document : void 0;
var defaultNavigator = isClient ? window.navigator : void 0;
var defaultLocation = isClient ? window.location : void 0;
function useMounted() {
  const isMounted = ref(false);
  if (getCurrentInstance()) {
    onMounted(() => {
      isMounted.value = true;
    });
  }
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
  let mediaQuery;
  const matches = ref(false);
  const cleanup = () => {
    if (!mediaQuery)
      return;
    if ("removeEventListener" in mediaQuery)
      mediaQuery.removeEventListener("change", update);
    else
      mediaQuery.removeListener(update);
  };
  const update = () => {
    if (!isSupported.value)
      return;
    cleanup();
    mediaQuery = window2.matchMedia(toRef2(query).value);
    matches.value = !!(mediaQuery == null ? void 0 : mediaQuery.matches);
    if (!mediaQuery)
      return;
    if ("addEventListener" in mediaQuery)
      mediaQuery.addEventListener("change", update);
    else
      mediaQuery.addListener(update);
  };
  watchEffect(update);
  tryOnScopeDispose(() => cleanup());
  return matches;
}
var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var globalKey = "__vueuse_ssr_handlers__";
var handlers = getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
var defaultState = {
  x: 0,
  y: 0,
  pointerId: 0,
  pressure: 0,
  tiltX: 0,
  tiltY: 0,
  width: 0,
  height: 0,
  twist: 0,
  pointerType: null
};
var keys = Object.keys(defaultState);
var _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
var TransitionPresets = Object.assign({}, { linear: identity }, _TransitionPresets);

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/composables/sidebar.js
import { useRoute } from "vitepress";

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/support/utils.js
import { withBase } from "vitepress";

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/composables/data.js
import { useData as useData$ } from "vitepress";
var useData = useData$;

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/support/utils.js
function ensureStartingSlash(path) {
  return /^\//.test(path) ? path : `/${path}`;
}

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/support/sidebar.js
function getSidebar(sidebar, path) {
  if (Array.isArray(sidebar)) {
    return sidebar;
  }
  if (sidebar == null) {
    return [];
  }
  path = ensureStartingSlash(path);
  const dir = Object.keys(sidebar).sort((a, b) => {
    return b.split("/").length - a.split("/").length;
  }).find((dir2) => {
    return path.startsWith(ensureStartingSlash(dir2));
  });
  return dir ? sidebar[dir] : [];
}
function getSidebarGroups(sidebar) {
  const groups = [];
  let lastGroupIndex = 0;
  for (const index in sidebar) {
    const item = sidebar[index];
    if (item.items) {
      lastGroupIndex = groups.push(item);
      continue;
    }
    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] });
    }
    groups[lastGroupIndex].items.push(item);
  }
  return groups;
}

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/composables/sidebar.js
function useSidebar() {
  const route = useRoute();
  const { theme: theme2, frontmatter } = useData();
  const is960 = useMediaQuery("(min-width: 960px)");
  const isOpen = ref(false);
  const sidebar = computed(() => {
    const sidebarConfig = theme2.value.sidebar;
    const relativePath = route.data.relativePath;
    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
  });
  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && frontmatter.value.layout !== "home";
  });
  const leftAside = computed(() => {
    if (hasAside)
      return frontmatter.value.aside == null ? theme2.value.aside === "left" : frontmatter.value.aside === "left";
    return false;
  });
  const hasAside = computed(() => {
    if (frontmatter.value.layout === "home")
      return false;
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside;
    return theme2.value.aside !== false;
  });
  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value);
  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
  });
  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value ? close() : open();
  }
  return {
    isOpen,
    sidebar,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle
  };
}

// ../node_modules/.pnpm/vitepress@1.0.0-beta.5_gzzappvipf62bx3ilub7dtkyaq/node_modules/vitepress/dist/client/theme-default/without-fonts.js
var theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", VPBadge);
  }
};
var without_fonts_default = theme;
export {
  default5 as VPDocAsideSponsors,
  default3 as VPHomeFeatures,
  default2 as VPHomeHero,
  default4 as VPHomeSponsors,
  default9 as VPTeamMembers,
  default6 as VPTeamPage,
  default8 as VPTeamPageSection,
  default7 as VPTeamPageTitle,
  without_fonts_default as default,
  useSidebar
};
//# sourceMappingURL=@theme_index.js.map
