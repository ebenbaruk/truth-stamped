export interface WalletConfig {
  privateKey: string;
  address: string;
}

export interface Config {
  rpcUrl: string;
  contractAddress: string;
  walletPath: string;
  network: 'mainnet' | 'sepolia';
}

export interface ContentStamp {
  contentHash: string;
  creator: string;
  timestamp: number;
  metadata: string;
  exists: boolean;
}

export interface StampOptions {
  file: string;
  metadata?: string;
  network?: 'mainnet' | 'sepolia';
}

export interface VerifyOptions {
  file?: string;
  hash?: string;
  network?: 'mainnet' | 'sepolia';
}
