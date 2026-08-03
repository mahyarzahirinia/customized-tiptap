import {
  Transition,
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type App,
  type PropType,
} from "vue";
import Icon from "../icons/Icon.vue";
import "./styles.css";

type Item = Record<string, any>;

const getTitle = (item: Item, titleKey = "title") =>
  item?.[titleKey] ?? item?.title ?? item?.label ?? String(item ?? "");

const getValue = (item: Item, valueKey = "value") => item?.[valueKey] ?? item;

function useModel(props: any, emit: any) {
  const value = computed({
    get: () => props.modelValue,
    set: (next) => emit("update:modelValue", next),
  });
  return value;
}

export const VIcon = Icon;

export const VBtn = defineComponent({
  name: "VBtn",
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    size: String,
    text: Boolean,
    color: String,
    variant: String,
    density: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          class: ["ct-btn", attrs.class, props.color && `ct-btn--${props.color}`],
          disabled: props.disabled,
          type: "button",
        },
        slots.default?.()
      );
  },
});

export const VTooltip = defineComponent({
  name: "VTooltip",
  props: {
    text: String,
    location: String,
  },
  setup(props, { slots }) {
    return () =>
      h(
        "span",
        { class: "ct-tooltip", title: props.text },
        slots.activator?.({ props: { title: props.text } }) ?? slots.default?.()
      );
  },
});

export const VLocaleProvider = defineComponent({
  name: "VLocaleProvider",
  props: { rtl: Boolean },
  setup(props, { slots }) {
    return () =>
      h("div", { class: "ct-locale-provider", dir: props.rtl ? "rtl" : undefined }, slots.default?.());
  },
});

export const VExpandTransition = defineComponent({
  name: "VExpandTransition",
  setup(_, { slots }) {
    return () => h(Transition, { name: "ct-expand" }, { default: slots.default });
  },
});

export const VSpacer = defineComponent({
  name: "VSpacer",
  setup() {
    return () => h("span", { class: "ct-spacer" });
  },
});

export const VSheet = defineComponent({
  name: "VSheet",
  setup(_, { slots, attrs }) {
    return () => h("div", { ...attrs, class: ["ct-sheet", attrs.class] }, slots.default?.());
  },
});

export const VProgressCircular = defineComponent({
  name: "VProgressCircular",
  props: { size: [String, Number], color: String, indeterminate: Boolean },
  setup(props) {
    return () =>
      h("span", {
        class: "ct-progress-circular",
        style: { width: `${props.size ?? 20}px`, height: `${props.size ?? 20}px` },
      });
  },
});

export const VProgressLinear = defineComponent({
  name: "VProgressLinear",
  props: { height: [String, Number], color: String, indeterminate: Boolean },
  setup(props) {
    return () =>
      h("span", {
        class: "ct-progress-linear",
        style: { height: `${props.height ?? 3}px` },
      });
  },
});

export const VSwitch = defineComponent({
  name: "VSwitch",
  props: { modelValue: Boolean },
  emits: ["update:modelValue"],
  setup(props, { emit, attrs }) {
    const model = useModel(props, emit);
    return () =>
      h("label", { class: ["ct-switch", attrs.class] }, [
        h("input", {
          checked: model.value,
          type: "checkbox",
          onChange: (event: Event) => {
            model.value = (event.target as HTMLInputElement).checked;
          },
        }),
        h("span", { class: "ct-switch__track" }),
      ]);
  },
});

export const VTextField = defineComponent({
  name: "VTextField",
  props: {
    modelValue: [String, Number],
    label: String,
    type: { type: String, default: "text" },
    autofocus: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props, { emit, attrs }) {
    const model = useModel(props, emit);
    return () =>
      h("label", { class: ["ct-field", attrs.class] }, [
        props.label && h("span", { class: "ct-field__label" }, props.label),
        h("input", {
          class: "ct-field__input",
          autofocus: props.autofocus,
          type: props.type,
          value: model.value ?? "",
          onInput: (event: Event) => {
            model.value = (event.target as HTMLInputElement).value;
          },
        }),
      ]);
  },
});

export const VColorPicker = defineComponent({
  name: "VColorPicker",
  props: { modelValue: String },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const model = useModel(props, emit);
    return () =>
      h("input", {
        class: "ct-color-picker",
        type: "color",
        value: model.value || "#000000",
        onInput: (event: Event) => {
          model.value = (event.target as HTMLInputElement).value;
        },
      });
  },
});

const SelectBase = defineComponent({
  name: "SelectBase",
  props: {
    modelValue: null,
    items: { type: Array as PropType<Item[]>, default: () => [] },
    itemTitle: { type: String, default: "title" },
    itemText: { type: String, default: "title" },
    itemValue: { type: String, default: "value" },
    label: String,
    prependIcon: String,
    menuIcon: String,
    returnObject: Boolean,
    clearable: Boolean,
    loading: Boolean,
    search: String,
  },
  emits: ["update:modelValue", "update:search"],
  setup(props, { emit, slots, attrs }) {
    const root = ref<HTMLElement | null>(null);
    const open = ref(false);
    const query = ref(props.search ?? "");
    const titleKey = computed(() => props.itemTitle || props.itemText || "title");
    const selectedItem = computed(() =>
      props.items.find((item) => getValue(item, props.itemValue) === props.modelValue || item === props.modelValue)
    );
    const visibleItems = computed(() => {
      if (!query.value) return props.items;
      const normalized = query.value.toLowerCase();
      return props.items.filter((item) =>
        String(getTitle(item, titleKey.value)).toLowerCase().includes(normalized)
      );
    });

    watch(
      () => props.search,
      (next) => {
        if (typeof next === "string") query.value = next;
      }
    );

    const choose = (item: Item) => {
      emit("update:modelValue", props.returnObject ? item : getValue(item, props.itemValue));
      open.value = false;
    };

    const closeFromOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && root.value?.contains(target)) return;
      open.value = false;
    };

    onMounted(() => {
      document.addEventListener("mousedown", closeFromOutside);
      document.addEventListener("touchstart", closeFromOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("mousedown", closeFromOutside);
      document.removeEventListener("touchstart", closeFromOutside);
    });

    const selectedSlotItem = computed(() => {
      if (!selectedItem.value) return null;
      return {
        raw: selectedItem.value,
        title: getTitle(selectedItem.value, titleKey.value),
        value: getValue(selectedItem.value, props.itemValue),
      };
    });

    return () =>
      h("div", { ref: root, class: ["ct-select", attrs.class] }, [
        h("div", { class: "ct-select__control", onClick: () => (open.value = true) }, [
          props.prependIcon && h(Icon, { icon: props.prependIcon }),
          selectedSlotItem.value &&
            slots.selection?.({
              item: selectedSlotItem.value,
            }),
          h("input", {
            class: ["ct-select__input", slots.selection && "ct-select__input--with-selection"],
            placeholder: props.label,
            value: slots.selection
              ? query.value
              : query.value || (selectedItem.value ? getTitle(selectedItem.value, titleKey.value) : ""),
            onFocus: () => (open.value = true),
            onInput: (event: Event) => {
              query.value = (event.target as HTMLInputElement).value;
              emit("update:search", query.value);
              open.value = true;
            },
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === "Escape") open.value = false;
              if (event.key === "Enter" && visibleItems.value[0]) choose(visibleItems.value[0]);
            },
          }),
          props.loading && h(VProgressCircular, { size: 16 }),
          props.clearable &&
            props.modelValue &&
            h("button", {
              class: "ct-select__clear",
              type: "button",
              onClick: (event: Event) => {
                event.stopPropagation();
                emit("update:modelValue", null);
              },
            }, [h(Icon, { icon: "mdi-close" })]),
          props.menuIcon !== "" && h(Icon, { icon: props.menuIcon || "mdi-chevron-down" }),
        ]),
        open.value &&
          h(
            "div",
            { class: "ct-select__menu" },
            visibleItems.value.map((item) => {
              const slotProps = {
                item: { raw: item, title: getTitle(item, titleKey.value), value: getValue(item, props.itemValue) },
                props: {
                  class: "ct-list-item",
                  onClick: () => choose(item),
                },
              };
              return slots.item
                ? slots.item(slotProps)
                : h("button", slotProps.props, getTitle(item, titleKey.value));
            })
          ),
      ]);
  },
});

export const VSelect = SelectBase;
export const VAutocomplete = SelectBase;

export const VList = defineComponent({
  name: "VList",
  setup(_, { slots, attrs }) {
    return () => h("div", { ...attrs, class: ["ct-list", attrs.class] }, slots.default?.());
  },
});

export const VListItem = defineComponent({
  name: "VListItem",
  inheritAttrs: false,
  props: { disabled: Boolean, title: String },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        "button",
        { ...attrs, class: ["ct-list-item", attrs.class], disabled: props.disabled, type: "button" },
        [
          slots.prepend?.(),
          slots.default?.() ?? props.title,
          slots.append && h("span", { class: "ct-list-item__append" }, slots.append()),
        ]
      );
  },
});

export const VListItemTitle = defineComponent({
  name: "VListItemTitle",
  setup(_, { slots }) {
    return () => h("span", { class: "ct-list-item-title" }, slots.default?.());
  },
});

export const VMenu = defineComponent({
  name: "VMenu",
  props: {
    activator: String,
    location: String,
    openOnHover: Boolean,
    transition: String,
  },
  setup(props, { slots }) {
    const root = ref<HTMLElement | null>(null);
    const open = ref(false);
    const parentActivator = ref<HTMLElement | null>(null);
    const cleanups: Array<() => void> = [];
    const usesParentActivator = computed(() => !slots.activator && props.activator === "parent");

    const closeFromOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (root.value?.contains(target)) return;
      if (parentActivator.value?.contains(target)) return;
      open.value = false;
    };

    onMounted(() => {
      document.addEventListener("mousedown", closeFromOutside);
      document.addEventListener("touchstart", closeFromOutside);
      cleanups.push(() => {
        document.removeEventListener("mousedown", closeFromOutside);
        document.removeEventListener("touchstart", closeFromOutside);
      });

      if (slots.activator || props.activator !== "parent" || !root.value?.parentElement) return;

      const parent = root.value.parentElement;
      parentActivator.value = parent;
      const show = () => (open.value = true);
      const hide = () => (open.value = false);
      const toggle = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        open.value = !open.value;
      };

      if (props.openOnHover) {
        parent.addEventListener("mouseenter", show);
        parent.addEventListener("mouseleave", hide);
      } else {
        parent.addEventListener("click", toggle);
        parent.addEventListener("mouseleave", hide);
      }

      cleanups.push(() => {
        parent.removeEventListener("mouseenter", show);
        parent.removeEventListener("mouseleave", hide);
        parent.removeEventListener("click", toggle);
      });
    });

    onUnmounted(() => {
      cleanups.forEach((cleanup) => cleanup());
    });

    return () =>
      h(
        "span",
        {
          ref: root,
          class: "ct-menu",
          onMouseenter: () => {
            if (!usesParentActivator.value) open.value = true;
          },
          onMouseleave: () => {
            if (!usesParentActivator.value) open.value = false;
          },
          onClick: (event: Event) => {
            if (usesParentActivator.value) return;
            event.stopPropagation();
            open.value = !open.value;
          },
        },
        [slots.activator?.({ props: {} }), open.value && h("div", { class: "ct-menu__content" }, slots.default?.())]
      );
  },
});

export const VDialog = defineComponent({
  name: "VDialog",
  props: { modelValue: Boolean, maxWidth: [String, Number] },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    return () =>
      props.modelValue
        ? h("div", { class: "ct-dialog" }, [
            h("div", { class: "ct-dialog__scrim", onClick: () => emit("update:modelValue", false) }),
            h(
              "div",
              { class: "ct-dialog__content", style: { maxWidth: typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth } },
              slots.default?.()
            ),
          ])
        : null;
  },
});

export const VCard = defineComponent({
  name: "VCard",
  setup(_, { slots }) {
    return () => h("div", { class: "ct-card" }, slots.default?.());
  },
});

export const VCardTitle = defineComponent({
  name: "VCardTitle",
  setup(_, { slots, attrs }) {
    return () => h("div", { ...attrs, class: ["ct-card-title", attrs.class] }, slots.default?.());
  },
});

export const VCardText = defineComponent({
  name: "VCardText",
  setup(_, { slots, attrs }) {
    return () => h("div", { ...attrs, class: ["ct-card-text", attrs.class] }, slots.default?.());
  },
});

export const VCardActions = defineComponent({
  name: "VCardActions",
  setup(_, { slots }) {
    return () => h("div", { class: "ct-card-actions" }, slots.default?.());
  },
});

export const VContainer = defineComponent({
  name: "VContainer",
  setup(_, { slots, attrs }) {
    return () => h("div", { ...attrs, class: ["ct-container", attrs.class] }, slots.default?.());
  },
});

export const VRow = defineComponent({
  name: "VRow",
  setup(_, { slots }) {
    return () => h("div", { class: "ct-row" }, slots.default?.());
  },
});

export const VCol = defineComponent({
  name: "VCol",
  props: { cols: [String, Number] },
  setup(props, { slots }) {
    return () => h("div", { class: "ct-col", style: { flexBasis: `${(Number(props.cols) || 12) / 12 * 100}%` } }, slots.default?.());
  },
});

export const VSnackbar = defineComponent({
  name: "VSnackbar",
  props: { modelValue: Boolean, timeout: Number, color: String },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    let timer: number | undefined;
    watch(
      () => props.modelValue,
      (shown) => {
        if (timer) window.clearTimeout(timer);
        if (shown && props.timeout) {
          timer = window.setTimeout(() => emit("update:modelValue", false), props.timeout);
        }
      },
      { immediate: true }
    );
    onUnmounted(() => timer && window.clearTimeout(timer));

    return () =>
      props.modelValue
        ? h("div", { class: ["ct-snackbar", props.color && `ct-snackbar--${props.color}`] }, [
            h("span", slots.default?.()),
            h("span", { class: "ct-snackbar__actions" }, slots.actions?.()),
          ])
        : null;
  },
});

export const VApp = defineComponent({ name: "VApp", setup: (_, { slots }) => () => h("div", { class: "ct-app" }, slots.default?.()) });
export const VMain = defineComponent({ name: "VMain", setup: (_, { slots }) => () => h("main", { class: "ct-main" }, slots.default?.()) });

export const uiComponents = {
  VApp,
  VAutocomplete,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCol,
  VColorPicker,
  VContainer,
  VDialog,
  VExpandTransition,
  VIcon,
  VList,
  VListItem,
  VListItemTitle,
  VLocaleProvider,
  VMain,
  VMenu,
  VProgressCircular,
  VProgressLinear,
  VRow,
  VSelect,
  VSnackbar,
  VSpacer,
  VSheet,
  VSwitch,
  VTextField,
  VTooltip,
};

export function installUiComponents(app: App) {
  Object.entries(uiComponents).forEach(([name, component]) => {
    app.component(name, component);
    app.component(name.replace(/^V/, "v-").replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace("v--", "v-"), component);
  });
}
