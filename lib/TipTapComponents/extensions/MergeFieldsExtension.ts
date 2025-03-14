import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import MergeFieldComponent from "../components/MergeFieldComponent.vue";

export const MergeFieldsExtension = Node.create({
  name: "mergeField",
  group: "inline",
  inline: true,
  atom: true,

  // add attributes
  addAttributes() {
    return {
      label: { default: "Merge Field" },
      title: { default: "" },
      value: { default: "" },
      showValues: { default: false },
    };
  },

  // //add options
  // addOptions() {
  //   return {
  //     showValues: false, // this is default value
  //   };
  // },

  // parses a tag to a mergeField node
  parseHTML() {
    return [{ tag: "span[data-merge-field]" }];
  },

  // this is when you want to export the node to html
  renderHTML({ node }) {
    return [
      "span",
      {
        "label-merge-field": node.attrs.label,
        "title-merge-field": node.attrs.title,
        "value-merge-field": node.attrs.value,
        class: "merge-field",
      },
      node.attrs.label,
      node.attrs.title,
      node.attrs.value,
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(MergeFieldComponent);
  },
});
