<script lang="ts" setup="">
import { defineProps } from "vue";
import Button from "../components/Button.vue";

const props = defineProps<{
  exportedHtml: string;
  saveHtml: () => void;
}>();

const showModal = defineModel<boolean>();
</script>

<template>
  <v-dialog v-model="showModal" max-width="800px">
    <v-card>
      <v-card-title class="text-h5 !font-[yekan]">خروجی HTML</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="props.exportedHtml"
          class="text-blue-500 h-full"
          readonly
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="primary" @click="props.saveHtml"> ذخیره</Button>
        <Button color="red" @click="showModal = false"> بستن</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-field__input) {
  direction: ltr;
}
</style>
