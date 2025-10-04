"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { NFTMarketplace } from "~~/components/NFTMarketplace";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-tight">
              FREEK
            </span>
            <span className="block text-2xl font-semibold text-purple-400 tracking-wide">FEEL YOUR NFT&apos;S</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col mb-4">
            <p className="text-sm font-medium text-gray-400">Bağlı Cüzdan</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-base text-gray-300 max-w-xl mx-auto">
            🚀 NFT&apos;lerinizi keşfedin, deposit edin ve koleksiyonunuzu büyütün!
          </p>
        </div>

        <div className="grow w-full mt-8 px-8 py-12">
          <NFTMarketplace />
        </div>
      </div>
    </>
  );
};

export default Home;
