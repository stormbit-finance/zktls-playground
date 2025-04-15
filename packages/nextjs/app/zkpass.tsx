/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { zkPassABI, zkPassAddress } from "./const";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ethers } from "ethers";
import Web3 from "web3";

export const ZkPass = () => {
  const verify = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_ZKPASS_APPID || !process.env.NEXT_PUBLIC_ZKPASS_SCHEMAID) {
        console.error("ZKPASS_APPID or ZKPASS_SCHEMAID is not set");
        return;
      }
      const appid = process.env.NEXT_PUBLIC_ZKPASS_APPID;
      const connector = new TransgateConnect(appid);
      const schemaId = process.env.NEXT_PUBLIC_ZKPASS_SCHEMAID;

      const address = "0x292f0EcA3AcBAbBE816efB8952D8BE0b8e24ea96";
      const responseWithAddress = (await connector.launch(
        schemaId,
        address,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as any;
      console.log("responseWithAddress", responseWithAddress);

      const {
        taskId,
        uHash,
        publicFieldsHash,
        recipient,
        validatorSignature,
        validatorAddress,
        allocatorAddress,
        allocatorSignature,
      } = responseWithAddress;
      const taskIdHex = Web3.utils.stringToHex(taskId);
      const schemaIdHex = Web3.utils.stringToHex(schemaId);

      const types = ["bytes32", "bytes32", "bytes32", "bytes32"];
      const values = [taskIdHex, schemaIdHex, uHash, publicFieldsHash];

      if (recipient) {
        types.push("address");
        values.push(recipient);
      }
      // verify the validator
      const web3 = new Web3();
      const encodeParams = web3.eth.abi.encodeParameters(types, values);
      const paramsHash = Web3.utils.soliditySha3(encodeParams);
      const signedValidatorAddress = web3.eth.accounts.recover(paramsHash!, validatorSignature);
      console.log("validate result", signedValidatorAddress === validatorAddress);

      // verify the allocator
      const encodeAllocatorParams = web3.eth.abi.encodeParameters(
        ["bytes32", "bytes32", "address"],
        [taskIdHex, schemaIdHex, validatorAddress],
      );

      const allocatorParamsHash = Web3.utils.soliditySha3(encodeAllocatorParams);
      const signedAllocatorAddress = web3.eth.accounts.recover(allocatorParamsHash!, allocatorSignature);
      console.log("allocator result", signedAllocatorAddress === allocatorAddress);

      // verify the proof on chain
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
      const contract = new ethers.Contract(zkPassAddress, zkPassABI, provider);
      try {
        const tx = await contract.verify({
          taskId: taskIdHex,
          schemaId: schemaIdHex,
          validator: validatorAddress,
          allocatorSignature,
        });
        console.log("Transaction:", tx);
      } catch (error) {
        console.error("Error in verifyAttestation:", error);
      }
    } catch (error) {
      console.log("transgate error", error);
    }
  };
  return (
    <button className="flex-1 btn btn-accent" onClick={verify}>
      zkPass
    </button>
  );
};
