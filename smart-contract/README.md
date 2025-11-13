# Truth Stamped Smart Contract

Solidity smart contract for the Truth Stamped protocol on Base blockchain.

## Overview

The `TruthStamp` contract provides immutable, on-chain proof of content authenticity through cryptographic hashing and signatures.

### Key Features

- **Stamp Content**: Store SHA-256 hash of content with creator signature on-chain
- **Verify Content**: Check if content has been stamped and retrieve metadata
- **Creator Tracking**: Query all stamps by a specific creator
- **Gas Optimized**: Minimal on-chain storage, only hashes and signatures

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Installation

```bash
# Install dependencies
forge install
```

## Build

```bash
forge build
```

## Test

Run all tests:
```bash
forge test
```

Run tests with gas report:
```bash
forge test --gas-report
```

Run tests with detailed output:
```bash
forge test -vvv
```

## Contract API

### Main Functions

#### `stampContent(bytes32 contentHash, bytes signature, string metadata)`
Stamp content on the blockchain.

**Parameters:**
- `contentHash`: SHA-256 hash of the content
- `signature`: Creator's signature of the content hash
- `metadata`: Optional metadata (IPFS CID, filename, etc.)

**Requirements:**
- Content hash must not be zero
- Content must not already be stamped
- Signature must be valid for the sender

#### `verifyContent(bytes32 contentHash)`
Verify if content has been stamped.

**Returns:**
- `exists`: Whether the content has been stamped
- `creator`: Address of the creator who stamped it
- `timestamp`: When the content was stamped
- `metadata`: Associated metadata

#### `getStamp(bytes32 contentHash)`
Get detailed information about a stamped content.

**Returns:**
- Complete `ContentStamp` struct

#### `getCreatorStamps(address creator)`
Get all content hashes stamped by a specific creator.

**Returns:**
- Array of content hashes

### Events

#### `ContentStamped`
```solidity
event ContentStamped(
    bytes32 indexed contentHash,
    address indexed creator,
    uint256 timestamp,
    string metadata
)
```

Emitted when content is stamped.

## Deployment

### 1. Set up environment

Create a `.env` file (see `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `BASE_SEPOLIA_RPC_URL`: RPC URL for Base Sepolia testnet
- `BASE_RPC_URL`: RPC URL for Base mainnet

### 2. Set up wallet

Store your private key in Foundry's secure keystore:

```bash
cast wallet import deployer --interactive
```

Enter your private key when prompted.

### 3. Deploy to Base Sepolia (Testnet)

```bash
source .env
forge create ./src/TruthStamp.sol:TruthStamp \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer
```

### 4. Deploy to Base (Mainnet)

```bash
source .env
forge create ./src/TruthStamp.sol:TruthStamp \
  --rpc-url $BASE_RPC_URL \
  --account deployer
```

### 5. Verify contract on Basescan

```bash
forge verify-contract \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --etherscan-api-key $BASESCAN_API_KEY \
  <CONTRACT_ADDRESS> \
  src/TruthStamp.sol:TruthStamp
```

## Usage Example

Using `cast` to interact with the deployed contract:

```bash
# Set contract address
export CONTRACT_ADDRESS="0x..."

# Verify content (read-only)
cast call $CONTRACT_ADDRESS \
  "verifyContent(bytes32)(bool,address,uint256,string)" \
  <CONTENT_HASH> \
  --rpc-url $BASE_SEPOLIA_RPC_URL

# Stamp content (requires wallet)
cast send $CONTRACT_ADDRESS \
  "stampContent(bytes32,bytes,string)" \
  <CONTENT_HASH> \
  <SIGNATURE> \
  <METADATA> \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer
```

## Security Considerations

- Private keys are stored in `~/.foundry/keystores` (encrypted)
- Never share or commit private keys
- Always test on testnet before mainnet deployment
- Contract uses standard Ethereum signature verification (EIP-191)

## Contract Structure

```
smart-contract/
├── src/
│   └── TruthStamp.sol          # Main contract
├── test/
│   └── TruthStamp.t.sol        # Test suite
├── script/
│   └── Deploy.s.sol            # Deployment script
├── foundry.toml                # Foundry configuration
└── .env.example                # Environment template
```

## Gas Costs

Approximate gas costs on Base:

- `stampContent`: ~100,000 gas (~$0.001)
- `verifyContent`: Free (read-only)
- `getCreatorStamps`: Free (read-only)

## License

MIT
