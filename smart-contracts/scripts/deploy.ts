import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  const contractName = "NFTMarket";
  const NFTMarket = await ethers.getContractFactory(contractName);
  const nftMarketplace = await NFTMarket.deploy();
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  writeFileSync(
    `artifacts/contracts/${contractName}.sol/${contractName}.info.json`,
    JSON.stringify({ contractName, addr: nftMarketplace.address }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
