#!/usr/bin/env node

/**
 * Automated test workflow for Truth Stamped CLI
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const RPC_URL = 'https://sepolia.base.org';
const CONTRACT_ADDRESS = '0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84';

const ABI = [
  'function verifyContent(bytes32 contentHash) view returns (bool exists, address creator, uint256 timestamp, string metadata)',
  'function totalStamps() view returns (uint256)',
  'function stampContent(bytes32 contentHash, bytes signature, string metadata)',
];

async function main() {
  console.log('\n🧪 Truth Stamped - Test Workflow\n');

  // 1. Create a test wallet
  console.log('📝 Step 1: Creating test wallet...');
  const wallet = ethers.Wallet.createRandom();
  console.log('✅ Wallet created');
  console.log('   Address:', wallet.address);
  console.log('   Private Key:', wallet.privateKey);

  // 2. Connect to Base Sepolia
  console.log('\n🌐 Step 2: Connecting to Base Sepolia...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = wallet.connect(provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  console.log('✅ Connected to Base Sepolia');
  console.log('   Contract:', CONTRACT_ADDRESS);

  // 3. Check total stamps
  console.log('\n📊 Step 3: Checking total stamps...');
  const totalStamps = await contract.totalStamps();
  console.log('✅ Total stamps on contract:', totalStamps.toString());

  // 4. Hash test file
  console.log('\n🔐 Step 4: Hashing test file...');
  const testFilePath = path.join(__dirname, '..', 'test-image.txt');

  if (!fs.existsSync(testFilePath)) {
    console.log('❌ Test file not found:', testFilePath);
    return;
  }

  const fileContent = fs.readFileSync(testFilePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileContent);
  const contentHash = '0x' + hash.digest('hex');
  console.log('✅ File hashed');
  console.log('   Content hash:', contentHash);

  // 5. Check if content is already stamped
  console.log('\n🔍 Step 5: Checking if content exists...');
  const result = await contract.verifyContent(contentHash);
  console.log('✅ Verification complete');
  console.log('   Exists:', result[0]);
  console.log('   Creator:', result[1]);
  console.log('   Timestamp:', result[2].toString());
  console.log('   Metadata:', result[3]);

  if (result[0]) {
    const date = new Date(Number(result[2]) * 1000);
    console.log('\n✅ Content is already stamped!');
    console.log('   Stamped on:', date.toLocaleString());
    console.log('   By:', result[1]);
  } else {
    console.log('\n⚠️  Content not yet stamped');
    console.log('\n📝 To stamp this content:');
    console.log('   1. Fund this wallet with testnet ETH:');
    console.log('      Address:', wallet.address);
    console.log('   2. Run the stamp command:');
    console.log('      node dist/index.js stamp ../test-image.txt');
  }

  // 6. Check balance
  console.log('\n💰 Step 6: Checking wallet balance...');
  const balance = await provider.getBalance(wallet.address);
  console.log('✅ Balance:', ethers.formatEther(balance), 'ETH');

  console.log('\n✅ Test workflow completed!\n');

  // Show next steps
  console.log('📋 Next Steps:');
  console.log('   1. Initialize your own CLI wallet:');
  console.log('      node dist/index.js init');
  console.log('   2. Get testnet ETH from:');
  console.log('      https://www.alchemy.com/faucets/base-sepolia');
  console.log('   3. Stamp content:');
  console.log('      node dist/index.js stamp ../test-image.txt');
  console.log('   4. Verify content:');
  console.log('      node dist/index.js verify ../test-image.txt');
  console.log('   5. List your stamps:');
  console.log('      node dist/index.js list\n');
}

main().catch(console.error);
