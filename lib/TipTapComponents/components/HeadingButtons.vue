<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";
import Button from "../components/Button.vue";

const props = defineProps<{ editor: Editor }>();
</script>

<template>
  <Button
    v-for="level in 6"
    :key="level"
    :class="{ 'is-active': props.editor.isActive('heading', { level }) }"
    :ripple="false"
    @click="props.editor.commands.setHeading(level)"
  >
    <v-icon :icon="`mdi-format-header-${level}`" />
  </Button>
</template>

<style scoped></style>
