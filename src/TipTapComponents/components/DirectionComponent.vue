<script lang="ts" setup="">
import Button from "./Button.vue";
import { defineProps } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{
  editor: Editor;
}>();

const setTextDirection = (direction: "ltr" | "rtl") => {
  props.editor.commands.setDirection(direction);
};
</script>

<template>
  <Button text="راست به چپ" @click="setTextDirection('rtl')">
    <v-icon icon="mdi-format-pilcrow-arrow-left" />
  </Button>
  <Button text="چپ به راست" @click="setTextDirection('ltr')">
    <v-icon icon="mdi-format-pilcrow-arrow-right" />
  </Button>
</template>
