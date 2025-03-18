import { mergeAttributes, type RawCommands } from "@tiptap/core";
import OrderedList from "@tiptap/extension-ordered-list";
import { type Editor } from "@tiptap/vue-3";

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
        style: `list-style-type: ${node.attrs.typeOfList}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleOrderedList:
        (type: string) =>
        ({ editor }: { editor: Editor }) => {
          return editor
            .chain()
            .toggleList("orderedList", "listItem") // specify both list and item type
            .updateAttributes("orderedList", { typeOfList: type }) // update attributes
            .run(); // execute the chain
        },
    } as Partial<any>;
  },
});
