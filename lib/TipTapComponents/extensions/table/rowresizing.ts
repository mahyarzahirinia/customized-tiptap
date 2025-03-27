import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import { tableNodeTypes } from "@tiptap/pm/tables";
import { TableView, updateColumnsOnResize } from "@tiptap/pm/tables";
import { RowResizingOptions } from "./types";
import { ResizeState } from "./ResizeState";
import { handleMouseMove } from "./handlers/handleMouseMove";
import { handleMouseLeave } from "./handlers/handleMouseLeave";
import { handleMouseDown } from "./handlers/handleMouseDown";
import { handleDecorations } from "./handlers/handleDecorations";

//
//
//
export const rowResizingPluginKey = new PluginKey<ResizeState>(
  "tableRowResizing",
);
/**
 * @public
 */
export function rowResizing({
  handleHeight = 5,
  cellMinHeight = 25,
  defaultCellMinHeight = 100,
  View = TableView,
  lastRowResizable = true,
}: RowResizingOptions = {}): Plugin {
  const plugin = new Plugin<ResizeState>({
    key: rowResizingPluginKey,
    state: {
      init(_, state) {
        const nodeViews = plugin.spec?.props?.nodeViews;
        const tableName = tableNodeTypes(state.schema).table.name;
        if (View && nodeViews) {
          nodeViews[tableName] = (node, view) => {
            return new View(node, defaultCellMinHeight, view);
          };
        }

        return new ResizeState(-1, false);
      },
      apply(tr, prev) {
        return prev.apply(tr);
      },
    },
    props: {
      attributes: (state): Record<string, string> => {
        const pluginState = rowResizingPluginKey.getState(state);
        return pluginState && pluginState.activeHandle > -1
          ? { class: "resize-cursor" }
          : {};
      },

      handleDOMEvents: {
        mousemove: (view, event) => {
          handleMouseMove(view, event, handleHeight, lastRowResizable);
        },
        mouseleave: (view) => {
          handleMouseLeave(view);
        },
        mousedown: (view, event) => {
          handleMouseDown(view, event, cellMinHeight, defaultCellMinHeight);
        },
      },

      decorations: (state) => {
        const pluginState = rowResizingPluginKey.getState(state);
        if (pluginState && pluginState.activeHandle > -1) {
          return handleDecorations(state, pluginState.activeHandle);
        }
      },

      nodeViews: {},
    },
  });

  return plugin;
}
