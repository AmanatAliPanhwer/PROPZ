'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="text-[10px] font-bold uppercase border-2 border-black px-2 py-1 neo-shadow-sm hover:neo-shadow transition-all bg-white"
                    aria-label="Connect wallet"
                  >
                    Connect
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="text-[10px] font-bold uppercase border-2 border-red-500 px-2 py-1 neo-shadow-sm bg-red-100"
                    aria-label="Wrong network"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-1">
                  <button
                    onClick={openChainModal}
                    className="text-[10px] font-bold uppercase border-2 border-black px-1.5 py-1 neo-shadow-sm bg-white hover:neo-shadow transition-all"
                    aria-label="Switch chain"
                    title={chain.name}
                  >
                    {chain.name === 'Polygon Amoy' ? 'Amoy' : chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="text-[10px] font-bold uppercase border-2 border-black px-2 py-1 neo-shadow-sm bg-neo-yellow hover:neo-shadow transition-all"
                    aria-label="Account"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
