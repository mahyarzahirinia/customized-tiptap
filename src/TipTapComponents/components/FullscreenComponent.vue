<script lang="ts" setup="">
import Button from "../components/Button.vue";
// defineProps is a compiler macro; no runtime import needed
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

const toggleFullscreen = () => {
  props.editor?.commands.toggleFullscreen();
};
</script>

<template>
  <Button :text="t('fullscreen')" @click="toggleFullscreen">
    <v-icon icon="mdi-fullscreen" />
  </Button>
</template>
