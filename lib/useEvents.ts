"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchEvents, FlagEvent } from "@/lib/api";

export type LoadState = "loading" | "error" | "empty" | "loaded";

export const REFRESH_INTERVAL_MS = 15_000;

/**
 * Loads flagged events and keeps them fresh.
 *
 * - Polls every `intervalMs` while the tab is visible, and refreshes right
 *   away when the tab becomes visible again.
 * - Background refreshes never blank the table: if one fails, the last
 *   good data stays on screen and `errorMessage` explains what went wrong.
 * - Only the newest request may update state, so a slow old response can't
 *   overwrite a newer one.
 */
export function useEvents(intervalMs: number = REFRESH_INTERVAL_MS) {
  const [events, setEvents] = useState<FlagEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const latestRequest = useRef(0);
  const hasData = useRef(false);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setRefreshing(true);
    try {
      const data = await fetchEvents();
      if (requestId !== latestRequest.current) return;
      hasData.current = true;
      setEvents(data);
      setState(data.length === 0 ? "empty" : "loaded");
      setErrorMessage(null);
      setLastUpdated(new Date());
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      // Only switch to the full error state if we have nothing to show.
      if (!hasData.current) setState("error");
    } finally {
      if (requestId === latestRequest.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const timer = setInterval(refreshIfVisible, intervalMs);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfVisible);
      latestRequest.current += 1; // ignore any response still in flight
    };
  }, [refresh, intervalMs]);

  return { events, state, errorMessage, lastUpdated, refreshing, refresh };
}
