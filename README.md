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

## Run
```
npm install
npm run dev
```
Set `NEXT_PUBLIC_BACKEND_URL` in `.env.local` if the backend isn't at
`http://localhost:8000`.
