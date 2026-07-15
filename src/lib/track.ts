"use client";

type TrackPayload = {
  type: "page_view" | "cta_click";
  path?: string;
  label?: string;
};

export function trackEvent(payload: TrackPayload) {
  try {
    const body = JSON.stringify({
      type: payload.type,
      path: payload.path || (typeof window !== "undefined" ? window.location.pathname : "/"),
      label: payload.label,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
      return;
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Tracking must never break the UX
  }
}
