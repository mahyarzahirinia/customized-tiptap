<script lang="ts" setup>
import Button from "./Button.vue";
// defineProps is a compiler macro; no runtime import needed
import { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

const toggleCodeBlock = () => {
  props.editor.chain().focus().toggleCodeBlock().run();
};
</script>

<template>
  <Button :text="t('code')" @click="toggleCodeBlock">
    <v-icon
      :icon="
        props.editor.isActive('codeBlock')
          ? 'mdi-note-text-outline'
          : 'mdi-code-braces-box'
      "
    />
  </Button>
</template>
