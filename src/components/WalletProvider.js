import React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, baseGoerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import '@rainbow-me/rainbowkit/styles.css';

// Configuração das chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base, baseGoerli],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === base.id) {
          return { http: 'https://mainnet.base.org' };
        }
        if (chain.id === baseGoerli.id) {
          return { http: 'https://goerli.base.org' };
        }
        return null;
      },
    }),
    publicProvider(),
  ]
);

// Configuração das wallets
const { wallets } = getDefaultWallets({
  appName: 'Super Dapp Base',
  projectId: 'your-project-id', // Substitua pelo seu project ID do WalletConnect
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

// Configuração do Wagmi
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const WalletProvider = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        theme={{
          blurs: {
            modalOverlay: 'small',
          },
          colors: {
            accentColor: '#1B365D',
            accentColorForeground: 'white',
            actionButtonBorder: '#1B365D',
            actionButtonBorderMobile: '#1B365D',
            actionButtonSecondaryBackground: '#F8F9FA',
            closeButton: '#1B365D',
            closeButtonBackground: '#F8F9FA',
            connectButtonBackground: '#1B365D',
            connectButtonBackgroundError: '#FF6B6B',
            connectButtonInnerBackground: '#1B365D',
            connectButtonText: 'white',
            connectButtonTextError: 'white',
            connectionIndicator: '#00D4AA',
            downloadBottomCardBackground: '#F8F9FA',
            downloadTopCardBackground: '#F8F9FA',
            error: '#FF6B6B',
            generalBorder: '#E9ECEF',
            generalBorderDim: '#E9ECEF',
            menuItemBackground: '#F8F9FA',
            modalBackdrop: 'rgba(0, 0, 0, 0.5)',
            modalBackground: 'white',
            modalBorder: '#E9ECEF',
            modalText: '#1B365D',
            modalTextDim: '#6C757D',
            modalTextSecondary: '#6C757D',
            profileAction: '#F8F9FA',
            profileActionHover: '#E9ECEF',
            profileForeground: 'white',
            selectedOptionBorder: '#1B365D',
            standby: '#FFD93D',
          },
          fonts: {
            body: 'Inter, system-ui, sans-serif',
          },
          radii: {
            actionButton: '8px',
            connectButton: '8px',
            menuButton: '8px',
            modal: '12px',
            modalMobile: '12px',
          },
          shadows: {
            connectButton: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            dialog: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            profileDetailsAction: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            selectedOption: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            selectedWallet: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            walletLogo: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WalletProvider;
