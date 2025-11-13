#!/usr/bin/env node

/**
 * Test stamping content using the deployer wallet
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const RPC_URL = 'https://sepolia.base.org';
const CONTRACT_ADDRESS = '0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84';
const PRIVATE_KEY = '0x1c67ebcfd02c1ac0a54b0b5d58f0eee7185c7c35f75fa58bf0fe0cf45234a0e0';

const ABI = [
  'function stampContent(bytes32 contentHash, bytes signature, string metadata)',
  'function verifyContent(bytes32 contentHash) view returns (bool exists, address creator, uint256 timestamp, string metadata)',
  'function totalStamps() view returns (uint256)',
];

async function main() {
  console.log('\n🖊️  Truth Stamped - Test Stamp Operation\n');

  // 1. Setup wallet and provider
  console.log('📝 Step 1: Setting up wallet...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('✅ Wallet ready');
  console.log('   Address:', wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log('   Balance:', ethers.formatEther(balance), 'ETH');

  // 2. Hash test file
  console.log('\n🔐 Step 2: Hashing test file...');
  const testFilePath = path.join(__dirname, '..', 'test-image.txt');
  const fileContent = fs.readFileSync(testFilePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileContent);
  const contentHash = '0x' + hash.digest('hex');
  console.log('✅ File hashed');
  console.log('   Hash:', contentHash);

  // 3. Check if already stamped
  console.log('\n🔍 Step 3: Checking if already stamped...');
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  const check = await contract.verifyContent(contentHash);

  if (check[0]) {
    console.log('⚠️  Content already stamped!');
    console.log('   Creator:', check[1]);
    console.log('   Timestamp:', new Date(Number(check[2]) * 1000).toLocaleString());
    console.log('   Metadata:', check[3]);
    console.log('\n✅ Verification successful - content is authentic!\n');
    return;
  }

  console.log('✅ Content not yet stamped - proceeding...');

  // 4. Sign the content hash
  console.log('\n✍️  Step 4: Signing content hash...');
  const messageBytes = ethers.getBytes(contentHash);
  const signature = await wallet.signMessage(messageBytes);
  console.log('✅ Signature created');
  console.log('   Signature:', signature.substring(0, 20) + '...');

  // 5. Stamp content on blockchain
  console.log('\n📤 Step 5: Stamping content on blockchain...');
  const metadata = 'filename:test-image.txt,tool:truth-stamped-cli,test:true';

  try {
    const tx = await contract.stampContent(contentHash, signature, metadata);
    console.log('✅ Transaction sent');
    console.log('   TX hash:', tx.hash);

    console.log('\n⏳ Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log('   Block:', receipt.blockNumber);
    console.log('   Gas used:', receipt.gasUsed.toString());

    // 6. Verify the stamp
    console.log('\n🔍 Step 6: Verifying the stamp...');
    const result = await contract.verifyContent(contentHash);
    console.log('✅ Stamp verified!');
    console.log('   Exists:', result[0]);
    console.log('   Creator:', result[1]);
    console.log('   Timestamp:', new Date(Number(result[2]) * 1000).toLocaleString());
    console.log('   Metadata:', result[3]);

    // 7. Check total stamps
    const totalStamps = await contract.totalStamps();
    console.log('\n📊 Total stamps on contract:', totalStamps.toString());

    console.log('\n✅ STAMP TEST SUCCESSFUL! 🎉');
    console.log('\n🔗 View on Basescan:');
    console.log('   https://sepolia.basescan.org/tx/' + tx.hash);
    console.log('   https://sepolia.basescan.org/address/' + CONTRACT_ADDRESS);
    console.log('');

  } catch (error) {
    console.error('\n❌ Error stamping content:', error.message);
    if (error.data) {
      console.error('   Error data:', error.data);
    }
  }
}

main().catch(console.error);
