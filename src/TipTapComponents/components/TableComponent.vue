<script lang="ts" setup>
import { ref } from "vue";
import Button from "../components/Button.vue";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: any }>();
const { t } = useTiptapI18n();

const insertTable = () =>
  props.editor
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();
const deleteTable = () => props.editor.chain().focus().deleteTable().run();

const addColumnBefore = () =>
  props.editor.chain().focus().addColumnBefore().run();
const addColumnAfter = () =>
  props.editor.chain().focus().addColumnAfter().run();
const deleteColumn = () => props.editor.chain().focus().deleteColumn().run();

const addRowBefore = () => props.editor.chain().focus().addRowBefore().run();
const addRowAfter = () => props.editor.chain().focus().addRowAfter().run();
const deleteRow = () => props.editor.chain().focus().deleteRow().run();

const mergeCells = () => props.editor.chain().focus().mergeCells().run();
const splitCell = () => props.editor.chain().focus().splitCell().run();
const mergeOrSplit = () => props.editor.chain().focus().mergeOrSplit().run();
const setCellAttribute = () =>
  props.editor.chain().focus().setCellAttribute("colspan", 2).run();
const fixTables = () => props.editor.chain().focus().fixTables().run();

const toggleHeaderColumn = () =>
  props.editor.chain().focus().toggleHeaderColumn().run();
const toggleHeaderRow = () =>
  props.editor.chain().focus().toggleHeaderRow().run();
const toggleHeaderCell = () =>
  props.editor.chain().focus().toggleHeaderCell().run();

const goToNextCell = () => props.editor.chain().focus().goToNextCell().run();
const goToPreviousCell = () =>
  props.editor.chain().focus().goToPreviousCell().run();
</script>

<template>
  <Button :text="t('table')">
    <v-icon icon="mdi-table" />

    <v-menu activator="parent" location="start" transition="slide-x-transition">
      <v-list class="menu-list" density="compact">
        <v-list-item @click="insertTable">
          <template v-slot:prepend>
            <v-icon icon="mdi-table-plus" />
          </template>
          <v-list-item-title>{{ t("addTable") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteTable">
          <template v-slot:prepend>
            <v-icon icon="mdi-table-remove" />
          </template>
          <v-list-item-title>{{ t("deleteTable") }}</v-list-item-title>
        </v-list-item>

        <!-- ستون‌ها -->
        <v-list-item>
          <v-menu
            activator="parent"
            location="end"
            open-on-hover
            transition="slide-x-transition"
          >
            <v-list class="menu-list" density="compact">
              <v-list-item @click="addColumnBefore">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-column-plus-before" />
                </template>
                <v-list-item-title>{{ t("addColumnBefore") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="addColumnAfter">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-column-plus-after" />
                </template>
                <v-list-item-title>{{ t("addColumnAfter") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteColumn">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-column-remove" />
                </template>
                <v-list-item-title>{{ t("deleteColumn") }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-list-item-title>{{ t("columnManagement") }}</v-list-item-title>
          <template #append>
            <v-icon icon="mdi-menu-left" />
          </template>
        </v-list-item>

        <!-- سطرها -->
        <v-list-item>
          <v-menu
            activator="parent"
            location="end"
            open-on-hover
            transition="slide-x-transition"
          >
            <v-list class="menu-list" density="compact">
              <v-list-item @click="addRowBefore">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-row-plus-before" />
                </template>
                <v-list-item-title>{{ t("addRowBefore") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="addRowAfter">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-row-plus-after" />
                </template>
                <v-list-item-title>{{ t("addRowAfter") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteRow">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-row-remove" />
                </template>
                <v-list-item-title>{{ t("deleteRow") }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-list-item-title>{{ t("rowManagement") }}</v-list-item-title>
          <template #append>
            <v-icon icon="mdi-menu-left" />
          </template>
        </v-list-item>

        <!-- سلول‌ها -->
        <v-list-item>
          <v-menu
            activator="parent"
            location="end"
            open-on-hover
            transition="slide-x-transition"
          >
            <v-list class="menu-list" density="compact">
              <v-list-item @click="mergeCells">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-merge-cells" />
                </template>
                <v-list-item-title>{{ t("mergeCells") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="splitCell">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-split-cell" />
                </template>
                <v-list-item-title>{{ t("splitCell") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="mergeOrSplit">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table" />
                </template>
                <v-list-item-title>{{ t("mergeOrSplit") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="setCellAttribute">
                <template v-slot:prepend>
                  <v-icon icon="mdi-table-column-width" />
                </template>
                <v-list-item-title>{{ t("setCellAttribute") }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-list-item-title>{{ t("cellManagement") }}</v-list-item-title>
          <template #append>
            <v-icon icon="mdi-menu-left" />
          </template>
        </v-list-item>

        <!-- تنظیمات -->
        <v-list-item @click="fixTables">
          <template v-slot:prepend>
            <v-icon icon="mdi-table-refresh" />
          </template>
          <v-list-item-title>{{ t("fixTable") }}</v-list-item-title>
        </v-list-item>

        <!-- ناوبری -->
        <v-list-item @click="goToNextCell">
          <template v-slot:prepend>
            <v-icon icon="mdi-chevron-left-box" />
          </template>
          <v-list-item-title>{{ t("nextCell") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToPreviousCell">
          <template v-slot:prepend>
            <v-icon icon="mdi-chevron-right-box" />
          </template>
          <v-list-item-title>{{ t("previousCell") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </Button>
</template>

<style scoped lang="scss">
:deep(.v-list-item-title) {
  font-family: var(--tiptap-editor-font);
}
.menu-list {
  cursor: pointer;
  padding: 0;
}
</style>
