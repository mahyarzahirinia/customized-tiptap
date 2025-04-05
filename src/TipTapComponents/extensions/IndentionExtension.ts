import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indentation: {
      increaseIndent: () => ReturnType;
      decreaseIndent: () => ReturnType;
    };
  }
}

export const Indentation = Extension.create({
  name: "indentation",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      step: 2, // indentation step in em
      maxIndent: 10, // max allowed indent in em
    };
  },

  addCommands() {
    return {
      increaseIndent:
        () =>
        ({ commands, state }) => {
          const { step, maxIndent } = this.options;

          return this.options.types.every((type: string) => {
            const { lineIndent = "0em" } =
              state.selection.$from.node().attrs || {};
            const currentIndent = parseFloat(lineIndent) || 0;

            if (currentIndent + step > maxIndent) return false;

            return commands.updateAttributes(type, {
              lineIndent: `${currentIndent + step}em`,
            });
          });
        },
      decreaseIndent:
        () =>
        ({ commands, state }) => {
          const { step } = this.options;

          return this.options.types.every((type: string) => {
            const { lineIndent = "0em" } =
              state.selection.$from.node().attrs || {};
            const currentIndent = parseFloat(lineIndent) || 0;

            if (currentIndent - step < 0) return false;

            return commands.updateAttributes(type, {
              lineIndent: `${currentIndent - step}em`,
            });
          });
        },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineIndent: {
            default: "0em",
            parseHTML: (element) => element.style.marginInlineStart || "0em",
            renderHTML: (attributes) => {
              if (!attributes.lineIndent || attributes.lineIndent === "0em")
                return {};
              return {
                style: `margin-left: ${attributes.lineIndent}; margin-right: ${attributes.lineIndent};`,
              };
            },
          },
        },
      },
    ];
  },
});
