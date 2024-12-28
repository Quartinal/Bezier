import { useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { useBrowserStore } from "~/store/browserStore";

export function useTabGestures(tabId: string) {
  const dragRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ movement: [x], cancel }) => {
      if (!dragRef.current) return;

      if (Math.abs(x) < 100) {
        dragRef.current.style.transform = `translateX(${x}px)`;
        return;
      }

      // Close tab if dragged far enough
      cancel();
      dragRef.current.style.transform = "";
      useBrowserStore.getState().closeTab(tabId);
    },
    {
      from: () => [0, 0],
      filterTaps: true,
      rubberband: true,
    },
  );

  return { bind, dragRef };
}
