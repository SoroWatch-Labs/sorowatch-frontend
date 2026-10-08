import type { FlagEvent } from "./api";

export type RiskLevel = "high" | "medium" | "low" | "unknown";
export type LevelFilter = "all" | RiskLevel;

export const HIGH_RISK_MIN = 80;
export const MEDIUM_RISK_MIN = 50;

/**
 * Buckets an event by its risk score (the event `value`).
 * 80+ is high, 50-79 is medium, below 50 is low. A missing or
 * non-numeric value is "unknown" so it is never hidden as low risk.
 */
export function riskLevel(event: FlagEvent): RiskLevel {
  if (event.value === undefined || event.value === null) return "unknown";
  const text = String(event.value).trim();
  if (text === "") return "unknown";
  const score = Number(text);
  if (!Number.isFinite(score)) return "unknown";
  if (score >= HIGH_RISK_MIN) return "high";
  if (score >= MEDIUM_RISK_MIN) return "medium";
  return "low";
}

/**
 * Keeps events whose contract ID or topics contain `query`
 * (case-insensitive, surrounding spaces ignored) and whose risk level
 * matches `level`. An empty query and level "all" returns every event.
 */
export function filterEvents(
  events: FlagEvent[],
  query: string,
  level: LevelFilter,
): FlagEvent[] {
  const needle = query.trim().toLowerCase();
  return events.filter((event) => {
    if (level !== "all" && riskLevel(event) !== level) return false;
    if (needle === "") return true;
    const haystack = [event.contractId ?? "", ...(event.topic ?? [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
