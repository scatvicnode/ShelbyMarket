import { marketplaceClient } from '@/lib/marketplaceClient';
import type { ShelbyAccount } from '@/types';
import { Network } from '@aptos-labs/ts-sdk';
import {
  AptosWalletAdapterProvider,
  useWallet as useAptosWallet,
} from '@aptos-labs/wallet-adapter-react';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  account: ShelbyAccount | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  refreshAccount: () => void;
  wallets: readonly any[];
}

const WalletContext = createContext<WalletContextType | null>(null);

function WalletContextProvider({ children }: { children: ReactNode }) {
  const {
    connect: aptosConnect,
    disconnect: aptosDisconnect,
    account: aptosAccount,
    connected: aptosConnected,
    isLoading,
    wallets,
    signAndSubmitTransaction,
  } = useAptosWallet();

  const [account, setAccount] = useState<ShelbyAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (aptosConnected && aptosAccount?.address) {
      const addr = aptosAccount.address.toString();
      marketplaceClient.setSignAndSubmitTransaction(async (payload: any) => {
        const result = await signAndSubmitTransaction(payload);
        return { hash: result.hash };
      });
      marketplaceClient.setWallet(addr).then(() => {
        setAccount(marketplaceClient.getAccount());
        setError(null);
      });
      localStorage.setItem('shelbymarket_wallet', addr);
    } else {
      setAccount(null);
    }
  }, [aptosConnected, aptosAccount, signAndSubmitTransaction]);

  const connect = useCallback(() => {
    setError(null);
    const installed = wallets.filter((w: any) => w.readyState === 'Installed');
    if (installed.length === 0) {
      setError('No Aptos wallet found. Please install Petra Wallet.');
      window.open('https://petra.app/', '_blank');
      return;
    }
    try {
      aptosConnect(installed[0].name);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet.');
    }
  }, [wallets, aptosConnect]);

  const disconnect = useCallback(() => {
    try { aptosDisconnect(); } catch { /* ignore */ }
    setAccount(null);
    setError(null);
    localStorage.removeItem('shelbymarket_wallet');
  }, [aptosDisconnect]);

  const refreshAccount = useCallback(async () => {
    if (aptosAccount?.address) {
      await marketplaceClient.setWallet(aptosAccount.address.toString());
      setAccount(marketplaceClient.getAccount());
    }
  }, [aptosAccount]);

  return (
    <WalletContext.Provider value={{
      connected: aptosConnected,
      connecting: isLoading,
      address: aptosAccount?.address?.toString() || null,
      account,
      error,
      connect,
      disconnect,
      refreshAccount,
      wallets,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      autoConnect
      dappConfig={{ network: Network.SHELBYNET }}
      optInWallets={['Petra', 'Nightly', 'OKX Wallet']}
      onError={(e) => console.error('Wallet adapter error:', e)}
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </AptosWalletAdapterProvider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
