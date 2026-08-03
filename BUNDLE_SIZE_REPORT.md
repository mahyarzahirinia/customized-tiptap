# Bundle Size Report

Date: 2026-08-03

This report explains why the package build is currently large, based on the current merged state of the project.

## Build Output Summary

The production build was generated with:

```sh
npm run build -- --sourcemap
```

The important generated files were:

| File | Size | Gzip |
| --- | ---: | ---: |
| `dist/style.css` | 3,881.64 kB | 2,214.94 kB |
| `dist/customized-tiptap.js` | 2,271.45 kB | 600.67 kB |
| `dist/customized-tiptap.umd.cjs` | 1,588.93 kB | 492.37 kB |
| `dist/customized-tiptap.js.map` | 4,895.13 kB | n/a |
| `dist/customized-tiptap.umd.cjs.map` | 4,591.77 kB | n/a |

The source maps are only emitted when building with `--sourcemap`; they are useful for diagnosis but should generally not be included in published package artifacts unless intentionally needed.

## Primary Findings

### 1. CSS Is Large Because Fonts Are Inlined

`dist/style.css` is approximately 3.7 MB. Most of that file is not normal CSS rules; it is inlined font data.

Measured from `dist/style.css`:

| Metric | Value |
| --- | ---: |
| CSS characters | 3,881,619 |
| `data:` URLs | 48 |
| `@font-face` blocks | 10 |
| Characters inside font `data:` URLs | 3,807,234 |

That means roughly 98% of the generated CSS file is inlined font payload.

The source is `src/assets/main.css`, which is imported by `src/TipTapComponents/config.ts`:

```ts
import "../assets/main.css";
```

`src/assets/main.css` declares many fonts and multiple formats per font:

- Vazir Medium: `eot`, `woff`, `woff2`, `ttf`
- Vazir Thin: `eot`, `woff`, `woff2`, `ttf`
- Vazir Bold: `eot`, `woff`, `woff2`, `ttf`
- Vazir Medium Persian-number variant: `eot`, `woff`, `woff2`, `ttf`
- Vazir Thin Persian-number variant: `eot`, `woff`, `woff2`, `ttf`
- Vazir Bold Persian-number variant: `eot`, `woff`, `woff2`, `ttf`
- Yekan regular: `eot`, `woff`, `ttf`
- Yekan: `eot`, `woff`, `ttf`
- Sahel: `eot`, `woff`, `woff2`, `ttf`
- Samim: `eot`, `woff`, `woff2`, `ttf`

The `src/assets` folder is about 2.2 MB before Vite transforms it. Once these files are referenced from CSS, Vite inlines them as base64 data URLs in the library CSS output, causing the CSS file to balloon to 3.7 MB.

### 2. Lowlight Imports Every Highlight.js Language

`src/TipTapComponents/config.ts` contains:

```ts
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
```

This imports all Highlight.js languages through Lowlight.

The file then separately registers only a few languages:

```ts
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
```

However, because `createLowlight(all)` already references the full language collection, the final bundle still includes many languages that are not explicitly used.

Sourcemap analysis shows `highlight.js` contributes approximately 1.53 MB of original source content to the ESM bundle. Some of the largest language modules present include:

| Source | Original Source Size |
| --- | ---: |
| `highlight.js/es/languages/mathematica.js` | 147,966 bytes |
| `highlight.js/es/languages/isbl.js` | 104,981 bytes |
| `highlight.js/es/languages/gml.js` | 77,807 bytes |
| `highlight.js/es/languages/sqf.js` | 58,827 bytes |
| `highlight.js/es/languages/1c.js` | 37,139 bytes |
| `highlight.js/es/languages/maxima.js` | 32,838 bytes |
| `highlight.js/es/languages/pgsql.js` | 28,756 bytes |

This is the largest JavaScript-specific cause of bundle growth.

### 3. Tiptap and ProseMirror Runtime Packages Are Bundled

The library build currently externalizes only:

```ts
external: ["vue", "vuetify", "@mdi/font", "tailwindcss"]
```

That is in `vite.config.ts`.

Because Tiptap, ProseMirror, Lowlight, Highlight.js, and related editor dependencies are not externalized, they are bundled into `dist/customized-tiptap.js`.

Top package groups from sourcemap source-content analysis:

| Package or Group | Original Source Size |
| --- | ---: |
| `highlight.js` | 1,530,081 bytes |
| local project code | 270,261 bytes |
| `prosemirror-view` | 240,489 bytes |
| `@tiptap/core` | 196,248 bytes |
| `prosemirror-model` | 123,608 bytes |
| `@tiptap/extension-code-block-lowlight` | 82,173 bytes |
| `prosemirror-transform` | 81,753 bytes |
| `prosemirror-tables` | 79,236 bytes |
| `tippy.js` | 73,998 bytes |
| `@popperjs/core` | 68,941 bytes |
| `linkifyjs` | 63,088 bytes |
| `tiptap-extension-resize-image` | 43,466 bytes |
| `prosemirror-state` | 36,246 bytes |
| `prosemirror-commands` | 34,469 bytes |
| `lowlight` | 25,257 bytes |

Some of this is expected for an editor package. But if this package is intended to be a Vue/Tiptap library used inside apps that already install Tiptap, these should likely be peer dependencies and externalized.

## Most Important Source Locations

### Font CSS

File:

```text
src/assets/main.css
```

Imported by:

```text
src/TipTapComponents/config.ts
```

Problem:

All font faces and all font formats are included in the distributed CSS.

Impact:

This is the main reason `dist/style.css` is 3.7 MB.

### Lowlight Setup

File:

```text
src/TipTapComponents/config.ts
```

Problem:

```ts
import { all, createLowlight } from "lowlight";
const lowlight = createLowlight(all);
```

Impact:

This pulls in all Highlight.js language definitions and makes JavaScript output much larger than needed.

### Rollup Externals

File:

```text
vite.config.ts
```

Current external list:

```ts
external: ["vue", "vuetify", "@mdi/font", "tailwindcss"]
```

Problem:

Tiptap, ProseMirror, Highlight.js, Lowlight, Tippy, Popper, and other editor dependencies are bundled.

Impact:

`dist/customized-tiptap.js` is about 2.2 MB, with a large portion coming from bundled runtime dependencies.

## Recommended Fixes

### Fix 1. Replace `createLowlight(all)` With Specific Languages

Current:

```ts
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
```

Recommended:

```ts
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
```

Expected impact:

Large JavaScript reduction. This should remove many unused Highlight.js language modules.

Risk:

Only the registered languages will be highlighted. If consumers need additional languages, expose an API for adding them or document how to extend the default extension list.

### Fix 2. Stop Bundling Every Font Format

Current:

Each font face includes legacy formats such as `eot`, `ttf`, `woff`, and `woff2`.

Recommended minimum:

Use only `woff2` for modern browsers, or remove bundled fonts entirely and let the consuming app provide fonts.

Example:

```css
@font-face {
  font-family: vazir-medium;
  src: url("fonts/Vazir/Vazir-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

Expected impact:

Very large CSS reduction. Removing legacy formats and unused font families could reduce `style.css` by multiple megabytes.

Better library-friendly option:

Do not import `src/assets/main.css` from the default package runtime. Instead:

- Keep core editor styles bundled.
- Export optional font CSS separately.
- Let consumers opt in if they want those bundled fonts.

### Fix 3. Externalize Tiptap and ProseMirror Dependencies

If consumers are expected to install editor dependencies, add the major Tiptap and ProseMirror packages to Rollup external config.

Potential external list:

```ts
external: [
  "vue",
  "@tiptap/core",
  "@tiptap/vue-3",
  "@tiptap/pm",
  "@tiptap/starter-kit",
  "@tiptap/extension-blockquote",
  "@tiptap/extension-bold",
  "@tiptap/extension-bubble-menu",
  "@tiptap/extension-bullet-list",
  "@tiptap/extension-character-count",
  "@tiptap/extension-code",
  "@tiptap/extension-code-block",
  "@tiptap/extension-code-block-lowlight",
  "@tiptap/extension-color",
  "@tiptap/extension-document",
  "@tiptap/extension-dropcursor",
  "@tiptap/extension-font-family",
  "@tiptap/extension-gapcursor",
  "@tiptap/extension-hard-break",
  "@tiptap/extension-heading",
  "@tiptap/extension-highlight",
  "@tiptap/extension-history",
  "@tiptap/extension-horizontal-rule",
  "@tiptap/extension-image",
  "@tiptap/extension-italic",
  "@tiptap/extension-link",
  "@tiptap/extension-list-item",
  "@tiptap/extension-ordered-list",
  "@tiptap/extension-paragraph",
  "@tiptap/extension-placeholder",
  "@tiptap/extension-strike",
  "@tiptap/extension-table",
  "@tiptap/extension-table-cell",
  "@tiptap/extension-table-header",
  "@tiptap/extension-table-row",
  "@tiptap/extension-task-item",
  "@tiptap/extension-task-list",
  "@tiptap/extension-text",
  "@tiptap/extension-text-align",
  "@tiptap/extension-text-style",
  "@tiptap/extension-underline",
  "lowlight",
  "highlight.js",
  "prosemirror-model",
  "prosemirror-state",
  "prosemirror-view",
  "prosemirror-transform",
  "prosemirror-tables",
  "prosemirror-commands",
  "prosemirror-history",
  "tiptap-extension-resize-image",
]
```

Expected impact:

The published package bundle becomes much smaller.

Tradeoff:

Consumers must install compatible peer dependencies. This is usually appropriate for a library package, but it should be reflected in `peerDependencies` and documentation.

### Fix 4. Keep Demo CSS Out of Library Builds

The current library entry imports `config.ts`, and `config.ts` imports global package styles:

```ts
import "../assets/main.css";
```

This means font CSS is part of the library artifact even if the consumer does not use those fonts.

Recommended structure:

- `src/TipTapComponents/styles/editor.css`: required editor styles only.
- `src/assets/fonts.css`: optional font declarations.
- `demo/assets/main.css`: demo-only Tailwind and font setup.

Then only import required editor styles from the library runtime.

## Suggested Priority Order

1. Replace `createLowlight(all)` with explicit language registration.
2. Remove or split bundled font CSS from the default library build.
3. Use only `woff2` for any fonts that remain bundled.
4. Decide whether Tiptap and ProseMirror should be externalized as peer dependencies.
5. Rebuild with `npm run build -- --sourcemap` and compare the output sizes again.

## Diagnostic Commands Used

Build with sourcemaps:

```sh
npm run build -- --sourcemap
```

Inspect generated file sizes:

```sh
du -sh dist/*
find dist -maxdepth 2 -type f -exec wc -c {} + | sort -n | tail -20
```

Measure inlined CSS payload:

```sh
node - <<'NODE'
const fs = require("fs");
const css = fs.readFileSync("dist/style.css", "utf8");
console.log("css chars", css.length);
console.log("data urls", (css.match(/data:/g) || []).length);
console.log("font-face blocks", (css.match(/@font-face/g) || []).length);
let dataTotal = 0;
for (const match of css.matchAll(/url\((data:[^)]+)\)/g)) {
  dataTotal += match[1].length;
}
console.log("data url chars", dataTotal);
NODE
```

Rank modules from the ESM sourcemap:

```sh
node - <<'NODE'
const fs = require("fs");
const map = JSON.parse(fs.readFileSync("dist/customized-tiptap.js.map", "utf8"));
const rows = map.sources.map((src, index) => ({
  src,
  bytes: (map.sourcesContent?.[index] || "").length,
}));

rows.sort((a, b) => b.bytes - a.bytes);
console.log("Top sources by original source bytes:");
for (const row of rows.slice(0, 40)) {
  console.log(String(row.bytes).padStart(8), row.src);
}

const groups = {};
for (const row of rows) {
  const key = row.src.includes("node_modules/")
    ? row.src
        .split("node_modules/")[1]
        .split("/")
        .slice(0, row.src.split("node_modules/")[1].startsWith("@") ? 2 : 1)
        .join("/")
    : "(local)";
  groups[key] = (groups[key] || 0) + row.bytes;
}

console.log("\nTop package/local groups:");
Object.entries(groups)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([key, value]) => console.log(String(value).padStart(8), key));
NODE
```

## Proposed Solutions

This section turns the findings above into concrete implementation options.

### Solution 1. Remove `lowlight/all`

This is the fastest JavaScript bundle-size win.

Change `src/TipTapComponents/config.ts` from:

```ts
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
```

To:

```ts
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight();
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
```

Expected result:

- Removes unused Highlight.js language modules.
- Keeps highlighting for HTML, CSS, JavaScript, and TypeScript.
- Should significantly reduce `dist/customized-tiptap.js`.

Follow-up option:

Expose a helper so consumers can provide their own `lowlight` instance or language list if they need more languages.

### Solution 2. Split Fonts Out of the Default Library CSS

The package should not force every consumer to download all bundled fonts.

Recommended structure:

```text
src/TipTapComponents/styles/editor.css
src/assets/fonts.css
src/assets/main.css
```

Suggested responsibility:

| File | Purpose |
| --- | --- |
| `src/TipTapComponents/styles/editor.css` | Required editor layout/styles only |
| `src/assets/fonts.css` | Optional bundled font declarations |
| `src/assets/main.css` | Compatibility entry, or demo-only wrapper |

Then update `src/TipTapComponents/config.ts` so it does not import all fonts by default:

```ts
// Before
import "../assets/main.css";

// After
import "./styles/editor.css";
```

Then expose optional font CSS from `package.json`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/customized-tiptap.js",
      "require": "./dist/customized-tiptap.umd.cjs"
    },
    "./dist/style.css": "./dist/style.css",
    "./dist/fonts.css": "./dist/fonts.css"
  }
}
```

Expected result:

- Default CSS becomes much smaller.
- Consumers can opt into the package fonts only when needed.
- Apps that already have their own font system avoid duplicate font downloads.

### Solution 3. Keep Only `woff2` Font Files

If bundled fonts are still needed, use only modern `woff2` files.

Current pattern:

```css
@font-face {
  font-family: vazir-medium;
  src: url("fonts/Vazir/Vazir-Medium.eot");
  src:
    url("fonts/Vazir/Vazir-Medium.eot?#iefix") format("FontName-opentype"),
    url("fonts/Vazir/Vazir-Medium.woff") format("woff"),
    url("fonts/Vazir/Vazir-Medium.woff2") format("woff2"),
    url("fonts/Vazir/Vazir-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
}
```

Recommended pattern:

```css
@font-face {
  font-family: vazir-medium;
  src: url("fonts/Vazir/Vazir-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

Also consider reducing the default font list:

- Keep only the default editor font.
- Move extra families such as Yekan, Sahel, and Samim to optional CSS files.
- Avoid shipping both normal and Persian-number variants unless both are actively needed.

Expected result:

- Removes repeated legacy font payload.
- Reduces CSS size by multiple megabytes if combined with Solution 2.

### Solution 4. Prevent Font Inlining in Library Builds

If fonts must remain in the package, configure Vite to emit them as separate assets instead of inlining them into `style.css`.

Add or adjust `build.assetsInlineLimit` in `vite.config.ts`:

```ts
build: IS_DEMO
  ? undefined
  : {
      assetsInlineLimit: 0,
      cssMinify: true,
      outDir: libDir,
      minify: "esbuild",
      lib: {
        entry: path.resolve(srcDir, "index.ts"),
        name: "CustomizedTipTap",
        fileName: "customized-tiptap",
      },
      rollupOptions: {
        external: ["vue", "vuetify", "@mdi/font", "tailwindcss"],
      },
    },
```

Expected result:

- CSS file becomes smaller.
- Font files may appear as separate files under `dist/assets`.
- Total published package size may still be large unless unused formats/families are removed.

Important note:

This improves CSS delivery shape but does not remove the font bytes from the package. It should be combined with Solution 2 or Solution 3.

### Solution 5. Externalize Editor Runtime Dependencies

For a library package, it is usually better to externalize major framework/runtime dependencies and declare them as peers.

Create a helper in `vite.config.ts`:

```ts
const externalPackages = [
  "vue",
  "lowlight",
  "highlight.js",
  "tiptap-extension-resize-image",
  /^@tiptap\//,
  /^prosemirror-/,
];
```

Then use it in Rollup:

```ts
rollupOptions: {
  external: externalPackages,
  output: {
    globals: {
      vue: "Vue",
    },
  },
}
```

Expected result:

- Much smaller package JS output.
- Tiptap/ProseMirror code is not duplicated across consuming apps.

Tradeoff:

- Consumers must install compatible versions.
- `peerDependencies` should be updated to include the externalized packages.
- Documentation should clearly list required peer installs.

This solution is best if the package is meant to behave like a reusable editor library. If the package is meant to be a fully self-contained widget, keep dependencies bundled but still apply the `lowlight/all` and font fixes.

### Solution 6. Offer a Minimal Build Entry

The current default entry pulls in the full default extension set. A minimal entry can let consumers choose the extension bundle they want.

Example package exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/customized-tiptap.js",
      "require": "./dist/customized-tiptap.umd.cjs"
    },
    "./minimal": {
      "types": "./dist/minimal.d.ts",
      "import": "./dist/minimal.js"
    },
    "./dist/style.css": "./dist/style.css"
  }
}
```

Example minimal entry:

```ts
export { CustomizedTipTap } from "./TipTapComponents/CustomizedTipTap.vue";
export type { CustomizedTipTapProps } from "./TipTapComponents/types/CustomizedTipTapProps";
```

Expected result:

- Consumers that provide their own extensions avoid importing the package's full default extension config.
- More advanced consumers can optimize their own bundles.

Tradeoff:

- Slightly more API/documentation surface.
- Requires careful export design so existing users are not broken.

### Recommended Implementation Plan

Do these in order:

1. Replace `createLowlight(all)` with explicit language registration.
2. Move bundled fonts out of the default runtime import.
3. Reduce any retained bundled fonts to `woff2` only.
4. Add `assetsInlineLimit: 0` if any font files remain referenced from CSS.
5. Decide whether Tiptap/ProseMirror should be peer-externalized.
6. Rebuild and compare:

```sh
npm run build -- --sourcemap
du -sh dist/*
```

Expected best outcome:

- `dist/style.css` drops from megabytes to a much smaller stylesheet.
- `dist/customized-tiptap.js` drops substantially after removing `lowlight/all`.
- If editor dependencies are externalized, the JavaScript bundle becomes much smaller again.

