import {
  Node,
  mergeAttributes,
  type RawCommands,
  type Editor,
  type SingleCommands,
} from "@tiptap/core";

export const AnchorExtension = Node.create({
  name: "idSetter",
  content: "inline*",
  group: "block",
  defining: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(HTMLAttributes), 0];
  },

  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (dom) => ({
          id: dom.getAttribute("id"),
        }),
      },
    ];
  },

  addCommands() {
    return {
      setID:
        (id: string) =>
        ({
          commands,
          editor,
        }: {
          editor: Editor;
          commands: SingleCommands;
        }) => {
          const { $from } = editor.state.selection;

          // check if the selection is inside an `idSetter` node
          if ($from.parent.type.name !== "idSetter") {
            // wrap selection with `idSetter` if not already inside one
            commands.wrapIn("idSetter");
          }

          return commands.updateAttributes(this.name, { id });
        },
      unsetID:
        () =>
        ({ commands }: { commands: SingleCommands }) => {
          return commands.updateAttributes(this.name, { id: null });
        },
    } as Partial<RawCommands>;
  },
});
