import {
  Mark,
  mergeAttributes,
  type RawCommands,
  type Editor,
  type SingleCommands,
} from "@tiptap/core";

export const AnchorExtension = Mark.create({
  name: "idSetter",

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[id]",
        getAttrs: (dom) => ({
          id: dom.getAttribute("id"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setID:
        (id: string) =>
        ({ commands }: { commands: SingleCommands }) => {
          return commands.setMark(this.name, { id });
        },
      unsetID:
        () =>
        ({ commands }: { commands: SingleCommands }) => {
          return commands.unsetMark(this.name);
        },
    } as Partial<RawCommands>;
  },
});
