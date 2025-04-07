export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.VITE_BUILD_TARGET === "production"
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues: true,
                colormin: true,
                mergeLonghand: true,
                reduceIdents: true,
                mergeRules: true
              }
            ]
          }
        }
      : {}),
  },
};
