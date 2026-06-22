import { useCallback, useRef, useState } from "react";

/** Lightweight, single-slot toast notification state. */
export function useToast() {
  const [toast, setToast] = useState(null); // { message, tone }
  const timer = useRef(null);

  const showToast = useCallback((message, tone = "default") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, tone, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismiss };
}
