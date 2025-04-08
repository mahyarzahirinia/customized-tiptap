<script lang="ts" setup="">
import Button from "../components/Button.vue";
import { defineProps } from "vue";

const props = defineProps<{
  applyLink: () => void;
}>();

const url = defineModel("url");
const dialog = defineModel("dialog");
</script>

<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title> افزودن نشانه</v-card-title>
      <v-card-text>
        <v-text-field v-model="url" autofocus label="لینک نشانه" type="url" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <Button color="primary" @click="props.applyLink()"> اعمال</Button>
        <Button color="red" @click="dialog = false"> لغو</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.v-card-title,
.list-item,
:deep(.v-label),
:deep(.v-field) {
  font-family: var(--tiptap-editor-font);
}
</style>
