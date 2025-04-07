import { mergeAttributes, Node } from "@tiptap/core";

export const BulletListExtension = Node.create({
  name: "bulletList",
  group: "block list",
  content: "listItem*",

  addAttributes() {
    return {
      typeOfList: {
        default: "disc",
        rendered: true,
      },
    };
  },
  parseHTML() {
    return [{ tag: "ol[typeOfList]" }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(HTMLAttributes, {
        style: `list-style-type: ${node.attrs.typeOfList}`,
      }),
      0,
    ];
  },
});
