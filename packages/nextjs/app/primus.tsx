import { useCallback, useEffect, useState } from "react";
import { primusABI, primusAddress } from "./const";
import { VerificationType } from "./types";
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk";
import { ethers } from "ethers";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Props {
  verificationType: VerificationType;
}

const schemaMap: Record<VerificationType, string> = {
  UNVERIFIED: "16019ca3-553f-4665-b6fa-d8744a80900a",
  VERIFIED: "16019ca3-553f-4665-b6fa-d8744a80900a",
  PERFORMANCE: "9e729c25-62b4-437b-9f09-ed74c83fba8d",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const attConditionsMap: Record<VerificationType, any> = {
  UNVERIFIED: [
    [
      {
        field: "verificationStatus",
        op: "!=",
        value: "USER_VERIFICATION_STATUS_VERIFIED",
      },
    ],
  ],
  VERIFIED: [
    [
      {
        field: "verificationStatus",
        op: "!=",
        value: "USER_VERIFICATION_STATUS_UNVERIFIED",
      },
    ],
  ],
  PERFORMANCE: [
    [
      {
        field: "performanceTier",
        op: "!=",
        value: "CONTRIBUTOR",
      },
    ],
  ],
};

export const Primus = ({ verificationType }: Props) => {
  const [primusZKTLS, setPrimusZKTLS] = useState<PrimusZKTLS | null>(null);
  const [attestation, setAttestation] = useState<any>(null);
  const [, setSuccess] = useState<boolean | null>(null);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const { data: verifyAttestationResult } = useScaffoldReadContract({
    contractName: "PrimusAttestor",
    functionName: "verifyAttestation",
    args: attestation,
    query: {
      enabled: !!attestation,
    },
  });
  useEffect(() => {
    console.log("verifyAttestationResult=", verifyAttestationResult);
  }, [verifyAttestationResult]);
  useEffect(() => {
    const init = async () => {
      try {
        const primusZKTLS = new PrimusZKTLS();
        const appId = process.env.NEXT_PUBLIC_PRIMUS_APPID;
        const appSecret = process.env.NEXT_PUBLIC_PRIMUS_APPSECRET;
        if (!appId || !appSecret) {
          throw new Error("appId or appSecret is not set");
        }
        const initAttestaionResult = await primusZKTLS.init(appId, appSecret);
        console.log("primusProof initAttestaionResult=", initAttestaionResult);
        setPrimusZKTLS(primusZKTLS);
        setButtonEnabled(true);
      } catch (error) {
        console.warn("Error during primusProof initialization:", error);
        setButtonEnabled(false);
      }
    };
    init();
  }, []);

  const primusProof = useCallback(async () => {
    if (!primusZKTLS) {
      console.error("primusZKTLS is not initialized");
      return;
    }
    // Set TemplateID and user address.
    const attTemplateID = schemaMap[verificationType];
    const userAddress = "0x4F09211507720C89Fd4669A5C4787bD76632b107";
    // Generate attestation request.
    const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

    const workMode = "proxytls";
    request.setAttMode({
      algorithmType: workMode,
    });
    request.setAttConditions(attConditionsMap[verificationType]);
    console.log("attTemplateID:", attTemplateID);
    console.log("attConditions:", attConditionsMap[verificationType]);

    try {
      // Transfer request object to string.
      const requestStr = request.toJsonString();

      // Sign request.
      const signedRequestStr = await primusZKTLS.sign(requestStr);
      console.log("signedRequestStr=", signedRequestStr);
      // Start attestation process.
      const attestation: any = await primusZKTLS.startAttestation(signedRequestStr);
      console.log("attestation=", attestation);
      setAttestation(attestation);
      // Verify siganture.
      const verifyResult = await primusZKTLS.verifyAttestation(attestation);
      console.log("verifyResult=", verifyResult);

      if (verifyResult === true) {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
        const contract = new ethers.Contract(primusAddress, primusABI, provider);
        try {
          const tx = await contract.verifyAttestation(attestation);
          console.log("Transaction:", tx);
          setSuccess(true);
        } catch (error) {
          console.error("Error in verifyAttestation:", error);
          setSuccess(false);
        }
      } else {
        // If failed, define your own logic.
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error in primusProof:", error);
      setSuccess(false);
    }
  }, [verificationType, primusZKTLS]);

  return (
    <button disabled={!buttonEnabled} className="flex-1 btn btn-accent" onClick={primusProof}>
      Primus
    </button>
  );
};
