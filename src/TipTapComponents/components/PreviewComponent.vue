<script lang="ts" setup="">
import Button from "../components/Button.vue";
import { Editor, generateHTML } from "@tiptap/core";
import { ref } from "vue";
import PreviewModal from "../modals/PreviewModal.vue";
import { useTiptapI18n } from "../i18n";

const previewContent = ref<string>("");
const showModal = ref<boolean>(false);
const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

const openPreview = () => {
  // @ts-ignore
  previewContent.value = props.editor.getHTML();
  showModal.value = true;
};
</script>

<template>
  <Button :text="t('preview')" @click="openPreview">
    <v-icon icon="mdi-eye-outline" />
  </Button>

  <PreviewModal v-model="showModal" :preview-content="previewContent" />
</template>
