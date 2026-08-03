import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import MergeFieldComponent from "../components/MergeFieldComponent.vue";
import type { Component } from "vue";
import type { NodeViewProps } from "@tiptap/vue-3";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";

export const MergeFieldsExtension = Node.create({
  name: "mergeFields",
  group: "inline",
  inline: true,
  atom: true,

  // add attributes
  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-title") || "",
      },
      value: {
        default: "",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-value") || "",
      },
      name: {
        default: "",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-name") || "",
      },
      showValues: {
        default: false,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-show-values") === "true",
      },
    };
  },

  // parses a tag to a mergeField node
  parseHTML() {
    return [
      {
        tag: "span[data-merge-field]",
        getAttrs: (el: HTMLElement | string) => {
          if (typeof el === "string") return false;
          const element = el as HTMLElement;
          return {
            title: element.getAttribute("data-title") || "",
            value: element.getAttribute("data-value") || "",
            name: element.getAttribute("data-name") || "",
            showValues: element.getAttribute("data-show-values") === "true",
          };
        },
      },
    ];
  },

  // this is when you want to export the node to html
  renderHTML({ node }: { node: ProseMirrorNode }) {
    const renderedValue =
      node.attrs.value || (node.attrs.name ? `{${node.attrs.name}}` : "");

    return [
      "span",
      {
        "data-merge-field": "true",
        "data-title": node.attrs.title,
        "data-value": node.attrs.value,
        "data-name": node.attrs.name,
        "data-show-values": String(node.attrs.showValues),
        class: "merge-field",
      },
      renderedValue, // use value for export
    ];
  },

  addCommands() {
    return {
      setAllMergeFieldsShowValues:
        (show: boolean) =>
        ({
          tr,
          state,
          dispatch,
        }: {
          tr: Transaction;
          state: EditorState;
          dispatch?: (transaction: Transaction) => void;
        }) => {
          const { doc } = state;
          let modified = false;

          doc.descendants((node: ProseMirrorNode, pos: number) => {
            if (
              node.type.name === "mergeFields" &&
              node.attrs.showValues !== show
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                showValues: show,
              });
              modified = true;
            }
          });

          if (modified && dispatch) {
            dispatch(tr);
          }

          return modified;
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(
      MergeFieldComponent as unknown as Component<NodeViewProps>
    );
  },
} as Partial<any>);
