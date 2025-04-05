import TextAlign from "@tiptap/extension-text-align";

export const TextAlignExtension = TextAlign.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      types: ["paragraph", "heading", "div"], // add "div" to supported types
    };
  },
});
