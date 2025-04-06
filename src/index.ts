import { Plugin } from "vue";
import CustomizedTipTap from "./CustomizedTipTap.vue";

const CustomizedTipTapPlugin: Plugin = {
  install(app) {
    app.component("customized-tiptap", CustomizedTipTap);
  },
};

export type {
  CustomizedTipTapProps,
  TiptapEditorCustomClasses,
  TiptapExtensionName,
} from "./types/CustomizedTipTapProps";

export default CustomizedTipTapPlugin;
