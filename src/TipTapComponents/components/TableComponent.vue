<script lang="ts" setup>
import Button from "../components/Button.vue";
import { useTiptapI18n } from "../i18n";

const props = withDefaults(
  defineProps<{
    editor: any;
    expanded?: boolean;
    panel?: boolean;
    panelId?: string;
  }>(),
  {
    expanded: false,
    panel: false,
    panelId: undefined,
  }
);
const emit = defineEmits<{ (e: "toggle"): void }>();
const { dir, isRtl, t } = useTiptapI18n();

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

const runTableAction = (action: () => void) => {
  action();
};
</script>

<template>
  <Button
    v-if="!props.panel"
    :aria-controls="props.panelId"
    :aria-expanded="props.expanded"
    :aria-pressed="props.expanded"
    :class="{ 'table-toggle--active': props.expanded }"
    :text="t('table')"
    @click="emit('toggle')"
  >
    <v-icon icon="mdi-table" />
  </Button>

  <div v-else class="table-tools" :dir="dir">
    <section class="table-tools__group table-tools__group--primary" :aria-label="t('table')">
      <button class="table-tools__button table-tools__button--wide" type="button" @click="runTableAction(insertTable)">
        <v-icon icon="mdi-table-plus" />
        <span>{{ t("addTable") }}</span>
      </button>
      <button class="table-tools__button table-tools__button--danger table-tools__button--wide" type="button" @click="runTableAction(deleteTable)">
        <v-icon icon="mdi-table-remove" />
        <span>{{ t("deleteTable") }}</span>
      </button>
    </section>

    <section class="table-tools__group" :aria-label="t('columnManagement')">
      <h3 class="table-tools__title">{{ t("columnManagement") }}</h3>
      <div class="table-tools__buttons">
        <button class="table-tools__button" type="button" @click="runTableAction(addColumnBefore)">
          <v-icon icon="mdi-table-column-plus-before" />
          <span>{{ t("addColumnBefore") }}</span>
        </button>
        <button class="table-tools__button" type="button" @click="runTableAction(addColumnAfter)">
          <v-icon icon="mdi-table-column-plus-after" />
          <span>{{ t("addColumnAfter") }}</span>
        </button>
        <button class="table-tools__button table-tools__button--danger" type="button" @click="runTableAction(deleteColumn)">
          <v-icon icon="mdi-table-column-remove" />
          <span>{{ t("deleteColumn") }}</span>
        </button>
      </div>
    </section>

    <section class="table-tools__group" :aria-label="t('rowManagement')">
      <h3 class="table-tools__title">{{ t("rowManagement") }}</h3>
      <div class="table-tools__buttons">
        <button class="table-tools__button" type="button" @click="runTableAction(addRowBefore)">
          <v-icon icon="mdi-table-row-plus-before" />
          <span>{{ t("addRowBefore") }}</span>
        </button>
        <button class="table-tools__button" type="button" @click="runTableAction(addRowAfter)">
          <v-icon icon="mdi-table-row-plus-after" />
          <span>{{ t("addRowAfter") }}</span>
        </button>
        <button class="table-tools__button table-tools__button--danger" type="button" @click="runTableAction(deleteRow)">
          <v-icon icon="mdi-table-row-remove" />
          <span>{{ t("deleteRow") }}</span>
        </button>
      </div>
    </section>

    <section class="table-tools__group table-tools__group--cells" :aria-label="t('cellManagement')">
      <h3 class="table-tools__title">{{ t("cellManagement") }}</h3>
      <div class="table-tools__buttons">
        <button class="table-tools__button" type="button" @click="runTableAction(mergeCells)">
          <v-icon icon="mdi-table-merge-cells" />
          <span>{{ t("mergeCells") }}</span>
        </button>
        <button class="table-tools__button" type="button" @click="runTableAction(splitCell)">
          <v-icon icon="mdi-table-split-cell" />
          <span>{{ t("splitCell") }}</span>
        </button>
        <button class="table-tools__button" type="button" @click="runTableAction(mergeOrSplit)">
          <v-icon icon="mdi-table" />
          <span>{{ t("mergeOrSplit") }}</span>
        </button>
        <button class="table-tools__button" type="button" @click="runTableAction(setCellAttribute)">
          <v-icon icon="mdi-table-column-width" />
          <span>{{ t("setCellAttribute") }}</span>
        </button>
      </div>
    </section>

    <section class="table-tools__group table-tools__group--navigation" :aria-label="t('table')">
      <button class="table-tools__button" type="button" @click="runTableAction(fixTables)">
        <v-icon icon="mdi-table-refresh" />
        <span>{{ t("fixTable") }}</span>
      </button>
      <button class="table-tools__button" type="button" @click="runTableAction(goToNextCell)">
        <v-icon :icon="isRtl ? 'mdi-chevron-left-box' : 'mdi-chevron-right-box'" />
        <span>{{ t("nextCell") }}</span>
      </button>
      <button class="table-tools__button" type="button" @click="runTableAction(goToPreviousCell)">
        <v-icon :icon="isRtl ? 'mdi-chevron-right-box' : 'mdi-chevron-left-box'" />
        <span>{{ t("previousCell") }}</span>
      </button>
    </section>
  </div>
</template>

<style scoped lang="scss">
.table-tools {
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: var(--tiptap-editor-font);
  width: 100%;
}

.table-tools__group {
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.45rem;
  display: inline-flex;
  gap: 0.35rem;
  min-height: 2.35rem;
  min-width: 0;
  padding: 0.25rem;
}

.table-tools__group--primary,
.table-tools__group--navigation {
  flex: 0 1 auto;
}

.table-tools__group--cells {
  flex: 1 1 22rem;
}

.table-tools__title {
  color: #475569;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  padding-inline: 0.25rem;
  white-space: nowrap;
}

.table-tools__buttons {
  display: contents;
}

.table-tools__button {
  align-items: center;
  border: 0;
  border-inline-start: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 0.35rem;
  color: #111827;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 650;
  gap: 0.32rem;
  justify-content: center;
  line-height: 1.1;
  min-height: 1.9rem;
  min-width: 2.45rem;
  padding: 0.3rem 0.45rem;
  text-align: center;
  transition:
    background-color 0.16s ease,
    box-shadow 0.16s ease,
    color 0.16s ease;
  white-space: nowrap;
}

.table-tools__button:first-of-type {
  border-inline-start: 0;
}

.table-tools__button--wide {
  min-width: 5.75rem;
}

.table-tools__button:hover,
.table-tools__button:focus-visible {
  background: #f8fafc;
  box-shadow: inset 0 0 0 1px #94a3b8;
  outline: none;
}

.table-tools__button--danger {
  color: #b91c1c;
}

.table-tools__button--danger:hover,
.table-tools__button--danger:focus-visible {
  background: #fef2f2;
  box-shadow: inset 0 0 0 1px #fecaca;
}

.table-tools__button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.table-toggle--active) {
  background: #ecfeff;
  color: #0e7490 !important;
}

:deep(.ct-icon) {
  flex: 0 0 auto;
}
</style>
