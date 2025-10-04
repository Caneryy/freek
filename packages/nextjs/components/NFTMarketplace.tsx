"use client";

import { useEffect, useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { DepositModal } from "~~/components/DepositModal";
import { NFTCard } from "~~/components/NFTCard";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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

export const NFTMarketplace = () => {
  const { address: connectedAddress } = useAccount();
  const [nfts, setNfts] = useState<ListedNFT[]>([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

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
        imageUri: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
        name: "Pixel Art #7",
      },
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(8),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("0.2"),
        isListed: true,
        isSold: false,
        imageUri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop",
        name: "Minimalist #8",
      },
    ],
    [],
  );

  // Read all listed NFTs from contract
  const { data: allNFTs, refetch: refetchNFTs } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getAllListedNFTs",
  });

  // Write contract hook for buying NFTs
  const { writeContractAsync: writeMarketplaceAsync } = useScaffoldWriteContract({
    contractName: "NFTMarketplace",
  });

  // Update NFTs when contract data changes
  useEffect(() => {
    if (useMockData) {
      setNfts(mockNFTs);
      setLoading(false);
    } else if (allNFTs) {
      const nftData = allNFTs as ListedNFT[];
      // Sort by price (highest first)
      const sortedNFTs = nftData.sort((a, b) => Number(b.price - a.price));
      setNfts(sortedNFTs);
      setLoading(false);
    } else {
      setNfts([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNFTs, useMockData]);

  const handleBuyNFT = async (listingId: number, price: bigint) => {
    if (useMockData) {
      // Simulate buying in mock data
      setNfts(prevNfts => prevNfts.map((nft, index) => (index === listingId - 1 ? { ...nft, isSold: true } : nft)));
      alert(`Mock NFT #${listingId} satın alındı! (${formatEther(price)} MONAD)`);
    } else {
      try {
        await writeMarketplaceAsync({
          functionName: "buyNFT",
          args: [BigInt(listingId)],
          value: price,
        });
        // Refetch NFTs after successful purchase
        refetchNFTs();
      } catch (error) {
        console.error("Error buying NFT:", error);
      }
    }
  };

  const handleDepositSuccess = () => {
    refetchNFTs();
    setIsDepositModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with Deposit Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">NFT Marketplace</h2>
        <div className="flex gap-4 items-center">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Mock Data</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={useMockData}
                onChange={e => setUseMockData(e.target.checked)}
              />
            </label>
          </div>
          {connectedAddress && (
            <button
              className="btn btn-primary hover:scale-105 transition-transform"
              onClick={() => setIsDepositModalOpen(true)}
            >
              NFT Deposit Et
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow-xl mb-8 border border-purple-900/30">
        <div className="stat">
          <div className="stat-title text-gray-400">Toplam NFT</div>
          <div className="stat-value text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">
            {nfts.length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title text-gray-400">Satılan NFT</div>
          <div className="stat-value text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
            {nfts.filter(nft => nft.isSold).length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title text-gray-400">Aktif NFT</div>
          <div className="stat-value text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
            {nfts.filter(nft => nft.isListed && !nft.isSold).length}
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold mb-2">Henüz NFT yok</h3>
          <p className="text-base-content/70 mb-4">İlk NFT&apos;yi deposit ederek marketplace&apos;i başlatın!</p>
          {connectedAddress && (
            <button
              className="btn btn-primary hover:scale-105 transition-transform"
              onClick={() => setIsDepositModalOpen(true)}
            >
              İlk NFT&apos;yi Deposit Et
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 3 NFTs - Premium Row */}
          {nfts.slice(0, 3).length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                ✨ LEGENDARY NFT&apos;ler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {nfts.slice(0, 3).map((nft, index) => (
                  <NFTCard
                    key={`${nft.nftContract}-${nft.tokenId}`}
                    nft={nft}
                    listingId={index + 1}
                    isTopThree={true}
                    onBuy={handleBuyNFT}
                    isOwner={nft.owner.toLowerCase() === connectedAddress?.toLowerCase()}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other NFTs - Regular Grid */}
          {nfts.slice(3).length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400">
                💎 RARE NFT&apos;ler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {nfts.slice(3).map((nft, index) => (
                  <NFTCard
                    key={`${nft.nftContract}-${nft.tokenId}`}
                    nft={nft}
                    listingId={index + 4}
                    isTopThree={false}
                    onBuy={handleBuyNFT}
                    isOwner={nft.owner.toLowerCase() === connectedAddress?.toLowerCase()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          onSuccess={handleDepositSuccess}
        />
      )}
    </div>
  );
};
