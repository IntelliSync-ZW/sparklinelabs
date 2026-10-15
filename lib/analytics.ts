// Thin wrapper over Google Analytics (gtag is loaded by the layouts). Safe to call
// anywhere: it does nothing on the server or when analytics is blocked.

type GtagFn = (command: "event", name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    (window as unknown as { gtag?: GtagFn }).gtag?.("event", name, params);
  } catch {
    // Analytics must never break the lesson.
  }
}
