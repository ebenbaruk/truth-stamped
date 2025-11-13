# Truth Stamped - Product Requirements Document

## Executive Summary

**Truth Stamped** is an open-source blockchain-based solution for combating AI deepfakes and synthetic content by providing cryptographic proof of content authenticity. Instead of attempting to detect fake content, we enable creators to prove authenticity through immutable blockchain timestamps and cryptographic signatures.

## Problem Statement

### The Crisis
- AI-generated deepfakes are increasingly indistinguishable from authentic content
- Detection systems are in a perpetual arms race with generators
- Watermarks can be stripped or manipulated
- There is no universal, trustworthy way to verify content origin

### Impact
- Erosion of trust in media and journalism
- Spread of misinformation
- Inability to verify authentic documentation
- Damage to individuals through deepfake impersonation

## Solution

### Core Concept
**Cryptographic proof of origin with blockchain immutability**

1. Content creators hash their authentic content at the moment of creation
2. Hash is signed with the creator's private key and timestamped on blockchain
3. Anyone can verify authenticity by checking the blockchain record
4. Unsigned content defaults to "unverified" status

### Key Insight
**Shift from "detect bad" to "verify good"**

Instead of trying to identify fakes, we make it trivial to prove authenticity. Over time, unverified content becomes inherently suspicious.

## Technical Architecture

### Blockchain Choice: Base
- **Why Base**: Low transaction costs (~$0.001), Ethereum compatibility, Coinbase backing for legitimacy
- **Alternative**: Can migrate to Polygon or Ethereum with same codebase
- **Rationale**: EVM compatibility gives us mature tooling and easy developer onboarding

### System Components

```
┌─────────────┐
│   Creator   │
└──────┬──────┘
       │ 1. Capture content
       │ 2. Generate hash (SHA-256)
       │ 3. Sign with private key
       ▼
┌─────────────────┐
│   CLI Tool      │
│  (TypeScript)   │
└──────┬──────────┘
       │ 4. Submit to blockchain
       ▼
┌─────────────────┐
│  Smart Contract │
│  (Base/Solidity)│
│                 │
│  Stores:        │
│  - Content hash │
│  - Creator addr │
│  - Timestamp    │
│  - Signature    │
└─────────────────┘
       ▲
       │ 5. Query for verification
       │
┌──────┴──────┐
│  Verifier   │
│  (Anyone)   │
└─────────────┘
```

## MVP Features

### Phase 1: Core Functionality

#### 1. Smart Contract (Solidity)
- `stampContent(bytes32 contentHash, bytes signature)` - Record content on blockchain
- `verifyContent(bytes32 contentHash)` - Check if content exists and retrieve details
- `getCreatorStamps(address creator)` - List all stamps by a creator
- Events for indexing and monitoring

#### 2. CLI Tool (TypeScript)
**Commands:**
- `truth-stamped init` - Create/import wallet (private key management)
- `truth-stamped stamp <file>` - Hash file, sign, and submit to blockchain
- `truth-stamped verify <file>` - Check if file hash exists on blockchain
- `truth-stamped info <hash>` - Get detailed info about a stamped hash
- `truth-stamped list` - Show all stamps by current wallet

**Key Management:**
- Local wallet storage (encrypted)
- Support for hardware wallets (future)
- Clear security warnings and best practices

#### 3. File Support
**MVP:**
- Images: JPG, PNG, GIF, WebP
- Videos: MP4, MOV
- Documents: PDF

**Future:**
- Audio files
- Archive files (ZIP with manifest)

### Phase 2: Enhanced Features
- Web verification interface (drag & drop)
- Browser extension (verify images on any webpage)
- Batch stamping
- API for integration
- Trust networks (verify known creators)

## Technical Specifications

### Tech Stack
- **Smart Contract**: Solidity ^0.8.20
- **CLI**: TypeScript, Node.js 18+
- **Blockchain**: Base (Ethereum L2)
- **Libraries**:
  - ethers.js or viem (blockchain interaction)
  - commander.js (CLI framework)
  - chalk (terminal styling)
  - crypto (native, for hashing)
- **Testing**: Hardhat, Jest

### Data Structure

**On-Chain Storage:**
```solidity
struct ContentStamp {
    bytes32 contentHash;      // SHA-256 hash of content
    address creator;          // Creator's wallet address
    uint256 timestamp;        // Block timestamp
    bytes signature;          // Creator's signature of hash
    string metadata;          // Optional: IPFS link to metadata
}
```

**Off-Chain (Optional):**
- IPFS for extended metadata (filename, file type, description)
- Keep blockchain storage minimal for cost efficiency

### Security Considerations
1. **Private Key Security**: CLI must safely store/encrypt keys
2. **Hash Collisions**: Use SHA-256 (cryptographically secure)
3. **Signature Verification**: Validate signatures both on-chain and client-side
4. **Replay Protection**: Prevent reuse of signatures across contracts
5. **Gas Optimization**: Minimize on-chain storage costs

## User Personas

### 1. Photojournalist
- **Need**: Prove authenticity of field photography
- **Use Case**: Stamps photos immediately after capture, shares with news agencies
- **Value**: Credibility, protection against doctored images

### 2. Content Creator
- **Need**: Protect original work from AI impersonation
- **Use Case**: Stamps original content before publishing
- **Value**: Provable authorship, brand protection

### 3. News Organization
- **Need**: Verify authenticity of submitted content
- **Use Case**: Checks all submitted content against blockchain
- **Value**: Reduced misinformation risk, editorial quality

### 4. General Public
- **Need**: Verify if content is authentic
- **Use Case**: Checks viral images/videos before sharing
- **Value**: Avoid spreading misinformation

## Success Metrics

### Technical Metrics
- Transaction success rate: >99%
- Average stamping time: <5 seconds
- Average verification time: <2 seconds
- Gas cost per stamp: <$0.01

### Adoption Metrics
- Number of unique creators stamping content
- Total stamps recorded (target: 10K in first 6 months)
- GitHub stars and forks
- Community contributors

### Impact Metrics
- News organizations using the tool
- Integration into publishing workflows
- Reduction in unverified viral content (long-term)

## Non-Goals (For MVP)
- AI detection/classification
- Content hosting or storage
- Social features or platforms
- Mobile apps (CLI first)
- Payment processing
- Content moderation

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low adoption | High | Partner with journalists, make dead simple to use |
| Blockchain costs rise | Medium | Design for multi-chain, can migrate |
| Private key loss | High | Clear documentation, support for key recovery |
| Malicious users stamp fakes | Medium | Focus on creator reputation, trust networks |
| Blockchain goes down | Low | Base is stable, can add multi-chain support |

## Open Source Strategy

### License
- **MIT License** - Maximum permissiveness for adoption

### Repository Structure
```
truth-stamped/
├── contracts/          # Solidity smart contracts
├── cli/               # TypeScript CLI tool
├── docs/              # Documentation
├── examples/          # Usage examples
└── tests/             # Test suites
```

### Community
- Clear CONTRIBUTING.md
- Code of conduct
- Issue templates
- Active engagement on GitHub Discussions

## Roadmap

### Q1 2025: MVP Launch
- ✅ Smart contract on Base testnet
- ✅ CLI tool with stamp/verify commands
- ✅ Documentation and examples
- ✅ Open source release

### Q2 2025: Ecosystem Growth
- Web verification interface
- Browser extension
- Integration guides for news orgs
- Multi-chain support (Polygon, Ethereum)

### Q3 2025: Advanced Features
- Trust networks and reputation
- Bulk operations API
- Mobile SDKs
- Hardware wallet support

### Q4 2025: Scale
- Enterprise partnerships
- Camera/device integration
- International expansion
- Governance model

## Conclusion

Truth Stamped provides a simple, elegant solution to the deepfake crisis: instead of playing catch-up with detection, we enable proactive proof of authenticity. By leveraging blockchain's immutability and cryptographic signatures, we create a universal, trustless verification system that anyone can use and verify.

The key to success is extreme simplicity - one command to stamp, one command to verify. As authentic creators adopt the standard, unsigned content naturally becomes suspect, creating a powerful network effect.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-13
**Status**: Draft for Review
