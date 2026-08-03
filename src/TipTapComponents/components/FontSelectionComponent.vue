<script lang="ts" setup="">
import { ref, watch } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const fontFamilies = ref([
  { title: "ایران یکان", value: "IRANYekanX" },
  { title: "یکان", value: "yekan" },
  { title: "تیتر", value: "B Titr" },
  { title: "نازنین", value: "B Nazanin" },
  { title: "کودک", value: "B Koodak" },
  { title: "ساحل", value: "sahel" },
  { title: "صمیم", value: "samim" },
  { title: "وزیر", value: "vazir-medium" },
  { title: "دوات", value: "B Davat" },
  { title: "حوما", value: "B Homa" },
  { title: "میتره", value: "B Mitra" },
  { title: "مروارید", value: "B Morvarid" },
  { title: "Arial", value: "arial" },
  { title: "Arial Black", value: "arial black" },
  { title: "Tahoma", value: "tahoma" },
  { title: "Times New Roman", value: "times new roman" },
]);

const selectedFont = ref<string | null | undefined>("IRANYekanX");

const applyFontFamily = (value: string) => {
  props.editor.chain().focus().setFontFamily(value).run();
};

watch(
  () => props.editor.getAttributes("textStyle").fontFamily,
  (value) => {
    selectedFont.value = value || "IRANYekanX";
  }
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
  border-left: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);

  &:deep(.v-field__input) {
    transform: translate(-0.8rem, -0.1rem);
  }

  &:deep(.v-field-label) {
    transform: translateX(-0.5rem);
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
