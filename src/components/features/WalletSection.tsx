'use client'

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';

interface WalletSectionProps {
  currentWalletAddress: string | null | undefined;
  userId: string;
  isOwnProfile: boolean;
}

export function WalletSection({ currentWalletAddress, userId, isOwnProfile }: WalletSectionProps) {
  const { address, isConnected } = useAccount();
  const [saving, setSaving] = useState(false);
  const [wallet, setWallet] = useState(currentWalletAddress);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address && wallet !== address) {
      setWallet(address);
    }
  }, [isConnected, address, wallet]);

  const handleSave = async () => {
    if (!wallet || !isOwnProfile) return;
    setSaving(true);
    try {
      const res = await fetch('/api/auth/sync-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId: userId, walletAddress: wallet }),
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch (e) {
      console.error('Failed to save wallet address:', e);
    }
    setSaving(false);
  };

  const displayAddress = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : null;

  return (
    <Card>
      <h3 className="text-sm font-bold uppercase mb-2">$THANK Wallet</h3>
      {wallet ? (
        <div className="flex items-center justify-between gap-2">
          <div>
            <a
              href={`https://amoy.polygonscan.com/address/${wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold underline underline-offset-2 hover:text-black/70"
            >
              {displayAddress}
            </a>
            {balance !== null && (
              <p className="text-[10px] font-bold text-black/50 mt-0.5">
                Balance: {balance} $THANK
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-[10px] font-bold text-black/50">
          {isOwnProfile
            ? 'Connect your wallet to receive $THANK rewards.'
            : 'No wallet connected.'}
        </p>
      )}
      {isOwnProfile && !isConnected && (
        <p className="text-[10px] font-bold text-black/50 mt-2">
          Use the <strong>Connect</strong> button in the header to link your wallet.
        </p>
      )}
    </Card>
  );
}
