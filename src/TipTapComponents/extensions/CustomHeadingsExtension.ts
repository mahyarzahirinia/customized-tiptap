import { Node, mergeAttributes, type RawCommands } from "@tiptap/core";
import { type Level } from "@tiptap/extension-heading";

const styling = (value: number) => {
  return {
    0: "inline text-base",
    1: "inline text-4xl",
    2: "inline text-3xl",
    3: "inline text-2xl",
    4: "inline text-xl",
    5: "inline text-lg",
    6: "inline text-md",
  }[value];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    CustomTextBlock: {
      setHeading: (level: Level) => ReturnType;
    };
  }
}

export const CustomTextBlock = Node.create({
  name: "customTextBlock",
  group: "group",
  content: "customTextBlock*",
  inline: false,
  defining: true,

  addAttributes() {
    return {
      level: {
        default: 0, // 0 = paragraph, 1-6 = headings
        parseHTML: (element) => {
          const tag = element.tagName.toLowerCase();
          return tag.startsWith("h") ? parseInt(tag[1]) : 0;
        },
        renderHTML: (attributes) => {
          return attributes.level ? { "data-level": attributes.level } : {};
        },
      },
      class: {
        default: "", // Default empty class
      },
    };
  },

  parseHTML() {
    return [
      { tag: "p" },
      { tag: "h1" },
      { tag: "h2" },
      { tag: "h3" },
      { tag: "h4" },
      { tag: "h5" },
      { tag: "h6" },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level || 0;
    const tag = level ? `h${level}` : "p";

    return [
      tag,
      mergeAttributes(HTMLAttributes, {
        class: styling(level),
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setHeading:
        (level) =>
        ({ chain }) => {
          return chain().setMark(this.name, { level }).run();
        },
      setParagraph:
        () =>
        ({ chain }) => {
          return chain().setMark(this.name, { level: 0 }).run();
        },
      wrapSelectedText:
        (level: number) =>
        ({ state, dispatch }: { state: any; dispatch: any }) => {
          const { from, to } = state.selection;
          const { $from } = state.selection;
          const parentNode = $from.parent; // Get the parent node of the selected text

          // Get the text content of the parent node
          const textContent = parentNode.textContent;

          // Get the selected text
          const selectedText = textContent.slice(
            $from.parentOffset,
            to - $from.start(),
          );

          // Split the text into before, selected, and after
          const beforeText = textContent.slice(0, $from.parentOffset);
          const afterText = textContent.slice(to - $from.start());

          // Create the new node for the selected text
          const newNode = state.schema.nodes.customTextBlock.create(
            { level },
            state.schema.text(selectedText),
          );

          // Create a new paragraph node with the updated structure
          const newParentNode = state.schema.nodes.customTextBlock.create(
            null,
            [
              beforeText && state.schema.text(beforeText),
              newNode,
              afterText && state.schema.text(afterText),
            ],
          );

          // Replace the old parent node with the new one
          if (dispatch) {
            const transaction = state.tr
              .replaceWith(
                beforeText ? $from.before() : $from.start(), // Start of the parent node
                afterText ? $from.after() : $from.end(), // End of the parent node
                newParentNode,
              )
              .scrollIntoView();

            dispatch(transaction);
          }

          return true;
        },
    } as Partial<RawCommands>;
  },
});
