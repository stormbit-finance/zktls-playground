"use client";

import { useEffect, useState } from "react";
import { reclaimABI, reclaimAddress } from "./const";
import { VerificationType } from "./types";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { ethers } from "ethers";
import _ from "lodash";
import QRCode from "react-qr-code";

interface Props {
  verificationType: VerificationType;
}

const schemaMap: Record<VerificationType, string> = {
  UNVERIFIED: "7741395a-0b00-402d-9a97-52ee45a9c789",
  VERIFIED: "7741395a-0b00-402d-9a97-52ee45a9c789",
  PERFORMANCE: "33372a39-8205-4e01-8f70-e9dfe7854512",
};

const pathMap: Record<VerificationType, string> = {
  UNVERIFIED: "extractedParameters.verificationStatus",
  VERIFIED: "extractedParameters.verificationStatus",
  PERFORMANCE: "extractedParameters.performanceTier",
};

const expectedValueMap: Record<VerificationType, string> = {
  UNVERIFIED: "USER_VERIFICATION_STATUS_UNVERIFIED",
  VERIFIED: "USER_VERIFICATION_STATUS_VERIFIED",
  PERFORMANCE: "EXPERT",
};

export const Reclaim = ({ verificationType }: Props) => {
  const [requestUrl, setRequestUrl] = useState("");

  useEffect(() => {
    setRequestUrl("");
  }, [verificationType]);

  const getVerificationReq = async () => {
    const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APPID;
    const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APPSECRET;

    if (!APP_ID || !APP_SECRET) {
      console.error("Reclaim credentials are not set");
      return;
    }

    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, schemaMap[verificationType], {
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
          const context = proof.claimData.context;
          const parsedContext = JSON.parse(context);
          const value = _.get(parsedContext, pathMap[verificationType]);
          if (value !== expectedValueMap[verificationType]) {
            console.error("Verification failed");
            console.error("Expected value:", expectedValueMap[verificationType]);
            console.error("Actual value:", value);
            return;
          }

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
    <div className="flex-1 flex flex-col items-center justify-center">
      <button className="btn btn-accent w-full" onClick={getVerificationReq}>
        Reclaim
      </button>
      {requestUrl && (
        <div style={{ margin: "20px 0" }}>
          <QRCode value={requestUrl} />
          <p>Scan the QR code with your iphone camera</p>
        </div>
      )}
    </div>
  );
};
