import { useState, useEffect, useCallback } from "react";

export function useIdle(timeout: number) {
  const [isIdle, setIsIdle] = useState(false);

  const handleActivity = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsIdle(true);
      }, timeout);
    };

    // Events that reset the idle timer
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "wheel",
    ];

    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeout, handleActivity]);

  return isIdle;
}
