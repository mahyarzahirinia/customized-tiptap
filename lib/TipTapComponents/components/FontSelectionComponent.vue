<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const fontFamilies = ref([
  { title: "یکان", value: "yekan" },
  { title: "ساحل", value: "sahel" },
  { title: "صمیم", value: "samim" },
  { title: "وزیر", value: "vazir-medium" },
]);
const selectedFont = ref<string | undefined>("vazir-medium");

const applyFontFamily = (value: string) => {
  props.editor.chain().focus().setFontFamily(value).run();
};
</script>

<template>
  <v-autocomplete
    v-model="selectedFont"
    :items="fontFamilies"
    :label="!selectedFont ? 'فونت' : ''"
    class="font-box"
    density="compact"
    hide-details
    item-text="title"
    item-value="value"
    menu-icon=""
    variant="plain"
    @update:model-value="applyFontFamily"
  />
</template>

<style scoped>
.font-box {
  @apply w-40 relative bottom-1;
}
</style>
