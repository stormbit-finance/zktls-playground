import { useEffect, useState } from "react";
import { primusABI, primusAddress } from "./const";
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk";
import { ethers } from "ethers";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const Primus = () => {
  const [primusZKTLS, setPrimusZKTLS] = useState<PrimusZKTLS | null>(null);
  const [attestation, setAttestation] = useState<any>(null);
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
      const primusZKTLS = new PrimusZKTLS();
      const appId = process.env.NEXT_PUBLIC_PRIMUS_APPID;
      const appSecret = process.env.NEXT_PUBLIC_PRIMUS_APPSECRET;
      if (!appId || !appSecret) {
        throw new Error("appId or appSecret is not set");
      }
      const initAttestaionResult = await primusZKTLS.init(appId, appSecret);
      console.log("primusProof initAttestaionResult=", initAttestaionResult);
      setPrimusZKTLS(primusZKTLS);
    };
    init();
  }, []);

  const primusProof = async () => {
    if (!primusZKTLS || !process.env.NEXT_PUBLIC_PRIMUS_TEMPLATEID) {
      console.error("primusZKTLS is not initialized");
      return;
    }
    // Set TemplateID and user address.
    const attTemplateID = process.env.NEXT_PUBLIC_PRIMUS_TEMPLATEID;
    const userAddress = "0x4F09211507720C89Fd4669A5C4787bD76632b107";
    // Generate attestation request.
    const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

    const workMode = "proxytls";
    request.setAttMode({
      algorithmType: workMode,
    });
    const attConditions = [
      [
        {
          field: "performanceTier",
          op: "!=",
          value: "NOVICE",
        },
      ],
    ];
    request.setAttConditions(attConditions);

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
      } catch (error) {
        console.error("Error in verifyAttestation:", error);
      }
    } else {
      // If failed, define your own logic.
    }
  };
  return <button onClick={primusProof}>Primus</button>;
};
