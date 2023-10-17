// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MarketplaceTestNft is ERC721 {
    string public baseURI;

    constructor() ERC721("MarketplaceTestNft", "MTN") {
        baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}
