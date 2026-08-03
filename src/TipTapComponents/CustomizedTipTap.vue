<script lang="ts" setup>
/*
customized tiptap
author: mohammad zahiriniya
version: 1.0.0 (stable)
*/

import { computed, onMounted, watch } from "vue";
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
    preset: undefined, // <-- add default for new prop
    mergeFieldsLoading: false, // <-- default loading
    inputType: "default",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "error", value: unknown): void;
}>();

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
  <v-locale-provider rtl>
    <div
      v-if="editor"
      :class="props.customClasses?.editorContainer ?? 'tiptap-editor'"
    >
      <Toolbar
        :editor="editor"
        :mergeFields="mergeFields"
        :merge-field-input-type="props.inputType"
        :extensions="extensions"
        :lazyload-advanced-components="props.lazyloadAdvancedComponents"
        :merge-fields-loading="props.mergeFieldsLoading"
      />

      <editor-content :editor="editor" />

      <GlobalSnackbar />
    </div>
  </v-locale-provider>
</template>

<style lang="scss">
body {
  --tiptap-editor-font: "yekan", sans-serif;
}

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
  // remove prose classes and use manual css instead
  @apply prose prose-sm sm:prose lg:prose-lg xl:prose-2xl;

  p {
    font-size: 12pt;
  }
  //overriding prose h1,h6 and p tags
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 1rem auto;
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
