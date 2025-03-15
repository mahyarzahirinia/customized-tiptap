<script lang="ts" setup>
import { ref, computed } from "vue";
import Button from "../components/Button.vue";
import AnchorModal from "../modals/AnchorModal.vue";

const props = defineProps<{ editor: any }>();

const dialog = ref<boolean>(false);
const url = ref<string>(""); // Fixed missing `url` reference
const textToDisplay = ref<string>("");

const toggleLink = () => {
  if (props.editor.isActive("idSetter")) {
    unsetLink();
  } else {
    openDialog();
  }
};

const openDialog = () => {
  const { state } = props.editor;
  const { from, to } = state.selection;
  const selectedText = state.doc.textBetween(from, to, " ");

  textToDisplay.value = selectedText;
  const attrs = props.editor.getAttributes("link");
  url.value = attrs.href || "";

  dialog.value = true;
};

const applyLink = () => {
  if (url.value) {
    props.editor.chain().focus().setNode("idSetter").setID(url.value).run();
  }
  dialog.value = false;
};

const unsetLink = () => {
  props.editor.chain().focus().unsetID().run();
  dialog.value = false;
};
</script>

<template>
  <Button text="نشانه‌گذاری" @click="toggleLink()">
    <v-icon
      :icon="editor.isActive('idSetter') ? 'mdi-bookmark-off' : 'mdi-bookmark'"
    />
  </Button>

  <!-- Dialog -->
  <AnchorModal
    :apply-link="applyLink"
    v-model:dialog="dialog"
    v-model:url="url"
  />
</template>
