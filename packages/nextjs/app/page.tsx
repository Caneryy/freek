"use client";

import type { NextPage } from "next";
import { NFTMarketplace } from "~~/components/NFTMarketplace";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 smooth-scroll">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-tight">
          FREEK
        </h1>
        <p className="text-2xl font-semibold text-purple-400 tracking-wide mb-8">Seller View</p>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12">
        <NFTMarketplace />
      </div>
    </div>
  );
};

export default Home;
