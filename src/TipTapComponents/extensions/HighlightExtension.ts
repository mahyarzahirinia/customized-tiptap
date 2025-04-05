import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (color: string) => ReturnType;
      unsetHighlight: () => ReturnType;
    };
  }
}

export const HighlightExtension = Extension.create({
  name: "highlight",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          backgroundColor: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setHighlight:
        (color) =>
        ({ chain }) =>
          chain().setMark("textStyle", { backgroundColor: color }).run(),
      unsetHighlight:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { backgroundColor: null }).run(),
    };
  },
});
