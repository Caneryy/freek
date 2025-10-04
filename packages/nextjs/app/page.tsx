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
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Monad NFT</span>
            <span className="block text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Bağlı Cüzdan:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg mt-4">NFT&apos;lerinizi deposit edin, fiyatlandırın ve satın alın!</p>
        </div>

        <div className="grow w-full mt-8 px-8 py-12">
          <NFTMarketplace />
        </div>
      </div>
    </>
  );
};

export default Home;
