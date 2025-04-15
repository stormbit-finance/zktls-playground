"use client";

import { Primus } from "./primus";
import { Reclaim } from "./reclaim";
import { ZkPass } from "./zkpass";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">zkTLS Demo</span>
          </h1>
          <div className="flex flex-row w-[600px] gap-4 pt-4">
            <Primus />
            <ZkPass />
            <Reclaim />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
