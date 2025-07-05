// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MockOracle {
    mapping(bytes32 => uint256) private prices;
    
    event PriceUpdated(bytes32 indexed symbol, uint256 price);
    
    function setPrice(bytes32 symbol, uint256 price) external {
        prices[symbol] = price;
        emit PriceUpdated(symbol, price);
    }
    
    function getPrice(bytes32 symbol) external view returns (uint256) {
        return prices[symbol];
    }
} 