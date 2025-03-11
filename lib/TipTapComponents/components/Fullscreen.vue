<script lang="ts" setup="">
import Button from "../components/Button.vue";
import { defineProps } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const toggleFullscreen = () => {
  props.editor?.commands.toggleFullscreen();
};
</script>

<template>
  <Button text="تمام صفحه" @click="toggleFullscreen">
    <v-icon icon="mdi-fullscreen" />
  </Button>
</template>
