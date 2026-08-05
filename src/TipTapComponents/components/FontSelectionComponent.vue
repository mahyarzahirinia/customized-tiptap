<script lang="ts" setup="">
import { computed, ref, watch } from "vue";
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";
import type { TiptapFontFamilyOption } from "../types/CustomizedTipTapProps";

const props = defineProps<{
  editor: Editor;
  fontFamilyOptions?: TiptapFontFamilyOption[];
}>();
const { t } = useTiptapI18n();

const fallbackFontFamilies: TiptapFontFamilyOption[] = [
  { title: "Tahoma", value: "Tahoma" },
  { title: "Arial", value: "Arial" },
  { title: "Times New Roman", value: "Times New Roman" },
];

const fontFamilies = computed(() =>
  props.fontFamilyOptions?.length
    ? props.fontFamilyOptions
    : fallbackFontFamilies
);

const selectedFont = ref<string | null | undefined>(fontFamilies.value[0]?.value);

const applyFontFamily = (value: string) => {
  props.editor.chain().focus().setFontFamily(value).run();
};

watch(
  () => props.editor.getAttributes("textStyle").fontFamily,
  (value) => {
    selectedFont.value = value || fontFamilies.value[0]?.value;
  }
);
</script>

<template>
  <v-autocomplete
    v-model="selectedFont"
    :items="fontFamilies"
    :label="!selectedFont ? t('font') : ''"
    class="font-box"
    density="compact"
    hide-details
    item-text="title"
    item-value="value"
    menu-icon=""
    variant="plain"
    @update:model-value="applyFontFamily"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        class="list-item"
        v-bind="{ ...props, title: undefined }"
        :disabled="item.value === selectedFont"
        >{{ item.title }}
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped lang="scss">
.list-item {
  font-family: var(--tiptap-editor-font);
}

.font-box {
  width: 12rem;
  border-inline-start: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);

  &:deep(.v-field__input) {
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
