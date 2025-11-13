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

  // Contract addresses from environment variables
  const contractAddresses = {
    mainnet: process.env.TRUTH_STAMP_CONTRACT_MAINNET || '',
    sepolia: process.env.TRUTH_STAMP_CONTRACT_SEPOLIA || '0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84',
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
