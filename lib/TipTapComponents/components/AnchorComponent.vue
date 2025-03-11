<script lang="ts" setup>
import { ref, computed } from "vue";
import Button from "../components/Button.vue";

const props = defineProps<{ editor: any }>();

const dialog = ref<boolean>(false);
const url = ref<string>(""); // Fixed missing `url` reference
const textToDisplay = ref<string>("");

const toggleLink = () => {
  if (props.editor.isActive("link")) {
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
  props.editor.chain().focus().unsetLink().run();
  dialog.value = false;
};
</script>

<template>
  <Button text="نشانه‌گذاری" @click="openDialog()">
    <v-icon
      :icon="editor.isActive('idSetter') ? 'mdi-bookmark-off' : 'mdi-bookmark'"
    />
  </Button>

  <!-- Dialog -->
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title> افزودن نشانه</v-card-title>
      <v-card-text>
        <v-text-field v-model="url" autofocus label="لینک نشانه" type="url" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <Button color="primary" @click="applyLink()"> اعمال</Button>
        <Button color="red" @click="dialog = false"> لغو</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
