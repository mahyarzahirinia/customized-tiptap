import { Node, mergeAttributes, type RawCommands } from "@tiptap/core";
import { findParentNode } from "@tiptap/core";
import "../styles/direction.css";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    directionWrapper: {
      setDirection: (direction: "ltr" | "rtl") => ReturnType;
    };
  }
}

export const DirectionWrapperExtension = Node.create({
  name: "directionWrapper",

  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      dir: {
        default: "rtl",
        parseHTML: (element) => element.getAttribute("dir") || "rtl",
        renderHTML: (attributes) => ({
          dir: attributes.dir,
          class: `direction-wrapper ${attributes.dir}`,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[dir]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setDirection:
        (direction: "rtl" | "ltr") =>
        ({ state, chain }: { state: any; chain: any }) => {
          const { from, to } = state.selection;

          return chain()
            .command(({ tr }: { tr: any }) => {
              // Find and remove any existing directionWrapper node
              tr.doc.nodesBetween(from, to, (node: any, pos: any) => {
                if (node.type.name === this.name) {
                  // Extract the content of the existing node
                  const content = node.content;
                  // Replace the existing node with its content
                  tr.replaceWith(pos, pos + node.nodeSize, content);
                }
              });
              return true;
            })
            .wrapIn(this.name, { dir: direction }) // Wrap content in a new div with dir="rtl"
            .run();
        },
    } as Partial<RawCommands>;
  },
});
