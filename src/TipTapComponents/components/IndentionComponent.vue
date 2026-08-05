<script lang="ts" setup="">
import Button from "../components/Button.vue";
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";
// defineProps is a compiler macro; no runtime import needed

const props = defineProps<{ editor: Editor }>();
const { isRtl, t } = useTiptapI18n();

const increaseIndent = () => {
  if (!props.editor) return;
  const command = isRtl.value ? "decreaseIndent" : "increaseIndent";
  props.editor.chain().focus()[command]().run();
};

const decreaseIndent = () => {
  if (!props.editor) return;
  const command = isRtl.value ? "increaseIndent" : "decreaseIndent";
  props.editor.chain().focus()[command]().run();
};
</script>

<template>
  <Button :text="t('decreaseIndent')" @click="decreaseIndent">
    <v-icon icon="mdi-format-indent-decrease" />
  </Button>
  <Button :text="t('increaseIndent')" @click="increaseIndent">
    <v-icon icon="mdi-format-indent-increase" />
  </Button>
</template>
