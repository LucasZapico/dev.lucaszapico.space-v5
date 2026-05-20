import { useEffect, useRef } from "react";

let trackFn: typeof import("@plausible-analytics/tracker").track | null = null;

export function usePlausible(domain: string, apiHost: string) {
  const initRef = useRef(false);

  useEffect(() => {
    if (!domain || !apiHost) return;
    if (initRef.current) return;
    initRef.current = true;

    import("@plausible-analytics/tracker").then(({ init, track }) => {
      const endpoint = apiHost.replace(/\/+$/, "") + "/api/event";
      init({
        domain,
        endpoint,
        autoCapturePageviews: true,
        captureOnLocalhost: false,
      });
      trackFn = track;
    });
  }, [domain, apiHost]);
}

export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (!trackFn) return;
  trackFn(eventName, { props });
}
