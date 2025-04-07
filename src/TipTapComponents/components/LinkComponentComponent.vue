<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import Button from "../components/Button.vue";

const props = defineProps<{ editor: any }>();

const dialog = ref(false);
const isImageMode = ref(false);
const textToDisplay = ref("");
const url = ref("");
const target = ref("_self");

// store ids for autocomplete
const elementsWithId = ref<{ id: string; tag: string; content: string }[]>([]);
const selectedId = ref<{ id: string; tag: string; content: string }>();

const toggleLink = () => {
  if (props.editor.isActive("link")) {
    unsetLink();
  } else {
    openDialog();
  }
};

const insertImage = () => {
  isImageMode.value = true;
  url.value = "";
  dialog.value = true;
};

const applyImage = () => {
  if (url.value) {
    props.editor.chain().focus().setImage({ src: url.value }).run();
  }
  dialog.value = false;
};

const openDialog = () => {
  isImageMode.value = false;
  const { state } = props.editor;
  const { from, to } = state.selection;
  const selectedText = state.doc.textBetween(from, to, " ");

  textToDisplay.value = selectedText;
  url.value = props.editor.getAttributes("link").href || "";
  target.value = props.editor.getAttributes("link").target || "_self";

  // extract elements with id
  const htmlContent = props.editor.getHTML();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const ids = Array.from(doc.querySelectorAll("[id]")).map((element) => ({
    id: element.id,
    tag: element.tagName.toLowerCase(),
    content: element.textContent || "",
  }));
  elementsWithId.value = ids;

  dialog.value = true;
};

const applyLink = () => {
  if (url.value) {
    props.editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.value, target: target.value })
      .run();
  } else if (selectedId.value) {
    props.editor
      .chain()
      .focus()
      .extendMarkRange("linkAnchor")
      .setLink({ href: `#${selectedId.value.id}`, target: target.value })
      .run();
  }
  dialog.value = false;
};

const unsetLink = () => {
  props.editor.chain().focus().unsetLink().run();
  dialog.value = false;
};

const targetOptions = [
  { label: "در تب جدید", value: "_blank" },
  { label: "در تب جاری", value: "_self" },
];
</script>

<template>
  <Button
    :class="{ 'is-active': editor.isActive('link') }"
    :text="editor.isActive('link') ? 'حذف لینک' : 'لینک'"
    @click="toggleLink"
  >
    <v-icon :icon="editor.isActive('link') ? 'mdi-link-off' : 'mdi-link'" />
  </Button>

  <Button text="تصویر" @click="insertImage">
    <v-icon icon="mdi-image" />
  </Button>

  <!-- Dialog -->
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title
        >{{ isImageMode ? "افزودن تصویر" : "لینک ضمیمه" }}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="url" autofocus label="لینک" type="url" />

        <!-- extra fields only for links not images -->
        <template v-if="!isImageMode">
          <v-text-field v-model="textToDisplay" label="متن" readonly />

          <!-- Autocomplete for IDs -->
          <v-autocomplete
            v-model="selectedId"
            :items="elementsWithId"
            clearable
            item-title="id"
            label="انتخاب نشانه"
            return-object
          />

          <v-select
            v-model="target"
            :items="targetOptions"
            item-title="label"
            item-value="value"
            label="بازشدن لینک"
          />
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <Button
          color="primary"
          @click="isImageMode ? applyImage() : applyLink()"
        >
          اعمال
        </Button>
        <Button color="red" @click="dialog = false">لغو</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
