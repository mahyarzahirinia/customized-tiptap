<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import { type Editor } from "@tiptap/core";
import { type Level } from "@tiptap/extension-heading";

const props = defineProps<{ editor: Editor }>();

const selectedHeading = ref<string | number | undefined>("paragraph");
const headingOptions = [
  { title: "پاراگراف", value: "paragraph" },
  { title: "سرتیتر ۶", value: 6 },
  { title: "سرتیتر ۵", value: 5 },
  { title: "سرتیتر ۴", value: 4 },
  { title: "سرتیتر ۳", value: 3 },
  { title: "سرتیتر ۲", value: 2 },
  { title: "سرتیتر ۱", value: 1 },
];

const applyHeading = (value: string | number) => {
  if (!props.editor) return;

  if (value === "paragraph") {
    props.editor.commands.setParagraph();
  } else {
    const headingLevel = Number(value);
    // @ts-ignore
    props.editor.commands.wrapSelectedText(headingLevel);
  }
};
</script>

<template>
  <v-autocomplete
    v-model="selectedHeading"
    :items="headingOptions"
    :label="!selectedHeading ? 'سر تیتر' : ''"
    class="w-36 relative bottom-1 right-2"
    density="compact"
    hide-details
    item-title="title"
    item-value="value"
    menu-icon=""
    variant="plain"
    @update:modelValue="applyHeading"
  />
</template>

<style scoped></style>
