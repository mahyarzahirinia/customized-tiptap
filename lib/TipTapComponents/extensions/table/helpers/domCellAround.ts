export function domCellAround(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName != "TD" && target.nodeName != "TH") {
    target =
      target.classList && target.classList.contains("ProseMirror")
        ? null
        : (target.parentNode as HTMLElement);
  }
  return target;
}
