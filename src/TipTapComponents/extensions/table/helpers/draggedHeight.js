export function draggedHeight(dragging, event, resizeMinHeight) {
    const offset = event.clientY - dragging.startY;
    return Math.max(resizeMinHeight, dragging.startHeight + offset);
}
//# sourceMappingURL=draggedHeight.js.map