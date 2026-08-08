<script lang="ts" setup="">
import { computed, ref, watch } from "vue";
import { type Editor } from "@tiptap/core";
import { type Level } from "@tiptap/extension-heading";
import { useTiptapI18n } from "../i18n";

type Levels = 0 | Level;

const props = defineProps<{ editor: Editor }>();
const { language, t } = useTiptapI18n();

const selectedHeading = ref<number | null>(0);

const formatHeadingLevel = (level: Level) =>
  new Intl.NumberFormat(language.value === "fa" ? "fa-IR" : "en-US", {
    useGrouping: false,
  }).format(level);

const headingOptions = computed(() => {
  const headingLabel = language.value === "fa" ? "سرتیتر" : "Heading";
  return [
    { title: `${headingLabel} ${formatHeadingLevel(6)}`, value: 6 },
    { title: `${headingLabel} ${formatHeadingLevel(5)}`, value: 5 },
    { title: `${headingLabel} ${formatHeadingLevel(4)}`, value: 4 },
    { title: `${headingLabel} ${formatHeadingLevel(3)}`, value: 3 },
    { title: `${headingLabel} ${formatHeadingLevel(2)}`, value: 2 },
    { title: `${headingLabel} ${formatHeadingLevel(1)}`, value: 1 },
    { title: language.value === "fa" ? "پاراگراف" : "Paragraph", value: 0 },
  ];
});

const applyHeading = (value: Levels) => {
  if (!props.editor) return;

  if (value === 0) {
    props.editor.chain().focus().setParagraph().run();
    return;
  }
  props.editor.chain().focus().toggleHeading({ level: value }).run();
};

watch(
  () => props.editor.getAttributes("heading").level,
  (value) => {
    selectedHeading.value = value || 0;
  }
);
</script>

<template>
  <v-autocomplete
    v-model="selectedHeading"
    :items="headingOptions"
    :label="!selectedHeading ? t('heading') : ''"
    class="heading-box"
    density="compact"
    hide-details
    item-title="title"
    item-value="value"
    menu-icon=""
    variant="plain"
    @update:modelValue="applyHeading"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        class="list-item"
        v-bind="{ ...props, title: undefined }"
        :disabled="item.value === selectedHeading"
        >{{ item.title }}
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped lang="scss">
.list-item {
  font-family: var(--tiptap-editor-font);
}

.heading-box {
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
