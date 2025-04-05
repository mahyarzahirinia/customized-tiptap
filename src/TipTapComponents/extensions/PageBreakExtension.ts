import { Node, mergeAttributes } from "@tiptap/core";
import { type Editor } from "@tiptap/core";
import "../styles/pagebreak.css";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageBreak: {
      insertPageBreak: () => ReturnType;
    };
  }
}

export const PageBreakExtension = Node.create({
  name: "pageBreak",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (attributes.type) {
            return {
              "data-type": attributes.type,
            };
          }
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'hr[data-type="pagebreak"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "hr",
      mergeAttributes(HTMLAttributes, { "data-type": "pagebreak" }),
    ];
  },
});
