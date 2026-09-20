"use client";

import { useEffect, useState } from "react";
import { fetchEvents, FlagEvent } from "@/lib/api";
import { WalletConnect } from "@/components/WalletConnect";

type LoadState = "loading" | "error" | "empty" | "loaded";

export default function DashboardPage() {
  const [events, setEvents] = useState<FlagEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState("loading");
      try {
        const data = await fetchEvents();
        if (cancelled) return;
        setEvents(data);
        setState(data.length === 0 ? "empty" : "loaded");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Unknown error");
        setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <header>
        <h1>SoroWatch Dashboard</h1>
        <WalletConnect />
      </header>

      {state === "loading" && <p>Loading flagged addresses...</p>}

      {state === "error" && (
        <p role="alert">
          Couldn't load events from the backend: {errorMessage}
        </p>
      )}

      {state === "empty" && (
        <p>No flagged addresses yet. Once agents start flagging activity, it'll show up here.</p>
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
