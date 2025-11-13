# Truth Stamped - Deployment Information

## 🚀 Deployed Contracts

### Base Sepolia (Testnet) ✅

- **Contract Address:** `0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84`
- **Deployer Address:** `0x5A9B097272a089df401D6dA8aCBb543e24bEeCF3`
- **Transaction Hash:** `0x98411f02d5e4b3bb2c0b23c98c6fc0b38211af1872f0088e157ce09b7fff758b`
- **Network:** Base Sepolia (Chain ID: 84532)
- **Block Explorer:** [View on Basescan](https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84)
- **Deployment Date:** November 13, 2025

**Contract Status:** ✅ Live and functional

### Base Mainnet (Production)

- **Status:** Not deployed yet
- **Planned:** TBD

## 📋 Usage

### Using the CLI

The CLI is pre-configured to use the deployed Sepolia contract:

```bash
cd cli

# Install dependencies
npm install

# Build the CLI
npm run build

# Initialize wallet
node dist/index.js init

# Stamp content (requires funded wallet)
node dist/index.js stamp ../test-image.txt

# Verify content
node dist/index.js verify ../test-image.txt
```

### Using Cast (Command Line)

Check total stamps:
```bash
cast call 0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84 \
  "totalStamps()(uint256)" \
  --rpc-url https://sepolia.base.org
```

Verify content:
```bash
cast call 0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84 \
  "verifyContent(bytes32)(bool,address,uint256,string)" \
  <CONTENT_HASH> \
  --rpc-url https://sepolia.base.org
```

### Using Web3 Libraries

#### JavaScript/TypeScript (ethers.js)

```typescript
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84';
const RPC_URL = 'https://sepolia.base.org';

const provider = new ethers.JsonRpcProvider(RPC_URL);

const ABI = [
  'function verifyContent(bytes32 contentHash) view returns (bool exists, address creator, uint256 timestamp, string metadata)',
  'function totalStamps() view returns (uint256)'
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Check total stamps
const total = await contract.totalStamps();
console.log('Total stamps:', total.toString());

// Verify content
const result = await contract.verifyContent(contentHash);
console.log('Exists:', result[0]);
console.log('Creator:', result[1]);
console.log('Timestamp:', new Date(Number(result[2]) * 1000));
```

## 🔐 Security Notes

- **Testnet Wallet:** The deployer wallet contains test ETH only
- **Private Key:** Stored securely, not committed to git
- **Contract:** Immutable once deployed, cannot be upgraded
- **Audits:** Not yet audited (testnet deployment)

## 💰 Gas Costs (Base Sepolia)

Approximate costs based on deployment:

- **Contract Deployment:** ~890,000 gas (~0.003 ETH)
- **Stamp Content:** ~100,000 gas (~$0.001 equivalent)
- **Verify Content:** Free (read-only)
- **List Stamps:** Free (read-only)

## 🧪 Testing

### Test the Contract

1. **Get testnet ETH:**
   - Visit https://www.alchemy.com/faucets/base-sepolia
   - Request ETH for your wallet

2. **Initialize CLI wallet:**
   ```bash
   cd cli
   node dist/index.js init
   ```

3. **Fund your CLI wallet:**
   - Copy the wallet address
   - Send testnet ETH from a faucet

4. **Stamp a test file:**
   ```bash
   node dist/index.js stamp ../test-image.txt
   ```

5. **Verify the file:**
   ```bash
   node dist/index.js verify ../test-image.txt
   ```

## 📊 Contract Functions

### Write Functions (Require ETH for Gas)

- `stampContent(bytes32 contentHash, bytes signature, string metadata)`
  - Stamps content on the blockchain
  - Emits `ContentStamped` event

### Read Functions (Free)

- `verifyContent(bytes32 contentHash)` → `(bool exists, address creator, uint256 timestamp, string metadata)`
- `getStamp(bytes32 contentHash)` → `ContentStamp struct`
- `getCreatorStamps(address creator)` → `bytes32[] hashes`
- `totalStamps()` → `uint256`
- `verifySignature(bytes32 contentHash, bytes signature, address signer)` → `bool`

## 🔄 Mainnet Deployment (Future)

When ready to deploy to mainnet:

1. **Security Audit:** Contract should be audited
2. **Testing:** Extensive testing on testnet
3. **Funding:** Real ETH required for deployment
4. **Deployment:**
   ```bash
   forge create ./src/TruthStamp.sol:TruthStamp \
     --rpc-url https://mainnet.base.org \
     --private-key $MAINNET_PRIVATE_KEY \
     --broadcast
   ```

## 📞 Support

- **GitHub Issues:** https://github.com/ebenbaruk/truth-stamped/issues
- **Documentation:** See README.md and PRD.md
- **Block Explorer:** https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84

---

**Last Updated:** November 13, 2025
