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
