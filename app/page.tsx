"use client";

import { useEvents } from "@/lib/useEvents";
import { WalletConnect } from "@/components/WalletConnect";

export default function DashboardPage() {
  const { events, state, errorMessage, lastUpdated, refreshing, refresh } =
    useEvents();

  return (
    <main>
      <header>
        <h1>SoroWatch Dashboard</h1>
        <WalletConnect />
      </header>

      <div>
        <button onClick={refresh} disabled={refreshing}>
          {refreshing ? "Refreshing..." : "Refresh now"}
        </button>
        <span aria-live="polite">
          {lastUpdated
            ? ` Last updated ${lastUpdated.toLocaleTimeString()} (auto-refreshes every 15s)`
            : ""}
        </span>
      </div>

      {state === "loading" && <p>Loading flagged addresses...</p>}

      {state === "error" && (
        <p role="alert">
          Couldn&apos;t load events from the backend: {errorMessage}
        </p>
      )}

      {state !== "error" && state !== "loading" && errorMessage && (
        <p role="alert">
          Couldn&apos;t refresh events ({errorMessage}). Showing the last
          data we loaded.
        </p>
      )}

      {state === "empty" && (
        <p>No flagged addresses yet. Once agents start flagging activity, it&apos;ll show up here.</p>
      )}

      {state === "loaded" && (
        <table>
          <thead>
            <tr>
              <th>Contract</th>
              <th>Topic</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr key={i}>
                <td>{event.contractId ?? "—"}</td>
                <td>{event.topic?.join(", ") ?? "—"}</td>
                <td>{event.value ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
