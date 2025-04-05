<script lang="ts" setup>
import Button from "./Button.vue";
import { defineProps } from "vue";
import { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const toggleCodeBlock = () => {
  props.editor.chain().focus().toggleCodeBlock().run();
};
</script>

<template>
  <Button text="کد" @click="toggleCodeBlock">
    <v-icon
      :icon="
        props.editor.isActive('codeBlock')
          ? 'mdi-note-text-outline'
          : 'mdi-code-braces-box'
      "
    />
  </Button>
</template>

<style scoped></style>
