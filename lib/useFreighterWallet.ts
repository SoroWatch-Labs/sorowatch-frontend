"use client";

import { useState, useCallback } from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";

interface WalletState {
  address: string | null;
  connecting: boolean;
  error: string | null;
}

export function useFreighterWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    connecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const connected = await isConnected();
      if (!connected.isConnected) {
        setState({
          address: null,
          connecting: false,
          error: "Freighter extension not detected. Install it from freighter.app.",
        });
        return;
      }

      const access = await requestAccess();
      if (access.error) {
        setState({ address: null, connecting: false, error: access.error });
        return;
      }

      const result = await getAddress();
      if (result.error) {
        setState({ address: null, connecting: false, error: result.error });
        return;
      }

      setState({ address: result.address, connecting: false, error: null });
    } catch (err) {
      setState({
        address: null,
        connecting: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet",
      });
    }
  }, []);

  return { ...state, connect };
}
