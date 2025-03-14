import { mergeAttributes, type RawCommands } from "@tiptap/core";
import OrderedList from "@tiptap/extension-ordered-list";
import { type Editor } from "@tiptap/vue-3";

const styling = (value: string) => {
  return {
    numbered: "list-decimal",
    "lower-alpha": "!list-[lower-alpha]",
    "lower-greek": "!list-[lower-greek]",
    "lower-roman": "!list-[lower-roman]",
    "upper-alpha": "!list-[upper-alpha]",
    "upper-roman": "!list-[upper-roman]",
  }[value];
};

export const OrderedListExtension = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      typeOfList: {
        rendered: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "ol",
        getAttrs: (dom) => ({
          typeOfList: dom.getAttribute("typeOfList"),
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "ol",
      mergeAttributes(HTMLAttributes, {
        class: `ps-10 ${styling(node.attrs.typeOfList)}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleOrderedList:
        (type: string) =>
        ({ editor }: { editor: Editor }) => {
          console.log("toggleOrderedList", type);
          return editor
            .chain()
            .toggleList("orderedList", "listItem") // specify both list and item type
            .updateAttributes("orderedList", { typeOfList: type }) // update attributes
            .run(); // execute the chain
        },
    } as Partial<any>;
  },
});
