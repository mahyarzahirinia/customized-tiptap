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

  <div v-else class="table-menu" :dir="dir">
    <section class="table-menu__section table-menu__section--primary">
      <button class="table-menu__action" type="button" @click="runTableAction(insertTable)">
        <v-icon icon="mdi-table-plus" />
        <span>{{ t("addTable") }}</span>
      </button>
      <button class="table-menu__action table-menu__action--danger" type="button" @click="runTableAction(deleteTable)">
        <v-icon icon="mdi-table-remove" />
        <span>{{ t("deleteTable") }}</span>
      </button>
    </section>

    <section class="table-menu__section">
      <h3 class="table-menu__title">{{ t("columnManagement") }}</h3>
      <div class="table-menu__grid">
        <button class="table-menu__action" type="button" @click="runTableAction(addColumnBefore)">
          <v-icon icon="mdi-table-column-plus-before" />
          <span>{{ t("addColumnBefore") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(addColumnAfter)">
          <v-icon icon="mdi-table-column-plus-after" />
          <span>{{ t("addColumnAfter") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(deleteColumn)">
          <v-icon icon="mdi-table-column-remove" />
          <span>{{ t("deleteColumn") }}</span>
        </button>
      </div>
    </section>

    <section class="table-menu__section">
      <h3 class="table-menu__title">{{ t("rowManagement") }}</h3>
      <div class="table-menu__grid">
        <button class="table-menu__action" type="button" @click="runTableAction(addRowBefore)">
          <v-icon icon="mdi-table-row-plus-before" />
          <span>{{ t("addRowBefore") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(addRowAfter)">
          <v-icon icon="mdi-table-row-plus-after" />
          <span>{{ t("addRowAfter") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(deleteRow)">
          <v-icon icon="mdi-table-row-remove" />
          <span>{{ t("deleteRow") }}</span>
        </button>
      </div>
    </section>

    <section class="table-menu__section">
      <h3 class="table-menu__title">{{ t("cellManagement") }}</h3>
      <div class="table-menu__grid">
        <button class="table-menu__action" type="button" @click="runTableAction(mergeCells)">
          <v-icon icon="mdi-table-merge-cells" />
          <span>{{ t("mergeCells") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(splitCell)">
          <v-icon icon="mdi-table-split-cell" />
          <span>{{ t("splitCell") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(mergeOrSplit)">
          <v-icon icon="mdi-table" />
          <span>{{ t("mergeOrSplit") }}</span>
        </button>
        <button class="table-menu__action" type="button" @click="runTableAction(setCellAttribute)">
          <v-icon icon="mdi-table-column-width" />
          <span>{{ t("setCellAttribute") }}</span>
        </button>
      </div>
    </section>

    <section class="table-menu__section table-menu__section--compact">
      <button class="table-menu__action" type="button" @click="runTableAction(fixTables)">
        <v-icon icon="mdi-table-refresh" />
        <span>{{ t("fixTable") }}</span>
      </button>
      <button class="table-menu__action" type="button" @click="runTableAction(goToNextCell)">
        <v-icon :icon="isRtl ? 'mdi-chevron-left-box' : 'mdi-chevron-right-box'" />
        <span>{{ t("nextCell") }}</span>
      </button>
      <button class="table-menu__action" type="button" @click="runTableAction(goToPreviousCell)">
        <v-icon :icon="isRtl ? 'mdi-chevron-right-box' : 'mdi-chevron-left-box'" />
        <span>{{ t("previousCell") }}</span>
      </button>
    </section>
  </div>
</template>

<style scoped lang="scss">
.table-menu {
  display: grid;
  gap: 0.65rem;
  font-family: var(--tiptap-editor-font);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
}

.table-menu__section {
  display: grid;
  gap: 0.4rem;
  padding: 0.45rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
}

.table-menu__section--primary,
.table-menu__section--compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.table-menu__section--compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.table-menu__title {
  margin: 0;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
}

.table-menu__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
}

.table-menu__action {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 2.15rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.45rem;
  background: #fff;
  color: #111827;
  cursor: pointer;
  font: inherit;
  font-size: 0.76rem;
  gap: 0.4rem;
  text-align: start;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    color 0.16s ease;
}

.table-menu__action:hover,
.table-menu__action:focus-visible {
  border-color: #94a3b8;
  background: #f8fafc;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.1);
  outline: none;
}

.table-menu__action--danger {
  color: #b91c1c;
}

.table-menu__action--danger:hover,
.table-menu__action--danger:focus-visible {
  border-color: #fecaca;
  background: #fef2f2;
}

.table-menu__action span {
  min-width: 0;
  overflow-wrap: anywhere;
}

:deep(.table-toggle--active) {
  background: #ecfeff;
  color: #0e7490 !important;
}

:deep(.ct-icon) {
  flex: 0 0 auto;
}
</style>
