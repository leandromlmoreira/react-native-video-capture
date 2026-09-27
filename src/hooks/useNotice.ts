import { useCallback, useEffect, useState } from "react";

export function useNotice(duration = 3200) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  const show = useCallback((text: string) => setMessage(text), []);
  return { message, show };
}
