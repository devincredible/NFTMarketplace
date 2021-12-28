const hre = require("hardhat");
const fs = require('fs');

async function main() {

  const FTK = await hre.ethers.getContractFactory("FTK");
  const ftk = await FTK.deploy();
  await ftk.deployed();
  console.log("ftk deployed to:", ftk.address);

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy(ftk.address);
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address, ftk.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  export const ftkaddress = "${ftk.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
