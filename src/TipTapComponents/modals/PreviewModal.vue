<script lang="ts" setup="">
import { defineProps } from "vue";
import Button from "../components/Button.vue";

const props = defineProps<{
  previewContent: string;
}>();

const showModal = defineModel<boolean>();
</script>

<template>
  <v-dialog v-model="showModal" max-width="800px" min-width="600px">
    <v-card>
      <v-card-title class="text-h5 !font-[yekan]">پیش نمایش</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="props.previewContent"
          class="html-textarea"
          readonly
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="red" @click="showModal = false"> بستن</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-field__input) {
  direction: ltr;
}
.html-textarea {
  color: #3b82f6;
  height: 100%;
}
</style>
