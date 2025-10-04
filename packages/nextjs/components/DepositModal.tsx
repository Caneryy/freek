"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal = ({ isOpen, onClose, onSuccess }: DepositModalProps) => {
  const [nftContract, setNftContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync: writeMarketplaceAsync } = useScaffoldWriteContract({
    contractName: "NFTMarketplace",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nftContract || !tokenId || !price || !imageUri || !name) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);
    try {
      await writeMarketplaceAsync({
        functionName: "listNFT",
        args: [nftContract as `0x${string}`, BigInt(tokenId), parseEther(price), imageUri, name],
      });

      // Reset form
      setNftContract("");
      setTokenId("");
      setPrice("");
      setImageUri("");
      setName("");

      onSuccess();
    } catch (error) {
      console.error("Error listing NFT:", error);
      alert("NFT listeleme hatası: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">NFT Deposit Et</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">NFT Kontrat Adresi</span>
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="input input-bordered"
              value={nftContract}
              onChange={e => setNftContract(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Token ID</span>
            </label>
            <input
              type="number"
              placeholder="1"
              className="input input-bordered"
              value={tokenId}
              onChange={e => setTokenId(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Fiyat (MONAD)</span>
            </label>
            <input
              type="number"
              step="0.001"
              placeholder="0.1"
              className="input input-bordered"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Resim URL</span>
            </label>
            <input
              type="url"
              placeholder="https://..."
              className="input input-bordered"
              value={imageUri}
              onChange={e => setImageUri(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">NFT Adı</span>
            </label>
            <input
              type="text"
              placeholder="Cool NFT #1"
              className="input input-bordered"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
              İptal
            </button>
            <button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? "Deposit Ediliyor..." : "Deposit Et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
