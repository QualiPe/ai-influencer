// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract INFT is ERC721, Ownable {
    uint256 private _nextTokenId = 1;
    
    struct Agent {
        string name;
        string description;
        uint256 level;
        uint256 experience;
        bool isActive;
    }
    
    mapping(uint256 => Agent) public agents;
    address public oracle;
    
    event AgentCreated(uint256 indexed tokenId, string name, address indexed owner);
    event AgentLevelUp(uint256 indexed tokenId, uint256 newLevel);
    
    constructor(
        string memory name,
        string memory symbol,
        address _oracle
    ) ERC721(name, symbol) Ownable(msg.sender) {
        oracle = _oracle;
    }
    
    function createAgent(
        string memory name,
        string memory description
    ) external returns (uint256) {
        uint256 newTokenId = _nextTokenId++;
        
        _mint(msg.sender, newTokenId);
        
        agents[newTokenId] = Agent({
            name: name,
            description: description,
            level: 1,
            experience: 0,
            isActive: true
        });
        
        emit AgentCreated(newTokenId, name, msg.sender);
        return newTokenId;
    }
    
    function levelUpAgent(uint256 tokenId) external {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this agent");
        
        Agent storage agent = agents[tokenId];
        agent.level += 1;
        agent.experience += 100;
        
        emit AgentLevelUp(tokenId, agent.level);
    }
    
    function getAgent(uint256 tokenId) external view returns (Agent memory) {
        require(_exists(tokenId), "Agent does not exist");
        return agents[tokenId];
    }
    
    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
