import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { type Editor } from "@tiptap/core";
import "../styles/pagebreak.css";

export const PageBreakExtension = HorizontalRule.extend({
  addAttributes() {
    return {
      type: {
        default: null,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element) => element.getAttribute("data-type"),
        // … and customize the HTML rendering.
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
  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ editor }: { editor: Editor }) => {
          return editor
            .chain()
            .focus()
            .insertContent('<hr data-type="pagebreak" /><p></p>')
            .run();
        },
    } as Partial<any>;
  },
});
