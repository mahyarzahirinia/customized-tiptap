<script lang="ts" setup="">
import { defineProps, ref, watch } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const fontFamilies = ref([
  { title: "یکان", value: "yekan" },
  { title: "ساحل", value: "sahel" },
  { title: "صمیم", value: "samim" },
  { title: "وزیر", value: "vazir-medium" },
]);

const selectedFont = ref<string | null | undefined>();

const applyFontFamily = (value: string) => {
  props.editor.chain().focus().setFontFamily(value).run();
};

watch(
  () => props.editor.getAttributes("textStyle").fontFamily,
  (value) => {
    selectedFont.value = value;
  },
);
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
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="{ ...props, title: undefined }"
        :disabled="item.value === selectedFont"
        >{{ item.title }}
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped>
:deep(.v-field-label) {
  background-color: #fff;
}

.font-box {
  width: 10rem;
  position: relative;
  bottom: 0.25rem;
}
</style>
