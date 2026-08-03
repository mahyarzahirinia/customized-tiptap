<script lang="ts" setup="">
import Button from "../components/Button.vue";
import type { Editor } from "@tiptap/core";
import { ref } from "vue";
import HTMLExportModal from "../modals/HTMLExportModal.vue";
import { useTiptapI18n } from "../i18n";

const exportedHtml = ref("");
const showModal = ref<boolean>(false);
const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

const exportHtml = () => {
  exportedHtml.value = props.editor.getHTML();
  showModal.value = true;
};

const saveHtml = () => {
  const blob = new Blob([exportedHtml.value], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exported-content.html";
  link.click();
  URL.revokeObjectURL(link.href);
};
</script>

<template>
  <Button :text="t('codeExport')" @click="exportHtml">
    <v-icon icon="mdi-code-tags" />
  </Button>

  <HTMLExportModal
    v-model="showModal"
    :exported-html="exportedHtml"
    :save-html="saveHtml"
  />
</template>
