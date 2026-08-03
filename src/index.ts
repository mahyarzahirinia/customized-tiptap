import { Plugin } from "vue";
import CustomizedTipTap from "./TipTapComponents/CustomizedTipTap.vue";
import { installUiComponents } from "./TipTapComponents/ui-components";

export type {
  CustomizedTipTapProps,
  BasicMergeField,
  MergeFieldInputType,
  TiptapEditorCustomClasses,
  TiptapExtensionName,
} from "./TipTapComponents/types/CustomizedTipTapProps";

export { CustomizedTipTap };

const CustomizedTipTapPlugin: Plugin = {
  install(app) {
    installUiComponents(app);
    app.component("customized-tiptap", CustomizedTipTap);
  },
};

export default CustomizedTipTapPlugin;
