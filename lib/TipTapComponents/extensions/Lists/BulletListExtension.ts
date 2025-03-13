import { mergeAttributes, Node } from "@tiptap/core";

const styling = (value: string) => {
  return {
    disc: "list-disc",
    circle: "!list-[circle]",
    square: "!list-[square]",
  }[value];
};

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
    const typeOfList = node.attrs.typeOfList;
    return [
      "ul",
      mergeAttributes(HTMLAttributes, {
        class: `ps-10 ${styling(typeOfList)}`,
      }),
      0,
    ];
  },
});
