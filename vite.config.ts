import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue(), vuetify()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "CustomizedTipTap",
      fileName: "customized-tiptap",
      formats: ["es"], // only ESM
    },
    rollupOptions: {
      external: ["vue", "vuetify"],
      output: {
        globals: {
          vue: "Vue",
          vuetify: "Vuetify",
        },
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
    cssCodeSplit: false, // ← all CSS bundled into one file
  },
});
