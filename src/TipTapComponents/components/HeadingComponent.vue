<script lang="ts" setup="">
import { defineProps, ref, watch } from "vue";
import { type Editor } from "@tiptap/core";
import { type Level } from "@tiptap/extension-heading";

type Levels = 0 | Level;

const props = defineProps<{ editor: Editor }>();

const selectedHeading = ref<number | null>();
const headingOptions = [
  { title: "سرتیتر ۶", value: 6 },
  { title: "سرتیتر ۵", value: 5 },
  { title: "سرتیتر ۴", value: 4 },
  { title: "سرتیتر ۳", value: 3 },
  { title: "سرتیتر ۲", value: 2 },
  { title: "سرتیتر ۱", value: 1 },
  { title: "پاراگراف", value: 0 },
];

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
    selectedHeading.value = value;
  },
);
</script>

<template>
  <v-autocomplete
    v-model="selectedHeading"
    :items="headingOptions"
    :label="!selectedHeading ? 'سر تیتر' : ''"
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
  width: 9rem;
  position: relative;
  bottom: 0.25rem;
  right: 0.5rem;

  &:deep(.v-field--active .v-field-label) {
    background: transparent !important;
  }
}
</style>
