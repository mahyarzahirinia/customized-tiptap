<script lang="ts" setup="">
// defineProps is a compiler macro; no runtime import needed
import Button from "../components/Button.vue";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{
  exportedHtml: string;
  saveHtml: () => void;
}>();

const showModal = defineModel<boolean>();
const { t } = useTiptapI18n();
</script>

<template>
  <v-dialog v-model="showModal" max-width="800px">
    <v-card>
      <v-card-title class="">{{ t("htmlExport") }}</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="props.exportedHtml"
          class="html-textarea"
          readonly
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="primary" @click="props.saveHtml">{{ t("save") }}</Button>
        <Button color="red" @click="showModal = false">{{ t("close") }}</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.v-card-title {
  font-family: var(--tiptap-editor-font);
}

:deep(.v-field__input) {
  direction: ltr;
}
.html-textarea {
  color: #3b82f6;
  height: 100%;
}
</style>
