<script lang="ts" setup="">
import Button from "../components/Button.vue";
import { useTiptapI18n } from "../i18n";
// defineProps is a compiler macro; no runtime import needed

const props = defineProps<{
  applyLink: () => void;
}>();

const url = defineModel("url");
const dialog = defineModel("dialog");
const { t } = useTiptapI18n();
</script>

<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>{{ t("addAnchor") }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="url" autofocus :label="t('linkAnchor')" type="url" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <Button color="primary" @click="props.applyLink()">{{ t("apply") }}</Button>
        <Button color="red" @click="dialog = false">{{ t("cancel") }}</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.v-card-title,
.list-item,
:deep(.v-label),
:deep(.v-field) {
  font-family: var(--tiptap-editor-ui-font);
}
</style>
