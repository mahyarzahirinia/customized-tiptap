import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import OrderedListComponent from "../../components/Lists/OrderedListComponent.vue";

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

export const OrderedListExtension = Node.create({
  name: "orderedList", // name of the node
  group: "block list", // what group is part of
  content: "listItem*", // what content is allowed
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      typeOfList: {
        default: "numbered",
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
      "ol",
      mergeAttributes(HTMLAttributes, {
        class: `ps-10 ${styling(typeOfList)}`,
      }),
      0,
    ];
  },
});
