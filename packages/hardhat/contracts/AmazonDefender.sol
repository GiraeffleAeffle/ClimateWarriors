// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AmazonDefender is ERC721, Ownable {
  uint256 public tokenCounter;
  address public _owner;
  constructor () public ERC721 ("Amazon Defender", "AD"){
    tokenCounter = 0;
    _owner = msg.sender; 
  }

  function createCollectible(string memory tokenURI) public onlyOwner returns (uint256) {
    uint256 newItemId = tokenCounter;
    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    tokenCounter = tokenCounter + 1;
    return newItemId;
  }
}