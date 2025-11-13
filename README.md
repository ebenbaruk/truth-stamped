# Truth Stamped

> Cryptographic proof of content authenticity using blockchain technology

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

- **Simple CLI**: One command to stamp, one to verify
- **Cryptographically Secure**: SHA-256 hashing + Ed25519 signatures
- **Immutable**: Blockchain provides tamper-proof timestamps
- **Low Cost**: ~$0.001 per stamp on Base L2
- **Open Source**: MIT licensed, transparent, verifiable

## Quick Start

### Installation

```bash
npm install -g truth-stamped
```

### Initialize Your Wallet

```bash
truth-stamped init
```

### Stamp Content

```bash
truth-stamped stamp photo.jpg
```

### Verify Content

```bash
truth-stamped verify photo.jpg
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

- **Blockchain**: Base (Ethereum L2)
- **Smart Contract**: Solidity
- **CLI**: TypeScript/Node.js
- **Storage**: On-chain hashes, off-chain content

## Project Structure

```
truth-stamped/
├── contracts/          # Solidity smart contracts
├── cli/               # TypeScript CLI tool
├── test/              # Test suites
├── docs/              # Documentation
└── PRD.md             # Product requirements
```

## Development Status

🚧 **Currently in development** - MVP in progress

- [ ] Smart contract (Solidity)
- [ ] CLI tool (TypeScript)
- [ ] Tests and documentation
- [ ] Deployment to Base testnet
- [ ] Public release

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Roadmap

### Q1 2025: MVP Launch
- Smart contract on Base
- CLI tool with stamp/verify
- Documentation and examples

### Q2 2025: Ecosystem Growth
- Web verification interface
- Browser extension
- Multi-chain support

### Q3 2025: Advanced Features
- Trust networks
- Bulk operations API
- Hardware wallet support

## Security

- Private keys stored locally (encrypted)
- Industry-standard cryptography (SHA-256, Ed25519)
- Open source for transparency and auditing
- Regular security audits planned

## License

MIT License - see [LICENSE](LICENSE) for details

## Links

- **Documentation**: [docs/](docs/)
- **Smart Contract**: [contracts/](contracts/)
- **CLI Source**: [cli/](cli/)
- **PRD**: [PRD.md](PRD.md)

## Contact

- Issues: [GitHub Issues](https://github.com/ebenbaruk/truth-stamped/issues)
- Discussions: [GitHub Discussions](https://github.com/ebenbaruk/truth-stamped/discussions)

---

**Made with transparency, for authenticity**
