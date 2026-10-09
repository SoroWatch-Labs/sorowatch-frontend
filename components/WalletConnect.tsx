"use client";

import { useFreighterWallet } from "@/lib/useFreighterWallet";

export function WalletConnect() {
  const { address, connecting, error, connect } = useFreighterWallet();

  if (address) {
    return (
      <span role="status">
        Connected: {address.slice(0, 4)}...{address.slice(-4)}
      </span>
    );
  }

  return (
    <div>
      <button onClick={connect} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Freighter Wallet"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
