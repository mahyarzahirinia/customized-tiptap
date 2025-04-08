import { Extension, Mark, Node } from "@tiptap/core";
import { all, createLowlight } from "lowlight";

export type Module = Array<Extension | Mark | Node>;

// استایل‌های مورد نیاز
import "../assets/main.css";
import "./styles/tables.css";
import "./styles/anchor.css";
import "./styles/direction.css";
import "./styles/pagebreak.css";
import "./styles/mergefields.css";
import "./styles/link.css";
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
import { LineHeight } from "./extensions/LineHeightExtension";
import { Indentation } from "./extensions/IndentionExtension";
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
import { FontSizeExtension } from "./extensions/FontSizeExtension";
import { OrderedListExtension } from "./extensions/Lists/OrderedListExtension";
import { BulletListExtension } from "./extensions/Lists/BulletListExtension";
import { CustomLinkExtension } from "./extensions/LinkExtension";
import { DirectionWrapperExtension } from "./extensions/DirectionExtension";
import { CustomTableExtension } from "./extensions/CustomTableExtension";
import { ColorExtensionExtension } from "./extensions/ColorExtensionExtension";
import { HighlightExtension } from "./extensions/HighlightExtension";
import { FullscreenExtension } from "./extensions/FullscreenExtension";
import { PreviewExtension } from "./extensions/PreviewExtension";
import { PrintExtension } from "./extensions/PrintExtension";
import { PageBreakExtension } from "./extensions/PageBreakExtension";
import { AnchorExtension } from "./extensions/AnchorExtension";
import { TextAlignExtension } from "./extensions/AlignmentExtension";
import { LinkAnchorExtension } from "./extensions/LinkAnchorExtension";
import { MergeFieldsExtension } from "./extensions/MergeFieldsExtension";
import { ListItemExtension } from "./extensions/Lists/ListItemExtension";
import { CharacterCountExtension } from "./extensions/CharacterCountExtension";
import { CustomFloatingToolboxPlugin } from "./extensions/FloatingToolBoxExtension";
import { CustomTableRow } from "./extensions/CustomTableRow";
import { CustomTableHeader } from "./extensions/CustomTableHeader";

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
