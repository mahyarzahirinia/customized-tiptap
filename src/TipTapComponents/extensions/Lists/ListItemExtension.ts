import { mergeAttributes, Node } from "@tiptap/core";

export const ListItemExtension = Node.create({
  name: "listItem",
  content: "block*",
  parseHTML() {
    return [{ tag: "li" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["li", mergeAttributes(HTMLAttributes, { class: "mx-2" }), 0];
  },
});
