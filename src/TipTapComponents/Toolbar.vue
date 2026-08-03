<script lang="ts" setup="">
import { reactive, withDefaults } from "vue";
import { type Editor } from "@tiptap/core";

import Button from "./components/Button.vue";
import GroupButtons from "./components/GroupButtons.vue";
import TableComponent from "./components/TableComponent.vue";
import HeadingComponent from "./components/HeadingComponent.vue";
import AlignmentsComponent from "./components/AlignmentsComponent.vue";
import LinkComponentComponent from "./components/LinkComponentComponent.vue";
import FontSelectionComponent from "./components/FontSelectionComponent.vue";
import FontSizeSelectionComponent from "./components/FontSizeSelectionComponent.vue";
import OrderedOrderedListComponent from "./components/Lists/OrderedListComponent.vue";
import UnOrderedOrderedListComponent from "./components/Lists/UnOrderedListComponent.vue";
import { useLoadComponents } from "./hooks/useLoadComponents";
// import MergeFieldsToolbarSearch from "./components/MergeFields/MergeFieldsToolbarSearch.vue";
// import HeadingButtonsComponent from "./components/HeadingButtonsComponent.vue";
import { type useMergeFields } from "./components/MergeFields/useMergeFields";
import { type Module } from "./config";
import { type MergeFieldInputType } from "./types/CustomizedTipTapProps";
import MergeFieldsMergeFieldsHiddenInlineSearch from "./components/MergeFields/MergeFieldsHiddenInlineSearch.vue";
import { useTiptapI18n } from "./i18n";

/* ========================= options ========================= */
defineOptions({ name: "Toolbar" });

const props = withDefaults(
  defineProps<{
    editor: Editor;
    mergeFields: ReturnType<typeof useMergeFields>;
    extensions: Module;
    lazyloadAdvancedComponents: boolean;
    mergeFieldsLoading?: boolean;
    mergeFieldInputType?: MergeFieldInputType;
    showLanguageToggle?: boolean;
  }>(),
  {
    mergeFieldInputType: "default",
  }
);

const {
  LineHeightComponent,
  IndentionComponent,
  CodeBlockComponent,
  ColorAndHighlightComponent,
  EmojisComponent,
  SpecialCharactersComponent,
  CodeExportComponent,
  FullscreenComponent,
  PreviewComponent,
  PageBreakComponent,
  AnchorComponent,
  DirectionComponent,
  MergeFieldsBasicAutocompleteComponent,
  MergeFieldsDefaultAutocompleteComponent,
} = useLoadComponents({
  settings: { lazyLoad: props.lazyloadAdvancedComponents },
  components: [
    "LineHeightComponent",
    "IndentionComponent",
    "CodeBlockComponent",
    "ColorAndHighlightComponent",
    "EmojisComponent",
    "SpecialCharactersComponent",
    "CodeExportComponent",
    "FullscreenComponent",
    "PreviewComponent",
    "PageBreakComponent",
    "AnchorComponent",
    "DirectionComponent",
    "MergeFieldsBasicAutocompleteComponent",
    "MergeFieldsDefaultAutocompleteComponent",
  ],
});

const extensionNames = new Set(props.extensions.map((ext) => ext.name));

function hasExtension(name: string): boolean {
  return extensionNames.has(name);
}

function hasAnyExtension(names: string[]): boolean {
  return names.some((name) => extensionNames.has(name));
}

function hasAllExtensions(names: string[]): boolean {
  return names.every((name) => extensionNames.has(name));
}

const showModal = reactive<{
  exportModal: boolean;
  showPanel: boolean;
}>({
  exportModal: false,
  showPanel: false,
});

const { showValues } = props.mergeFields;
const { language, t, toggleLanguage } = useTiptapI18n();
</script>

<template>
  <div class="toolbar-container toolbar">
    <!-- Undo/Redo group: always shown, or add extension check if needed -->
    <GroupButtons v-if="hasExtension('history')">
      <Button
        :disabled="!props.editor.can().chain().focus().undo().run()"
        :text="t('undo')"
        @click="props.editor.chain().focus().undo().run()"
      >
        <v-icon icon="mdi-undo-variant" />
      </Button>
      <Button
        :disabled="!props.editor.can().chain().focus().redo().run()"
        :text="t('redo')"
        @click="props.editor.chain().focus().redo().run()"
      >
        <v-icon icon="mdi-redo-variant" />
      </Button>
    </GroupButtons>

    <!-- Break/Clear group: always shown, or add extension check if needed -->
    <GroupButtons v-if="hasExtension('hardBreak')">
      <Button
        :text="t('lineBreak')"
        @click="props.editor.chain().focus().setHardBreak().run()"
        v-if="hasExtension('hardBreak')"
      >
        <v-icon icon="mdi-keyboard-return" />
      </Button>
      <Button
        :text="t('clearContent')"
        @click="props.editor.chain().focus().clearContent().run()"
      >
        <v-icon icon="mdi-backspace" />
      </Button>
    </GroupButtons>

    <div
      class="tools-group"
      style="width: 18rem; height: 2.3rem"
      v-if="hasAnyExtension(['heading', 'fontFamily', 'fontSize'])"
    >
      <HeadingComponent :editor="editor" v-if="hasExtension('heading')" />
      <FontSelectionComponent
        :editor="editor"
        v-if="hasExtension('fontFamily')"
      />
      <FontSizeSelectionComponent
        :editor="editor"
        v-if="hasExtension('fontSize')"
      />
    </div>

    <GroupButtons
      v-if="hasAnyExtension(['bold', 'italic', 'underline', 'strike'])"
    >
      <Button
        v-if="hasExtension('bold')"
        :class="{ 'is-active': props.editor.isActive('bold') }"
        :disabled="!props.editor.can().chain().focus().toggleBold().run()"
        :text="t('bold')"
        @click="props.editor.chain().focus().toggleBold().run()"
      >
        <v-icon icon="mdi-format-bold" />
      </Button>
      <Button
        v-if="hasExtension('italic')"
        :class="{ 'is-active': props.editor.isActive('italic') }"
        :disabled="!props.editor.can().chain().focus().toggleItalic().run()"
        :text="t('italic')"
        @click="props.editor.chain().focus().toggleItalic().run()"
      >
        <v-icon icon="mdi-format-italic" />
      </Button>
      <Button
        v-if="hasExtension('underline')"
        :class="{ 'is-active': props.editor.isActive('underline') }"
        :disabled="!props.editor.can().chain().focus().toggleUnderline().run()"
        :text="t('underline')"
        @click="props.editor.chain().focus().toggleUnderline().run()"
      >
        <v-icon icon="mdi-format-underline" />
      </Button>
      <Button
        v-if="hasExtension('strike')"
        :class="{ 'is-active': props.editor.isActive('strike') }"
        :disabled="!props.editor.can().chain().focus().toggleStrike().run()"
        :text="t('strike')"
        @click="props.editor.chain().focus().toggleStrike().run()"
      >
        <v-icon icon="mdi-format-strikethrough-variant" />
      </Button>
    </GroupButtons>

    <div
      class="tools-group"
      style="width: 13rem; height: 2.3rem"
      v-if="
        hasAnyExtension(['textAlign', 'orderedList', 'bulletList', 'listItem'])
      "
    >
      <AlignmentsComponent :editor="editor" v-if="hasExtension('textAlign')" />
      <OrderedOrderedListComponent
        :editor="editor"
        v-if="hasAllExtensions(['orderedList', 'listItem'])"
      />
      <UnOrderedOrderedListComponent
        :editor="editor"
        v-if="hasAllExtensions(['bulletList', 'listItem'])"
      />
    </div>

    <GroupButtons v-if="hasAnyExtension(['link', 'table'])">
      <LinkComponentComponent :editor="editor" v-if="hasExtension('link')" />
      <TableComponent
        :editor="editor"
        v-if="
          hasAllExtensions(['table', 'tableRow', 'tableCell', 'tableHeader'])
        "
      />
    </GroupButtons>

    <!-- toggle transition -->
    <GroupButtons
      v-if="
        hasAnyExtension([
          'lineHeight',
          'indentation',
          'codeBlockLowlight',
          'color',
          'specialCharacters',
          'emojis',
          'codeExport',
          'fullscreen',
          'preview',
          'pageBreak',
          'linkAnchor',
          'directionWrapper',
          'mergeFields',
        ])
      "
    >
      <Button
        :text="t('advancedTools')"
        @click="showModal.showPanel = !showModal.showPanel"
      >
        <v-icon icon="mdi-dots-horizontal" />
      </Button>
    </GroupButtons>

    <GroupButtons v-if="props.showLanguageToggle">
      <Button :text="t('language')" @click="toggleLanguage">
        <span class="language-toggle-text">{{ language === "fa" ? "EN" : "فا" }}</span>
      </Button>
    </GroupButtons>

    <!-- advanced tools -->
    <!-- transition section -->
    <v-expand-transition>
      <div v-if="showModal.showPanel" class="toolbar">
        <GroupButtons v-if="hasExtension('lineHeight')">
          <LineHeightComponent :editor="editor" />
        </GroupButtons>
        <GroupButtons v-if="hasExtension('indentation')">
          <IndentionComponent :editor="editor" />
        </GroupButtons>

        <GroupButtons v-if="hasAnyExtension(['codeBlockLowlight', 'color'])">
          <CodeBlockComponent
            :editor="editor"
            v-if="hasExtension('codeBlockLowlight')"
          />
          <ColorAndHighlightComponent
            :editor="editor"
            v-if="hasExtension('color')"
          />
        </GroupButtons>

        <GroupButtons v-if="hasAnyExtension(['specialCharacters', 'emojis'])">
          <SpecialCharactersComponent
            v-if="hasExtension('specialCharacters')"
            :editor="editor"
          />
          <EmojisComponent v-if="hasExtension('emojis')" :editor="editor" />
        </GroupButtons>

        <GroupButtons
          v-if="hasAnyExtension(['codeExport', 'fullscreen', 'preview'])"
        >
          <CodeExportComponent
            v-if="hasExtension('codeExport')"
            :editor="editor"
          />
          <FullscreenComponent
            :editor="editor"
            v-if="hasExtension('fullscreen')"
          />
          <PreviewComponent :editor="editor" v-if="hasExtension('preview')" />
        </GroupButtons>

        <GroupButtons v-if="hasAnyExtension(['pageBreak', 'linkAnchor'])">
          <PageBreakComponent
            :editor="editor"
            v-if="hasExtension('pageBreak')"
          />
          <AnchorComponent
            :editor="editor"
            v-if="hasExtension('linkAnchor')"
          />
        </GroupButtons>

        <GroupButtons v-if="hasExtension('directionWrapper')">
          <DirectionComponent
            :editor="editor"
            v-if="hasExtension('directionWrapper')"
          />
        </GroupButtons>

        <MergeFieldsMergeFieldsHiddenInlineSearch
          :editor="editor"
          :mergeFields="props.mergeFields"
          :loading="props.mergeFieldsLoading"
          v-if="hasExtension('mergeFields')"
        />

        <div class="merge-field-tool-box" v-if="hasExtension('mergeFields')">
          <MergeFieldsDefaultAutocompleteComponent
            v-if="props.mergeFieldInputType !== 'basic'"
            :merge-fields="props.mergeFields"
            :loading="props.mergeFieldsLoading"
          />
          <MergeFieldsBasicAutocompleteComponent
            v-else
            :merge-fields="props.mergeFields"
            :loading="props.mergeFieldsLoading"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-container {
  border-radius: 0.5rem;
}

.toolbar {
  display: flex; /* flex */
  gap: 0.5rem; /* gap-4 */
  flex-wrap: wrap; /* flex-wrap */
  align-items: center; /* items-center */
  width: 100%; /* w-full */

  .tools-group {
    display: flex; /* flex */
    gap: 0.25rem; /* gap-1 */
    border: 1px solid #b3b7b8; /* border + border-gray-200 */
    border-radius: 0.375rem; /* rounded-md */
    background-color: white;

    & > .v-field {
      border: none;
    }
  }
}

.language-toggle-text {
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 700;
  justify-content: center;
  min-width: 1.5rem;
}

.merge-field-tool-box {
  display: flex; /* flex */
  align-items: center; /* items-center */
  max-height: 2rem; /* max-h-12 */

  .merge-field-input {
    max-height: 2rem; /* max-h-10 */
  }
}
</style>
