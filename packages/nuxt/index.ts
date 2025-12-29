import { addPluginTemplate, defineNuxtModule } from "@nuxt/kit";
import type { InitOptions } from "@web-tracing/core";

// Polyfill requestAnimationFrame for SSR
if (typeof global !== "undefined" && !global.requestAnimationFrame) {
  (global as any).requestAnimationFrame = (callback: any) =>
    setTimeout(callback, 0);
}
if (typeof global !== "undefined" && !global.cancelAnimationFrame) {
  (global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}
if (typeof global !== "undefined" && !global.window) {
  (global as any).window = global;
}

export type ModuleOptions = InitOptions;

function toJS(value: any): string {
  if (value === null) return "null";

  const type = typeof value;
  if (type === "string") return JSON.stringify(value);
  if (type === "number" || type === "boolean") return String(value);
  if (type === "undefined") return "undefined";
  if (type === "function") return value.toString();

  if (value instanceof RegExp) return value.toString();
  if (Array.isArray(value)) return `[${value.map(toJS).join(",")}]`;

  if (type === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    return `{${entries
      .map(([k, v]) => `${JSON.stringify(k)}:${toJS(v)}`)
      .join(",")}}`;
  }

  return "undefined";
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@web-tracing/nuxt",
    configKey: "webTracing",
  },
  defaults: {} as ModuleOptions,
  setup(options: ModuleOptions, nuxt: any) {
    addPluginTemplate({
      filename: "web-tracing.client.ts",
      getContents: () => {
        return [
          'import { defineNuxtPlugin } from "#app";',
          'import { init } from "@web-tracing/core";',
          "",
          `const options = ${toJS(options)};`,
          "",
          "export default defineNuxtPlugin(() => {",
          "  init(options);",
          "});",
          "",
        ].join("\n");
      },
    });
  },
});

export * from "@web-tracing/core";
