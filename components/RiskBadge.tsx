import { riskLevel } from "@/lib/filterEvents";
import type { FlagEvent } from "@/lib/api";

const LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
  unknown: "Unknown",
} as const;

/** Shows the event's risk level as text, so it never relies on color alone. */
export function RiskBadge({ event }: { event: FlagEvent }) {
  const level = riskLevel(event);
  return (
    <span className={`risk-badge risk-badge--${level}`}>{LABELS[level]}</span>
  );
}
