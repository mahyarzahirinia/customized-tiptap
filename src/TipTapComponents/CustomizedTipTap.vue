<script lang="ts" setup>
import { onMounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Toolbar from "./Toolbar.vue";
import { getExtensions, getExcludedExtensions } from "./config";
import { useMergeFields } from "./components/MergeFields/useMergeFields";
import { CustomizedTipTapProps } from "@/TipTapComponents/types/CustomizedTipTapProps";

const props = withDefaults(defineProps<CustomizedTipTapProps>(), {
  readonly: false,
  content: "",
  excludedExtensions: undefined,
  includedExtensions: undefined,
  editorProps: undefined,
  customClasses: undefined,
  editorOptions: undefined,
  mergeFieldsData: undefined,
});

const extensions = props.excludedExtensions
  ? getExcludedExtensions(props.excludedExtensions)
  : getExtensions(props.includedExtensions);

const editor = useEditor({
  content: props.content,
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

const mergeFields = useMergeFields(editor, props.mergeFieldsData);

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
  <v-locale-provider rtl>
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
  </v-locale-provider>
</template>

<style lang="scss">
body {
  --tiptap-editor-font: "yekan", sans-serif;
}

.tiptap-editor {
  font-family: var(--tiptap-editor-font);
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
    background-color: white; /* bg-white */
    z-index: 50; /* z-50 */
    overflow: auto; /* overflow-auto */
  }
}

.tiptap-editor-inside {
  @apply prose prose-sm sm:prose lg:prose-lg xl:prose-2xl;

  margin-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  outline: 1px solid #b3b7b8; /* focus:outline-none */
  width: 100%; /* w-full */
  max-width: 100%; /* max-w-full */
  border-radius: 0.15rem; /* rounded */
  margin-left: auto; /* mx-auto */
  margin-right: auto;
  height: 24rem; /* h-96 */
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
