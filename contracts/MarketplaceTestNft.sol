// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MarketplaceTestNft is ERC721Enumerable, Ownable {
    using Strings for uint256;
    string private baseTokenURI;

    constructor() ERC721("MarketplaceTestNft", "MTN") Ownable(msg.sender) {
        baseTokenURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory _tokenURI = super.tokenURI(tokenId);
        return bytes(_tokenURI).length > 0 ? _tokenURI : string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}