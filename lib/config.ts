import { Extension, Mark, Node } from "@tiptap/core";
import { all, createLowlight } from "lowlight";

export type Module = Array<Extension | Mark | Node>;

// استایل‌های مورد نیاز
import "./TipTapComponents/styles/tables.css";
import "./TipTapComponents/styles/anchor.css";
import "./TipTapComponents/styles/direction.css";
import "./TipTapComponents/styles/pagebreak.css";
import "./TipTapComponents/styles/mergefields.css";
import "highlight.js/styles/atom-one-dark.css";

// تنظیمات `lowlight` برای CodeBlock
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

// مقداردهی `lowlight`
const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

// default nodes
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
import { Document } from "@tiptap/extension-document";
import { FontFamily } from "@tiptap/extension-font-family";
import { Text } from "@tiptap/extension-text";
import { Heading } from "@tiptap/extension-heading";
import { Paragraph } from "@tiptap/extension-paragraph";
import { LineHeight } from "./TipTapComponents/extensions/LineHeightExtension";
import { Indentation } from "./TipTapComponents/extensions/IndentionExtension";
import { Blockquote } from "@tiptap/extension-blockquote";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { HardBreak } from "@tiptap/extension-hard-break";
import { ListItem } from "@tiptap/extension-list-item";
// default marks
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
// default extensions
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { History } from "@tiptap/extension-history";
// custom extensions
import { FontSizeExtension } from "./TipTapComponents/extensions/FontSizeExtension";
import { OrderedListExtension } from "./TipTapComponents/extensions/Lists/OrderedListExtension";
import { BulletListExtension } from "./TipTapComponents/extensions/Lists/BulletListExtension";
import { CustomLinkExtension } from "./TipTapComponents/extensions/LinkExtension";
import { DirectionWrapperExtension } from "./TipTapComponents/extensions/DirectionExtension";
import { CustomTableExtension } from "./TipTapComponents/extensions/CustomTableExtension";
import { ColorExtensionExtension } from "./TipTapComponents/extensions/ColorExtensionExtension";
import { HighlightExtension } from "./TipTapComponents/extensions/HighlightExtension";
import { FullscreenExtension } from "./TipTapComponents/extensions/FullscreenExtension";
import { PreviewExtension } from "./TipTapComponents/extensions/PreviewExtension";
import { PrintExtension } from "./TipTapComponents/extensions/PrintExtension";
import { PageBreakExtension } from "./TipTapComponents/extensions/PageBreakExtension";
import { AnchorExtension } from "./TipTapComponents/extensions/AnchorExtension";
import { TextAlignExtension } from "./TipTapComponents/extensions/AlignmentExtension";
import { LinkAnchorExtension } from "./TipTapComponents/extensions/LinkAnchorExtension";
import { MergeFieldsExtension } from "./TipTapComponents/extensions/MergeFieldsExtension";
import { ListItemExtension } from "./TipTapComponents/extensions/Lists/ListItemExtension";
import { CharacterCountExtension } from "./TipTapComponents/extensions/CharacterCountExtension";
import { CustomFloatingToolboxPlugin } from "./TipTapComponents/extensions/FloatingToolBoxExtension";
import { CustomTableRow } from "./TipTapComponents/extensions/CustomTableRow";
import { CustomTableHeader } from "./TipTapComponents/extensions/CustomTableHeader";

const defaultExtensions: Array<Extension | Mark | Node> = [
  // Text,
  // ListItemExtension,
  // Document,
  // DirectionWrapperExtension,
  // TextAlign.configure({ types: ["heading", "paragraph"] }),
  // custom extensions
  TextAlignExtension,
  LinkAnchorExtension,
  AnchorExtension,
  PrintExtension,
  PreviewExtension,
  FullscreenExtension,
  HighlightExtension,
  ColorExtensionExtension,
  DirectionWrapperExtension,
  OrderedListExtension,
  BulletListExtension,
  FontSizeExtension,
  CustomLinkExtension,
  MergeFieldsExtension,
  PageBreakExtension,
  CustomTableExtension.configure({ resizable: true }),
  CustomTableRow,
  CustomTableHeader,
  CustomFloatingToolboxPlugin,
  // ResizableTableCell,
  // ListItemExtension,
  // CharacterCountExtension,
  // default extensions
  Indentation.configure({
    types: ["paragraph", "heading"], // apply to paragraphs and headings
    step: 2, // 2em per indent step
    maxIndent: 10, // max 10em indent
  }),
  LineHeight.configure({ types: ["paragraph", "heading"] }),
  Image,
  // Table,
  // TableHeader,
  // TableRow,
  TableCell,
  FontFamily,
  Italic,
  Strike,
  CodeBlockLowlight.configure({ lowlight }), // use this instead of default
  Underline,
  Dropcursor,
  Gapcursor,
  History,
  TextStyle,
  Blockquote,
  Bold,
  Document,
  Heading,
  Paragraph,
  Text,
  // BulletList, // customized
  HardBreak,
  HorizontalRule, // customized
  ListItem, // customized
  // OrderedList, // customized
];

// تابع برای اعمال فیلتر روی اکستنشن‌ها
export function getExtensions(selectedExtensions?: string[]): Module {
  if (!selectedExtensions) {
    return defaultExtensions; // اگه هیچ انتخابی ارسال نشه، همه اکستنشن‌های دیفالت برگردون
  }

  return defaultExtensions.filter((ext) =>
    selectedExtensions.includes(ext.name || ""),
  );
}

export function getExcludedExtensions(excludedExtensions?: string[]): Module {
  if (!excludedExtensions) {
    return defaultExtensions; // اگه هیچ اکستنشن‌ای برای exclude ارسال نشه، همه اکستنشن‌های دیفالت رو برمی‌گردونیم
  }

  return defaultExtensions.filter(
    (ext) => !excludedExtensions.includes(ext.name || ""),
  );
}

export { lowlight };
