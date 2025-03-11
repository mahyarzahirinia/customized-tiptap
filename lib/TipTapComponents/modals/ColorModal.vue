<script lang="ts" setup>
import { defineProps, defineModel } from "vue";
import Button from "../components/Button.vue";

defineProps<{
  applyColor: (color: string | null | undefined) => void;
}>();

const showModal = defineModel<boolean>("showModal");
const selectedColor = defineModel<string | null>("selectedColor");
</script>

<template>
  <v-dialog v-model="showModal" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 !font-[yekan]">انتخاب رنگ</v-card-title>
      <v-card-text class="flex items-center justify-center">
        <v-color-picker v-model="selectedColor" elevation="0"></v-color-picker>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="primary" @click="applyColor(selectedColor)"
          >اعمال</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
