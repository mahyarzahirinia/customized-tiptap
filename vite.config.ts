import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const libDir = path.resolve(__dirname, "dist");
const srcDir = path.resolve(__dirname, "src");

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const IS_DEMO = process.env.VITE_BUILD_TARGET === "demo";

  return defineConfig({
    plugins: [
      vue({
        style: {
          // @ts-ignore
          preprocessLang: "scss",
          postcssOptions: "postcss.config.js",
        },
      }),
      IS_DEMO
        ? null
        : dts({
            include: ["src"],
            insertTypesEntry: true,
          }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
    server: {
      port: 8080,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
        {
          find: "demo",
          replacement: path.resolve(__dirname, "demo"),
        },
        {
          find: "customized-tiptap",
          replacement: path.resolve(__dirname, "src/index.ts"),
        },
      ],
    },
    build: IS_DEMO
      ? undefined
      : {
          outDir: libDir,
          minify: "esbuild",
          lib: {
            entry: path.resolve(srcDir, "index.ts"),
            name: "CustomizedTipTap",
            fileName: "customized-tiptap",
          },
          // https://rollupjs.org/guide/en/#big-list-of-options
          rollupOptions: {
            // Make sure to externalize dependencies that you don't want to bundle into your library.
            external: ["vue"],
            output: {
              exports: "named",
              // https://github.com/henriquehbr/svelte-typewriter/issues/21#issuecomment-968835822
              inlineDynamicImports: true,
              // In UMD build mode, provide a global variable for these externalized dependencies.
              globals: {
                vue: "vue",
              },
            },
            plugins: [
              // copy({
              //   targets: [
              //     {
              //       src: "src/i18n/locales/",
              //       dest: "dist",
              //     },
              //   ],
              //   // https://github.com/vitejs/vite/issues/1231#issuecomment-753549857
              //   hook: "writeBundle", // notice here
              // }),
            ],
          },
        },
    publicDir: IS_DEMO ? "public" : false,
  });
};
