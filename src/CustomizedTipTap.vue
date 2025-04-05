<script lang="ts" setup>
import { onMounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Toolbar from "@/components/TipTapComponents/Toolbar.vue";
import { getExtensions, getExcludedExtensions } from "./config";
import { useMergeFields } from "./TipTapComponents/components/MergeFields/useMergeFields";
import { CustomizedTiptapProps } from "./types/CustomizedTipTapProps";

const props = withDefaults(defineProps<CustomizedTiptapProps>(), {
  readonly: false,
  content: "",
  excludedExtensions: undefined,
  includedExtensions: undefined,
  editorProps: undefined,
  customClasses: undefined,
  editorOptions: undefined,
});

const extensions = props.excludedExtensions
  ? getExcludedExtensions(props.excludedExtensions)
  : getExtensions(props.includedExtensions);

const editor = useEditor({
  editable: !props.readonly,
  enableContentCheck: true,
  extensions,
  ...props.editorOptions, // merge user options

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

const mergeFields = useMergeFields(editor);

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
</script>

<template>
  <div
    v-if="editor"
    :class="props.customClasses?.editorContainer ?? 'tiptap-editor'"
  >
    <Toolbar
      :editor="editor"
      :mergeFields="mergeFields"
      :extensions="extensions"
    />
    <editor-content :editor="editor" />
  </div>
</template>

<style lang="scss">
.tiptap-editor-inside {
  @apply prose prose-sm sm:prose lg:prose-lg xl:prose-2xl;
  @apply focus:outline-none;
  @apply w-full max-w-full;
  @apply rounded mx-auto h-96 overflow-y-auto;

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

.tiptap-editor {
  font-family: "yekan", sans-serif;
  @apply p-4 border border-gray-200 border-solid rounded-md shadow-sm;

  &.normal-mode {
    @apply block;
  }

  &.fullscreen-mode {
    @apply fixed top-0 right-0 w-full h-full bg-white z-50 overflow-auto;
  }
}
</style>
