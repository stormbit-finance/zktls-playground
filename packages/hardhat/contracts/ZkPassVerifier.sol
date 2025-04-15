// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

struct Proof {
    bytes32 taskId;
    bytes32 schemaId;
    address validator;
    bytes allocatorSignature;
}

// Sepolia:
// 0xC417C29F67197BCA11A6521bB3f0996e9ae23d69
contract ZkPassVerifier {
    address public _allocator = 0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d;

    using ECDSA for bytes32;

    constructor() {}

    function verify(Proof calldata proof) external view {
        bytes32 hashed = keccak256(abi.encode(proof.taskId, proof.schemaId, proof.validator));
        bytes32 prefixedHash = prefixed(hashed);
        address allocator = prefixedHash.recover(proof.allocatorSignature);

        require(allocator == _allocator, "Invalid signature");
    }

    function prefixed(bytes32 hash) private pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}
