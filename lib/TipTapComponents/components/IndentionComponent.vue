<script lang="ts" setup="">
import Button from "../components/Button.vue";
import type { Editor } from "@tiptap/core";
import { defineProps } from "vue";

const props = defineProps<{ editor: Editor }>();

// note: i reversed the callbacks, since toolbox is rtl
const increaseIndent = () => {
  if (!props.editor) return;
  props.editor.chain().focus().decreaseIndent().run();
};

const decreaseIndent = () => {
  if (!props.editor) return;
  props.editor.chain().focus().increaseIndent().run();
};
</script>

<template>
  <Button text="کاهش تورفتگی" @click="decreaseIndent">
    <v-icon icon="mdi-format-indent-decrease" />
  </Button>
  <Button text="افزایش تورفتگی" @click="increaseIndent">
    <v-icon icon="mdi-format-indent-increase" />
  </Button>
</template>

<style scoped></style>
