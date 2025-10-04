//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * NFT Marketplace Contract for Monad Testnet
 * Allows users to deposit NFTs, set prices, and transfer them
 * @author Freek Team
 */
contract NFTMarketplace is IERC721Receiver, Ownable, ReentrancyGuard {
    // Struct to store NFT information
    struct ListedNFT {
        address nftContract;
        uint256 tokenId;
        address owner;
        uint256 price; // Price in wei (Monad)
        bool isListed;
        bool isSold;
        string imageUri;
        string name;
    }

    // State Variables
    uint256 public totalListedNFTs;
    uint256 public totalSoldNFTs;
    
    // Mapping from listing ID to NFT info
    mapping(uint256 => ListedNFT) public listedNFTs;
    
    // Mapping from NFT contract + tokenId to listing ID
    mapping(address => mapping(uint256 => uint256)) public nftToListingId;
    
    // Mapping from user address to their listed NFTs
    mapping(address => uint256[]) public userListings;
    
    // Events
    event NFTListed(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        string imageUri,
        string name
    );
    
    event NFTSold(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );
    
    event NFTDelisted(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    // Constructor
    constructor() Ownable(msg.sender) {}

    /**
     * @dev List an NFT for sale
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID of the NFT
     * @param price Price in wei (Monad)
     * @param imageUri URI of the NFT image
     * @param name Name of the NFT
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string memory imageUri,
        string memory name
    ) external nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(nftToListingId[nftContract][tokenId] == 0, "NFT already listed");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner of this NFT");
        require(nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)), "Contract not approved");
        
        // Transfer NFT to this contract
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        
        totalListedNFTs++;
        uint256 listingId = totalListedNFTs;
        
        listedNFTs[listingId] = ListedNFT({
            nftContract: nftContract,
            tokenId: tokenId,
            owner: msg.sender,
            price: price,
            isListed: true,
            isSold: false,
            imageUri: imageUri,
            name: name
        });
        
        nftToListingId[nftContract][tokenId] = listingId;
        userListings[msg.sender].push(listingId);
        
        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price, imageUri, name);
    }

    /**
     * @dev Buy an NFT
     * @param listingId ID of the listing to buy
     */
    function buyNFT(uint256 listingId) external payable nonReentrant {
        ListedNFT storage listing = listedNFTs[listingId];
        require(listing.isListed, "NFT not listed");
        require(!listing.isSold, "NFT already sold");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.owner, "Cannot buy your own NFT");
        
        // Mark as sold
        listing.isSold = true;
        totalSoldNFTs++;
        
        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);
        
        // Transfer payment to seller
        (bool success,) = listing.owner.call{value: listing.price}("");
        require(success, "Payment transfer failed");
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess,) = msg.sender.call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit NFTSold(listingId, listing.nftContract, listing.tokenId, msg.sender, listing.price);
    }

    /**
     * @dev Delist an NFT (only by owner)
     * @param listingId ID of the listing to delist
     */
    function delistNFT(uint256 listingId) external nonReentrant {
        ListedNFT storage listing = listedNFTs[listingId];
        require(listing.owner == msg.sender, "Not the owner");
        require(listing.isListed, "NFT not listed");
        require(!listing.isSold, "NFT already sold");
        
        listing.isListed = false;
        
        // Transfer NFT back to owner
        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);
        
        emit NFTDelisted(listingId, listing.nftContract, listing.tokenId);
    }

    /**
     * @dev Get all listed NFTs (for marketplace display)
     * @return Array of ListedNFT structs
     */
    function getAllListedNFTs() external view returns (ListedNFT[] memory) {
        ListedNFT[] memory nfts = new ListedNFT[](totalListedNFTs);
        for (uint256 i = 1; i <= totalListedNFTs; i++) {
            nfts[i - 1] = listedNFTs[i];
        }
        return nfts;
    }

    /**
     * @dev Get listed NFTs by user
     * @param user Address of the user
     * @return Array of listing IDs
     */
    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }

    /**
     * @dev Get NFT details by listing ID
     * @param listingId ID of the listing
     * @return ListedNFT struct
     */
    function getNFTDetails(uint256 listingId) external view returns (ListedNFT memory) {
        return listedNFTs[listingId];
    }

    /**
     * @dev Required function to receive NFTs
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        (bool success,) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
