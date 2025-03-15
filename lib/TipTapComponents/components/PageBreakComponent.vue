<script lang="ts" setup="">
import Button from "./Button.vue";

import { defineProps } from "vue";
import { type Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

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
  <Button text="شکست صفحه" @click="handlePageBreak()">
    <v-icon icon="mdi-format-page-break" />
  </Button>
</template>

<style scoped></style>
