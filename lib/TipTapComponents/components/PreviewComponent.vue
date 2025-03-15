<script lang="ts" setup="">
import Button from "../components/Button.vue";
import { Editor, generateHTML } from "@tiptap/core";
import { defineProps, ref } from "vue";
import PreviewModal from "../modals/PreviewModal.vue";

const previewContent = ref<string>("");
const showModal = ref<boolean>(false);
const props = defineProps<{ editor: Editor }>();

const openPreview = () => {
  // @ts-ignore
  previewContent.value = props.editor.commands.generateHTML();
  showModal.value = true;
};
</script>

<template>
  <Button text="پیش ‌نمایش" @click="openPreview">
    <v-icon icon="mdi-eye-outline" />
  </Button>

  <PreviewModal v-model="showModal" :preview-content="previewContent" />
</template>
