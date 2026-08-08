<script lang="ts" setup="">
import { computed, ref, watch } from "vue";
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { language, t } = useTiptapI18n();

const fontSizeValues = [
  "8pt",
  "9pt",
  "10pt",
  "11pt",
  "12pt",
  "14pt",
  "16pt",
  "18pt",
  "20pt",
  "22pt",
  "24pt",
  "26pt",
  "28pt",
  "36pt",
  "48pt",
  "72pt",
];

const formatFontSizeLabel = (size: string) => {
  const numericSize = Number.parseInt(size, 10);
  return new Intl.NumberFormat(language.value === "fa" ? "fa-IR" : "en-US", {
    useGrouping: false,
  }).format(numericSize);
};

const fontSizes = computed(() =>
  fontSizeValues.map((size) => ({
    size,
    label: formatFontSizeLabel(size),
  }))
);

const selectedFontSize = ref<string | undefined>("12pt");

const applyFontSize = (value: string) => {
  props.editor.chain().focus().setFontSize(value).run();
};

watch(
  () => props.editor.getAttributes("textStyle").fontSize,
  (value) => {
    selectedFontSize.value = value || "24pt";
  }
);
</script>

<template>
  <div class="font-size-container">
    <v-autocomplete
      v-model="selectedFontSize"
      :item-title="'label'"
      :item-value="'size'"
      :items="fontSizes"
      :label="!selectedFontSize ? t('fontSize') : ''"
      class="font-size-box"
      density="compact"
      hide-details
      menu-icon=""
      variant="plain"
      @update:model-value="applyFontSize"
      ><template v-slot:item="{ props, item }">
        <v-list-item
          class="list-item"
          v-bind="{ ...props, title: undefined }"
          :disabled="item.value === selectedFontSize"
          >{{ item.title }}
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<style scoped lang="scss">
.list-item {
  font-family: var(--tiptap-editor-ui-font);
}

.font-size-container {
  display: flex;
  align-items: center;
}

.font-size-box {
  width: 5rem;
  border-inline-start: 1px solid rgba(0, 0, 0, 0.12);

  &:deep(.ct-select__control) {
    justify-content: center;
  }

  &:deep(.v-field__input) {
    flex: 0 0 auto;
    width: 100%;
    max-width: 2.5rem;
    padding: 0;
    text-align: center;
    transform: translateY(-0.1rem);
  }

  &:deep(.v-field-label) {
    padding-inline: 0.25rem;
  }

  &:deep(.v-field) {
    border: none !important;
    background: transparent !important;
  }

  &:deep(.v-field--active .v-field-label) {
    visibility: hidden;
  }
}
</style>
