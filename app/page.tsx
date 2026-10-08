"use client";

import { useState } from "react";
import { filterEvents, LevelFilter } from "@/lib/filterEvents";
import { useEvents } from "@/lib/useEvents";
import { WalletConnect } from "@/components/WalletConnect";

export default function DashboardPage() {
  const { events, state, errorMessage, lastUpdated, refreshing, refresh } =
    useEvents();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("all");

  const visibleEvents = filterEvents(events, query, level);
  const filtering = query.trim() !== "" || level !== "all";

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
        <>
          <div className="event-filters" role="search">
            <label>
              Address or topic
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search flagged addresses"
              />
            </label>
            <label>
              Risk level
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as LevelFilter)}
              >
                <option value="all">All</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (50-79)</option>
                <option value="low">Low (under 50)</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
            {filtering && (
              <button
                onClick={() => {
                  setQuery("");
                  setLevel("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <p aria-live="polite">
            Showing {visibleEvents.length} of {events.length} events
          </p>

          {visibleEvents.length === 0 ? (
            <p>No events match these filters.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Topic</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {visibleEvents.map((event, i) => (
                  <tr key={i}>
                    <td>{event.contractId ?? "—"}</td>
                    <td>{event.topic?.join(", ") ?? "—"}</td>
                    <td>{event.value ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}
