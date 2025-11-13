// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TruthStamp.sol";

contract TruthStampTest is Test {
    TruthStamp public truthStamp;

    bytes32 public testContentHash = keccak256("test content");
    string public testMetadata = "ipfs://QmTest123";

    event ContentStamped(
        bytes32 indexed contentHash,
        address indexed creator,
        uint256 timestamp,
        string metadata
    );

    event ContentVerified(
        bytes32 indexed contentHash,
        address indexed verifier,
        bool isValid
    );

    function setUp() public {
        truthStamp = new TruthStamp();
    }

    // Helper function to create a properly formatted signature
    function createSignature(uint256 privateKey, bytes32 contentHash) internal pure returns (bytes memory) {
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", contentHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, ethSignedMessageHash);
        return abi.encodePacked(r, s, v);
    }

    function testStampContent() public {
        uint256 creatorPrivateKey = 1;
        address creator = vm.addr(creatorPrivateKey);

        vm.startPrank(creator);

        bytes memory signature = createSignature(creatorPrivateKey, testContentHash);

        vm.expectEmit(true, true, false, true);
        emit ContentStamped(testContentHash, creator, block.timestamp, testMetadata);

        truthStamp.stampContent(testContentHash, signature, testMetadata);

        (bool exists, address stampCreator, uint256 timestamp, string memory metadata) =
            truthStamp.verifyContent(testContentHash);

        assertTrue(exists);
        assertEq(stampCreator, creator);
        assertEq(timestamp, block.timestamp);
        assertEq(metadata, testMetadata);

        vm.stopPrank();
    }

    function testCannotStampTwice() public {
        uint256 creatorPrivateKey = 1;
        address creator = vm.addr(creatorPrivateKey);

        vm.startPrank(creator);

        bytes memory signature = createSignature(creatorPrivateKey, testContentHash);

        truthStamp.stampContent(testContentHash, signature, testMetadata);

        vm.expectRevert("Content already stamped");
        truthStamp.stampContent(testContentHash, signature, testMetadata);

        vm.stopPrank();
    }

    function testCannotStampWithInvalidHash() public {
        uint256 creatorPrivateKey = 1;
        address creator = vm.addr(creatorPrivateKey);

        vm.startPrank(creator);

        bytes memory signature = createSignature(creatorPrivateKey, bytes32(0));

        vm.expectRevert("Invalid content hash");
        truthStamp.stampContent(bytes32(0), signature, testMetadata);

        vm.stopPrank();
    }

    function testCannotStampWithEmptySignature() public {
        address creator = address(0x1);
        vm.prank(creator);

        bytes memory emptySignature = new bytes(0);

        vm.expectRevert("Signature required");
        truthStamp.stampContent(testContentHash, emptySignature, testMetadata);
    }

    function testVerifyNonExistentContent() public view {
        bytes32 nonExistentHash = keccak256("non-existent");

        (bool exists, address stampCreator, uint256 timestamp, string memory metadata) =
            truthStamp.verifyContent(nonExistentHash);

        assertFalse(exists);
        assertEq(stampCreator, address(0));
        assertEq(timestamp, 0);
        assertEq(metadata, "");
    }

    function testGetStamp() public {
        uint256 creatorPrivateKey = 1;
        address creator = vm.addr(creatorPrivateKey);

        vm.startPrank(creator);

        bytes memory signature = createSignature(creatorPrivateKey, testContentHash);

        truthStamp.stampContent(testContentHash, signature, testMetadata);

        TruthStamp.ContentStamp memory stamp = truthStamp.getStamp(testContentHash);

        assertEq(stamp.contentHash, testContentHash);
        assertEq(stamp.creator, creator);
        assertEq(stamp.timestamp, block.timestamp);
        assertEq(stamp.metadata, testMetadata);
        assertTrue(stamp.exists);

        vm.stopPrank();
    }

    function testGetCreatorStamps() public {
        uint256 creatorPrivateKey = 1;
        address creator = vm.addr(creatorPrivateKey);

        vm.startPrank(creator);

        bytes32 hash1 = keccak256("content1");
        bytes32 hash2 = keccak256("content2");

        bytes memory sig1 = createSignature(creatorPrivateKey, hash1);
        bytes memory sig2 = createSignature(creatorPrivateKey, hash2);

        truthStamp.stampContent(hash1, sig1, "metadata1");
        truthStamp.stampContent(hash2, sig2, "metadata2");

        bytes32[] memory stamps = truthStamp.getCreatorStamps(creator);

        assertEq(stamps.length, 2);
        assertEq(stamps[0], hash1);
        assertEq(stamps[1], hash2);

        vm.stopPrank();
    }

    function testTotalStamps() public {
        assertEq(truthStamp.totalStamps(), 0);

        uint256 creatorPrivateKey = 1;
        address creator = vm.addr(creatorPrivateKey);

        vm.startPrank(creator);

        bytes memory signature = createSignature(creatorPrivateKey, testContentHash);

        truthStamp.stampContent(testContentHash, signature, testMetadata);

        assertEq(truthStamp.totalStamps(), 1);

        vm.stopPrank();
    }

    function testMultipleCreators() public {
        uint256 creator1PrivateKey = 1;
        uint256 creator2PrivateKey = 2;
        address creator1 = vm.addr(creator1PrivateKey);
        address creator2 = vm.addr(creator2PrivateKey);

        bytes32 hash1 = keccak256("content1");
        bytes32 hash2 = keccak256("content2");

        // Creator 1 stamps
        vm.startPrank(creator1);
        bytes memory sig1 = createSignature(creator1PrivateKey, hash1);
        truthStamp.stampContent(hash1, sig1, "creator1 content");
        vm.stopPrank();

        // Creator 2 stamps
        vm.startPrank(creator2);
        bytes memory sig2 = createSignature(creator2PrivateKey, hash2);
        truthStamp.stampContent(hash2, sig2, "creator2 content");
        vm.stopPrank();

        // Verify both stamps
        (bool exists1, address stampCreator1,,) = truthStamp.verifyContent(hash1);
        (bool exists2, address stampCreator2,,) = truthStamp.verifyContent(hash2);

        assertTrue(exists1);
        assertTrue(exists2);
        assertEq(stampCreator1, creator1);
        assertEq(stampCreator2, creator2);
        assertEq(truthStamp.totalStamps(), 2);
    }

    function testSignatureVerification() public view {
        uint256 privateKey = 0x1234;
        address signer = vm.addr(privateKey);

        bytes32 message = keccak256("test message");
        bytes memory signature = createSignature(privateKey, message);

        bool isValid = truthStamp.verifySignature(message, signature, signer);
        assertTrue(isValid);

        // Test with wrong signer
        address wrongSigner = address(0x9999);
        bool isInvalid = truthStamp.verifySignature(message, signature, wrongSigner);
        assertFalse(isInvalid);
    }
}
