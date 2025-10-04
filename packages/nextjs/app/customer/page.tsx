"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { formatEther, parseEther } from "viem";

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

export default function CustomerPage() {
  const [nfts, setNfts] = useState<ListedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  // Mock data for demonstration
  const mockNFTs: ListedNFT[] = useMemo(
    () => [
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(1),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("3.2"),
        isListed: true,
        isSold: false,
        imageUri: "/nft1.jpeg",
        name: "Golden Dragon #1",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(2),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("2.8"),
        isListed: true,
        isSold: false,
        imageUri: "/nft2.jpeg",
        name: "Cyber Cat #2",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(3),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("2.1"),
        isListed: true,
        isSold: false,
        imageUri: "/nft3.jpeg",
        name: "Space Monkey #3",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(4),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("1.5"),
        isListed: true,
        isSold: true,
        imageUri: "/nft4.jpeg",
        name: "Sold Out NFT #4",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(5),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.9"),
        isListed: true,
        isSold: false,
        imageUri: "/nft5.jpeg",
        name: "Digital Art #5",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(6),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.7"),
        isListed: true,
        isSold: false,
        imageUri: "/nft6.jpeg",
        name: "Abstract NFT #6",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(7),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.4"),
        isListed: true,
        isSold: false,
        imageUri: "/nft7.jpeg",
        name: "Pixel Art #7",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(8),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.2"),
        isListed: true,
        isSold: false,
        imageUri: "/nft8.jpeg",
        name: "Minimalist #8",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(9),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.15"),
        isListed: true,
        isSold: false,
        imageUri: "/nft9.jpeg",
        name: "Cool Frog #9",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(10),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.12"),
        isListed: true,
        isSold: false,
        imageUri: "/nft10.jpeg",
        name: "Purple Frens #10",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(11),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.08"),
        isListed: true,
        isSold: false,
        imageUri: "/nft11.jpeg",
        name: "Party Squad #11",
      },
    ],
    [],
  );

  // Update NFTs when component mounts
  useEffect(() => {
    setNfts(mockNFTs);
    setLoading(false);
  }, [mockNFTs]);

  // Auto-rotate featured NFTs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const legendaryNFTs = nfts.slice(0, 3);
  const rareNFTs = nfts.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-tight">
          FREEK
        </h1>
        <p className="text-2xl font-semibold text-purple-400 tracking-wide mb-8">NFT&apos;lerinizi Hissedin</p>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          🎨 Benzersiz NFT koleksiyonumuzu keşfedin ve favori tasarımlarınızı seçin!
        </p>
      </div>

      {/* Legendary NFTs - Horizontal Scroll */}
      <div className="py-12 px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
          ✨ LEGENDARY NFT&apos;ler
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {legendaryNFTs.map((nft, index) => (
            <div
              key={`${nft.nftContract}-${nft.tokenId}`}
              className={`flex-shrink-0 transition-all duration-500 ${
                index === currentFeaturedIndex ? "scale-110" : "scale-100"
              }`}
            >
              <div className="card bg-base-100 shadow-2xl w-80 rounded-2xl ring-4 ring-yellow-500 ring-opacity-90 shadow-yellow-500/50">
                <figure className="relative">
                  <Image
                    src={nft.imageUri}
                    alt={nft.name}
                    width={320}
                    height={320}
                    className="w-full h-80 object-cover rounded-t-2xl"
                  />
                  <div className="absolute top-3 right-3 font-bold px-3 py-1 rounded-xl text-xs shadow-lg bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black">
                    LEGENDARY
                  </div>
                </figure>
                <div className="card-body rounded-b-2xl">
                  <h3 className="card-title text-xl">{nft.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fiyat:</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                      {formatEther(nft.price)} MONAD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured NFT - Center */}
      <div className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">
          🌟 ÖNE ÇIKAN NFT
        </h2>
        <div className="flex justify-center">
          <div className="card bg-base-100 shadow-2xl w-96 rounded-3xl ring-4 ring-fuchsia-500 ring-opacity-90 shadow-fuchsia-500/50 transform hover:scale-105 transition-all duration-300">
            <figure className="relative">
              <Image
                src={legendaryNFTs[currentFeaturedIndex]?.imageUri || "/placeholder-nft.svg"}
                alt={legendaryNFTs[currentFeaturedIndex]?.name || "Featured NFT"}
                width={384}
                height={384}
                className="w-full h-96 object-cover rounded-t-3xl"
              />
              <div className="absolute top-4 right-4 font-bold px-4 py-2 rounded-xl text-sm shadow-lg bg-gradient-to-r from-fuchsia-400 via-pink-300 to-fuchsia-500 text-white">
                FEATURED
              </div>
            </figure>
            <div className="card-body rounded-b-3xl">
              <h3 className="card-title text-2xl justify-center">
                {legendaryNFTs[currentFeaturedIndex]?.name || "Featured NFT"}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Fiyat:</span>
                <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">
                  {legendaryNFTs[currentFeaturedIndex] ? formatEther(legendaryNFTs[currentFeaturedIndex].price) : "0"}{" "}
                  MONAD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rare NFTs - Gallery */}
      <div className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400">
          💎 RARE NFT&apos;ler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {rareNFTs.map(nft => (
            <div
              key={`${nft.nftContract}-${nft.tokenId}`}
              className="card bg-base-100 shadow-xl rounded-2xl ring-2 ring-gray-400 ring-opacity-40 hover:ring-gray-300 hover:shadow-gray-400/50 transition-all duration-300 hover:scale-105"
            >
              <figure className="relative">
                <Image
                  src={nft.imageUri}
                  alt={nft.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <div className="absolute top-3 right-3 font-bold px-3 py-1 rounded-xl text-xs shadow-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                  RARE
                </div>
              </figure>
              <div className="card-body rounded-b-2xl">
                <h3 className="card-title text-lg">{nft.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fiyat:</span>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {formatEther(nft.price)} MONAD
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center">
        <p className="text-gray-400">Powered by Overblock</p>
      </div>
    </div>
  );
}
