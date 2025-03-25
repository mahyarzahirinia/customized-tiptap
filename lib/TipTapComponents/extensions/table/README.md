# Table Row Resizing Plugin for ProseMirror

## How It Works

1. **Detecting Cursor Position**:
    - The plugin listens for `mousemove` events and detects when the cursor is near a row edge.
    - If the cursor is close to an edge (within `handleHeight` pixels), it highlights the row for resizing.

2. **Starting a Resize Operation**:
    - On `mousedown`, the plugin checks if the user clicked on a resizable row edge.
    - It stores the **initial mouse position** and the **starting row height**.

3. **Updating the Row Height**:
    - As the user drags, the plugin calculates the **new row height** dynamically.
    - It updates the table node attributes and ensures the **new row height is above `cellMinHeight`**.

4. **Finalizing the Resize**:
    - When the user releases the mouse (`mouseup`), the row height update is applied permanently to the document.
    - The plugin ensures that the new row height is correctly mapped in case of concurrent document changes.

## Modifying the Plugin Logic

If you need to modify the plugin logic, you can edit the following key areas:

### **1. Changing the Resize Handle Detection**
Located in `handleMouseMove()` inside `rowResizing.ts`:
```typescript
function handleMouseMove(view, event, handleHeight, lastRowResizable) {
  // Modify this logic to change how row handles are detected
}
```

### **2. Adjusting the Resizing Calculation**
Located in `handleMouseDown()`:
```typescript
function handleMouseDown(view, event, cellMinHeight, defaultCellMinHeight) {
  // Modify this logic to change how row height is calculated
}
```

### **3. Updating Decorations (Visual Handle Representation)**
Located in `handleDecorations()`:
```typescript
function handleDecorations(state, activeHandle) {
  // Modify this logic to customize row handle appearance
}
```
