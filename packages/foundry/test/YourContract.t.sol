// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/YourContract.sol";

contract NFTMarketplaceTest is Test {
    NFTMarketplace public marketplace;

    function setUp() public {
        marketplace = new NFTMarketplace();
    }

    function testMarketplaceDeployment() public view {
        assert(marketplace.owner() != address(0));
        assert(marketplace.totalListedNFTs() == 0);
        assert(marketplace.totalSoldNFTs() == 0);
    }
}
