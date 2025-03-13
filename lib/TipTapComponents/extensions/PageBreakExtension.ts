import {
  Node,
  mergeAttributes,
  type RawCommands,
  type Editor,
} from "@tiptap/core";
import "../styles/pagebreak.css";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    PageBreak: {
      insertPageBreak: () => ReturnType;
    };
  }
}

export const PageBreakExtension = Node.create({
  name: "pageBreak",
  group: "pagebreak",

  parseHTML() {
    return [{ tag: "hr.page-break" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["hr", mergeAttributes(HTMLAttributes, { class: "page-break" })];
  },

  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ editor }: { editor: Editor }) => {
          return editor.chain().insertContent({ type: this.name }).run();
        },
    } as Partial<RawCommands>;
  },
});
