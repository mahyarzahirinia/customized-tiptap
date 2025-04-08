<script lang="ts" setup>
import { ref, defineProps, computed } from "vue";
import type { Editor } from "@tiptap/core";
import {
  VDialog,
  VSheet,
  VIcon,
  VBtn,
  VMenu,
  VColorPicker,
} from "vuetify/components";
import Button from "../components/Button.vue";
import ColorModal from "../modals/ColorModal.vue";

const props = defineProps<{ editor: Editor }>();

// states
const showColorPicker = ref(false);
const showHighlightPicker = ref(false);
const showAdvancedModal = ref(false);
const selectedButton = ref<"color" | "highlight" | null>(null);
const selectedColor = ref<string | null>(null);

// new color palette
const colors = [
  { name: "Light Green", value: "#BFEDD2" },
  { name: "Light Yellow", value: "#FBEEB8" },
  { name: "Light Red", value: "#F8CAC6" },
  { name: "Light Purple", value: "#ECCAFA" },
  { name: "Light Blue", value: "#C2E0F4" },
  { name: "Green", value: "#2DC26B" },
  { name: "Yellow", value: "#F1C40F" },
  { name: "Red", value: "#E03E2D" },
  { name: "Purple", value: "#B96AD9" },
  { name: "Blue", value: "#3598DB" },
  { name: "Dark Turquoise", value: "#169179" },
  { name: "Orange", value: "#E67E23" },
  { name: "Dark Red", value: "#BA372A" },
  { name: "Dark Purple", value: "#843FA1" },
  { name: "Dark Blue", value: "#236FA1" },
  { name: "Light Gray", value: "#ECF0F1" },
  { name: "Medium Gray", value: "#CED4D9" },
  { name: "Dark Gray", value: "#95A5A6" },
  { name: "Black", value: "#000000" },
  { name: "Black Teal", value: "#34495E" },
];

// handle color selection
const applyColor = (color: string) => {
  if (!props.editor) return;

  if (color === "remove") {
    const command =
      selectedButton.value === "color" ? "unsetColor" : "unsetHighlight";
    props.editor.chain().focus()[command]().run();
    selectedColor.value = null;
  } else {
    const command =
      selectedButton.value === "color" ? "setColor" : "setHighlight";
    props.editor.chain().focus()[command](color).run();
    selectedColor.value = color;
  }
};

// toggle the color picker
const togglePicker = (type: "color" | "highlight") => {
  selectedButton.value = type;
  showColorPicker.value = type === "color" && !showColorPicker.value;
  showHighlightPicker.value =
    type === "highlight" && !showHighlightPicker.value;
};

// open advanced modal
const openAdvancedModal = () => {
  showAdvancedModal.value = true;
};

// apply color from advanced picker
const applyAdvancedColor = (color: string | null | undefined) => {
  if (!color) return;
  applyColor(color);
  showAdvancedModal.value = false;
};

// unset all marks and close pickers
const unsetAllMarks = () => {
  props.editor.chain().focus().unsetAllMarks().run();
  showColorPicker.value = false;
  showHighlightPicker.value = false;
  selectedColor.value = null;
};
</script>

<template>
  <div class="ch-container">
    <!-- Buttons -->
    <Button color="#eee" text="رنگ متن" @click="togglePicker('color')">
      <v-icon icon="mdi-format-color-text" />
      <v-icon
        :style="[
          selectedButton === 'color' ? { color: `${selectedColor}` } : '',
        ]"
        class="btn-line-under"
        icon="mdi-minus"
      />
    </Button>
    <Button text="برجسته کردن" @click="togglePicker('highlight')">
      <v-icon icon="mdi-format-color-highlight" />
      <v-icon
        :style="[
          selectedButton === 'highlight' ? { color: `${selectedColor}` } : '',
        ]"
        class="btn-line-under"
        icon="mdi-minus"
      />
    </Button>
    <Button text="پاک کردن فرمت" @click="unsetAllMarks">
      <v-icon icon="mdi-format-clear" />
    </Button>

    <!-- Color Picker Menu -->
    <v-menu
      v-if="showColorPicker || showHighlightPicker"
      activator="parent"
      location="bottom"
    >
      <v-sheet class="color-container">
        <!-- Color grid -->
        <div class="color-grid">
          <button
            v-for="color in colors"
            :key="color.value"
            :style="{ backgroundColor: color.value }"
            class="color-button"
            @click="applyColor(color.value)"
          />
        </div>
        <div class="last-row-container">
          <button class="action-btn" @click="applyColor('remove')">
            <v-icon icon="mdi-close" />
          </button>
          <button class="action-btn" @click="openAdvancedModal">
            <v-icon icon="mdi-palette" />
          </button>
        </div>
      </v-sheet>
    </v-menu>

    <!-- Advanced color picker modal -->
    <ColorModal
      :apply-color="applyAdvancedColor"
      :selected-color="selectedColor"
      :show-modal="showAdvancedModal"
    />
  </div>
</template>

<style scoped>
.ch-container {
  display: flex;
}

.btn-line-under {
  position: absolute;
  bottom: 0;
  right: 1.4rem;
}

.color-container {
  background-color: #fff;
  border-radius: 0.375rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.color-button {
  width: 100%;
  height: 2rem;
  order: 1;
}

.last-row-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn {
  height: 2rem;
  width: 2rem;
  margin: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-dialog {
  z-index: 100;
}
</style>
