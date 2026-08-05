import { computed, inject, provide, type ComputedRef, type Ref } from "vue";

export type TiptapLanguage = "fa" | "en";

type TranslationKey =
  | "addAnchor"
  | "addField"
  | "addImage"
  | "addTable"
  | "addColumnAfter"
  | "addColumnBefore"
  | "addRowAfter"
  | "addRowBefore"
  | "advancedClose"
  | "advancedOpen"
  | "advancedTools"
  | "alignCenter"
  | "alignJustify"
  | "alignLeft"
  | "alignRight"
  | "apply"
  | "bold"
  | "bulletList"
  | "cancel"
  | "cellManagement"
  | "categoryActivities"
  | "categoryAnimals"
  | "categoryArrows"
  | "categoryCurrency"
  | "categoryFood"
  | "categoryLatin"
  | "categoryMath"
  | "categoryObjects"
  | "categoryPlaces"
  | "categoryQuotations"
  | "categorySmileys"
  | "categorySymbols"
  | "categoryText"
  | "characterInserted"
  | "clearContent"
  | "clearFormat"
  | "close"
  | "code"
  | "codeExport"
  | "colorPicker"
  | "columnManagement"
  | "currentTab"
  | "decreaseIndent"
  | "deleteColumn"
  | "deleteRow"
  | "deleteTable"
  | "emoji"
  | "fixTable"
  | "font"
  | "fontSize"
  | "fullscreen"
  | "heading"
  | "highlight"
  | "htmlExport"
  | "image"
  | "increaseIndent"
  | "italic"
  | "language"
  | "leftToRight"
  | "lineBreak"
  | "lineHeight"
  | "link"
  | "linkAnchor"
  | "linkOpen"
  | "mergeFieldsValues"
  | "mergeOrSplit"
  | "mergeCells"
  | "newTab"
  | "nextCell"
  | "orderedList"
  | "pageBreak"
  | "preview"
  | "previousCell"
  | "redo"
  | "removeLink"
  | "rightToLeft"
  | "rowManagement"
  | "save"
  | "search"
  | "selectAnchor"
  | "setCellAttribute"
  | "splitCell"
  | "strike"
  | "specialCharacters"
  | "table"
  | "text"
  | "textColor"
  | "underline"
  | "undo";

const translations: Record<TiptapLanguage, Record<TranslationKey, string>> = {
  fa: {
    addAnchor: "افزودن نشانه",
    addField: "افزودن فیلدها",
    addImage: "افزودن تصویر",
    addTable: "افزودن جدول",
    addColumnAfter: "افزودن ستون بعد",
    addColumnBefore: "افزودن ستون قبل",
    addRowAfter: "افزودن سطر بعد",
    addRowBefore: "افزودن سطر قبل",
    advancedClose: "بستن",
    advancedOpen: "بیشتر",
    advancedTools: "ابزارهای پیشرفته",
    alignCenter: "وسط چین",
    alignJustify: "هم تراز",
    alignLeft: "چپ چین",
    alignRight: "راست چین",
    apply: "اعمال",
    bold: "بولد",
    bulletList: "لیست گلوله ای",
    cancel: "لغو",
    cellManagement: "مدیریت سلول‌ها",
    categoryActivities: "فعالیت‌ها",
    categoryAnimals: "حیوانات",
    categoryArrows: "جهت ها",
    categoryCurrency: "واحد پولی",
    categoryFood: "خوراکی‌ها",
    categoryLatin: "لاتین",
    categoryMath: "ریاضیات",
    categoryObjects: "اشیا",
    categoryPlaces: "مکان‌ها",
    categoryQuotations: "نقل قول",
    categorySmileys: "لبخندها",
    categorySymbols: "نمادها",
    categoryText: "متن",
    characterInserted: "کاراکتر موردنظر اعمال شد!",
    clearContent: "پاک کردن صفحه",
    clearFormat: "پاک کردن فرمت",
    close: "بستن",
    code: "کد",
    codeExport: "خروجی کد",
    colorPicker: "انتخاب رنگ",
    columnManagement: "مدیریت ستون‌ها",
    currentTab: "در تب جاری",
    decreaseIndent: "کاهش تورفتگی",
    deleteColumn: "حذف ستون",
    deleteRow: "حذف سطر",
    deleteTable: "حذف جدول",
    emoji: "ایموجی",
    fixTable: "اصلاح جدول",
    font: "فونت",
    fontSize: "اندازه",
    fullscreen: "تمام صفحه",
    heading: "سر تیتر",
    highlight: "برجسته کردن",
    htmlExport: "خروجی HTML",
    image: "تصویر",
    increaseIndent: "افزایش تورفتگی",
    italic: "ایتالیک",
    language: "زبان",
    leftToRight: "چپ به راست",
    lineBreak: "شکستن خط",
    lineHeight: "ارتفاع خط",
    link: "لینک",
    linkAnchor: "لینک نشانه",
    linkOpen: "بازشدن لینک",
    mergeFieldsValues: "نمایش مقادیر",
    mergeOrSplit: "ادغام یا تقسیم",
    mergeCells: "ادغام سلول‌ها",
    newTab: "در تب جدید",
    nextCell: "سلول بعدی",
    orderedList: "لیست شماره دار",
    pageBreak: "شکست صفحه",
    preview: "پیش نمایش",
    previousCell: "سلول قبلی",
    redo: "پیش‌روی",
    removeLink: "حذف لینک",
    rightToLeft: "راست به چپ",
    rowManagement: "مدیریت سطرها",
    save: "ذخیره",
    search: "جستجو",
    selectAnchor: "انتخاب نشانه",
    setCellAttribute: "تنظیم ویژگی سلول",
    splitCell: "تقسیم سلول",
    strike: "خط‌خورده",
    specialCharacters: "کاراکترهای خاص",
    table: "جدول",
    text: "متن",
    textColor: "رنگ متن",
    underline: "زیرخط‌دار",
    undo: "بازگشت",
  },
  en: {
    addAnchor: "Add anchor",
    addField: "Add fields",
    addImage: "Add image",
    addTable: "Add table",
    addColumnAfter: "Add column after",
    addColumnBefore: "Add column before",
    addRowAfter: "Add row after",
    addRowBefore: "Add row before",
    advancedClose: "Close",
    advancedOpen: "More",
    advancedTools: "Advanced tools",
    alignCenter: "Align center",
    alignJustify: "Justify",
    alignLeft: "Align left",
    alignRight: "Align right",
    apply: "Apply",
    bold: "Bold",
    bulletList: "Bullet list",
    cancel: "Cancel",
    cellManagement: "Cells",
    categoryActivities: "Activities",
    categoryAnimals: "Animals",
    categoryArrows: "Arrows",
    categoryCurrency: "Currency",
    categoryFood: "Food",
    categoryLatin: "Latin",
    categoryMath: "Math",
    categoryObjects: "Objects",
    categoryPlaces: "Places",
    categoryQuotations: "Quotations",
    categorySmileys: "Smileys",
    categorySymbols: "Symbols",
    categoryText: "Text",
    characterInserted: "Character inserted.",
    clearContent: "Clear content",
    clearFormat: "Clear format",
    close: "Close",
    code: "Code",
    codeExport: "Export code",
    colorPicker: "Choose color",
    columnManagement: "Columns",
    currentTab: "Current tab",
    decreaseIndent: "Decrease indent",
    deleteColumn: "Delete column",
    deleteRow: "Delete row",
    deleteTable: "Delete table",
    emoji: "Emoji",
    fixTable: "Fix table",
    font: "Font",
    fontSize: "Size",
    fullscreen: "Fullscreen",
    heading: "Heading",
    highlight: "Highlight",
    htmlExport: "HTML export",
    image: "Image",
    increaseIndent: "Increase indent",
    italic: "Italic",
    language: "Language",
    leftToRight: "Left to right",
    lineBreak: "Line break",
    lineHeight: "Line height",
    link: "Link",
    linkAnchor: "Anchor link",
    linkOpen: "Open link",
    mergeFieldsValues: "Show values",
    mergeOrSplit: "Merge or split",
    mergeCells: "Merge cells",
    newTab: "New tab",
    nextCell: "Next cell",
    orderedList: "Ordered list",
    pageBreak: "Page break",
    preview: "Preview",
    previousCell: "Previous cell",
    redo: "Redo",
    removeLink: "Remove link",
    rightToLeft: "Right to left",
    rowManagement: "Rows",
    save: "Save",
    search: "Search",
    selectAnchor: "Select anchor",
    setCellAttribute: "Set cell attribute",
    splitCell: "Split cell",
    strike: "Strike",
    specialCharacters: "Special characters",
    table: "Table",
    text: "Text",
    textColor: "Text color",
    underline: "Underline",
    undo: "Undo",
  },
};

interface TiptapI18nContext {
  language: Ref<TiptapLanguage>;
  dir: ComputedRef<"ltr" | "rtl">;
  isRtl: ComputedRef<boolean>;
  setLanguage: (language: TiptapLanguage) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const TiptapI18nKey = Symbol("TiptapI18n");

export function normalizeLanguage(language?: string): TiptapLanguage {
  return language === "en" ? "en" : "fa";
}

export function provideTiptapI18n(context: {
  language: Ref<TiptapLanguage>;
  setLanguage: (language: TiptapLanguage) => void;
}) {
  const isRtl = computed(() => context.language.value === "fa");
  const dir = computed(() => (isRtl.value ? "rtl" : "ltr"));
  const value: TiptapI18nContext = {
    language: context.language,
    dir,
    isRtl,
    setLanguage: context.setLanguage,
    toggleLanguage: () => {
      context.setLanguage(context.language.value === "fa" ? "en" : "fa");
    },
    t: (key) => translations[context.language.value][key],
  };

  provide(TiptapI18nKey, value);
  return value;
}

export function useTiptapI18n(): TiptapI18nContext {
  const fallbackLanguage = computed(() => "fa" as TiptapLanguage);
  const fallback = {
    language: fallbackLanguage,
    dir: computed(() => "rtl" as const),
    isRtl: computed(() => true),
    setLanguage: () => undefined,
    toggleLanguage: () => undefined,
    t: (key: TranslationKey) => translations.fa[key],
  };

  return inject<TiptapI18nContext>(TiptapI18nKey, fallback);
}
