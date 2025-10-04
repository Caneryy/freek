"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  const [selectedNFT, setSelectedNFT] = useState<ListedNFT | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);

  // Mock data for demonstration
  const mockNFTs: ListedNFT[] = useMemo(
    () => [
      {
        nftContract: "0x1234567890123456789012345678901234567890",
        tokenId: BigInt(1),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        price: parseEther("3.2"),
        isListed: true,
        isSold: true,
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

  // Read all listed NFTs from contract
  const { data: allNFTs, refetch: refetchNFTs } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getAllListedNFTs",
  });

  // Write contract hook for transferring NFTs
  const { writeContractAsync: writeMarketplaceAsync } = useScaffoldWriteContract({
    contractName: "NFTMarketplace",
  });

  // Update NFTs when contract data changes
  useEffect(() => {
    if (useMockData) {
      setNfts(mockNFTs);
    } else if (allNFTs) {
      const nftData = allNFTs as ListedNFT[];
      // Sort by price (highest first)
      const sortedNFTs = nftData.sort((a, b) => Number(b.price - a.price));
      setNfts(sortedNFTs);
    } else {
      setNfts([]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNFTs, useMockData]);

  const handleDepositSuccess = () => {
    refetchNFTs();
    setIsDepositModalOpen(false);
  };

  const handleRandomNFTSelect = () => {
    const availableNFTs = nfts.filter(nft => !nft.isSold);
    if (availableNFTs.length === 0) {
      alert("Satılmamış NFT bulunamadı!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableNFTs.length);
    const randomNFT = availableNFTs[randomIndex];
    setSelectedNFT(randomNFT);
    setIsRandomModalOpen(true);
  };

  const handleRandomNFTSend = async () => {
    if (!selectedNFT || !recipientAddress) {
      alert("Lütfen cüzdan adresini girin!");
      return;
    }

    if (useMockData) {
      // Simulate sending random NFT
      setNfts(prevNfts => prevNfts.map(nft => (nft.tokenId === selectedNFT.tokenId ? { ...nft, isSold: true } : nft)));
      alert(`Rastgele NFT "${selectedNFT.name}" ${recipientAddress} adresine gönderildi!`);
      setSelectedNFT(null);
      setRecipientAddress("");
      setIsRandomModalOpen(false);
    } else {
      try {
        await writeMarketplaceAsync({
          functionName: "sendRandomNFT",
          args: [selectedNFT.tokenId, recipientAddress],
        });
        alert(`Rastgele NFT "${selectedNFT.name}" ${recipientAddress} adresine gönderildi!`);
        setSelectedNFT(null);
        setRecipientAddress("");
        setIsRandomModalOpen(false);
        refetchNFTs();
      } catch (error) {
        console.error("Error sending random NFT:", error);
      }
    }
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
            <>
              <button
                className="btn btn-primary hover:scale-105 transition-transform"
                onClick={() => setIsDepositModalOpen(true)}
              >
                NFT Deposit Et
              </button>
              <button
                className="btn btn-secondary hover:scale-105 transition-transform"
                onClick={handleRandomNFTSelect}
              >
                🎲 Rastgele NFT Seç
              </button>
            </>
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
                {nfts.slice(0, 3).map(nft => (
                  <NFTCard
                    key={`${nft.nftContract}-${nft.tokenId}`}
                    nft={nft}
                    isTopThree={true}
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
                {nfts.slice(3).map(nft => (
                  <NFTCard
                    key={`${nft.nftContract}-${nft.tokenId}`}
                    nft={nft}
                    isTopThree={false}
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

      {/* Random NFT Modal */}
      {isRandomModalOpen && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-center">🎲 Rastgele NFT Seçildi!</h3>

            <div className="text-center mb-6">
              <div className="text-lg font-semibold mb-2">{selectedNFT.name}</div>
              <div className="text-sm text-gray-400 mb-4">Fiyat: {formatEther(selectedNFT.price)} MONAD</div>
              <Image
                src={selectedNFT.imageUri}
                alt={selectedNFT.name}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-xl mx-auto"
              />
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Alıcı Cüzdan Adresi:</span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                className="input input-bordered w-full"
                value={recipientAddress}
                onChange={e => setRecipientAddress(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-outline flex-1"
                onClick={() => {
                  setIsRandomModalOpen(false);
                  setSelectedNFT(null);
                  setRecipientAddress("");
                }}
              >
                İptal
              </button>
              <button className="btn btn-primary flex-1" onClick={handleRandomNFTSend}>
                🚀 NFT Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
