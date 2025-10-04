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
      className={`card bg-base-100 shadow-xl relative overflow-hidden ${
        isTopThree ? "ring-4 ring-yellow-400 ring-opacity-75" : "ring-2 ring-gray-300 ring-opacity-50"
      } ${isSold ? "opacity-60 grayscale" : ""}`}
    >
      {/* Gold/Silver glow effect */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isTopThree
            ? "bg-gradient-to-r from-yellow-400/20 via-yellow-300/30 to-yellow-400/20"
            : "bg-gradient-to-r from-gray-300/10 via-gray-200/20 to-gray-300/10"
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
          className="w-full h-64 object-cover"
          width={500} // Add appropriate width
          height={500} // Add appropriate height
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-nft.svg";
          }}
        />
        {/* Top 3 badge */}
        {isTopThree && !isSold && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold px-2 py-1 rounded-full text-sm">
            #{listingId}
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
            <span className={`font-bold ${isSold ? "text-gray-500" : "text-primary"}`}>{priceInEther} MONAD</span>
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
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              onClick={handleBuy}
              disabled={isLoading}
            >
              {isLoading ? "Satın Alınıyor..." : "Satın Al"}
            </button>
          )}

          {isOwner && !isSold && <div className="text-sm text-info">Sizin NFT&apos;niz</div>}
        </div>
      </div>
    </div>
  );
};
