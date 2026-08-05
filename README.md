# Customized TipTap

`customized-tiptap-editor` is a Vue 3 rich-text editor built on TipTap 2. It ships a complete self-hosted toolbar, internal UI controls, bilingual Persian/English labels, table tools, merge fields, preview/export tools, and configurable extension presets.

Current version: `2.0.0`

## Recent Capabilities

The latest changes from the last available week of repository history add:

- A redesigned toolbar with internal buttons, panels, modals, icons, and plain CSS styling.
- Persian and English UI language support with `language`, `v-model:language`, and `showLanguageToggle`.
- External font configuration through `fontFamily` and `fontFamilyOptions`; bundled Persian font files were removed to reduce package weight.
- A table management panel for inserting/removing tables, adding/removing rows and columns, merging/splitting cells, fixing table structure, and moving between cells.
- Extension presets through the `preset` prop: `minimal`, `basic`, `full-feature`, `writing`, and `tables`.
- Flexible extension loading with `includedExtensions` and `excludedExtensions`.
- Two merge-field input modes: grouped default mode and basic flat autocomplete mode.
- Support for flat or grouped merge field data.
- Optional lazy loading for advanced toolbar components with `lazyloadAdvancedComponents`.
- Improved left-to-right English layout and right-to-left Persian layout.
- Internal notifier/snackbar support for editor feedback.
- Package and bundle-size improvements, including Tailwind removal, UI dependency cleanup, a `pnpm` workspace/lockfile, and `BUNDLE_SIZE_REPORT.md`.

## Features

- Vue 3 plugin and component API.
- Two-way HTML binding with `v-model`.
- Read-only mode.
- Toolbar groups for undo/redo, formatting, headings, fonts, lists, alignment, links, tables, and advanced tools.
- Advanced tools for line height, indentation, code blocks, color/highlight, emoji, special characters, HTML export, fullscreen, preview, page breaks, anchors, direction, and merge fields.
- Resizable tables and image resize support.
- Code block highlighting powered by `lowlight` and `highlight.js`.
- Custom CSS class hooks for editor containers and content.
- Direct access to the underlying TipTap editor instance through `editorRef`.
- TypeScript types for props, extensions, presets, languages, fonts, and merge fields.

## Installation

```bash
npm install customized-tiptap-editor
```

The package includes TipTap, ProseMirror, internal controls, and internal icons. Consumer apps only need Vue 3.

## Setup

Import the plugin and stylesheet in your app entry file:

```ts
import { createApp } from "vue";
import App from "./App.vue";

import CustomizedTipTapPlugin from "customized-tiptap-editor";
import "customized-tiptap-editor/dist/style.css";

const app = createApp(App);

app.use(CustomizedTipTapPlugin);
app.mount("#app");
```

## Basic Usage

```vue
<template>
  <customized-tiptap v-model="content" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>Hello world!</p>");
</script>
```

## Language Usage

```vue
<template>
  <customized-tiptap
    v-model="content"
    v-model:language="language"
    show-language-toggle
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>Hello world!</p>");
const language = ref<"fa" | "en">("fa");
</script>
```

## Custom Fonts

The editor no longer bundles Persian fonts. Load the font in your application, then pass its CSS font-family value:

```css
@import url("https://cdn.jsdelivr.net/npm/@fontsource/vazirmatn/index.css");
```

```vue
<template>
  <customized-tiptap
    v-model="content"
    font-family="Vazirmatn, Tahoma, sans-serif"
    :font-family-options="fontFamilyOptions"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>سلام دنیا</p>");
const fontFamilyOptions = [
  { title: "Vazirmatn", value: "Vazirmatn" },
  { title: "Tahoma", value: "Tahoma" },
  { title: "Times New Roman", value: "Times New Roman" },
];
</script>
```

## Merge Fields

Default grouped merge fields:

```vue
<template>
  <customized-tiptap
    v-model="content"
    :merge-fields-data="mergeFields"
    input-type="default"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("");
const mergeFields = [
  {
    group: "User",
    entries: [
      { title: "First name", value: "{{user.firstName}}" },
      { title: "Last name", value: "{{user.lastName}}" },
    ],
  },
];
</script>
```

Basic flat merge fields:

```vue
<template>
  <customized-tiptap
    v-model="content"
    :merge-fields-data="mergeFields"
    input-type="basic"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("");
const mergeFields = [
  { title: "First name", name: "user.firstName" },
  { title: "Email", value: "{{user.email}}" },
];
</script>
```

## Presets

Use `preset` when you want a predefined extension set:

```vue
<template>
  <customized-tiptap v-model="content" preset="tables" />
</template>
```

Available presets:

- `minimal` - document, paragraph, text, and core inline formatting.
- `basic` - common writing tools, headings, lists, history, and rules.
- `full-feature` - all default editor extensions.
- `writing` - typography-focused writing tools.
- `tables` - table-focused editing tools.

You can still fine-tune extensions with `includedExtensions` and `excludedExtensions`.

## Props

- `modelValue?: string` - HTML content for `v-model`.
- `readonly?: boolean` - Enables read-only mode.
- `preset?: "minimal" | "basic" | "full-feature" | "writing" | "tables"` - Loads a predefined extension set.
- `includedExtensions?: TiptapExtensionName[]` - Adds specific extensions.
- `excludedExtensions?: TiptapExtensionName[]` - Removes specific extensions.
- `editorProps?: EditorProps` - Passes ProseMirror editor props.
- `editorOptions?: EditorOptions` - Passes TipTap editor options.
- `customClasses?: TiptapEditorCustomClasses` - Adds custom classes for container/content modes.
- `mergeFieldsData?: MergeFieldsData` - Provides flat or grouped merge fields.
- `inputType?: "default" | "basic"` - Selects the merge-field toolbar UI.
- `mergeFieldsLoading?: boolean` - Shows merge-field loading state.
- `editorRef?: Ref<Editor | null>` - Exposes the underlying editor instance.
- `lazyloadAdvancedComponents?: boolean` - Lazy-loads advanced toolbar components.
- `language?: "fa" | "en"` - Sets UI language. Default is `fa`.
- `fontFamily?: string` - Sets the editor UI and content font family.
- `fontFamilyOptions?: Array<{ title: string; value: string }>` - Sets toolbar font options.
- `showLanguageToggle?: boolean` - Shows the toolbar language toggle.

## Events

- `update:modelValue` - Emits the latest editor HTML.
- `update:language` - Emits when the language changes.
- `error` - Emits TipTap content errors.

## Requirements

- Vue `>=3.4.0`
- No Tailwind, Vuetify, or external icon package is required by the consumer app.

## Development

```bash
npm run dev
npm run build
```

The repository now also includes `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

## فارسی

`customized-tiptap-editor` یک ویرایشگر متن غنی برای Vue 3 است که روی TipTap 2 ساخته شده است. این پکیج تولبار، کنترل‌های رابط کاربری، آیکن‌ها، ابزارهای جدول، فیلدهای ادغامی، پیش‌نمایش، خروجی HTML و رابط دوزبانه فارسی/انگلیسی را به صورت داخلی ارائه می‌کند.

نسخه فعلی: `2.0.0`

## قابلیت‌های جدید

تغییرات جدید موجود در تاریخچه یک هفته اخیر مخزن شامل این موارد است:

- بازطراحی تولبار با دکمه‌ها، پنل‌ها، مودال‌ها، آیکن‌ها و استایل‌های داخلی بر پایه CSS ساده.
- پشتیبانی از زبان فارسی و انگلیسی با `language`، `v-model:language` و `showLanguageToggle`.
- تنظیم فونت از بیرون پکیج با `fontFamily` و `fontFamilyOptions`؛ فایل‌های فونت فارسی از باندل حذف شده‌اند تا حجم پکیج کمتر شود.
- پنل مدیریت جدول برای ساخت و حذف جدول، افزودن و حذف سطر و ستون، ادغام و جدا کردن سلول‌ها، اصلاح ساختار جدول و حرکت بین سلول‌ها.
- پریست‌های آماده برای اکستنشن‌ها با prop به نام `preset`: مقدارهای `minimal`، `basic`، `full-feature`، `writing` و `tables`.
- کنترل انعطاف‌پذیر اکستنشن‌ها با `includedExtensions` و `excludedExtensions`.
- دو حالت ورودی برای merge field: حالت گروه‌بندی‌شده پیش‌فرض و حالت ساده با لیست تخت.
- پشتیبانی از داده‌های merge field به صورت تخت یا گروه‌بندی‌شده.
- امکان lazy load کردن ابزارهای پیشرفته با `lazyloadAdvancedComponents`.
- بهبود چیدمان انگلیسی چپ‌به‌راست و فارسی راست‌به‌چپ.
- اضافه شدن notifier/snackbar داخلی برای بازخوردهای ویرایشگر.
- بهبودهای مربوط به حجم باندل، حذف Tailwind، پاک‌سازی وابستگی‌های رابط کاربری، اضافه شدن فایل‌های pnpm و گزارش `BUNDLE_SIZE_REPORT.md`.

## امکانات

- پلاگین و کامپوننت آماده برای Vue 3.
- اتصال دوطرفه HTML با `v-model`.
- حالت فقط خواندنی.
- تولبار برای undo/redo، قالب‌بندی متن، تیترها، فونت، لیست‌ها، چینش، لینک، جدول و ابزارهای پیشرفته.
- ابزارهای پیشرفته برای line height، indentation، کد بلاک، رنگ و هایلایت، ایموجی، کاراکترهای ویژه، خروجی HTML، تمام‌صفحه، پیش‌نمایش، page break، anchor، جهت متن و merge field.
- جدول‌های قابل resize و پشتیبانی از resize تصویر.
- هایلایت کد با `lowlight` و `highlight.js`.
- امکان تعریف کلاس‌های CSS سفارشی برای بخش‌های مختلف ویرایشگر.
- دسترسی مستقیم به نمونه TipTap از طریق `editorRef`.
- تایپ‌های TypeScript برای props، اکستنشن‌ها، پریست‌ها، زبان‌ها، فونت‌ها و merge fieldها.

## نصب

```bash
npm install customized-tiptap-editor
```

این پکیج TipTap، ProseMirror، کنترل‌های داخلی و آیکن‌های داخلی را همراه خود دارد. برنامه مصرف‌کننده فقط به Vue 3 نیاز دارد.

## راه‌اندازی

در فایل ورودی برنامه، پلاگین و فایل استایل را import کنید:

```ts
import { createApp } from "vue";
import App from "./App.vue";

import CustomizedTipTapPlugin from "customized-tiptap-editor";
import "customized-tiptap-editor/dist/style.css";

const app = createApp(App);

app.use(CustomizedTipTapPlugin);
app.mount("#app");
```

## استفاده ساده

```vue
<template>
  <customized-tiptap v-model="content" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>سلام دنیا</p>");
</script>
```

## استفاده از زبان

```vue
<template>
  <customized-tiptap
    v-model="content"
    v-model:language="language"
    show-language-toggle
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>سلام دنیا</p>");
const language = ref<"fa" | "en">("fa");
</script>
```

## فونت سفارشی

این پکیج دیگر فونت فارسی را داخل باندل قرار نمی‌دهد. فونت موردنظر را در برنامه خود load کنید و نام CSS آن را به ویرایشگر بدهید:

```css
@import url("https://cdn.jsdelivr.net/npm/@fontsource/vazirmatn/index.css");
```

```vue
<template>
  <customized-tiptap
    v-model="content"
    font-family="Vazirmatn, Tahoma, sans-serif"
    :font-family-options="fontFamilyOptions"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>سلام دنیا</p>");
const fontFamilyOptions = [
  { title: "Vazirmatn", value: "Vazirmatn" },
  { title: "Tahoma", value: "Tahoma" },
  { title: "Times New Roman", value: "Times New Roman" },
];
</script>
```

## Merge Fields

حالت پیش‌فرض گروه‌بندی‌شده:

```vue
<template>
  <customized-tiptap
    v-model="content"
    :merge-fields-data="mergeFields"
    input-type="default"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("");
const mergeFields = [
  {
    group: "User",
    entries: [
      { title: "First name", value: "{{user.firstName}}" },
      { title: "Last name", value: "{{user.lastName}}" },
    ],
  },
];
</script>
```

حالت ساده با لیست تخت:

```vue
<template>
  <customized-tiptap
    v-model="content"
    :merge-fields-data="mergeFields"
    input-type="basic"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("");
const mergeFields = [
  { title: "First name", name: "user.firstName" },
  { title: "Email", value: "{{user.email}}" },
];
</script>
```

## پریست‌ها

برای استفاده از مجموعه اکستنشن‌های آماده از `preset` استفاده کنید:

```vue
<template>
  <customized-tiptap v-model="content" preset="tables" />
</template>
```

پریست‌های موجود:

- `minimal` - ابزارهای پایه سند، پاراگراف، متن و قالب‌بندی ساده.
- `basic` - ابزارهای رایج نوشتن، تیتر، لیست، history و خط افقی.
- `full-feature` - همه اکستنشن‌های پیش‌فرض ویرایشگر.
- `writing` - ابزارهای مناسب متن‌نویسی و تایپوگرافی.
- `tables` - ابزارهای متمرکز بر ویرایش جدول.

همچنان می‌توانید اکستنشن‌ها را با `includedExtensions` و `excludedExtensions` دقیق‌تر کنترل کنید.

## Props

- `modelValue?: string` - محتوای HTML برای `v-model`.
- `readonly?: boolean` - فعال‌سازی حالت فقط خواندنی.
- `preset?: "minimal" | "basic" | "full-feature" | "writing" | "tables"` - انتخاب مجموعه اکستنشن آماده.
- `includedExtensions?: TiptapExtensionName[]` - افزودن اکستنشن‌های مشخص.
- `excludedExtensions?: TiptapExtensionName[]` - حذف اکستنشن‌های مشخص.
- `editorProps?: EditorProps` - ارسال props مربوط به ProseMirror.
- `editorOptions?: EditorOptions` - ارسال تنظیمات TipTap.
- `customClasses?: TiptapEditorCustomClasses` - تعریف کلاس‌های سفارشی برای container و content.
- `mergeFieldsData?: MergeFieldsData` - داده‌های merge field به صورت تخت یا گروه‌بندی‌شده.
- `inputType?: "default" | "basic"` - انتخاب رابط کاربری merge field.
- `mergeFieldsLoading?: boolean` - نمایش وضعیت loading برای merge fieldها.
- `editorRef?: Ref<Editor | null>` - دسترسی به instance داخلی ویرایشگر.
- `lazyloadAdvancedComponents?: boolean` - lazy load کردن ابزارهای پیشرفته تولبار.
- `language?: "fa" | "en"` - زبان رابط کاربری. مقدار پیش‌فرض `fa` است.
- `fontFamily?: string` - فونت رابط کاربری و محتوای ویرایشگر.
- `fontFamilyOptions?: Array<{ title: string; value: string }>` - گزینه‌های فونت در تولبار.
- `showLanguageToggle?: boolean` - نمایش دکمه تغییر زبان در تولبار.

## رویدادها

- `update:modelValue` - آخرین HTML ویرایشگر را ارسال می‌کند.
- `update:language` - هنگام تغییر زبان ارسال می‌شود.
- `error` - خطاهای محتوای TipTap را ارسال می‌کند.

## نیازمندی‌ها

- Vue `>=3.4.0`
- برنامه مصرف‌کننده به Tailwind، Vuetify یا پکیج آیکن خارجی نیاز ندارد.

## توسعه

```bash
npm run dev
npm run build
```

این مخزن اکنون شامل `pnpm-lock.yaml` و `pnpm-workspace.yaml` نیز هست.

## License

MIT © Mohammad Zahirinia
