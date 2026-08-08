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
import {
  type MergeFieldInputType,
  type TiptapFontFamilyOption,
} from "./types/CustomizedTipTapProps";
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
    fontFamilyOptions?: TiptapFontFamilyOption[];
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
  tablePanel: boolean;
}>({
  exportModal: false,
  showPanel: false,
  tablePanel: false,
});

const { showValues } = props.mergeFields;
const { language, t, toggleLanguage } = useTiptapI18n();

const advancedPanelId = "tiptap-advanced-toolbar";
const tablePanelId = "tiptap-table-toolbar";

const toggleAdvancedPanel = () => {
  showModal.showPanel = !showModal.showPanel;
};

const toggleTablePanel = () => {
  showModal.tablePanel = !showModal.tablePanel;
};
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
        <v-icon icon="ct-clear-content" />
      </Button>
    </GroupButtons>

    <div
      class="tools-group tools-group--typography"
      v-if="hasAnyExtension(['heading', 'fontFamily', 'fontSize'])"
    >
      <HeadingComponent :editor="editor" v-if="hasExtension('heading')" />
      <FontSelectionComponent
        :editor="editor"
        :font-family-options="props.fontFamilyOptions"
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
        <v-icon icon="mdi-format-bold-box" />
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
      class="tools-group tools-group--lists"
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
        :expanded="showModal.tablePanel"
        :panel-id="tablePanelId"
        v-if="
          hasAllExtensions(['table', 'tableRow', 'tableCell', 'tableHeader'])
        "
        @toggle="toggleTablePanel"
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
        class="advanced-toggle"
        :class="{ 'is-expanded': showModal.showPanel }"
        :text="`${t('advancedTools')} - ${showModal.showPanel ? t('advancedClose') : t('advancedOpen')}`"
        :aria-controls="advancedPanelId"
        :aria-expanded="showModal.showPanel"
        :aria-pressed="showModal.showPanel"
        @click="toggleAdvancedPanel"
      >
        <span class="advanced-toggle__mark">
          <v-icon icon="mdi-dots-horizontal" />
        </span>
        <span class="advanced-toggle__text">
          {{ showModal.showPanel ? t("advancedClose") : t("advancedOpen") }}
        </span>
        <span class="advanced-toggle__indicator">
          <v-icon icon="mdi-chevron-down" />
        </span>
      </Button>
    </GroupButtons>

    <GroupButtons v-if="props.showLanguageToggle">
      <Button :text="t('language')" @click="toggleLanguage">
        <span class="language-toggle-text">{{ language === "fa" ? "EN" : "فا" }}</span>
      </Button>
    </GroupButtons>

    <v-expand-transition>
      <div
        v-if="
          showModal.tablePanel &&
          hasAllExtensions(['table', 'tableRow', 'tableCell', 'tableHeader'])
        "
        :id="tablePanelId"
        class="toolbar-panel table-toolbar"
      >
        <TableComponent :editor="editor" panel />
      </div>
    </v-expand-transition>

    <!-- advanced tools -->
    <!-- transition section -->
    <v-expand-transition>
      <div
        v-if="showModal.showPanel"
        :id="advancedPanelId"
        class="toolbar toolbar-panel advanced-toolbar"
      >
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
  direction: inherit;
}

.toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;

  .tools-group {
    align-items: center;
    background-color: white;
    border: 1px solid #b3b7b8;
    border-radius: 0.5rem;
    display: flex;
    min-height: 2.3rem;
    overflow: hidden;

    & > .v-field {
      border: none;
    }
  }

  .tools-group--typography {
    width: 18rem;
  }

  .tools-group--lists {
    width: auto;
  }

  :deep(.ct-icon) {
    height: 1.15rem;
    width: 1.15rem;
  }
}

.language-toggle-text {
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 700;
  justify-content: center;
  min-width: 1.5rem;
}

:deep(.advanced-toggle) {
  background: #ffffff;
  border: 1px solid #b3b7b8;
  border-radius: 0.5rem !important;
  box-shadow: inset 0 -1px 0 rgba(15, 23, 42, 0.06);
  color: #1f2937 !important;
  gap: 0.4rem;
  min-height: 2.3rem;
  min-width: auto;
  overflow: hidden;
  padding-block: 0.2rem !important;
  padding-inline: 0.6rem 0.35rem !important;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

:deep(.advanced-toggle:hover:not(:disabled)) {
  background: #f8fafc;
  border-color: #64748b;
}

:deep(.advanced-toggle.is-expanded) {
  background: #ecfeff;
  border-color: #0891b2;
  box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.12);
  color: #0f172a !important;
}

.advanced-toggle__mark,
.advanced-toggle__indicator {
  align-items: center;
  display: inline-flex;
  justify-content: center;
}

.advanced-toggle__mark {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  height: 1.55rem;
  width: 1.75rem;
}

:deep(.advanced-toggle.is-expanded) .advanced-toggle__mark {
  background: #cffafe;
  border-color: #67e8f9;
  color: #0e7490;
}

.advanced-toggle__text {
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1;
  min-width: 2.1rem;
}

.advanced-toggle__indicator {
  color: #64748b;
  transition: transform 0.16s ease;
}

[dir="rtl"] .advanced-toggle__indicator {
  margin-inline-start: -0.05rem;
}

:deep(.advanced-toggle.is-expanded) .advanced-toggle__indicator {
  color: #0e7490;
  transform: rotate(180deg);
}

.toolbar-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  width: 100%;
}

.advanced-toolbar {
  display: flex;
}

.table-toolbar {
  display: block;
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
