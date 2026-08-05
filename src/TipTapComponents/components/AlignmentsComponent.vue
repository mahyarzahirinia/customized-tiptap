<script lang="ts" setup="">
import { computed, ref, onMounted } from "vue";
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

const textAlignments = computed(() => [
  { title: t("alignRight"), value: "right", icon: "mdi-format-align-right" },
  { title: t("alignCenter"), value: "center", icon: "mdi-format-align-center" },
  { title: t("alignLeft"), value: "left", icon: "mdi-format-align-left" },
  { title: t("alignJustify"), value: "justify", icon: "mdi-format-align-justify" },
]);

const selectedAlignment = ref<string | undefined>("right");

const applyAlignment = (value: string) => {
  if (!props.editor) return;

  props.editor.chain().focus().setTextAlign(value).run();
};

onMounted(() => {
  props.editor.on("transaction", () => {
    const { editor } = props;

    // check paragraph alignment
    const paragraphAlign = editor.getAttributes("paragraph").textAlign;
    const headingAlign = editor.getAttributes("heading").textAlign;

    const currentAlignment = paragraphAlign || headingAlign || "right";

    if (selectedAlignment.value !== currentAlignment) {
      selectedAlignment.value = currentAlignment;
    }
  });
});
</script>

<template>
  <v-select
    v-model="selectedAlignment"
    :items="textAlignments"
    class="a-select"
    density="compact"
    hide-details
    item-value="value"
    menu-icon="mdi-chevron-down"
    variant="plain"
    @update:modelValue="applyAlignment"
  >
    <template v-slot:selection="{ item }">
      <div class="a-select-item">
        <v-icon :icon="item.raw.icon"></v-icon>
      </div>
    </template>

    <!-- Dropdown list icon display -->
    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="{ ...props, title: undefined }">
        <v-icon
          :icon="item.raw.icon"
          :disabled="item.value === selectedAlignment"
        ></v-icon>
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped lang="scss">
.a-select {
  border-inline-start: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);
  width: 4rem;

  &:deep(.v-field__input),
  &:deep(.v-field__append-inner) {
    padding: unset;
  }

  &:deep(.v-field__append-inner) {
    transform: none;
  }

  &:deep(.v-field) {
    border: none !important;
    background: transparent !important;
  }
}

.a-select-item {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
}
</style>
