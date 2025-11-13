import { Config } from './types';
import * as path from 'path';
import * as os from 'os';

export const NETWORKS = {
  mainnet: {
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    name: 'Base Mainnet',
  },
  sepolia: {
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    name: 'Base Sepolia',
  },
} as const;

export function getConfig(network: 'mainnet' | 'sepolia' = 'sepolia'): Config {
  const homeDir = os.homedir();
  const walletPath = path.join(homeDir, '.truth-stamped', 'wallet.json');

  // Contract addresses (will be updated after deployment)
  const contractAddresses = {
    mainnet: process.env.TRUTH_STAMP_CONTRACT_MAINNET || '',
    sepolia: process.env.TRUTH_STAMP_CONTRACT_SEPOLIA || '',
  };

  return {
    rpcUrl: NETWORKS[network].rpcUrl,
    contractAddress: contractAddresses[network],
    walletPath,
    network,
  };
}

export const CONFIG_DIR = path.join(os.homedir(), '.truth-stamped');
export const WALLET_FILE = path.join(CONFIG_DIR, 'wallet.json');
