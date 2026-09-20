export interface FlagEvent {
  contractId?: string;
  topic?: string[];
  value?: string;
  [key: string]: unknown;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function fetchEvents(startLedger = 1): Promise<FlagEvent[]> {
  const res = await fetch(`${BACKEND_URL}/events?start_ledger=${startLedger}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Backend returned ${res.status}`);
  }
  const data = await res.json();
  return data.events ?? [];
}
