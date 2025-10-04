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
    }, 5000); // 5 saniyeye çıkardım
    return () => clearInterval(interval);
  }, []);

  // Handle scroll wheel for carousel - only when hovering over legendary NFTs
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  useEffect(() => {
    const handleWheel = (e: Event) => {
      if (!isHoveringCarousel) return;

      const wheelEvent = e as WheelEvent;
      wheelEvent.preventDefault();
      wheelEvent.stopPropagation();

      if (wheelEvent.deltaY > 0) {
        // Scroll down - next NFT
        setCurrentFeaturedIndex(prev => (prev + 1) % 3);
      } else if (wheelEvent.deltaY < 0) {
        // Scroll up - previous NFT
        setCurrentFeaturedIndex(prev => (prev - 1 + 3) % 3);
      }
    };

    const carouselElement = document.querySelector('[data-carousel="legendary"]');
    if (carouselElement) {
      carouselElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => carouselElement.removeEventListener("wheel", handleWheel);
    }
  }, [isHoveringCarousel]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const legendaryNFTs = nfts.filter(
    nft => nft.name.includes("Dragon") || nft.name.includes("Cat") || nft.name.includes("Monkey"),
  );
  const rareNFTs = nfts.filter(nft => !legendaryNFTs.includes(nft));
  const soldOutNFTs = nfts.filter(nft => nft.isSold);

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

      {/* Main Content with Sidebar */}
      <div className="flex gap-6 px-4">
        {/* Main Content */}
        <div className="flex-1">
          {/* Legendary NFTs - Gallery View */}
          <div className="py-12">
            <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
              ✨ LEGENDARY NFT&apos;ler
            </h2>
            <div
              className="flex justify-center items-center gap-4 overflow-hidden cursor-pointer"
              data-carousel="legendary"
              onMouseEnter={() => setIsHoveringCarousel(true)}
              onMouseLeave={() => setIsHoveringCarousel(false)}
            >
              {legendaryNFTs.map((nft, index) => {
                // Calculate the display position based on currentFeaturedIndex
                const displayIndex = (index - currentFeaturedIndex + 3) % 3;
                const isCenter = displayIndex === 0;

                return (
                  <div
                    key={`${nft.nftContract}-${nft.tokenId}`}
                    className={`transition-all duration-700 ease-in-out ${isCenter ? "scale-110 z-10" : "scale-90 z-0"}`}
                  >
                    <div
                      className={`card bg-base-100 shadow-2xl rounded-2xl ring-4 ring-yellow-500 ring-opacity-90 shadow-yellow-500/50 ${
                        isCenter ? "w-96" : "w-80"
                      }`}
                    >
                      <figure className="relative">
                        <Image
                          src={nft.imageUri}
                          alt={nft.name}
                          width={isCenter ? 384 : 320}
                          height={isCenter ? 384 : 320}
                          className={`w-full object-cover rounded-t-2xl ${isCenter ? "h-96" : "h-80"} ${nft.isSold ? "opacity-60 grayscale" : ""}`}
                        />
                        {nft.isSold && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                            <div className="text-center">
                              <div className="text-4xl mb-2">❌</div>
                              <div className="text-white font-bold text-xl">SOLD OUT</div>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 font-bold px-3 py-1 rounded-xl text-xs shadow-lg bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black">
                          LEGENDARY
                        </div>
                      </figure>
                      <div className="card-body rounded-b-2xl">
                        <h3 className={`card-title ${isCenter ? "text-xl" : "text-lg"}`}>{nft.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Fiyat:</span>
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                            {formatEther(nft.price)} MONAD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {legendaryNFTs.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeaturedIndex ? "bg-yellow-400 scale-125" : "bg-gray-400 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentFeaturedIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Rare NFTs - Gallery */}
          <div className="py-16">
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
                      className={`w-full h-64 object-cover rounded-t-2xl ${nft.isSold ? "opacity-60 grayscale" : ""}`}
                    />
                    {nft.isSold && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="text-4xl mb-2">❌</div>
                          <div className="text-white font-bold text-xl">SOLD OUT</div>
                        </div>
                      </div>
                    )}
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
        </div>

        {/* Sidebar - Sold Out NFTs */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-base-100/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-500/20 p-4">
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
              ❌ Sold Out NFT&apos;ler
            </h3>
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
              {soldOutNFTs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-sm text-gray-400">Henüz sold out NFT yok!</div>
                </div>
              ) : (
                soldOutNFTs.map((nft, index) => {
                  const isLegendary =
                    nft.name.includes("Dragon") || nft.name.includes("Cat") || nft.name.includes("Monkey");

                  return (
                    <div key={index} className="bg-base-200/50 rounded-xl p-3 border border-red-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                          <Image
                            src={nft.imageUri}
                            alt={nft.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-lg opacity-60 grayscale"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-red-500 text-lg">❌</div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate text-gray-500">{nft.name}</div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full inline-block ${
                              isLegendary
                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                            }`}
                          >
                            {isLegendary ? "LEGENDARY" : "RARE"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Fiyat:</span>
                          <span className="font-semibold text-gray-500 line-through">
                            {formatEther(nft.price)} MONAD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durum:</span>
                          <span className="font-semibold text-red-500">SOLD OUT</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center">
        <p className="text-gray-400">Powered by Overblock</p>
      </div>
    </div>
  );
}
