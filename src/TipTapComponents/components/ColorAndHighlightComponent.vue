<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { Editor } from "@tiptap/core";
import Button from "../components/Button.vue";
import ColorModal from "../modals/ColorModal.vue";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { dir, language, t } = useTiptapI18n();

// states
const showColorPicker = ref(false);
const showHighlightPicker = ref(false);
const showAdvancedModal = ref(false);
const selectedButton = ref<"color" | "highlight" | null>(null);
const selectedColor = ref<string | null>(null);
const paletteContainer = ref<HTMLElement | null>(null);

const colorGroups = computed(() => [
  {
    label: language.value === "fa" ? "روشن" : "Light",
    colors: [
      { name: language.value === "fa" ? "سبز روشن" : "Light green", value: "#BFEDD2" },
      { name: language.value === "fa" ? "زرد روشن" : "Light yellow", value: "#FBEEB8" },
      { name: language.value === "fa" ? "قرمز روشن" : "Light red", value: "#F8CAC6" },
      { name: language.value === "fa" ? "بنفش روشن" : "Light purple", value: "#ECCAFA" },
      { name: language.value === "fa" ? "آبی روشن" : "Light blue", value: "#C2E0F4" },
    ],
  },
  {
    label: language.value === "fa" ? "اصلی" : "Main",
    colors: [
      { name: language.value === "fa" ? "سبز" : "Green", value: "#2DC26B" },
      { name: language.value === "fa" ? "زرد" : "Yellow", value: "#F1C40F" },
      { name: language.value === "fa" ? "قرمز" : "Red", value: "#E03E2D" },
      { name: language.value === "fa" ? "بنفش" : "Purple", value: "#B96AD9" },
      { name: language.value === "fa" ? "آبی" : "Blue", value: "#3598DB" },
    ],
  },
  {
    label: language.value === "fa" ? "تیره" : "Dark",
    colors: [
      { name: language.value === "fa" ? "فیروزه ای تیره" : "Dark teal", value: "#169179" },
      { name: language.value === "fa" ? "نارنجی" : "Orange", value: "#E67E23" },
      { name: language.value === "fa" ? "قرمز تیره" : "Dark red", value: "#BA372A" },
      { name: language.value === "fa" ? "بنفش تیره" : "Dark purple", value: "#843FA1" },
      { name: language.value === "fa" ? "آبی تیره" : "Dark blue", value: "#236FA1" },
    ],
  },
  {
    label: language.value === "fa" ? "خنثی" : "Neutral",
    colors: [
      { name: language.value === "fa" ? "خاکستری روشن" : "Light gray", value: "#ECF0F1" },
      { name: language.value === "fa" ? "خاکستری متوسط" : "Medium gray", value: "#CED4D9" },
      { name: language.value === "fa" ? "خاکستری تیره" : "Dark gray", value: "#95A5A6" },
      { name: language.value === "fa" ? "مشکی" : "Black", value: "#000000" },
      { name: language.value === "fa" ? "سبز نفتی" : "Blue gray", value: "#34495E" },
    ],
  },
]);

const activePickerTitle = computed(() =>
  selectedButton.value === "highlight" ? t("highlight") : t("textColor")
);

const hasSelectedColor = computed(
  () => Boolean(selectedColor.value) && selectedColor.value !== "remove"
);

const closePickers = () => {
  showColorPicker.value = false;
  showHighlightPicker.value = false;
};

const closePaletteFromOutside = (event: MouseEvent | TouchEvent) => {
  const target = event.target as Node | null;
  if (!target || paletteContainer.value?.contains(target)) return;
  closePickers();
};

// handle color selection
const applyColor = (color: string) => {
  if (!props.editor) return;

  if (color === "remove") {
    if (selectedButton.value === "color") {
      props.editor.chain().focus().unsetColor().run();
    } else if (selectedButton.value === "highlight") {
      props.editor.chain().focus().unsetHighlight().run();
    }
    selectedColor.value = null;
  } else {
    if (selectedButton.value === "color") {
      props.editor.chain().focus().setColor(color).run();
    } else if (selectedButton.value === "highlight") {
      props.editor.chain().focus().setHighlight(color).run();
    }
    selectedColor.value = color;
  }

  closePickers();
};

// toggle the color picker
const togglePicker = (type: "color" | "highlight") => {
  const isOpen =
    type === "color" ? showColorPicker.value : showHighlightPicker.value;
  selectedButton.value = type;
  showColorPicker.value = type === "color" && !isOpen;
  showHighlightPicker.value = type === "highlight" && !isOpen;
};

// open advanced modal
const openAdvancedModal = () => {
  closePickers();
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

onMounted(() => {
  document.addEventListener("mousedown", closePaletteFromOutside);
  document.addEventListener("touchstart", closePaletteFromOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", closePaletteFromOutside);
  document.removeEventListener("touchstart", closePaletteFromOutside);
});
</script>

<template>
  <div ref="paletteContainer" class="ch-container">
    <!-- Buttons -->
    <Button
      :class="{ 'color-tool--active': showColorPicker }"
      :text="t('textColor')"
      @click="togglePicker('color')"
    >
      <span class="color-tool color-tool--text">
        <span class="color-tool__letter">A</span>
        <span
          class="color-tool__bar"
          :style="{ backgroundColor: selectedColor || '#111827' }"
        />
      </span>
    </Button>
    <Button
      :class="{ 'color-tool--active': showHighlightPicker }"
      :text="t('highlight')"
      @click="togglePicker('highlight')"
    >
      <span class="color-tool color-tool--highlight">
        <span
          class="color-tool__mark"
          :style="{ backgroundColor: selectedColor || '#fde68a' }"
        />
        <span class="color-tool__pen" />
      </span>
    </Button>
    <Button :text="t('clearFormat')" @click="unsetAllMarks">
      <span class="color-tool color-tool--clear">
        <span class="color-tool__letter">T</span>
        <span class="color-tool__slash" />
      </span>
    </Button>

    <!-- Color Picker Menu -->
    <div
      v-if="showColorPicker || showHighlightPicker"
      class="color-menu"
      :dir="dir"
    >
      <div class="color-container">
        <div class="palette-header">
          <div>
            <p class="palette-title">{{ activePickerTitle }}</p>
            <p class="palette-subtitle">{{ t("colorPicker") }}</p>
          </div>
          <span
            class="selected-preview"
            :class="{ 'selected-preview--empty': !hasSelectedColor }"
            :style="
              hasSelectedColor ? { backgroundColor: selectedColor } : undefined
            "
          />
        </div>

        <div class="palette-groups">
          <section
            v-for="group in colorGroups"
            :key="group.label"
            class="palette-group"
          >
            <span class="palette-group-title">{{ group.label }}</span>
            <div class="color-grid">
              <button
                v-for="color in group.colors"
                :key="color.value"
                :aria-label="color.name"
                :class="{
                  'color-button--selected': selectedColor === color.value,
                }"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
                class="color-button"
                type="button"
                @click="applyColor(color.value)"
              />
            </div>
          </section>
        </div>

        <div class="last-row-container">
          <button
            class="action-btn action-btn--ghost"
            type="button"
            @click="applyColor('remove')"
          >
            <v-icon icon="mdi-close" />
            <span>{{ t("clearFormat") }}</span>
          </button>
          <button
            class="action-btn action-btn--solid"
            type="button"
            @click="openAdvancedModal"
          >
            <v-icon icon="mdi-palette" />
            <span>{{ t("colorPicker") }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced color picker modal -->
    <ColorModal
      :apply-color="applyAdvancedColor"
      :selected-color="selectedColor"
      :show-modal="showAdvancedModal"
    />
  </div>
</template>

<style scoped lang="scss">
.ch-container {
  display: flex;
  position: relative;
}

.color-container {
  display: grid;
  gap: 0.75rem;
}

.color-tool {
  align-items: center;
  display: inline-flex;
  height: 1.25rem;
  justify-content: center;
  position: relative;
  width: 1.25rem;
}

.color-tool__letter {
  color: #111827;
  font-family: ui-serif, Georgia, serif;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1;
}

.color-tool__bar {
  border-radius: 999px;
  bottom: 0.05rem;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.14);
  height: 0.18rem;
  position: absolute;
  width: 1rem;
}

.color-tool__mark {
  border-radius: 0.15rem;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.1);
  height: 0.78rem;
  opacity: 0.9;
  transform: rotate(-10deg);
  width: 1rem;
}

.color-tool__pen {
  background: #111827;
  border-radius: 999px;
  bottom: 0.08rem;
  height: 0.16rem;
  position: absolute;
  inset-inline-end: 0.05rem;
  transform: rotate(-25deg);
  width: 1.1rem;
}

.color-tool__slash {
  background: #ef4444;
  border-radius: 999px;
  height: 0.14rem;
  position: absolute;
  transform: rotate(-40deg);
  width: 1.35rem;
}

:deep(.color-tool--active) {
  background: #eff6ff;
  color: #1d4ed8;
}

.color-menu {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(148, 163, 184, 0.36);
  border-radius: 0.75rem;
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.18),
    0 2px 8px rgba(15, 23, 42, 0.08);
  color: #111827;
  min-width: 17.5rem;
  padding: 0.75rem;
  position: absolute;
  inset-inline-start: 0;
  top: calc(100% + 0.4rem);
  z-index: 999999;
}

.palette-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.palette-title,
.palette-subtitle {
  margin: 0;
}

.palette-title {
  font-size: 0.85rem;
  font-weight: 700;
}

.palette-subtitle {
  color: #64748b;
  font-size: 0.7rem;
  margin-top: 0.15rem;
}

.selected-preview {
  border: 2px solid #fff;
  border-radius: 999px;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  display: inline-flex;
  height: 1.65rem;
  width: 1.65rem;
}

.selected-preview--empty {
  background:
    linear-gradient(
      135deg,
      transparent 45%,
      #ef4444 46%,
      #ef4444 54%,
      transparent 55%
    ),
    #f8fafc;
}

.palette-groups {
  display: grid;
  gap: 0.55rem;
}

.palette-group {
  display: grid;
  gap: 0.35rem;
}

.palette-group-title {
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 700;
}

.color-grid {
  display: grid;
  gap: 0.35rem;
  grid-template-columns: repeat(5, 1.75rem);
}

.color-button {
  appearance: none;
  border: 2px solid #fff;
  border-radius: 0.45rem;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.14),
    inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  height: 1.75rem;
  transition:
    box-shadow 0.16s ease,
    transform 0.16s ease;
  width: 1.75rem;
}

.color-button:hover,
.color-button:focus-visible {
  box-shadow:
    0 0 0 2px rgba(37, 99, 235, 0.35),
    inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  outline: none;
  transform: translateY(-1px);
}

.color-button--selected {
  box-shadow:
    0 0 0 2px #2563eb,
    0 7px 14px rgba(37, 99, 235, 0.18),
    inset 0 0 0 1px rgba(15, 23, 42, 0.12);
}

.last-row-container {
  align-items: center;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  padding-top: 0.7rem;
}

.action-btn {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 0.45rem;
  cursor: pointer;
  display: inline-flex;
  flex: 1;
  font-family: var(--tiptap-editor-ui-font);
  font-size: 0.72rem;
  font-weight: 700;
  gap: 0.35rem;
  height: 2rem;
  justify-content: center;
}

.action-btn--ghost {
  background: #fff;
  border-color: #e2e8f0;
  color: #475569;
}

.action-btn--solid {
  background: #111827;
  color: #fff;
}

.action-btn:hover {
  filter: brightness(0.98);
}

.v-dialog {
  z-index: 100;
}
</style>
