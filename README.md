# sorowatch-frontend

Dashboard for SoroWatch. Fetches real flag events from sorowatch-backend
and supports connecting a Freighter wallet.

## What's implemented

- `lib/api.ts` — real fetch against the backend's `/events` endpoint
  (configurable via `NEXT_PUBLIC_BACKEND_URL`)
- `app/page.tsx` — dashboard with real loading, error, and empty states
  (not just a happy-path render)
- `lib/useFreighterWallet.ts` + `components/WalletConnect.tsx` — real
  Freighter wallet connection using `@stellar/freighter-api`, with error
  handling for the extension not being installed
- `components/SiteHeader.tsx` + `components/ThemeToggle.tsx` — site header
  with a dark mode toggle. The choice is saved in `localStorage` and, if
  nothing is saved, follows the system `prefers-color-scheme`. A small
  script in `<head>` (`lib/theme.ts`) applies it before first paint so
  there is no light flash. Colors are CSS variables in `app/globals.css`.
- `lib/filterEvents.ts` + the filter bar in `app/page.tsx` — search flagged
  events by contract or topic text and filter by risk level (high 80+,
  medium 50-79, low under 50). Events whose `value` is not a plain number
  are grouped as "Unknown" instead of being hidden. The table shows
  "Showing X of Y events" and a "Clear filters" button.
- Accessibility: a "Skip to main content" link is the first tab stop, the
  events table has a screen-reader caption and `scope="col"` headers, loading,
  empty and "no match" messages use `role="status"`, and wallet and load
  errors use `role="alert"` in the theme's error colour. axe-core reports no
  violations in light or dark mode, but automated tools catch only part of
  accessibility, so manual keyboard and screen reader testing is still welcome.

## Run

```
npm install
npm run dev
```

Set `NEXT_PUBLIC_BACKEND_URL` in `.env.local` if the backend isn't at
`http://localhost:8000`.
