// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable private owner;
    uint256 private listingPrice = 0.025 ether; // Matic/Eth are both in 10**18

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint256 indexed itemId,
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() {
        owner = payable(msg.sender);
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarteItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price should >= 1 wei");
        require(msg.value == listingPrice, "Price should >= listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, false);
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;

        require(msg.value == price, "Send asking price");

        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns(MarketItem[] memory) {
        uint256 totalItems = _itemIds.current();
        uint256 totalUnsoldItems = _itemIds.current() - _itemsSold.current();

        uint256 unsoldItemsIdx;
        MarketItem[] memory unsoldItems = new MarketItem[](totalUnsoldItems);

        for(uint256 i = 0; i < totalItems; i++) {
            if (idToMarketItem[i + 1].sold == true) {
                unsoldItems[unsoldItemsIdx++] = idToMarketItem[i + 1];
            }
        }

        return unsoldItems;
    }

    function fetchMyOwnNFTs() public view returns(MarketItem[] memory) {
        uint256 totalItems = _itemIds.current();
        uint256 myItemsCount;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                myItemsCount++;
            }
        }

        MarketItem[] memory myItems = new MarketItem[](myItemsCount);
        uint256 idx;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                myItems[idx++] = idToMarketItem[i];
            }
        }

        return myItems;
    }

    function fetchCreatedNFTs() public view returns(MarketItem[] memory) {
        uint256 totalItems = _itemIds.current();
        uint256 totalCreatedItems;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                totalCreatedItems++;
            }
        }

        MarketItem[] memory createdItems = new MarketItem[](totalCreatedItems);
        uint256 idx;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                createdItems[idx++] = idToMarketItem[i];
            }
        }

        return createdItems;
    }
}
