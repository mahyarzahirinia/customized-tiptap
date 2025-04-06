import { Plugin } from "vue";
import CustomizedTipTap from "./TipTapComponents/CustomizedTipTap.vue";

const CustomizedTipTapPlugin: Plugin = {
  install(app) {
    app.component("customized-tiptap", CustomizedTipTap);
  },
};

export type {
  CustomizedTipTapProps,
  TiptapEditorCustomClasses,
  TiptapExtensionName,
} from "@/TipTapComponents/types/CustomizedTipTapProps";

export default CustomizedTipTapPlugin;
