# ✨ Customized TipTap

A beautiful, powerful, and developer-friendly WYSIWYG rich-text editor built on [TipTap](https://tiptap.dev) and customized to work seamlessly with **Vuetify 3**, **Tailwind**, and **Material Design Icons**.

---

## 📌 What is Customized TipTap?

`customized-tiptap` is a feature-rich Vue 3 plugin offering a refined editing experience out of the box. Designed with clean aesthetics and an extensible architecture, it simplifies rich-text editing for modern Vue applications.

🛠 Based on TipTap 2  
🎨 Styled with Tailwind & Vuetify 3  
🔗 Includes out-of-the-box Vuetify-compatible UI  
💬 Multilingual & markdown-capable (in roadmap)

---

## 🚀 Demo

> You can find a live demo of the editor [here](https://stackblitz.com/edit/sb1-1v6rwvd9?file=README.md).

---

## ✨ Features

- 📐 **Vuetify-styled menus** — Looks and feels native to your Vuetify app
- 🎨 **Tailwind-powered layout** — Clean, customizable UI
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

> This package **requires Vuetify 3** and **@mdi/font** as peer dependencies.

---

## 🚀 Setup Instructions

### 1. Install the package

Install the package through the following command:
```bash
npm install customized-tiptap-editor
```

### 2. Make sure Vuetify and Material Design Icons are installed

Install Vuetify and MDI icons if not already installed:

```bash
npm install vuetify @mdi/font
```

### 3. Import styles files

import the following styles into your consumer app.

```ts
import '@mdi/font/css/materialdesignicons.css';
import 'customized-tiptap-editor/dist/style.css';
import "vuetify/styles";
```

### 4. Register the plugin

In your main entry file (e.g. `main.ts` or `main.js`):

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import CustomizedTipTapPlugin from 'customized-tiptap-editor';
import '@mdi/font/css/materialdesignicons.css';
import 'customized-tiptap-editor/dist/style.css';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(router);
app.use(vuetify); // Vuetify must be used
app.use(CustomizedTipTapPlugin); // Register the editor plugin

app.mount('#app');
```

> **Note:** The editor requires Vuetify and MDI icons to render properly. Ensure both are imported as shown above.

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
- `showLanguageToggle?: boolean` — Renders a toolbar toggle for switching between Persian and English.

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
- Vuetify 3
- Tailwind CSS (optional but recommended)
- @mdi/font

---

## 🛠 Roadmap

- [x] Vuetify 3 integration
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


