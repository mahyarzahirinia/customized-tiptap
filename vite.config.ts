import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue(), vuetify()],
  build: {
    target: "esnext",
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
        inlineDynamicImports: false,
        manualChunks: undefined, // can be modified to customize chunking behavior
        assetFileNames: "assets/[name].[hash].[ext]", // ensure assets have unique names
        chunkFileNames: "chunks/[name].[hash].js", // split JS files into chunks
      },
    },
    cssCodeSplit: true, // CSS code splitting enabled
    outDir: "dist", // output directory
  },
});
