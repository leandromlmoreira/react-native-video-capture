import { useEffect, useState } from "react";

export function useElapsed(running: boolean) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    setElapsed(0);
    const timer = setInterval(() => setElapsed(Date.now() - startedAt), 50);
    return () => clearInterval(timer);
  }, [running]);

  return running ? elapsed : 0;
}
