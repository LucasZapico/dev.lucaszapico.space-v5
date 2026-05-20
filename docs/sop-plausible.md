# SOP: Plausible Analytics Setup

Privacy-first analytics for BMM / Lucas Zapico projects. No cookies, GDPR-compliant, no impact on Lighthouse score.

## When to use

Add Plausible to any public-facing site where traffic visibility matters. Skip for internal tools or local-only projects.

---

## Setup

### 1. Create the site in Plausible

1. Log in at [plausible.io](https://plausible.io)
2. Add Site → enter the production domain (e.g. `dev.lucaszapico.space`)
3. Note the domain string — it must match exactly what goes in `PLAUSIBLE_DOMAIN`

### 2. Install the tracker package

```bash
pnpm add @plausible-analytics/tracker
```

### 3. Add the plausible lib

Create `app/lib/plausible.ts`:

```ts
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
      init({ domain, endpoint, autoCapturePageviews: true, captureOnLocalhost: false });
      trackFn = track;
    });
  }, [domain, apiHost]);
}

export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (!trackFn) return;
  trackFn(eventName, { props });
}
```

### 4. Wire into root.tsx

Add a loader to pass env vars to the client, then call the hook in `App`:

```tsx
// loader (server-side)
export async function loader() {
  return {
    plausibleDomain: process.env.PLAUSIBLE_DOMAIN || "",
    plausibleApiHost: process.env.PLAUSIBLE_API_HOST || "",
  };
}

// App component
export default function App() {
  const { plausibleDomain, plausibleApiHost } = useLoaderData<typeof loader>();
  usePlausible(plausibleDomain, plausibleApiHost);
  return <Outlet />;
}
```

### 5. Set env vars

In `.env` (dev — leave empty to disable tracking locally):

```
PLAUSIBLE_DOMAIN=
PLAUSIBLE_API_HOST=
```

In Coolify (production):

```
PLAUSIBLE_DOMAIN=dev.lucaszapico.space
PLAUSIBLE_API_HOST=https://plausible.io
```

### 6. Verify

Deploy, visit the site, check the Plausible dashboard. First pageview usually appears within 30 seconds.

---

## Custom events

```ts
import { trackEvent } from "~/lib/plausible";

trackEvent("Resume Download");
trackEvent("Contact Click", { source: "hero" });
```

Call from event handlers or `useEffect` only — never runs server-side.

---

## Notes

- Empty `PLAUSIBLE_DOMAIN` or `PLAUSIBLE_API_HOST` disables tracking silently — no errors
- `captureOnLocalhost: false` prevents dev traffic from polluting the dashboard even if vars are set
- Dynamic import avoids SSR issues (tracker has no server-side entrypoint)
- If the site moves domains, update `PLAUSIBLE_DOMAIN` in Coolify and re-add the site in Plausible
