// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@reclaimprotocol/verifier-solidity-sdk/contracts/Reclaim.sol";
import "@reclaimprotocol/verifier-solidity-sdk/contracts/Addresses.sol";

contract ReclaimAttestor {
    address public reclaimAddress;

    constructor() {
        // Replace with the network you are deploying on
        reclaimAddress = Addresses.ETHEREUM_SEPOLIA;
    }

    function verifyProof(Reclaim.Proof memory proof) public view {
        Reclaim(reclaimAddress).verifyProof(proof);
        // Your business logic upon successful verification
        // Example: Verify that proof.context matches your expectations
    }
}
