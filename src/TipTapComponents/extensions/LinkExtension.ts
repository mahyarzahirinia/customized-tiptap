import Link from "@tiptap/extension-link";
import { mergeAttributes } from "@tiptap/core";

export const CustomLinkExtension = Link.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        class: "link-node",
      }),
      0,
    ];
  },
});
