# ✨ Customized TipTap

A beautiful, powerful, and developer-friendly WYSIWYG rich-text editor built on [TipTap](https://tiptap.dev), with self-hosted UI controls and icons.

---

## 📌 What is Customized TipTap?

`customized-tiptap` is a feature-rich Vue 3 plugin offering a refined editing experience out of the box. Designed with clean aesthetics and an extensible architecture, it simplifies rich-text editing for modern Vue applications.

🛠 Based on TipTap 2
🎨 Styled with internal UI components and plain CSS
🔗 Includes out-of-the-box self-hosted icons
💬 Multilingual & markdown-capable (in roadmap)

---

## 🚀 Demo

> You can find a live demo of the editor [here](https://stackblitz.com/edit/sb1-1v6rwvd9?file=README.md).

---

## ✨ Features

- 📐 **Self-hosted menus** — Ships with internal toolbar, menu, modal, and form controls
- 🎨 **Plain CSS layout** — Clean, customizable UI without framework CSS
- 🧩 **Pluggable extensions** — Easily extend or override editor behavior
- 🔠 **Markdown-friendly output**
- 🧼 **Zero warnings** — Clean console, smooth experience
- 🧠 **Full TypeScript support**
- 🪄 **Custom merge field support**
- 🪄 **Auto-formatting** *(coming soon)*

---

## 📦 Installation

```bash
npm install customized-tiptap-editor
```

> Tiptap, ProseMirror, UI controls, and icons are package internals. Consumer apps only need Vue 3.

---

## 🚀 Setup Instructions

### 1. Install the package

Install the package through the following command:
```bash
npm install customized-tiptap-editor
```

### 2. Import styles files

import the following styles into your consumer app.

```ts
import 'customized-tiptap-editor/dist/style.css';
```

### 3. Register the plugin

In your main entry file (e.g. `main.ts` or `main.js`):

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import CustomizedTipTapPlugin from 'customized-tiptap-editor';
import 'customized-tiptap-editor/dist/style.css';

const app = createApp(App);

app.use(router);
app.use(CustomizedTipTapPlugin); // Register the editor plugin

app.mount('#app');
```

> **Note:** The editor no longer requires Vuetify or external Material Design Icons. Its controls and icons are self-hosted by the package.

---

## 💡 Usage Example

```vue
<template>
  <customized-tiptap />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('<p>Hello world!</p>')
</script>
```

---

## 🧪 Props

Each prop is designed with flexibility and clarity in mind:

- `readonly?: boolean` — Toggle read-only mode.
- `content?: string` — Initial HTML content to load into the editor.
- `excludedExtensions?: TiptapExtensionName[]` — Extensions to exclude from the editor setup.
- `includedExtensions?: TiptapExtensionName[]` — Explicitly specify which extensions to include.
- `editorProps?: EditorProps` — Pass native props directly to the underlying Tiptap editor.
- `customClasses?: TiptapEditorCustomClasses` — Apply custom CSS classes, e.g., `{ editorWrapper: 'my-wrapper' }`.
- `editorOptions?: EditorOptions` — Full control over Tiptap editor options (like `editable`, `autofocus`, etc).
- `language?: 'fa' | 'en'` — Sets the UI language. Defaults to Persian (`fa`).
- `fontFamily?: string` — Sets the editor UI/content font family. Custom fonts must be loaded by the consuming app.
- `fontFamilyOptions?: Array<{ title: string; value: string }>` — Sets the toolbar font-family options. Values should match loaded CSS font-family names.
- `showLanguageToggle?: boolean` — Renders a toolbar toggle for switching between Persian and English.

### Custom Fonts

The package does not bundle Persian font files. Load your preferred font in your app, then pass its CSS family name to the editor:

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
import { ref } from 'vue'

const content = ref('<p>سلام دنیا</p>')
const fontFamilyOptions = [
  { title: 'Vazirmatn', value: 'Vazirmatn' },
  { title: 'Tahoma', value: 'Tahoma' },
]
</script>
```

### Language API

```vue
<template>
  <customized-tiptap
    v-model="content"
    v-model:language="language"
    show-language-toggle
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('<p>Hello world!</p>')
const language = ref<'fa' | 'en'>('fa')
</script>
```

---

## 🧩 Extension API

Want to add custom buttons or logic? You can pass in your own extensions, merge fields, and configurations. More advanced usage docs coming soon.

---

## ❗ Requirements

- Vue 3
- No CSS framework required

---

## 🛠 Roadmap

- [x] Self-hosted UI controls
- [x] TypeScript support
- [x] Custom merge field insertion
- [ ] Markdown export support
- [ ] Plugin system for menus and toolbars
- [x] I18n (English and Persian)

---

## 🧑‍💻 Contributing

Issues, ideas, and pull requests are always welcome! If you spot any bugs or have suggestions, feel free to open an issue.

---

## 📄 License

MIT © Mohammad
