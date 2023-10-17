// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MarketplaceToken is ERC20 {
    uint256 initialSupply = 1000000000000000000000000;

    constructor() ERC20("MarketplaceToken", "MPT") {
        _mint(msg.sender, initialSupply);
    }
} 