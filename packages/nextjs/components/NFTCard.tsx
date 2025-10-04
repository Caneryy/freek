"use client";

import { useState } from "react";
import Image from "next/image";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";

interface ListedNFT {
  nftContract: string;
  tokenId: bigint;
  owner: string;
  price: bigint;
  isListed: boolean;
  isSold: boolean;
  imageUri: string;
  name: string;
}

interface NFTCardProps {
  nft: ListedNFT;
  listingId: number;
  isTopThree: boolean;
  onBuy: (listingId: number, price: bigint) => void;
  isOwner: boolean;
}

export const NFTCard = ({ nft, listingId, isTopThree, onBuy, isOwner }: NFTCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      await onBuy(listingId, nft.price);
    } catch (error) {
      console.error("Error buying NFT:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const priceInEther = formatEther(nft.price);
  const isSold = nft.isSold;

  return (
    <div
      className={`card bg-base-100 shadow-xl relative overflow-hidden transition-all duration-300 group ${
        isTopThree
          ? "ring-4 ring-yellow-500 ring-opacity-90 shadow-yellow-500/50 hover:shadow-yellow-500/70 hover:ring-yellow-400"
          : "ring-2 ring-gray-400 ring-opacity-40 hover:ring-gray-300 hover:shadow-gray-400/50"
      } ${isSold ? "opacity-60 grayscale" : ""}`}
    >
      {/* Glow effect - Background becomes brighter on hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isTopThree
            ? "bg-gradient-to-br from-yellow-500/20 via-amber-400/25 to-yellow-600/20 group-hover:from-yellow-500/40 group-hover:via-amber-400/50 group-hover:to-yellow-600/40"
            : "bg-gradient-to-br from-gray-300/5 via-gray-400/10 to-gray-500/5 group-hover:from-gray-300/20 group-hover:via-gray-400/30 group-hover:to-gray-500/20"
        } ${isSold ? "hidden" : ""}`}
      />

      {/* Sold out overlay */}
      {isSold && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-4xl mb-2">❌</div>
            <div className="text-white font-bold text-xl">SOLD OUT</div>
          </div>
        </div>
      )}

      {/* NFT Image */}
      <figure className="relative">
        <Image
          src={nft.imageUri || "/placeholder-nft.svg"}
          alt={nft.name}
          className="w-full h-48 object-cover transition-transform duration-300"
          width={400}
          height={400}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-nft.svg";
          }}
        />
        {/* Badge */}
        {!isSold && (
          <div
            className={`absolute top-2 right-2 font-bold px-3 py-1 rounded-full text-xs shadow-lg ${
              isTopThree
                ? "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
            }`}
          >
            {isTopThree ? "LEGENDARY" : "RARE"}
          </div>
        )}
      </figure>

      {/* Card Content */}
      <div className="card-body">
        <h2 className={`card-title ${isSold ? "text-gray-500" : ""}`}>
          {nft.name || `NFT #${nft.tokenId.toString()}`}
        </h2>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Fiyat:</span>
            <span
              className={`font-bold ${
                isSold
                  ? "text-gray-500"
                  : isTopThree
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
              }`}
            >
              {priceInEther} MONAD
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Sahip:</span>
            <Address address={nft.owner} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          {!isSold && !isOwner && (
            <button
              className={`btn btn-primary transition-all ${isLoading ? "loading" : ""}`}
              onClick={handleBuy}
              disabled={isLoading}
            >
              {isLoading ? "Satın Alınıyor..." : "Satın Al"}
            </button>
          )}

          {isOwner && !isSold && (
            <div
              className={`text-sm flex items-center gap-1 font-semibold ${
                isTopThree ? "text-yellow-400" : "text-purple-400"
              }`}
            >
              <span>✨</span> Sizin NFT&apos;niz
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
