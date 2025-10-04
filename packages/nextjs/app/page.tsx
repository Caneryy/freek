"use client";

import type { NextPage } from "next";
import { NFTMarketplace } from "~~/components/NFTMarketplace";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-tight">
              FREEK
            </span>
            <span className="block text-2xl font-semibold text-purple-400 tracking-wide">
              NFT&apos;lerinizi Hissedin
            </span>
          </h1>
        </div>

        <div className="grow w-full mt-8 px-8 py-12">
          <NFTMarketplace />
        </div>
      </div>
    </>
  );
};

export default Home;
