<script lang="ts" setup>
/*
customized tiptap
author: mohammad zahiriniya
version: 1.0.0 (stable)
*/

import { computed, onMounted, ref, watch } from "vue";
import type { CSSProperties } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Toolbar from "./Toolbar.vue";
import {
  getExtensions,
  getExcludedExtensions,
  getPresetExtensions,
} from "./config";
import type { Module } from "./config";
import { useMergeFields } from "./components/MergeFields/useMergeFields";
import {
  CustomizedTipTapProps,
  BasicMergeField,
  GroupedMergeFields,
  MergeFieldInputType,
  TiptapExtensionName,
  TiptapPresetName,
} from "./types/CustomizedTipTapProps";
import type { MergeFieldType } from "./components/MergeFields/useMergeFields";
import GlobalSnackbar from "./notifier/GlobalSnackbar.vue";
import {
  normalizeLanguage,
  provideTiptapI18n,
  type TiptapLanguage,
} from "./i18n";

defineOptions({ name: "CustomizedTipTap" });

/* ========================= props & emits ========================= */
const props = withDefaults(
  defineProps<
    CustomizedTipTapProps & {
      mergeFieldsLoading?: boolean;
      inputType?: MergeFieldInputType;
    }
  >(),
  {
    readonly: false,
    modelValue: "",
    excludedExtensions: undefined,
    includedExtensions: undefined,
    editorProps: undefined,
    customClasses: undefined,
    editorOptions: undefined,
    mergeFieldsData: undefined,
    editorRef: undefined,
    onUpdateContent: undefined,
    lazyloadAdvancedComponents: false,
    language: "fa",
    fontFamily:
      'Tahoma, Arial, "Helvetica Neue", Helvetica, sans-serif',
    fontFamilyOptions: () => [
      { title: "Tahoma", value: "Tahoma" },
      { title: "Arial", value: "Arial" },
      { title: "Times New Roman", value: "Times New Roman" },
    ],
    showLanguageToggle: false,
    preset: undefined, // <-- add default for new prop
    mergeFieldsLoading: false, // <-- default loading
    inputType: "default",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:language", value: TiptapLanguage): void;
  (e: "error", value: unknown): void;
}>();

const currentLanguage = ref<TiptapLanguage>(normalizeLanguage(props.language));
const i18n = provideTiptapI18n({
  language: currentLanguage,
  setLanguage: (language) => {
    currentLanguage.value = language;
    emit("update:language", language);
  },
});

watch(
  () => props.language,
  (language) => {
    const normalizedLanguage = normalizeLanguage(language);
    if (currentLanguage.value !== normalizedLanguage) {
      currentLanguage.value = normalizedLanguage;
    }
  }
);

const editorStyle = computed<CSSProperties>(() => ({
  "--tiptap-editor-font": props.fontFamily,
}));

// Helper to get unique extensions by name
function uniqueExtensionsByName(extensions: Module): Module {
  const seen = new Set<string>();
  return extensions.filter((ext) => {
    const name = ext.name;
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function resolveExtensions({
  preset,
  excludedExtensions,
  includedExtensions,
}: {
  preset?: TiptapPresetName;
  excludedExtensions?: TiptapExtensionName[];
  includedExtensions?: TiptapExtensionName[];
}): Module {
  let baseExtensions = preset ? getPresetExtensions(preset) : getExtensions();

  // Remove excluded extensions
  if (excludedExtensions && excludedExtensions.length) {
    const excludedNames = new Set<string>(excludedExtensions);
    baseExtensions = baseExtensions.filter(
      (ext) => !excludedNames.has(ext.name)
    );
  }

  // Add included extensions (if not already present)
  if (includedExtensions && includedExtensions.length) {
    const included = getExtensions(includedExtensions);
    // Merge, avoiding duplicates by name
    baseExtensions = uniqueExtensionsByName([...baseExtensions, ...included]);
  } else {
    baseExtensions = uniqueExtensionsByName(baseExtensions);
  }

  return baseExtensions;
}

const extensions = resolveExtensions({
  preset: props.preset,
  excludedExtensions: props.excludedExtensions,
  includedExtensions: props.includedExtensions,
});

const editor = useEditor({
  enableContentCheck: false,
  content: props.modelValue,
  editable: !props.readonly,
  extensions,
  ...props.editorOptions, // merge user options

  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  onContentError: ({ editor, error }) => {
    emit("error", error);
  },

  // make sure editorProps merge last so we can customize attributes.class
  editorProps: {
    ...(props.editorOptions?.editorProps || {}),
    ...(props.editorProps || {}),
    attributes: {
      ...(props.editorOptions?.editorProps?.attributes || {}),
      ...(props.editorProps?.attributes || {}),
      class: props.customClasses?.editorContent ?? "tiptap-editor-inside",
    },
  },
});

/* ========================= merge fields ========================= */
const normalizedMergeFields = computed(() => {
  if (!props.mergeFieldsData || !Array.isArray(props.mergeFieldsData)) {
    return [];
  }

  return props.mergeFieldsData.flatMap((field): MergeFieldType[] => {
    if (isGroupedMergeField(field)) {
      return field.entries.map((entry) => ({
        title: entry.title,
        value: entry.value,
        name: entry.name,
        group: field.group,
      }));
    }

    return [normalizeBasicMergeField(field)];
  });
});

function isGroupedMergeField(
  field: GroupedMergeFields | BasicMergeField
): field is GroupedMergeFields {
  return Array.isArray((field as GroupedMergeFields).entries);
}

function normalizeBasicMergeField(field: BasicMergeField): MergeFieldType {
  const name = field.name ?? field.label;
  return {
    title: field.title,
    value: field.value ?? (name ? `{${name}}` : ""),
    name,
    group: field.group,
  };
}

const mergeFields = useMergeFields(editor, normalizedMergeFields.value);

/* ========================= watchers ========================= */
// Watch for changes in normalized merge fields and update mergeFields.mergeFields.value
watch(
  normalizedMergeFields,
  (newVal) => {
    mergeFields.mergeFields.value = newVal ?? [];
  },
  { deep: true, immediate: true }
);

// watch for the changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue, false);
    }
  },
  { immediate: false }
);

onMounted(() => {
  if (editor.value) {
    editor.value.setOptions({
      editorProps: {
        handleDOMEvents: {
          keyup: (view, event) => {
            mergeFields.handleKeyUp(view, event);
          },
        },
      },
    });
  }
});

// expose the editor instance
if (props.editorRef) {
  const editorRef = props.editorRef;
  watch(
    editor,
    (newVal) => {
      editorRef.value = newVal ?? null;
    },
    { immediate: true }
  );
}
</script>

<template>
  <v-locale-provider :rtl="i18n.isRtl.value">
    <div
      v-if="editor"
      :class="props.customClasses?.editorContainer ?? 'tiptap-editor'"
      :dir="i18n.isRtl.value ? 'rtl' : 'ltr'"
      :style="editorStyle"
    >
      <Toolbar
        :editor="editor"
        :mergeFields="mergeFields"
        :merge-field-input-type="props.inputType"
        :extensions="extensions"
        :lazyload-advanced-components="props.lazyloadAdvancedComponents"
        :merge-fields-loading="props.mergeFieldsLoading"
        :show-language-toggle="props.showLanguageToggle"
        :font-family-options="props.fontFamilyOptions"
      />

      <editor-content :editor="editor" />

      <GlobalSnackbar />
    </div>
  </v-locale-provider>
</template>

<style lang="scss">
.tiptap-editor {
  font-family: var(--tiptap-editor-font);
  text-align: initial;
  padding: 1rem; /* p-4 */
  border: 1px solid #b3b7b8; /* border + border-gray-200 */
  border-style: solid; /* border-solid */
  border-radius: 0.5rem; /* rounded-md */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  background-color: #e6e6e6;

  &.normal-mode {
    display: block; /* block */
  }

  &.fullscreen-mode {
    position: fixed; /* fixed */
    top: 0; /* top-0 */
    right: 0; /* right-0 */
    width: 100%; /* w-full */
    height: 100%; /* h-full */
    z-index: 9999 !important; /* z-300 */
    overflow: auto; /* overflow-auto */
  }
}

.tiptap-editor-inside {
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.714;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 1rem auto;
  }

  p {
    font-size: 12pt;
  }

  h1 {
    font-size: 2.25rem;
    line-height: 1.111;
  }

  h2 {
    font-size: 1.875rem;
    line-height: 1.2;
  }

  h3 {
    font-size: 1.5rem;
    line-height: 1.333;
  }

  h4 {
    font-size: 1.25rem;
    line-height: 1.4;
  }

  h5,
  h6 {
    font-size: 1rem;
    line-height: 1.5;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  strong {
    font-weight: 700;
  }

  a {
    color: #2563eb;
    text-decoration: underline;
  }

  ul,
  ol {
    margin: 1rem auto;
    padding-inline-start: 1.625rem;
  }

  li {
    margin: 0.25rem auto;
  }

  blockquote {
    margin: 1rem auto;
    padding-inline-start: 1rem;
    border-inline-start: 0.25rem solid #d1d5db;
    color: #4b5563;
  }

  code {
    border-radius: 0.25rem;
    background: #f3f4f6;
    color: #111827;
    font-family: "JetBrainsMono", monospace;
    font-size: 0.875em;
    padding: 0.15rem 0.3rem;
  }

  pre {
    margin: 1rem auto;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    background: #282c34;
    color: #abb2bf;
    overflow-x: auto;
  }

  pre code {
    background: transparent;
    color: inherit;
    font-size: inherit;
    padding: 0;
  }

  margin-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  outline: 1px solid #b3b7b8; /* focus:outline-none */
  width: 100%; /* w-full */
  max-width: 100%; /* max-w-full */
  border-radius: 0.15rem; /* rounded */
  margin-left: auto; /* mx-auto */
  margin-right: auto;
  min-height: 24rem;
  max-height: 40rem;
  overflow-y: auto; /* overflow-y-auto */
  background-color: white;

  & pre {
    font-family: "JetBrainsMono", monospace;
    direction: ltr;

    /* Code styling */
    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>
