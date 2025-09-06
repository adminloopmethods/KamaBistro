import { useRef, useEffect, RefObject } from "react";

export const useDraggable = (blockedRef?: RefObject<HTMLElement | null>) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;

      // ✅ block dragging if inside blockedRef
      if (blockedRef?.current && blockedRef.current.contains(e.target)) {
        return;
      }

      // block inputs
      if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(e.target.tagName)) {
        return;
      }

      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);
    return () => el.removeEventListener("mousedown", onMouseDown);
  }, [blockedRef?.current]);

  return ref;
};
