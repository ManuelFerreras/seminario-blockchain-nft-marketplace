// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract Marketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
        uint256 tokenId;
        address tokenAddress;
    }

    Listing[] public activeListings;

    IERC20 public tokenContract;  // The ERC20 token contract address

    // State Variables
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    constructor(address _tokenContractAddress) {
        tokenContract = IERC20(_tokenContractAddress);
    }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender, tokenId, nftAddress);
        activeListings.push(Listing(price, msg.sender, tokenId, nftAddress));
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        removeListingFromActiveListings(nftAddress, tokenId); 
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function removeListingFromActiveListings(address nftAddress, uint256 tokenId)
        private
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (
                activeListings[i].seller == msg.sender &&
                activeListings[i].tokenId == tokenId &&
                activeListings[i].tokenAddress == nftAddress
            ) {
                if (i != activeListings.length - 1) {
                    activeListings[i] = activeListings[activeListings.length - 1];
                }
                activeListings.pop();
                return;
            }
        }
    }

    function updateListingFromActiveListings(address nftAddress, uint256 tokenId, uint256 newPrice)
        private
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (
                activeListings[i].seller == msg.sender &&
                activeListings[i].tokenId == tokenId &&
                activeListings[i].tokenAddress == nftAddress
            ) {
                activeListings[i].price = newPrice;
            }
        }
    }

    function getAllActiveListings() external view returns (Listing[] memory) {
        return activeListings;
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external nonReentrant {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (tokenContract.allowance(msg.sender, address(this)) < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }

        s_proceeds[listedItem.seller] += listedItem.price;
        removeListingFromActiveListings(nftAddress, tokenId); 
        delete (s_listings[nftAddress][tokenId]);
        tokenContract.transferFrom(msg.sender, listedItem.seller, listedItem.price);
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (newPrice == 0) {
            revert PriceMustBeAboveZero();
        }

        s_listings[nftAddress][tokenId].price = newPrice;
        updateListingFromActiveListings(nftAddress, tokenId, newPrice);
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;

        tokenContract.transfer(msg.sender, proceeds);
    }

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }

    // Function modifiers
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
}
