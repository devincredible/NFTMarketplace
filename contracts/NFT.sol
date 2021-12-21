// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

address constant totalWallet = 0x09395E698CC8B90D6b7D882919E15085049cFbaE;

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    address ftkTokenAddress;
    IERC20 token;

    constructor(address marketplaceAddress, address ftkToken) ERC721("Metaverse", "METT") {
        contractAddress = marketplaceAddress;
        ftkTokenAddress = ftkToken;
        token = IERC20(ftkToken);
    }

    function createToken(string memory tokenURI, uint256 amount) public returns (uint) {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "balance is low");
        token.transfer(totalWallet, amount);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}