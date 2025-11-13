import { ethers } from 'ethers';
import * as fs from 'fs';
import { CONFIG_DIR, WALLET_FILE } from '../config';

/**
 * Create a new wallet
 */
export function createWallet(): ethers.HDNodeWallet {
  return ethers.Wallet.createRandom();
}

/**
 * Load wallet from encrypted file
 */
export async function loadWallet(password: string): Promise<ethers.HDNodeWallet | ethers.Wallet> {
  if (!fs.existsSync(WALLET_FILE)) {
    throw new Error('Wallet file not found. Run "truth-stamped init" first.');
  }

  const encryptedJson = fs.readFileSync(WALLET_FILE, 'utf8');
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  return wallet;
}

/**
 * Save wallet to encrypted file
 */
export async function saveWallet(
  wallet: ethers.HDNodeWallet | ethers.Wallet,
  password: string
): Promise<void> {
  // Ensure config directory exists
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Encrypt and save wallet
  const encryptedJson = await wallet.encrypt(password);
  fs.writeFileSync(WALLET_FILE, encryptedJson, { mode: 0o600 });
}

/**
 * Import wallet from private key
 */
export function importWallet(privateKey: string): ethers.Wallet {
  // Add 0x prefix if not present
  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }

  return new ethers.Wallet(privateKey);
}

/**
 * Check if wallet exists
 */
export function walletExists(): boolean {
  return fs.existsSync(WALLET_FILE);
}

/**
 * Get wallet address without loading private key
 */
export async function getWalletAddress(password: string): Promise<string> {
  const wallet = await loadWallet(password);
  return wallet.address;
}
