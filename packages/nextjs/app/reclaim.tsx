"use client";

import { useState } from "react";
import { reclaimABI, reclaimAddress } from "./const";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { ethers } from "ethers";
import QRCode from "react-qr-code";

export const Reclaim = () => {
  const [requestUrl, setRequestUrl] = useState("");

  const getVerificationReq = async () => {
    const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APPID;
    const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APPSECRET;
    const PROVIDER_ID = process.env.NEXT_PUBLIC_RECLAIM_PROVIDERID;

    if (!APP_ID || !APP_SECRET || !PROVIDER_ID) {
      console.error("Reclaim credentials are not set");
      return;
    }

    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID, {
      useAppClip: true,
      device: "ios",
      log: true,
    });
    // user address
    reclaimProofRequest.addContext("0x4F09211507720C89Fd4669A5C4787bD76632b107", "User Kaggle performance proof");
    console.log("Reclaim Proof Request:", reclaimProofRequest);
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log("Request URL:", requestUrl);
    setRequestUrl(requestUrl);

    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
      onSuccess: async proofs => {
        console.log("Verification success", proofs);
        if (proofs && !Array.isArray(proofs) && typeof proofs !== "string") {
          const proof = proofs;
          console.log("Proof:", proof);

          const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
          const contract = new ethers.Contract(reclaimAddress, reclaimABI, provider);
          try {
            const tx = await contract.verifyProof({
              claimInfo: {
                provider: proof.claimData.provider,
                parameters: proof.claimData.parameters,
                context: proof.claimData.context,
              },
              signedClaim: {
                claim: {
                  identifier: proof.claimData.identifier,
                  owner: proof.claimData.owner,
                  timestampS: proof.claimData.timestampS,
                  epoch: proof.claimData.epoch,
                },
                signatures: proof.signatures,
              },
            });
            console.log("Transaction:", tx);
          } catch (error) {
            console.error("Error in verifyAttestation:", error);
          }
        }
      },
      onError: error => {
        console.error("Verification failed", error);
      },
    });
  };

  return (
    <>
      <button onClick={getVerificationReq}>Get Reclaim Verification Request</button>
      {requestUrl && (
        <div style={{ margin: "20px 0" }}>
          <QRCode value={requestUrl} />
        </div>
      )}
    </>
  );
};
