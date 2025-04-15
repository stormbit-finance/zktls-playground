export const primusABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_primusAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "primusAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            components: [
              {
                internalType: "string",
                name: "url",
                type: "string",
              },
              {
                internalType: "string",
                name: "header",
                type: "string",
              },
              {
                internalType: "string",
                name: "method",
                type: "string",
              },
              {
                internalType: "string",
                name: "body",
                type: "string",
              },
            ],
            internalType: "struct AttNetworkRequest",
            name: "request",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "keyName",
                type: "string",
              },
              {
                internalType: "string",
                name: "parseType",
                type: "string",
              },
              {
                internalType: "string",
                name: "parsePath",
                type: "string",
              },
            ],
            internalType: "struct AttNetworkResponseResolve[]",
            name: "reponseResolve",
            type: "tuple[]",
          },
          {
            internalType: "string",
            name: "data",
            type: "string",
          },
          {
            internalType: "string",
            name: "attConditions",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "timestamp",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "additionParams",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "attestorAddr",
                type: "address",
              },
              {
                internalType: "string",
                name: "url",
                type: "string",
              },
            ],
            internalType: "struct Attestor[]",
            name: "attestors",
            type: "tuple[]",
          },
          {
            internalType: "bytes[]",
            name: "signatures",
            type: "bytes[]",
          },
        ],
        internalType: "struct Attestation",
        name: "attestation",
        type: "tuple",
      },
    ],
    name: "verifyAttestation",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];
export const primusAddress = "0x3760aB354507a29a9F5c65A66C74353fd86393FA";

export const zkPassABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [],
    name: "_allocator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "taskId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "validator",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "allocatorSignature",
            type: "bytes",
          },
        ],
        internalType: "struct Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "verify",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];
export const zkPassAddress = "0xC417C29F67197BCA11A6521bB3f0996e9ae23d69";

export const reclaimABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "reclaimAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "provider",
                type: "string",
              },
              {
                internalType: "string",
                name: "parameters",
                type: "string",
              },
              {
                internalType: "string",
                name: "context",
                type: "string",
              },
            ],
            internalType: "struct Claims.ClaimInfo",
            name: "claimInfo",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "identifier",
                    type: "bytes32",
                  },
                  {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                  },
                  {
                    internalType: "uint32",
                    name: "timestampS",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "epoch",
                    type: "uint32",
                  },
                ],
                internalType: "struct Claims.CompleteClaimData",
                name: "claim",
                type: "tuple",
              },
              {
                internalType: "bytes[]",
                name: "signatures",
                type: "bytes[]",
              },
            ],
            internalType: "struct Claims.SignedClaim",
            name: "signedClaim",
            type: "tuple",
          },
        ],
        internalType: "struct Reclaim.Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "verifyProof",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];
export const reclaimAddress = "0xAe94FB09711e1c6B057853a515483792d8e474d0";
