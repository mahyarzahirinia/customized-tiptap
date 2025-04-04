import {
  computed,
  nextTick,
  ref,
  shallowRef,
  ShallowRef,
  unref,
  watch,
} from "vue";
import { type Editor } from "@tiptap/core";
import { type EditorView } from "prosemirror-view";
type DataType = {
  title: string;
  label: string;
  value: string;
} | null;

export function useMergeFields(editorRef: any) {
  const delimiter = "{{";
  const showValues = ref(false);
  const isDropdownShown = ref(false);
  const selectedMergeField = ref();
  const mergeFieldQuery = ref();
  const isMergeFieldDropdownVisible = ref(false);
  const mergeFieldDropdownPosition = ref({ x: 0, y: 0 });
  const mergeFields = ref([
    { title: "نام", label: "name", value: "محمد ظهیری نیا", group: "مشخصات" },
    {
      title: "ایمیل",
      label: "email",
      value: "zahiriniamahyar@gmail.com",
      group: "اطلاعات تماس",
    },
    {
      title: "شماره تلفن",
      label: "phone",
      value: "09391398416",
      group: "اطلاعات تماس",
    },
  ]);

  const showMergeFieldDropdown = async (view: EditorView) => {
    //show dropdown
    isMergeFieldDropdownVisible.value = true;
    //to remove the value of the searched item before opening up again
    selectedMergeField.value = "";

    //wait for the next tick to be synced and then set the coordinates accordingly
    await nextTick();
    const { from } = view.state.selection;
    const pos = view.coordsAtPos(from);
    mergeFieldDropdownPosition.value = { x: pos.left, y: pos.top + 20 };
  };

  const insertManually = (selected: DataType) => {
    if (!selected) return;

    editorRef.value
      ?.chain()
      .focus()
      .insertContent({
        type: "mergeFields",
        attrs: {
          label: `${delimiter}${selected.label}}}`,
          title: selected.title,
          value: selected.value,
          showValues,
        },
      })
      .run();
  };

  const insertMergeField = (selected: DataType) => {
    if (!selected) return;

    editorRef.value
      ?.chain()
      .focus()
      .deleteRange({
        from: editorRef.value.state.selection.from - 2,
        to: editorRef.value.state.selection.from,
      }) // Remove "{{"
      .insertContent({
        type: "mergeFields",
        attrs: {
          label: `${delimiter}${selected.label}}}`,
          title: selected.title,
          value: selected.value,
          showValues,
        },
      })
      .run();

    isMergeFieldDropdownVisible.value = false;
  };

  const filteredMergeFields = computed(() =>
    mergeFields.value.filter((field) =>
      field.title.includes(mergeFieldQuery.value || ""),
    ),
  );

  // to search
  const handleSearchUpdate = (query: string) => {
    mergeFieldQuery.value = query;
    // this logic is to select the first item from the menu if open
    if (filteredMergeFields.value.length > 0) {
      selectedMergeField.value = filteredMergeFields.value[0];
    }
    selectedMergeField.value = null; // clear the selected item
  };

  // to enter from the list
  const handleEnterPress = () => {
    if (selectedMergeField.value) {
      insertMergeField(selectedMergeField.value);
    }
  };

  const handleClose = () => {
    // a flag to show dropdown has opened
    isDropdownShown.value = true;
    isMergeFieldDropdownVisible.value = false;
    if (editorRef.value) {
      editorRef.value.commands.focus();
    }
  };

  function handleKeyUp(view: EditorView, event: KeyboardEvent) {
    if (!editorRef.value) return;

    const cursorPos = view.state.selection.from;
    if (cursorPos < 2) return false;

    // grab 2 last chars
    const textBeforeCursor = view.state.doc.textBetween(
      cursorPos - 2,
      cursorPos,
      "",
    );

    // check for every char when dropdown is open
    if (isMergeFieldDropdownVisible.value) {
      const lastTypedChar = event.key.length === 1 ? event.key : "";
      handleSearchUpdate(lastTypedChar);
    }

    // if {{ show dropdown
    if (textBeforeCursor === delimiter && !isDropdownShown.value) {
      showMergeFieldDropdown(view);
    } else {
      // else close it
      isMergeFieldDropdownVisible.value = false;
      isDropdownShown.value = false;
    }
  }

  return {
    delimiter,
    showValues,
    isDropdownShown,
    selectedMergeField,
    mergeFieldQuery,
    isMergeFieldDropdownVisible,
    mergeFieldDropdownPosition,
    mergeFields,
    showMergeFieldDropdown,
    insertManually,
    insertMergeField,
    filteredMergeFields,
    handleSearchUpdate,
    handleEnterPress,
    handleClose,
    handleKeyUp,
  };
}
