import { ethers } from 'ethers';
import { ContentStamp } from '../types';

// TruthStamp contract ABI (only the functions we need)
const TRUTH_STAMP_ABI = [
  'function stampContent(bytes32 contentHash, bytes signature, string metadata)',
  'function verifyContent(bytes32 contentHash) view returns (bool exists, address creator, uint256 timestamp, string metadata)',
  'function getStamp(bytes32 contentHash) view returns (tuple(bytes32 contentHash, address creator, uint256 timestamp, bytes signature, string metadata, bool exists))',
  'function getCreatorStamps(address creator) view returns (bytes32[])',
  'function totalStamps() view returns (uint256)',
  'event ContentStamped(bytes32 indexed contentHash, address indexed creator, uint256 timestamp, string metadata)',
];

/**
 * Get Truth Stamp contract instance
 */
export function getContract(
  contractAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  return new ethers.Contract(contractAddress, TRUTH_STAMP_ABI, signerOrProvider);
}

/**
 * Stamp content on blockchain
 */
export async function stampContent(
  contract: ethers.Contract,
  contentHash: string,
  signature: string,
  metadata: string
): Promise<ethers.ContractTransactionResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx = (await (contract as any).stampContent(contentHash, signature, metadata)) as ethers.ContractTransactionResponse;
  return tx;
}

/**
 * Verify content on blockchain
 */
export async function verifyContent(
  contract: ethers.Contract,
  contentHash: string
): Promise<ContentStamp> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (await (contract as any).verifyContent(contentHash)) as [boolean, string, bigint, string];

  return {
    contentHash,
    exists: result[0],
    creator: result[1],
    timestamp: Number(result[2]),
    metadata: result[3],
  };
}

/**
 * Get all stamps by creator
 */
export async function getCreatorStamps(
  contract: ethers.Contract,
  creatorAddress: string
): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hashes = (await (contract as any).getCreatorStamps(creatorAddress)) as string[];
  return hashes;
}

/**
 * Sign content hash
 */
export async function signContentHash(
  wallet: ethers.HDNodeWallet | ethers.Wallet,
  contentHash: string
): Promise<string> {
  // Sign the content hash using eth_sign format
  const messageBytes = ethers.getBytes(contentHash);
  const signature = await wallet.signMessage(messageBytes);
  return signature;
}

/**
 * Get provider
 */
export function getProvider(rpcUrl: string): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get signer
 */
export function getSigner(
  wallet: ethers.HDNodeWallet | ethers.Wallet,
  provider: ethers.Provider
): ethers.HDNodeWallet | ethers.Wallet {
  return wallet.connect(provider);
}
