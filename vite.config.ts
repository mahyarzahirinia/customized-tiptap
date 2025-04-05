import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "customized-tiptap",
      // the proper extensions will be added
      fileName: "customized-tiptap",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],

      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        inlineDynamicImports: true,
        manualChunks: undefined,
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
