<script lang="ts" setup="">
import Button from "./Button.vue";
import { useTiptapI18n } from "../i18n";

// defineProps is a compiler macro; no runtime import needed
import { type Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

const handlePageBreak = () => {
  props.editor
    ?.chain()
    .focus()
    .insertContent({
      type: "pageBreak",
    })
    .run();
};
</script>

<template>
  <Button :text="t('pageBreak')" @click="handlePageBreak()">
    <v-icon icon="mdi-format-page-break" />
  </Button>
</template>
