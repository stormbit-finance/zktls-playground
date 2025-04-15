// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// if you are using foundry, you can use the following conf:
// you can edit import information like this in your local project remappings.txt:
// @primuslabs/zktls-contracts=lib/zktls-contracts/

import {IPrimusZKTLS, Attestation} from "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";

contract PrimusAttestor {
    address public primusAddress;

    constructor(address _primusAddress) {
        primusAddress = _primusAddress;
    }

    function verifyAttestation(Attestation calldata attestation) external view {
        IPrimusZKTLS(primusAddress).verifyAttestation(attestation);
    }
}
