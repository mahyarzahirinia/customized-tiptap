<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";
import Button from "../components/Button.vue";
import { type Level } from "@tiptap/extension-heading";

const props = defineProps<{ editor: Editor }>();
const levels = ref<Level[]>([1, 2, 3, 4, 5, 6]);
</script>

<template>
  <Button
    v-for="level in levels"
    :key="level"
    :class="{ 'is-active': props.editor.isActive('heading', { level }) }"
    :ripple="false"
    @click="props.editor.commands.setHeading(level)"
  >
    <v-icon :icon="`mdi-format-header-${level}`" />
  </Button>
</template>

<style scoped lang="scss">
:deep(.v-field-label) {
  background: #fff;
}
</style>
