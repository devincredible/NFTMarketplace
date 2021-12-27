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
    address test = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    IERC20 token;

    constructor(address marketplaceAddress, address ftkToken)
        ERC721("Metaverse", "METT")
    {
        contractAddress = marketplaceAddress;
        ftkTokenAddress = ftkToken;
        token = IERC20(ftkToken);
    }

    struct NFTItem {
        uint256 tokenId;
        address payable owner;
    }

    mapping(uint256 => NFTItem) private nftItem;

    function createToken(string memory tokenURI, uint256 amount)
        public
        returns (uint256)
    {
        uint256 erc20balance = token.balanceOf(msg.sender);
        require(amount <= erc20balance, "balance is low");
        token.transferFrom(msg.sender, totalWallet, amount);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        nftItem[newItemId] = NFTItem(newItemId, payable(msg.sender));
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function getOwnerNFT() public view returns (NFTItem[] memory) {
        uint256 currentTokenID = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < currentTokenID; i++) {
            if (nftItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        NFTItem[] memory items = new NFTItem[](itemCount);

        for (uint256 i = 0; i < currentTokenID; i++) {
            if (nftItem[i + 1].owner == msg.sender) {
                items[currentIndex] = nftItem[i + 1];
                currentIndex += 1;
            }
        }

        return items;
    }
}
