import Link from "@tiptap/extension-link";
import { mergeAttributes } from "@tiptap/core";

export const CustomLinkExtension = Link.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        class: "text-blue-500 underline hover:text-blue-700 cursor-pointer",
      }),
      0,
    ];
  },
});
