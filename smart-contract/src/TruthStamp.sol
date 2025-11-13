// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TruthStamp
 * @notice A contract for timestamping and verifying content authenticity on the blockchain
 * @dev Stores cryptographic hashes of content with creator signatures for immutable proof of origin
 */
contract TruthStamp {
    /// @notice Represents a stamped piece of content
    struct ContentStamp {
        bytes32 contentHash;      // SHA-256 hash of the content
        address creator;          // Address of the content creator
        uint256 timestamp;        // Block timestamp when stamped
        bytes signature;          // Creator's signature of the content hash
        string metadata;          // Optional metadata (IPFS CID, filename, etc.)
        bool exists;              // Flag to check if stamp exists
    }

    /// @notice Mapping from content hash to its stamp data
    mapping(bytes32 => ContentStamp) public stamps;

    /// @notice Mapping from creator address to array of their content hashes
    mapping(address => bytes32[]) public creatorStamps;

    /// @notice Total number of stamps created
    uint256 public totalStamps;

    /// @notice Emitted when content is stamped
    event ContentStamped(
        bytes32 indexed contentHash,
        address indexed creator,
        uint256 timestamp,
        string metadata
    );

    /// @notice Emitted when content is verified
    event ContentVerified(
        bytes32 indexed contentHash,
        address indexed verifier,
        bool isValid
    );

    /**
     * @notice Stamp content on the blockchain
     * @param contentHash SHA-256 hash of the content
     * @param signature Creator's signature of the content hash
     * @param metadata Optional metadata (IPFS CID, filename, etc.)
     */
    function stampContent(
        bytes32 contentHash,
        bytes memory signature,
        string memory metadata
    ) external {
        require(contentHash != bytes32(0), "Invalid content hash");
        require(!stamps[contentHash].exists, "Content already stamped");
        require(signature.length > 0, "Signature required");

        // Verify the signature is valid for this content hash
        require(
            verifySignature(contentHash, signature, msg.sender),
            "Invalid signature"
        );

        // Create the stamp
        stamps[contentHash] = ContentStamp({
            contentHash: contentHash,
            creator: msg.sender,
            timestamp: block.timestamp,
            signature: signature,
            metadata: metadata,
            exists: true
        });

        // Track stamp for the creator
        creatorStamps[msg.sender].push(contentHash);
        totalStamps++;

        emit ContentStamped(contentHash, msg.sender, block.timestamp, metadata);
    }

    /**
     * @notice Verify if content exists and retrieve its stamp information
     * @param contentHash SHA-256 hash of the content to verify
     * @return exists Whether the content has been stamped
     * @return creator Address of the creator who stamped it
     * @return timestamp When the content was stamped
     * @return metadata Associated metadata
     */
    function verifyContent(bytes32 contentHash)
        external
        view
        returns (
            bool exists,
            address creator,
            uint256 timestamp,
            string memory metadata
        )
    {
        ContentStamp memory stamp = stamps[contentHash];
        return (
            stamp.exists,
            stamp.creator,
            stamp.timestamp,
            stamp.metadata
        );
    }

    /**
     * @notice Get detailed information about a stamped content
     * @param contentHash SHA-256 hash of the content
     * @return stamp The complete ContentStamp struct
     */
    function getStamp(bytes32 contentHash)
        external
        view
        returns (ContentStamp memory)
    {
        require(stamps[contentHash].exists, "Content not stamped");
        return stamps[contentHash];
    }

    /**
     * @notice Get all stamps created by a specific address
     * @param creator Address of the creator
     * @return hashes Array of content hashes stamped by the creator
     */
    function getCreatorStamps(address creator)
        external
        view
        returns (bytes32[] memory)
    {
        return creatorStamps[creator];
    }

    /**
     * @notice Verify a signature matches the content hash and signer
     * @param contentHash The hash that was signed
     * @param signature The signature to verify
     * @param signer The expected signer address
     * @return valid Whether the signature is valid
     */
    function verifySignature(
        bytes32 contentHash,
        bytes memory signature,
        address signer
    ) public pure returns (bool) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 ethSignedMessageHash = getEthSignedMessageHash(contentHash);

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);

        address recoveredSigner = ecrecover(ethSignedMessageHash, v, r, s);

        return recoveredSigner == signer && recoveredSigner != address(0);
    }

    /**
     * @notice Get the Ethereum signed message hash
     * @param messageHash The original message hash
     * @return The prefixed hash
     */
    function getEthSignedMessageHash(bytes32 messageHash)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
    }

    /**
     * @notice Split signature into r, s, v components
     * @param sig The signature bytes
     * @return r The r component
     * @return s The s component
     * @return v The v component
     */
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Adjust v if needed (some libraries use 0/1 instead of 27/28)
        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature v value");
    }
}
