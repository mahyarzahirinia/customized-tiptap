<script lang="ts" setup="">
import Button from "./Button.vue";
// defineProps is a compiler macro; no runtime import needed
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{
  editor: Editor;
}>();
const { t } = useTiptapI18n();

const setTextDirection = (direction: "ltr" | "rtl") => {
  props.editor.commands.setDirection(direction);
};
</script>

<template>
  <Button :text="t('rightToLeft')" @click="setTextDirection('rtl')">
    <v-icon icon="mdi-format-pilcrow-arrow-left" />
  </Button>
  <Button :text="t('leftToRight')" @click="setTextDirection('ltr')">
    <v-icon icon="mdi-format-pilcrow-arrow-right" />
  </Button>
</template>
