# Truth Stamped

> Cryptographic proof of content authenticity using blockchain technology

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Sepolia](https://img.shields.io/badge/Base-Sepolia-blue)](https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://github.com/ebenbaruk/truth-stamped)

## 🚀 Live on Base Sepolia Testnet

**Contract Address:** [`0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84`](https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84)

---

## Overview

**Truth Stamped** is an open-source solution for combating AI deepfakes and synthetic content. Instead of trying to detect fake content, we enable creators to prove authenticity through immutable blockchain timestamps and cryptographic signatures.

## The Problem

- AI-generated deepfakes are indistinguishable from authentic content
- Detection systems are in an endless arms race with generators
- Watermarks can be stripped or manipulated
- No universal way to verify content origin

## The Solution

**Shift from "detect bad" to "verify good"**

1. Content creators hash their authentic content at creation
2. Hash is signed and timestamped on blockchain (Base)
3. Anyone can verify authenticity by checking the blockchain
4. Unsigned content defaults to "unverified"

## Features

- ✅ **Simple CLI**: One command to stamp, one to verify
- ✅ **Cryptographically Secure**: SHA-256 hashing + ECDSA signatures
- ✅ **Immutable**: Blockchain provides tamper-proof timestamps
- ✅ **Low Cost**: ~$0.001 per stamp on Base L2
- ✅ **Open Source**: MIT licensed, transparent, verifiable
- ✅ **Live on Testnet**: Deployed and functional on Base Sepolia

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Testnet ETH on Base Sepolia ([Get from faucet](https://www.alchemy.com/faucets/base-sepolia))

### Installation

```bash
# Clone the repository
git clone https://github.com/ebenbaruk/truth-stamped.git
cd truth-stamped/cli

# Install dependencies
npm install

# Build the CLI
npm run build
```

### Initialize Your Wallet

```bash
node dist/index.js init
```

### Stamp Content

```bash
node dist/index.js stamp photo.jpg
```

### Verify Content

```bash
node dist/index.js verify photo.jpg
```

### List Your Stamps

```bash
node dist/index.js list
```

## How It Works

```
┌─────────────┐
│   Creator   │
└──────┬──────┘
       │ 1. Capture content
       │ 2. Generate SHA-256 hash
       │ 3. Sign with private key
       ▼
┌─────────────────┐
│   CLI Tool      │
└──────┬──────────┘
       │ 4. Submit to Base blockchain
       ▼
┌─────────────────┐
│  Smart Contract │
│  Base Sepolia   │
│                 │
│  Stores:        │
│  - Content hash │
│  - Creator      │
│  - Timestamp    │
│  - Signature    │
└─────────────────┘
       ▲
       │ 5. Anyone can verify
       │
┌──────┴──────┐
│  Verifier   │
└─────────────┘
```

## Use Cases

- **Journalists**: Prove authenticity of field photography
- **Content Creators**: Protect original work from AI impersonation
- **News Organizations**: Verify authenticity of submitted content
- **General Public**: Check if viral content is authentic

## Architecture

- **Blockchain**: Base Sepolia (Testnet) / Base (Mainnet ready)
- **Smart Contract**: Solidity 0.8.20
- **CLI**: TypeScript/Node.js 18+
- **Storage**: On-chain hashes, off-chain content
- **Cost**: ~$0.001 per stamp

## Project Structure

```
truth-stamped/
├── smart-contract/         # Solidity smart contracts
│   ├── src/               # Contract source
│   ├── test/              # Test suite (12 tests)
│   └── script/            # Deployment scripts
├── cli/                   # TypeScript CLI tool
│   ├── src/               # CLI source code
│   │   ├── commands/      # CLI commands
│   │   └── utils/         # Utilities
│   └── test-*.js          # Test scripts
├── DEPLOYMENT.md          # Deployment information
├── CONTRIBUTING.md        # Contribution guide
└── README.md             # This file
```

## Deployment Status

### ✅ Base Sepolia (Testnet)

- **Status:** Live and functional
- **Contract:** [`0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84`](https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84)
- **Network:** Base Sepolia (Chain ID: 84532)
- **Deployer:** `0x5A9B097272a089df401D6dA8aCBb543e24bEeCF3`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment information.

### 🔜 Base Mainnet (Production)

- **Status:** Planned after security audit
- **Contract:** Not deployed yet

## Development Status

✅ **Production Ready on Base Sepolia Testnet**

- ✅ Smart contract deployed and verified
- ✅ CLI tool fully functional
- ✅ All tests passing (12/12)
- ✅ End-to-end workflow tested
- ✅ Documentation complete
- ✅ Open source released

## Testing

Run the complete test workflow:

```bash
cd cli
node test-workflow.js    # Test contract interaction
node test-stamp.js       # Test stamping operation
```

Or test individual CLI commands:

```bash
# Verify a file
node dist/index.js verify ../test-image.txt

# List stamps by address
node dist/index.js list --address 0x5A9B097272a089df401D6dA8aCBb543e24bEeCF3
```

## CLI Commands

### `init`
Initialize wallet for Truth Stamped
```bash
node dist/index.js init [--import]
```

### `stamp`
Stamp content on the blockchain
```bash
node dist/index.js stamp <file> [--metadata <text>] [--network <mainnet|sepolia>]
```

### `verify`
Verify content on the blockchain
```bash
node dist/index.js verify <file>
node dist/index.js verify --hash <hash>
```

### `list`
List all stamps by your wallet
```bash
node dist/index.js list [--address <addr>] [--network <mainnet|sepolia>]
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**Areas for contribution:**
- Web interface for verification
- Browser extension
- Mobile app
- Additional blockchain support
- Documentation improvements

## Roadmap

### ✅ Q4 2024: MVP Complete
- ✅ Smart contract on Base Sepolia
- ✅ CLI tool with all core features
- ✅ Documentation and examples
- ✅ Production ready on testnet

### 🔜 Q1 2025: Production Launch
- [ ] Security audit
- [ ] Deploy to Base mainnet
- [ ] NPM package publication
- [ ] Web verification interface

### 🔜 Q2 2025: Ecosystem Growth
- [ ] Browser extension
- [ ] Mobile SDK
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Integration guides

### 🔜 Q3 2025: Advanced Features
- [ ] Trust networks and reputation
- [ ] Bulk operations API
- [ ] Hardware wallet support
- [ ] Camera/device integration

## Security

- ✅ Private keys stored locally (encrypted)
- ✅ Industry-standard cryptography (SHA-256, ECDSA)
- ✅ Open source for transparency and auditing
- 🔜 Professional security audit planned

**Security Considerations:**
- Never share your private key
- Always verify contract addresses
- Test on Sepolia before mainnet
- Keep your wallet password secure

## Cost

**Base Sepolia (Testnet):**
- Contract deployment: ~0.003 ETH (free testnet ETH)
- Stamp content: ~$0.001 equivalent
- Verify content: Free (read-only)

**Base Mainnet (Production):**
- Expected: ~$0.001 per stamp
- Verification: Always free

## License

MIT License - see [LICENSE](LICENSE) for details

## Links

- **Live Contract**: [View on Basescan](https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84)
- **Deployment Info**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Smart Contract**: [smart-contract/](smart-contract/)
- **CLI Source**: [cli/](cli/)
- **Issues**: [GitHub Issues](https://github.com/ebenbaruk/truth-stamped/issues)

## Support

Need help? Have questions?

- 📖 Read the [documentation](DEPLOYMENT.md)
- 🐛 Report bugs via [GitHub Issues](https://github.com/ebenbaruk/truth-stamped/issues)
- 💬 Start a [Discussion](https://github.com/ebenbaruk/truth-stamped/discussions)
- 🔗 View the [live contract](https://sepolia.basescan.org/address/0x5B77EC60D5a81c07E3601f5d268e86de6CD24d84)

## Get Testnet ETH

To use Truth Stamped on Base Sepolia, get free testnet ETH:

- [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- [Coinbase Faucet](https://portal.cdp.coinbase.com/products/faucet)
- [QuickNode Faucet](https://faucet.quicknode.com/base/sepolia)

---

**Made with transparency, for authenticity** 🔐

Built on [Base](https://base.org) - Bringing the next billion users onchain
