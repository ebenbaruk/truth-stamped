# Truth Stamped CLI

Command-line tool for stamping and verifying content authenticity on the blockchain.

## Installation

### From NPM (Future)
```bash
npm install -g truth-stamped
```

### From Source

```bash
# Clone the repository
git clone https://github.com/ebenbaruk/truth-stamped.git
cd truth-stamped/cli

# Install dependencies
npm install

# Build the CLI
npm run build

# Link globally (optional)
npm link
```

## Prerequisites

- Node.js >= 18.0.0
- Wallet with ETH on Base network (for stamping)

## Quick Start

### 1. Initialize Your Wallet

```bash
truth-stamped init
```

This will:
- Generate a new wallet (or import an existing one with `--import` flag)
- Encrypt and store it locally at `~/.truth-stamped/wallet.json`
- Display your wallet address and mnemonic phrase

**Important**: Save your mnemonic phrase in a safe place!

### 2. Fund Your Wallet

Get some ETH on Base Sepolia testnet:
- Visit a [Base Sepolia faucet](https://www.alchemy.com/faucets/base-sepolia)
- Send testnet ETH to your wallet address

### 3. Stamp Content

```bash
truth-stamped stamp photo.jpg
```

Or with custom metadata:

```bash
truth-stamped stamp photo.jpg --metadata "Original photo from event X"
```

### 4. Verify Content

```bash
truth-stamped verify photo.jpg
```

Or verify by hash:

```bash
truth-stamped verify --hash 0xabc123...
```

### 5. List Your Stamps

```bash
truth-stamped list
```

## Commands

### `init`

Initialize wallet for Truth Stamped.

```bash
truth-stamped init [options]
```

**Options:**
- `-i, --import` - Import existing wallet from private key

**Examples:**
```bash
# Create new wallet
truth-stamped init

# Import existing wallet
truth-stamped init --import
```

### `stamp`

Stamp content on the blockchain.

```bash
truth-stamped stamp <file> [options]
```

**Arguments:**
- `<file>` - Path to file to stamp

**Options:**
- `-m, --metadata <metadata>` - Optional metadata to store
- `-n, --network <network>` - Network to use (mainnet or sepolia, default: sepolia)

**Examples:**
```bash
# Stamp a file
truth-stamped stamp document.pdf

# Stamp with metadata
truth-stamped stamp photo.jpg --metadata "Original photo, NYC 2025"

# Stamp on mainnet
truth-stamped stamp video.mp4 --network mainnet
```

### `verify`

Verify content on the blockchain.

```bash
truth-stamped verify [file] [options]
```

**Arguments:**
- `[file]` - Path to file to verify (optional if using --hash)

**Options:**
- `-h, --hash <hash>` - Content hash to verify (instead of file)
- `-n, --network <network>` - Network to use (mainnet or sepolia, default: sepolia)

**Examples:**
```bash
# Verify a file
truth-stamped verify photo.jpg

# Verify by hash
truth-stamped verify --hash 0x1234...

# Verify on mainnet
truth-stamped verify document.pdf --network mainnet
```

### `list`

List all stamps by your wallet or a specific address.

```bash
truth-stamped list [options]
```

**Options:**
- `-n, --network <network>` - Network to use (mainnet or sepolia, default: sepolia)
- `-a, --address <address>` - Address to list stamps for (instead of wallet)

**Examples:**
```bash
# List your stamps
truth-stamped list

# List stamps by address
truth-stamped list --address 0xabc123...

# List on mainnet
truth-stamped list --network mainnet
```

## Configuration

### Networks

Truth Stamped supports two networks:

- **Base Sepolia** (testnet) - Default, free to use
  - RPC: `https://sepolia.base.org`
  - Chain ID: 84532

- **Base Mainnet** (production)
  - RPC: `https://mainnet.base.org`
  - Chain ID: 8453

### Contract Addresses

Set contract addresses via environment variables:

```bash
export TRUTH_STAMP_CONTRACT_SEPOLIA="0x..."
export TRUTH_STAMP_CONTRACT_MAINNET="0x..."
```

### Wallet Storage

Your encrypted wallet is stored at:
- `~/.truth-stamped/wallet.json`

This file is encrypted with your password and contains your private key. **Never share this file or your password.**

## Security

- Your wallet is encrypted and stored locally
- Private keys never leave your machine
- Always verify the contract address before stamping
- Use testnet (sepolia) for testing
- Keep your mnemonic phrase safe and offline

## Troubleshooting

### "Wallet file not found"

Run `truth-stamped init` to create a wallet first.

### "Insufficient funds"

Make sure your wallet has enough ETH on the selected network:
- For testnet: Use a faucet to get free testnet ETH
- For mainnet: Transfer ETH to your wallet

### "Contract address not configured"

Set the contract address environment variable for your network:
```bash
export TRUTH_STAMP_CONTRACT_SEPOLIA="0x..."
```

### "Transaction failed"

Check:
- You have enough ETH for gas fees
- The network is not congested
- The content hasn't already been stamped

## Development

### Build

```bash
npm run build
```

### Run in Development

```bash
npm run dev -- <command>
```

Example:
```bash
npm run dev -- stamp test.jpg
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/ebenbaruk/truth-stamped)
- [Smart Contract](../smart-contract/)
- [Documentation](../PRD.md)
