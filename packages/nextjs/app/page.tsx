"use client";

import { useState } from "react";
import { Primus } from "./primus";
import { Reclaim } from "./reclaim";
import { VerificationType } from "./types";
import { ZkPass } from "./zkpass";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [verificationType, setVerificationType] = useState<VerificationType>("UNVERIFIED");
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">zkTLS Demo</span>
          </h1>
          <select
            defaultValue="Pick a Verification Type"
            className="select"
            onChange={e => {
              setVerificationType(e.target.value as VerificationType);
            }}
          >
            <option value="UNVERIFIED">UNVERIFIED</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PERFORMANCE">ABOVE CONTRIBUTOR</option>
          </select>
          <div className="flex flex-row w-[600px] gap-4 pt-8">
            <Primus verificationType={verificationType} />
            <ZkPass verificationType={verificationType} />
            <Reclaim verificationType={verificationType} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
